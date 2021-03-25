import { API_ROOT_PATH } from "constants/api.js";
import fetch from "fetch-retry";

export const fetchSkills = async (session, company_id) => {
  const url = `${API_ROOT_PATH}/v1/skills/${
    company_id ? `?company_id=${company_id}` : ""
  }`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
      retryOn: [500, 404],
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch skills");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchIndustries = async (session, company_id) => {
  const url = `${API_ROOT_PATH}/v1/categories/${
    company_id ? `?company_id=${company_id}` : ""
  }`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
      retryOn: [500, 404],
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch industries");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchLocations = async () => {
  const url = `${API_ROOT_PATH}/v1/locations/`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch locations");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCurrencies = async () => {
  const url = `${API_ROOT_PATH}/v1/currency/`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch currencies");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchDepartments = async (session, company_id) => {
  const url = `${API_ROOT_PATH}/v2/companies/${company_id}/get_sectors`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
      retryOn: [500, 404],
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch departments");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchBusinessAreas = async (session, company_id) => {
  const url = `${API_ROOT_PATH}/v2/companies/${company_id}/get_areas`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
      retryOn: [500, 404],
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch business areas");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
