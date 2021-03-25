import { API_ROOT_PATH } from "constants/api.js";
import fetch from "fetch-retry";

export const fetchCompanyClients = async (session, companyId) => {
  const url = `${API_ROOT_PATH}/v1/clients/${companyId}/index?get_all=true`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch clients");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const inviteClientToPlatform = async (
  session,
  companyId,
  clientId,
  contactId
) => {
  const url = `${API_ROOT_PATH}/v1/clients/invite_by_agency`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        agency_id: companyId,
        id: Number(clientId),
        contact_id: contactId,
      }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch clients");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchPipelineForecast = async (
  session,
  companyId,
  pipelineId,
  dateBoundary,
  teamMemberId
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/crm_analytics/forecast?pipeline_id=${pipelineId}&date_filter=${dateBoundary}${
    teamMemberId ? `&team_member_id=${teamMemberId}` : ""
  }`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch forecast");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCRMProductivity = async (
  session,
  companyId,
  dateBoundary,
  teamMemberId
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/crm_analytics/productivity?date_filter=${dateBoundary}${
    teamMemberId ? `&team_member_id=${teamMemberId}` : ""
  }`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch productivity");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCRMPerformance = async (
  session,
  companyId,
  dateBoundary,
  teamMemberId
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/crm_analytics/performance?date_filter=${dateBoundary}${
    teamMemberId ? `&team_member_id=${teamMemberId}` : ""
  }`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch performance");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchPipelinesAnalytics = async (
  session,
  companyId,
  dateBoundary,
  teamMemberId
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/crm_analytics/deals_at_stage?date_filter=${dateBoundary}${
    teamMemberId ? `&team_member_id=${teamMemberId}` : ""
  }`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch pipelines analytics");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const updateCompanyCollaborators = async (
  session,
  companyId,
  clientId,
  body
) => {
  const url = `${API_ROOT_PATH}/v1/companies/${companyId}/clients/${clientId}/update_collaborators`;

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
      throw new Error("Unable to update client collaborators");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const changeClientStatus = async (session, clientId, body) => {
  const url = `${API_ROOT_PATH}/v2/company_details/${clientId}`;

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
      throw new Error("Unable to update client status");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
