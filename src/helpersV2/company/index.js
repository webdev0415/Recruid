import { API_ROOT_PATH } from "constants/api.js";
import fetch from "fetch-retry";

export const fetchAllMyCompanies = async (session) => {
  const url = `${API_ROOT_PATH}/v2/companies?all_my_companies=true`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch companies");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchCompanyData = async (session, companyMentionTag) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyMentionTag}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch company data");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchFullCompanyData = async (
  session,
  companyMentionTag,
  signal
) => {
  const url = `${API_ROOT_PATH}/v1/companies/${companyMentionTag}`;
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
      throw new Error("Unable to fetch company data");
    }
    return res;
  } catch (err) {
    if (err.name === "AbortError") {
      return { err: true };
    } else {
      return { err: true, ...error, customError: err };
    }
  }
};
export const updateCompanyData = async (session, companyId, payload) => {
  const url = `${API_ROOT_PATH}/v1/companies/${companyId}`;
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
      throw new Error("Unable to change company data");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchDeleteCompany = async (session, companyId) => {
  const url = `${API_ROOT_PATH}/v1/companies/${companyId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to delete company");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchTeamMembers = async (session, companyId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/team_members`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch team members");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchRole = async (session, companyId) => {
  const url = `${API_ROOT_PATH}/v2/permissions/${companyId}/permission_exists`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch role");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const createNewCompany = async (session, company) => {
  const url = `${API_ROOT_PATH}/v1/companies`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(company),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to create company");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const getCandidatesAndContactsEmails = async (session, companyId) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/candidates_contacts_emails`;
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

export const fetchCompanyApprovalProcess = async (session, companyId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/approval_process`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch approval process");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchUpdateApprovalProcess = async (
  session,
  companyId,
  processId,
  body
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/approval_process/${processId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify(body),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch approval process");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCompanyJobExtraFields = async (session, companyId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/job_post_settings`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch extra fields settings");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchUpdateJobExtraFields = async (session, settingsId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${settingsId}/update_job_post_settings`;

  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify(body),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to update extra field settings");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const getCompanyApplicationQuestions = async (companyId, session) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/application_questions`;
  const options = { method: "get", headers: session };
  try {
    return await (await fetch(endpoint, options)).json();
  } catch (err) {
    return {
      error: true,
      data: err,
      message: "Failed to get application questions",
    };
  }
};

export const updateCompanyApplicationQuestions = async (companyId, session, questions) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/application_questions`;
  const options = { method: "put", headers: session, body: JSON.stringify({ application_questions: questions }) };
  try {
    return await (await fetch(endpoint, options)).json();
  } catch (err) {
    return {
      error: true,
      data: err,
      message: "Failed to get application questions",
    };
  }
};
