import { API_ROOT_PATH } from "constants/api";

export const addTeamMember = async (companyId, session, postBody) => {
  try {
    const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/team_members/add`;
    const options = {
      method: "POST",
      headers: session,
      body: JSON.stringify(postBody),
    };
    const teamMemberRes = await (await fetch(endpoint, options)).json();
    return teamMemberRes;
  } catch (err) {
    return {
      error: true,
      message: "Couldn't add a new team member",
      data: err,
    };
  }
};

export const removeTeamMember = async (companyId, session, teamMemberId) => {
  try {
    const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/team_members/${teamMemberId}/remove`;
    const options = { method: "GET", headers: session };
    const tmResponse = await (await fetch(endpoint, options)).json();
    return tmResponse;
  } catch (err) {
    return { error: true, message: "Failed to remove team member", data: err };
  }
};

export const fetchUpdateMemberRole = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/team_members/change_role`;
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
      throw new Error("Unable to update role");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchUpdateMemberPermissionRole = async (
  session,
  companyId,
  body
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/team_members/change_permission`;
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
      throw new Error("Unable to update permission");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchAssignMembers = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/team_members/assign`;
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
      throw new Error("Unable to update assigned members");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
