import React, { useEffect, useState } from "react";
import { ReactTitle } from "react-meta-tags";
import styled from "styled-components";
import { InnerPageContainer } from "styles/PageContainers";
import notify from "notifications";
import {
  AnalyticsCirclePercentage,
  AnalyticsBox,
  MainNumber,
  Title,
} from "components/TempManager/TempAnalytics/components";
import { ATSContainer } from "styles/PageContainers";
import { fetchJobAnalytics } from "helpersV2/tempPlus/job";
import TempJobActivity from "components/TempJobDashboard/TempJobActivity";
import TopApplicants from "components/TempJobDashboard/TopApplicants";
import CandidateJobNotes from "components/ViewJobs/JobDashboard/Components/CandidateJobNotes";

const TempJobDashboardTab = ({
  jobData,
  store,
  jobId,

  candidateJobNotes,
}) => {
  const [analytics, setAnalytics] = useState(undefined);
  const [todayAnalytics, setTodayAnalytics] = useState(undefined);
  useEffect(() => {
    if (store.session && store.company && jobId) {
      fetchJobAnalytics(store.session, {
        job_post_id: jobId,
        company_id: store.company.id,
        date_filter: "all time",
      }).then((res) => {
        if (!res.err) {
          setAnalytics(res);
        } else {
          notify("danger", "Unable to fetch job analytics");
        }
      });
    }
  }, [store.session, store.company, jobId]);

  useEffect(() => {
    document.body.style.background = "white";
    return () => (document.body.style.background = "#eee");
  }, []);

  useEffect(() => {
    if (store.session && store.company && jobId) {
      fetchJobAnalytics(store.session, {
        job_post_id: jobId,
        company_id: store.company.id,
        date_filter: "today",
      }).then((res) => {
        if (!res.err) {
          setTodayAnalytics(res);
        }
      });
    }
  }, [store.session, store.company, jobId]);

  return (
    <InnerPageContainer background="white">
      {store.company && (
        <>
          <ReactTitle title={`${jobData ? jobData.title : ""} | Leo`} />
        </>
      )}
      <ATSContainer>
        <DashboardGrid>
          {analytics && (
            <>
              <AnalyticsBox>
                <CandidatesTotal>
                  <i className="fas fa-users"></i>
                  <p>{analytics.applicant_count.total}</p>
                  <span>Candidates</span>
                </CandidatesTotal>
              </AnalyticsBox>
              <AnalyticsBox color="green" span={2}>
                <div>
                  <Title color="green">Shifts Accepted</Title>
                  <MainNumber color="green">
                    {analytics.accepted_shifts.accepted}
                    <span>/{analytics.accepted_shifts.total_shifts}</span>
                  </MainNumber>
                </div>
                <AnalyticsCirclePercentage
                  total={analytics.accepted_shifts.total_shifts}
                  completed={analytics.accepted_shifts.accepted}
                  color="green"
                />
              </AnalyticsBox>
              <AnalyticsBox color="yellow" span={2}>
                <div>
                  <Title color="yellow">Pending Acceptance</Title>
                  <MainNumber color="yellow">
                    {analytics.pending_acceptance.pending}
                    <span>/{analytics.pending_acceptance.total_shifts}</span>
                  </MainNumber>
                </div>
                <AnalyticsCirclePercentage
                  total={analytics.pending_acceptance.total_shifts}
                  completed={analytics.pending_acceptance.pending}
                  color="yellow"
                />
              </AnalyticsBox>
              <AnalyticsBox color="red" span={2}>
                <div>
                  <Title color="red">Shifts to fill</Title>
                  <MainNumber color="red">
                    {analytics.shifts_to_fill.to_fill}
                    <span>/{analytics.shifts_to_fill.total_shifts}</span>
                  </MainNumber>
                </div>
                <AnalyticsCirclePercentage
                  total={analytics.shifts_to_fill.total_shifts}
                  completed={analytics.shifts_to_fill.to_fill}
                  color="red"
                />
              </AnalyticsBox>
              <RevenueContainer background="rgba(223, 233, 244, 0.25)" span={6}>
                <div className="main-title">
                  <span>Current Revenue</span>
                </div>
                <div className="info-container">
                  <span className="value-label">
                    £{todayAnalytics?.specific_pay.total}
                  </span>
                  <span className="section-title">{`Today's Pay`}</span>
                </div>
                <div className="info-container">
                  <span className="value-label">
                    £{todayAnalytics?.specific_charge.total}
                  </span>
                  <span className="section-title">{`Today's Charge`}</span>
                </div>
                <div className="info-container">
                  <span className="value-label">
                    £{todayAnalytics?.specific_profit.total}
                  </span>
                  <span className="section-title">{`Today's Profit`}</span>
                </div>
                <div className="info-container">
                  <span className="value-label">
                    £{analytics.total_contract_pay}
                  </span>
                  <span className="section-title">Total Contract Pay</span>
                </div>
                <div className="info-container">
                  <span className="value-label">
                    £{analytics.total_contract_charge}
                  </span>
                  <span className="section-title">Total Contract Charge</span>
                </div>
                <div className="info-container">
                  <span className="value-label">
                    £{analytics.total_contract_profit}
                  </span>
                  <span className="section-title">Total Contract Profit</span>
                </div>
              </RevenueContainer>
              <ProfitContainer>
                <span className="percentage positive">
                  {analytics.average_margin || 0}%
                </span>
                <span className="label">Avg. Margin</span>
              </ProfitContainer>
            </>
          )}
        </DashboardGrid>
        <FlexContainer>
          <TopApplicants store={store} jobId={jobId} jobData={jobData} />
          <TempJobActivity store={store} jobId={jobId} />
        </FlexContainer>
        <div style={{ marginTop: "40px" }}>
          {candidateJobNotes && candidateJobNotes.length > 0 && (
            <CandidateJobNotes candidateJobNotes={candidateJobNotes} />
          )}
        </div>
      </ATSContainer>
    </InnerPageContainer>
  );
};

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
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

const RevenueContainer = styled(AnalyticsBox)`
  border: none;
  margin-top: 35px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 15px;

  .main-title {
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    color: #2a3744;
    grid-row: span 2;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: solid #c4c4c4 1px;

    span {
      width: min-content;
      text-align: center;
    }
  }
  .section-title {
    font-weight: bold;
    font-size: 12px;
    line-height: 15px;
    color: #b0bdca;
  }
  .value-label {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #2a3744;
    margin-bottom: 2px;
  }
`;

const ProfitContainer = styled(AnalyticsBox)`
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .label {
    font-weight: bold;
    font-size: 14px;
    line-height: 17px;

    color: #b0bdca;
  }

  .percentage {
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 10px;
    &.positive {
      color: #00cba7;
    }
    &.negative {
      color: #e25667;
    }
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 75px;
`;

export default TempJobDashboardTab;
