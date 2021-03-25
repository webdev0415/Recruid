import { API_ROOT_PATH } from "constants/api";

export default {
  uploadCV: async (formData, session) => {
    const url = API_ROOT_PATH + "/v1/candidate_cvs/parse";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: session,
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Error uploading a cv: ${err}`);
      return err;
    }
  },
};
