import { ROUTES } from "routes";

const PROTO = {
  overview: {
    param: "overview",
    name: "Overview",
    url: (routerProps, store) =>
      ROUTES.ClientProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "overview"
      ),
  },
  activity: {
    param: "activity",
    name: "Activity",
    url: (routerProps, store) =>
      ROUTES.ClientProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "activity"
      ),
  },
  contacts: {
    param: "contacts",
    name: "Contacts",
    url: (routerProps, store) =>
      ROUTES.ClientProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "contacts"
      ),
  },
  deals: {
    param: "deals",
    name: "Deals",
    url: (routerProps, store) =>
      ROUTES.ClientProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "deals"
      ),
  },
  documents: {
    param: "documents",
    name: "Documents",
    url: (routerProps, store) =>
      ROUTES.ClientProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "documents"
      ),
  },
  jobs: {
    param: "jobs",
    name: "Jobs",
    url: (routerProps, store) =>
      ROUTES.ClientProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "jobs"
      ),
  },
  emails: {
    param: "emails",
    name: "Emails",
    url: (routerProps, store) =>
      ROUTES.ClientProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "emails"
      ),
  },
  analytics: {
    param: "analytics",
    name: "Analytics",
    url: (routerProps, store) =>
      ROUTES.ClientProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "analytics"
      ),
  },
  candidates: {
    param: "candidates",
    name: "Candidates",
    url: (routerProps, store) =>
      ROUTES.ClientProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "candidates"
      ),
  },
};

const clientMenuGenerator = (store) => {
  const { owner, admin, business } = store.role.role_permissions;

  if (!owner && !admin && !business) {
    return undefined;
  }

  return [
    PROTO.overview,
    PROTO.activity,
    PROTO.contacts,
    PROTO.emails,
    PROTO.deals,
    PROTO.documents,
    PROTO.jobs,
    PROTO.analytics,
    PROTO.candidates,
  ];
};

export default clientMenuGenerator;
