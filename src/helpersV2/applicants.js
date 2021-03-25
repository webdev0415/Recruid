import { API_ROOT_PATH } from "constants/api.js";

export const fetchJobApplicants = async (
  companyId,
  jobId,
  session,
  postBody
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/applicants/list_applicants?job_id=${jobId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(postBody),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch job applicants");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchMoreApplicantsByStageAndStatus = async (
  companyId,
  jobId,
  stage,
  slice,
  session,
  status
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/applicants/more_applicants`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        job_id: jobId,
        stage: stage,
        slice: slice,
        status: status,
      }),
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

export const fetchChangeCandidateStatus = async (
  companyId,
  applicantId,
  newStatus,
  newStage,
  session,
  missingInfo
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/applicants/set_status`;
  let error;

  let postBody = {
    applicant_ids: Array.isArray(applicantId) ? applicantId : [applicantId],
    stage: newStage,
    status: newStatus,
  };
  if (missingInfo) {
    postBody = { ...postBody, ...missingInfo };
  }

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(postBody),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to change status");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchChangeCandidateIndex = async (
  companyId,
  applicantId,
  newIndex,
  session
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/applicants/set_index`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        applicant_id: applicantId,
        index: newIndex,
      }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to change status");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchRemoveCandidate = async (companyId, applicantId, session) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/applicants/${applicantId}/remove_applicant`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to change status");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const addHiringManagers = async (
  companyId,
  applicantId,
  session,
  hiringManagersArray,
  emailBody,
  teamMemberId
) => {
  const url = `${API_ROOT_PATH}/v1/companies/${companyId}/team_members/add_candidate/${applicantId}?team_member_id=${teamMemberId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        hiring_manager_ids: hiringManagersArray,
        email_body: emailBody,
      }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to add hiring managers");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const removeHiringManagers = async (
  companyId,
  applicantId,
  session,
  hiringManagersArray
) => {
  const url = `${API_ROOT_PATH}/v1/companies/${companyId}/team_members/remove_candidate/${applicantId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ hiring_manager_ids: hiringManagersArray }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to add hiring managers");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCandidateApplications = async (
  professionalId,
  companyId,
  session,
  teamMemberId
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/professionals/${professionalId}/job_posts?team_member_id=${teamMemberId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch applications");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchTriggerApproval = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/team_members/approve_candidate`;
  let error;
  try {
    let response = await fetch(url, {
      method: "put",
      headers: session,
      body: JSON.stringify(body),
    });
    if (!response.ok || response.status >= 300) {
      error = response;
      throw new Error("Unable to send approval");
    }
    return response;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
