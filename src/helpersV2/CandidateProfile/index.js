import { API_ROOT_PATH } from "constants/api";
export default {
  fetchTalentNetworkProfile: async function (proId, compId, session, jobData) {
    let url = API_ROOT_PATH + `/v1/talent_network/${compId}/profile/${proId}`;
    if (jobData) {
      url += `?job_id=${jobData.id}`;
    }
    const data = fetch(url, {
      method: "GET",
      headers: session,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return "err";
      }
    });
    return data;
  },
  editTalentNetworkProfile: async function (proId, compId, session, payload) {
    const url = API_ROOT_PATH + `/v1/talent_network/${compId}/update/${proId}`;
    const data = fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify(payload),
    }).then((response) => {
      if (response.ok) return response.json();
    });
    return data;
  },
};

export async function fetchResumes(tnId, session) {
  const url =
    API_ROOT_PATH + `/v1/candidate_cvs/cv_list?professionaltn_id=${tnId}`;
  const data = fetch(url, {
    method: "GET",
    headers: session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}

export async function fetchActivity(
  companyId,
  professionalId,
  session,
  page,
  jobId
) {
  let url =
    API_ROOT_PATH +
    `/v1/talent_network/${companyId}/activities/${professionalId}?page=${page}`;

  if (jobId) {
    url += `&job_id=${jobId}`;
  }
  const data = fetch(url, {
    method: "GET",
    headers: session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}

export async function fetchDocuments(ptnId, session) {
  const url = API_ROOT_PATH + `/v1/documents?ptn_id=${ptnId}`;
  const data = fetch(url, {
    method: "GET",
    headers: session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}

export async function deleteDocumentCall(docId, session) {
  const url = API_ROOT_PATH + `/v1/documents/${docId}`;
  const data = fetch(url, {
    method: "DELETE",
    headers: session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}

export async function uploadFile(session, data) {
  const url = API_ROOT_PATH + "/v1/documents";
  try {
    const postData = await fetch(url, {
      method: "POST",
      headers: session,
      body: data,
    });
    const response = await postData.json();
    return response;
  } catch (err) {
    console.error("Error uploading file: ", err);
  }
}

export const fetchCandidateInterviews = async (
  session,
  companyId,
  profileId,
  teamMemberId
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/professionals/${profileId}/interview_events?team_member_id=${teamMemberId}

`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch candidate interviews");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const convertCandidateToContact = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v2/talent_network/${companyId}/transform_to_contact`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ deal_contact: body }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to convert candidate to contact");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchTogglePrimaryCv = async (ptnId, doc, session) => {
  const url = `${API_ROOT_PATH}/v1/documents/${doc.id}`;

  let error;
  try {
    const response = await fetch(url, {
      method: "put",
      headers: session,
      body: JSON.stringify({ is_latest_cv: !doc.is_latest_cv, ptn_id: ptnId }),
    });
    const res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to change primary cv");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const updateCandidateCollaborators = async (
  session,
  companyId,
  ptnId,
  body
) => {
  const url = `${API_ROOT_PATH}/v1/talent_network/${companyId}/profile/${ptnId}/update_collaborators`;

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
      throw new Error("Unable to update candidate collaborator");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
