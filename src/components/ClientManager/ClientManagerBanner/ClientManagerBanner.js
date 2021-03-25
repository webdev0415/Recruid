import React, { useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import ATSBanner from "sharedComponents/ATSBanner";
import { ROUTES } from "routes";
import styled from "styled-components";
import styles from "components/TalentNetwork/components/TalentNetworkBanner/style/talentNetworkBanner.module.scss";
import PipelineSelector from "components/ClientManager/StageManager/PipelineSelector.js";
import { PermissionChecker } from "constants/permissionHelpers";
import SimpleDelayedInput from "sharedComponents/SimpleDelayedInput";
const ClientManagerBanner = ({
  viewMode,
  openModal,
  allPipelines,
  search,
  setSearch,
  pipeline,
  location,
}) => {
  const store = useContext(GlobalContext);

  return (
    <>
      <ATSBanner
        name={store.company?.name}
        avatar={store.company?.avatar_url}
        page={store.company?.id === 15538 ? "Productions" : "Clients"}
        tabs={tabsArr}
        activeTab={viewMode}
        tabType="link"
      >
        <div>
          <FlexContainer className="leo-flex-center-end">
            {viewMode !== "overview" && (
              <InputContainer className="leo-flex-center">
                <div className="leo-relative">
                  <SimpleDelayedInput
                    className={styles.form}
                    placeholder="Search..."
                    value={search}
                    onChange={(val) => setSearch(val)}
                  />
                  <li className="fas fa-search search leo-flex-center leo-absolute" />
                </div>
              </InputContainer>
            )}
            <PermissionChecker type="edit" valid={{ business: true }}>
              {viewMode === "deals" && allPipelines?.length > 0 && (
                <button
                  className="button button--default button--blue-dark"
                  onClick={() => openModal("create_deal")}
                >
                  Create Deal
                </button>
              )}
              {viewMode === "contacts" && (
                <button
                  className="button button--default button--blue-dark"
                  onClick={() => openModal("create_contact")}
                >
                  Create Contact
                </button>
              )}
              {viewMode === "companies" && (
                <>
                  {store.company?.invited_by_employer?.length ? (
                    ""
                  ) : (
                    <button
                      className="button button--default button--blue-dark"
                      onClick={() => openModal("create_company")}
                    >
                      Create Company
                    </button>
                  )}
                </>
              )}
            </PermissionChecker>
          </FlexContainer>
          {viewMode === "deals" && (
            <FlexContainer className="second leo-flex-center-between">
              <PipelineSelector
                pipeline={pipeline}
                allPipelines={
                  allPipelines
                    ? allPipelines.filter((pipeline) => !pipeline.archived)
                    : undefined
                }
                openModal={openModal}
                store={store}
                location={location}
              />
            </FlexContainer>
          )}
        </div>
      </ATSBanner>
    </>
  );
};

const tabsArr = [
  {
    name: "overview",
    title: "Overview",
    url: (routerProps) =>
      ROUTES.ClientManager.url(
        routerProps.match.params.companyMentionTag,
        "overview"
      ),
  },
  {
    name: "deals",
    title: "Deals",
    url: (routerProps) =>
      ROUTES.ClientManager.url(
        routerProps.match.params.companyMentionTag,
        "deals"
      ),
  },
  {
    name: "contacts",
    title: "Contacts",
    url: (routerProps) =>
      ROUTES.ClientManager.url(
        routerProps.match.params.companyMentionTag,
        "contacts"
      ),
  },
  {
    name: "companies",
    title: "Companies",
    url: (routerProps) =>
      ROUTES.ClientManager.url(
        routerProps.match.params.companyMentionTag,
        "companies"
      ),
  },
];

export default ClientManagerBanner;

const InputContainer = styled.div`
  margin-right: 10px;

  li {
    color: #9a9ca1;
    font-size: 14px;
    padding: 0;
    bottom: 0;
    left: 15px;
    top: 0;
  }
`;

const FlexContainer = styled.div`
  &.second {
    margin-top: 10px;
  }
`;
