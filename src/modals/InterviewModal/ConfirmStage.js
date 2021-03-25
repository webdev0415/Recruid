import React, { useState } from "react";
import styled from "styled-components";
import PlacesAutocomplete from "react-places-autocomplete";
import CancelButton from "modals/InterviewModal/CancelButton";
import Toggle from "sharedComponents/Toggle";
// import moment from "moment";
import spacetime from "spacetime";

const ConfirmStage = ({
  selectedDate,
  selectedJob,
  selectedCandidate,
  returnToStage,
  selectedDuration,
  rescheduleInterview,
  wipeCandidate,
  interviewType,
  setInterviewType,
  interviewInfo,
  setInterviewInfo,
  interviewLocation,
  setInterviewLocation,
  editInterview,
  timeZone,
  additionalParticipants,
  setAdditionalParticipants,
  interviewTitle,
  setInterviewTitle,
  setSendCandidateEmail,
  sendCandidateEmail,
}) => {
  const [additional, setAdditional] = useState("");
  let startTime = `${
    selectedDate.getHours() < 10 ? "0" : ""
  }${selectedDate.getHours()}:${
    selectedDate.getMinutes() < 10 ? "0" : ""
  }${selectedDate.getMinutes()}`;
  let ending = new Date(Date.parse(selectedDate) + selectedDuration * 60000);
  let endTime = `${ending.getHours() < 10 ? "0" : ""}${ending.getHours()}:${
    ending.getMinutes() < 10 ? "0" : ""
  }${ending.getMinutes()}`;
  let tzTime;
  let tzStartTime;
  let tzEndTime;

  if (timeZone) {
    let tzSelected = new spacetime(selectedDate, timeZone.tz);
    let hour = tzSelected.hours();
    if (hour < 0) {
      hour += 24;
    } else if (hour > 24) {
      hour = 24 - hour;
    }
    tzStartTime = `${hour < 10 ? "0" : ""}${hour}:${
      selectedDate.getMinutes() < 10 ? "0" : ""
    }${selectedDate.getMinutes()}`;
    //
    let hoursDuration = Math.floor(selectedDuration / 60);
    let endHour = hour + hoursDuration;

    tzEndTime = `${endHour < 10 ? "0" : ""}${endHour}:${
      ending.getMinutes() < 10 ? "0" : ""
    }${ending.getMinutes()}`;
    //
    tzTime = `${tzStartTime} - ${tzEndTime} -  ${
      weekDays[tzSelected.day()]
    }, ${tzSelected.date()} ${months[tzSelected.month()]} - ${
      timezoneNames[timeZone.tz]
    }`;
  }

  function defaultSelectValue() {
    if (editInterview) return interviewType;
  }

  const StageEditor = () => (
    <StyledStageEditor>
      <StyledEditRow>
        <StyledEditRowDetails>
          <svg width="20" height="19" viewBox="0 0 20 19">
            <path
              d="M11.25 9.778c0-.224-.066-.43-.173-.611H8.923a1.19 1.19 0 0 0-.173.61C8.75 10.453 9.31 11 10 11s1.25-.548 1.25-1.222zm1.25 0c0 1.35-1.12 2.444-2.5 2.444s-2.5-1.094-2.5-2.444c0-.213.034-.416.088-.611H0v6.722c0 1.35 1.12 2.444 2.5 2.444h15c1.38 0 2.5-1.094 2.5-2.444V9.167h-7.588c.054.195.088.398.088.61zm0-7.334h-5v-.61c0-.338.28-.612.625-.612h3.75c.345 0 .625.274.625.611v.611zm5 0h-3.75V1.222C13.75.548 13.19 0 12.5 0h-5c-.69 0-1.25.548-1.25 1.222v1.222H2.5C1.12 2.444 0 3.54 0 4.89v3.055h20V4.89c0-1.35-1.12-2.445-2.5-2.445z"
              fill="#C1C3C8"
              fill-role="nonzero"
            />
          </svg>
          <div>
            <p>{selectedJob.title}</p>
            <span>{selectedJob.job_owner}</span>
          </div>
        </StyledEditRowDetails>
        {!rescheduleInterview && !editInterview && (
          <EditButton
            onClick={() => {
              wipeCandidate();
              returnToStage("jobs");
            }}
            className="button"
          >
            Edit
          </EditButton>
        )}
      </StyledEditRow>

      <StyledEditRow>
        <StyledEditRowDetails>
          <svg width="18" height="22" viewBox="0 0 18 22">
            <g fill="#C1C3C8" fill-role="evenodd">
              <circle cx="9" cy="5" r="5" />
              <path d="M18 19c0-2.843-3.477-7-9-7s-9 4.157-9 7 18 2.843 18 0z" />
            </g>
          </svg>
          <div>
            <p>
              {selectedCandidate.talent_name ||
                selectedCandidate.applicant_name ||
                selectedCandidate.name}
            </p>
            {selectedCandidate.localizations &&
              selectedCandidate.localizations.length > 0 && (
                <span>{selectedCandidate.localizations[0].location?.name}</span>
              )}
          </div>
        </StyledEditRowDetails>
        {!rescheduleInterview && !editInterview && (
          <EditButton
            onClick={() => returnToStage("candidates")}
            className="button"
          >
            Edit
          </EditButton>
        )}
      </StyledEditRow>

      <StyledEditRow>
        <StyledEditRowDetails>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path
              d="M10.938 12.031l-.015-.001-6.001-.627a.779.779 0 0 1-.703-.778c0-.404.302-.739.703-.777l3.847-.385.455-4.541A.777.777 0 0 1 10 4.219c.403 0 .738.302.776.703l.63 6.626c0 .272-.21.483-.469.483M10 0C4.475 0 0 4.478 0 10c0 5.523 4.475 10 10 10 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10"
              fill="#C1C3C8"
              fill-role="nonzero"
            />
          </svg>
          <div style={{ marginRight: "5px" }}>
            {timeZone ? (
              <>
                <p>{tzTime}</p>
                <span>
                  {`${startTime} - ${endTime} - ${
                    weekDays[selectedDate.getDay()]
                  },
                          ${selectedDate.getDate()}
                          ${months[selectedDate.getMonth()]} - Local Time`}
                </span>
              </>
            ) : (
              <p>
                {`${startTime} - ${endTime} - ${
                  weekDays[selectedDate.getDay()]
                },
              ${selectedDate.getDate()}
              ${months[selectedDate.getMonth()]}`}
              </p>
            )}
          </div>
        </StyledEditRowDetails>
        {!editInterview && (
          <EditButton
            onClick={() => returnToStage("members")}
            className="button"
          >
            Edit
          </EditButton>
        )}
      </StyledEditRow>
    </StyledStageEditor>
  );

  const addParticipantEmail = () => {
    if (additional.includes("@") && additional.includes(".")) {
      let newParticipants = [...additionalParticipants];
      newParticipants.push(additional);
      setAdditionalParticipants(newParticipants);
      setAdditional("");
    } else if (additional) {
      alert("Please add a valid email address");
    }
  };

  return (
    <ConfirmContainer>
      <div>
        <div style={{ marginBottom: "20px" }}>
          <label className="form-label">Interview Title</label>
          <input
            className="form-control"
            onChange={(e) => setInterviewTitle(e.target.value)}
            placeholder=""
            value={interviewTitle}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label className="form-label">What kind of interview is this?</label>
          <select
            className="form-control"
            defaultValue={defaultSelectValue()}
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
          </select>
          {interviewType === "phone_number" && (
            <input
              className="form-control"
              onChange={(e) => setInterviewInfo(e.target.value)}
              placeholder="Add details..."
              required
              value={interviewInfo || ""}
            />
          )}
          {interviewType === "web_link" && (
            <input
              className="form-control"
              onChange={(e) => setInterviewInfo(e.target.value)}
              placeholder="Add details..."
              required
              value={interviewInfo || ""}
            />
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
                    <input
                      {...getInputProps({
                        placeholder: "Type the location here...",
                        className: "location-search-input form-control",
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
          <div style={{ marginTop: 30 }}>
            <label
              className="form-label leo-flex"
              style={{
                alignItems: "center",
              }}
            >
              <Toggle
                name="email"
                toggle={() => setSendCandidateEmail(!sendCandidateEmail)}
                checked={sendCandidateEmail}
                style={{ marginRight: "10px" }}
              />
              Send calendar invite to candidate?
            </label>
          </div>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label className="form-label">Any additional participants ?</label>
          <div style={{ flexWrap: "wrap" }} className="leo-flex">
            {additionalParticipants &&
              additionalParticipants.length > 0 &&
              additionalParticipants.map((participant, index) => (
                <AddSpan
                  key={`additional-${index}`}
                  onClick={() => {
                    let newParticipants = [...additionalParticipants];
                    newParticipants.splice(index, 1);
                    setAdditionalParticipants(newParticipants);
                  }}
                >
                  <CancelButton />
                  <span style={{ marginLeft: "5px" }}>{participant}</span>
                </AddSpan>
              ))}
          </div>
          <input
            className="form-control"
            onChange={(e) => setAdditional(e.target.value)}
            placeholder="Add aditional participants..."
            type="email"
            value={additional}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addParticipantEmail();
              }
            }}
            onBlur={addParticipantEmail}
          />
        </div>
      </div>
      <StageEditor />
    </ConfirmContainer>
  );
};

export default ConfirmStage;

const ConfirmContainer = styled.div`
  display: grid;
  grid-column-gap: 80px;
  grid-template-columns: repeat(2, 1fr);
  padding: 30px 80px;

  select {
    margin-bottom: 15px;
  }

  input {
    margin-bottom: 0;
  }
`;

const StyledStageEditor = styled.div`
  background: #fafafa;
  border: 1px solid rgba(193, 195, 200, 0.5);
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  height: -webkit-fill-available;
  margin-bottom: 30px;
`;

const StyledEditRow = styled.div`
  align-items: flex-start;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  justify-content: space-between;
  padding: 15px;

  &:last-child {
    border-bottom: none;
  }

  svg {
    margin-right: 10px;
    width: 20px;
  }

  p {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 2px;
  }

  span {
    color: #74767b;
    font-size: 13px;
  }
`;

const StyledEditRowDetails = styled.div`
  display: flex;

  p {
    margin: 0 !important;
  }
`;

const EditButton = styled.button`
  background: #eeeeee;
  border: 0;
  box-shadow: none !important;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 4px 8px;
  text-transform: uppercase;

  &:hover {
    background: #dddddd;
  }
`;

const AddSpan = styled.span`
  margin-bottom: 5px;
  background: #184a6d;
  padding: 5px;
  border-radius: 4px;
  color: white;
  width: fit-content;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 5px;
`;
const timezoneNames = {
  "etc/gmt+12": "E/K",
  "pacific/niue": "Samoa",
  "pacific/honolulu": "Hawaii",
  "america/anchorage": "UA",
  "america/los_angeles": "PT",
  "america/edmonton": "MT",
  "america/mexico_city": "CT",
  "america/new_york": "ET",
  "america/lima": "AT",
  "america/halifax": "AT",
  "america/argentina/buenos_aires": "BA",
  "etc/gmt-2": "MA",
  "atlantic/azores": "AZ",
  "europe/london": "WE",
  "europe/brussels": "EB",
  "europe/kaliningrad": "SA",
  "europe/moscow": "Moscow",
  "asia/dubai": "AD",
  "asia/yekaterinburg": "EK",
  "asia/almaty": "AA",
  "asia/bangkok": "Bangkok",
  "asia/hong_kong": "HK",
  "asia/tokyo": "Tokyo",
  "pacific/guam": "EA",
  "asia/magadan": "SI",
  "pacific/auckland": "PA",
  "pacific/apia": "PA",
};

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
