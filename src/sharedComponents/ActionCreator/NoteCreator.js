import React, { useState, useEffect } from "react";
import ActionCreatorFooter from "sharedComponents/ActionCreator/ActionCreatorFooter";
import NoteInput from "components/Profiles/components/notes/NoteInput";
import noteInputStyle from "sharedComponents/ActionCreator/NoteInputStyle";
import notify from "notifications";
import styled from "styled-components";
import { fetchCreateNote } from "helpersV2/notes/candidate";
import { prepareMentions } from "constants/noteMentions";

const NoteCreator = ({
  setActionType,
  store,
  profileName,
  source,
  notesSource,
  sourceId,
  //candidate profile
  professionalId,
  tnId,
  //job props
  queryParams,
  //reply to note
  replyToNote,
  setReplyToNote,
  pushNote,
}) => {
  const [currentNote, setCurrentNote] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  const [noteType, setNoteType] = useState("internal");
  const [relevantMembers, setRelevantMembers] = useState([]);

  useEffect(() => {
    if (replyToNote) {
      setCurrentNote(replyToNote);
      setReplyToNote(undefined);
    }
  }, [replyToNote, setReplyToNote]);

  const saveNote = () => {
    let trimmedNote = currentNote.trim();
    if (trimmedNote === "") {
      notify("danger", "Please fill in a valid note");
      return;
    }
    if (sendingRequest) return;
    setSendingRequest(true);
    let { notifyAll, mentionTags } = prepareMentions(currentNote);
    const payload = {
      author_id: store.session.id,
      author_name: store.user?.name,
      body: trimmedNote,
      title: `${profileName} notes`,
      mention_tags: mentionTags?.length > 0 ? mentionTags : undefined,
      team_assigned_notification: notifyAll || undefined,
      company_id: store.company.id,

      // candidate profile props
      professional_id: professionalId,
      tn_profile_id: tnId,

      //job props
      job_id: queryParams?.job_id,
      applicant_id: queryParams?.applicant_id,
      client_id: noteType === "client" ? queryParams?.client_id : undefined,
      client_note:
        noteType === "client" && queryParams?.client_id ? true : false,
    };

    fetchCreateNote(store.session, payload, sourceId, notesSource || source)
      .then((res) => {
        if (!res.err) {
          notify("info", "Note succesfully created");
          setCurrentNote("");
          if (pushNote) {
            pushNote(res);
          }
        } else {
          notify("danger", res);
        }
      })
      .finally(() => {
        setSendingRequest(false);
      });
  };

  useEffect(() => {
    if (store.teamMembers && source) {
      if (source === "candidate") {
        setRelevantMembers(
          store.teamMembers.filter(
            (member) =>
              member.permission === "owner" ||
              member.permission === "admin" ||
              member.roles.includes("recruiter") ||
              member.roles.includes("hiring_manager")
          )
        );
      } else if (
        source === "deal" ||
        source === "contact" ||
        source === "client"
      ) {
        setRelevantMembers(
          store.teamMembers.filter(
            (member) =>
              member.permission === "owner" ||
              member.permission === "admin" ||
              member.roles.includes("business")
          )
        );
      }
    }
  }, [source, store.teamMembers]);

  return (
    <div>
      <NoteInput
        members={relevantMembers}
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
        store={store}
        customStyle={noteInputStyle}
      />
      <Wrapper>
        {queryParams?.job_id && queryParams?.client_id && (
          <>
            <select
              className="form-control form-control-select"
              onChange={(e) => setNoteType(e.target.value)}
            >
              <option value={"internal"}>Internal</option>
              <option value={"client"}>Client</option>
            </select>
          </>
        )}
        <ActionCreatorFooter
          setActionType={setActionType}
          actionName="Create"
          confirmAction={saveNote}
          sendingRequest={sendingRequest}
        />
      </Wrapper>
    </div>
  );
};

export default NoteCreator;

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  select {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    max-width: 150px;
  }

  .buttons-container {
    justify-content: flex-end;
    display: flex;
    margin-bottom: 10px;
  }
`;
