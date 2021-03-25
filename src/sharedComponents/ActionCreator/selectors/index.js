import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import spacetime from "spacetime";
import {
  SelectBox,
  PriorityIndicator,
} from "sharedComponents/ActionCreator/SharedComponents";
import "components/Calendar/styles/datepciker.scss";
import useDropdown from "hooks/useDropdown";

export const ContactedSelect = ({
  contactedIndex,
  setContactedIndex,
  contactables,
  canEdit,
}) => (
  <SelectBox>
    <label>Contacted</label>
    <select
      onChange={(e) => setContactedIndex(Number(e.target.value))}
      value={contactedIndex === undefined ? "" : contactedIndex}
      disabled={!canEdit}
    >
      {contactables && contactables.length === 1 && (
        <option value={0} disabled>
          {contactables[0].value}
        </option>
      )}
      {contactables && contactables.length > 1 && (
        <option value="" disabled hidden>
          Select contacted
        </option>
      )}
      {contactables &&
        contactables.length > 1 &&
        contactables.map((cont, index) => (
          <option key={`contactable-${index}`} value={index}>
            {cont.value}
          </option>
        ))}
    </select>
  </SelectBox>
);

export const TeamMemberSelect = ({
  teamMembers,
  setMemberId,
  memberId,
  canEdit,
}) => (
  <SelectBox>
    <label>Assign To</label>
    <select
      onChange={(e) => setMemberId(Number(e.target.value))}
      value={memberId}
      disabled={!canEdit}
    >
      {teamMembers &&
        teamMembers.map((member, index) => (
          <option value={member.team_member_id} key={`member-${index}`}>
            {member.name}
          </option>
        ))}
    </select>
  </SelectBox>
);

export const DateSelect = ({
  selectedDate,
  setSelectedDate,
  label,
  canEdit,
}) => {
  const { node, showSelect, setShowSelect } = useDropdown();

  return (
    <SelectBox ref={node}>
      <label>{label || "Date"}</label>
      <button
        className="button"
        onClick={() =>
          setShowSelect(showSelect !== "date" ? "date" : undefined)
        }
      >
        {selectedDate.format("{numeric-uk}")}
      </button>
      {showSelect === "date" && canEdit && (
        <DatePicker
          inline
          startDate={new Date(selectedDate.epoch)}
          selected={new Date(selectedDate.epoch)}
          onChange={(date) => {
            setSelectedDate(spacetime(date));
            setShowSelect(undefined);
          }}
        />
      )}
    </SelectBox>
  );
};
export const DurationSelect = ({ duration, setDuration }) => (
  <SelectBox>
    <label>Duration</label>
    <select
      value={duration}
      onChange={(e) => setDuration(Number(e.target.value))}
    >
      <option value="900">15 mins</option>
      <option value="1800">30 mins</option>
      <option value="2700">45 mins</option>
      <option value="3600">1 hr</option>
      <option value="4500">1 hr 15 mins</option>
      <option value="5400">1 hr 30 mins</option>
    </select>
  </SelectBox>
);

export const OutcomeSelect = ({ outcome, setOutcome, canEdit }) => (
  <SelectBox>
    <label>Outcome</label>
    <select
      value={outcome}
      onChange={(e) => setOutcome(e.target.value)}
      disabled={!canEdit}
    >
      <option value="No answer">No answer</option>
      <option value="Busy">Busy</option>
      <option value="Wrong Number">Wrong Number</option>
      <option value="Left voicemail">Left voicemail</option>
      <option value="Left live message">Left live message</option>
      <option value="Connected">Connected</option>
    </select>
  </SelectBox>
);

export const TaskTypeSelect = ({ type, setType, canEdit }) => (
  <SelectBox>
    <label>Type</label>
    <select
      value={type}
      onChange={(e) => setType(e.target.value)}
      style={{ minWidth: "50px" }}
      disabled={!canEdit}
    >
      <option value="Call">Call</option>
      <option value="Email">Email</option>
      <option value="To-do">To-do</option>
    </select>
  </SelectBox>
);

export const PrioritySelect = ({ priority, setPriority, canEdit }) => (
  <SelectBox>
    <label>Priority</label>
    <div className="d-flex align-items-center">
      <PriorityIndicator className={priority} />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        style={{ minWidth: "50px" }}
        disabled={!canEdit}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
  </SelectBox>
);

export const TimeSelect = ({
  selectedTime,
  setSelectedTime,
  label,
  canEdit,
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (selectedTime) setValue(selectedTime);
  }, [selectedTime]);

  return (
    <SelectBox>
      <label>{label || "Time"}</label>
      <input
        type="time"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setSelectedTime(value)}
        disabled={!canEdit}
      />
    </SelectBox>
  );
};
