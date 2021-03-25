import React from "react";
import styled from "styled-components";
import useDropdown from "hooks/useDropdown";
import CustomCalendar from "sharedComponents/CustomCalendar";
const WeekSelector = ({ timeRange, setTimeRange }) => {
  const { node, showSelect, setShowSelect } = useDropdown();

  const moveTime = (move) => {
    if (move === "next") {
      setTimeRange({
        start: timeRange.start.add(7, "day"),
        end: timeRange.end.add(7, "day"),
      });
    } else {
      setTimeRange({
        start: timeRange.start.subtract(7, "day"),
        end: timeRange.end.subtract(7, "day"),
      });
    }
  };

  return (
    <Wrapper ref={node}>
      <ArrowButton className="left-radius" onClick={() => moveTime("prev")}>
        <svg
          width="7"
          height="12"
          xmlns="http://www.w3.org/2000/svg"
          xlinkHref="http://www.w3.org/1999/xlink"
        >
          <path
            d="M7 10.59L2.673 6 7 1.41 5.668 0 0 6l5.668 6z"
            fill="#2A3744"
            fill-role="nonzero"
          />
        </svg>
      </ArrowButton>
      <DateContainer>
        <span>
          {months[timeRange.start.month()]} {timeRange.start.date()} -{" "}
          {months[timeRange.end.month()]} {timeRange.end.date()},{" "}
          {timeRange.end.year()}
        </span>
        <button onClick={() => setShowSelect(true)}>
          <i className="far fa-calendar-alt"></i>
        </button>
      </DateContainer>
      <ArrowButton className="right-radius" onClick={() => moveTime("next")}>
        <svg
          width="7"
          height="12"
          xmlns="http://www.w3.org/2000/svg"
          xlinkHref="http://www.w3.org/1999/xlink"
        >
          <path
            d="M0 10.59L4.327 6 0 1.41 1.332 0 7 6l-5.668 6z"
            fill="#2A3744"
            fill-role="nonzero"
          />
        </svg>
      </ArrowButton>
      {showSelect && (
        <CalendarContainer>
          <CustomCalendar
            type="week-range"
            initialValue={timeRange}
            returnValue={(val) => {
              setTimeRange(val);
              setShowSelect(false);
            }}
          />
        </CalendarContainer>
      )}
    </Wrapper>
  );
};

export default WeekSelector;

const Wrapper = styled.div`
  position: relative;
  display: flex;
`;

const ArrowButton = styled.button`
  padding: 3px 10px;
  border: 1px solid #c4c4c4;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;

  &.left-radius {
    border-radius: 15px 0px 0px 15px;
  }
  &.right-radius {
    border-radius: 0px 15px 15px 0px;
  }
`;

const DateContainer = styled.div`
  border-top: 1px solid #c4c4c4;
  border-bottom: 1px solid #c4c4c4;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  background: white;
  justify-content: space-evenly;

  span {
    margin-left: 15px;
    margin-right: 15px;
    font-size: 12px;
    line-height: 15px;
    color: #2a3744;
  }
  button {
    color: #2a3744;
  }
`;

const CalendarContainer = styled.div`
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  position: absolute;
  background: #ffffff;
  top: 40px;
  left: 25px;
  z-index: 10;
`;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
