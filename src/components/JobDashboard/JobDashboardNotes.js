import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { InnerPageContainer, ATSContainer } from "styles/PageContainers";
import { PermissionChecker } from "constants/permissionHelpers";
import NoteItem from "components/Profiles/components/notes/NoteItem";
import NoteInput from "components/Profiles/components/notes/NoteInput";
import noteInputStyle from "sharedComponents/ActionCreator/NoteInputStyle";
import notify from "notifications";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import { fetchJobNotes } from "helpersV2/notes/job";
import {
  fetchCreateNote,
  fetchUpdateNote,
  fetchDeleteNote,
} from "helpersV2/notes/candidate";
import { prepareMentions } from "constants/noteMentions";
import EmptyTab from "components/Profiles/components/EmptyTab";
import Spinner from "sharedComponents/Spinner";
import { EmptyActivity } from "assets/svg/EmptyImages";
const SLICE_LENGTH = 10;

const JobDashboardNotes = ({ company, jobData, store, jobId }) => {
  const [notes, setNotes] = useState(undefined);
  const [addNote, setAddNote] = useState(undefined);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [replyToNote, setReplyToNote] = useState(undefined);
  const [currentNote, setCurrentNote] = useState("");
  const [
    noteType,
    // setNoteType
  ] = useState("internal");
  const [relevantMembers, setRelevantMembers] = useState([]);

  useEffect(() => {
    if (jobId && store.company && store.session && notes === undefined) {
      fetchJobNotes(store.session, store.company.id, {
        job_id: jobId,
        slice: [0, SLICE_LENGTH],
      }).then((res) => {
        if (!res.err) {
          setNotes(res);
        } else {
          setNotes(false);
          notify("danger", "Unable to fetch notes");
        }
      });
    }
  }, [notes, setNotes, jobId, store.company, store.session]);

  useEffect(() => {
    if (replyToNote) {
      setCurrentNote(replyToNote);
      setReplyToNote(undefined);
    }
  }, [replyToNote, setReplyToNote]);

  const loadMoreNotes = () => {
    fetchJobNotes(store.session, store.company.id, {
      job_id: jobId,
      slice: [0, SLICE_LENGTH],
    }).then((res) => {
      if (!res.err) {
        setNotes([...notes, ...res]);
      } else {
        notify("danger", "Unable to fetch notes");
      }
    });
  };

  const updateNote = async (note, newBody, callback) => {
    let trimmedNote = newBody.trim();
    if (trimmedNote === "") {
      notify("danger", "Please fill in a valid note");
      return;
    }
    if (sendingRequest) return;
    setSendingRequest(true);
    let { notifyAll, mentionTags } = prepareMentions(newBody);

    const payload = {
      // tn_profile_id: tnId,
      body: trimmedNote,
      company_id: store.company.id,
      mention_tags: mentionTags?.length > 0 ? mentionTags : undefined,
      team_assigned_notification: notifyAll || undefined,
    };
    fetchUpdateNote(store.session, payload, note.note_id || note.id)
      .then((res) => callback(res))
      .finally(() => setSendingRequest(false));
  };

  const removeNote = (note, index) => {
    fetchDeleteNote(store.session, note.note_id || note.id).then((res) => {
      if (!res.err) {
        let notesCopy = [...notes];
        notesCopy.splice(index, 1);
        setNotes(notesCopy);
      } else {
        notify("danger", res);
      }
    });
  };

  const newReply = (note) => {
    let username;
    store.teamMembers.map((member) =>
      member.professional_id === note.author_id
        ? (username = member.username)
        : null
    );
    setAddNote("internal");
    setReplyToNote(username ? `@[${note.author_name}](${username})` : "");
    let textArea = document.querySelector(".mention-text-area__input");
    if (textArea) {
      textArea.focus();
    }
  };

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
      author_name: store.user.name,
      body: trimmedNote,
      title: `${jobData.title} notes`,
      mention_tags: mentionTags?.length > 0 ? mentionTags : undefined,
      team_assigned_notification: notifyAll || undefined,
      company_id: store.company.id,
      //job props
      job_id: jobId,
      client_id: noteType === "client" ? jobData?.company?.id : undefined,
      client_note: noteType === "client" && jobData?.company?.id ? true : false,
    };

    fetchCreateNote(store.session, payload, jobId, "JobPost")
      .then((res) => {
        if (!res.err) {
          notify("info", "Note succesfully created");
          setCurrentNote("");
          setNotes([res, ...notes]);
        } else {
          notify("danger", res);
        }
      })
      .finally(() => {
        setSendingRequest(false);
      });
  };

  useEffect(() => {
    if (store.teamMembers) {
      setRelevantMembers(
        store.teamMembers.filter(
          (member) =>
            member.permission === "owner" ||
            member.permission === "admin" ||
            member.roles.includes("recruiter") ||
            member.roles.includes("hiring_manager")
        )
      );
    }
  }, [store.teamMembers]);

  return (
    <>
      <InnerPageContainer>
        <ATSContainer>
          {!addNote &&
            !(
              (company.invited_by_agency || company.invited_by_employer) &&
              company.trial !== "upgraded"
            ) && (
              <PermissionChecker
                type="edit"
                valid={{ recruiter: true, hiring_manager: true }}
              >
                <AddNoteContainer className="leo-flex-center-end">
                  <button
                    className="button button--default button--blue-dark"
                    onClick={() => {
                      setAddNote(true);
                    }}
                  >
                    Add Note
                  </button>
                </AddNoteContainer>
              </PermissionChecker>
            )}
          {addNote && (
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <div
                className="leo-flex"
                style={{
                  justifyContent: "flex-end",
                  marginBottom: "10px",
                }}
              >
                {/*jobData?.company?.id !== company?.id && (
                  <StyledSelect
                    className="form-control form-control-select"
                    onChange={(e) => setNoteType(e.target.value)}
                  >
                    <option value="internal">Internal</option>
                    <option value="client">Client</option>
                  </StyledSelect>
                )*/}

                <button
                  className="button button--default button--blue-dark"
                  onClick={() => {
                    saveNote(currentNote, () => {
                      setAddNote(undefined);
                      setCurrentNote("");
                    });
                  }}
                  style={{ marginRight: "10px" }}
                >
                  Submit
                </button>
                <button
                  className="button button--default button--grey"
                  onClick={() => {
                    setCurrentNote("");
                    setAddNote(undefined);
                  }}
                >
                  Cancel
                </button>
              </div>
              <NoteInput
                members={relevantMembers}
                currentNote={currentNote}
                setCurrentNote={setCurrentNote}
                store={store}
                customStyle={noteInputStyle}
              />
            </div>
          )}
          {!notes ? (
            <Spinner />
          ) : (
            <InfiniteScroller
              fetchMore={loadMoreNotes}
              hasMore={
                notes && notes.length !== 0 && notes.length % SLICE_LENGTH === 0
                  ? true
                  : false
              }
              dataLength={notes?.length || 0}
            >
              {(notes && notes.length) > 0 &&
                notes.map((note, index) => {
                  return (
                    <NoteItem
                      key={`note_${index}`}
                      note={note}
                      index={index}
                      updateNote={updateNote}
                      removeNote={removeNote}
                      newReply={newReply}
                      sendingRequest={sendingRequest}
                      teamMembers={relevantMembers}
                      canEdit={true}
                    />
                  );
                })}
            </InfiniteScroller>
          )}
          {notes && notes.length === 0 && (
            <EmptyTab
              data={notes}
              title={
                !(
                  (company.invited_by_agency || company.invited_by_employer) &&
                  company.trial !== "upgraded"
                ) &&
                (store.role.role_permissions.owner ||
                  store.role.role_permissions.recruiter ||
                  store.role.role_permissions.hiring_manager)
                  ? "Add a note"
                  : null
              }
              copy={`There is no notes for this job yet.`}
              image={<EmptyActivity />}
            />
          )}
        </ATSContainer>
      </InnerPageContainer>
    </>
  );
};

const AddNoteContainer = styled.div`
  margin-bottom: 20px;
`;

// const StyledSelect = styled.select`
//   width: 150px;
//   margin-right: 10px;
//   margin-bottom: 0px;
// `;

export default JobDashboardNotes;
