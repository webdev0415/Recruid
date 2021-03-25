import { API_ROOT_PATH } from "constants/api";

export default {
  fetchTeamMembers(id, session) {
    let url = API_ROOT_PATH + `/v1/companies/${id}/team_members`;
    const data = fetch(url, {
      method: "GET",
      headers: session
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
    });
    return data;
  }
};

export async function manageSubscriptions(companyId, postBody) {
  const url = API_ROOT_PATH + `/v1/payments/${companyId}/manage_subscriptions`;
  const data = fetch(url, {
    method: "POST",
    headers: this.props.session,
    body: JSON.stringify(postBody)
  }).then(response => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}

export async function removeMember(companyId, tmId) {
  const url =
    API_ROOT_PATH +
    `/v1/companies/${companyId}/team_members/${tmId}/remove_team_member`;
  const data = await fetch(url, {
    method: "GET",
    headers: this.props.session
  }).then(response => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}

export async function getBillingData(companyId, session, signal) {
  const url = API_ROOT_PATH + `/v1/billing/billing_details/${companyId}`;
  const data = await fetch(url, {
    method: "GET",
    headers: session,
    signal
  })
    .then(response => {
      if (response.ok) return response.json();
      else return "err";
    })
    .catch(() => {});
  return data;
}

export async function cancelAllSubscriptions(companyId, session) {
  const url = API_ROOT_PATH + `/v1/payments/${companyId}/cancel_all`;
  const data = await fetch(url, {
    method: "GET",
    headers: session
  }).then(response => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}
