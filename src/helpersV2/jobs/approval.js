import { API_ROOT_PATH } from "constants/api";

export const fetchRequestReview = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/job_post_approval`;

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
      throw new Error("Unable to request approval");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchApproveTierRequest = async (
  session,
  companyId,
  approvalId,
  tierName,
  teamMemberId
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/job_post_approval/${approvalId}/approve?tier=${tierName}&team_member_id=${teamMemberId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to approve review");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchRejectTierRequest = async (
  session,
  companyId,
  approvalId,
  tierName,
  teamMemberId,
  noteId
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/job_post_approval/${approvalId}/disapprove?tier=${tierName}&team_member_id=${teamMemberId}${
    noteId ? `&decline_note=${noteId}` : ""
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
      throw new Error("Unable to reject review");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchDeleteApproval = async (session, companyId, approvalId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/job_post_approval/${approvalId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to delete approval");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
