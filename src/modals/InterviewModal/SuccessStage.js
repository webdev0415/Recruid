import React from "react";
import AvatarIcon from "sharedComponents/AvatarIcon";
import styled from "styled-components";
import spacetime from "spacetime";
import { AWS_CDN_URL } from "constants/api";

const ConfirmContainer = styled.div`
  padding: 30px 60px;
`;

const StyledStageEditor = styled.div`
  background: #ffffff;
  border: 1px solid #eeeeee;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-bottom: 30px;

  h1 {
    font-size: 15px;
    font-weight: 500;
    margin-top: 5px;
  }
`;

const StyledEditRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 15px;

  svg,
  img {
    margin-right: 7px;
    width: 12px;
  }

  p {
    color: #74767b;
    font-size: 12px;
    margin-bottom: 2px;
  }

  span {
    color: #74767b;
    font-size: 13px;
  }
`;

const StyledEditRowDetails = styled.div`
  align-items: center;
  display: flex;

  p {
    margin: 0 !important;
  }
`;

const AvatarRow = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 5px;

  h5 {
    font-size: 12px;
    font-weight: 500;
    margin-left: 10px;
  }
`;

const SuccessStage = ({
  selectedDate,
  selectedJob,
  selectedCandidate,
  selectedDuration,
  timeZone,
  interviewTitle,
}) => {
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
  let startTime = `${selectedDate.getHours()}${
    selectedDate.getMinutes() > 0 ? ":" + selectedDate.getMinutes() : ""
  }`;
  let ending = new Date(Date.parse(selectedDate) + selectedDuration * 60000);
  let endTime = `${ending.getHours()}${
    ending.getMinutes() > 0 ? ":" + ending.getMinutes() : ""
  }`;
  // let meridian = ending.getHours() > 12 ? "PM" : "AM";
  let formattedTime = `${startTime} - ${endTime} - ${
    weekDays[selectedDate.getDay()]
  },${selectedDate.getDate()} ${months[selectedDate.getMonth()]}`;
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

  return (
    <ConfirmContainer>
      <StyledStageEditor>
        <StyledEditRow>
          <h1>
            {interviewTitle ||
              `Interview with ${
                selectedCandidate.talent_name ||
                selectedCandidate.applicant_name
              }`}
          </h1>
        </StyledEditRow>
        <StyledEditRow>
          <StyledEditRowDetails>
            <img src={`${AWS_CDN_URL}/icons/JobIcon.svg`} alt="" />
            <div>
              <p>
                <a href="/" target="_blank">
                  {selectedJob.title}
                </a>
                {` at ${selectedJob.job_owner}`}
              </p>
            </div>
          </StyledEditRowDetails>
        </StyledEditRow>
        {timeZone && (
          <StyledEditRow>
            <StyledEditRowDetails>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path
                  d="M6.563 7.219l-.01-.001-3.6-.377a.467.467 0 0 1-.422-.466c0-.242.182-.443.422-.466l2.309-.231.272-2.725A.466.466 0 0 1 6 2.531c.242 0 .442.182.466.422l.378 3.976c0 .163-.126.29-.282.29M6 0a6 6 0 0 0-6 6 6 6 0 1 0 6-6"
                  fill="#C1C3C8"
                  fill-role="nonzero"
                />
              </svg>
              <div>
                <p>{tzTime}</p>
              </div>
            </StyledEditRowDetails>
          </StyledEditRow>
        )}
        <StyledEditRow>
          <StyledEditRowDetails>
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path
                d="M6.563 7.219l-.01-.001-3.6-.377a.467.467 0 0 1-.422-.466c0-.242.182-.443.422-.466l2.309-.231.272-2.725A.466.466 0 0 1 6 2.531c.242 0 .442.182.466.422l.378 3.976c0 .163-.126.29-.282.29M6 0a6 6 0 0 0-6 6 6 6 0 1 0 6-6"
                fill="#C1C3C8"
                fill-role="nonzero"
              />
            </svg>
            <div>
              <p>{`${formattedTime} ${timeZone ? "- Local Time" : ""}`}</p>
            </div>
          </StyledEditRowDetails>
        </StyledEditRow>
        <StyledEditRow>
          <AvatarRow>
            <AvatarIcon
              name={
                selectedCandidate.talent_name ||
                selectedCandidate.applicant_name
              }
              imgUrl={
                selectedCandidate.avatar_url ||
                selectedCandidate.applicant_avatar
              }
              size={30}
            />
            <h5>
              {selectedCandidate.talent_name ||
                selectedCandidate.applicant_name}
            </h5>
          </AvatarRow>
        </StyledEditRow>
      </StyledStageEditor>
      <div>
        <p style={{ textAlign: "center" }}>
          Your interview is confirmed, please check the details above.
        </p>
      </div>
    </ConfirmContainer>
  );
};
export default SuccessStage;

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
