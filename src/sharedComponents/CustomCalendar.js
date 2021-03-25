import React, { useState, useEffect } from "react";
import styled from "styled-components";

const CustomCalendar = ({ type, initialValue, returnValue }) => {
  const [monthStart, setMonthStart] = useState(undefined);

  useEffect(() => {
    if (initialValue) {
      setMonthStart(
        type === "week-range"
          ? initialValue.start.startOf("month")
          : initialValue.startOf("month")
      );
    }
  }, [initialValue, type]);

  const onClickDay = (day) => {
    if (type === "week-range") {
      returnValue({
        start: day.startOf("week"),
        end: day.endOf("week"),
      });
    } else {
      returnValue(day);
    }
    if (day.month() !== monthStart.month()) {
      setMonthStart(day.startOf("month"));
    }
  };

  return (
    <>
      {monthStart !== undefined && (
        <>
          <RangeSelect monthStart={monthStart} setMonthStart={setMonthStart} />
          <DatePicker
            monthStart={monthStart}
            onClickDay={onClickDay}
            type={type}
            initialValue={initialValue}
          />
        </>
      )}
    </>
  );
};

const DatePicker = ({ monthStart, type, onClickDay, initialValue }) => {
  const [datesRange, setDatesRange] = useState(undefined);
  const [monthInt, setMonthInt] = useState(monthStart.month());

  useEffect(() => {
    let datesArray = [];
    let startOfWeek = monthStart.startOf("week");
    for (let i = 0; i < 35; i++) {
      datesArray.push(startOfWeek.add(i, "day"));
    }
    if (datesArray[datesArray.length - 1].month() === monthStart.month()) {
      for (let i = 35; i < 42; i++) {
        datesArray.push(startOfWeek.add(i, "day"));
      }
    }
    setDatesRange(datesArray);
    setMonthInt(monthStart.month());
  }, [monthStart]);

  return (
    <Container>
      <Day>Mon</Day>
      <Day>Tue</Day>
      <Day>Wed</Day>
      <Day>Thu</Day>
      <Day>Fri</Day>
      <Day className="saturday">Sat</Day>
      <Day>Sun</Day>
      {datesRange &&
        datesRange.map((day, index) => (
          <DateComponent
            key={`date-display-${index}`}
            day={day}
            monthInt={monthInt}
            onClickDay={onClickDay}
            type={type}
            initialValue={initialValue}
          />
        ))}
    </Container>
  );
};

const DateComponent = ({ day, monthInt, onClickDay, type, initialValue }) => {
  const [classNames, setClassNames] = useState("");

  useEffect(() => {
    let sel = "";
    if (type === "week-range") {
      if (initialValue.start.epoch === day.startOf("week").epoch) {
        sel = "selected-day";
      }
    } else {
      if (initialValue.startOf("day").epoch === day.epoch) {
        sel = "selected-day";
      }
    }

    setClassNames(`
${day.month() !== monthInt ? "other-month" : ""} ${
      day.day() === 6 ? "saturday" : ""
    } ${sel}
      `);
  }, [day]);

  return (
    <DateButton className={classNames} onClick={() => onClickDay(day)}>
      {day.date()}
    </DateButton>
  );
};

const RangeSelect = ({ monthStart, setMonthStart }) => {
  //
  const moveTime = (move) => {
    if (move === "next") {
      setMonthStart(monthStart.add(1, "month"));
    } else {
      setMonthStart(monthStart.subtract(1, "month"));
    }
  };
  return (
    <div className="leo-flex-center-center">
      <button onClick={() => moveTime("prev")}>
        <i className="fas fa-caret-left"></i>
      </button>
      <DateRangeDisplay>
        {months[monthStart.month()]} {monthStart.year()}
      </DateRangeDisplay>
      <button onClick={() => moveTime("next")}>
        <i className="fas fa-caret-right"></i>
      </button>
    </div>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 10px;
  text-align: center;
`;

const Day = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: #74767b;
  padding-bottom: 10px;
  border-bottom: solid #eee 1px;

  &.saturday {
    border-left: solid #eee 1px;
  }
`;

const DateRangeDisplay = styled.div`
  margin: 10px 25px;
  width: 115px;
  text-align: center;
`;

const DateButton = styled.button`
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: #2a3744;
  padding: 6px;

  &.other-month {
    color: #d4dfea;
  }

  &.saturday {
    border-left: solid #eee 1px;
  }

  &.selected-day {
    background: #2a3744;
    color: white;
    border: none;
  }
`;

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

export default CustomCalendar;
