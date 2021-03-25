import React, { useState, useEffect } from "react";
import spacetime from "spacetime";
import notify from "notifications";
import styled from "styled-components";

import ActionCreatorFooter from "sharedComponents/ActionCreator/ActionCreatorFooter";
import "components/Calendar/styles/datepciker.scss";
import { createCall } from "helpersV2/calls";
import { SelectsWrapper } from "sharedComponents/ActionCreator/SharedComponents";
import {
  ContactedSelect,
  DateSelect,
  OutcomeSelect,
  TimeSelect,
} from "sharedComponents/ActionCreator/selectors";

const CallCreator = ({
  setActionType,
  store,
  clientCompany,
  contacts,
  candidates,
  source,
  sourceId,
  pushCall,
}) => {
  const [callText, setCallText] = useState("");
  const [outcome, setOutcome] = useState("No answer");
  const [contactables, setContactables] = useState(undefined);
  const [contactedIndex, setContactedIndex] = useState(undefined);
  const [selectedDate, setSelectedDate] = useState(spacetime.now());
  const [selectedTime, setSelectedTime] = useState(
    spacetime.now().format("{hour-24-pad}:{minute-pad}")
  );
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    if (contacts || candidates) {
      let provisional = [];
      if (candidates && candidates.length > 0) {
        candidates.map((cand) =>
          provisional.push({
            value: cand.name,
            contacted_type: "candidate",
            contacted_id: cand.ptn_id,
          })
        );
      }
      if (contacts && contacts.length > 0) {
        contacts.map((cont) =>
          provisional.push({
            value: cont.name,
            contacted_type: "contact",
            contacted_id: cont.id,
          })
        );
      }
      if (provisional.length > 0) {
        setContactedIndex(0);
      }
      setContactables(provisional);
    }
  }, [contacts, candidates]);

  const createCallEvent = () => {
    setSendingRequest(true);
    let date = selectedDate.clone();
    let time = selectedTime.split(":");
    date = date.hour(Number(time[0])).minute(Number(time[1]));
    // if (contactedIndex === undefined) {
    //   return notify(
    //     "danger",
    //     "You must have a contact selected to log the call"
    //   );
    // }
    let body = {
      outcome: outcome,
      date_actioned: date.format("{iso-utc}"),
      agency_id: store.company.id,
      client_id: clientCompany?.client_id || clientCompany?.id,
      source: source,
      source_id: sourceId,
      description: callText,
      contacted_type: contactables[contactedIndex]?.contacted_type,
      contacted_id: contactables[contactedIndex]?.contacted_id,
    };
    createCall(store.session, body)
      .then((res) => {
        if (!res.err) {
          setCallText("");
          setOutcome("No answer");
          setSelectedDate(spacetime.now());
          setSelectedTime(spacetime.now().format("{hour-24-pad}:{minute-pad}"));
          if (pushCall) {
            pushCall(res);
          }
          notify("info", "Call succesfully created");
        } else {
          notify("danger", res);
        }
      })
      .finally(() => setSendingRequest(false));
  };

  return (
    <div>
      <ContactContainer>
        <SelectsWrapper>
          <ContactedSelect
            contactedIndex={contactedIndex}
            setContactedIndex={setContactedIndex}
            contactables={contactables}
            canEdit={true}
          />
          <OutcomeSelect
            outcome={outcome}
            setOutcome={setOutcome}
            canEdit={true}
          />
          <DateSelect
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            canEdit={true}
          />
          <TimeSelect
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            canEdit={true}
          />
        </SelectsWrapper>
        <textarea
          // className="form-control"
          rows="3"
          name="call-text-box"
          placeholder="Describe your call..."
          onChange={(e) => setCallText(e.target.value)}
          value={callText}
        />
      </ContactContainer>
      <ActionCreatorFooter
        setActionType={setActionType}
        actionName="Create"
        confirmAction={createCallEvent}
        sendingRequest={sendingRequest}
      />
    </div>
  );
};

export default CallCreator;

const ContactContainer = styled.div`
  background: #fafafa;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 15px;

  textarea {
    background-color: transparent;
    border: 0;
    font-size: 14px;
    margin: 0 !important;
    padding: 0;
    width: 100%;

    &:focus {
      background: transparent !important;
      border-color: transparent !important;
    }
  }
`;
