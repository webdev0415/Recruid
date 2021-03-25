import React, { useState, Suspense } from "react";
import { ROUTES } from "routes";
import ATSBanner from "sharedComponents/ATSBanner";
import styles from "./style/viewJobBanner.module.scss";
import { PermissionChecker } from "constants/permissionHelpers";
import retryLazy from "hooks/retryLazy";
// import navStyles from "components/TeamView/TeamViewBanner/TeamViewMenu/teamViewMenu.module.scss";
const CheckoutModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/CheckoutModal/CheckoutModalV2"))
);
const UnlockAccessModal = React.lazy(() =>
  retryLazy(() => import("modals/UnlockAccessModal"))
);

const VendorsBanner = (props) => {
  const [showUnlockAccess, setShowUnlockAccess] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const openUnlockAccess = () => setShowUnlockAccess(true);
  const closeUnlockAccess = () => setShowUnlockAccess(false);

  const openUpgradeCompany = () => setShowUpgradeModal(true);
  const closeUpgradeCompany = () => setShowUpgradeModal(false);

  const upgradeCompanyPlan = async () => {
    await setTimeout(closeUnlockAccess, 350);
    return setTimeout(openUpgradeCompany, 750);
  };

  const company = props.company;
  const modalId = props.company.type === "Agency" ? "addClient" : "addAgency";
  return (
    <>
      <ATSBanner
        name={company?.name}
        avatar={company?.avatar_url}
        page="Agencies"
        tabs={tabsArr}
        activeTab={props.activeMenuOption}
        tabType="link"
      >
        <div className={styles.inputContainer}>
          <div>
            <input
              className={styles.form}
              placeholder="Search..."
              onChange={(e) => props.search(e.target.value)}
            />
            <li className="fas fa-search search" />
          </div>
          <PermissionChecker type="edit">
            <div className={styles.buttons}>
              {(company?.type === "Agency" &&
                !!company?.invited_by_employer?.length) ||
              (company?.type === "Employer" &&
                company?.invited_by_agency &&
                company?.trial !== "upgraded") ? (
                <button
                  className="button button--default button--blue-dark"
                  onClick={openUnlockAccess}
                >
                  Add {company.type === "Employer" ? "Agency" : "Client"}
                </button>
              ) : (
                <button
                  className="button button--default button--blue-dark"
                  onClick={() => props.openModal(modalId)}
                >
                  Add {company.type === "Employer" ? "Agency" : "Client"}
                </button>
              )}
            </div>
          </PermissionChecker>
        </div>
      </ATSBanner>
      {showUnlockAccess && (
        <Suspense fallback={<div />}>
          <UnlockAccessModal
            company={company}
            show={showUnlockAccess}
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
    </>
  );
};

const tabsArr = [
  {
    name: "active",
    title: "Active",
    url: (routerProps) =>
      ROUTES.Vendors.url(routerProps.match.params.companyMentionTag, "active"),
  },
  {
    name: "archived",
    title: "Archived",
    url: (routerProps) =>
      ROUTES.Vendors.url(
        routerProps.match.params.companyMentionTag,
        "archived"
      ),
  },
];

export default VendorsBanner;
