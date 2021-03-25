export const API_ROOT_PATH = process.env.REACT_APP_API;
export const WS_ROOT_PATH = process.env.REACT_APP_WS;
export const CAREERS_PORTAL_URL = process.env.REACT_APP_CAREERS_PORTAL_URL;
export const ENV_SESSION_NAME =
  process.env.REACT_APP_ENV_SESSION_PREFIX + "recruitd_session";

export const careersSiteBaseUrl = (companyMentionTag) =>
  `${CAREERS_PORTAL_URL}${companyMentionTag ? `/${companyMentionTag}/` : ""}`;

export const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;
export const AWS_CDN_URL = process.env.REACT_APP_AWS_CDN_URL;
