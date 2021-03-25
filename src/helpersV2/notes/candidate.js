import { API_ROOT_PATH } from "constants/api.js";
import fetch from "fetch-retry";

export const fetchCandidateNotes = async (
  session,
  companyId,
  profileId,
  slice
) => {
  const url = `${API_ROOT_PATH}/v2/talent_network/${companyId}/profile/${profileId}/notes?slice=${slice}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch notes");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCreateNote = async (session, payload, sourceId, source) => {
  // source = type of object - DealContact , Deal , and Employer
  const url = `${API_ROOT_PATH}/v1/notes?source_id=${sourceId}&source=${source}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(payload),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to create note");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchUpdateNote = async (session, payload, noteId) => {
  const url = `${API_ROOT_PATH}/v1/notes/${noteId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify(payload),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to update note");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchDeleteNote = async (session, noteId) => {
  const url = `${API_ROOT_PATH}/v1/notes/${noteId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to delete note");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
