import { API_ROOT_PATH } from "constants/api.js";

export const fetchMarketingAnalytics = async (session, companyId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/stats`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to get marketing analytics");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
