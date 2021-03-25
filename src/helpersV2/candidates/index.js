import { API_ROOT_PATH } from "constants/api";

export const fetchNetwork = async (session, companyId, filters, signal) => {
  const url = `${API_ROOT_PATH}/v2/talent_network/${companyId}/list`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ filters }),
      signal,
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

export const changeCandidateStatus = async (
  session,
  companyId,
  professionalId,
  status
) => {
  const url = `${API_ROOT_PATH}/v1/talent_network/${professionalId}/update_status/${companyId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify({ tn_status: status }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to change candidate status");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchRemoveCandidate = async (
  session,
  companyId,
  professionalId
) => {
  const url = `${API_ROOT_PATH}/v1/talent_network/${companyId}/delete/${professionalId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch companies");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchChangeCandidateRating = async (session) => {
  const url = `${API_ROOT_PATH}/--------`;

  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to change candidate rating");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchToggleBlackList = async (session, companyId, ptn_id) => {
  const url = `${API_ROOT_PATH}/v2/talent_network/${companyId}/blacklist`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ ptn_id }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to change candidate blacklist status");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
