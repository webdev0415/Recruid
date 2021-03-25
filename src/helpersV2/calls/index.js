import { API_ROOT_PATH } from "constants/api.js";

export const fetchAllCalls = async (
  session,
  companyId,
  sourceType,
  sourceId
) => {
  const url = `${API_ROOT_PATH}/v2/calls?agency_id=${companyId}&source=${sourceType}&source_id=${sourceId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch calls");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchSingleCall = async (session, callId) => {
  const url = `${API_ROOT_PATH}/v2/calls/${callId}/single_call`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch call");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const createCall = async (session, body) => {
  const url = `${API_ROOT_PATH}/v2/calls`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ call: body }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to create call");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const editCall = async (session, callId, body) => {
  const url = `${API_ROOT_PATH}/v2/calls/${callId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify({ call: body }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to edit call");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const deleteCall = async (session, companyId, callId) => {
  const url = `${API_ROOT_PATH}/v2/calls/${callId}?agency_id=${companyId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to delete call");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchListCalls = async (session, body) => {
  const url = `${API_ROOT_PATH}/v2/calls/identifier`;

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
      throw new Error("Unable to fetch calls");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
