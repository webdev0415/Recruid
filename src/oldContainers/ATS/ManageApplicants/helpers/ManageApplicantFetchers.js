import { API_ROOT_PATH } from "../../../../constants/api";

export async function searchCandidates(
  jobId,
  companyId,
  searchTerm,
  talentNetwork,
  teamMemberId
) {
  let url =
    API_ROOT_PATH +
    `/v1/companies/job_posts/${jobId}/search_candidates?company_id=${companyId}&search_term=${searchTerm}`;

  if (talentNetwork) {
    url += "&talent_network=true";
  }
  if (teamMemberId) url += `&team_member_id=${teamMemberId}`;
  const data = fetch(url, {
    method: "GET",
    headers: this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}

export async function stageCount(jobId, companyId, teamMemberId, session) {
  let url =
    API_ROOT_PATH +
    `/v1/companies/${companyId}/job_posts/${jobId}/candidate_status_count`;
  if (teamMemberId) url += `?team_member_id=${teamMemberId}`;
  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
  })
    .then((response) => {
      if (response?.ok) return response.json();
      else return "err";
    })
    .catch(() => "err");
  return data;
}

export async function statusFilter(
  jobId,
  companyId,
  status,
  page,
  stage,
  teamMemberId
) {
  let url =
    API_ROOT_PATH +
    `/v1/companies/job_posts/${jobId}/status_filter/${status}?page=${page}&company_id=${companyId}`;
  url += "&talent_network=true";
  if (stage) {
    url += `&stage=${stage}`;
  }
  if (teamMemberId) {
    url += `&team_member_id=${teamMemberId}`;
  }
  const data = fetch(url, {
    method: "GET",
    headers: this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}

export async function applicantData(
  jobId,
  session,
  companyId,
  page,
  teamMemberId
) {
  let url =
    API_ROOT_PATH +
    `/v1/companies/job_posts/${jobId}/get_applicant_list_total_pages?page=${page}&talent_network=true`;

  if (companyId) url += `&company_id=${companyId}`;

  if (teamMemberId) url += `&team_member_id=${teamMemberId}`;
  try {
    const getApplicantData = await fetch(url, {
      method: "GET",
      headers: session,
    });
    const data = await getApplicantData.json();
    return data;
  } catch (err) {
    console.error(`Error getting the applicants list: ${err}`);
  }
}

export async function invitedManual(jobId, applicantId) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/invited_manual";

  const data = fetch(url, {
    method: "POST",
    headers: this.props.session,
    body: JSON.stringify({
      job_post_id: jobId,
      applicant_id: applicantId,
    }),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function inviteAccepted(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/invite_accepted";

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function shortlistCandidate(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/shortlisted";

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };
  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function toBeScreened(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/to_be_screened";

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify({
      job_post_id: jobId,
      applicant_id: applicantId,
    }),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function toBeApproved(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/to_be_approved";

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify({
      job_post_id: jobId,
      applicant_id: applicantId,
    }),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function awaitingReview(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/awaiting_review";

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function approveCandidate(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/approved";

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function interviewRequested(
  jobId,
  applicantId,
  reschedule,
  session
) {
  const url =
    API_ROOT_PATH + `/v1/companies/interactions/static_request_interview`;

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  if (reschedule) {
    payload.reschedule = true;
  }

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    return "err";
  });

  return data;
}

export async function toBeScheduled(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/to_be_scheduled";

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify({ job_post_id: jobId, applicant_id: applicantId }),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function toBeRescheduled(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/to_be_rescheduled";

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify({ job_post_id: jobId, applicant_id: applicantId }),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function invitedToEvent(jobId, applicantId, session) {
  const url =
    API_ROOT_PATH + "/v1/companies/interactions/static_invite_to_event";

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function attendingEvent(jobId, applicantId, session) {
  const url =
    API_ROOT_PATH + "/v1/companies/interactions/static_attending_event";

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function conductedInterview(jobId, applicantId, session) {
  const url =
    API_ROOT_PATH +
    `/v1/companies/interactions/${jobId}/interview_conducted/${applicantId}`;

  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function interviewAccepted(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/interview_scheduled";

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function interviewRescheduled(jobId, applicantId, session) {
  const url =
    API_ROOT_PATH + "/v1/companies/interactions/interview_rescheduled";

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function toBeOffered(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/to_be_offered";

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function contractSent(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/contract_sent";

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function verballyAccepted(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/verbally_accepted";

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function formallyAccepted(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/formally_accepted";

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function hireCandidate(jobId, applicantId, session) {
  const url = API_ROOT_PATH + `/v1/companies/interactions/hired`;
  const payload = {
    status: "hired",
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function onboarding(jobId, applicantId, hireInfo) {
  const url = API_ROOT_PATH + `/v1/companies/interactions/onboarding`;

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
    ...hireInfo,
  };

  const data = fetch(url, {
    method: "POST",
    headers: this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function offerSent(jobId, applicantId, session) {
  const url = API_ROOT_PATH + `/v1/companies/interactions/offer_sent`;

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function offerRequested(jobId, applicantId, session) {
  const url = API_ROOT_PATH + `/v1/companies/interactions/offer_requested`;

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };
  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function gatheringInformation(jobId, applicantId, session) {
  const url =
    API_ROOT_PATH + `/v1/companies/interactions/gathering_information`;

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function contractSigned(jobId, applicantId, session) {
  const url = API_ROOT_PATH + `/v1/companies/interactions/contract_signed`;

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function startConfirmed(jobId, applicantId, hireInfo, session) {
  const url = API_ROOT_PATH + `/v1/companies/interactions/start_date_confirmed`;

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
    ...hireInfo,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function verballyOffered(jobId, applicantId, session) {
  const url = API_ROOT_PATH + `/v1/companies/interactions/verbally_offered`;

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function hireApplicant(jobId, professionalId, hireInfo, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/static_hired";

  const payload = {
    job_post_id: jobId,
    applicant_id: professionalId,
    ...hireInfo,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function removeCandidate(jobId, applicantId, session) {
  const url =
    API_ROOT_PATH +
    `/v1/companies/interactions/${jobId}/remove_applicant/${applicantId}`;
  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function rejectCandidate(jobId, applicantId, feedback, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/decline";

  const payload = {
    ...feedback,
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function staticDecline(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/static_decline";

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function staticRejected(jobId, applicantId, session) {
  const url = API_ROOT_PATH + "/v1/companies/interactions/static_rejected";

  const payload = {
    job_post_id: jobId,
    applicant_id: applicantId,
  };

  const data = fetch(url, {
    method: "POST",
    headers: session || this.props.session,
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function filterApplicants(
  companyId,
  jobId,
  filterParams,
  teamMemberId
) {
  let url =
    API_ROOT_PATH +
    `/v1/companies/${companyId}/job_posts/${jobId}/filter-applicants`;
  if (teamMemberId) url += `?team_member_id=${teamMemberId}`;
  const data = await fetch(url, {
    method: "POST",
    headers: this.props.session,
    body: JSON.stringify(filterParams),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function submitCandidatesToClient(
  employerId,
  candidatesIds,
  session,
  companyId,
  docIds,
  email_copy,
  contact_id,
  justSubmit
) {
  const url = API_ROOT_PATH + `/v1/clients/${employerId}/submit_to_employer`;
  let body = {
    candidate_ids: candidatesIds,
    company_id: companyId,
    email_copy,
    contact_id,
    just_submit: justSubmit,
  };

  if (docIds) {
    body = { ...body, ...docIds };
  }
  const data = await fetch(url, {
    method: "POST",
    headers: session,
    body: JSON.stringify(body),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}
