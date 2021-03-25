import { ROUTES } from "routes";

const PROTO = {
  overview: {
    param: "overview",
    name: "Overview",
    url: (routerProps, store) =>
      ROUTES.CandidateProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.tnProfileId,
        "overview",
        routerProps.location.search
      ),
  },
  activity: {
    param: "activity",
    name: "Activity",
    url: (routerProps, store) =>
      ROUTES.CandidateProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.tnProfileId,
        "activity",
        routerProps.location.search
      ),
  },
  emails: {
    param: "emails",
    name: "Emails",
    url: (routerProps, store) =>
      ROUTES.CandidateProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.tnProfileId,
        "emails",
        routerProps.location.search
      ),
  },
  experience: {
    param: "experience",
    name: "Experience",
    url: (routerProps, store) =>
      ROUTES.CandidateProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.tnProfileId,
        "experience",
        routerProps.location.search
      ),
  },
  documents: {
    param: "documents",
    name: "Documents",
    url: (routerProps, store) =>
      ROUTES.CandidateProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.tnProfileId,
        "documents",
        routerProps.location.search
      ),
  },
  resumes: {
    param: "resumes",
    name: "Resume",
    url: (routerProps, store) =>
      ROUTES.CandidateProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.tnProfileId,
        "resumes",
        routerProps.location.search
      ),
  },
  jobs: {
    param: "jobs",
    name: "Jobs",
    url: (routerProps, store) =>
      ROUTES.CandidateProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.tnProfileId,
        "jobs",
        routerProps.location.search
      ),
  },
  interviews: {
    param: "interviews",
    name: "Interviews",
    url: (routerProps, store) =>
      ROUTES.CandidateProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.tnProfileId,
        "interviews",
        routerProps.location.search
      ),
  },
  options: {
    param: "options",
    name: "Danger Zone",
    url: (routerProps, store) =>
      ROUTES.CandidateProfile.url(
        routerProps.match.params.companyMentionTag ||
          store.company?.mention_tag ||
          store.allMyCompanies[0]?.mention_tag,
        routerProps.match.params.tnProfileId,
        "options",
        routerProps.location.search
      ),
  },
};

const candidateMenuGenerator = (store) => {
  const {
    owner,
    admin,
    recruiter,
    hiring_manager,
  } = store.role.role_permissions;
  const invited =
    (store.company.invited_by_agency || store.company.invited_by_employer) &&
    store.company?.trial !== "upgraded";
  const ownerAdmin = owner || admin;

  if (!owner && !admin && !recruiter && !hiring_manager) {
    return undefined;
  }

  const activity =
    !invited && (ownerAdmin || recruiter) ? [PROTO.activity] : [];
  const emails = !invited && (ownerAdmin || recruiter) ? [PROTO.emails] : [];
  // const resumes =
  //   !invited && (ownerAdmin || recruiter || hiring_manager)
  //     ? [PROTO.resumes]
  //     : [];
  const jobs = ownerAdmin || recruiter || hiring_manager ? [PROTO.jobs] : [];
  const interviews =
    ownerAdmin || recruiter || hiring_manager ? [PROTO.interviews] : [];
  const options = ownerAdmin ? [PROTO.options] : [];

  return [
    PROTO.overview,
    ...activity,
    ...emails,
    PROTO.experience,
    PROTO.documents,
    // ...resumes,
    ...jobs,
    ...interviews,
    ...options,
  ];
};

export default candidateMenuGenerator;
