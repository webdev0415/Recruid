import React, { useState, useEffect } from "react";
import styled from "styled-components";
import spacetime from "spacetime";
import {
  ContactedSelect,
  DateSelect,
  OutcomeSelect,
  TimeSelect,
} from "sharedComponents/ActionCreator/selectors";
import { BodyContainer } from "components/Profiles/components/ProfileComponents";
import { SelectsWrapper } from "sharedComponents/ActionCreator/SharedComponents";
import notify from "notifications";
import { editCall, deleteCall } from "helpersV2/calls";

// import EmptyTab from "components/Profiles/components/EmptyTab";
import AvatarIcon from "sharedComponents/AvatarIcon";
import ConfirmModalV2 from "modals/ConfirmModalV2";
import {
  ActivityItem,
  ActivityDate,
} from "components/Profiles/components/ProfileComponents.js";
import ActionItemMenu from "sharedComponents/ActionItemMenu";
// import {AWS_CDN_URL} from "constants/api";

const CallsTab = ({
  calls,
  setCalls,
  store,
  contacts,
  candidates,
  canEdit,
}) => {
  const [contactables, setContactables] = useState(undefined);
  const [callToDelete, setCallToDelete] = useState(undefined);

  const deleteCallMethod = () => {
    deleteCall(store.session, store.company.id, calls[callToDelete].id).then(
      (res) => {
        if (!res.err) {
          notify("info", "Call succesfully deleted");
          let callsCopy = [...calls];
          callsCopy.splice(callToDelete, 1);
          setCalls(callsCopy);
          setCallToDelete(undefined);
        } else {
          notify("danger", "Unable to delete call");
        }
      }
    );
  };

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
      setContactables(provisional);
    }
  }, [contacts, candidates]);

  return (
    <>
      {/*}<EmptyTab
      data={calls}
      title={"This company has no activities."}
      copy={"Go message them or something!"}
      image={<img src={<EmptyActivity />}
      action={""}
    >*/}

      <CustomBodyContainer>
        {calls &&
          calls.map((call, index) => (
            <>
              {call && (
                <CallItem
                  call={call}
                  contactables={contactables}
                  setContactables={setContactables}
                  calls={calls}
                  setCalls={setCalls}
                  store={store}
                  ix={index}
                  canEdit={canEdit}
                  key={`call-wrapper-${index}`}
                  setCallToDelete={setCallToDelete}
                />
              )}
            </>
          ))}
      </CustomBodyContainer>
      {callToDelete !== undefined && (
        <>
          <ConfirmModalV2
            id="confirm-delete-call"
            show={true}
            hide={() => setCallToDelete(undefined)}
            header="Delete this call"
            text="Are you sure you want to delete this call?"
            actionText="Delete"
            actionFunction={deleteCallMethod}
          />
        </>
      )}
      {/*}</EmptyTab>*/}
    </>
  );
};

export default CallsTab;

const CallItem = ({
  call,
  ix,
  contactables,
  calls,
  setCalls,
  store,
  canEdit,
  setCallToDelete,
}) => {
  const [outcome, setOutcome] = useState(undefined);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState(undefined);
  const [contactedIndex, setContactedIndex] = useState(undefined);
  const [ogContactIndex, setOgContactIndex] = useState(undefined);
  const [missingContactable, setMissingContactable] = useState(undefined);
  const ogDate = spacetime(new Date(call.date_actioned));
  const [editing, setEditing] = useState(false);
  const [callBody, setCallBody] = useState(undefined);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (contactables) {
      let index = -1;
      contactables.map((cont, ix) =>
        cont.contacted_id === call.contacted.contacted_id ? (index = ix) : null
      );
      if (index !== -1) {
        setOgContactIndex(index);
      } else {
        setMissingContactable({
          ...call.contacted,
          value: call.contacted.name,
        });
        setOgContactIndex(0);
      }
    }
  }, [contactables, call]);

  useEffect(() => {
    if (
      outcome ||
      selectedDate ||
      selectedTime ||
      contactedIndex !== undefined
    ) {
      let date;
      if (selectedDate || selectedTime) {
        date = selectedDate
          ? selectedDate.clone()
          : spacetime(new Date(call.date_actioned));
        if (selectedTime) {
          let time = selectedTime.split(":");
          date = date.hour(Number(time[0])).minute(Number(time[1]));
        }
      }
      let newCall = {
        agency_id: call.agency_id,
        client_id: call.client_id,
        description: call.description,
        outcome: outcome || call.outcome,
        date_actioned: date ? date.format("{iso-utc}") : call.date_actioned,
        contacted_id:
          contactedIndex !== undefined
            ? contactables[contactedIndex]?.contacted_id
            : call.contacted.contacted_id,
        contacted_type:
          contactedIndex !== undefined
            ? contactables[contactedIndex]?.contacted_type
            : call.contacted.contacted_type,
      };
      editCall(store.session, call.id, newCall).then((res) => {
        if (!res.err) {
          setOutcome(undefined);
          setSelectedDate(undefined);
          setSelectedTime(undefined);
          setContactedIndex(undefined);
          setOgContactIndex(undefined);
          notify("info", "Call succesfully edited");
          let callsCopy = [...calls];
          callsCopy[ix] = { ...res, contacted: res.contacted };
          setCalls(callsCopy);
        } else {
          notify("danger", res);
        }
      });
      //save new call
    }
  }, [outcome, selectedDate, selectedTime, contactedIndex]);

  useEffect(() => {
    if (editing) {
      setCallBody(call.description);
    } else {
      setCallBody(undefined);
    }
  }, [editing]);

  const saveEdit = () => {
    let newCall = {
      ...call,
    };
    if (callBody && callBody !== call.description) {
      newCall.description = callBody;
    }
    if (newCall.description) {
      editCall(store.session, call.id, newCall).then((res) => {
        if (!res.err) {
          setEditing(false);
          notify("info", "Call succesfully edited");
          let callsCopy = [...calls];
          callsCopy[ix] = { ...res, contacted: res.contacted };
          setCalls(callsCopy);
        } else {
          notify("danger", res);
        }
      });
    } else {
      setEditing(false);
    }
  };

  return (
    <CallWrapper
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
    >
      <CustomActivityItem>
        <CallTop>
          <AvatarIcon
            name={call.created_by_name}
            imgUrl={call.created_by_avatar}
            size={30}
          />
          <div className="text-container">
            <h5>Logged Call</h5>
          </div>
          <ActivityDate className="date-container">
            {spacetime(new Date(call.created_at)).format(
              "{time} {date} {month}, {year}"
            )}
          </ActivityDate>
        </CallTop>
        <CallMiddle>
          {!editing ? (
            <p>{call.description}</p>
          ) : (
            <textarea
              value={callBody}
              onChange={(e) => setCallBody(e.target.value)}
              resize="none"
            />
          )}
        </CallMiddle>
        <CallBottom>
          <SelectsWrapper style={{ border: 0, margin: 0, padding: 0 }}>
            <ContactedSelect
              contactedIndex={
                contactedIndex !== undefined ? contactedIndex : ogContactIndex
              }
              setContactedIndex={setContactedIndex}
              contactables={
                missingContactable
                  ? [missingContactable, ...contactables]
                  : contactables
              }
              canEdit={canEdit}
            />
            <OutcomeSelect
              outcome={outcome || call.outcome}
              setOutcome={setOutcome}
              canEdit={canEdit}
            />
            <DateSelect
              selectedDate={selectedDate || ogDate || spacetime.now()}
              setSelectedDate={setSelectedDate}
              canEdit={canEdit}
            />
            <TimeSelect
              selectedTime={
                selectedTime
                  ? selectedTime
                  : ogDate
                  ? ogDate.format("{hour-24-pad}:{minute-pad}")
                  : "00:00"
              }
              setSelectedTime={setSelectedTime}
              canEdit={canEdit}
            />
          </SelectsWrapper>
        </CallBottom>
      </CustomActivityItem>
      {canEdit && over && (
        <ActionItemMenu
          deleteAction={() => setCallToDelete(ix)}
          editing={editing}
          setEditing={setEditing}
          saveEdit={saveEdit}
          cancelEdit={() => setEditing(false)}
        />
      )}
    </CallWrapper>
  );
};

const CustomBodyContainer = styled(BodyContainer)`
  display: block;
  max-width: 550px;
`;

const CustomActivityItem = styled(ActivityItem)`
  flex-direction: column;
  padding: 15px;
`;

const CallWrapper = styled.div`
  margin-bottom: 15px;

  &:hover {
    .delete-button {
      opacity: 1;
    }
  }

  .delete-button {
    align-items: center;
    background: white;
    border-radius: 50%;
    height: 50px;
    display: flex;
    justify-content: center;
    opacity: 0;
    transition: all ease-in-out 0.25s;
    width: 50px;

    &:hover {
      svg,
      img {
        opacity: 1;
      }
    }
    svg,
    img {
      opacity: 0.5;
      transition: all ease-in-out 0.25s;

      path {
        fill: #74767b;
      }
    }
  }
`;

const CallTop = styled.div`
  border-bottom: solid #eeeeee 1px;
  display: flex;
  position: relative;
  margin-bottom: 15px;
  padding-bottom: 15px;

  h5 {
    font-size: 14px;
    font-weight: 500;
  }

  p {
    font-size: 14px;
    line-height: 22px;
    white-space: pre-wrap;
  }

  .text-container {
    margin-left: 10px;
  }

  .date-container {
    position: absolute;
    right: 0;
    top: 0;
  }
`;

const CallMiddle = styled.div`
  // border-bottom: solid #eeeeee 1px;
  display: flex;
  position: relative;
  // margin-bottom: 15px;
  padding-bottom: 15px;

  p {
    font-size: 14px;
    line-height: 22px;
    white-space: pre-wrap;
  }

  textarea {
    border: solid #eee 1px;
    width: 100%;
    border-radius: 5px;
    padding: 10px;
    resize: none;
  }
`;

const CallBottom = styled.div`
  // width: 350px;
`;
