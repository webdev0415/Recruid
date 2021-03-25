import React, { useContext } from "react";
import ATSBanner from "sharedComponents/ATSBanner";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { PermissionChecker } from "constants/permissionHelpers";

const CalendarBanner = ({ displayInterviewModal }) => {
  const { company } = useContext(GlobalContext);
  return (
    <>
      <ATSBanner
        name={company?.name}
        avatar={company?.avatar_url}
        page="Schedule"
      >
        <PermissionChecker
          type="edit"
          valid={{ recruiter: true, hiring_manager: true }}
        >
          <button
            className="button button--default button--blue-dark"
            onClick={() => displayInterviewModal(true)}
          >
            Schedule Interview
          </button>
        </PermissionChecker>
      </ATSBanner>
    </>
  );
};

export default CalendarBanner;
