import React from "react";
import PriorityJobs from "components/TempManager/TempDashboard/PriorityJobs";
import AvailableCandidates from "components/TempManager/TempDashboard/AvailableCandidates";
import { ATSContainer } from "styles/PageContainers";
import styled from "styled-components";
import {
  AnalyticsCirclePercentage,
  AnalyticsBox,
  MainNumber,
  Title,
} from "components/TempManager/TempAnalytics/components";
import ATSBanner from "sharedComponents/ATSBanner";
import TempActivities from "components/TempManager/TempDashboard/TempActivities";

const TempDashboard = ({
  store,
  permission,
  activeTab,
  tabsArr,
  dashboardAnalytics,
}) => {
  console.log("tabsARR", tabsArr)
  return (
    <>
      <ATSBanner
        name={store.company?.name}
        avatar={store.company?.avatar_url}
        page="Temp +"
        tabs={tabsArr}
        activeTab={activeTab}
        tabType="link"
        v2theme={true}
      />
      <ATSContainer>
        {dashboardAnalytics && (
          <AnalyticsWrapper>
            <AnalyticsBox color="green">
              <div>
                <Title color="green">Jobs Accepted</Title>
                <MainNumber color="green">
                  {dashboardAnalytics.jobs_accepted.total}
                  <span>/{dashboardAnalytics.jobs_accepted.job_total}</span>
                </MainNumber>
              </div>
              <AnalyticsCirclePercentage
                total={dashboardAnalytics.jobs_accepted.job_total}
                completed={dashboardAnalytics.jobs_accepted.total}
                color="green"
              />
            </AnalyticsBox>
            <AnalyticsBox color="yellow">
              <div>
                <Title color="yellow">Jobs to be accepted</Title>
                <MainNumber color="yellow">
                  {dashboardAnalytics.waiting_for_approval.total}
                  <span>
                    /{dashboardAnalytics.waiting_for_approval.job_total}
                  </span>
                </MainNumber>
              </div>
              <AnalyticsCirclePercentage
                total={dashboardAnalytics.waiting_for_approval.job_total}
                completed={dashboardAnalytics.waiting_for_approval.total}
                color="yellow"
              />
            </AnalyticsBox>
            <AnalyticsBox color="red">
              <div>
                <Title color="red">Jobs to Fill</Title>
                <MainNumber color="red">
                  {dashboardAnalytics.jobs_to_fill.total}
                  <span>/{dashboardAnalytics.jobs_to_fill.job_total}</span>
                </MainNumber>
              </div>
              <AnalyticsCirclePercentage
                total={dashboardAnalytics.jobs_to_fill.job_total}
                completed={dashboardAnalytics.jobs_to_fill.total}
                color="red"
              />
            </AnalyticsBox>
            <AnalyticsBox background="rgba(223, 233, 244, 0.25)">
              <CandidatesTotal>
                <i className="fas fa-users"></i>
                <p>{dashboardAnalytics.new_candidates.total}</p>
                <span>Candidates</span>
              </CandidatesTotal>
            </AnalyticsBox>
          </AnalyticsWrapper>
        )}
        <PriorityJobs store={store} permission={permission} />
        <AvailableCandidates store={store} permission={permission} />
        <TempActivities store={store} />
      </ATSContainer>
    </>
  );
};

const AnalyticsWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 1fr;
  grid-gap: 15px;
`;

const CandidatesTotal = styled.div`
  text-align: center;
  width: 100%;

  i {
    font-size: 25px;
    margin-bottom: 5px;
    color: #6f6f6f;
  }

  p {
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    color: #2a3744;
    margin-bottom: 5px;
  }
  span {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #74767b;
  }
`;

export default TempDashboard;
