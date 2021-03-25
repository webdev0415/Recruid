import { API_ROOT_PATH } from "constants/api";

export const singleJobData = async (
  jobId,
  session,
  companyId,
  teamMemberId,
  signal
) => {
  let url =
    API_ROOT_PATH +
    `/v1/companies/job_posts/get_job_post/${jobId}?team_member_id=${teamMemberId}`;

  if (companyId) {
    url += `&company_id=${companyId}`;
  }
  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
    signal,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
};

export const jobTimeline = async (jobId, session, page, companyId) => {
  const url =
    API_ROOT_PATH +
    `/v1/companies/${companyId}/interactions/job_timeline/${jobId}?page=${page}`;
  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
};

export const fetchJobCandidateNotes = async (payload, session) => {
  const url = API_ROOT_PATH + `/v1/notes/candidate_notes`;

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
};

export const fetchIndicators = async (jobId, companyId, session) => {
  const url =
    API_ROOT_PATH +
    `/v1/companies/${companyId}/job_posts/${jobId}/job_post_time_at_stage`;
  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
};

export const vendorIndex = async (companyId, session) => {
  const url = API_ROOT_PATH + `/v1/vendors/${companyId}/index`;

  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
};

export const inviteTeamMember = async (payload, jobId, companyId, session) => {
  const url =
    API_ROOT_PATH + `/v1/companies/${companyId}/team_members/add_job/${jobId}`;
  const data = fetch(url, {
    method: "POST",
    headers: session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
};

export const removeJob = async (companyId, jobId, memberId, session) => {
  const url =
    API_ROOT_PATH +
    `/v1/companies/${companyId}/team_members/remove_job/${jobId}/${memberId}`;
  const data = fetch(url, {
    method: "GET",
    headers: session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
};

export const addJobToVendor = async (companyId, vendorId, jobId, session) => {
  const url = API_ROOT_PATH + `/v1/vendors/${companyId}/add_vendor_to_job`;
  const data = fetch(url, {
    method: "POST",
    headers: session,
    body: JSON.stringify({ job_id: jobId, vendor_id: vendorId }),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
};

export const removeJobFromVendor = async (
  companyId,
  vendorId,
  jobId,
  session
) => {
  const url = API_ROOT_PATH + `/v1/vendors/${companyId}/remove_vendor_from_job`;
  const data = fetch(url, {
    method: "POST",
    headers: session,
    body: JSON.stringify({ job_id: jobId, vendor_id: vendorId }),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
};

export const fetchJobApplicantIds = async (session, companyId, jobId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/job_posts/${jobId}/applicants_candidate_id`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch applicants");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
