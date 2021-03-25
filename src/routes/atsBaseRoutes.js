import React, { Suspense } from "react";
import Spinner from "sharedComponents/Spinner";
import retryLazy from "hooks/retryLazy";
const MyCompanies = React.lazy(() =>
  retryLazy(() => import("containers/MyCompanies"))
);
const CompanyDashboard = React.lazy(() =>
  retryLazy(() => import("containers/CompanyDashboard"))
);
const TalentNetwork = React.lazy(() =>
  retryLazy(() => import("containers/TalentNetwork"))
);
const ViewJobs = React.lazy(() =>
  retryLazy(() => import("containers/ViewJobs"))
);
const Vendors = React.lazy(() => retryLazy(() => import("containers/Vendors")));
const Calendar = React.lazy(() =>
  retryLazy(() => import("containers/Calendar"))
);
const Analytics = React.lazy(() =>
  retryLazy(() => import("containers/Analytics/Analytics"))
);
const TeamView = React.lazy(() =>
  retryLazy(() => import("containers/TeamView"))
);
const ClientManager = React.lazy(() =>
  retryLazy(() => import("containers/ClientManager"))
);
const TasksManager = React.lazy(() =>
  retryLazy(() => import("containers/TasksManager"))
);
const ElasticSearch = React.lazy(() =>
  retryLazy(() => import("containers/ElasticSearch"))
);
const MarketingEmails = React.lazy(() =>
  retryLazy(() => import("containers/MarketingEmails"))
);
const JobCreation = React.lazy(() =>
  retryLazy(() => import("containers/JobCreation"))
);
const TempManager = React.lazy(() =>
  retryLazy(() => import("containers/TempManager"))
);
const TimesheetManager = React.lazy(() =>
  retryLazy(() => import("containers/TimesheetManager"))
);
const role_permissions = {
  marketer: false,
  hiring_manager: false,
  recruiter: false,
  business: false,
};

const all_role_permissions = {
  marketer: true,
  hiring_manager: true,
  recruiter: true,
  business: true,
  all: true,
};
const ATS_BASE_ROUTES = {
  MyCompanies: {
    path: "/companies",
    render: (args) => (
      <Suspense fallback={<div />}>
        <MyCompanies {...args} />
      </Suspense>
    ),
    url: () => "/companies",
    role_permissions: { ...all_role_permissions },
  },
  ViewJobs: {
    path: "/:companyMentionTag/jobs",
    render: (args) => (
      <Suspense fallback={<div />}>
        <ViewJobs {...args} />
      </Suspense>
    ),
    url: (companyMentionTag) => `/${companyMentionTag}/jobs`,
    role_permissions: {
      ...role_permissions,
      recruiter: true,
      hiring_manager: true,
    },
  },
  Calendar: {
    path: "/:companyMentionTag/calendar",
    render: (args) => (
      <Suspense fallback={<div />}>
        <Calendar {...args} />
      </Suspense>
    ),
    url: (companyMentionTag) => `/${companyMentionTag}/calendar`,
    role_permissions: {
      ...role_permissions,
      recruiter: true,
      business: true,
    },
  },
  TeamView: {
    path: "/:companyMentionTag/settings/:tab?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <TeamView {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, tab) =>
      `/${companyMentionTag}/settings/${tab || "company"}`,
    role_permissions: { ...all_role_permissions },
  },
  Analytics: {
    path: "/:companyMentionTag/analytics/:tab?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <Analytics {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, tab) =>
      `/${companyMentionTag}/analytics/${tab || "company"}`,
    role_permissions: { ...role_permissions, recruiter: true },
  },
  Vendors: {
    path: "/:companyMentionTag/vendors/:tab?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <Vendors {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, tab) =>
      `/${companyMentionTag}/vendors/${tab || "active"}`,
    role_permissions: { ...role_permissions },
  },
  ClientManager: {
    path: "/:companyMentionTag/clients/:tab?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <ClientManager {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, tab, query) =>
      `/${companyMentionTag}/clients/${tab || "overview"}${
        query ? `${query}` : ""
      }`,
    role_permissions: { ...role_permissions, business: true },
  },
  MarketingEmails: {
    path: "/:companyMentionTag/marketing/:tab?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <MarketingEmails {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, tab) =>
      `/${companyMentionTag}/marketing/${tab || "overview"}`,
    role_permissions: { ...role_permissions, marketer: true },
  },
  TalentNetwork: {
    path: "/:companyMentionTag/talent",
    render: (args) => (
      <Suspense fallback={<div />}>
        <TalentNetwork {...args} />
      </Suspense>
    ),
    url: (companyMentionTag) => `/${companyMentionTag}/talent`,
    role_permissions: {
      ...role_permissions,
      recruiter: true,
      hiring_manager: true,
    },
  },
  CompanyDashboard: {
    path: "/:companyMentionTag/dashboard",
    render: (args) => (
      <Suspense fallback={<div />}>
        <CompanyDashboard {...args} />
      </Suspense>
    ),
    url: (companyMentionTag) => `/${companyMentionTag}/dashboard`,
    role_permissions: { ...all_role_permissions },
  },
  CompanyTasksManager: {
    path: "/:companyMentionTag/company-tasks/:complete?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <TasksManager {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, complete) =>
      `/${companyMentionTag}/company-tasks/${complete || "incomplete"}`,
    role_permissions: {},
  },
  ElasticSearch: {
    path: "/:companyMentionTag/search/:tab?",
    render: (args) => (
      <Suspense fallback={<Spinner />}>
        <ElasticSearch {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, tab = "") => `/${companyMentionTag}/search/${tab}`,
    role_permissions: { ...all_role_permissions },
  },
  TempManager: {
    path: "/:companyMentionTag/temp/:tab?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <TempManager {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, tab) =>
      `/${companyMentionTag}/temp/${tab || "dashboard"}`,
    role_permissions: { ...role_permissions, recruiter: true },
  },
  TimesheetManager: {
    path: "/:companyMentionTag/temp/timesheet/:tab?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <TimesheetManager {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, tab) =>
      `/${companyMentionTag}/temp/timesheet/${tab || "pending"}`,
    role_permissions: { ...role_permissions, recruiter: true },
  },
  JobCreation: {
    path: "/:companyMentionTag/create-job",
    render: (args) => (
      <Suspense fallback={<div />}>
        <JobCreation {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, query) =>
      `/${companyMentionTag}/create-job${query ? `${query}` : ""}`,
    role_permissions: {
      ...role_permissions,
      recruiter: true,
      hiring_manager: true,
    },
  },
  JobEdit: {
    path: "/:companyMentionTag/edit-job/:job_slug",
    render: (args) => (
      <Suspense fallback={<div />}>
        <JobCreation {...args} />
      </Suspense>
    ),
    url: (companyMentionTag, jobSlug) =>
      `/${companyMentionTag}/edit-job/${jobSlug}`,
    role_permissions: { ...role_permissions, recruiter: true },
  },
};

export default ATS_BASE_ROUTES;
