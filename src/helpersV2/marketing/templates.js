import { API_ROOT_PATH } from "constants/api.js";
import queryString from "query-string";

export const fetchGetTemplates = async (
  session,
  companyId,
  professionalId,
  signal,
  filters
) => {
  const query = queryString.stringify(
    { ...filters },
    { arrayFormat: "bracket" }
  )
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_templates/list_templates?${query}${
    professionalId ? `&professional_id=${professionalId}` : ""
  }`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
      signal,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to get templates");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCreateTemplate = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_templates/new_template`;

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
      throw new Error("Unable to create template");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchEditTemplate = async (
  session,
  companyId,
  templateId,
  body
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_templates/${templateId}/update_template`;
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
      throw new Error("Unable to edit template");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchDeleteTemplate = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_templates/delete_templates`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ id: body }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to delete templates");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
