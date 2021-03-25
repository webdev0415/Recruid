import React from "react";
import styled from "styled-components";

const InterviewSlots = ({ membersInterviews, selectedDate }) => {
  let interviewsArr = [];
  const StyledTag = styled.div`
    background: #9a9ca1;
    /* box-shadow: 0 0 0 1px #fff; */
    border-bottom: 1px solid #fff;
    border-top: 1px solid #fff;
    color: #ffffff;
    display: flex;
    font-size: 12px;
    font-weight: 500;
    grid-column: ${props => 2 + props.index} / span 1;
    grid-row: ${props => 2 + props.start} /
      ${props =>
        2 + props.start + props.duration > 98
          ? 98
          : 2 + props.start + props.duration};
    overflow: hidden;
    padding-left: 5px;
    z-index: 1;
  `;

  const InterviewTag = ({ interview, index }) => {
    let startTime = new Date(Date.parse(interview.start));
    let endTime = new Date(Date.parse(interview.end));
    let topPosition = Math.round(
      startTime.getHours() * 4 + startTime.getMinutes() / 15
    );
    let duration = Math.round((endTime - startTime) / 60000 / 15);
    let midnight = new Date(selectedDate);
    midnight.setHours(0, 0, 0, 0);
    if (startTime - midnight < 0) {
      topPosition = 0;
    }
    let hours = startTime.getHours();
    let minutes = startTime.getMinutes();
    let tagTime = `${hours}:${
      minutes === 0 ? "00" : minutes < 10 ? `0${minutes}` : minutes
    }${hours >= 12 ? "pm" : "am"} - ${interview.name}`;
    return (
      <StyledTag index={index} start={topPosition} duration={duration}>
        {tagTime.length > 30 ? `${tagTime.substring(0, 27)}...` : tagTime}
      </StyledTag>
    );
  };
  if (membersInterviews && membersInterviews.length > 0) {
    membersInterviews.map((member, index) => {
      if (member && member.length > 0) {
        member.map((interviewObj, i) =>
          interviewsArr.push(
            <InterviewTag
              interview={interviewObj}
              index={index}
              key={`interviewTag=${index}-${i}`}
            />
          )
        );
      }
      return null;
    });
  }
  return interviewsArr;
};
export default InterviewSlots;
