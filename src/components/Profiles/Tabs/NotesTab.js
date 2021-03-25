import React, { useContext, useState, useEffect } from "react";
import notify from "notifications";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
// import EmptyTab from "components/Profiles/components/EmptyTab";
import NoteItem from "components/Profiles/components/notes/NoteItem";
// import NoteInput from "components/Profiles/components/notes/NoteInput";

import {
  // fetchCreateNote,
  fetchUpdateNote,
  fetchDeleteNote,
} from "helpersV2/notes/candidate";
import { prepareMentions } from "constants/noteMentions";

import GlobalContext from "contexts/globalContext/GlobalContext";
// import {AWS_CDN_URL} from "constants/api";

const NotesTab = ({
  notes,
  setNotes,
  hasMoreNotes,
  fetchMoreNotes,
  setAddNote,
  source,
  //candidate profile
  tnId,
  //reply to note
  setReplyToNote,
  //children
  children,
  canEdit,
}) => {
  const store = useContext(GlobalContext);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [relevantMembers, setRelevantMembers] = useState([]);

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
      tn_profile_id: tnId,
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

  useEffect(() => {
    if (store.teamMembers && source) {
      if (source === "ProfessionalTalentNetwork") {
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
        source === "Deal" ||
        source === "DealContact" ||
        source === "Employer"
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
    <>
      <InfiniteScroller
        fetchMore={fetchMoreNotes}
        hasMore={hasMoreNotes}
        dataLength={notes?.length || 0}
      >
        {children}
        {notes &&
          notes.length > 0 &&
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
                canEdit={canEdit}
              />
            );
          })}
      </InfiniteScroller>
    </>
  );
};

export default NotesTab;
