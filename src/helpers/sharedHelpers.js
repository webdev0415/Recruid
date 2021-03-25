import { API_ROOT_PATH } from "constants/api";
import qs from "querystring";

export default {
  permissions: async (companyId, session) => {
    const url =
      API_ROOT_PATH + `/v1/permissions/${companyId}/permission_exists`;
    const params = { method: "GET", headers: session };
    try {
      const data = await fetch(url, params);
      return await data.json();
    } catch (e) {
      console.error(`Error getting the permission.`);
    }
  },
  companyData: async (mentionTag, session) => {
    const url = API_ROOT_PATH + "/v1/companies/" + mentionTag;
    const companyData = await fetch(url, {
      method: "GET",
      headers: session,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return "err";
      }
    });
    return companyData;
  },
  jobData: async (companyId, session, page, teamMemberId, signal) => {
    let url =
      API_ROOT_PATH +
      `/v1/companies/${companyId}/job_posts?page=${
        page ? page : 1
      }&talent_network=true`;
    if (teamMemberId) url += `&team_member_id=${teamMemberId}`;
    const jobData = await fetch(url, {
      method: "GET",
      headers: session,
      signal,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .catch(() => {});
    return jobData;
  },
  applicantData: async (jobId, session, companyId, page, teamMemberId) => {
    let url =
      API_ROOT_PATH +
      `/v1/companies/job_posts/${jobId}/get_applicant_list_total_pages?page=${page}&talent_network=true`;

    if (companyId) url += `&company_id=${companyId}`;
    if (teamMemberId) url += `&team_member_id=${teamMemberId}`;

    const applicantData = await fetch(url, {
      method: "GET",
      headers: session,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return "err";
      }
    });

    return applicantData;
  },

  talentNetwork: async (id, page, session, jobId, signal) => {
    let url =
      API_ROOT_PATH +
      `/v1/talent_network/${id}/index?page=${page}&talent_network=true`;
    if (jobId) url += `&job_id=${jobId}`;
    const data = await fetch(url, {
      method: "GET",
      headers: session,
      signal,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return "err";
      }
    });
    return data;
  },
  searchNetwork: async (id, name, session) => {
    let url =
      API_ROOT_PATH +
      `/v1/talent_network/${id}/search?professional_name=${name}`;
    // if (jobId) url += `&job_id=${jobId}`;
    const data = await fetch(url, {
      method: "GET",
      headers: session,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else return "err";
    });
    return data;
  },
  inviteProfessionalsToJob: async (postBody, session) => {
    const url = API_ROOT_PATH + "/v1/companies/interactions/invite_to_job";
    const data = fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(postBody),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    });
    return data;
  },
  filterApplicants: async function filterApplications(
    companyId,
    filterParams,
    session
  ) {
    const url =
      API_ROOT_PATH +
      `/v1/talent_network/${companyId}/filter?` +
      qs.stringify(filterParams);
    const data = await fetch(url, {
      method: "GET",
      headers: session,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    });
    return data;
  },
  extractOptions: function extractOptions(list) {
    let values = [];
    for (let index in list) {
      values.push({
        label: list[index].name,
        value: list[index].id || list[index].team_member_id,
      });
    }
    return values;
  },
  fetchTeamMembers(id, session) {
    let url = API_ROOT_PATH + `/v1/companies/${id}/team_members`;
    const data = fetch(url, {
      method: "GET",
      headers: session,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    });
    return data;
  },
  fetchAgencies: async (session) => {
    const url = `${API_ROOT_PATH}/v1/companies/agencies`;
    const params = { method: `GET`, headers: session };
    try {
      const data = await fetch(url, params);
      return await data.json();
    } catch (e) {
      console.error(`Error getting the list of agencies: ${e}`);
    }
  },
};
