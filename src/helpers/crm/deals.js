import { API_ROOT_PATH } from "constants/api";

export const changeDealStage = async (
  session,
  companyId,
  stageId,
  dealId,
  newIndex
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/deals/${dealId}/change_pipeline_stage`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        pipeline_stage_id: stageId,
        id: dealId,
        index: newIndex,
      }),
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to change deal stage");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const createNewDeal = async (session, companyId, postBody) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/deals`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(postBody),
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to create new deal");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchDealProfile = async (session, companyId, dealId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/deals/${dealId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch deal profile");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchDealActivity = async (session, dealId, companyId) => {
  const source = "deal";
  const url = `${API_ROOT_PATH}/v2/crm_trackers/list_trackers?agency_id=${companyId}&source=${source}&source_id=${dealId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
      // body: JSON.stringify({ source: "Deal", source_id: dealId })
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch deal activity");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchDealNotes = async (
  session,
  companyId,
  dealId,
  arraySlice
) => {
  const url = `${API_ROOT_PATH}/v1/notes?source_id=${dealId}&agency_id=${companyId}&source=Deal&slice=${arraySlice}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch deal notes");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchDealContacts = async (session, companyId, dealId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/deals/${dealId}/get_contacts_of_deal`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch deal contacts");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchDealPotentialCandidates = async (session) => {
  const url = `${API_ROOT_PATH}/v2/fetchallpipelines`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch deal potential candidates");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchDealCompany = async (session, companyId, dealId) => {
  let error;
  try {
    const url = `${API_ROOT_PATH}/v2/companies/${companyId}/deals/${dealId}/get_company_of_deal`;
    const options = { method: "GET", headers: session };
    let resHeaders = await fetch(url, options);
    let resBody = await resHeaders.json();
    if (!resHeaders.ok || resBody.error) {
      error = resBody;
      throw new Error("Unable to fetch company of a deal");
    }
    return resBody;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const updateDeal = async (session, companyId, dealId, data) => {
  let error;
  try {
    const url = `${API_ROOT_PATH}/v2/companies/${companyId}/deals/${dealId}`;
    const options = {
      method: "PUT",
      headers: session,
      body: JSON.stringify(data),
    };
    const resHeaders = await fetch(url, options);
    const resBody = await resHeaders.json();
    if (!resHeaders.ok || resBody.error) {
      error = resBody;
      throw new Error("Unable to update the deal");
    }
    return resBody;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const assignContactsToDeal = async (
  session,
  companyId,
  dealId,
  contactsId
) => {
  let error;
  try {
    const url = `${API_ROOT_PATH}/v2/companies/${companyId}/deals/${dealId}/assign_contacts_to_deal`;
    const options = {
      method: "POST",
      headers: session,
      body: JSON.stringify({ contacts_ids: contactsId }),
    };
    const resHeaders = await fetch(url, options);
    const resBody = await resHeaders.json();
    if (!resHeaders.ok || resBody.error) {
      error = resBody;
      throw new Error("Unable to update the deal");
    }
    return resBody;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const getAllDeals = async (
  session,
  companyId,
  clientCompanyId,
  contactId
) => {
  let error;
  try {
    const url = `${API_ROOT_PATH}/v2/companies/${companyId}/all_deals${
      contactId
        ? `?contact_id=${contactId}`
        : clientCompanyId
        ? `?client_id=${clientCompanyId}`
        : ""
    }`;
    const options = { method: "GET", headers: session };
    const resHeaders = await fetch(url, options);
    const resBody = await resHeaders.json();
    if (!resHeaders.ok || resBody.error) {
      error = resBody;
      throw new Error("Unable to update the deal");
    }
    return resBody;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const getDealsList = async (session, companyId, filters, signal) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/deals/list`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        filters,
      }),
      signal,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to get deals");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchChangeDealCompany = async (
  session,
  companyId,
  dealId,
  newClientId
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/deals/${dealId}/assign_company_to_deal`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        client_id: newClientId,
      }),
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to contact company");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export async function fetchDealDocuments(session, dealId, agencyId) {
  const url =
    API_ROOT_PATH + `/v1/documents?deal_id=${dealId}&agency_id=${agencyId}`;
  const data = fetch(url, {
    method: "GET",
    headers: session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}

export const fetchDeleteDeal = async (session, companyId, dealId) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/deals/${dealId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to delete deal");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchMoveDealToPipeline = async (session, companyId, body) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/deals/change_pipeline`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(body),
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to move deal");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchRemoveDealContact = async (
  session,
  companyId,
  dealContactId,
  dealId
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/deals/remove_contact_from_deal?deal_contact_id=${dealContactId}&deal_id=${dealId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to delete contact");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
