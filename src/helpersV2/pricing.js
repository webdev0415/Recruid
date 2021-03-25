import { API_ROOT_PATH } from "constants/api";

export const getAllPlans = async (companyId, session, signal) => {
  try {
    const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/payments/plans`;
    const options = { method: "GET", headers: session, signal };
    const response = await (await fetch(endpoint, options)).json();
    if (!response?.length || !!response.err || !!response.error) {
      throw new Error();
    }
    return response;
  } catch (err) {
    return {
      error: true,
      message: "Error occurred while fetching pricing plans"
    };
  }
};

export const getCurrentPlan = async (companyId, session) => {
  try {
    const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/payments/current_plan`;
    const options = { method: "GET", headers: session };
    const response = await (await fetch(endpoint, options)).json();
    if ((!response || !!response.err || !!response.error) && response != null) {
      throw new Error();
    }
    return response;
  } catch (err) {
    return {
      error: true,
      message: "Error occurred while fetchinh the current plan"
    };
  }
};

export const subscribeForPlan = async (
  companyId,
  session,
  planId,
  token = null
) => {
  try {
    const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/payments/subscribe`;
    const options = {
      method: "POST",
      headers: session,
      body: JSON.stringify({ plan_id: planId, token })
    };
    const response = await (await fetch(endpoint, options)).json();
    if (!response || !!response.err || !!response.error) {
      throw new Error();
    }
    return response;
  } catch (err) {
    return { error: true, message: "Failed to subscribe" };
  }
};

export const upgradePlanDetails = async (companyId, session, stripe) => {
  try {
    const token = await stripe.createToken();
    const endpoint = `${API_ROOT_PATH}/v1/payments/${companyId}/update_card`;
    const options = {
      method: "POST",
      headers: session,
      body: JSON.stringify({ token })
    };
    const response = await (await fetch(endpoint, options)).json();
    return response;
  } catch (err) {
    return { error: true, data: err };
  }
};

export const getCustomerDetails = async (companyId, session) => {
  try {
    const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/payments/customer_details`;
    const options = { method: "GET", headers: session };
    const response = await (await fetch(endpoint, options)).json();
    return response;
  } catch (err) {
    return {
      error: true,
      message: "Unable to get customer details",
      data: err
    };
  }
};
