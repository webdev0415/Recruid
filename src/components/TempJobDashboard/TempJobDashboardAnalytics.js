import React, { useState, useEffect } from "react";
import { ATSContainer } from "styles/PageContainers";
import { ReactTitle } from "react-meta-tags";
import styled from "styled-components";
import { InnerPageContainer } from "styles/PageContainers";
import { FiltersDropdown } from "sharedComponents/FiltersDropdown";
import { dateOptions } from "constants/filtersOptions";
import {
  IncreaseIndicator,
  AnalyticsCirclePercentage,
  AnalyticsBox,
  MainNumber,
  Title,
} from "components/TempManager/TempAnalytics/components";
import NumberFormat from "react-number-format";
import RevenueChart from "components/TempManager/TempAnalytics/RevenueChart";
// import ShiftAnalyticsComponent from "components/TempManager/TempAnalytics/ShiftAnalyticsComponent";
import StageSelector from "components/Analytics/shared/StageSelector";
import sharedStyles from "components/Analytics/style/shared.module.scss";
import {
  fetchJobAnalytics,
  fetchJobRevenueAnalitycs,
} from "helpersV2/tempPlus/job";
import notify from "notifications";
import Spinner from "sharedComponents/Spinner";

const TempJobDashboardAnalytics = ({ jobData, store, jobId }) => {
  const [graphBoundary, setGraphBoundary] = useState("month");
  const [dateBoundary, setDateBoundary] = useState(dateOptions[7]);
  const [stage, setStage] = useState("applied");
  const [analytics, setAnalytics] = useState(undefined);
  const [revenueAnalytics, setRevenueAnalytics] = useState(undefined);
  useEffect(() => {
    if (store.session && store.company && jobId) {
      fetchJobAnalytics(store.session, {
        job_post_id: jobId,
        company_id: store.company.id,
        date_filter: dateBoundary.prop,
        stage,
      }).then((res) => {
        if (!res.err) {
          setAnalytics(res);
        } else {
          notify("danger", "Unable to fetch job analytics");
        }
      });
    }
  }, [store.session, store.company, jobId, dateBoundary, stage]);

  useEffect(() => {
    document.body.style.background = "white";
    return () => (document.body.style.background = "#eee");
  }, []);

  useEffect(() => {
    if (store.session && store.company && jobId) {
      fetchJobRevenueAnalitycs(store.session, {
        company_id: store.company.id,
        date_filter: graphBoundary,
        job_post_id: jobId,
      }).then((res) => {
        if (!res.err) {
          setRevenueAnalytics({ ...res.total_revenue });
        } else {
          notify("danger", "Unable to get revenue analytics");
        }
      });
    }
  }, [store.session, store.company, graphBoundary, jobId]);

  return (
    <>
      <InnerPageContainer background="white">
        {store.company && (
          <>
            <ReactTitle title={`${jobData ? jobData.title : ""} | Leo`} />
          </>
        )}
        <ATSContainer>
          <FiltersContainer>
            <FiltersDropdown
              name={dateBoundary.name || "Select a filter"}
              options={dateOptions}
              onSelect={(option) => setDateBoundary(option)}
            />
          </FiltersContainer>
          {analytics ? (
            <GridContainer>
              <AnalyticsBox>
                <CandidatesTotal>
                  <i className="fas fa-users"></i>
                  <p>{analytics.number_of_shifts}</p>
                  <span>Number of shifts</span>
                </CandidatesTotal>
              </AnalyticsBox>
              <AnalyticsBox color="red">
                <Spacer>
                  <Title color="red">Shifts to fill</Title>
                  <MainNumber color="red">
                    {analytics.shifts_to_fill.to_fill}
                    <span>/{analytics.shifts_to_fill.total_shifts}</span>
                  </MainNumber>
                </Spacer>
                <AnalyticsCirclePercentage
                  total={analytics.shifts_to_fill.total_shifts}
                  completed={analytics.shifts_to_fill.to_fill}
                  color="red"
                />
              </AnalyticsBox>
              <AnalyticsBox color="yellow">
                <Spacer>
                  <Title color="yellow">Pending Acceptance</Title>
                  <MainNumber color="yellow">
                    {analytics.pending_acceptance.pending}
                    <span>/{analytics.pending_acceptance.total_shifts}</span>
                  </MainNumber>
                </Spacer>
                <AnalyticsCirclePercentage
                  total={analytics.pending_acceptance.total_shifts}
                  completed={analytics.pending_acceptance.pending}
                  color="yellow"
                />
              </AnalyticsBox>
              <AnalyticsBox color="green">
                <Spacer>
                  <Title color="green">Shifts Accepted</Title>
                  <MainNumber color="green">
                    {analytics.accepted_shifts.accepted}
                    <span>/{analytics.accepted_shifts.total_shifts}</span>
                  </MainNumber>
                </Spacer>
                <AnalyticsCirclePercentage
                  total={analytics.accepted_shifts.total_shifts}
                  completed={analytics.accepted_shifts.accepted}
                  color="green"
                />
              </AnalyticsBox>
              <AnalyticsBox>
                <Spacer>
                  <Title>Applicants</Title>
                  <MainNumber>{analytics.applicant_count.total}</MainNumber>
                </Spacer>
                <IncreaseIndicator
                  value={analytics.applicant_count.percentage_change}
                />
              </AnalyticsBox>
              <AnalyticsBox>
                <Spacer>
                  <Title>Placements</Title>
                  <MainNumber>{analytics.specific_placements.total}</MainNumber>
                </Spacer>
                <IncreaseIndicator
                  value={analytics.specific_placements.percentage_change}
                />
              </AnalyticsBox>
              {/*}<ShiftAnalyticsComponent
                total={150}
                confirmed={20}
                unconfirmed={30}
                to_fill={100}
              />*/}
              <AnalyticsBox span={2}>
                <Spacer>
                  <Title>Applicants at stage</Title>
                  <StageSelector
                    styles={sharedStyles}
                    stage={stage}
                    selectStage={(val) => setStage(val)}
                  />
                </Spacer>
                <MainNumber>{analytics.applicants_at_stage}</MainNumber>
              </AnalyticsBox>
              <AnalyticsBox span={2} background="rgba(223, 233, 244, 0.25)">
                <TotalIncome>
                  <h3>PROJECTED INCOME</h3>
                  <NumberFormat
                    value={analytics.projected_income}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={store.company.currency?.currency_name}
                    renderText={(value) => <span>{value}</span>}
                  />
                </TotalIncome>
              </AnalyticsBox>
              <AnalyticsBox span={2} background="rgba(223, 233, 244, 0.25)">
                <TotalIncome>
                  <h3>CURRENT INCOME</h3>
                  <NumberFormat
                    value={analytics.current_income}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={store.company.currency?.currency_name}
                    renderText={(value) => <span>{value}</span>}
                  />
                </TotalIncome>
              </AnalyticsBox>
              <AnalyticsBox span={2} background="rgba(223, 233, 244, 0.25)">
                <div className="d-flex">
                  <Spacer>
                    <Title>{dateBoundary.adv || dateBoundary.name} Pay</Title>
                    <NumberFormat
                      value={analytics.specific_pay.total}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={store.company.currency?.currency_name}
                      renderText={(value) => <CashValue>{value}</CashValue>}
                    />
                  </Spacer>
                  <IncreaseIndicator
                    value={analytics.specific_pay.percentage_change}
                  />
                </div>
                <div className="d-flex">
                  <Spacer>
                    <Title>
                      {dateBoundary.adv || dateBoundary.name} Charge
                    </Title>
                    <NumberFormat
                      value={analytics.specific_charge.total}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={store.company.currency?.currency_name}
                      renderText={(value) => <CashValue>{value}</CashValue>}
                    />
                  </Spacer>
                  <IncreaseIndicator
                    value={analytics.specific_charge.percentage_change}
                  />
                </div>
              </AnalyticsBox>
              <AnalyticsBox background="rgba(223, 233, 244, 0.25)">
                <Spacer>
                  <Title>{dateBoundary.adv || dateBoundary.name} Profit</Title>
                  <NumberFormat
                    value={analytics.specific_profit.total}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={store.company.currency?.currency_name}
                    renderText={(value) => <CashValue>{value}</CashValue>}
                  />
                </Spacer>
                <IncreaseIndicator
                  value={analytics.specific_profit.percentage_change}
                />
              </AnalyticsBox>
              <AnalyticsBox background="rgba(223, 233, 244, 0.25)">
                <Spacer>
                  <Title>Avg Profit Margin</Title>
                  <CashValue>%{analytics.average_margin}</CashValue>
                </Spacer>
                {/*}<IncreaseIndicator value={20} />*/}
              </AnalyticsBox>
              <GraphBox span={4}>
                <GraphFlex>
                  <GraphTitle>Total Revenue</GraphTitle>
                  <BoundarySelect
                    graphBoundary={graphBoundary}
                    setGraphBoundary={setGraphBoundary}
                  />
                </GraphFlex>
                {revenueAnalytics ? (
                  <RevenueChart revenueAnalytics={revenueAnalytics} />
                ) : (
                  <Spinner />
                )}
              </GraphBox>
            </GridContainer>
          ) : (
            <Spinner />
          )}
        </ATSContainer>
      </InnerPageContainer>
    </>
  );
};

export default TempJobDashboardAnalytics;

const BoundarySelect = ({ graphBoundary, setGraphBoundary }) => {
  return (
    <BoundaryWrapper>
      <button
        className={graphBoundary === "month" ? "active" : ""}
        onClick={() => setGraphBoundary("month")}
      >
        Month
      </button>
      <button
        className={graphBoundary === "quarter" ? "active" : ""}
        onClick={() => setGraphBoundary("quarter")}
      >
        Quarter
      </button>
      <button
        className={graphBoundary === "year" ? "active" : ""}
        onClick={() => setGraphBoundary("year")}
      >
        Year
      </button>
    </BoundaryWrapper>
  );
};

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 4fr 4fr 4fr;
  grid-gap: 40px;
`;

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  margin-bottom: 30px;
`;

const TotalIncome = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h3 {
    font-weight: bold;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1.3px;
    text-transform: uppercase;
    color: #b0bdca;
    margin-bottom: 5px;
  }

  span {
    font-weight: bold;
    font-size: 32px;
    line-height: 39px;
    color: #2a3744;
  }
`;

const CashValue = styled.span`
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: #53585f;
  text-align: left;
  margin-top: 30px;
`;

const GraphTitle = styled.h3`
  font-size: 18px;
  line-height: 22px;
  color: #2a3744;
`;

const GraphFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  width: 100%;
`;

const BoundaryWrapper = styled.div`
  display: flex;

  button {
    padding: 5px 15px;
    font-size: 12px;
    line-height: 15px;
    background: rgba(196, 196, 196, 0.51);
    opacity: 0.5;
    border: 1px solid #c4c4c4;

    &.active {
      opacity: 1;
      background: none;
    }
  }

  button:first-child {
    border-radius: 4px 0px 0px 4px;
  }
  button:last-child {
    border-radius: 0px 4px 4px 0px;
  }
`;

const GraphBox = styled(AnalyticsBox)`
  display: block;
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

const Spacer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
