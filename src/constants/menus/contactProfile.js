import { ROUTES } from "routes";

const PROTO = {
  contact_overview: {
    param: "overview",
    name: "Overview",
    url: (routerProps, store) =>
      ROUTES.ContactProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "overview"
      ),
  },
  contact_activity: {
    param: "activity",
    name: "Activity",
    url: (routerProps, store) =>
      ROUTES.ContactProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "activity"
      ),
  },
  contact_deals: {
    param: "deals",
    name: "Deals",
    url: (routerProps, store) =>
      ROUTES.ContactProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "deals"
      ),
  },
  contact_emails: {
    param: "emails",
    name: "Emails",
    url: (routerProps, store) =>
      ROUTES.ContactProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "emails"
      ),
  },
};

const contactMenuGenerator = (store) => {
  const { owner, admin, business } = store.role.role_permissions;

  if (!owner && !admin && !business) {
    return undefined;
  }

  return [
    PROTO.contact_overview,
    PROTO.contact_activity,
    PROTO.contact_deals,
    PROTO.contact_emails,
  ];
};

export default contactMenuGenerator;
