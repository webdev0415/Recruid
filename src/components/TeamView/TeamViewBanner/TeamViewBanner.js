import React, { useState, useContext, Suspense } from "react";
import styled from "styled-components";
import { ROUTES } from "routes";

import GlobalContext from "contexts/globalContext/GlobalContext";
// import TeamViewMenu from "./TeamViewMenu/TeamViewMenu";
import ATSBanner from "sharedComponents/ATSBanner";
import SearchInput from "sharedComponents/SearchInput";
import retryLazy from "hooks/retryLazy";
// import styles from "./style/teamViewBanner.module.scss";
const CheckoutModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/CheckoutModal/CheckoutModalV2"))
);
const UnlockAccessModal = React.lazy(() =>
  retryLazy(() => import("modals/UnlockAccessModal"))
);

export default function TeamViewBanner(props) {
  const store = useContext(GlobalContext);
  const [showUnlockAccess, setShowUnlockAccess] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const openUnlockAccess = () => setShowUnlockAccess(true);
  const closeUnlockAccess = () => setShowUnlockAccess(false);

  const openUpgradeCompany = () => {
    setShowUpgradeModal(true);
  };

  const closeUpgradeCompany = () => {
    setShowUpgradeModal(false);
  };

  const upgradeCompanyPlan = async () => {
    await setTimeout(closeUnlockAccess, 350);
    return setTimeout(openUpgradeCompany, 750);
  };

  return (
    <>
      <ATSBanner
        name={props.company?.name}
        avatar={props.company?.avatar_url}
        page="Settings"
        tabs={
          props.role?.role_permissions?.owner
            ? ownerMenutabs
            : props.role?.role_permissions?.admin
            ? adminMenuTabs
            : props.role?.role_permissions?.manager
            ? managerTabs
            : userTabs
        }
        activeTab={props.activeMenuOption}
        tabType="link"
      >
        {props.match.params.tab === "team" && (
          <SearchInput
            value={props.searchValue}
            onChange={(val) => props.setSearchValue(val)}
            placeholder="Search members..."
          />
        )}
        {(props.role?.role_permissions?.owner ||
          props.role?.role_permissions?.admin) && (
          <PlanArea>
            {props.company.type === "Agency" &&
            !!props.company?.invited_by_employer?.length ? (
              <button
                className="button button--default button--blue-dark"
                onClick={openUnlockAccess}
              >
                Unlock Access
              </button>
            ) : store.pricingPlan?.name === "custom" &&
              store.teamMembers?.length >= store.pricingPlan?.total_seats ? (
              <a
                href={`mailto:sales@recruitd.com?subject=${props.company.name} - Upgrading custom account`}
                className="button button--default button--blue-dark"
              >
                Upgrade Plan
              </a>
            ) : store.teamMembers?.length >= store.pricingPlan?.total_seats ||
              !store.pricingPlan ? (
              <button
                className="button button--default button--blue-dark"
                onClick={openUpgradeCompany}
              >
                Upgrade Plan
              </button>
            ) : null}
            {store.pricingPlan?.total_seats && (
              <PlanContainer>
                <PlanSeats>
                  <PlanTitle>Seats</PlanTitle>
                  <PlanNumber>
                    {store.pricingPlan?.total_seats ?? "n/a"}
                  </PlanNumber>
                </PlanSeats>
                <PlanAvailable>
                  <PlanTitle>Available</PlanTitle>
                  <PlanNumber>
                    {store.pricingPlan?.total_seats - store.teamMembers?.length}
                  </PlanNumber>
                </PlanAvailable>
              </PlanContainer>
            )}
          </PlanArea>
        )}
      </ATSBanner>
      {showUnlockAccess && (
        <Suspense fallback={<div />}>
          <UnlockAccessModal
            company={props.company}
            show={showUnlockAccess}
            hide={closeUnlockAccess}
            upgradePlan={upgradeCompanyPlan}
          />
        </Suspense>
      )}
      {showUpgradeModal && (
        <Suspense fallback={<div />}>
          <CheckoutModalV2
            closeModal={closeUpgradeCompany}
            useV2={!store.pricingPlan}
          />
        </Suspense>
      )}
    </>
  );
}

const PlanArea = styled.div`
  align-items: center;
  display: flex;
`;

const PlanContainer = styled.div`
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  display: flex;
  font-size: 13px;
  line-height: 1;
  margin-left: 15px;
  padding: 15px 30px;
  text-align: right;

  span {
    line-height: 1;
  }
`;

const PlanSeats = styled.div`
  margin-right: 40px;
`;

const PlanAvailable = styled.div``;

const PlanTitle = styled.span`
  color: #74767b;
  margin-bottom: 10px;
`;

const PlanNumber = styled.span`
  font-weight: 500;
`;

const ownerMenutabs = [
  {
    name: "company",
    title: "Company Details",
    url: (routerProps) =>
      ROUTES.TeamView.url(
        routerProps.match.params.companyMentionTag,
        "company"
      ),
  },
  {
    name: "customisation",
    title: "Customisation",
    url: (routerProps) =>
      ROUTES.TeamView.url(
        routerProps.match.params.companyMentionTag,
        "customisation"
      ),
  },
  {
    name: "team",
    title: "Team",
    url: (routerProps) =>
      ROUTES.TeamView.url(routerProps.match.params.companyMentionTag, "team"),
  },
  {
    name: "billing",
    title: "Billing",
    url: (routerProps) =>
      ROUTES.TeamView.url(
        routerProps.match.params.companyMentionTag,
        "billing"
      ),
  },
  {
    name: "user",
    title: "Connections",
    url: (routerProps) =>
      ROUTES.TeamView.url(routerProps.match.params.companyMentionTag, "user"),
  },
];
const adminMenuTabs = [
  {
    name: "company",
    title: "Company Details",
    url: (routerProps) =>
      ROUTES.TeamView.url(
        routerProps.match.params.companyMentionTag,
        "company"
      ),
  },
  {
    name: "team",
    title: "Team",
    url: (routerProps) =>
      ROUTES.TeamView.url(routerProps.match.params.companyMentionTag, "team"),
  },
  {
    name: "user",
    title: "Connections",
    url: (routerProps) =>
      ROUTES.TeamView.url(routerProps.match.params.companyMentionTag, "user"),
  },
];

const managerTabs = [
  {
    name: "user",
    title: "Connections",
    url: (routerProps) =>
      ROUTES.TeamView.url(routerProps.match.params.companyMentionTag, "user"),
  },
  {
    name: "team",
    title: "Team",
    url: (routerProps) =>
      ROUTES.TeamView.url(routerProps.match.params.companyMentionTag, "team"),
  },
];
const userTabs = [
  {
    name: "user",
    title: "Connections",
    url: (routerProps) =>
      ROUTES.TeamView.url(routerProps.match.params.companyMentionTag, "user"),
  },
];
