import { ROUTES } from "routes";
const PROTO = {
  dashboard: {
    param: "dashboard",
    name: "Dashboard",
    url: (routerProps, store) =>
      ROUTES.CompanyDashboard.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag
      ),
  },
  talent: {
    param: "TalentNetwork",
    name: "Candidates",
    url: (routerProps, store) =>
      ROUTES.TalentNetwork.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag
      ),
  },
  jobs: {
    param: "jobs",
    name: "Jobs",
    url: (routerProps, store) =>
      ROUTES.ViewJobs.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag
      ),
  },
  temp: {
    param: "temp",
    name: "Temp +",
    url: (routerProps, store) =>
      ROUTES.TempManager.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag
      ),
    beta: true,
  },
  vendors: {
    param: "vendors",
    name: "Vendors",
    url: (routerProps, store) =>
      ROUTES.Vendors.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag
      ),
  },
  clients: {
    param: "clients",
    name: "Client CRM",
    url: (routerProps, store) =>
      ROUTES.ClientManager.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag
      ),
  },
  marketing: {
    param: "marketing",
    name: "Marketing",
    url: (routerProps, store) =>
      ROUTES.MarketingEmails.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag
      ),
    // beta: true,
  },
  calendar: {
    param: "calendar",
    name: "Schedule",
    url: (routerProps, store) =>
      ROUTES.Calendar.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag
      ),
  },
  analytics: {
    param: "analytics",
    name: "Analytics",
    url: (routerProps, store) =>
      ROUTES.Analytics.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag
      ),
  },
  settings: {
    param: "settings",
    name: "Settings",
    url: (routerProps, store) =>
      ROUTES.TeamView.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag
      ),
  },
  tasks: {
    param: "company-tasks",
    name: "Tasks",
    url: (routerProps, store) =>
      ROUTES.CompanyTasksManager.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag
      ),
  },
};

const mainMenuGenerator = (store) => {
  const {
    owner,
    admin,
    recruiter,
    business,
    marketer,
    hiring_manager,
  } = store.role.role_permissions;
  const type = store.company.type;
  const ownerAdmin = owner || admin;
  const invited =
    (store.company.invited_by_agency || store.company.invited_by_employer) &&
    store.company?.trial !== "upgraded";

  if (invited) {
    return [PROTO.vendors];
  }

  const talent =
    ownerAdmin || recruiter || hiring_manager ? [PROTO.talent] : [];
  const jobs = ownerAdmin || recruiter || hiring_manager ? [PROTO.jobs] : [];
  const temp = ownerAdmin || recruiter ? [PROTO.temp] : [];
  const clients =
    type === "Agency" && (business || ownerAdmin) ? [PROTO.clients] : [];
  const vendors = type === "Employer" && ownerAdmin ? [PROTO.vendors] : [];
  const marketing = ownerAdmin || marketer ? [PROTO.marketing] : [];
  const calendar = ownerAdmin || business || recruiter ? [PROTO.calendar] : [];
  const analytics = ownerAdmin || recruiter ? [PROTO.analytics] : [];
  const tasks = ownerAdmin ? [PROTO.tasks] : [];

  return [
    PROTO.dashboard,
    ...talent,
    ...jobs,
    ...temp,
    ...clients,
    ...vendors,
    ...marketing,
    ...calendar,
    ...analytics,
    ...tasks,
    PROTO.settings,
  ];
};

export default mainMenuGenerator;
