import { API_ROOT_PATH } from "constants/api.js";

export const fetchAllMeetings = async (
  session,
  companyId,
  sourceType,
  sourceId
) => {
  const url = `${API_ROOT_PATH}/v2/meetings?agency_id=${companyId}&source=${sourceType}&source_id=${sourceId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch meetings");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchSingleMeeting = async (session, meetingId) => {
  const url = `${API_ROOT_PATH}/v2/meetings/${meetingId}/single_meeting`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch meeting");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const createMeeting = async (session, body) => {
  const url = `${API_ROOT_PATH}/v2/meetings`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ meeting: body }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to create meeting");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const getCompanyEvents = async (session, body) => {
  let error;
  try {
    const endpoint = `${API_ROOT_PATH}/v1/interview_events/company_events`;
    const options = {
      method: "POST",
      headers: session,
      body: JSON.stringify(body),
    };
    const responseBody = await (await fetch(endpoint, options)).json();
    if (responseBody.error || responseBody.errors) {
      error = responseBody;
      throw new Error("Failed to get company interviews/meetings");
    }
    return responseBody;
  } catch (err) {
    return { err: true, data: err, ...error };
  }
};

export const getMeetings = async (session, body) => {
  let error;
  try {
    const endpoint = `${API_ROOT_PATH}/v1/interview_events/identifier`;
    const options = {
      method: "POST",
      headers: session,
      body: JSON.stringify(body),
    };
    const responseBody = await (await fetch(endpoint, options)).json();
    if (responseBody.error || responseBody.errors) {
      error = responseBody;
      throw new Error("Failed to get company interviews/meetings");
    }
    return responseBody;
  } catch (err) {
    return { err: true, data: err, ...error };
  }
};
