import React, { Suspense, useContext, useEffect, useState } from "react";
import retryLazy from "hooks/retryLazy";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { ROUTES } from "routes";
// import { API_ROOT_PATH } from "constants/api";

import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import { InnerPageContainer } from "styles/PageContainers";
import DashboardHeader from "components/CompanyDashboard/DashboardHeader";
import notify from "notifications";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
// import download from "downloadjs";

const RecruiterAnalytics = React.lazy(() =>
  retryLazy(() => import("components/CompanyDashboard/RecruiterAnalytics"))
);
const BusinessAnalytics = React.lazy(() =>
  retryLazy(() => import("components/CompanyDashboard/BusinessAnalytics"))
);
const MarketerAnalytics = React.lazy(() =>
  retryLazy(() => import("components/CompanyDashboard/MarketerAnalytics"))
);
const PipelinesContainer = React.lazy(() =>
  retryLazy(() => import("components/CompanyDashboard/PipelinesContainer"))
);
const InterviewJoinersContainer = React.lazy(() =>
  retryLazy(() =>
    import("components/CompanyDashboard/InterviewJoinersContainer")
  )
);
const ReviewsFeedContainer = React.lazy(() =>
  retryLazy(() => import("components/CompanyDashboard/ReviewsFeedContainer"))
);
const LatestEmails = React.lazy(() =>
  retryLazy(() => import("components/CompanyDashboard/LatestEmails"))
);
const TrialContainer = React.lazy(() =>
  retryLazy(() => import("components/CompanyDashboard/TrialContainer"))
);
const GuestedAgency = React.lazy(() =>
  retryLazy(() => import("components/CompanyDashboard/GuestedAgency"))
);

/* Quick actions modals */
const AddTalentModal = React.lazy(() =>
  retryLazy(() =>
    import("components/TalentNetwork/components/AddTalent/AddTalentModal")
  )
);
// const ConfirmModalV2 = React.lazy(() => import("modals/ConfirmModalV2"));
const CheckoutModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/CheckoutModal/CheckoutModalV2"))
);

const CompanyDashboard = (props) => {
  const store = useContext(GlobalContext);
  const [initialPageLoad, setInitialPageLoad] = useState(true);
  const [activeTab, setActiveTab] = useState(undefined);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [activeModal, setActiveModal] = useState(undefined);

  useEffect(() => {
    if (store.role && store.role?.role_permissions?.is_member)
      setInitialPageLoad(false);
  }, [store.role]);

  useEffect(() => {
    if (store.role && store.company) {
      if (store.role.role_permissions.owner) {
        if (store.company.id === 15538) {
          setActiveTab("business");
        } else {
          setActiveTab("recruiter");
        }
      } else {
        setActiveTab(store.role.team_member.roles[0]);
      }
    }
     
  }, [store.role, store.company]);

  useEffect(() => {
    if (
      store.company?.trial === "active" ||
      store.company?.trial === "expired"
    ) {
      setShowUpgrade(true);
    }
  }, [store.company]);

  return (
    <InnerPage
      pageTitle={
        (store.company && store.company.name ? store.company.name : "") +
        " - Dashboard"
      }
      originName={store.company?.name}
    >
      <ATSWrapper activeTab="dashboard" routeObject={ROUTES.CompanyDashboard}>
        <InnerPageContainer>
          <DashboardHeader
            openModal={setActiveModal}
            store={store}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {store.company && store.role?.role_permissions?.owner && showUpgrade && (
            <ATSContainer>
              <Suspense fallback={<div />}>
                <TrialContainer
                  trialStatus={store.company.trial}
                  trialExpiryDate={store.company.trial_expiry}
                  upgradeFunction={() => setActiveModal("UpgradeModal")}
                  dismissFunction={() => setShowUpgrade(false)}
                />
              </Suspense>
            </ATSContainer>
          )}
          {store.role?.role_permissions?.owner &&
            store.company?.invited_by_employer?.length && (
              <ATSContainer>
                <Suspense fallback={<div />}>
                  <GuestedAgency
                    company={store.company}
                    upgradeFunction={() => setActiveModal("UpgradeModal")}
                  />
                </Suspense>
              </ATSContainer>
            )}
          <ATSContainer>
            {initialPageLoad ? (
              <Spinner />
            ) : (
              <>
                {store.company?.trial !== "expired" && (
                  <Suspense fallback={<Spinner />}>
                    {(activeTab === "recruiter" ||
                      activeTab === "hiring_manager") && (
                      <>
                        <RecruiterAnalytics store={store} match={props.match} />
                        <PipelinesContainer store={store} />
                        <InterviewJoinersContainer
                          store={store}
                          match={props.match}
                        />
                      </>
                    )}
                    {activeTab === "business" && (
                      <BusinessAnalytics store={store} match={props.match} />
                    )}
                    {activeTab === "marketer" && (
                      <>
                        <MarketerAnalytics store={store} match={props.match} />
                        <LatestEmails store={store} />
                      </>
                    )}
                    {activeTab === "feed" && (
                      <ReviewsFeedContainer store={store} />
                    )}
                  </Suspense>
                )}
              </>
            )}
          </ATSContainer>

          {activeModal === "addTalent" && (
            <Suspense fallback={<div />}>
              <AddTalentModal
                closeModal={() => setActiveModal(undefined)}
                session={store.session}
                companyId={store.company?.id}
                company={store.company}
                concatInvitedProfessionals={() =>
                  notify("info", `Successully added candidate`)
                }
              />
            </Suspense>
          )}
          {activeModal === "UpgradeModal" && (
            <Suspense fallback={<div />}>
              <CheckoutModalV2 closeModal={() => setActiveModal(undefined)} />
            </Suspense>
          )}
        </InnerPageContainer>
      </ATSWrapper>
    </InnerPage>
  );
};

// async downloadReport() {
//   const res = await fetch(
//     `${API_ROOT_PATH}/v1/analytics/${this.props.company.id}/candidate_report`,
//     {
//       method: "GET",
//       headers: this.props.session,
//     }
//   );
//   if (res.ok) {
//     const text = res.text();
//     text.then((csv) => {
//       download(
//         csv,
//         `${this.props.company.name}-${
//           new Date().toLocaleString().split(",")[0]
//         }.csv`,
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//       );
//     });
//   }
// }

export default CompanyDashboard;
