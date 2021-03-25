import { API_ROOT_PATH } from "constants/api.js";

export const fetchCreateFolder = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_templates/new_folder`;

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
      throw new Error("Unable to create folder");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchEditFolder = async (session, companyId, folderId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_templates/${folderId}/update_folder`;

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
      throw new Error("Unable to edit folder");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchDeleteFolder = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_templates/delete_folders`;

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
      throw new Error("Unable to delete folders");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
