import { API_ROOT_PATH } from "constants/api";
const apiKey = process.env.REACT_APP_G_API_KEY;

// Functions for CalendarList view
export async function fetchRestOfGoogleEvents(start, end, token, callback) {
  let queryParams = `?orderBy=startTime&timeMin=${start.toISOString()}&timeMax=${end.toISOString()}&maxResults=2500&singleEvents=true&key=${apiKey}`;
  let endpoint = `https://www.googleapis.com/calendar/v3/calendars/primary/events${queryParams}`;
  let parameters = {
    method: "get",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    let nextEvents = [];
    const response = await fetch(endpoint, parameters);
    const data = await response.json();
    for await (let item of data.items) {
      if (!isNaN(new Date(item.start.dateTime))) {
        nextEvents.push({
          date: new Date(item.start.dateTime),
          dateEnd: new Date(item.end.dateTime),
          name: item.summary,
          htmlLink: item.htmlLink,
          participants: "attendees" in item ? item.attendees : [],
          source: "google",
          g_id: item.id,
        });
      }
    }
    return callback(nextEvents);
  } catch (err) {
    console.error(err);
  }
}
export async function fetchNextEventsByMonth(
  monthRange,
  calendarId,
  company,
  page,
  session,
  callback,
  pending,
  eventType
) {
  const url = `${API_ROOT_PATH}/v1/interview_events/all_events_list`;
  const body = {
    start: monthRange.start,
    end: monthRange.end,
    professional_ids: calendarId,
    active_company: company.id,
    page,
    event_type: eventType || "interviews",
  };
  const params = {
    method: `POST`,
    headers: session,
    body: JSON.stringify(body),
  };
  try {
    const data = await (await fetch(url, params)).json();
    if (data.list.length) {
      for await (let event of data.list) {
        event[`date`] = new Date(event.start);
        event[`dateEnd`] = new Date(event.end);
        delete event.start;
        delete event.end;
      }
    }
    return callback(data);
  } catch (err) {
    console.error(`Failed to load events for the SideBar`);
  } finally {
    pending.current = false;
  }
}
export async function fetchEventsByMonth(
  monthRange,
  calendarId,
  company,
  session,
  callback,
  eventType
) {
  const body = {
    start: monthRange.start,
    end: monthRange.end,
    page: 1,
    professional_ids: calendarId,
    active_company: company.id,
    event_type: eventType || "interviews",
  };
  const url = `${API_ROOT_PATH}/v1/interview_events/all_events_list`;
  const params = {
    method: "POST",
    headers: session,
    body: JSON.stringify(body),
  };
  try {
    const getData = await fetch(url, params);
    const data = await getData.json();
    if (data.list.length) {
      for await (let event of data.list) {
        event[`date`] = new Date(event.start);
        event[`dateEnd`] = new Date(event.end);
        delete event.start;
        delete event.end;
      }
    }
    return callback(data);
  } catch (e) {
    console.error(`Error getting interviews list ${e}!`);
  }
}
// Functions for paginated interviews (SideBar)
export async function sideBarInitialEventsCall(
  session,
  company,
  callback,
  signal,
  eventType
) {
  const url = `${API_ROOT_PATH}/v1/interview_events/all_events_paginated`;
  const body = {
    start_point: new Date(),
    professional_ids: [session.id],
    active_company: company.id,
    page: 1,
    event_type: eventType || "interview",
  };
  const params = {
    method: `POST`,
    headers: session,
    body: JSON.stringify(body),
    signal,
  };
  try {
    const data = await (await fetch(url, params)).json();
    if (data.list.length) {
      for await (let event of data.list) {
        event[`date`] = new Date(event.start);
        event[`dateEnd`] = new Date(event.end);
        delete event.start;
        delete event.end;
      }
      return callback(data);
    }
    return;
  } catch (err) {
    console.error(`Error while making an initial call for paginated events`);
  }
}
export async function sideBarNextEventsCall(
  session,
  company,
  page,
  initialCallback,
  finalCallback,
  signal,
  eventType
) {
  const url = `${API_ROOT_PATH}/v1/interview_events/all_events_paginated`;
  const body = {
    start_point: new Date(),
    professional_ids: [session.id],
    active_company: company.id,
    page: page,
    event_type: eventType || "interview",
  };
  const params = {
    method: `POST`,
    headers: session,
    body: JSON.stringify(body),
    signal,
  };
  try {
    const data = await (await fetch(url, params)).json();
    for await (let event of data.list) {
      event[`date`] = new Date(event.start);
      event[`dateEnd`] = new Date(event.end);
      delete event.start;
      delete event.end;
    }
    return initialCallback(data);
  } catch (err) {
    console.error(`Failed to load events for the SideBar`);
  } finally {
    finalCallback();
  }
}
// Functions for Google events
export async function getGoogleEventsByRange(
  start,
  end,
  token,
  origin = "calendar",
  signal
) {
  let nextEvents = [];
  let queryParams = `?orderBy=startTime&timeMin=${start}&timeMax=${end}&maxResults=2500&singleEvents=true&key=${apiKey}`;
  let endpoint = `https://www.googleapis.com/calendar/v3/calendars/primary/events${queryParams}`;
  let parameters = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (signal) parameters.signal = signal;

  try {
    const response = await fetch(endpoint, parameters);
    const data = await response.json();
    for await (let item of data.items) {
      if (!isNaN(new Date(item.start.dateTime))) {
        if (origin === "interviewModal")
          nextEvents.push({
            start: item.start.dateTime,
            end: item.end.dateTime,
            name: item.summary,
            htmlLink: item.htmlLink,
            participants: "attendees" in item ? item.attendees : [],
            source: "google",
            g_id: item.id,
          });
        else
          nextEvents.push({
            date: new Date(item.start.dateTime),
            dateEnd: new Date(item.end.dateTime),
            name: item.summary,
            htmlLink: item.htmlLink,
            participants: "attendees" in item ? item.attendees : [],
            source: "google",
            g_id: item.id,
          });
      }
    }
    return nextEvents;
  } catch (err) {
    console.error(err);
  }
}
export async function getPaginatedGoogleEvents(
  token,
  limit,
  start,
  callback,
  signal
) {
  let queryParams = `?orderBy=startTime&timeMin=${start}&maxResults=${limit}&singleEvents=true&key=${apiKey}`;
  let endpoint = `https://www.googleapis.com/calendar/v3/calendars/primary/events${queryParams}`;
  let parameters = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (signal) parameters.signal = signal;

  try {
    let nextEvents = [];
    const request = await fetch(endpoint, parameters);
    const response = await request.json();
    for await (let item of response.items) {
      if (!isNaN(new Date(item.start.dateTime))) {
        nextEvents.push({
          date: new Date(item.start.dateTime),
          dateEnd: new Date(item.end.dateTime),
          name: item.summary,
          htmlLink: item.htmlLink,
          participants: "attendees" in item ? item.attendees : [],
          source: "google",
          g_id: item.id,
        });
      }
    }
    return callback(nextEvents);
  } catch (err) {
    console.error(`Error getting Google events for the sidebar: ${err}`);
  }
}
// Function for applicant profile
export async function getApplicantProfile(username, session, callback) {
  const endpoint = `${API_ROOT_PATH}/v1/professionals/${username}`;
  const params = { method: `GET`, headers: session };
  try {
    const request = await fetch(endpoint, params);
    const response = await request.json();
    return callback(response);
  } catch (err) {
    console.error(`Failed to get applicant profile`);
  }
}
// Functions for interview status
export async function setAsCompleted(
  id,
  session,
  callback = null,
  forceUpdate
) {
  let endpoint = `${API_ROOT_PATH}/v1/interview_events/${id}/conducted_event`;
  let params = {
    method: `GET`,
    headers: session,
  };
  try {
    const request = await fetch(endpoint, params);
    const response = await request.json();
    if (response.ok) callback();
    return;
  } catch (err) {
    console.error(`Error setting completed status for the event`);
  } finally {
    forceUpdate();
  }
}
