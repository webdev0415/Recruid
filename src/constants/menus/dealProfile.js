import { ROUTES } from "routes";

const PROTO = {
  overview: {
    param: "overview",
    name: "Overview",
    url: (routerProps, store) =>
      ROUTES.DealProfile.url(
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
      ROUTES.DealProfile.url(
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
      ROUTES.DealProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "contacts"
      ),
  },
  documents: {
    param: "documents",
    name: "Documents",
    url: (routerProps, store) =>
      ROUTES.DealProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "documents"
      ),
  },
  options: {
    param: "options",
    name: "Danger Zone",
    url: (routerProps, store) =>
      ROUTES.DealProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "options"
      ),
  },
};

const dealMenuGenerator = (store) => {
  const { owner, admin, business } = store.role.role_permissions;
  const ownerAdmin = owner || admin;

  if (!owner && !admin && !business) {
    return undefined;
  }

  const options = ownerAdmin ? [PROTO.options] : [];

  return [
    PROTO.overview,
    PROTO.activity,
    PROTO.contacts,
    PROTO.documents,
    ...options,
  ];
};

export default dealMenuGenerator;
