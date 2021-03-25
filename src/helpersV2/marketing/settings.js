import { API_ROOT_PATH } from "constants/api.js";
import fetch from "fetch-retry";

export const fetchCreateMarketingSettings = async (
  session,
  companyId,
  body
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_settings`;

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
      throw new Error("Unable to create marketing settings");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchMarketingSettings = async (session, companyId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_settings`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch marketing settings");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const updateMarketingSettings = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_settings`;

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
      throw new Error("Unable to update marketing settings");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
