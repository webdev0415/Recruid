import React, { Suspense } from "react";
import retryLazy from "hooks/retryLazy";
const Settings = React.lazy(() =>
  retryLazy(() => import("containers/Settings"))
);

const ProfessionalProfileSettings = React.lazy(() =>
  retryLazy(() => import("containers/ProfessionalProfileSettings"))
);
const TasksManager = React.lazy(() =>
  retryLazy(() => import("containers/TasksManager"))
);
const PERSONAL_SETTINGS_ROUTES = {
  ProfessionalProfileSettings: {
    path: "/profile/:username/edit",
    render: (args) => (
      <Suspense fallback={<div />}>
        <ProfessionalProfileSettings {...args} />
      </Suspense>
    ),
    url: (username) => `/profile/${username}/edit`,
  },
  Settings: {
    path: "/profile/:username/settings",
    render: (args) => (
      <Suspense fallback={<div />}>
        <Settings {...args} />
      </Suspense>
    ),
    url: (username) => `/profile/${username}/settings`,
  },
  TasksManager: {
    path: "/profile/:username/tasks/:complete?",
    render: (args) => (
      <Suspense fallback={<div />}>
        <TasksManager {...args} />
      </Suspense>
    ),
    url: (username, complete) =>
      `/profile/${username}/tasks/${complete || "incomplete"}`,
  },
};
export default PERSONAL_SETTINGS_ROUTES;
