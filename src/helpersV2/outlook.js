import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { API_ROOT_PATH } from "constants/api";

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_OUTLOOK_CLIENT_ID,
    // redirectUri: "https://localhost:3001"
    redirectUri: process.env.REACT_APP_OUTLOOK_REDIRECTURI,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

let requestOptions = {
  scopes: [
    "email",
    "profile",
    "offline_access",
    "openid",
    "https://outlook.office.com/mail.read",
    "https://outlook.office.com/mail.send",
  ],
  response_type: ["code"],
};

export const handleSsoSilent = async (msal, username) => {
  try {
    return await msal.ssoSilent({ ...requestOptions, loginHint: username });
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      return { error: true, message: "action required" };
    }
    return { error: true, message: "unexpected error", data: err };
  }
};

export const handleLogin = async (msal) => {
  try {
    return await msal.loginPopup(requestOptions);
  } catch (err) {
    return { error: true, message: "unexpected error", data: err };
  }
};

export const updateMsalLoginHint = async (newHint, username, session) => {
  const endpoint = `${API_ROOT_PATH}/v2/professionals/${session.id}/set_msal_login_hint`;
  const options = {
    method: "post",
    headers: session,
    body: JSON.stringify({ msal_login_hint: newHint, msal_username: username }),
  };
  try {
    return await (await fetch(endpoint, options)).json();
  } catch (err) {
    return { error: true, data: err };
  }
};

export const getMsalLoginHint = async (session) => {
  const endpoint = `${API_ROOT_PATH}/v2/professionals/${session.id}/get_msal_login_hint`;
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

export const getSilentToken = async (msal, account) => {
  return await msal
    .acquireTokenSilent({
      ...requestOptions,
      account,
    })
    .catch(async (error) => {
      if (error instanceof InteractionRequiredAuthError) {
        return await msal
          .acquireTokenPopup({ ...requestOptions, loginHint: account.username })
          .catch((error) => ({
            error: true,
            message: "Failed to renew the token",
            data: error,
          }));
      }
    });
};

// export const getMailfolderId = async (accessToken) => {
//   try {
//     const endpoint = `${outlookApi}/me/mailFolders`;
//     const options = {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     };
//     return await (await fetch(endpoint, options)).json();
//   } catch (err) {
//     console.error(err);
//   }
// };

export const listMessages = async (
  accessToken,
  mailFolder = null,
  searchBy,
  conversationId = null
) => {
  try {
    let endpoint = `https://outlook.office.com/api/v2.0/me/MailFolders/${mailFolder}/messages?$search=%22to:${searchBy}%22`;
    if (conversationId)
      endpoint += `&$filter=ConversationId eq ${conversationId}`;

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
    return await (await fetch(endpoint, options)).json();
  } catch (err) {
    return {
      error: true,
      message: "Error occured while getting the list of messages",
      data: err,
    };
  }
};

export const getConversation = async (accessToken, conversationId) => {
  // $filter=ConversationId eq '${conversationId}'
  try {
    let endpoint = `https://outlook.office.com/api/v2.0/me/messages?$filter=ConversationId eq '${conversationId}'`;

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
    return await (await fetch(endpoint, options)).json();
  } catch (err) {
    return {
      error: true,
      message: "Error occured while getting the list of messages",
      data: err,
    };
  }
};

export const sendEmail = async (accessToken, emailBody) => {
  try {
    const endpoint = `https://outlook.office.com/api/v2.0/me/sendmail`;
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Message: { ...emailBody },
        SaveToSentItems: true,
      }),
    };
    const reqHeaders = await fetch(endpoint, options);
    return reqHeaders;
  } catch (err) {
    console.error("Error occured while sending an email: ", err);
    return {
      error: true,
      message: "Error occured while sending an email",
      data: err,
    };
  }
};

export const replyToEmail = async (accessToken, messageId, emailBody) => {
  try {
    const endpoint = `https://outlook.office.com/api/v2.0/me/messages/${messageId}/reply`;
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Comment: emailBody }),
    };
    const response = await fetch(endpoint, options);
    return response.status === 202;
  } catch (err) {
    console.error("Error occured while replying to email: ", err);
    return {
      error: true,
      message: "Error occured while replying to email",
      data: err,
    };
  }
};

export const saveEmailToDb = async (session, body) => {
  try {
    const endpoint = `${API_ROOT_PATH}/v2/outlook_messages`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    const responseBody = await (await fetch(endpoint, options)).json();
    return responseBody;
  } catch (err) {
    return {
      error: true,
      message: "Couldn not save the email into a database",
      data: err,
    };
  }
};

export const listEmailFromDb = async (professional_id, company_id, to) => {
  try {
    const endpoint = `${API_ROOT_PATH}/v2/outlook_messages/list`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ professional_id, company_id, to }),
    };
    return await (await fetch(endpoint, options)).json();
  } catch (err) {
    console.error("Unable to get the emails from the database");
    return {
      error: true,
      message: "Unable to get the emails from the database",
      data: err,
    };
  }
};
