import { API_ROOT_PATH } from "constants/api";
import queryString from "query-string";

export const getReceiversLists = async (
  companyId,
  session,
  signal,
  filters
) => {
  const query = queryString.stringify(
    { ...filters },
    { arrayFormat: "bracket" }
  );
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_receivers?${query}`;
  const options = { method: "get", headers: session, signal };
  try {
    const receivers = await (await fetch(endpoint, options)).json();
    if (receivers.error)
      throw new Error("Unable to get receivers list, please try again later.");
    return receivers;
  } catch (err) {
    return { error: true, message: err };
  }
};

export const udpateReceiver = async (companyId, session, signal, body) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_receivers`;
  const options = {
    method: "put",
    headers: session,
    signal,
    body: JSON.stringify(body),
  };
  try {
    const updatedList = await (await fetch(endpoint, options)).json();
    if (updatedList.error)
      throw new Error(
        "Unable to updated receivers list, please try again later."
      );
    return true;
  } catch (err) {
    return { error: true, data: err };
  }
};

export const createReceiversList = async (companyId, session, body) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_receivers`;
  const options = {
    method: "post",
    headers: session,
    body: JSON.stringify(body),
  };
  try {
    const recerviersList = await (await fetch(endpoint, options)).json();
    if (!recerviersList || recerviersList.err) throw new Error();
    return recerviersList;
  } catch {
    return {
      error: true,
      data: "Unable to create a list, please try again later.",
    };
  }
};

export const deleteReceiversList = async (companyId, session, id) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_receivers/delete`;
  const options = {
    method: "delete",
    headers: session,
    body: JSON.stringify({ id }),
  };
  try {
    const deletedLists = await (await fetch(endpoint, options)).json();
    if (!deletedLists || deletedLists.err) throw new Error();
    return deletedLists;
  } catch {
    return {
      error: true,
      data: "Unable to create a list, please try again later.",
    };
  }
};
