import { ROUTES } from "routes";
const PROTO = {
  dashboard: {
    param: "overview",
    name: "Dashboard",
    url: (routerProps, store) =>
      ROUTES.TempManager.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        "overview"
      ),
  },
  jobs: {
    param: "jobs",
    name: "Jobs",
    url: (routerProps, store) =>
      ROUTES.TempManager.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        "jobs"
      ),
  },
  candidates: {
    param: "candidates",
    name: "Candidates",
    url: (routerProps, store) =>
      ROUTES.TempManager.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        "candidates"
      ),
  },
  timesheets: {
    param: "timesheets",
    name: "Timesheets",
    url: (routerProps, store) =>
      ROUTES.TempManager.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        "timesheet/pending"
      ),
  },
  invoices: {
    param: "invoices",
    name: "Invoices",
    url: (routerProps, store) =>
      ROUTES.TempManager.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        "invoices"
      ),
  },
  analytics: {
    param: "analytics",
    name: "Analytics",
    url: (routerProps, store) =>
      ROUTES.TempManager.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        "analytics"
      ),
  },
  rate_caculator: {
    param: "rate_caculator",
    name: "Rate Caculator",
    url: (routerProps, store) =>
      ROUTES.TempManager.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        "rate_caculator"
      ),
  },
};

const timesheetMenuGenerator = (store) => {
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
    PROTO.jobs,
    PROTO.candidates,
    PROTO.timesheets,
    PROTO.invoices,
    PROTO.analytics,
    PROTO.rate_caculator,
  ];
};

export default timesheetMenuGenerator;
