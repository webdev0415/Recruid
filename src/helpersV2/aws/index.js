import { API_ROOT_PATH } from "constants/api.js";
import notify from "notifications";
import randomString from "random-string";

export const getSignedUrl = (fileName, fileType, file, finalCallback) => {
  let newFileName = randomString({ length: 20 }) + "-" + fileName;
  getSignedUrl1(fileType, newFileName).then(urlRes => {
    if (!urlRes.err) {
      getSignedUrl2(urlRes.url, fileType, file).then(res => {
        if (!res.err) {
          finalCallback(res.ok, newFileName, urlRes.url);
        } else {
          notify("danger", "Unable to get signed url");
        }
      });
    } else {
      notify("danger", "Unable to get signed url");
    }
  });
};

const getSignedUrl1 = async (fileType, newFileName) => {
  let data = "filename=temp/" + newFileName + "&content_type=" + fileType;
  const url = `${API_ROOT_PATH}/v1/posts/fetch_signed_url`;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data
    });
    let res = await response.json();
    return res;
  } catch (err) {
    return { err: true, customError: err };
  }
};

const getSignedUrl2 = async (url, fileType, file) => {
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": fileType
      },
      body: file
    });
    return response;
  } catch (err) {
    return { err: true, customError: err };
  }
};

export const elasticSearch = async (
  searchTerm,
  company_id,
  activeTab,
  signal
) => {
  try {
    const endpoint = `${API_ROOT_PATH}/v2/elastic_search/search?search_term=${searchTerm}&company_id=${company_id}&index=${activeTab}`;
    const options = {
      method: "get",
      headers: { "Content-Type": "application/json" },
      signal
    };
    return await (await fetch(endpoint, options)).json();
  } catch (err) {
    if (signal.aborted) {
      return { error: true, exception: true };
    }
    return {
      error: true,
      data: err,
      message: "Failed to perform elastic search"
    };
  }
};
