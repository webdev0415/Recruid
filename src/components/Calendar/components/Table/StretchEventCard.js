import React from "react";
import styled from "styled-components";

const StretchCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(232, 250, 254, 0.5);
  border-radius: 4px;
  box-shadow: 0px 0px 0px 1px #ffffff;
  border: 1px solid #004a6d;
  color: #004a6d;
  font-size: 10px;
  text-align: center;
  left: 1px;
  position: absolute;
  top: calc(${(props) => props.startPosition}% + 2px);
  min-height: 15px;
  width: calc(100% - 15px);
  z-index: 1000;
`;

export default function StretchEventCard({ startPosition, height, timeRange }) {
  return (
    <StretchCard
      startPosition={startPosition}
      style={{ height: `calc(${height}% + 0.1px)` }}
    >
      <span className="noselect">
        {!!timeRange.start &&
          `${timeRange.start.getHours()}:${
            !timeRange.start.getMinutes() ? `00` : timeRange.start.getMinutes()
          }`}
        {!!timeRange.end &&
          ` - ${timeRange.end.getHours()}:${
            !timeRange.end.getMinutes() ? `00` : timeRange.end.getMinutes()
          }`}
      </span>
    </StretchCard>
  );
}
