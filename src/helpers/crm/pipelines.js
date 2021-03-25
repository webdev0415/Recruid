import { API_ROOT_PATH } from "constants/api";

export const fetchAllPipelines = async (session, companyId, team_member_id) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/pipelines?team_member_id=${team_member_id}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch pipelines");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchPipelineWithDeals = async (
  session,
  companyId,
  pipelineId,
  filters,
  signal
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/pipelines/${pipelineId}/pipeline_deals`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ filters }),
      signal,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch pipeline");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

// export const fetchPipelineStageCount = async (
//   session,
//   companyId,
//   pipelineId
// ) => {
//   const url = `${API_ROOT_PATH}/v1/fetchPipelineStageCount`;
//   let error;
//   try {
//     let response = await fetch(url, {
//       method: "GET",
//       headers: session
//     });
//     let res = await response.json();
//     if (!response.ok || res.error) {
//       error = res;
//       throw new Error("Unable to fetch pipeline stages");
//     }
//     return res;
//   } catch (err) {
//     return { err: true, ...error, customError: err };
//   }
// };

export const fetchMoreDealsByStage = async (
  session,
  companyId,
  stageId,
  filters
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/deals/${stageId}/more_deals`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ filters }),
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch pipeline");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const createNewPipeline = async (session, companyId, postBody) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/pipelines`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ pipeline: postBody }),
    });
    let res = await response.json();
    if (!response.ok || res.errors) {
      error = res;
      throw new Error("Unable to create pipeline");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const editExistingPipeline = async (
  session,
  companyId,
  pipelineId,
  postBody
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/pipelines/${pipelineId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify({ pipeline: postBody }),
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to create pipeline");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchToggleArchivePipeline = async (
  session,
  companyId,
  pipelineId
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/pipelines/${pipelineId}/toggle_archived`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to archive pipeline");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchDeletePipeline = async (session, companyId, pipelineId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/pipelines/${pipelineId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to delete pipeline");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
