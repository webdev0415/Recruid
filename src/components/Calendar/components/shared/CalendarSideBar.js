import React, { useState, useEffect, useRef, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { CalendarContext } from "contexts/calendarContext/calendarProvider";
import {
  getGoogleEventsByRange,
  getPaginatedGoogleEvents,
  sideBarInitialEventsCall,
  sideBarNextEventsCall,
} from "helpers/calendar/eventsActions";
// Components
import SideBarCard from "components/Calendar/components/shared/SideBarCard";
import { SideBar } from "components/Calendar/styles/CalendarComponents";

const CalendarSideBar = ({
  monthsList,
  session,
  diplayEventOverview,
  eventType,
}) => {
  const { company } = useContext(GlobalContext);
  const { state } = useContext(CalendarContext);
  const { forceUpdate, gToken } = state;
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(2);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedEvents, setSortedEvents] = useState([]);
  const [frequencyCounter, setFrequncyCounter] = useState({});
  const listsNumber = useRef(0);
  const [lastDayFetched, setLastDayFetched] = useState(null);
  const [lastGoogleFetched, setLastGoogleFetched] = useState(null);
  const controller = new AbortController();
  const signal = controller.signal;
  // Initial request for events starting from today
  useEffect(() => {
    function initialCallback(data) {
      setTotalPages(data.pages);
      setFilteredEvents(data.list);
      let lastDate = new Date(
        data.list[data.list.length - 1].date.getFullYear(),
        data.list[data.list.length - 1].date.getMonth(),
        data.list[data.list.length - 1].date.getDate(),
        23,
        59,
        59
      );
      setLastDayFetched(lastDate);
      return;
    }
    sideBarInitialEventsCall(
      session,
      company,
      initialCallback,
      signal,
      eventType
    );
    return () => controller.abort();
    // eslint-disable-next-line
  }, [session, company, forceUpdate, eventType]);
  // Get GoogleEvents and filter out duplicated events
  useEffect(() => {
    if (!!gToken && !!gToken.length && !!lastDayFetched) {
      //eslint-disable-next-line
      function filterByGId(arr) {
        let output = [];
        let counter = {};
        for (let item of arr) {
          counter[item.g_id] = (counter[item.g_id] || 0) + 1;
          if (counter[item.g_id] <= 1) output.push(item);
        }
        return output;
      }
      (async function () {
        const getUniqueEvents = (arr) => {
          let output = [];
          let counter = {};
          for (let item of arr) {
            if (item.g_id) counter[item.g_id] = (counter[item.g_id] || 0) + 1;
            else output.push(item);
            if (counter[item.g_id] <= 1) output.push(item);
          }
          return filterByGId(output);
        };
        const googleEvents = await getGoogleEventsByRange(
          new Date().toISOString(),
          lastDayFetched.toISOString(),
          gToken,
          undefined,
          signal
        );
        if (googleEvents && Array.isArray(googleEvents)) {
          let duplicatedEvents = [...filteredEvents, ...googleEvents];
          if (duplicatedEvents.length < 6) {
            let newDate = lastDayFetched.setDate(lastDayFetched.getDate() + 1);
            setLastDayFetched(new Date(newDate));
          }
          return setFilteredEvents(getUniqueEvents(duplicatedEvents));
        }
      })();
    }
    return () => controller.abort();
    // eslint-disable-next-line
  }, [gToken, lastDayFetched]);
  // Second effect groups (sorts) filtered events by days
  useEffect(() => {
    // Filtering out duplicates by id
    // Sorting by date
    const sortByDate = (arr) =>
      arr.sort((a, b) => a.date.getTime() - b.date.getTime());
    setSortedEvents(sortByDate(filteredEvents));
    // Function that calculates the amount of unique dates => gives us number of lists that we need to display
    (function countUniqueDates() {
      if (!filteredEvents.length) return false;
      let counter = {};
      for (let i in filteredEvents) {
        const key = new Date(
          filteredEvents[i].date.getFullYear(),
          filteredEvents[i].date.getMonth(),
          filteredEvents[i].date.getDate()
        ).getTime();
        counter[key] = (counter[key] || 0) + 1;
      }
      listsNumber.current = Object.keys(counter).length;
      setFrequncyCounter(counter);
    })();
    return () => controller.abort();
  }, [filteredEvents]);
  // Fetch next page when reach the bottom of the SideBar
  let pending = useRef(false);
  function handleSideBarScroll() {
    if (pending.current) return;
    const el = document.getElementById("events-scrollbar");
    const condition = el.scrollHeight - 200 < el.scrollTop + el.offsetHeight;
    if (condition) {
      pending.current = true;
      if (currentPage < totalPages) {
        //eslint-disable-next-line
        function initialCallback(data) {
          const lastDate = new Date(
            data.list[data.list.length - 1].date.getFullYear(),
            data.list[data.list.length - 1].date.getMonth(),
            data.list[data.list.length - 1].date.getDate(),
            23,
            59,
            59
          );
          setLastDayFetched(lastDate);
          setFilteredEvents((events) => [...events, ...data.list]);
          setCurrentPage((page) => page + 1);
          return;
        }
        const finalCallback = () => (pending.current = false);
        sideBarNextEventsCall(
          session,
          company,
          currentPage,
          initialCallback,
          finalCallback,
          signal,
          eventType
        );
      } else {
        //eslint-disable-next-line
        function callback(data) {
          setLastGoogleFetched(data[data.length - 1].date);
          setFilteredEvents((events) => [...events, ...data]);
          pending.current = false;
          return;
        }
        let start = new Date(
          lastGoogleFetched
            ? lastGoogleFetched.getFullYear()
            : lastDayFetched.getFullYear(),
          lastGoogleFetched
            ? lastGoogleFetched.getMonth()
            : lastDayFetched.getMonth(),
          lastGoogleFetched
            ? lastGoogleFetched.getDate() + 1
            : lastDayFetched.getDate() + 1
        );
        getPaginatedGoogleEvents(
          gToken,
          10,
          start.toISOString(),
          callback,
          signal
        );
      }
    }
  }
  // Generate SideBar content
  const generateList = () => {
    const keys = Object.keys(frequencyCounter);
    let listContext = [[]];
    let lists = [];
    let recursionCount = 0;
    let i = 0;
    function recursion() {
      if (recursionCount > keys.length) return;
      if (
        listContext[recursionCount].length ===
        frequencyCounter[keys[recursionCount]]
      ) {
        listContext.push([]);
        recursionCount++;
        listsNumber.current = listsNumber.current - 1;
        recursion();
      }
      if (i < sortedEvents.length) {
        listContext[recursionCount].push(
          <li key={`event-${i}`}>
            <SideBarCard
              event={sortedEvents[i]}
              eventAction={diplayEventOverview}
            />
          </li>
        );
        i++;
        recursion();
      }
    }
    recursion();
    if (!!filteredEvents.length && !!listContext.length) {
      for (let n in keys) {
        const date = listContext[n][0].props.children.props.event.date;
        const day = date.toLocaleString("en-us", { weekday: "long" });
        const today = new Date();
        const todayInMs = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        ).getTime();
        const listDateInMs = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        ).getTime();
        let dayToDisplay = todayInMs === listDateInMs ? "Today" : day;
        lists.push(
          <ul key={`list-${n}`}>
            <h3>
              {`${dayToDisplay}, `}
              {monthsList[`${date.getMonth()}`]} {date.getDate()}
            </h3>
            {listContext[n]}
          </ul>
        );
      }
    }
    return lists;
  };
  if (filteredEvents.length) {
    return (
      <SideBar id="events-scrollbar" onScroll={handleSideBarScroll}>
        <h2>Your Meetings</h2>
        <div>{generateList()}</div>
      </SideBar>
    );
  } else
    return (
      <SideBar id="events-scrollbar">
        <h2>Your Meetings</h2>
        <p>{`Looks like you don't have any events at the moment.`}</p>
      </SideBar>
    );
};

export default CalendarSideBar;
