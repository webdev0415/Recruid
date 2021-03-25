import React from "react";
import ReactDOMServer from "react-dom/server";
import { API_ROOT_PATH } from "constants/api.js";
import queryString from "query-string";

export const fetchGetEmails = async (
  session,
  companyId,
  filters,
  slice,
  signal
) => {
  const query = queryString.stringify(
    {
      hidden: false,
      slice,
      ...filters,
    },
    { arrayFormat: "bracket" }
  );
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/list_emails?${query}`;

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
      throw new Error("Unable to fetch emails");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchGetEmailProfile = async (session, companyId, emailId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/${emailId}/show_email`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch emails");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCreateEmail = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/create_email`;

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
      throw new Error("Unable to create email");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchDeleteEmail = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/delete_emails`;

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
      throw new Error("Unable to delete emails");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchArchiveToggle = async (session, companyId, ids, bool) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/archive`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        archive: bool,
        id: ids,
      }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to change archiving status");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchEditEmail = async (session, companyId, emailId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/${emailId}/update_email
`;

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
      throw new Error("Unable to delete emails");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

/*
  @emailsCategories :array = ["email-${email.id}", ...]
*/
export const getEmailsStats = async (companyId, session, emailsCategories) => {
  const query = queryString.stringify(
    { emails_categories: emailsCategories },
    { arrayFormat: "bracket" }
  );
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/emails_stats?${query}`;
  const options = { method: "get", headers: session };
  try {
    const stats = await (await fetch(endpoint, options)).json();
    if (stats.error) throw new Error("Unable to get emails stats.");
    return stats;
  } catch (err) {
    return { err: true, data: err };
  }
};

export const buildHtmlBody = (content, avatar, footer) => {
  const bodyCss = {
    background: "#fff",
    padding: "20px 10px",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "600px",
    fontFamily:
      "Arial, Tahoma, Verdana, Helvetica, Georgia, Lucida, Times,Trebuchet",
  };
  const logoCss = {
    margin: "0 auto",
    maxHeight: "30px",
    maxWidth: "100px",
    objectFit: "contain",
    width: "100px",
    //eslint-disable-next-line
    width: "100%",
  };
  const emailBodyCss = {
    borderBottom: "1px solid #eee",
    padding: "30px 0",
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: "15px",
  };
  const emailHeader = {
    borderBottom: "1px solid #eee",
    paddingBottom: "30px",
    textAlign: "center",
    width: "100%",
  };
  const emailFooter = {
    paddingTop: "30px",
  };
  const htmlBody = (
    <html>
      <body style={bodyCss}>
        {avatar && (
          <div style={emailHeader}>
            <img src={avatar} alt={`company logo`} style={logoCss} />
          </div>
        )}
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          style={emailBodyCss}
        />
        {footer && (
          <>
            <div
              dangerouslySetInnerHTML={{ __html: footer }}
              style={emailFooter}
            />
          </>
        )}
      </body>
    </html>
  );

  return ReactDOMServer.renderToStaticMarkup(htmlBody);
};

export const sendTestEmail = async (session, companyId, emailId, userEmail) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/send_test?email_id=${emailId}&user_email=${userEmail}`;
  const options = { method: "get", headers: session };
  try {
    return await (await fetch(endpoint, options)).json();
  } catch (err) {
    return {
      error: true,
      data: err,
      message: "Could not send the test email. Please, try again later.",
    };
  }
};

export const getEmailInteractions = async (session, companyId, emailId) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/${emailId}/interactions`;
  const options = {
    method: "get",
    headers: session,
  };
  try {
    const emailsInteractions = await (await fetch(endpoint, options)).json();
    if (emailsInteractions?.error || !emailsInteractions) {
      throw new Error(
        "Could not get emails interactions. Please try again later."
      );
    }
    return emailsInteractions;
  } catch (err) {
    return { error: true, data: err };
  }
};
