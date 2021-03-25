import { API_ROOT_PATH } from "constants/api.js";

export const fetchCompanySources = async (session, companyId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/custom_sources`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to get company sources");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchAddCompanySources = async (session, companyId, sources) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/custom_sources`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ sources })
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to add company sources");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchUpdateCompanySources = async (
  session,
  companyId,
  sources
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/custom_sources`;
  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify({ sources })
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to update company sources");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchDeleteCompanySources = async (
  session,
  companyId,
  source_ids
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/custom_sources`;
  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
      body: JSON.stringify({ source_ids })
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to delete company sources");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
