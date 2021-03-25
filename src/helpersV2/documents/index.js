import { API_ROOT_PATH } from "constants/api.js";
import fetch from "fetch-retry";

export const fetchDocumentsList = async (session, body) => {
  const url = `${API_ROOT_PATH}/v1/documents/list`;

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
      throw new Error("Unable to fetch documents");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchToggleHiringManagerDocuments = async (session, document_ids) => {
  const url = `${API_ROOT_PATH}/v1/documents/toggle_visibility`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ document_ids }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch documents");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
