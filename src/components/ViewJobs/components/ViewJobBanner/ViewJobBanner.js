import React, { Suspense, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "routes";
import GlobalContext from "contexts/globalContext/GlobalContext";
import Toggle from "sharedComponents/Toggle";
import ATSBanner from "sharedComponents/ATSBanner";
import styled from "styled-components";
import styles from "components/TalentNetwork/components/TalentNetworkBanner/style/talentNetworkBanner.module.scss";
import { PermissionChecker } from "constants/permissionHelpers";
import retryLazy from "hooks/retryLazy";
import SimpleDelayedInput from "sharedComponents/SimpleDelayedInput";
const CheckoutModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/CheckoutModal/CheckoutModalV2"))
);
const UnlockAccessModal = React.lazy(() =>
  retryLazy(() => import("modals/UnlockAccessModal"))
);

const ViewJobBanner = (props) => {
  const store = useContext(GlobalContext);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showUnlockAccess, setShowUnlockAccess] = useState(false);

  const openUpgradeCompany = () => {
    Promise.resolve(setShowUpgradeModal(true)).then(() => {
      window.$("#UpgradeModal").modal("show");
    });
  };
  const closeUpgradeCompany = () => setShowUpgradeModal(false);

  const upgradeCompanyPlan = async () => {
    await setTimeout(() => setShowUnlockAccess(false), 350);
    return setTimeout(openUpgradeCompany, 750);
  };

  return (
    <>
      <ATSBanner
        name={props.company?.name}
        avatar={props.company?.avatar_url}
        page="Jobs"
      >
        <div className={styles.inputContainer}>
          {/* <button
          className="button button--default button--blue-dark"
          onClick={e => {
            props.openModal("rpoForm");
          }}
        >
          test
        </button> */}
          {!props.as_component &&
            store.role &&
            (store.role?.role_permissions?.owner ||
              store.role?.role_permissions?.admin) && (
              <ToggleContainer>
                <label
                  className="leo-flex-center"
                  style={{
                    fontSize: 12,
                    padding: "9px 0",
                  }}
                >
                  Pipeline View
                  <Toggle
                    name="pipeline"
                    toggle={props.togglePipelineView}
                    checked={props.pipelineView}
                    style={{ marginLeft: "10px" }}
                  />
                </label>
              </ToggleContainer>
            )}
          {props.jobs?.length >= 0 && (
            <div style={{ marginRight: 15 }}>
              <SimpleDelayedInput
                className={styles.form}
                placeholder="Search Jobs..."
                value={props.search}
                onChange={(val) => props.setSearch(val)}
              />
              <li className="fas fa-search search" />
            </div>
          )}
          <div className={styles.buttons}>
            {props.company?.id !== 15265 &&
              props.company?.id !== 15266 &&
              props.company?.id !== 15275 && (
                <>
                  <PermissionChecker
                    type="edit"
                    valid={{ recruiter: true, hiring_manager: true }}
                  >
                    <>
                      {!props.company?.invited_by_employer?.length ? (
                        <Link
                          className="button button--default button--blue-dark"
                          to={ROUTES.JobCreation.url(props.company.mention_tag)}
                        >
                          Create Job
                        </Link>
                      ) : (
                        <button
                          className="button button--default button--blue-dark"
                          onClick={() => setShowUnlockAccess(true)}
                        >
                          Create Job
                        </button>
                      )}
                    </>
                  </PermissionChecker>
                </>
              )}
          </div>
        </div>
      </ATSBanner>
      {showUnlockAccess && (
        <Suspense fallback={<div />}>
          <UnlockAccessModal
            company={props.company}
            show={showUnlockAccess}
            hide={() => setShowUnlockAccess(undefined)}
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

const ToggleContainer = styled.div`
  padding: 5px 10px;
`;
export default ViewJobBanner;
