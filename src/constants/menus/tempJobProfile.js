import { ROUTES } from "routes";
const PROTO = {
  dashboard: {
    param: "overview",
    name: "Dashboard",
    url: (routerProps, store) =>
      ROUTES.TempJobDashboard.url(
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
      ROUTES.TempJobDashboard.url(
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
      ROUTES.TempJobDashboard.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.jobSlug,
        "applicants"
      ),
  },
  shifts: {
    param: "shifts",
    name: "Shift Management",
    url: (routerProps, store) =>
      ROUTES.TempJobDashboard.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.jobSlug,
        "shifts"
      ),
  },
  team: {
    param: "team",
    name: "Team",
    url: (routerProps, store) =>
      ROUTES.TempJobDashboard.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.jobSlug,
        "team"
      ),
  },
  analytics: {
    param: "analytics",
    name: "Analytics",
    url: (routerProps, store) =>
      ROUTES.TempJobDashboard.url(
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
      ROUTES.TempJobDashboard.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.jobSlug,
        "notes"
      ),
  },
};

const tempJobMenuGenerator = (store) => {
  const {
    owner,
    admin,
    hiring_manager,
    recruiter,
  } = store.role.role_permissions;

  if (!owner && !admin && !recruiter && !hiring_manager) {
    return undefined;
  }
  return [
    PROTO.dashboard,
    PROTO.details,
    PROTO.applicants,
    PROTO.team,
    PROTO.shifts,
    PROTO.analytics,
    PROTO.notes,
  ];
};

export default tempJobMenuGenerator;
