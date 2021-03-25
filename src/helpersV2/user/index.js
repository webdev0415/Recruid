import { API_ROOT_PATH } from "constants/api.js";
import notify from "notifications";
import fetch from "fetch-retry";

export const fetchSession = async (credentials) => {
  const url = `${API_ROOT_PATH}/v2/professional_auth/sign_in`;
  // const url = `${API_ROOT_PATH}/professional_auth/sign_in`;

  let error;
  let session;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    session = {
      "Content-Type": "application/json",
      "access-token": response.headers.get("access-token"),
      client: response.headers.get("client"),
      expiry: response.headers.get("expiry"),
      tokenType: response.headers.get("token-type"),
      uid: response.headers.get("uid"),
    };

    let res = await response.json();
    session = { ...session, ...res.data, name: undefined };

    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch user data");
    }
    return session;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchSignOut = async (session) => {
  const url = `${API_ROOT_PATH}/professional_auth/sign_out`;
  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to log out");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchUser = async (session, username) => {
  const url = `${API_ROOT_PATH}/v2/professionals/${username}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch user data");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchFullUser = async (session, username) => {
  const url = `${API_ROOT_PATH}/v1/professionals/${username}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch user data");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchUpdateUser = async (session, userId, postBody) => {
  const url = `${API_ROOT_PATH}/v1/professionals/${userId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify({ professional: postBody }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to update user data");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchNotifications = async (session, userId) => {
  const url = `${API_ROOT_PATH}/v1/professionals/${userId}/notifications`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch user notifications");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const handleResetUpdate = async (body, session) => {
  const url = `${API_ROOT_PATH}/professional_auth/password`;
  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session || { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to change password");
    }
    notify("info", "Password has been successfully updated");
    return res;
  } catch (err) {
    notify("danger", "Unable to update password");
    return { err: true, ...error, customError: err };
  }
};

export const fetchDeleteAccount = async (session) => {
  const url = `${API_ROOT_PATH}/professional_auth`;
  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to delete account");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchActivateAccount = async (session, userId) => {
  const url = `${API_ROOT_PATH}/v1/professionals/${userId}/activate_profile`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to activate account");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const updateDefaultPassword = async (
  password,
  password_confirmation,
  session
) => {
  const url = `${API_ROOT_PATH}/professional_auth/password`;
  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify({
        password,
        password_confirmation,
        email: session.uid,
      }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to update password");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const checkEmailExistence = async (email) => {
  const url = `${API_ROOT_PATH}/v2/professionals/check_if_email_exists`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to check email");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const createCompanyBackEnd = async (body) => {
  const url = `${API_ROOT_PATH}/v1/companies/create_prof_and_company`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to create account");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
