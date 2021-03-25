import React, { useState, useEffect, Fragment, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { CalendarContext } from "contexts/calendarContext/calendarProvider";
import {
  fetchEventsByMonth,
  getGoogleEventsByRange,
} from "helpers/calendar/eventsActions";
import CalendarFilter from "components/Calendar/components/Filter";
// Interviews V1 imports
import CalendarStats from "components/Calendar/components/shared/CalendarStats";
import EventsList from "components/Calendar/components/List/EventsList";
// Styles
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { AWS_CDN_URL } from "constants/api";
// Helpers
import { API_ROOT_PATH } from "constants/api";
import notify from "notifications";
import Spinner from "sharedComponents/Spinner";

const CalendarList = ({
  months,
  monthsList,
  diplayEventOverview,
  openModal,
  eventType,
  setEventType,
}) => {
  const { session, company } = useContext(GlobalContext);
  const { state } = useContext(CalendarContext);
  const { gToken, forceUpdate, calendarId } = state;
  const daysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const today = new Date();
  const [monthRange, setMonthRange] = useState({
    start: new Date(today.getFullYear(), today.getMonth(), 1, 1),
    end: new Date(
      today.getFullYear(),
      today.getMonth(),
      daysInMonth(today.getMonth() + 1, today.getFullYear()) + 1
    ),
  });
  const [upcoming, setUpcoming] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [dateToScroll, setDateToScroll] = useState(null);
  const [lastDayFetched, setLastDayFetched] = useState(null);
  const lastGoogleFetched = useState(null);
  const [monthAnalytics, setMonthAnalytics] = useState(undefined);
  const [eventsLoading, setEventsLoading] = useState(true);
  // Initial events fetch
  useEffect(() => {
    //eslint-disable-next-line
    function callback(data) {
      if (data.list.length) {
        setUpcoming(data.list);
        setTotalPages(data.pages);
        const lastDate = new Date(
          data.list[data.list.length - 1].date.getFullYear(),
          data.list[data.list.length - 1].date.getMonth(),
          data.list[data.list.length - 1].date.getDate(),
          23,
          59,
          59
        );
        setLastDayFetched(lastDate);
      } else {
        setUpcoming([]);
        setTotalPages(0);
        setLastDayFetched(null);
      }
      return null;
    }
    fetchEventsByMonth(
      monthRange,
      calendarId,
      company,
      session,
      callback,
      eventType
    ).then(() => setEventsLoading(false));
    // eslint-disable-next-line
  }, [monthRange, forceUpdate, company, calendarId, eventType]);
  // Get GoogleEvents
  useEffect(() => {
    if (gToken && calendarId.indexOf(session.id) !== -1) {
      //eslint-disable-next-line
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
      (async function () {
        const googleEvents = await getGoogleEventsByRange(
          monthRange.start.toISOString(),
          lastDayFetched
            ? lastDayFetched.toISOString()
            : monthRange.end.toISOString(),
          gToken
        );
        function getUniqueEvents(arr) {
          let output = [];
          let counter = {};
          for (let item of arr) {
            counter[item.id] = (counter[item.id] || 0) + 1;
            if (counter[item.id] <= 1) output.push(item);
          }
          return filterByGId(output);
        }
        const duplicatedEvents = [...upcoming, ...(googleEvents || [])];
        return setUpcoming(getUniqueEvents(duplicatedEvents));
      })();
    }
    // eslint-disable-next-line
  }, [lastDayFetched, gToken, monthRange, calendarId]);

  const prevMonth = () => {
    const nextStartDate = new Date(
      monthRange.start.getFullYear(),
      monthRange.start.getMonth() - 1,
      1,
      1
    );
    const nextEndDate = new Date(
      nextStartDate.getFullYear(),
      nextStartDate.getMonth(),
      daysInMonth(nextStartDate.getMonth() + 1, nextStartDate.getFullYear()) + 1
    );
    setMonthRange({ start: nextStartDate, end: nextEndDate });
  };

  const nextMonth = () => {
    const nextStartDate = new Date(
      monthRange.start.getFullYear(),
      monthRange.start.getMonth() + 1,
      1,
      1
    );
    const nextEndDate = new Date(
      nextStartDate.getFullYear(),
      nextStartDate.getMonth(),
      daysInMonth(nextStartDate.getMonth() + 1, nextStartDate.getFullYear()) + 1
    );
    setMonthRange({ start: nextStartDate, end: nextEndDate });
  };

  const setMonth = (chosenDate) => {
    const nextStartDate = new Date(
      chosenDate.getFullYear(),
      chosenDate.getMonth(),
      2
    );
    const nextEndDate = new Date(
      nextStartDate.getFullYear(),
      nextStartDate.getMonth(),
      daysInMonth(nextStartDate.getMonth() + 1, nextStartDate.getFullYear())
    );
    if (monthRange.start.getMonth() !== nextStartDate.getMonth()) {
      setMonthRange({ start: nextStartDate, end: nextEndDate });
    }
    setDateToScroll(chosenDate);
  };

  useEffect(() => {
    // (async function checkEventPresence() {
    //   const url = `${API_ROOT_PATH}/v1/calendar/chosen_date`;
    //   const body = { chosen_date: dateToScroll };
    //   const params = {
    //     method: `POST`,
    //     headers: session,
    //     body: JSON.stringify(body)
    //   };
    //   try {
    //     const getData = await (await fetch(url, params)).json();
    //   } catch (err) {
    //     notify(err);
    //   } finally {
    //   }
    // })();
    const parent = document.getElementById("list-wrapper");
    const child = document.getElementById(dateToScroll);
    if (dateToScroll) {
      if (child) {
        parent.scrollTo(0, 250);
        const positionY = child.offsetTop;
        parent.scroll(0, positionY);
      } else {
        notify(
          "danger",
          "Looks like you don't have any events for the selected date."
        );
      }
    }
  }, [dateToScroll]);

  useEffect(() => {
    if (company && session) {
      fetchAnalitics().then((analytics) => {
        if (analytics !== "err") {
          setMonthAnalytics(analytics);
        }
      });
    }
    // eslint-disable-next-line
  }, [company, session, monthRange, forceUpdate, eventType]);

  const fetchAnalitics = () => {
    let url = `${API_ROOT_PATH}/v1/interview_events/${company.id}/month_analytics`;

    url += `?start=${monthRange.start}&end=${monthRange.end}&event_type=${eventType}`;
    const data = fetch(url, {
      method: "GET",
      headers: session,
    }).then((res) => (res.ok ? res.json() : "err"));
    return data;
  };

  return (
    <>
      <div>
        <CalendarFilter
          months={months}
          origin={"list"}
          currentDate={monthRange.start}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
          setMonth={setMonth}
          selectedDate={dateToScroll}
          eventType={eventType}
          setEventType={setEventType}
        />
        {eventsLoading ? (
          <Spinner />
        ) : upcoming.length ? (
          <Fragment>
            <CalendarStats analytics={monthAnalytics} />
            <EventsList
              events={upcoming}
              monthsList={monthsList}
              monthRange={monthRange}
              setUpcoming={setUpcoming}
              diplayEventOverview={diplayEventOverview}
              session={session}
              lastDayFetched={lastDayFetched}
              setLastDayFetched={setLastDayFetched}
              setLastGoogleFetched={lastGoogleFetched[1]}
              totalPages={totalPages}
              openModal={openModal}
              eventType={eventType}
            />
          </Fragment>
        ) : (
          <div
            className={sharedStyles.emptyContainer}
            style={{ minHeight: "calc(100vh - 470px)" }}
          >
            <div className={sharedStyles.empty}>
              <img
                src={`${AWS_CDN_URL}/icons/empty-icons/empty-calendar.svg`}
                alt="You currently have no interviews"
              />
              <h2>You currently have no interviews</h2>
              <p>
                You have no interviews booked for this time period, please
                adjust your filter.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CalendarList;
