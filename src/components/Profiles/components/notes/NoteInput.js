import React from "react";
import styled from "styled-components";
import { MentionsInput, Mention } from "react-mentions";
import { extractMentions } from "helpers/helper";
import { ALL_MENTION_TAG } from "components/Profiles/components/notes/tags";
import AvatarIcon from "sharedComponents/AvatarIcon";
import defaultStyle from "./defaultStyle";
import defaultMentionStyle from "./defaultMentionStyle";

const NoteInput = ({
  members,
  currentNote,
  setCurrentNote,
  store,
  customStyle,
}) => {
  return (
    <NoteInputContainer>
      {members?.length > 0 ? (
        <MentionsInput
          className="mention-text-area"
          key={1}
          placeholder="Click here to add a note. Use @name to mention someone."
          style={customStyle || defaultStyle}
          value={currentNote}
          onChange={(e) => {
            setCurrentNote(e.target.value);
          }}
        >
          <Mention
            trigger="@"
            data={extractMentions([ALL_MENTION_TAG, ...members])}
            appendSpaceOnAdd={true}
            displayTransform={(display) => `@${display}`}
            renderSuggestion={(tag) => {
              let member;
              members.map((mm) =>
                mm.username === tag.id ? (member = mm) : null
              );
              if (tag.id === "ALL") {
                return (
                  <AllTeamMention className="leo-flex leo-align-start">
                    <AvatarIcon
                      name={store.company.name}
                      imgUrl={store.company.avatar_url}
                      size={20}
                    />
                    <div className="wrapper leo-flex leo-relative">
                      Your Team
                      <span>Notify all members working on this candidate</span>
                    </div>
                  </AllTeamMention>
                );
              }
              return (
                <MemberMention className="leo-flex-center">
                  <AvatarIcon
                    name={member.name}
                    imgUrl={member.avatar}
                    size={20}
                  />
                  <span>{tag.display}</span>
                </MemberMention>
              );
            }}
            style={defaultMentionStyle}
          />
        </MentionsInput>
      ) : (
        <StyledNoteInput
          placeholder="Type something..."
          type="text"
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          rows="4"
        />
      )}
    </NoteInputContainer>
  );
};

const NoteInputContainer = styled.div`
  span {
    display: inline;
  }
`;

const StyledNoteInput = styled.textarea`
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  color: #2c2c2c;
  font-size: 15px;
  width: 100%;
  padding: 5px;
`;

const MemberMention = styled.div`
  span {
    font-size: 14px;
    font-weight: 400;
    margin-left: 8px;
  }
`;

const AllTeamMention = styled.div`
  .wrapper {
    flex-direction: column;
    margin-left: 8px;
    top: -3px;
  }

  div {
    span {
      font-size: 10px;
    }
  }
`;

export default NoteInput;
