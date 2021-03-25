import {API_ROOT_PATH} from 'constants/api';

export async function professionalData(username){
  const url = API_ROOT_PATH + `/v1/professionals/${username}`;
  const data = fetch(url, {
    method: 'GET'
  }).then(response => {
    if(response.ok) return response.json();
    else return 'err';
  });
  return data;
}

export async function agencyAnalytics(companyId, agencyId, dateOption){
  const url = API_ROOT_PATH + `/v1/analytics/${companyId}/agency_analytics/${agencyId}?date_option=${dateOption}`;

  const data = fetch(url, {
    method: 'GET',
    headers: this.props.session
  }).then(response => {
    if(response.ok) return response.json();
    else return 'err';
  });

  return data;
}

export async function receivedReviews(type, id){
  const url = API_ROOT_PATH + `/v1/${type}/${id}/reviews?received=true`;
  const data = fetch(url, {
    method: 'GET',
    headers: this.props.session
  }).then(response => {
    if(response.ok) return response.json();
    else return 'err';
  });
  return data;
}

export async function recruiterAnalytics(compId, profId, dateOption){
  const url = API_ROOT_PATH + `/v1/analytics/${compId}/recruiter_analytics/${profId}?date_option=${dateOption}`;
  const data = fetch(url, {
    method: 'GET',
    headers: this.props.session
  }).then(response => {
    if(response.ok) return response.json();
    else return 'err';
  });
  return data;
}

export async function hmAnalytics(compId, profId, dateOption){
  const url = API_ROOT_PATH + `/v1/analytics/${compId}/hiring_manager_analytics/${profId}?date_option=${dateOption}`;
  const data = fetch(url, {
    method: 'GET',
    headers: this.props.session
  }).then(response => {
    if(response.ok) return response.json();
    else return 'err';
  });
  return data;
}