import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import moment from "moment";
// import "moment-timezone";
import spacetime from "spacetime";

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: solid #e4e4e4 1px;
`;

const DatePicker = styled.div`
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
`;

const DateButtons = styled.div`
  margin-left: -7px;
  margin-right: -7px;
`;

const CustomSelect = styled.select`
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-shadow: none;
  color: #1e1e1e;
  font-size: 12px;
  height: 40px;
  padding-left: 15px;
  max-width: 150px;
  margin-left: 15px;
  padding: 10px;
  -webkit-padding-end: 30px !important;
`;

const TimeZoneSelectStyle = styled(CustomSelect)`
  max-width: 200px;
`;

const TimeInputs = styled.div`
  position: relative;
  border: 1px solid #eee;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0;

  &:first-child {
    margin-right: 10px;
  }

  label {
    border-right: 1px solid #eee;
    padding: 8px;
  }

  input {
    border: none;
    outline: none;
    font-size: 12px;
    text-align: center;
    padding-left: 15px;

    &::-webkit-clear-button {
      display: none;
    }
  }
`;

// const EndTimeWarning = styled.span`
//   position: absolute;
//   left: 0;
//   bottom: 140%;
//   font-size: 11px;
//   min-width: 285px;
//   z-index: 2;
// `;

const DateSelector = ({
  date,
  setNewDate,
  fetchAllMembersInterviews,
  selectedDuration,
  setSelectedDuration,
  timeZone,
  setTimeZone,
}) => {
  const [startTime, setStartTime] = useState(``);
  const [endTime, setEndTime] = useState(``);
  // const [displayWarning, setDisplayWarning] = useState(false);
  //
  const moveDate = (backForw) => {
    let dayMl = 1000 * 60 * 60 * 24;
    let newDate;
    if (backForw === "back") {
      newDate = new Date(Date.parse(date) - dayMl);
    } else {
      newDate = new Date(Date.parse(date) + dayMl);
    }
    setNewDate(newDate);
    fetchAllMembersInterviews(newDate);
  };
  // Initial start & end state
  useEffect(() => {
    if (!startTime.length) {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let nextHours = hours < 10 ? `0${hours}` : `${hours}`;
      let nextMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      let nextStartTime = `${nextHours}:${nextMinutes}`;
      setStartTime(nextStartTime);
    }
    if (!endTime.length) {
      let nextDate = new Date(date);
      nextDate = new Date(nextDate.getTime() + selectedDuration * 60000);
      let hours = nextDate.getHours();
      let minutes = nextDate.getMinutes();
      let nextHours = hours < 10 ? `0${hours}` : `${hours}`;
      let nextMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      let nextEndTime = `${nextHours}:${nextMinutes}`;
      setEndTime(nextEndTime);
    }
  }, [date, selectedDuration, startTime.length, endTime.length]);
  // Change start input if the date has been set by column click

  useEffect(() => {
    let prevHours =
      date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
    let prevMinutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    let prevStart = `${prevHours}:${prevMinutes}`;
    if (prevStart !== startTime) {
      setStartTime(prevStart);
    }
    let endDate = new Date(date.getTime() + selectedDuration * 60000);
    let endHours =
      endDate.getHours() < 10
        ? `0${endDate.getHours()}`
        : `${endDate.getHours()}`;
    let endMinutes =
      endDate.getMinutes() < 10
        ? `0${endDate.getMinutes()}`
        : `${endDate.getMinutes()}`;
    let ending = `${endHours}:${endMinutes}`;
    setEndTime(ending);
    // eslint-disable-next-line
  }, [date]);

  // Change end input if the date has been set by column click
  // useEffect(() => {
  //   const endDate = new Date(date);
  //   endDate.setMinutes(selectedDuration + endDate.getMinutes());
  //   let endTimeStr = endDate.toTimeString();
  //   let nextEndTime = endTimeStr.substring(0, 5);
  //   if (endTime !== nextEndTime) setEndTime(nextEndTime);
  //   // eslint-disable-next-line
  // }, [date]);

  // Handle start input change
  useEffect(() => {
    if (selectedDuration === 0) {
      setSelectedDuration(30);
    }
    if (startTime.length) {
      let selectedTimeArr = startTime.split(":");
      setNewDate((date) => {
        let nextDate = new Date(date);
        nextDate.setHours(selectedTimeArr[0]);
        nextDate.setMinutes(selectedTimeArr[1]);
        return nextDate;
      });
    }
    // eslint-disable-next-line
  }, [startTime, selectedDuration]);

  // Handle end input change
  useEffect(() => {
    if (!!endTime.length && selectedDuration > 0) {
      // setDisplayWarning(false);
      let selectedTimeArr = endTime.split(":");
      let nextDate = new Date(date);
      nextDate.setHours(selectedTimeArr[0]);
      nextDate.setMinutes(selectedTimeArr[1]);
      let durationInHours = nextDate.getHours() - date.getHours();
      let minutesDuration = 0 - (date.getMinutes() - nextDate.getMinutes());
      // if (minutesDuration % 15 !== 0) {
      //   minutesDuration = minutesDuration - (minutesDuration % 15);
      // }
      let nextDuration = durationInHours * 60 + minutesDuration;
      if (nextDuration > 0) {
        setSelectedDuration(nextDuration);
      } else if (nextDuration < 0) {
        // setDisplayWarning(true);
        let selectedTimeArr = endTime.split(":");
        let nextDate = new Date(date);
        nextDate.setHours(selectedTimeArr[0]);
        nextDate.setMinutes(selectedTimeArr[1]);
        nextDate.setDate(date.getDate() + 1);
        let nextDuration = Math.abs(nextDate - date);
        nextDuration = Math.floor(nextDuration / 1000 / 60);
        setSelectedDuration(nextDuration);
      }
    }
    // eslint-disable-next-line
  }, [endTime]);

  return (
    <SelectorContainer>
      <DatePicker>
        <DateButtons>
          <button onClick={() => moveDate("back")}>
            <svg
              width="7"
              height="12"
              xmlns="http://www.w3.org/2000/svg"
              xlinkHref="http://www.w3.org/1999/xlink"
            >
              <path
                d="M7 10.59L2.673 6 7 1.41 5.668 0 0 6l5.668 6z"
                fill="#9A9CA1"
                fill-role="nonzero"
              />
            </svg>
          </button>
          <button onClick={() => moveDate("forward")}>
            <svg
              width="7"
              height="12"
              xmlns="http://www.w3.org/2000/svg"
              xlinkHref="http://www.w3.org/1999/xlink"
            >
              <path
                d="M0 10.59L4.327 6 0 1.41 1.332 0 7 6l-5.668 6z"
                fill="#9A9CA1"
                fill-role="nonzero"
              />
            </svg>
          </button>
        </DateButtons>
        <h3>
          {date.toLocaleString("en-GB", {
            dateStyle: "full",
          })}
        </h3>
      </DatePicker>
      <div className="leo-flex">
        <TimeInputs>
          <label htmlFor="start-time">
            <svg width="12" height="12">
              <path
                d="M6 0a6 6 0 1 0 0 12A6 6 0 0 0 6 0zm0 10.91A4.909 4.909 0 1 1 6 1.09a4.909 4.909 0 0 1 0 9.818zm2.022-3.66a.546.546 0 0 1-.771.772L5.614 6.386A.545.545 0 0 1 5.454 6V2.727a.545.545 0 0 1 1.091 0v3.047l1.477 1.477z"
                fill="#C1C3C8"
                fill-role="nonzero"
              />
            </svg>
          </label>
          <input
            type="time"
            id="start-time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </TimeInputs>
        <TimeInputs>
          <label htmlFor="end-time">
            <svg width="12" height="12">
              <path
                d="M6 0a6 6 0 1 0 0 12A6 6 0 0 0 6 0zm0 10.91A4.909 4.909 0 1 1 6 1.09a4.909 4.909 0 0 1 0 9.818zm2.022-3.66a.546.546 0 0 1-.771.772L5.614 6.386A.545.545 0 0 1 5.454 6V2.727a.545.545 0 0 1 1.091 0v3.047l1.477 1.477z"
                fill="#C1C3C8"
                fill-role="nonzero"
              />
            </svg>
          </label>
          <input
            type="time"
            id="end-time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </TimeInputs>
        <CustomSelect
          name="duration"
          onChange={(e) => setSelectedDuration(Number(e.target.value))}
        >
          <option selected disabled>
            {selectedDuration} mins
          </option>
          <option value={15}>15 mins</option>
          <option value={30}>30 mins</option>
          <option value={45}>45 mins</option>
          <option value={60}>1 hr</option>
          <option value={75}>1 hr 15 mins</option>
        </CustomSelect>
        <TimeZoneSelect
          timeZone={timeZone}
          setTimeZone={setTimeZone}
          date={date}
          setNewDate={setNewDate}
        />
      </div>
    </SelectorContainer>
  );
};

export default DateSelector;

const TimeZoneSelect = ({ timeZone, setTimeZone, date }) => {
  // const localOffset = new Date(Date.now()).getTimezoneOffset() / 60;
  const [offset, setOffset] = useState(undefined);
  const [selectValue, setValue] = useState("select");
  const [tzOptions, setTzOptions] = useState([]);

  const prepareOffset = (value) => {
    let offSetDate = new spacetime(date, value);
    setOffset(offSetDate);
    setValue(value);
  };

  useEffect(() => {
    if (offset) {
      setTimeZone(offset);
    }
  }, [offset, date, setTimeZone]);

  useEffect(() => {
    let dateLocal = spacetime.now();
    let tempArr = [];
    timeZoneOptions.map((option) => {
      let optionDate = spacetime.now(option.zone);
      option.offset = dateLocal.offset() / 60 - optionDate.offset() / 60;
      option.offset =
        option.offset > 0
          ? `-${Math.abs(option.offset)}h`
          : option.offset < 0
          ? `+${Math.abs(option.offset)}h`
          : "";
      tempArr.push(option);
      return null;
    });
    setTzOptions(tempArr);
  }, []);

  return (
    <TimeZoneSelectStyle
      name="timezone-select"
      onChange={(e) => prepareOffset(e.target.value)}
      value={selectValue}
      timeZone={timeZone}
    >
      <option value={"select"} disabled>
        Display another timezone
      </option>
      {tzOptions.map((option, index) => (
        <option value={option.zone} key={`zone-option-${index}`}>
          {`Local ${option.offset} `}
          {option.text}
          {` ${option.gmt}`}
        </option>
      ))}
    </TimeZoneSelectStyle>
  );
};

const timeZoneOptions = [
  { zone: "Etc/GMT+12", text: "Eniwetok, Kwajalein", gmt: "(GMT -12:00)" },
  { zone: "Pacific/Niue", text: "Midway Island, Samoa", gmt: "(GMT -11:00)" },
  { zone: "Pacific/Honolulu", text: "Hawaii", gmt: "(GMT -10:00)" },
  { zone: "America/Anchorage", text: " Alaska", gmt: "(GMT -9:00)" },
  {
    zone: "America/Los_Angeles",
    text: "Pacific Time (US &amp; Canada)",
    gmt: "(GMT -8:00)",
  },
  {
    zone: "America/Edmonton",
    text: "Mountain Time (US &amp; Canada)",
    gmt: "(GMT -7:00)",
  },
  {
    zone: "America/Mexico_City",
    text: "Central Time (US &amp; Canada), Mexico City",
    gmt: "(GMT -6:00)",
  },
  {
    zone: "America/New_York",
    text: "Eastern Time (US &amp; Canada)",
    gmt: "(GMT -5:00)",
  },
  { zone: "America/Lima", text: "Bogota, Lima", gmt: "(GMT -5:00)" },
  {
    zone: "America/Halifax",
    text: " Atlantic Time, Caracas, La Paz",
    gmt: "(GMT -4:00)",
  },
  {
    zone: "America/Argentina/Buenos_Aires",
    text: "Brazil, Buenos Aires, Georgetown",
    gmt: "(GMT -3:00)",
  },
  { zone: "Etc/GMT-2", text: "Mid-Atlantic", gmt: "(GMT -2:00)" },
  {
    zone: "Atlantic/Azores",
    text: "Azores, Cape Verde Islands",
    gmt: "(GMT -1:00)",
  },
  {
    zone: "Europe/London",
    text: "Western Europe Time, London, Lisbon, Casablanca",
    gmt: "(GMT)",
  },
  {
    zone: "Europe/Brussels",
    text: "Brussels, Copenhagen, Madrid, Paris",
    gmt: "(GMT +1:00)",
  },
  {
    zone: "Europe/Kaliningrad",
    text: " Kaliningrad, South Africa",
    gmt: "(GMT +2:00)",
  },
  {
    zone: "Europe/Moscow",
    text: " Baghdad, Riyadh, Moscow, St. Petersburg",
    gmt: "(GMT +3:00)",
  },
  {
    zone: "Asia/Dubai",
    text: " Abu Dhabi, Muscat, Baku, Tbilisi",
    gmt: "(GMT +4:00)",
  },
  {
    zone: "Asia/Yekaterinburg",
    text: "Ekaterinburg, Islamabad, Karachi, Tashkent",
    gmt: "(GMT +5:00)",
  },
  { zone: "Asia/Almaty", text: "Almaty, Dhaka, Colombo", gmt: "(GMT +6:00)" },
  { zone: "Asia/Bangkok", text: "Bangkok, Hanoi, Jakarta", gmt: "(GMT +7:00)" },
  {
    zone: "Asia/Hong_Kong",
    text: "Beijing, Perth, Singapore, Hong Kong",
    gmt: "(GMT +8:00)",
  },
  {
    zone: "Asia/Tokyo",
    text: "Tokyo, Seoul, Osaka, Sapporo, Yakutsk",
    gmt: "(GMT +9:00)",
  },
  {
    zone: "Pacific/Guam",
    text: "Eastern Australia, Guam, Vladivostok",
    gmt: "(GMT +10:00)",
  },
  {
    zone: "Asia/Magadan",
    text: "Magadan, Solomon Islands, New Caledonia",
    gmt: "(GMT +11:00)",
  },
  {
    zone: "Pacific/Auckland",
    text: "Auckland, Wellington, Fiji, Kamchatka",
    gmt: "(GMT +12:00)",
  },
  { zone: "Pacific/Apia", text: " Apia, Nukualofa", gmt: "(GMT +13:00)" },
];
