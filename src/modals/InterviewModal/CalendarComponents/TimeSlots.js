import React from "react";
import styled from "styled-components";

const TimeSlots = ({ selectedTeamMembers }) => {
  const EmptySlot = styled.div`
    border-left: solid #eee 1px;
    border-bottom: solid #eee 1px;
    grid-column: ${props => 2 + props.index} / span 1;
    grid-row: 2 / span 100;
    z-index: 5;
  `;

  let totalEmpties = [];
  selectedTeamMembers.forEach((member, index) => {
    totalEmpties.push(
      <EmptySlot
        index={index}
        className="time-slot"
        data-index={index}
        key={`emptyTimeslot=${index}`}
      />
    );
  });
  return totalEmpties;
};
export default TimeSlots;
