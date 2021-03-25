import { API_ROOT_PATH } from "constants/api.js";

export const getCareersApplicationForm = async (session, jobId) => {
  const url = `${API_ROOT_PATH}/v2/careers_application_forms/${jobId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to get application form");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const createCareersApplicationForm = async (session, body) => {
  const url = `${API_ROOT_PATH}/v2/careers_application_forms`;

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
      throw new Error("Unable to save application form");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const updateCareersApplicationForm = async (session, body) => {
  const url = `${API_ROOT_PATH}/v2/careers_application_forms`;

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
      throw new Error("Unable to update application form");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
