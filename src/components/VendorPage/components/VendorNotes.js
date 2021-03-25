import React, { useState, useContext, useEffect } from "react";
import { API_ROOT_PATH } from "constants/api";
import styled from "styled-components";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { PermissionChecker } from "constants/permissionHelpers";
import NoteItem from "components/Profiles/components/notes/NoteItem";
import NoteInput from "components/Profiles/components/notes/NoteInput";
import noteInputStyle from "sharedComponents/ActionCreator/NoteInputStyle";
import notify from "notifications";
import { MENTION_REGEX } from "constants/regex";
import { ATSContainer } from "styles/PageContainers";

const VendorNotes = ({
  vendor,
  user,
  session,
  company,
  vendorId,
  teamMembers,
  notes,
  setNotes,
  //
}) => {
  const store = useContext(GlobalContext);
  const [currentNote, setCurrentNote] = useState("");
  const [addNote, setAddNote] = useState(undefined);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [relevantMembers, setRelevantMembers] = useState([]);

  const updateNote = async (note, newBody) => {
    if (note === "") return;
    if (sendingRequest) return;
    setSendingRequest(true);
    let matches = newBody.match(MENTION_REGEX);
    let mentionTags = [];
    let notifyAll = false;
    if (matches && matches.length > 0) {
      matches.map((match) => {
        let mentionTagArr = match.match(/[(][^)]*[)]/);
        let mentionTag = mentionTagArr[0].substring(
          1,
          mentionTagArr[0].length - 1
        );
        if (mentionTag !== "ALL") {
          mentionTags.push(mentionTag);
        } else {
          notifyAll = true;
        }
        return null;
      });
    }

    const payload = {
      body: newBody,
      company_id: company.id,
      recipient_vendor_id: vendorId,
    };
    if (mentionTags.length > 0) {
      payload.mention_tags = mentionTags;
    }
    if (notifyAll) {
      payload.team_assigned_notification = notifyAll;
    }
    const url =
      API_ROOT_PATH +
      `/v1/companies/${company.id}/company_notes/${note.note_id || note.id}`;
    let data = fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify(payload),
    }).then((response) => {
      setSendingRequest(false);
      if (response.ok) {
        return response.json();
      } else {
        return "err";
      }
    });
    return data;
  };

  const removeNote = (note, index) => {
    const url =
      API_ROOT_PATH +
      `/v1/companies/${company.id}/company_notes/${note.note_id || note.id}`;
    fetch(url, {
      method: "DELETE",
      headers: session,
    }).then((response) => {
      if (response.ok) {
        response.json().then(() => {
          let newVendorNotes = [...notes];
          newVendorNotes.splice(index, 1);
          setNotes(newVendorNotes);
        });
      } else {
        notify("danger", "There was an error deleting this note");
      }
    });
  };

  const saveVendorNotes = (note, callback) => {
    let trimmedNote = note.trim();
    if (note === "") {
      notify("danger", "Please fill in a valid note");
      return;
    }
    if (sendingRequest) return;
    setSendingRequest(true);
    let matches = note.match(MENTION_REGEX);
    let mentionTags = [];
    let notifyAll = false;
    if (matches && matches.length > 0) {
      matches.map((match) => {
        let mentionTagArr = match.match(/[(][^)]*[)]/);
        let mentionTag = mentionTagArr[0].substring(
          1,
          mentionTagArr[0].length - 1
        );
        if (mentionTag !== "ALL") {
          mentionTags.push(mentionTag);
        } else {
          notifyAll = true;
        }

        return null;
      });
    }
    const url = API_ROOT_PATH + `/v1/companies/${company.id}/company_notes`;
    const payload = {
      recipient_vendor_id: vendorId,
      author_id: session.id,
      author_name: user.name,
      title: `${vendor.name} notes`,
      body: trimmedNote,
      company_id: company.id,
    };

    if (mentionTags.length > 0) {
      payload.mention_tags = mentionTags;
    }
    if (notifyAll) {
      payload.team_assigned_notification = notifyAll;
    }
    fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(payload),
    }).then((response) => {
      setSendingRequest(false);
      if (response.ok) {
        response.json().then((note) => {
          // note.avatar = session.avatarUrl;
          let newVendorNotes = [...notes];
          newVendorNotes.unshift(note);
          setNotes(newVendorNotes);
          callback();
        });
      } else {
        notify("danger", "Creating vendor notes failed");
      }
    });
  };

  useEffect(() => {
    if (store.teamMembers) {
      setRelevantMembers(
        store.teamMembers.filter(
          (member) =>
            member.permission === "owner" || member.permission === "admin"
        )
      );
    }
  }, [store.teamMembers]);

  return (
    <ATSContainer>
      {!addNote && (
        <PermissionChecker type="edit">
          <AddNoteContainer>
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
            <button
              className="button button--default button--blue-dark"
              onClick={() => {
                saveVendorNotes(currentNote, () => {
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
      {(notes && notes.length) > 0 &&
        notes.map((note, index) => {
          return (
            <NoteItem
              key={`note_${index}`}
              note={note}
              index={index}
              updateNote={updateNote}
              removeNote={removeNote}
              newReply={() => {
                let username;
                teamMembers.map((member) =>
                  member.name === note.author_name
                    ? (username = member.username)
                    : null
                );
                setAddNote("internal");
                setCurrentNote(
                  username
                    ? `@[${note.author_name}](${username})`
                    : note.author.name
                );
              }}
              sendingRequest={sendingRequest}
              teamMembers={relevantMembers}
              canEdit={true}
            />
          );
        })}
    </ATSContainer>
  );
};

export default VendorNotes;

const AddNoteContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
