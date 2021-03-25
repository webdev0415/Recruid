import React, { Suspense } from "react";
import retryLazy from "hooks/retryLazy";
const JobDashboard = React.lazy(() =>
  retryLazy(() => import("containers/JobDashboard"))
);
const VendorPage = React.lazy(() =>
  retryLazy(() => import("containers/VendorPage"))
);
const DealProfile = React.lazy(() =>
  retryLazy(() => import("containers/DealProfile"))
);
const ClientProfile = React.lazy(() =>
  retryLazy(() => import("containers/ClientProfile"))
);
const ContactProfile = React.lazy(() =>
  retryLazy(() => import("containers/ContactProfile"))
);
const CandidateProfile = React.lazy(() =>
  retryLazy(() => import("containers/CandidateProfile"))
);
const EmailProfile = React.lazy(() =>
  retryLazy(() => import("containers/EmailProfile"))
);

const role_permissions = {
  marketer: false,
  hiring_manager: false,
  recruiter: false,
  business: false,
};
const ATS_PROFILES_ROUTES = {
  JobDashboard: {
    path: "/:companyMentionTag/jobs/:jobSlug/:tab?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <JobDashboard {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, jobSlug, tab) =>
      `/${companyMentionTag}/jobs/${jobSlug}/${tab || "overview"}`,
    role_permissions: {
      ...role_permissions,
      recruiter: true,
      hiring_manager: true,
    },
  },
  TempJobDashboard: {
    path: "/:companyMentionTag/temp/jobs/:jobSlug/:tab?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <JobDashboard {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, jobSlug, tab) =>
      `/${companyMentionTag}/temp/jobs/${jobSlug}/${tab || "overview"}`,
    role_permissions: {
      ...role_permissions,
      recruiter: true,
      hiring_manager: true,
    },
  },
  EmailProfile: {
    path: "/:companyMentionTag/marketing/:profileId/:tab",
    render: (args) => (
      <Suspense fallback={<div />}>
        <EmailProfile {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, profileId, tab) =>
      `/${companyMentionTag}/marketing/${profileId}/${tab || "overview"}`,
    role_permissions: { ...role_permissions, marketer: true },
  },
  DealProfile: {
    path: "/:companyMentionTag/clients/deals/:profileId/:tab?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <DealProfile {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, profileId, tab) =>
      `/${companyMentionTag}/clients/deals/${profileId}/${tab || "overview"}`,
    role_permissions: { ...role_permissions, business: true },
  },
  ClientProfile: {
    path: "/:companyMentionTag/clients/companies/:profileId/:tab?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <ClientProfile {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, profileId, tab) =>
      `/${companyMentionTag}/clients/companies/${profileId}/${
        tab || "overview"
      }`,
    role_permissions: { ...role_permissions, business: true },
  },
  ContactProfile: {
    path: "/:companyMentionTag/clients/contacts/:profileId/:tab?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <ContactProfile {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, profileId, tab) =>
      `/${companyMentionTag}/clients/contacts/${profileId}/${
        tab || "overview"
      }`,
    role_permissions: { ...role_permissions, business: true },
  },
  VendorPage: {
    path: "/:companyMentionTag/vendor/:vendorId/:tab?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <VendorPage {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, vendorId, tab) =>
      `/${companyMentionTag}/vendor/${vendorId}/${tab || "overview"}`,
    role_permissions: { ...role_permissions },
  },
  CandidateProfile: {
    path: "/:companyMentionTag/talent/:tnProfileId/:tab?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <CandidateProfile {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, tnProfileId, tab, query) =>
      `/${companyMentionTag}/talent/${tnProfileId}/${tab || "overview"}${
        query ? `${query}` : ""
      }`,
    role_permissions: {
      ...role_permissions,
      recruiter: true,
      hiring_manager: true,
    },
  },
};

export default ATS_PROFILES_ROUTES;
