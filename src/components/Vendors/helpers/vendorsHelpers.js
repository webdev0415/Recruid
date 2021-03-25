import { API_ROOT_PATH } from "constants/api";

export async function vendorIndex(companyId, page, session) {
  const url = API_ROOT_PATH + `/v1/vendors/${companyId}/index?page=${page}`;

  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
  })
    .then((response) => {
      if (response.ok) return response.json();
      else return "err";
    })
    .catch(() => {});

  return data;
}

export async function clientIndex(companyId, page, session, getTotal) {
  const url =
    API_ROOT_PATH +
    `/v1/clients/${companyId}/index?page=${page}${
      getTotal === "all"
        ? "&get_all=true"
        : getTotal === "with-open-jobs"
        ? "&with_open_jerbs=true"
        : ""
    }`;
  const data = fetch(url, {
    method: "GET",
    headers: session || this.props.session,
  })
    .then((response) => {
      if (response.ok) return response.json();
      else return "err";
    })
    .catch(() => {});

  return data;
}

export async function addVendor(companyId, agencyId) {
  const url = API_ROOT_PATH + `/v1/vendors/${companyId}/add_vendor/${agencyId}`;

  const data = fetch(url, {
    method: "GET",
    headers: this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function addClient(companyId, payload) {
  const url = API_ROOT_PATH + `/v1/clients/${companyId}/add_client`;
  let body;
  if (!payload.logo) {
    body = payload;

    const data = fetch(url, {
      method: "POST",
      headers: this.props.session,
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) return response.json();
      else return "err";
    });

    return data;
  } else {
    // let formData = new FormData();
    // formData.append('name', payload.name);
    // formData.append('industry', payload.industry);
    // formData.append('offline', payload.offline);
    // formData.append('avatar_name', payload.logo.name);
    // formData.append('avatar_data', payload.logo);
    // session = {...this.props.session};
    // delete session['Content-Type'];
    // body = formData;

    let body;

    let image = payload.logo.files[0];
    let fileReader = new FileReader();
    fileReader.addEventListener("load", (fileReaderEvent) => {
      let imageName = image.name;
      let imageBase64 = fileReaderEvent.target.result;
      payload.avatar_name = imageName;
      payload.avatar_data = imageBase64;
      delete payload.logo;
      body = payload;
    });

    fileReader.readAsDataURL(image);

    const data = fetch(url, {
      method: "POST",
      headers: this.props.session,
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) return response.json();
      else return "err";
    });

    return data;
  }
}

export async function searchVendors(companyId, search) {
  const url =
    API_ROOT_PATH + `/v1/vendors/${companyId}/search?search_term=${search}`;

  const data = fetch(url, {
    method: "GET",
    headers: this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}

export async function searchClients(companyId, search) {
  const url =
    API_ROOT_PATH + `/v1/clients/${companyId}/search?search_term=${search}`;

  const data = fetch(url, {
    method: "GET",
    headers: this.props.session,
  }).then((response) => {
    if (response.ok) return response.json();
    else return "err";
  });

  return data;
}
