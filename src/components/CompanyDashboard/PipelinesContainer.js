import React from "react";
import retryLazy from "hooks/retryLazy";
const PipelineView = React.lazy(() =>
  retryLazy(() =>
    import("components/ViewJobs/components/PipelineView/PipelineView")
  )
);

const PipelinesContainer = ({ store }) => {
  return (
    <>
      {store.role &&
        (store.role?.role_permissions?.owner ||
          store.role?.role_permissions?.admin ||
          store.role?.role_permissions?.recruiter ||
          store.role.role_permissions.hiring_manager) && (
          <>
            <PipelineView
              displayTable={true}
              type="jobs"
              main
              role={store.role?.team_member}
              teamMembers={store.teamMembers}
              interviewStages={store.interviewStages}
            />
          </>
        )}
    </>
  );
};

export default PipelinesContainer;
