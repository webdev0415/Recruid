import React from "react";
import { ROUTES } from "routes";
import { Link } from "react-router-dom";
import PipelineView from "components/ViewJobs/components/PipelineView/PipelineView";
import { PermissionChecker } from "constants/permissionHelpers";
const JobsTab = ({
  clientCompanyId,
  interviewStages,

  store,
}) => (
  <>
    <PermissionChecker type="edit" valid={{ business: true }}>
      <div
        style={{ textAlign: "right", marginBottom: "20px", marginTop: "20px" }}
      >
        <Link
          className="button button--default button--blue-dark"
          to={ROUTES.JobCreation.url(
            store.company.mention_tag,
            `?client_id=${clientCompanyId}`
          )}
        >
          Create Job
        </Link>
      </div>
    </PermissionChecker>
    <div style={{ marginBottom: "50px" }}>
      <PipelineView
        interviewStages={interviewStages}
        displayTable={true}
        type="jobs"
        clientId={clientCompanyId}
        refreshJobs={false}
        // crm
      />
    </div>
  </>
);

export default JobsTab;
