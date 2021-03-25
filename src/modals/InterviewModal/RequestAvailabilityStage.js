import React, { useState, Fragment } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
// bootstrap
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// Styles
import AvatarIcon from "sharedComponents/AvatarIcon";
import styled from "styled-components";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const RequestAvailability = styled.div`
  padding: 30px 60px;

  p {
    font-size: 15px;
  }
`;

const Form = styled.div`
  display: grid;
  grid-column-gap: 30px;
  grid-row-gap: 30px;
  grid-template-columns: repeat(2, 1fr);

  [aria-expanded="true"] + .autocomplete-dropdown-container {
    border: 1px solid #eee;
    font-size: 12px;
    top: 60px !important;
    width: 200px;
  }
`;

const Label = styled.span`
  font-size: 13px;
  margin-bottom: 10px;
`;

const sharedStyles = `
  -webkit-padding-end: 0 !important;
  background: #FFFFFF;
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 12px;
  padding: 7px 12px;
  width: 100%;
`;

const CustomSelect = styled.select`
  ${sharedStyles}
`;

const CustomInput = styled.input`
  ${sharedStyles}
`;

const InterviewParticipants = styled.div`
  margin-left: 10px;
`;

const InterviewParticipant = styled.div`
  background: #fff;
  border: 2px solid #fff;
  border-radius: 50%;
  height: 34px;
  margin-left: -10px;
  width: 34px;
`;

const AddParticipant = styled(InterviewParticipant)`
  align-items: center;
  background: #9a9ca1;
  cursor: pointer;
  display: flex;
  justify-content: center;
`;

const AddTMs = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 3px;
  color: #1e1e1e;
  font-size: 12px;
  left: -10px;
  max-height: 300px;
  min-width: 200px;
  overflow-y: auto;
  position: absolute;
  top: 40px;
  z-index: 1;
`;

const TM = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  padding: 10px;

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }

  &:first-of-type {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  &:last-of-type {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  span {
    margin-left: 10px;
  }

  &.active {
    font-weight: 500;

    svg {
      position: absolute;
      right: 10px;

      g g path {
        fill: #1f3653;
      }
    }
  }
`;

const DayList = styled.div`
  display: grid;
  grid-column-gap: 30px;
  grid-row-gap: 10px;
  grid-template-columns: repeat(2, 1fr);
`;

const DayTag = styled.button`
  align-items: center;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  display: flex;
  font-size: 12px;
  padding: 6px 8px 6px 15px;
  text-align: left;
  transition: 0.125s background-color ease-in-out,
    0.125s border-color ease-in-out;

  &:hover {
    background-color: #eee;
  }

  &.active {
    background-color: #1f3653;
    border-color: #1f3653;
    color: #fff;
    font-weight: 500;
    justify-content: space-between;
  }
`;

const RequestAvailabilityStage = ({
  teamMembers,
  selectedTeamMembers,
  setSelectedTeamMembers,

  setSelectedDuration,
  interviewType,
  setInterviewType,
  interviewInfo,
  setInterviewInfo,
  interviewLocation,
  setInterviewLocation,
  availableDays,
  setAvailvableDays,
}) => {
  const [displayAddTMs, setDisplayAddTMs] = useState(false);

  const addAvailableDay = (item) =>
    setAvailvableDays((days) => {
      let nextDays = days.concat(item);
      return nextDays;
    });

  const removeAvailableDay = (item) =>
    setAvailvableDays((days) => {
      let i = availableDays.indexOf(item);
      let nextDays = days.filter((day, j) => i !== j);
      return nextDays;
    });

  const addParticipant = (member) =>
    setSelectedTeamMembers((members) => {
      let nextMembers = members.concat(member);
      return nextMembers;
    });

  const removeParticipant = (member) =>
    setSelectedTeamMembers((members) => {
      let names = members.map((member) => member.name);
      let i = names.indexOf(member.name);
      return members.filter((member, j) => i !== j);
    });

  return (
    <RequestAvailability>
      <p>Please select interview length and available days.</p>
      <Form>
        <div>
          <Label>Interview Length</Label>
          <CustomSelect
            id="duration"
            name="duration"
            defaultValue={30}
            onChange={(e) => setSelectedDuration(Number(e.target.value))}
          >
            <option value={15}>15 mins</option>
            <option value={30}>30 mins</option>
            <option value={45}>45 mins</option>
            <option value={60}>1 hr</option>
            <option value={75}>1 hr 15 mins</option>
          </CustomSelect>
        </div>
        <div>
          <Label>Participants</Label>
          <InterviewParticipants className="leo-flex-center-start leo-relative">
            {selectedTeamMembers.map((participant, index) => (
              <OverlayTrigger
                key={`top-${index + 1}`}
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-top ${index}`}>
                    <strong>{participant.name || participant.email}</strong>
                  </Tooltip>
                }
              >
                <InterviewParticipant>
                  <AvatarIcon
                    key={`${participant}-${index}`}
                    imgUrl={participant.avatar}
                    name={participant.name || participant.email}
                    size={30}
                  />
                </InterviewParticipant>
              </OverlayTrigger>
            ))}
            <AddParticipant onClick={() => setDisplayAddTMs((state) => !state)}>
              <svg width="14" height="14" viewBox="0 0 14 14">
                <g>
                  <g>
                    <path fill="#fff" d="M6 0h2v6h6v2H8v6H6V8H0V6h6z" />
                  </g>
                </g>
              </svg>
            </AddParticipant>
            {displayAddTMs && (
              <AddTMs onMouseLeave={() => setDisplayAddTMs(false)}>
                {!!teamMembers &&
                  teamMembers.map((member, index) => {
                    let participantsNames =
                      !!selectedTeamMembers &&
                      selectedTeamMembers.map((member) => member.name);
                    let condition = participantsNames.includes(member.name);
                    return condition ? (
                      <TM
                        key={`team-member-#${index + 1}`}
                        className="active"
                        onClick={() => removeParticipant(member)}
                      >
                        <AvatarIcon
                          key={`participant-${index}`}
                          imgUrl={member.avatar}
                          name={member.name || member.email}
                          size={30}
                        />
                        <span>{member.name}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16">
                          <g>
                            <g>
                              <path
                                fill="#fff"
                                d="M8 0a8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8zm3.197 5.215a.5.5 0 0 0-.866-.5l-3.198 5.54-1.789-1.65a.5.5 0 0 0-.73.685L6.9 11.4a.5.5 0 0 0 .707.02c.06-.055 3.59-6.205 3.59-6.205z"
                              />
                            </g>
                          </g>
                        </svg>
                      </TM>
                    ) : (
                      <TM
                        key={`team-member-#${index + 1}`}
                        onClick={() => addParticipant(member)}
                      >
                        <AvatarIcon
                          key={`participant-${index}`}
                          imgUrl={member.avatar}
                          name={member.name || member.email}
                          size={30}
                        />
                        <span>{member.name}</span>
                      </TM>
                    );
                  })}
              </AddTMs>
            )}
          </InterviewParticipants>
        </div>
        <div>
          <Label>Interview Type</Label>
          <CustomSelect
            defaultValue="address"
            onChange={(e) => {
              setInterviewInfo("");
              setInterviewLocation("");
              setInterviewType(e.target.value);
            }}
          >
            <option value="address">In person</option>
            <option value="phone_number">Over the phone</option>
            {/*<option value="google_meet">Generate Google Meet Link</option>*/}
            <option value="web_link">Web conference</option>
          </CustomSelect>
        </div>
        <div>
          {interviewType === "phone_number" && (
            <Fragment>
              <Label>Details</Label>
              <CustomInput
                onChange={(e) => setInterviewInfo(e.target.value)}
                placeholder="Add details..."
                required
                value={interviewInfo || ""}
              />
            </Fragment>
          )}
          {interviewType === "web_link" && (
            <Fragment>
              <Label>Details</Label>
              <CustomInput
                onChange={(e) => setInterviewInfo(e.target.value)}
                placeholder="Add details..."
                required
                value={interviewInfo || ""}
              />
            </Fragment>
          )}
          {interviewType === "address" && (
            <>
              <PlacesAutocomplete
                value={interviewLocation || ""}
                onChange={setInterviewLocation}
                onSelect={setInterviewLocation}
                searchOptions={{
                  types: ["address"],
                }}
              >
                {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                  <div className="autocomplete-container">
                    <Label>Location</Label>
                    <CustomInput
                      {...getInputProps({
                        placeholder: "Type the location here...",
                      })}
                    />
                    <div className="autocomplete-dropdown-container">
                      {suggestions.map((suggestion, inx) => {
                        const className = suggestion.active
                          ? "suggestion-item--active"
                          : "suggestion-item";
                        const style = suggestion.active
                          ? {
                              backgroundColor: "#fafafa",
                              cursor: "pointer",
                            }
                          : {
                              backgroundColor: "#ffffff",
                              cursor: "pointer",
                            };
                        return (
                          <div
                            key={`suggestion-row-${inx}`}
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style,
                            })}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            </>
          )}
        </div>
        <div style={{ gridColumn: "1 / span 2" }}>
          <Label>Select available days</Label>
          <DayList>
            {days.map((day) =>
              availableDays.indexOf(day) !== -1 ? (
                <DayTag
                  key={day}
                  className="active"
                  onClick={() => removeAvailableDay(day)}
                >
                  {day}
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <g>
                      <g>
                        <path
                          fill="#fff"
                          d="M8 0a8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8zm3.197 5.215a.5.5 0 0 0-.866-.5l-3.198 5.54-1.789-1.65a.5.5 0 0 0-.73.685L6.9 11.4a.5.5 0 0 0 .707.02c.06-.055 3.59-6.205 3.59-6.205z"
                        />
                      </g>
                    </g>
                  </svg>
                </DayTag>
              ) : (
                <DayTag key={day} onClick={() => addAvailableDay(day)}>
                  {day}
                </DayTag>
              )
            )}
          </DayList>
        </div>
      </Form>
    </RequestAvailability>
  );
};

export default RequestAvailabilityStage;
