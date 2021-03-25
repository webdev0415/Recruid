import React, { useState, useEffect, useContext } from "react";
import spacetime from "spacetime";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ROUTES } from "routes";
import notify from "notifications";

import GlobalContext from "contexts/globalContext/GlobalContext";
import AvatarIcon from "sharedComponents/AvatarIcon";
import NoteInput from "components/Profiles/components/notes/NoteInput";
import { generateBody } from "constants/noteMentions";
import { AWS_CDN_URL } from "constants/api";

const NoteItem = ({
  note,
  index,
  updateNote,
  removeNote,
  newReply,
  sendingRequest,
  teamMembers,
  canEdit,
}) => {
  const store = useContext(GlobalContext);
  const [editNote, setEditNote] = useState(false);
  const [deleteNote, setDeleteNote] = useState(false);
  const [noteBody, setNoteBody] = useState(note.body);

  useEffect(() => {
    setEditNote(false);
    setDeleteNote(false);
    setNoteBody(note.body);
  }, [note.body]);

  const confirmDelete = () => {
    if (editNote) return;
    removeNote(note, index);
  };

  const saveNote = () => {
    if (!editNote) {
      setEditNote(true);
    } else {
      updateNote(note, noteBody, (res) => {
        if (!res.err) {
          note.body = noteBody;
          setEditNote(false);
          notify("info", "Note successfully edited");
        } else {
          notify("danger", "There was an error updating this note");
          setNoteBody(note.body);
          setEditNote(false);
        }
      });
    }
  };

  return (
    <>
      <Note className="leo-flex">
        <div>
          <AvatarIcon name={note.author_name} imgUrl={note.avatar} size={30} />
        </div>
        <NoteDetails className="leo-flex">
          <div>
            <NoteHeader>
              <NoteHeaderTitle>
                <span className="author">{note.author_name}</span>
                {note.job_title && note.job_slug && (
                  <div className="job">
                    <img src={`${AWS_CDN_URL}/icons/JobIcon.svg`} alt="" />
                    <NoteJobLink
                      className="job"
                      to={ROUTES.JobDashboard.url(
                        store.company.mention_tag,
                        note.job_slug
                      )}
                    >
                      {note.job_title}
                    </NoteJobLink>
                    {note.client_note && note.client_id !== store.company.id ? (
                      <ClientTag>Client</ClientTag>
                    ) : note.client_note &&
                      note.client_id === store.company.id ? (
                      <ClientTag>Agency</ClientTag>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </NoteHeaderTitle>
            </NoteHeader>
            {!editNote ? (
              <NoteBody>
                <div
                  dangerouslySetInnerHTML={{
                    __html: generateBody(note.body),
                  }}
                ></div>
                {note.rating && (
                  <>
                    {note.rating === 1 ? (
                      <img
                        src={`${AWS_CDN_URL}/icons/Rating1SVG.svg`}
                        alt="Rating 1"
                      />
                    ) : note.rating === 2 ? (
                      <img
                        src={`${AWS_CDN_URL}/icons/Rating2SVG.svg`}
                        alt="Rating 2"
                      />
                    ) : note.rating === 3 ? (
                      <img
                        src={`${AWS_CDN_URL}/icons/Rating3SVG.svg`}
                        alt="Rating 3"
                      />
                    ) : note.rating === 4 ? (
                      <img
                        src={`${AWS_CDN_URL}/icons/Rating4SVG.svg`}
                        alt="Rating 4"
                      />
                    ) : note.rating === 5 ? (
                      <img
                        src={`${AWS_CDN_URL}/icons/Rating5SVG.svg`}
                        alt="Rating 5"
                      />
                    ) : (
                      ""
                    )}
                  </>
                )}
              </NoteBody>
            ) : (
              <NoteInput
                members={teamMembers}
                currentNote={noteBody}
                setCurrentNote={setNoteBody}
                store={store}
              />
            )}
          </div>
          <NoteFooter>
            <span>
              {spacetime(new Date(note.created_at)).format(
                "{time} {date} {month}, {year}"
              )}
            </span>
            {canEdit && (
              <>
                <StyledNoteButton
                  className="blue"
                  onClick={() => newReply(note)}
                  style={{ marginLeft: 15 }}
                >
                  Reply
                </StyledNoteButton>
                <StyledNoteButton onClick={saveNote} disabled={sendingRequest}>
                  {!editNote ? "Edit" : "Save"}
                </StyledNoteButton>
                <StyledNoteButton
                  onClick={() => {
                    if (editNote) return;
                    setDeleteNote(true);
                  }}
                >
                  Delete
                </StyledNoteButton>
              </>
            )}
          </NoteFooter>
        </NoteDetails>
      </Note>
      {deleteNote && (
        <DeleteOptions
          setDeleteNote={setDeleteNote}
          confirmDelete={confirmDelete}
        />
      )}
    </>
  );
};

const DeleteOptions = ({ setDeleteNote, confirmDelete }) => (
  <NoteWarning>
    <p>Are you sure you want to delete this note?</p>
    <div>
      <button
        className="button button--default button--primary"
        onClick={confirmDelete}
      >
        Confirm
      </button>
      <button
        className="button button--default button--grey"
        style={{ marginLeft: "15px" }}
        onClick={() => setDeleteNote(false)}
      >
        Cancel
      </button>
    </div>
  </NoteWarning>
);

export default NoteItem;

const Note = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  font-size: 14px;
  margin-bottom: 10px;
  padding: 15px;
`;

const NoteDetails = styled.div`
  flex-direction: column;
  margin-left: 15px;
  width: 100%;

  p {
    margin-bottom: 0;
  }
`;

const NoteHeader = styled.div`
  margin-bottom: 2px;

  .author {
    font-weight: 500;
  }
`;

const NoteHeaderTitle = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;

  .job {
    align-items: center;
    color: #74767b;
    display: flex;
    font-size: 12px;
    line-height: 1;

    button:hover {
      color: #2a3744;
      text-decoration: underline;
    }

    svg,
    img {
      margin-right: 5px;
    }
  }
`;

const NoteFooter = styled.div`
  color: #74767b;
  display: flex;
  font-size: 12px;
  line-height: 1;
  margin-top: 5px;

  button {
    line-height: 1;
  }
`;

const StyledNoteButton = styled.button`
  color: #74767b;

  &:hover {
    color: #2a3744;
    text-decoration: underline;
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const NoteJobLink = styled(Link)``;

const NoteWarning = styled.div`
  margin-bottom: 20px;
  padding: 20px 0;
  text-align: center;

  p {
    margin-bottom: 20px;
  }
`;

const NoteBody = styled.div`
  white-space: pre-wrap;
  span {
    display: inline;
  }
`;

const ClientTag = styled.span`
  background: rgba(42, 55, 68, 0.2);
  border-radius: 4px;
  color: #2a3744;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-left: 10px;
  padding: 3px 5px;
  text-transform: uppercase;
`;
