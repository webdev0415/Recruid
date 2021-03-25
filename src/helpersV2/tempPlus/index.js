import { API_ROOT_PATH } from "constants/api.js";
import fetch from "fetch-retry";

export const fetchJobTempReadyCandidates = async (session, jobId, shiftId) => {
  const url = `${API_ROOT_PATH}/v2/shifts/${shiftId}/available_applicants?job_id=${jobId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch candidates");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchTempJobs = async (session, companyId, filters) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/job_posts/temp_jobs?talent_network=true`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ filters }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch candidates");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchTempNetwork = async (session, companyId, filters) => {
  const url = `${API_ROOT_PATH}/v2/talent_network/${companyId}/temp_list`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ filters }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch candidates");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchTempAnalytics = async (session, filters) => {
  const url = `${API_ROOT_PATH}/v2/temp_analytics/overall_analytics`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(filters),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch analytics");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchRevenueAnalytics = async (session, filters) => {
  const url = `${API_ROOT_PATH}/v2/temp_analytics/total_revenue_analytics`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(filters),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch revenue analytics");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchTempActivities = async (session, companyId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/temp_plus/activities`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch activities");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
