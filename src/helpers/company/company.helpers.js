import { API_ROOT_PATH } from "constants/api";

export default {
  fetchCompanyData: async (mentionTag, session) => {
    try {
      const url = API_ROOT_PATH + "/v1/companies/" + mentionTag;
      const getData = await fetch(url, {
        method: "GET",
        headers: session,
      });
      const data = await getData.json();

      return data;
    } catch (err) {
      console.error("Error fetching company data: ", err);
      return err;
    }
  },
  toggleCareersPortal: async (companyId, session) => {
    try {
      const url =
        API_ROOT_PATH + `/v1/companies/${companyId}/career_portal_toggle`;
      const getData = await fetch(url, {
        method: "GET",
        headers: session,
      });
      const data = await getData.json();

      return data;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  changeCareersPortalSettings: async (companyId, session, body) => {
    try {
      const url =
        API_ROOT_PATH + `/v1/companies/${companyId}/update_career_properties`;
      const getData = await fetch(url, {
        method: "PUT",
        headers: session,
        body: JSON.stringify(body),
      });

      const data = await getData.json();

      return data;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
};

export const fetchCompanyActivities = async (
  companyId,
  page,
  session,
  signal
) => {
  const endpoint = `${API_ROOT_PATH}/v1/companies/${companyId}/activities?page=${page}`;
  const options = {
    method: "GET",
    headers: session,
    signal,
  };
  try {
    const activities = await (await fetch(endpoint, options)).json();
    if (activities.list) return activities;
  } catch (err) {
    console.error("Unable to get activities feed");
  }
};

export const fetchCompanyReviews = async (companyId, page, session) => {
  const endpoint = `${API_ROOT_PATH}/v1/companies/${companyId}/reviews?received=true&page=${page}`;
  const options = { method: "GET", headers: session };
  try {
    const reviews = await (await fetch(endpoint, options)).json();
    if (reviews) return reviews;
    return ["Unable to get the company reviews"];
  } catch (err) {
    console.error("Unable to get the company reviews");
  }
};

export const handleReviewPost = async (companyId, review, session) => {
  const endpoint = `${API_ROOT_PATH}/v1/companies/${companyId}/reviews`;
  const options = {
    method: "POST",
    headers: session,
    body: JSON.stringify({
      review: {
        ...review,
        reviewable_id: companyId,
        reviewable_type: "Company",
      },
    }),
  };
  try {
    const headers = await fetch(endpoint, options);
    const review = await headers.json();
    if (headers.status === 200 && headers.ok)
      return { status: "success", review };
    return { error: "Unable to post a review" };
  } catch (err) {
    return { error: "Unable to post a review" };
  }
};

export const handlePostDelete = async (companyId, postId, session) => {
  const endpoint = `${API_ROOT_PATH}/v1/companies/${companyId}/posts/${postId}`;
  const options = { method: "DELETE", headers: session };
  try {
    const responseHeaders = await fetch(endpoint, options);
    const responseBody = await responseHeaders.json();
    if (responseHeaders.status === 200 && responseHeaders.ok)
      return responseBody;
    return { error: "Unable to delete the post." };
  } catch (err) {
    return { error: "Unable to delete the post" };
  }
};

export const handlePostEdit = async (companyId, postId, body, session) => {
  const endpoint = `${API_ROOT_PATH}/v1/companies/${companyId}/posts/${postId}`;
  const options = {
    method: "PUT",
    headers: session,
    body: JSON.stringify({ post: { id: postId, body } }),
  };
  try {
    const responseHeaders = await fetch(endpoint, options);
    const responseBody = await responseHeaders.json();
    if (responseHeaders.status === 200 && responseHeaders.ok)
      return responseBody;
    return { error: "Unable to edit the post" };
  } catch (err) {
    return { error: "Unable to edit the post" };
  }
};
