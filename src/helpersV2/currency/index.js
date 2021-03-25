import { API_ROOT_PATH } from "constants/api.js";

export const fetchChangeCurrency = async (session, company_id, currency_id) => {
  const url = `${API_ROOT_PATH}/v2/currencies/set_default_currency`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        company_id,
        currency_id,
        default: true,
      }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch companies");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCompanyCurrencies = async (session, companyId) => {
  const url = `${API_ROOT_PATH}/v2/currencies?company_id=${companyId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch currencies");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
