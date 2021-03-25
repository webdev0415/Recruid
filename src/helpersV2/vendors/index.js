import { API_ROOT_PATH } from "constants/api.js";

export const fetchVendorCandidates = async (
  session,
  companyId,
  vendorId,
  filters,
  signal
) => {
  const url = `${API_ROOT_PATH}/v1/companies/candidate_list`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        filters: {
          originator_id: companyId,
          receiver_id: vendorId,
          ...filters,
        },
      }),
      signal,
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch candidates");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
