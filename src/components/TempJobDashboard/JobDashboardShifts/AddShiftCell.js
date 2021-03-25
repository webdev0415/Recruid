import React from "react";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";
const AddShiftCell = ({
  setActiveMiniModal,
  currentDay,
  setActiveDate,
  className,
}) => {
  return (
    <Cell className={className}>
      <span>Add Shift</span>
      <button
        onClick={() => {
          setActiveMiniModal("create-shift");
          setActiveDate({
            start: currentDay.hour(9),
            end: currentDay.hour(17),
          });
        }}
      >
        <img src={`${AWS_CDN_URL}/icons/AddShift.svg`} alt="" />
      </button>
    </Cell>
  );
};

const Cell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0px;
  font-size: 14px;
  line-height: 16px;
  border-top: solid #c4c4c4 1px;
  border-right: solid #c4c4c4 1px;
  height: 100px;
  max-height: 100px;

  &.no-top-border {
    border-top: none;
  }
  &.no-right-border {
    border-right: none;
  }

  span {
    font-size: 14px;
    line-height: 16px;
    color: #74767b;
    margin-bottom: 6px;
  }
`;

export default AddShiftCell;
