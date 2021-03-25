import React, { useEffect } from "react";
import styled from "styled-components";

import DateSelector from "modals/InterviewModal/CalendarComponents/DateSelector";
import MembersCalendar from "modals/InterviewModal/CalendarComponents/MembersCalendar";

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const StageContainer = styled.div`
  /* background: #f6f6f6; */
  max-height: 500px;
  overflow: auto;
  position: relative;
`;

const MembersStage = (props) => {
  // const [isMouseDown, setIsMouseDown] = useState(false);
  // const [clickPosition, setClickPosition] = useState(0);

  function handleMouseDown(event) {
    if (event.target.classList.contains("time-slot")) {
      // setIsMouseDown(true);
      let rect = event.target.getBoundingClientRect(),
        height = rect.height,
        y = event.clientY - rect.top;
      let quarterTime = Math.round(y / (height / 96)) * 900000;
      let midnight = props.selectedDate.setHours(0, 0, 0, 0);

      props.setSelectedDate(new Date(midnight + quarterTime));
      // setClickPosition(y);
    }
  }

  function handleMouseMove() {
    // if (!!isMouseDown && event.target.classList.contains("time-slot")) {
    //   let rect = event.target.getBoundingClientRect(),
    //     y = event.clientY - rect.top - 20;
    //   const duration = Math.floor((y - clickPosition) * 1.5);
    //   if (duration % 15 === 0) props.setSelectedDuration(duration);
    // }
  }
  function handleMouseUp() {
    // setIsMouseDown(false);
  }

  useEffect(() => {
    const gridWrapper = document.getElementById("member-calendar-container");
    const hr = 7 * 4;
    const cellHeight = 10;
    const headerHeight = 45;
    const position = hr * cellHeight + headerHeight;
    gridWrapper.scrollTop = position;
  }, []);

  return (
    <Container>
      {props.selectedDate && (
        <DateSelector
          date={props.selectedDate}
          setNewDate={props.setSelectedDate}
          fetchAllMembersInterviews={props.fetchAllMembersInterviews}
          selectedDuration={props.selectedDuration}
          setSelectedDuration={props.setSelectedDuration}
          timeZone={props.timeZone}
          setTimeZone={props.setTimeZone}
        />
      )}
      <StageContainer id="member-calendar-container">
        <MembersCalendar
          selectedTeamMembers={props.selectedTeamMembers}
          membersInterviews={props.membersInterviews}
          setSelectedTeamMembers={props.setSelectedTeamMembers}
          addMember={props.addMember}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          selectedCandidate={props.selectedCandidate}
          selectedDate={props.selectedDate}
          selectedDuration={props.selectedDuration}
          setSelectedDuration={props.selectedDuration}
          teamMembers={props.teamMembers}
          removeMember={props.removeMember}
          timeZone={props.timeZone}
        />
      </StageContainer>
    </Container>
  );
};
export default MembersStage;
