import { API_ROOT_PATH } from "constants/api";

export async function deactivateRPO(companyId, jobId) {
  const url =
    API_ROOT_PATH + `/v1/payments/${companyId}/deactivate_job_rpo/${jobId}`;
  const data = await fetch(url, {
    method: "GET",
    headers: this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}

export async function setJobStatus(status, companyId, jobId) {
  const url = API_ROOT_PATH + `/v1/companies/${companyId}/job_posts/${jobId}`;
  const data = fetch(url, {
    method: "PUT",
    headers: this.props.session,
    body: JSON.stringify({ job_post: { job_status: status } }),
  }).then((response) => {
    if (response.ok) return response.json();
    else return Promise.resolve("err");
  });
  return data;
}

export async function deleteJob(companyId, jobId, session) {
  const url = API_ROOT_PATH + `/v1/companies/${companyId}/job_posts/${jobId}`;
  const data = fetch(url, {
    method: "DELETE",
    headers: session || this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}

export async function editJob(companyId, jobId, body, session) {
  const url = API_ROOT_PATH + `/v1/companies/${companyId}/job_posts/${jobId}`;
  const data = fetch(url, {
    method: "PUT",
    headers: session,
    body: JSON.stringify(body),
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}

export async function publishDraft(companyId, jobId) {
  const url =
    API_ROOT_PATH +
    `/v1/companies/${companyId}/job_posts/publish_draft/${jobId}`;

  const data = fetch(url, {
    method: "GET",
    headers: this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}
