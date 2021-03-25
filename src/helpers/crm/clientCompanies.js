import { API_ROOT_PATH } from "constants/api";

export const fetchCompaniesList = async (session, filters, signal) => {
  const url = `${API_ROOT_PATH}/v2/deal_contacts/list_clients`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ filters }),
      signal,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch companies list");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchAllCompanies = async (session, postBody) => {
  const url = `${API_ROOT_PATH}/v2/deal_contacts/list_clients`;
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
      throw new Error("Unable to fetch companies list");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchDeleteCompanies = async (session, postBody, companyId) => {
  const url = `${API_ROOT_PATH}/v1/clients/delete_client_layer?agency_id=${companyId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
      body: JSON.stringify({ layer_ids: postBody }),
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to delete company");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCreateCompany = async (session, companyId, postBody) => {
  const url = `${API_ROOT_PATH}/v1/clients/${companyId}/add_client`;
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
      throw new Error("Unable to create company");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const importCompanyFromDatabase = async (
  session,
  companyId,
  postBody
) => {
  const url = `${API_ROOT_PATH}/v2/fetchallpipelines`;
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
      throw new Error("Unable to create contact");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchClientCompanyProfile = async (
  session,
  companyId,
  clientCompanyId
) => {
  const url = `${API_ROOT_PATH}/v1/companies/${companyId}/clients/${clientCompanyId}/client_profile`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to find company profile");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const editClientCompanyProfile = async (
  session,
  companyId,
  clientId,
  postBody
) => {
  const url = `${API_ROOT_PATH}/v1/companies/${companyId}/clients/${clientId}/update_deal_company`;
  let body = (body = { ...postBody });
  delete body.owner;
  delete body.company_owner;
  delete body.created_at;
  delete body.created_by;
  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify(body),
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to change details");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchChangeCompaniesOwner = async (
  session,
  companyId,
  newOwnerId,
  postBody
) => {
  const url = `${API_ROOT_PATH}/v2/fetchallpipelines`;
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
      throw new Error("Unable to change details");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCompanyActivity = async (
  session,
  clientCompanyId,
  companyId
) => {
  const source = "client";
  const url = `${API_ROOT_PATH}/v2/crm_trackers/list_trackers?agency_id=${companyId}&source=${source}&source_id=${clientCompanyId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch company activity");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCompanyNotes = async (
  session,
  companyId,
  clientCompanyId,
  arraySlice
) => {
  const url = `${API_ROOT_PATH}/v1/notes?source_id=${clientCompanyId}&agency_id=${companyId}&source=Employer&slice=${arraySlice}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch company notes");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCompanyDeals = async (
  session,
  agencyId,
  clientCompanyId,
  archived
) => {
  const url = `${API_ROOT_PATH}/v1/clients/${clientCompanyId}/deals_for_company?agency_id=${agencyId}&archived=${
    archived !== undefined ? archived : false
  }`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch company deals");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCompanyJobs = async (session, companyId, clientCompanyId) => {
  const url = `${API_ROOT_PATH}/v1/companies/${companyId}/job_posts/job_list/${clientCompanyId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch company jobs");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchCompanyContacts = async (
  session,
  clientCompanyId,
  agencyId
) => {
  const url = `${API_ROOT_PATH}/v2/deal_contacts/${clientCompanyId}/contacts_for_company?agency_id=${agencyId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch company contacts");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const assignContactsToClient = async (
  session,
  companyId,
  clientId,
  contactsId
) => {
  let error;
  try {
    const url = `${API_ROOT_PATH}/v1/companies/${companyId}/clients/${clientId}/assign_contacts_to_client`;
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

export const assignDealsToClient = async (
  session,
  companyId,
  clientId,
  dealsIds
) => {
  let error;
  try {
    const url = `${API_ROOT_PATH}/v1/companies/${companyId}/clients/${clientId}/assign_deals_to_client`;
    const options = {
      method: "POST",
      headers: session,
      body: JSON.stringify({ deals_ids: dealsIds }),
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

export const fetchRemoveContactCompany = async (
  session,
  contactId,
  companyId
) => {
  const url = `${API_ROOT_PATH}/v2/deal_contacts/remove_contact?deal_contact_id=${contactId}&company_id=${companyId}`;
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

export const fetchRemoveDealCompany = async (session, companyId, dealId) => {
  const url = `${API_ROOT_PATH}//v2/companies/${companyId}/deals/remove_deal_from_company?deal_id=${dealId}`;
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

export async function fetchCompanyDocuments(session, clientId, agencyId) {
  const url =
    API_ROOT_PATH + `/v1/documents?client_id=${clientId}&agency_id=${agencyId}`;
  const data = fetch(url, {
    method: "GET",
    headers: session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}
