import React, { Fragment, useState, Suspense, useEffect } from "react";
import QuickActionsMenu from "./QuickActionsMenu";
import ATSBanner from "sharedComponents/ATSBanner";
import { PermissionChecker } from "constants/permissionHelpers";
import retryLazy from "hooks/retryLazy";
const CheckoutModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/CheckoutModal/CheckoutModalV2"))
);
const UnlockAccessModal = React.lazy(() =>
  retryLazy(() => import("modals/UnlockAccessModal"))
);

const DashboardHeader = ({ openModal, activeTab, setActiveTab, store }) => {
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [roleTabs, setRoleTabs] = useState([]);

  const openUnlockAccess = () => setShowAccessModal(true);
  const closeUnlockAccess = () => setShowAccessModal(false);

  const openUpgradeCompany = () => {
    setShowUpgradeModal(true);
  };
  const closeUpgradeCompany = () => setShowUpgradeModal(false);

  const upgradeCompanyPlan = async () => {
    await setTimeout(closeUnlockAccess, 350);
    return setTimeout(openUpgradeCompany, 750);
  };

  useEffect(() => {
    if (store.role) {
      if (
        store.role.role_permissions.owner ||
        store.role.role_permissions.admin
      ) {
        setRoleTabs([
          ...(store.company.id !== 15538 ? [recruiterRole] : []),
          ...(store.company.type === "Agency"
            ? [
                store.company.id === 15538
                  ? RedKnightBusinessRole
                  : businessRole,
              ]
            : []),
          MarketerRole,
          feedTab,
        ]);
      } else {
        setRoleTabs([
          ...(store.role.role_permissions.recruiter ? [recruiterRole] : []),
          ...(!store.role.role_permissions.recruiter &&
          store.role.role_permissions.hiring_manager
            ? [hiringRole]
            : []),
          ...(store.role.role_permissions.business
            ? [
                store.company.id === 15538
                  ? RedKnightBusinessRole
                  : businessRole,
              ]
            : []),
          ...(store.role.role_permissions.marketer ? [MarketerRole] : []),
          feedTab,
        ]);
      }
    }
     
  }, [store.role]);

  return (
    <Fragment>
      <ATSBanner
        name={store.company?.name}
        avatar={store.company?.avatar_url}
        page="Dashboard"
        tabs={roleTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabType="button"
      >
        {store.company?.invited_by_employer?.length ? (
          <button
            className="button button--default button--blue-dark"
            onClick={openUnlockAccess}
          >
            Upgrade Now
          </button>
        ) : (
          <PermissionChecker
            type="edit"
            valid={{ recruiter: true, hiring_manager: true }}
          >
            <QuickActionsMenu
              mentionTag={store.company?.mention_tag}
              openModal={openModal}
              role={store.role?.team_member}
            />
          </PermissionChecker>
        )}
      </ATSBanner>
      {showAccessModal && (
        <Suspense fallback={<div />}>
          <UnlockAccessModal
            company={store.company}
            show={openUnlockAccess}
            hide={closeUnlockAccess}
            upgradePlan={upgradeCompanyPlan}
          />
        </Suspense>
      )}
      {showUpgradeModal && (
        <Suspense fallback={<div />}>
          <CheckoutModalV2 closeModal={closeUpgradeCompany} />
        </Suspense>
      )}
    </Fragment>
  );
};
export default DashboardHeader;

const recruiterRole = {
  name: "recruiter",
  title: "Recruitment Activity",
};
const hiringRole = {
  name: "hiring_manager",
  title: "Recruitment Activity",
};

const businessRole = {
  name: "business",
  title: "Sales Activity",
};
const RedKnightBusinessRole = {
  name: "business",
  title: "Productions Activity",
};
const MarketerRole = {
  name: "marketer",
  title: "Marketing Activity",
};

const feedTab = {
  name: "feed",
  title: "Company Feed",
};
