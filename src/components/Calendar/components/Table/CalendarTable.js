import React, { useEffect, useState, useContext } from "react";
// components
import CalendarHeader from "components/Calendar/components/shared/CalendarHeader";
import { EventCard } from "components/Calendar/components/shared/EventCard.js";
import StretchEventCard from "components/Calendar/components/Table/StretchEventCard";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { CalendarContext } from "contexts/calendarContext/calendarProvider";
import { permissionChecker } from "constants/permissionHelpers";
// Styles
import {
  ColumnWrapper,
  DateWrapper,
  Table,
  TableContainer,
  TableWrapper,
  TimeColumn,
  DateColumn,
  TimeSlot,
} from "components/Calendar/styles/CalendarComponents";
// Helpers
import { API_ROOT_PATH } from "constants/api";
import { getGoogleEventsByRange } from "helpers/calendar/eventsActions";
import notify from "notifications";

const CalendarTable = ({
  week,
  openModal,
  prevWeek,
  nextWeek,
  months,
  diplayEventOverview,
  generateWeek,
  eventType,
  setEventType,
}) => {
  const store = useContext(GlobalContext);
  const { state } = useContext(CalendarContext);
  const [events, setEvents] = useState([]);
  const [sortedEvents, setSortedEvents] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filteredBySource, setFilteredBySource] = useState([]);
  // State for stretching event card
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isMouseMove, setIsMouseMove] = useState(false);
  const [stretchCardChosenDate, setStretchCardChosenDate] = useState(null);
  const [stretchCardStartPosition, setStretchCardStartPosition] = useState(0);
  const [stretchCardHeight, setStretchCardHeight] = useState(0);
  const [stretchCardTime, setStretchCardTime] = useState({
    start: null,
    end: null,
  });
  // According to the calculation one quarter takes around 1% of the column height which makes it easy to style in that way
  // So we take the time event starts and find the ammount of quarters that are in there. That's gonna be our top position of the element.
  const startingPosition = (startDate) => {
    const hours = startDate.getHours();
    const minutes = startDate.getMinutes();
    let start = hours * 60 + minutes;
    return start / 15;
  };
  // Function calculates the duration of an interview in minutes and then conver it into number of quarters(15 min)
  // as it is the smallest time duration so the minimum height of the Card
  const duration = (endDate, startDate) => {
    const endHours = endDate.getHours();
    const endMinutes = endDate.getMinutes();
    const startHours = startDate.getHours();
    const startMinutes = startDate.getMinutes();
    let end = endHours * 60 + endMinutes;
    let start = startHours * 60 + startMinutes;
    return (end - start) / 15;
  };
  const generateTimeSlots = () => {
    const root = document.getElementById("root");
    let afterWidth = root.offsetWidth;
    let substraction = afterWidth * 0.255;
    afterWidth -= substraction;
    let nextTimeSlots = [];
    for (let i = 0; i < 24; i++) {
      nextTimeSlots.push(
        <TimeSlot
          key={`time-slot-#${i + 1}`}
          position={i * 4}
          width={afterWidth}
          className="noselect"
        >{`${i}:00`}</TimeSlot>
      );
    }
    setTimeSlots([...nextTimeSlots]);
  };
  // Filter google events by source (google, recruitd, all)
  useEffect(() => setFilteredBySource(events), [events]);
  function filterBySource(source) {
    if (source === "reset") {
      setFilteredBySource(events);
      return;
    }
    const nextEvents = events.filter((event) => event.source === source);
    setFilteredBySource(nextEvents);
    return;
  }

  function filterByGId(arr) {
    let output = [];
    let counter = {};
    for (let item of arr) {
      if (item.g_id) counter[item.g_id] = (counter[item.g_id] || 0) + 1;
      else output.push(item);
      if (counter[item.g_id] <= 1) output.push(item);
    }
    return output;
  }
  // Initial fetch call for the events in range of 2 dates
  useEffect(() => {
    // @params: start data, end date, token
    (async function fetchEventsByWeek(calendarId, gToken) {
      const startDate = new Date(
        week[0].getFullYear(),
        week[0].getMonth(),
        week[0].getDate(),
        1
      );
      const endDate = new Date(
        week[week.length - 1].getFullYear(),
        week[week.length - 1].getMonth(),
        week[week.length - 1].getDate(),
        23,
        59,
        59
      );
      const body = {
        start: startDate,
        end: endDate,
        professional_ids: calendarId,
        active_company: store.company.id,
        event_type: eventType,
      };
      const url = `${API_ROOT_PATH}/v1/interview_events/all_events`;
      const params = {
        method: "POST",
        headers: store.session,
        body: JSON.stringify(body),
      };
      try {
        const getData = await fetch(url, params);
        const data = await getData.json();
        for await (let event of data) {
          event[`date`] = new Date(event.start);
          event[`dateEnd`] = new Date(event.end);
          delete event.start;
          delete event.end;
        }
        if (!!gToken.length && calendarId.indexOf(store.session.id) !== -1) {
          const googleEvents = await getGoogleEventsByRange(
            startDate.toISOString(),
            endDate.toISOString(),
            gToken
          );
          let nextEvents = [...data, ...googleEvents];
          return setEvents(filterByGId(nextEvents));
        }
        return setEvents(data);
      } catch (e) {
        notify("danger", `Error getting interviews list!`);
      }
    })(state.calendarId, state.gToken);
     
  }, [
    store.company,
    week,
    state.calendarId,
    store.session,
    state.forceUpdate,
    state.gToken,
    eventType,
  ]);
  // An effect that we want to run once receive events property form the parent
  useEffect(() => {
    // Each nested array represents day of the week so getDay function gives us index to push to
    (async function generateEventCards() {
      let groupedEvents = [[], [], [], [], [], [], []];
      await filteredBySource.forEach((event, index) => {
        let day = event.date.getDay();
        if (!isNaN(event.date)) {
          groupedEvents[day].push(
            <EventCard
              key={`interview-card-#${index}`}
              startingPosition={startingPosition(event.date)}
              duration={duration(event.dateEnd, event.date)}
              event={event}
              eventAction={diplayEventOverview}
              zIndex={Math.floor(Number(startingPosition(event.date)))}
              openModal={openModal}
              session={store.session}
            />
          );
        }
      });
      await setSortedEvents(groupedEvents);
    })(filteredBySource);
    generateTimeSlots();
     
  }, [filteredBySource, diplayEventOverview]);
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date());
    }, 1000 * 60 * 15);
    // Scroll to 8 o'clock
    const table = document.getElementById("table-wrapper");
    table.scrollTop = table.scrollHeight * 0.32 + 1;
    // 1000 * 60 * 20
  }, []);
  // Once we've sorted events by date we want to group them in 2dimensional array
  function calculateChosenTime(event, adjustments = 0) {
    const column = document.getElementById(`${event.target.id}`);
    const height = column.offsetHeight;
    const rect = event.target.getBoundingClientRect();
    const position = event.clientY - rect.top - adjustments;
    const positionPercentages = (position * 100) / height;
    const chosenTime = Math.round(positionPercentages / 1.01);
    return chosenTime;
  }
  // Functions for stretch card
  function handleMouseDown(event, date) {
    if (
      event.target.id === date.toString() &&
      permissionChecker(store.role?.role_permissions, {
        recruiter: true,
        hiring_manager: true,
      }).edit
    ) {
      setIsMouseDown(true);
      setStretchCardChosenDate(event.target.dataset.date.toString());
      const chosenDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        calculateChosenTime(event, 6) * 15
      );
      setStretchCardStartPosition(startingPosition(chosenDate));
      setStretchCardTime((time) => ({ ...time, start: chosenDate }));
    }
  }
  function hadleMouseMove(event, date) {
    if (isMouseDown && !!event.target.dataset.date) {
      setIsMouseMove(true);
      setStretchCardHeight(
        calculateChosenTime(event, 8) - stretchCardStartPosition
      );
      const chosenDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        calculateChosenTime(event, 8) * 15
      );
      setStretchCardTime((time) => ({ ...time, end: chosenDate }));
    }
  }
  function handleMouseUp(event, date) {
    setIsMouseDown(false);
    setIsMouseMove(false);
    setStretchCardStartPosition(0);
    setStretchCardHeight(0);
    setStretchCardChosenDate(null);
    setStretchCardTime({ start: null, end: null });
    if (
      !!date &&
      event.target.id === date.toString() &&
      permissionChecker(store.role?.role_permissions, {
        recruiter: true,
        hiring_manager: true,
      }).edit
    )
      openModal("createEvent", stretchCardTime.start, stretchCardTime.end);
  }
  return (
    <TableContainer>
      <CalendarHeader
        prevWeek={prevWeek}
        nextWeek={nextWeek}
        months={months}
        week={week}
        fullDate={new Date()}
        origin={"table"}
        generateWeek={generateWeek}
        filterBySource={filterBySource}
        setEventType={setEventType}
        eventType={eventType}
      />
      <TableWrapper id={"table-wrapper"}>
        <Table>
          <TimeColumn>{timeSlots}</TimeColumn>
          <DateWrapper>
            {!!week &&
              week.map((data, index) => {
                let todayDate = new Date().toString();
                todayDate = todayDate.slice(0, 15);
                const todayClass =
                  todayDate === data.toString().slice(0, 15) ? `today` : ``;
                return (
                  <ColumnWrapper key={`day-${index + 1}`}>
                    <DateColumn
                      id={data.toString()}
                      className={`${todayClass}`}
                      data-date={data}
                      onMouseDown={(event) => handleMouseDown(event, data)}
                      onMouseMove={(event) => hadleMouseMove(event, data)}
                      onMouseUp={(event) => handleMouseUp(event, data)}
                      currentTime={startingPosition(currentTime)}
                    >
                      {sortedEvents[index]}
                      {!!isMouseMove &&
                        stretchCardChosenDate === data.toString() && (
                          <StretchEventCard
                            startPosition={stretchCardStartPosition}
                            height={stretchCardHeight}
                            timeRange={stretchCardTime}
                          />
                        )}
                    </DateColumn>
                  </ColumnWrapper>
                );
              })}
          </DateWrapper>
        </Table>
      </TableWrapper>
    </TableContainer>
  );
};

export default CalendarTable;
