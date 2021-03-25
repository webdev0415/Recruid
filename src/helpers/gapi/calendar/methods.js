import { API_ROOT_PATH } from "constants/api";

export async function getGoogleCalendarUser(session, company, callback) {
  const endpoint = `${API_ROOT_PATH}/v1/interview_events/${session.id}/${company.id}/get_guser`;
  const params = { method: `GET`, headers: session };
  try {
    const getData = await fetch(endpoint, params);
    const data = await getData.json();
    // If we don't have the user we break out of the flow
    if (data.message === "GUser not present") return;
    return callback(data);
  } catch (err) {
    console.error(`${err}`);
  }
}

export async function createGoogleCalendarUser(
  session,
  company,
  code,
  callback
) {
  const endpoint = `${API_ROOT_PATH}/v1/interview_events/${session.id}/${company.id}/create_guser`;
  const params = {
    method: `POST`,
    headers: session,
    body: JSON.stringify({ code }),
  };
  try {
    if (!code.length)
      throw new Error(`Unable to get a code from Google server`);
    const response = await fetch(endpoint, params);
    const data = await response.json();
    if (!!data.body.message && data.body.message === "Success") callback();
    else throw new Error("Failed to create google user on the server");
  } catch (err) {
    console.error(`${err}`);
  }
}

export async function deleteGoogleCalendarUser(session, company, callback) {
  const endpoint = `${API_ROOT_PATH}/v1/interview_events/${session.id}/${company.id}/delete_guser`;
  const params = { method: `DELETE`, headers: session };
  try {
    await fetch(endpoint, params);
    return callback();
  } catch (err) {
    console.error(`${err}`);
  }
}
