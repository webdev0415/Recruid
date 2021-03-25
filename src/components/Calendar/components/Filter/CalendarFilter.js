import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import spacetime from "spacetime";
import { CalendarContext } from "contexts/calendarContext/calendarProvider";
// Components
import MembersFilter from "components/Calendar/components/shared/MembersFilter";
import CalendarApiUI from "components/Calendar/components/shared/CalendarApiUI";
// Packages
import DatePicker from "react-datepicker";
import "components/Calendar/styles/datepciker.scss";

const MonthToggle = ({
  week,
  prevWeek,
  nextWeek,
  months,
  fullDate,
  origin = "table",
  prevMonth = null,
  nextMonth = null,
  currentDate = null,
  setMonth = null,
  generateWeek = null,
  selectedDate,
  eventType,
  setEventType,
}) => {
  const { state, dispatch } = useContext(CalendarContext);
  const [monthToDisplay, setMonthToDisplay] = useState(``);
  const [displayPicker, setDisplayPicker] = useState(false);
  const [resetTMFilter, setResetTMFilter] = useState(false);
  const [timeZoneName, setTimeZoneName] = useState(undefined);

  useEffect(() => {
    if (origin === "table" && week.length > 6) {
      let firstMonth = week[0].getMonth();
      let secondMonth = week[week.length - 1].getMonth();
      if (firstMonth === secondMonth) {
        setMonthToDisplay(`${months[firstMonth]} ${week[0].getFullYear()}`);
      } else
        setMonthToDisplay(
          `${months[firstMonth]} ${week[0].getFullYear()} - ${
            months[secondMonth]
          } ${week[week.length - 1].getFullYear()}`
        );
    }
  }, [week, months, origin]);

  const prevFunc = () => (origin === "table" ? prevWeek() : prevMonth());
  const nextFunc = () => (origin === "table" ? nextWeek() : nextMonth());
  const togglePicker = (event) => {
    if (event.target.id === "picker-trigger") {
      setDisplayPicker(!displayPicker);
    }
  };

  useEffect(() => {
    let dateLocal = spacetime.now();
    let arr = dateLocal.tz.split("/");
    arr = arr.map((name) => `${name[0].toUpperCase()}${name.substring(1)}`);
    dateLocal = arr.join(", ");
    setTimeZoneName(dateLocal);
  }, []);

  return (
    <Filter.FilterWrapper
      onMouseLeave={() => setResetTMFilter(true)}
      onMouseEnter={() => setResetTMFilter(false)}
    >
      <Filter.DateChanger>
        <Filter.DateButtons>
          <button onClick={prevFunc}>
            <svg
              width="7"
              height="12"
              xmlns="http://www.w3.org/2000/svg"
              xlinkHref="http://www.w3.org/1999/xlink"
            >
              <path
                d="M7 10.59L2.673 6 7 1.41 5.668 0 0 6l5.668 6z"
                fill="#9A9CA1"
                fillRule="nonzero"
              />
            </svg>
          </button>
          <button onClick={nextFunc}>
            <svg
              width="7"
              height="12"
              xmlns="http://www.w3.org/2000/svg"
              xlinkHref="http://www.w3.org/1999/xlink"
            >
              <path
                d="M0 10.59L4.327 6 0 1.41 1.332 0 7 6l-5.668 6z"
                fill="#9A9CA1"
                fillRule="nonzero"
              />
            </svg>
          </button>
        </Filter.DateButtons>
        <h3 id="picker-trigger" onClick={togglePicker} className="noselect">
          {origin === "table"
            ? monthToDisplay
            : currentDate &&
              `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          {displayPicker && origin === "list" && (
            <DatePicker
              inline
              startDate={currentDate}
              selected={selectedDate}
              onChange={(date) => {
                setMonth(date);
                setDisplayPicker(false);
              }}
            />
          )}
          {displayPicker && origin === "table" && (
            <DatePicker
              inline
              startDate={fullDate}
              onChange={(date) => {
                generateWeek(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate()
                );
                setDisplayPicker(false);
              }}
            />
          )}
        </h3>
        <ToggleContainer>
          {[
            { value: "all", title: "All" },
            { value: "meeting", title: "Meetings" },
            { value: "interview", title: "Interviews" },
          ].map((option, index) => (
            <React.Fragment key={`input-radio-${index}`}>
              <ToggleOption
                className={`${option.value} ${
                  (option.value === eventType ||
                    (option.value === "all" && Array.isArray(eventType))) &&
                  "active"
                }`}
              >
                <input
                  type="radio"
                  id={option.value}
                  name="event_type"
                  value={option.value}
                  checked={
                    eventType === option.value
                      ? true
                      : Array.isArray(eventType) && option.value === "all"
                      ? true
                      : false
                  }
                  onChange={(e) => {
                    if (option.value !== "all") {
                      setEventType(e.target.value);
                    } else {
                      setEventType(["interview", "meeting"]);
                    }
                  }}
                />

                <label htmlFor={option.value}>
                  {(option.value === "meeting" ||
                    option.value === "interview") && <div className="key" />}
                  {option.title}
                </label>
              </ToggleOption>
            </React.Fragment>
          ))}
        </ToggleContainer>
      </Filter.DateChanger>
      <Filter.Members>
        <MembersFilter resetTMFilter={resetTMFilter} />
      </Filter.Members>
      <Filter.Options>
        <TimezoneName>{timeZoneName}</TimezoneName>
        {state.globalView === "table" ? (
          <Filter.ViewToggle
            onClick={() =>
              dispatch({ type: "SET_GLOBAL_VIEW", payload: "list" })
            }
          >
            Switch to List
          </Filter.ViewToggle>
        ) : (
          <Filter.ViewToggle
            onClick={() =>
              dispatch({ type: "SET_GLOBAL_VIEW", payload: "table" })
            }
          >
            Switch to Calendar
          </Filter.ViewToggle>
        )}
        <CalendarApiUI />
      </Filter.Options>
    </Filter.FilterWrapper>
  );
};

export default MonthToggle;

const ToggleContainer = styled.div`
  display: flex;
  // border: 1px solid #eee;
  border-radius: 4px;
  margin-left: 30px;
`;

const ToggleOption = styled.div`
  border: 1px solid #eee;
  display: flex;
  font-size: 12px;

  &:not(:first-child) {
    margin-left: -1px;
  }

  &.all {
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;

    label {
      padding: 4px 15px;
    }

    &.active {
      background: #2a3744;
      border-color: #2a3744;
      color: #fff;
    }
  }

  &.meeting {
    &.active {
      background: #ffa076;
      border-color: rgba(0, 0, 0, 0.1);
    }

    .key {
      background: #e6906a;
    }
  }

  &.interview {
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;

    .key {
      background: #e8fafe;
    }

    &.active {
      background: #e8fafe;
      border-color: rgba(0, 0, 0, 0.1);

      .key {
        background: #d1e1e5;
      }
    }
  }

  .key {
    background: #fff;
    border-radius: 50%;
    height: 15px;
    margin-right: 8px;
    width: 15px;
  }

  input {
    display: none;
  }

  label {
    align-items: center;
    cursor: pointer;
    display: flex;
    padding: 4px 10px;
  }
`;

const Filter = {
  FilterWrapper: styled.div`
    align-items: center;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* justify-content: space-between; */
    padding: 10px 15px;
    width: 100%;
  `,

  ViewToggle: styled.button`
    background: #ffffff;
    border: 1px solid #eee;
    border-radius: 4px;
    color: #1e1e1e;
    display: flex;
    font-size: 12px;
    padding: 4px 12px;

    &:hover {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
  `,

  DateChanger: styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-start;

    button {
      padding: 0 7px;

      &:hover {
        svg {
          path {
            fill: #1e1e1e;
          }
        }
      }
    }

    h3 {
      cursor: pointer;
      font-size: 15px;
      line-height: 1;
      margin-left: 15px;
      position: relative;
    }
  `,

  DateButtons: styled.div`
    margin-left: -7px;
    margin-right: -7px;
  `,

  Options: styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;
  `,

  Members: styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
  `,
};

const TimezoneName = styled.div`
  font-size: 12px;
  margin-right: 15px;
`;
