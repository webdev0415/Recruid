import { API_ROOT_PATH } from "constants/api.js";
import fetch from "fetch-retry";

export const fetchJobNotes = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/job_posts/job_notes`;

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
      throw new Error("Unable to fetch notes");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
