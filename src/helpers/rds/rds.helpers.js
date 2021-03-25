const API_ROUTE = `https://data-api.recruitd.com`;
// const API_ROUTE = `http://localhost:3000`;

const getOptions = {
  method: "get",
  headers: { "Content-Type": "application/json" }
};

export const getPersonsPreviewData = async email => {
  const endpoint = `${API_ROUTE}/person/preview?email=${email}`;
  try {
    return await (await fetch(endpoint, getOptions)).json();
  } catch (err) {
    return { error: err };
  }
};

export const getPersonsImportData = async id => {
  const endpoint = `${API_ROUTE}/person/${id}/import`;
  try {
    return await (await fetch(endpoint, getOptions)).json();
  } catch (err) {
    return { error: err };
  }
};

export const getCompanyRdsData = async domain => {
  const endpoint = `${API_ROUTE}/company?domain=${domain}`;
  try {
    return await (await fetch(endpoint, getOptions)).json();
  } catch (err) {
    return { error: "Unable to get company data" }
  }
};