import { API_ROOT_PATH } from "constants/api";

export const fetchContactList = async (session, filters, signal) => {
  const url = `${API_ROOT_PATH}/v2/deal_contacts/list`;
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
      throw new Error("Unable to fetch contacts list");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchAllContacts = async (session, postBody, filterOut = null) => {
  const url =
    `${API_ROOT_PATH}/v2/deal_contacts/list_contacts` +
    (filterOut?.clientId ? `?client_id=${filterOut.clientId}` : "") +
    (filterOut?.dealId ? `?deal_id=${filterOut.dealId}` : "");
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
      throw new Error("Unable to fetch contacts list");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchDeleteContacts = async (session, companyId, contactsArr) => {
  const url = `${API_ROOT_PATH}/v2/deal_contacts?agency_id=${companyId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
      body: JSON.stringify({ deal_contact_ids: contactsArr }),
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
export const createNewContact = async (session, postBody) => {
  const url = `${API_ROOT_PATH}/v2/deal_contacts`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(postBody),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to create contact");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const importContactFromDatabase = async (
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
export const searchExistingContacts = async (session) => {
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
      throw new Error("Unable to search database");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchContactProfile = async (session, contactId, agencyId) => {
  const url = `${API_ROOT_PATH}/v2/deal_contacts/${contactId}?agency_id=${agencyId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch contact profile");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const editContactProfile = async (
  session,
  contactId,
  postBody,
  agencyId
) => {
  const url = `${API_ROOT_PATH}/v2/deal_contacts/${contactId}?agency_id=${agencyId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify({ deal_contact: postBody }),
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
export const fetchChangeContactsOwner = async (
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
export const fetchContactActivity = async (session, contactId, companyId) => {
  const source = "contact";
  const url = `${API_ROOT_PATH}/v2/crm_trackers/list_trackers?agency_id=${companyId}&source=${source}&source_id=${contactId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch contact activity");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchContactNotes = async (
  session,
  companyId,
  contactId,
  arraySlice
) => {
  const url = `${API_ROOT_PATH}/v1/notes?source_id=${contactId}&agency_id=${companyId}&source=DealContact&slice=${arraySlice}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session,
    });
    let res = await response.json();
    if (!response.ok || res.error) {
      error = res;
      throw new Error("Unable to fetch contact notes");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchContactJobs = async (session) => {
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
      throw new Error("Unable to fetch contact potential candidates");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const getDealsForContact = async (
  session,
  contactId,
  agencyId,
  archived
) => {
  let error;
  try {
    const url = `${API_ROOT_PATH}/v2/deal_contacts/${contactId}/deals_for_contact?agency_id=${agencyId}&archived=${
      archived !== undefined ? archived : false
    }`;
    const options = { method: "GET", headers: session };
    let resHeaders = await fetch(url, options);
    let resBody = await resHeaders.json();
    if (!resHeaders.ok || resBody.error) {
      error = resBody;
      throw new Error("Unable to get deals for the contact");
    }
    return resBody;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

// /v2/deal_contacts/:id/assign_deals_to_contact
export const assignDealsToContact = async (
  session,
  agencyId,
  contactId,
  dealsIds
) => {
  let error;
  try {
    const url = `${API_ROOT_PATH}/v2/deal_contacts/${contactId}/assign_deals_to_contact?agency_id=${agencyId}`;
    const options = {
      method: "POST",
      headers: session,
      body: JSON.stringify({ deals_ids: dealsIds }),
    };
    const resHeaders = await fetch(url, options);
    const resBody = await resHeaders.json();
    if (!resHeaders.ok || resBody.error) {
      error = resBody;
      throw new Error("Failed to assign deals to a contact");
    }
    return resBody;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchChangeContactCompany = async (
  session,
  companyId,
  contactId,
  newClientId
) => {
  const url = `${API_ROOT_PATH}/v2/deal_contacts/${contactId}/assign_company_to_contact`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        agency_id: companyId,
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

export const fetchRemoveContactDeal = async (
  session,
  companyId,
  dealContactId,
  dealId
) => {
  const url = `${API_ROOT_PATH}/v2/companies/${companyId}/deals/remove_deal_from_contact?deal_contact_id=${dealContactId}&deal_id=${dealId}`;
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

export const convertContactToCandidate = async (session, body) => {
  const url = `${API_ROOT_PATH}/v2/deal_contacts/transform_to_candidate`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ candidate: body }),
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to convert contact to candidate");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
