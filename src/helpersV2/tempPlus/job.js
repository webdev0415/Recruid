import { API_ROOT_PATH } from "constants/api.js";
import fetch from "fetch-retry";
import queryString from "query-string";

export const fetchJobAnalytics = async (session, filters) => {
  const url = `${API_ROOT_PATH}/v2/temp_analytics/job_detail_analytics`;

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

export const fetchJobRevenueAnalitycs = async (session, filters) => {
  const url = `${API_ROOT_PATH}/v2/temp_analytics/specific_revenue_analytics`;

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

export const fetchTempJobActivities = async (session, companyId, jobId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/temp_plus/activities?job_post_id=${jobId}`;

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

export const fetchJobGlobalValues = async (session, companyId, queries) => {
  const query = queryString.stringify(queries);
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/temp_plus/rate_calculation_settings?${query}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch global values");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchSaveJobGlobalValues = async (
  session,
  companyId,
  settingsId,
  newValues
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/temp_plus/rate_calculation_settings/${settingsId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify(newValues),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to update global values");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCreateJobGlobalValues = async (
  session,
  companyId,
  newValues
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/temp_plus/rate_calculation_settings`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(newValues),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to update global values");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchLatestApplicants = async (session, companyId, jobId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/applicants/latest_applicants?job_id=${jobId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch latest applicants");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
