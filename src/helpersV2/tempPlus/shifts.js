import { API_ROOT_PATH } from "constants/api.js";
import fetch from "fetch-retry";
import queryString from "query-string";

export const fetchRangeShifts = async (session, jobId, filters) => {
  const query = queryString.stringify(filters);
  const url = `${API_ROOT_PATH}/v2/shifts?${query}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch shifts");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchPublishShiftsRange = async (session, shifts_ids) => {
  const url = `${API_ROOT_PATH}/v2/published_shifts`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ shifts_ids }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to publish shifts");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchPublishedAnalytics = async (session, jobId, filters) => {
  const query = queryString.stringify(filters);
  const url = `${API_ROOT_PATH}/v2/published_shifts/counts?${query}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch published shifts analytics");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchDeleteShift = async (session, shiftId) => {
  const url = `${API_ROOT_PATH}/v2/shifts/${shiftId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to publish shifts");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCreateShift = async (session, body) => {
  const url = `${API_ROOT_PATH}/v2/shifts`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(body),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to create shifts");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchEditShift = async (session, shiftId, body) => {
  const url = `${API_ROOT_PATH}/v2/shifts/${shiftId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify(body),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to publish shifts");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
