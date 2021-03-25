import React, { useState, useRef, useEffect, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { CalendarContext } from "contexts/calendarContext/calendarProvider";
// Components
import ListCard from "components/Calendar/components/List/ListCard";
// helpers
import {
  fetchNextEventsByMonth,
  fetchRestOfGoogleEvents,
} from "helpers/calendar/eventsActions";
import styled from "styled-components";

const ListsWrapper = styled.div`
  max-height: calc(100vh - 351px);
  min-height: calc(100vh - 351px);
  overflow-y: auto;
  width: 100%;
`;

const DayList = styled.div`
  border-bottom: 1px solid #eee;
  list-style: none;
  margin-bottom: 25px;
  padding-left: 15px;
  padding-right: 15px;

  &:first-child {
    margin-top: 10px;
  }

  h3 {
    color: #74767b;
    font-size: 15px;
    margin-bottom: 5px;
  }
`;

const EventsList = ({
  events,
  monthsList,
  diplayEventOverview,
  monthRange,
  setUpcoming,
  session,
  lastDayFetched,
  setLastDayFetched,
  setLastGoogleFetched,
  totalPages,
  openModal,
  eventType,
}) => {
  const { company } = useContext(GlobalContext);
  const { state } = useContext(CalendarContext);
  const { calendarId, gToken } = state;
  const [currentPage, setCurrentPage] = useState(2);
  const [sortedEvents, setSortedEvents] = useState([]);
  const [frequencyCounter, setFrequncyCounter] = useState({});
  const listsNumber = useRef(0);
  // Ref to keep track of requests that we make on scroll
  let pending = useRef(false);
  // Sorting by date
  const sortByDate = (arr) =>
    arr.sort((a, b) => a.date.getTime() - b.date.getTime());
  // An effect to reset the count of pages when we change TMFilter
  useEffect(() => {
    pending.current = false;
    setCurrentPage(2);
  }, [calendarId]);
  // Second effect groups (sorts) filtered events by days
  useEffect(() => {
    setSortedEvents(sortByDate(events));
    // Function that calculates the amount of unique dates => gives us number of lists that we need to display
    (function countUniqueDates() {
      if (!events.length) return false;
      let counter = {};
      for (let i in events) {
        const key = new Date(
          events[i].date.getFullYear(),
          events[i].date.getMonth(),
          events[i].date.getDate()
        ).getTime();
        counter[key] = (counter[key] || 0) + 1;
      }
      listsNumber.current = Object.keys(counter).length;
      setFrequncyCounter(counter);
    })();
  }, [events]);
  // Generate 2 dimensional arrays which represents a unique a day and all the events at that day
  const generateList = () => {
    const keys = Object.keys(frequencyCounter);
    let listContext = [[]];
    let lists = [];
    let recursionCount = 0;
    let i = 0;
    function recursion() {
      if (recursionCount > keys.length) return false;
      if (
        listContext[recursionCount].length ===
        frequencyCounter[keys[recursionCount]]
      ) {
        listContext.push([]);
        recursionCount++;
        listsNumber.current--;
        recursion();
      }
      if (i < sortedEvents.length) {
        listContext[recursionCount].push(
          <React.Fragment key={`event-${i}`}>
            <ListCard
              event={sortedEvents[i]}
              eventAction={diplayEventOverview}
              openModal={openModal}
            />
          </React.Fragment>
        );
        i++;
        recursion();
      }
    }
    recursion();
    if (events.length && listContext.length) {
      for (let n in keys) {
        const date = listContext[n][0].props.children.props.event.date;
        const day = date.toLocaleString("en-us", { weekday: "long" });
        const today = new Date().toLocaleString("en-us", { weekday: "long" });
        let dayToDisplay = day === today ? "Today" : day;
        lists.push(
          <DayList
            key={`list-${n}`}
            id={new Date(date.getFullYear(), date.getMonth(), date.getDate())}
          >
            <h3>
              {`${dayToDisplay}, `}
              {monthsList[`${date.getMonth()}`]} {date.getDate()}
            </h3>
            {listContext[n]}
          </DayList>
        );
      }
    }
    return lists;
  };

  const handleSroll = (event) => {
    if (pending.current || event.target.id !== "list-wrapper") return;
    const el = document.getElementById(event.target.id);
    const condition = el.scrollHeight - 150 < el.scrollTop + el.offsetHeight;
    if (condition) {
      pending.current = true;
      if (currentPage < totalPages + 1) {
        //eslint-disable-next-line
        function callback(data) {
          setUpcoming((events) => [...events, ...data.list]);
          const lastDate = new Date(
            data.list[data.list.length - 1].date.getFullYear(),
            data.list[data.list.length - 1].date.getMonth(),
            data.list[data.list.length - 1].date.getDate(),
            23,
            59,
            59
          );
          setLastDayFetched(lastDate);
          setCurrentPage((page) => page + 1);
          return;
        }
        fetchNextEventsByMonth(
          monthRange,
          calendarId,
          company,
          currentPage,
          session,
          callback,
          pending,
          eventType
        );
      } else {
        if (calendarId.indexOf(session.id) !== -1) {
          //eslint-disable-next-line
          function callback(data) {
            setLastGoogleFetched(data[data.length - 1].date);
            setUpcoming((events) => [...events, ...data]);
            return;
          }
          let start = new Date(
            lastDayFetched.getFullYear(),
            lastDayFetched.getMonth(),
            lastDayFetched.getDate() + 1
          );
          fetchRestOfGoogleEvents(start, monthRange.end, gToken, callback);
        }
      }
    }
  };
  return (
    <ListsWrapper
      onScroll={handleSroll}
      id="list-wrapper"
      className="leo-relative"
    >
      {generateList()}
    </ListsWrapper>
  );
};

export default EventsList;
