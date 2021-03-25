import { ROUTES } from "routes";

const PROTO = {
  overview: {
    param: "overview",
    name: "Overview",
    url: (routerProps, store) =>
      ROUTES.JobDashboard.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.jobSlug,
        "overview"
      ),
  },
  details: {
    param: "details",
    name: "Details",
    url: (routerProps, store) =>
      ROUTES.JobDashboard.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.jobSlug,
        "details"
      ),
  },
  applicants: {
    param: "applicants",
    name: "Applicants",
    url: (routerProps, store) =>
      ROUTES.JobDashboard.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.jobSlug,
        "applicants"
      ),
  },
  analytics: {
    param: "analytics",
    name: "Analytics",
    url: (routerProps, store) =>
      ROUTES.JobDashboard.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.jobSlug,
        "analytics"
      ),
  },
  notes: {
    param: "notes",
    name: "Notes",
    url: (routerProps, store) =>
      ROUTES.JobDashboard.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.jobSlug,
        "notes"
      ),
  },
};

const jobMenuGenerator = (store) => {
  const {
    owner,
    admin,
    recruiter,
    hiring_manager,
  } = store.role.role_permissions;

  if (!owner && !admin && !recruiter && !hiring_manager) {
    return undefined;
  }

  return [
    PROTO.overview,
    PROTO.details,
    PROTO.applicants,
    PROTO.analytics,
    PROTO.notes,
  ];
};

export default jobMenuGenerator;
