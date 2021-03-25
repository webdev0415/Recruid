import { API_ROOT_PATH } from "constants/api";
import queryString from "query-string";

export async function fetchDocuments(ptnId, session) {
  const url = API_ROOT_PATH + `/v1/documents`;
  const data = fetch(url, {
    method: "GET",
    headers: session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}

export async function deleteDocumentCall(docId, session) {
  const url = API_ROOT_PATH + `/v1/documents/${docId}`;
  const data = fetch(url, {
    method: "DELETE",
    headers: session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });
  return data;
}

export async function uploadFile(session, data) {
  const url = API_ROOT_PATH + "/v1/documents";
  try {
    const postData = await fetch(url, {
      method: "POST",
      headers: session,
      body: data,
    });
    const response = await postData.json();
    return response;
  } catch (err) {
    console.error("Error uploading file: ", err);
  }
}

// :::MARKETING EMAIL DOCUMENTS FUNCTIONS:::

export const getEmailDocuments = async (
  companyId,
  session,
  userId,
  slice,
  signal,
  filters
) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/list_documents`,
    options = {
      method: "post",
      headers: session,
      body: JSON.stringify({
        ...filters,
        professional_id: userId,
        slice,
      }),
    };
  if (signal) options.signal = signal;
  try {
    const documents = await (await fetch(endpoint, options)).json();
    if (documents.error || documents.errors) {
      throw new Error("Unable to get documents. Please, try again later.");
    }
    return documents;
  } catch (err) {
    return { err: true, data: err };
  }
};

export const deleteEmailDocuments = async (session, companyId, ids) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/delete_documents`;
  const options = {
    method: "post",
    headers: session,
    body: JSON.stringify({ ...ids }),
  };
  try {
    const response = await (await fetch(endpoint, options)).json();
    if (response.error)
      throw new Error("Unable to delete document. Please try again later.");
    return response;
  } catch (err) {
    return { err: true, data: err };
  }
};

export const updateDocument = async (session, docId, documentProps) => {
  const endpoint = `${API_ROOT_PATH}/v1/documents/${docId}`;
  const options = {
    method: "put",
    headers: session,
    body: JSON.stringify({ ...documentProps }),
  };
  try {
    const response = await (await fetch(endpoint, options)).json();
    if (response.error)
      throw new Error("Unable to update document. Please, try again later.");
    return response;
  } catch (err) {
    return { err: true, data: err };
  }
};

export const uploadDocumentXML = async (
  session,
  formData,
  setUploadProgress,
  handleSuccess,
  handleError
) => {
  let xhr = new XMLHttpRequest();

  xhr.upload.onprogress = (e) => {
    setUploadProgress(parseInt((e.loaded / e.total) * 100));
  };

  xhr.open("POST", `${API_ROOT_PATH}/v1/documents`);
  for (let [key, value] of Object.entries(session)) {
    xhr.setRequestHeader(key, value);
  }

  xhr.onload = () => {
    if (xhr.status !== 200) {
      return handleError();
    }

    return handleSuccess(xhr.response);
  };

  xhr.responseType = "json";
  xhr.send(formData);
};

export const listDocumentsFolders = async (
  session,
  companyId,
  professionalId
) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/list_documents_folders?professional_id=${professionalId}`;
  const options = {
    method: "get",
    headers: session,
  };

  try {
    const folders = await (await fetch(endpoint, options)).json();
    if (folders.error)
      throw new Error(
        "Unable to get documents folders. Please try again later."
      );
    return folders;
  } catch (err) {
    return { error: true, data: err };
  }
};

export const createDocumentFolder = async (session, companyId, folderProps) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/create_document_folder`;
  const options = {
    method: "post",
    headers: session,
    body: JSON.stringify(folderProps),
  };
  try {
    const response = await (await fetch(endpoint, options)).json();

    if (response.error)
      throw new Error("Unable to create folder. Please try again later.");
    return response;
  } catch (err) {
    return { error: true, data: err };
  }
};

export const addDocumentsToFolder = async (session, docsIds, folderId) => {
  const query = queryString.stringify(
    { ids: docsIds, folder_id: folderId },
    { arrayFormat: "bracket" }
  );
  const endpoint = `${API_ROOT_PATH}/v1/documents/add_marketing_folder?${query}`;
  const options = {
    method: "get",
    headers: session,
  };
  try {
    const response = await (await fetch(endpoint, options)).json();
    if (response.error)
      throw new Error(
        "Unable to add selected documents to a folder. Please, try again later."
      );
    return response;
  } catch (err) {
    return { error: true, data: err };
  }
};

export const batchUpdateDocuments = async (session, updatedDocuments) => {
  const endpoint = `${API_ROOT_PATH}/v1/documents/batch_update`;
  const options = {
    method: "post",
    headers: session,
    body: JSON.stringify({ updated_documents: updatedDocuments }),
  };
  try {
    const response = await (await fetch(endpoint, options)).json();
    if (response.error || !response)
      throw new Error(
        "Could not update your documents. Please try again later."
      );
    return response;
  } catch (err) {
    return { error: true, data: err };
  }
};

export const updateFolder = async (
  session,
  companyId,
  folderId,
  folderBody
) => {
  const endpoint = `${API_ROOT_PATH}/v2/companies/${companyId}/marketing_emails/${folderId}/update_documents_folder`;
  const options = {
    method: "post",
    headers: session,
    body: JSON.stringify(folderBody),
  };
  try {
    const updateResponse = await (await fetch(endpoint, options)).json();
    return updateResponse;
  } catch (err) {
    return { error: true, data: err };
  }
};
