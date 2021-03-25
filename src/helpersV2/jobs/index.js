import { API_ROOT_PATH } from "constants/api";

export const fetchJobs = async (session, companyId, filters, signal) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/job_posts/list?talent_network=true`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ filters }),
      signal,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to get jobs list");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const searchJobs = async (companyId, jobTitle, session, clientId) => {
  try {
    const endpoint = `${API_ROOT_PATH}/v1/companies/${companyId}/job_posts/search?job_search=${jobTitle}${
      clientId ? `&client_id=${clientId}` : ""
    }`;
    const options = { method: "GET", headers: session };
    return await (await fetch(endpoint, options)).json();
  } catch (err) {
    return { error: "Unable to get a search resuslts" };
  }
};

export const getJobPost = async (companyId, jobId, session) => {
  try {
    const jobData = await (
      await fetch(
        `${API_ROOT_PATH}/v1/companies/${companyId}/job_posts/${jobId}`,
        {
          method: "GET",
          headers: session,
        }
      )
    ).json();
    if (!jobData?.err && !jobData?.error && !jobData?.errors) {
      return jobData;
    }
    throw new Error("Failed to get the job post");
  } catch (err) {
    return { error: err };
  }
};

export const createJobSlug = (title, id) =>
  title.toLowerCase().split(" ").concat(id).join("-");

export const fetchVendors = async (session, companyId) => {
  const url = `${API_ROOT_PATH}/v1/clients/${companyId}/for_job?get_all=true`;

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

export const fetchCreateJob = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v1/companies/${companyId}/job_posts`;

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
      throw new Error("Unable to create job");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchEditJob = async (
  session,
  company_id,
  job_id,
  body,
  signal
) => {
  const url = `${API_ROOT_PATH}/v1/companies/${company_id}/job_posts/${job_id}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify(body),
      signal,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to edit job");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
