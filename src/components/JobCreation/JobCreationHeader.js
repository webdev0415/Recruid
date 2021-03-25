import React, { useEffect, useState } from "react";
import TabsMenu from "sharedComponents/TabsMenu/TabsMenu";
import styled from "styled-components";
import { COLORS } from "constants/style";
import { ATSContainer } from "styles/PageContainers";
import BreadCrumb from "sharedComponents/Breadcrumb";
import AppButton from "styles/AppButton";

const JobCreationHeader = ({
  store,
  activeTab,
  setActiveTab,
  job,
  setActiveModal,
  saving,
  jobId,
}) => {
  const [tabs, setTabs] = useState([
    { name: "details", title: "Job Details" },
    { name: "application", title: "Application Form" },
    { name: "boards", title: "Post to Job Boards" },
  ]);

  useEffect(() => {
    if (jobId && store.teamMembers) {
      setTabs([
        { name: "details", title: "Job Details" },
        { name: "application", title: "Application Form" },
        { name: "boards", title: "Post to Job Boards" },
        { name: "team", title: "Job Team" },
      ]);
    }
  }, [store.teamMembers, jobId]);

  return (
    <Header className="leo-relative">
      <ATSContainer>
        <BreadCrumb />
        <InnerHeader className="leo-flex leo-justify-between">
          <Title>{job.title || "Create Job"}</Title>
          <AppButton
            theme="white"
            onClick={() => setActiveModal("preview")}
            disabled={saving}
          >
            Preview Job
          </AppButton>
        </InnerHeader>

        <TabsContainer>
          <TabsMenu
            tabsArr={tabs}
            activeTab={activeTab}
            type="button"
            setActiveTab={setActiveTab}
            v2theme={true}
          />
        </TabsContainer>
      </ATSContainer>
    </Header>
  );
};

export default JobCreationHeader;

const Header = styled.div`
  background: ${COLORS.white};
  box-shadow: none;
  height: auto;
  margin-bottom: 15px;
  padding: 20px 0;
  width: 100%;

  @include media-tablet() {
    overflow: visible;
  }

  @media screen and (min-width: 768px) {
    margin-bottom: 20px !important;
  }
`;

const InnerHeader = styled.div`
  flex-direction: column;
  margin-top: 30px;

  @media screen and (min-width: 768px) {
    align-items: center;
    flex-direction: row;
  }
`;

const Title = styled.h2`
  color: ${COLORS.dark_1};
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: #1e1e1e;

  &:hover {
    text-decoration: none;
  }
`;

const TabsContainer = styled.div`
  margin-bottom: -20px;
  margin-top: 15px;
  overflow-x: auto;
  width: 100%;

  @media screen and (min-width: 768px) {
    margin-top: 30px;
    overflow: hidden;
  }
`;
