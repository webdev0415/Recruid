import { API_ROOT_PATH } from "constants/api";

export async function newJoiners(companyId, session, teamMemberId) {
  const url =
    API_ROOT_PATH +
    `/v1/talent_network/${companyId}/new_starters?team_member_id=${teamMemberId}`;

  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
  })
    .then((response) => {
      if (response.ok) return response.json();
      else return "err";
    })
    .catch(() => {});

  return data;
}

export async function dashboardStats(companyId, session, teamMemberId) {
  const url =
    API_ROOT_PATH +
    `/v1/companies/interactions/dashboard_stats/${companyId}?team_member_id=${teamMemberId}`;

  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
  })
    .then((response) => {
      if (response.ok) return response.json();
      else return "err";
    })
    .catch(() => {});

  return data;
}
