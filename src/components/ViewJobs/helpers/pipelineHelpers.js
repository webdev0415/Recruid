import { API_ROOT_PATH } from "constants/api";
import queryString from "query-string";

export const fetchAllMyJobs = async (
  companyId,
  session,
  slice,
  filters,
  getTotalResults
) => {
  const url =
    `${API_ROOT_PATH}/v2/companies/${companyId}/job_posts` +
    `?slice=${slice}` +
    `&get_total_results=${getTotalResults}` +
    `&talent_network=true`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(filters),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch jobs");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const getTotalJobsAtStage = async (
  companyId,
  session,
  clientId,
  team_member_id
) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/job_posts/total_jobs_at_stage?team_member_id=${team_member_id}${
    clientId ? `&client_id=${clientId}` : ""
  }`;
  const options = {
    method: "GET",
    headers: session,
  };
  try {
    const totalJobsAtStage = await (await fetch(endpoint, options)).json();
    if (totalJobsAtStage) return totalJobsAtStage;
  } catch (err) {
    console.error("Error: Unable to get total count of jobs for the pipeline");
  }
};

export const filterJobsByStage = async (
  session,
  companyId,
  stage,
  slice,
  getTotalResults = false,
  clientId,
  team_member_id
) => {
  const query = queryString.stringify({
    get_total_results: getTotalResults,
    client_id: clientId,
    team_member_id,
  });
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/job_posts/stage_filter?slice=${slice}&${query}`;
  const options = {
    method: "POST",
    headers: session,
    body: JSON.stringify({ stage }),
  };
  try {
    const filteredJobs = await (await fetch(endpoint, options)).json();
    if (filteredJobs) return filteredJobs;
    throw new Error();
  } catch (err) {
    console.error("Error: Unable to get filtered list of jobs.");
  }
};

export const getTotalCandidatesAtStage = async (
  companyId,
  jobId,
  session,
  teamMemberId
) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/applicants/get_stage_counts?job_id=${jobId}&team_member_id=${teamMemberId}`;
  const options = { method: "GET", headers: session };
  try {
    const candidatesCount = await (await fetch(endpoint, options)).json();
    if (typeof candidatesCount === "object") return candidatesCount;
    throw new Error();
  } catch (err) {
    console.error(
      "Error: Unable to get total count of candidates for the pipeline."
    );
  }
};

export const getAllCandidates = async (
  companyId,
  jobId,
  session,
  slice,
  totalResults
) => {
  const endpoint =
    `${API_ROOT_PATH}/v2/companies/${companyId}/applicants/get_job_applicants` +
    `?slice=${slice}` +
    `&get_total_results=${totalResults}` +
    `&job_id=${jobId}`;
  const options = { method: "GET", headers: session };
  try {
    const allCandidates = await (await fetch(endpoint, options)).json();
    if (typeof allCandidates === "object") return allCandidates;
    throw new Error();
  } catch (err) {
    console.error("Error: Unable to get the list of candidates for the job.");
  }
};

export const filterCandidatesByStage = async (
  companyId,
  jobId,
  session,
  slice,
  stage,
  teamMemberId,
  getTotalResults = false
) => {
  const endpoint =
    `${API_ROOT_PATH}/v2/companies/${companyId}/applicants/stage_filter` +
    `?slice=${slice}` +
    `&stage=${stage}` +
    `&get_total_results=${getTotalResults}` +
    `&team_member_id=${teamMemberId}`;
  const options = {
    method: "POST",
    headers: session,
    body: JSON.stringify({ job_id: jobId }),
  };
  try {
    const filteredCandidates = await (await fetch(endpoint, options)).json();
    if (typeof filteredCandidates === "object") return filteredCandidates;
    throw new Error();
  } catch (err) {
    console.error("Error: Unable to get list of filtered candidates");
  }
};

export const getProfessional = async (username, session) => {
  const endpoint = `${API_ROOT_PATH}/v1/professionals/${username}`;
  const options = { method: "GET", headers: session };
  try {
    const professional = await (await fetch(endpoint, options)).json();
    if (!professional.hasOwnProperty("error")) return professional;
    throw new Error();
  } catch (err) {
    console.error("Error: Unable to get the professional for the TNProfile");
  }
};
