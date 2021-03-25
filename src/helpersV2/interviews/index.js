import { API_ROOT_PATH } from "constants/api.js";
import fetch from "fetch-retry";

export const fetchInterviewStages = async (session, companyId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/interview_stages`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch interview stages");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchUpdateInterviewStages = async (
  session,
  companyId,
  newStages
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/interview_stages`;

  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify({
        interview_stages: { interviews_stages_properties: newStages },
      }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to update interview stages");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchMemberInterviews = async (
  teamMemberIds,
  date,
  session,
  eventType
) => {
  const url = `${API_ROOT_PATH}/v1/interview_events/team_member_events`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        interview_event: {
          date: date?.toISOString() || new Date(),
          team_member_ids: teamMemberIds,
          event_type: eventType || "interview",
        },
      }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch team interviews");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchEditInterview = async (session, eventId, body) => {
  const url = `${API_ROOT_PATH}/v1/interview_events/${eventId}`;

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
      throw new Error("Unable to edit interview");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchMembersTokens = async (
  session,
  companyId,
  professionalIds
) => {
  const url = `${API_ROOT_PATH}/v1/interview_events/token_list`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        professional_ids: professionalIds,
        active_company: companyId,
      }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch members tokens");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

//==============================================================================

export const fetchCancelInterview = async (session, eventId) => {
  const url = `${API_ROOT_PATH}/v1/interview_events/${eventId}/cancelled_event`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to cancel interview");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchSubmitInterview = async (session, postBody, eventId) => {
  const url = `${API_ROOT_PATH}/v1/interview_events${
    eventId ? `/${eventId}/rescheduled_event` : ""
  }`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(postBody),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to create interview");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchRequestAvailability = async (session, postBody) => {
  const url = `${API_ROOT_PATH}/v1/interview_events/candidate_availability`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(postBody),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to send availability");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchAllInterviews = async (session) => {
  const url = `${API_ROOT_PATH}/v2/interviews`;

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
