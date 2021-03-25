import React, { useState, useEffect } from "react";
import notify from "notifications";
import spacetime from "spacetime";
import styled from "styled-components";

import ActionCreatorFooter from "sharedComponents/ActionCreator/ActionCreatorFooter";
import {
  SelectsWrapper,
  SelectBox,
  TitleInput,
} from "sharedComponents/ActionCreator/SharedComponents";
import { createMeeting } from "helpersV2/meetings";
import SearchAndSelect from "sharedComponents/ActionCreator/SearchAndSelect";
import {
  DurationSelect,
  DateSelect,
  TimeSelect,
} from "sharedComponents/ActionCreator/selectors";
import useDropdown from "hooks/useDropdown";

const MeetCreator = ({
  actionType,
  setActionType,
  store,
  contacts,
  candidates,
  source,
  sourceId,
  pushMeet,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(900);
  const [selectedDate, setSelectedDate] = useState(spacetime.now());
  const [selectedTime, setSelectedTime] = useState(
    spacetime.now().format("{hour-24-pad}:{minute-pad}")
  );
  const [contactables, setContactables] = useState(undefined);
  const [attendees, setAttendees] = useState([]);
  const [totalSelected, setTotalSelected] = useState(0);
  const [createGoogleEvent, setCreateGoogleEvent] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const { node, showSelect, setShowSelect } = useDropdown();

  const createMeetEvent = () => {
    if (!title) {
      return notify("danger", "Meeting must have a title.");
    }
    setSendingRequest(true);
    let date = selectedDate.clone();
    let time = selectedTime.split(":");
    date = date.hour(Number(time[0])).minute(Number(time[1]));

    let body = {
      start_time: date.format("{iso-utc}"),
      duration: duration,
      agency_id: store.company.id,
      source: source,
      source_id: sourceId,
      description: description,
      title: title,
      attendees: attendees,
      create_calendar_event: actionType !== "log-meet" ? true : false,
      create_google_event: createGoogleEvent,
    };
    createMeeting(store.session, body)
      .then((res) => {
        if (!res.err) {
          notify("info", "Meeting succesfully created");
          if (pushMeet) {
            pushMeet(res);
          }
          setTitle("");
          setDescription("");
          setShowSelect(undefined);
          setDuration(900);
          setSelectedDate(spacetime.now());
          setSelectedTime(spacetime.now().format("{hour-24-pad}:{minute-pad}"));
          setCreateGoogleEvent(false);
        } else {
          notify("danger", res);
        }
      })
      .then(() => setSendingRequest(false));
  };

  useEffect(() => {
    if (store.teamMembers || contacts) {
      let provisional = {};
      if (candidates && candidates.length > 0) {
        provisional.candidates = [];
        candidates.map((cand) =>
          provisional.candidates.push({
            name: cand.name,
            email: cand.tn_email,
            source: "candidate",
            source_id: cand.ptn_id,
            selected: candidates.length === 1 ? true : false,
          })
        );
      }
      if (contacts && contacts.length > 0) {
        provisional.contacts = [];
        contacts.map((cont) =>
          provisional.contacts.push({
            name: cont.name,
            email: cont.email,
            source: "contact",
            source_id: cont.id,
            selected: contacts.length === 1 ? true : false,
          })
        );
      }
      if (store.teamMembers) {
        provisional.members = [];
        store.teamMembers.map((member) =>
          provisional.members.push({
            name: member.name,
            email: member.email,
            source: "member",
            source_id: member.team_member_id,
            selected:
              store.role.team_member.team_member_id === member.team_member_id
                ? true
                : false,
          })
        );
      }
      setContactables(provisional);
    }
  }, [store.teamMembers, contacts]);

  useEffect(() => {
    if (contactables) {
      let total = 0;
      let newAttendees = [];
      if (contactables.members && contactables.members.length > 0) {
        contactables.members.map((option) => {
          if (option.selected) {
            newAttendees.push({
              source: option.source,
              source_id: option.source_id,
            });
            total++;
          }
          return null;
        });
      }
      if (contactables.contacts && contactables.contacts.length > 0) {
        contactables.contacts.map((option) => {
          if (option.selected) {
            newAttendees.push({
              source: option.source,
              source_id: option.source_id,
            });
            total++;
          }
          return null;
        });
      }
      if (contactables.candidates && contactables.candidates.length > 0) {
        contactables.candidates.map((option) => {
          if (option.selected) {
            newAttendees.push({
              source: option.source,
              source_id: option.source_id,
            });
            total++;
          }
          return null;
        });
      }
      setAttendees(newAttendees);
      setTotalSelected(total);
    }
  }, [contactables]);

  return (
    <div>
      <MeetContainer>
        <TitleInput
          placeholder="What is the meeting about..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength="100"
        />
        <SelectsWrapper>
          <SelectBox ref={node}>
            <label>Attendees</label>
            <button
              className="button"
              onClick={() =>
                setShowSelect(
                  showSelect === "attendees" ? undefined : "attendees"
                )
              }
            >
              {totalSelected ? totalSelected : ""} Attendees
            </button>
            {showSelect === "attendees" && (
              <SearchAndSelect
                contactables={contactables}
                setContactables={setContactables}
                store={store}
                totalSelected={totalSelected}
                hideSearch={source === "candidate" ? true : false}
              />
            )}
          </SelectBox>
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
          {actionType !== "meet-log" && (
            <DurationSelect
              duration={duration}
              setDuration={setDuration}
              canEdit={true}
            />
          )}
        </SelectsWrapper>
        <textarea
          className="form-control"
          rows="3"
          name="call-text-box"
          placeholder="Describe the meet..."
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        {actionType !== "meet-log" && (
          <CalendarBox>
            <input
              type="checkbox"
              checked={createGoogleEvent}
              onChange={() => setCreateGoogleEvent(!createGoogleEvent)}
            />
            <span>Send calendar invites</span>
          </CalendarBox>
        )}
      </MeetContainer>
      <ActionCreatorFooter
        setActionType={setActionType}
        actionName="Create"
        confirmAction={createMeetEvent}
        sendingRequest={sendingRequest}
      />
    </div>
  );
};

export default MeetCreator;

const MeetContainer = styled.div`
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

const CalendarBox = styled.div`
  border-top: 1px solid #eee;
  display: flex;
  margin-top: 15px;
  padding-top: 15px;

  input {
    background: #ffffff;
    border: 1px solid #eeeeee;
    border-radius: 2px;
    height: 14px;
    margin: 0;
    margin-right: 10px;
    margin-top: -1px;
    width: 14px;
  }

  span {
    color: #1e1e1e;
    font-size: 11px;
  }
`;
