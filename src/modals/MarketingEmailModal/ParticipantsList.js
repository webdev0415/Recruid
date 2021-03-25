import React from "react";

import styled from "styled-components";
// import { Table, TableRow, TableCell } from "styles/Table";
import Checkbox from "sharedComponents/Checkbox";
import AvatarIcon from "sharedComponents/AvatarIcon";

const ParticipantsList = ({
  participants,
  selectParticipant,
  setView,
  source,
  selectedJob,
}) => {
  return (
    <>
      <TableScroll>
        <div>
          <div>
            {participants &&
              participants.map((participant, index) => {
                const name =
                  source === "client"
                    ? participant.company_name
                    : participant.name || participant.talent_name;
                const avatar = participant.avatar || participant.avatar_url;
                return (
                  <RecipientRow key={`email-row-${index}`}>
                    <RecipientDetails>
                      <Checkbox
                        style={{ marginRight: 20 }}
                        active={participant.selected}
                        onClick={() => selectParticipant(index)}
                      />
                      <AvatarIcon name={name} imgUrl={avatar} size={30} />
                      <RecipientName>{name}</RecipientName>
                      {source !== "client" && (
                        <EmailSpan>{participant.email}</EmailSpan>
                      )}
                    </RecipientDetails>
                    <RecipientExtra>
                      {source === "client" && participant.location}
                      {source === "contact" && participant.title}
                      {source === "candidate" &&
                      participant.localizations &&
                      participant.localizations.length > 0 ? (
                        participant.localizations.length !== 1 ? (
                          <span>
                            {participant.localizations[0].location.name} + 1
                          </span>
                        ) : (
                          <span>
                            {participant.localizations[0].location.name}
                          </span>
                        )
                      ) : (
                        ""
                      )}
                    </RecipientExtra>
                  </RecipientRow>
                );
              })}
          </div>
        </div>
      </TableScroll>
      <Footer>
        <div>
          <button
            type="button"
            className="button button--default button--grey-light"
            onClick={() => {
              if (selectedJob) {
                setView("select-job");
              } else {
                setView("initial");
              }
            }}
          >
            Back
          </button>
          <button
            type="button"
            className="button button--default button--primary"
            onClick={() => setView("final")}
          >
            Next
          </button>
        </div>
      </Footer>
    </>
  );
};

export default ParticipantsList;

const TableScroll = styled.div`
  max-height: 500px;
  min-height: 200px;
  overflow: auto;
  margin: 0px 30px;
  padding-bottom: 10px;
`;

const Footer = styled.div`
  padding-top: 30px;
  border-top: solid #eee 1px;

  div {
    button:first-of-type {
      margin-right: 10px;
    }
  }
`;

const RecipientName = styled.div`
  color: #1e1e1e;
  font-weight: 500;
  margin-left: 10px;
`;

const RecipientRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
`;

const RecipientDetails = styled.div`
  align-items: center;
  display: flex;
`;

const RecipientExtra = styled.div`
  color: #74767b;
`;

const EmailSpan = styled.span`
  color: #74767b;
  display: inline;
  font-weight: 400;
  margin-left: 5px;
`;
