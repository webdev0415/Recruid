import { ROUTES } from "routes";
const PROTO = {
  overview: {
    param: "overview",
    name: "Overview",
    url: (routerProps, store) =>
      ROUTES.VendorPage.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.vendorId,
        "overview"
      ),
  },
  candidates: {
    param: "candidates",
    name: "Candidates",
    url: (routerProps, store) =>
      ROUTES.VendorPage.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.vendorId,
        "candidates"
      ),
  },
  jobs: {
    param: "jobs",
    name: "Jobs",
    url: (routerProps, store) =>
      ROUTES.VendorPage.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.vendorId,
        "jobs"
      ),
  },
  analytics: {
    param: "analytics",
    name: "Analytics",
    url: (routerProps, store) =>
      ROUTES.VendorPage.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.vendorId,
        "analytics"
      ),
  },
  notes: {
    param: "notes",
    name: "Notes",
    url: (routerProps, store) =>
      ROUTES.VendorPage.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.vendorId,
        "notes"
      ),
  },
};

const vendorMenuGenerator = (store) => {
  const { owner, admin } = store.role.role_permissions;

  if (!owner && !admin) {
    return undefined;
  }

  return [
    PROTO.overview,
    PROTO.candidates,
    PROTO.jobs,
    PROTO.analytics,
    PROTO.notes,
  ];
};

export default vendorMenuGenerator;
