import { API_ROOT_PATH } from "constants/api.js";

export const handleCompanyPostCreate = async (session, companyId, postBody) => {
  const url = `${API_ROOT_PATH}/v1/companies/${companyId}/posts`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ post: postBody })
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to create post");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const handleCompanyPostUpdate = async (
  session,
  companyId,
  postId,
  postBody
) => {
  const url = `${API_ROOT_PATH}/v1/companies/${companyId}/posts/${postId}`;
  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(postBody)
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to update post");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
