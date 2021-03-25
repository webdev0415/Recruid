import { API_ROOT_PATH } from "constants/api";
import notify from "notifications";
import queryString from "query-string";

export const authInit = (gapi, auth2, callback) => {
  gapi.load("auth2", () => {
    auth2.current = gapi.auth2.init({
      apiKey: process.env.REACT_APP_G_API_KEY,
      clientId: process.env.REACT_APP_G_CLIEND_ID,
      scope:
        "openid profile https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly",
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
        // "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ],
    });
    return callback ? callback() : null;
  });
};

export const getGmailUser = async (
  session,
  companyId,
  setGmailUser,
  setLoading
) => {
  const endpoint = `${API_ROOT_PATH}/v2/g_mail_users/gmail_authorisation?active_company=${companyId}&professional_id=${session.id}`;
  const options = { method: "GET", headers: session };
  try {
    const response = await fetch(endpoint, options);
    const data = await response.json();
    if (!!data.body.message && data.body.message === "Not present") {
      setGmailUser(null);
      throw new Error();
    }
    !!setLoading && setLoading(false);
    return setGmailUser(data.body.g_user);
  } catch (err) {
    // console.error("Failed to get the Google user response from the server");
    !!setLoading && setLoading(false);
    return setGmailUser(null);
  }
};

export const createGmailUser = async (session, code, companyId, callback) => {
  const endpoint = `${API_ROOT_PATH}/v2/g_mail_users/create_gmail_authorisation`;
  const options = {
    method: "POST",
    headers: session,
    body: JSON.stringify({ code, active_company: companyId }),
  };
  try {
    const response = await fetch(endpoint, options);
    const data = await response.json();
    if (!!data.body.message && data.body.message === "Success")
      return callback();
    else throw new Error("Failed to send the token to the server");
  } catch (err) {
    notify(
      "danger",
      typeof err === "object"
        ? "Failed to create the Google user on the server"
        : err
    );
  }
};

export const deleteGmailUser = async (company, session, callback) => {
  const endpoint = `${API_ROOT_PATH}/v2/g_mail_users?active_company=${
    company.id || company
  }&professional_id=${session.id}`;
  const options = { method: "DELETE", headers: session };
  try {
    await fetch(endpoint, options);
    return callback();
  } catch (err) {
    notify("danger", "Error disconnecting the gmail user, try again.");
  }
};

export const sendEmail = async (body, session, setEmailLoader) => {
  const endpoint = `${API_ROOT_PATH}/v2/google_messages`;
  const options = {
    method: "POST",
    headers: session,
    body: JSON.stringify(body),
  };
  try {
    setEmailLoader(true);
    const response = await fetch(endpoint, options);
    const data = await response.json();
    if (data.error) {
      notify("danger", data.error);
    }
    if (!!data.body.message && data.body.message === "Success") {
      return data.body.message;
    } else throw new Error();
  } catch (err) {
    notify(
      "danger",
      err && err.error ? err.error : "Error sending an email. Try againg later."
    );
  }
};

export const listEmails = async (
  ptn_id,
  company_id,
  session,
  elastic_ids,
  email,
  receiver_id,
  receiver_type
) => {
  const query = queryString.stringify({
    ptn_id,
    company_id,
    elastic_ids: JSON.stringify(elastic_ids),
    email,
    receiver_id,
    receiver_type,
  });
  const endpoint = `${API_ROOT_PATH}/v2/google_messages?${query}`;

  const options = {
    methods: "GET",
    headers: session,
  };
  try {
    const response = await fetch(endpoint, options);
    const data = await response.json();
    if (!!data.body.message && data.body.message === "Success") {
      return data.body.list;
    } else throw new Error();
  } catch (err) {
    // notify("danger", "Error getting the list of messages.");
  }
};

export const getConversation = async (
  threadId,
  session,
  team_member_id,
  receiver_id
) => {
  const endpoint = `${API_ROOT_PATH}/v2/google_messages/email_thread?thread_id=${threadId}&team_member_id=${team_member_id}&receiver_id=${receiver_id}`;
  const options = { method: "GET", headers: session };
  try {
    const res = await fetch(endpoint, options);
    const data = await res.json();
    if (data.body.message && data.body.message === "Success")
      return data.body.list;
    throw new Error(data.body.message);
  } catch (err) {
    notify("danger", `Failed to get conversation from the server: ${err}`);
  }
};

export const updateIncludeSignature = async (session, gmailUserId) => {
  const endpoint = `${API_ROOT_PATH}/v2/g_mail_users/${gmailUserId}/update_signature`;
  const options = {
    method: "get",
    headers: session,
  };
  try {
    return await (await fetch(endpoint, options)).json();
  } catch (err) {
    return { error: true, data: err };
  }
};

export const searchGoogleMessages = async (token, query, pageToken) => {
  const endpoint = `https://www.googleapis.com/gmail/v1/users/me/messages?q={${query}}${
    pageToken ? `&pageToken=${pageToken}` : ""
  }`;
  const options = {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    return await (await fetch(endpoint, options)).json();
  } catch (err) {
    console.error(err);
  }
};

export const sendGoogleMessagesIdsToServer = async (
  session,
  companyId,
  professionalId,
  messagesIds
) => {
  const endpoint = `${API_ROOT_PATH}/v2/google_messages/import_emails`;
  const options = {
    method: "post",
    headers: session,
    body: JSON.stringify({
      company_id: companyId,
      professional_id: professionalId,
      messages_ids: messagesIds,
    }),
  };
  try {
    return await (await fetch(endpoint, options)).json();
  } catch (error) {
    return { error: true, data: error };
  }
};

export const notifyEmailsImported = async (session, gmailUserId) => {
  const endpoint = `${API_ROOT_PATH}/v2/g_mail_users/${gmailUserId}/emails_imported`;
  const options = { headers: session };
  try {
    return await (await fetch(endpoint, options)).json();
  } catch (error) {
    return { error: true, data: error };
  }
};
