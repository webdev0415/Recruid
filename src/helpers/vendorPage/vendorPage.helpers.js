import { API_ROOT_PATH } from "constants/api";

export default {
  fetchVendorProfile: async (subject, globalId, targetId, session, signal) => {
    const url = `${API_ROOT_PATH}/v1/${subject}/${globalId}/profile/${targetId}`;
    const params = { method: "GET", headers: session, signal };
    try {
      const getData = await fetch(url, params);
      const data = await getData.json();
      return data;
    } catch (err) {
      console.error(`Error getting the vendor profile: ${err}`);
    }
  },
  fetchVendorActivities: async (page, session, vendorId) => {
    const url = `${API_ROOT_PATH}/v1/vendors/${vendorId}/company_activities?page=${page}`;
    const params = { method: "GET", headers: session };
    try {
      const getData = await fetch(url, params);
      const data = await getData.json();
      return data;
    } catch (err) {
      console.error(`Error fetching vendor's activities: ${err}`);
    }
  },
  fetchVendorNotes: async (session, companyId, vendorId, signal) => {
    const url = `${API_ROOT_PATH}/v1/companies/${companyId}/company_notes/${vendorId}/vendor_company_notes`;
    const params = { method: "GET", headers: session, signal };
    try {
      const getData = await fetch(url, params);
      const data = await getData.json();
      return data;
    } catch (err) {
      console.error(`Error fetching vendor's notes: ${err}`);
    }
  },
  fetchVendorCandidates: async (
    session,
    companyId,
    vendorId,
    slice,
    filters
  ) => {
    let url = `${API_ROOT_PATH}/v1/companies/candidate_list?slice=${slice}`;
    const params = {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        originator_id: companyId,
        receiver_id: vendorId,
        ...filters
      })
    };
    try {
      const getData = await fetch(url, params);
      const data = await getData.json();
      return data;
    } catch (err) {
      console.error(`Error fetching vendor's candidates: ${err}`);
      return "err";
    }
  },
  fetchVendorJobs: async (companyId, vendorId, session, page) => {
    const url = `${API_ROOT_PATH}/v1/companies/${companyId}/job_posts/job_list/${vendorId}?page=${page}`;

    const data = fetch(url, {
      method: "GET",
      headers: session
    }).then(response => {
      if (response.ok) return response.json();
      else return "err";
    });
    return data;
  },
  fetchVendorAnalytics: async function(companyId, vendorId, session, dateFilter) {
    const url = `${API_ROOT_PATH}/v1/vendors/${companyId}/vendor_analytics/${vendorId}?date_filter=${dateFilter}`;
    const params = { method: `GET`, headers: session };
    try {
      const getData = await fetch(url, params);
      return await getData.json();
    } catch (err) {
      console.error(`Error getting vendor analytics: ${err}`);
      return "err";
    }
  },
  sortByDate: function(arr) {
    let sortedArr;
    sortedArr =
      !!arr &&
      arr.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        } else if (a.created_at < b.created_at) {
          return 1;
        } else return 0;
      });
    return sortedArr;
  }
};
