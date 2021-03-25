import React from "react";
import CalendarFilter from "components/Calendar/components/Filter";

import {
  Filter,
  FilterWrapper,
  Dates,
  DatePlaceHolder,
  DateWrapper,
  Placeholder,
} from "components/Calendar/styles/CalendarComponents";

const CalendarHeader = ({
  prevWeek,
  nextWeek,
  week,
  months,
  fullDate,
  generateWeek,
  concatGoogleEvents,
  filterBySource,
  eventType,
  setEventType,
}) => {
  if (week.length)
    return (
      <FilterWrapper>
        <Filter>
          <CalendarFilter
            week={week}
            prevWeek={prevWeek}
            nextWeek={nextWeek}
            months={months}
            fullDate={fullDate}
            generateWeek={generateWeek}
            concatGoogleEvents={concatGoogleEvents}
            filterBySource={filterBySource}
            eventType={eventType}
            setEventType={setEventType}
          />
          <div />
        </Filter>
        <Dates>
          <DatePlaceHolder />
          <DateWrapper>
            {week.map((day, index) => {
              let date = day.toString().split(" ");
              let todayDate = fullDate.toString();
              todayDate = todayDate.slice(0, 15);
              const todayClass =
                todayDate === day.toString().slice(0, 15) ? `today` : ``;
              return (
                <Placeholder
                  key={`table-placeholder–#${index + 1}`}
                  className={`${todayClass} placeholder`}
                >
                  {date[0]} <span>{date[2]}</span>
                </Placeholder>
              );
            })}
          </DateWrapper>
        </Dates>
      </FilterWrapper>
    );
  return null;
};

export default CalendarHeader;
