import { API_ROOT_PATH } from "constants/api.js";
import fetch from "fetch-retry";

export const fetchSegmentsList = async (
  session,
  company_id,
  professional_id,
  source_type
) => {
  const url = `${API_ROOT_PATH}/v2/segments/list`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        company_id,
        professional_id,
        source_type,
      }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch segments");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchDeleteSegments = async (session, body) => {
  const url = `${API_ROOT_PATH}/v2/segments/batch_delete`;

  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
      body: JSON.stringify(body),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to delete segments");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchUpdateSegment = async (session, segmentId, body) => {
  const url = `${API_ROOT_PATH}/v2/segments/${segmentId}/update_segment`;

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
      throw new Error("Unable to update segment");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCreateSegment = async (session, body) => {
  const url = `${API_ROOT_PATH}/v2/segments/create_segment`;

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
      throw new Error("Unable to create segment");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCreateFolder = async (session, body) => {
  const url = `${API_ROOT_PATH}/v2/segments/create_folder`;

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
      throw new Error("Unable to create folder");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
