import { API_ROOT_PATH } from "constants/api";

export async function companyAnalytics(companyId, dateOption, session, signal) {
  const url =
    API_ROOT_PATH +
    `/v1/analytics/${companyId}/company_analytics?date_option=${dateOption}`;

  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
    signal,
  })
    .then((response) => {
      if (response.ok) return response.json();
      else return "err";
    })
    .catch(() => {});

  return data;
}

export async function professionalsAtStage(
  companyId,
  dateOption,
  stage,
  session,
  signal
) {
  const url =
    API_ROOT_PATH +
    `/v1/analytics/${companyId}/professionals_at_stage?date_option=${dateOption}&stage=${stage}`;

  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
    signal,
  })
    .then((response) => {
      if (response.ok) return response.json();
      else return "err";
    })
    .catch(() => {});

  return data;
}

export async function averageApplicants(
  companyId,
  dateOption,
  session,
  signal
) {
  const url =
    API_ROOT_PATH +
    `/v1/analytics/${companyId}/average_applicants?date_option=${dateOption}`;

  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
    signal,
  })
    .then((response) => {
      if (response.ok) return response.json();
      else return "err";
    })
    .catch(() => {});

  return data;
}

export async function jobAnalytics(companyId, jobId, dateOption, session) {
  const url =
    API_ROOT_PATH +
    `/v1/analytics/${companyId}/job_analytics/${jobId}?date_option=${dateOption}`;

  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function professionalsAtStagePerJob(
  companyId,
  jobId,
  stage,
  dateOption,
  session
) {
  const url =
    API_ROOT_PATH +
    `/v1/analytics/${companyId}/job_professionals_at_stage/${jobId}?stage=${stage}&date_option=${dateOption}`;

  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function fetchTeamMembers(id, session) {
  let url = API_ROOT_PATH + `/v1/companies/${id}/team_members`;
  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else return "err";
  });
  return data;
}
