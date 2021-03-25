import SIGNING_ROUTES from "routes/signingRoutes";
import PERSONAL_SETTINGS_ROUTES from "routes/personalSettingsRoutes";
import ATS_BASE_ROUTES from "routes/atsBaseRoutes";
import ATS_PROFILES_ROUTES from "routes/atsProfilesRoutes";

export const ROUTES = {
  ...SIGNING_ROUTES,
  ...PERSONAL_SETTINGS_ROUTES,
  ...ATS_BASE_ROUTES,
  ...ATS_PROFILES_ROUTES,
  // CompanyCreate: {
  //   path: "/create",
  //   render: (args) => (
  //     <Suspense fallback={<div />}>
  //       <CompanyCreate {...args} />
  //     </Suspense>
  //   ),
  //   url: () => "/create",
  // },
};

export const REDIRECTS = {
  OutlookLogout: {
    to: "/",
    from: "/outlook-logout",
  },
  ProfSignin: {
    to: ROUTES.MyCompanies.url(),
    from: "/professional_auth/sign_in",
  },
  Privacy: {
    to: "https://www.recruitd.com/privacy",
    from: "/privacy",
  },
  Terms: {
    to: "https://www.recruitd.com/terms",
    from: "/terms",
  },
};
