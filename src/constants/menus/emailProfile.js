import { ROUTES } from "routes";

const PROTO = {
  overview: {
    param: "overview",
    name: "Overview",
    url: (routerProps, store) =>
      ROUTES.EmailProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "overview"
      ),
  },
  recipients: {
    param: "recipients",
    name: "Recipients",
    url: (routerProps, store) =>
      ROUTES.EmailProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "recipients"
      ),
  },
  detail: {
    param: "detail",
    name: "Email View",
    url: (routerProps, store) =>
      ROUTES.EmailProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.profileId,
        "detail"
      ),
  },
};

const emailMenuGenerator = (store) => {
  const { owner, admin, marketer } = store.role.role_permissions;

  if (!owner && !admin && !marketer) {
    return undefined;
  }
  return [PROTO.overview, PROTO.recipients, PROTO.detail];
};

export default emailMenuGenerator;
