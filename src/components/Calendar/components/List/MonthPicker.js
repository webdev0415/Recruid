import React from "react";
import { PickMonth } from "containers/Calendar/styles/CalendarComponents";

const monthList = [
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

const MonthPicker = ({ currentDate, setMonth, setDisplayPicker }) => {
  return (
    <PickMonth.Wrapper>
      {monthList.map((month, index) => {
        const currentMonth = currentDate.toString().split(" ")[1];
        let isCurrentMonth = month === currentMonth ? `currentMonth` : ``;
        return (
          <PickMonth.MonthCell
            key={`month-#${index}`}
            className={isCurrentMonth}
            onClick={() => {
              setMonth(index);
              setDisplayPicker(false);
            }}
          >
            {month}
          </PickMonth.MonthCell>
        );
      })}
    </PickMonth.Wrapper>
  );
};

export default MonthPicker;
