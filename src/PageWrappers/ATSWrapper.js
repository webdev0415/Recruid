import React, { useContext, useEffect, Suspense, useState } from "react";
import { withRouter } from "react-router";
import Unauthorized from "components/Unauthorized.js";
import { ROUTES } from "routes";
import GlobalContext from "contexts/globalContext/GlobalContext";
import HistoryContext from "contexts/historyContext/HistoryContext";
import { PermissionChecker } from "constants/permissionHelpers";
import retryLazy from "hooks/retryLazy";
const UpgradeContainer = React.lazy(() =>
  retryLazy(() => import("sharedComponents/UpgradeContainer"))
);
const CheckoutModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/CheckoutModal/CheckoutModalV2"))
);

const ATSWrapper = ({ activeTab, children, match, routeObject }) => {
  const store = useContext(GlobalContext);
  const historyStore = useContext(HistoryContext);
  const [activeModal, setActiveModal] = useState(undefined);
  const INVITED_BY_AGENCY_ALLOWED_PAGES = {
    [ROUTES.Vendors.path]: true,
    [ROUTES.VendorPage.path]: true,
    [ROUTES.JobDashboard.path]: true,
    [ROUTES.TempJobDashboard.path]: true,
    [ROUTES.CandidateProfile.path]: true,
  };

  useEffect(() => {
    historyStore.dispatch({
      type: "UPDATE_ACTIVE_TAB",
      payload: activeTab,
    });
  }, [activeTab]);

  //IF COMPANY IN STORE AND COMPANY IN STORE IS THE SAME AS THE URL
  if (
    store.company &&
    store.company.mention_tag === match.params.companyMentionTag &&
    store.role
  ) {
    //IF TRIAL HAS EXPIRED
    if (
      store.company.trial === "expired" ||
      ((store.company.invited_by_agency || store.company.invited_by_employer) &&
        store.company?.trial !== "upgraded" &&
        !INVITED_BY_AGENCY_ALLOWED_PAGES[match.path])
    ) {
      return (
        <>
          <Suspense fallback={<div />}>
            <UpgradeContainer
              upgradeFunction={() => setActiveModal("upgrade-modal")}
            />
          </Suspense>
          {activeModal === "upgrade-modal" && (
            <Suspense fallback={<div />}>
              <CheckoutModalV2 closeModal={() => setActiveModal(undefined)} />
            </Suspense>
          )}
        </>
      );
    }
    return (
      <>
        <PermissionChecker
          valid={routeObject?.role_permissions}
          type="view"
          onFalse={() => <Unauthorized />}
        >
          {children || <div />}
        </PermissionChecker>
      </>
    );
  } else {
    return null;
  }
};

export default withRouter(ATSWrapper);
