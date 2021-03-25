import { API_ROOT_PATH } from "constants/api";

export async function upcomingInterviews(
  companyId,
  session,
  teamMemberId,
  signal
) {
  const url =
    API_ROOT_PATH +
    `/v1/interview_calendars/${companyId}/upcoming?team_member_id=${teamMemberId}`;

  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
    signal,
  })
    .then((response) => {
      if (response.ok) return response.json();
      else return "err";
    })
    .catch(() => null);

  return data;
}

export async function cancelledCount(companyId, dateBoundary) {
  const url =
    API_ROOT_PATH +
    `/v1/interview_calendars/${companyId}/cancelled_int_requested_count/${dateBoundary}`;

  const data = fetch(url, {
    method: "GET",
    headers: this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function scheduledCount(companyId, dateBoundary) {
  const url =
    API_ROOT_PATH +
    `/v1/interview_calendars/${companyId}/interview_scheduled_count/${dateBoundary}`;

  const data = fetch(url, {
    method: "GET",
    headers: this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function conductedCount(companyId, dateBoundary) {
  const url =
    API_ROOT_PATH +
    `/v1/interview_calendars/${companyId}/interview_conducted_count/${dateBoundary}`;

  const data = fetch(url, {
    method: "GET",
    headers: this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}
