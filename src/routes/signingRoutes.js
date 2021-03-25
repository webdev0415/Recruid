import React, { Suspense } from "react";
import retryLazy from "hooks/retryLazy";
const CreateAgency = React.lazy(() =>
  retryLazy(() => import("containers/CreateAgency"))
);
const CreateEmployer = React.lazy(() =>
  retryLazy(() => import("containers/CreateEmployer"))
);
const CompanyTrial = React.lazy(() =>
  retryLazy(() => import("containers/OnboardFlow/TrialOnboardFlow"))
);
const ProfessionalSignin = React.lazy(() =>
  retryLazy(() => import("containers/ProfessionalSignin"))
);
const ProfessionalLogoff = React.lazy(() =>
  retryLazy(() => import("containers/ProfessionalLogoff"))
);
const ForgotPassword = React.lazy(() =>
  retryLazy(() => import("containers/ForgotPassword"))
);
const ResetPassword = React.lazy(() =>
  retryLazy(() => import("containers/ResetPassword"))
);
const NewPassword = React.lazy(() =>
  retryLazy(() => import("containers/NewPassword"))
);

const SIGNING_ROUTES = {
  CompanyTrial: {
    path: "/trial",
    render: (args) => (
      <Suspense fallback={<div />}>
        <CompanyTrial {...args} />
      </Suspense>
    ),
    url: () => "/trial",
  },
  ProfessionalSignin: {
    path: "/signin",
    render: (args) => (
      <Suspense fallback={<div />}>
        <ProfessionalSignin {...args} />
      </Suspense>
    ),
    url: () => "/signin",
  },
  ProfessionalLogoff: {
    path: "/logoff",
    render: (args) => (
      <Suspense fallback={<div />}>
        <ProfessionalLogoff {...args} />
      </Suspense>
    ),
    url: () => "/logoff",
  },
  ForgotPassword: {
    path: "/forgotpassword",
    render: (args) => (
      <Suspense fallback={<div />}>
        <ForgotPassword {...args} />
      </Suspense>
    ),
    url: () => "/forgotpassword",
  },
  ResetPassword: {
    path: "/resetpassword",
    render: (args) => (
      <Suspense fallback={<div />}>
        <ResetPassword {...args} />
      </Suspense>
    ),
    url: () => "/resetpassword",
  },
  NewPassword: {
    path: "/newpassword",
    render: (args) => (
      <Suspense fallback={<div />}>
        <NewPassword {...args} />
      </Suspense>
    ),
    url: () => "/newpassword",
  },
  CreateEmployer: {
    path: "/create-employer",
    render: (args) => (
      <Suspense fallback={<div />}>
        <CreateEmployer args={args} {...args} />
      </Suspense>
    ),
    url: () => "/create-employer",
  },
  CreateAgency: {
    path: "/create-agency",
    render: (args) => (
      <Suspense fallback={<div />}>
        <CreateAgency args={args} {...args} />
      </Suspense>
    ),
    url: () => "/create-agency",
  },
};
export default SIGNING_ROUTES;
