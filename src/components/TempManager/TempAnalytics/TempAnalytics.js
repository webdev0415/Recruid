import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ATSContainer } from "styles/PageContainers";
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
import ATSBanner from "sharedComponents/ATSBanner";
import ShiftAnalyticsComponent from "components/TempManager/TempAnalytics/ShiftAnalyticsComponent";
import { fetchTempAnalytics, fetchRevenueAnalytics } from "helpersV2/tempPlus";
import notify from "notifications";
import Spinner from "sharedComponents/Spinner";

const TempAnalytics = ({
  store,

  activeTab,
  tabsArr,
}) => {
  const [graphBoundary, setGraphBoundary] = useState("month");
  const [analytics, setAnalytics] = useState(undefined);
  const [dateBoundary, setDateBoundary] = useState(dateOptions[7]);
  const [revenueAnalytics, setRevenueAnalytics] = useState(undefined);

  useEffect(() => {
    if (store.session && store.company) {
      fetchTempAnalytics(store.session, {
        company_id: store.company.id,
        date_filter: dateBoundary.prop,
      }).then((res) => {
        if (!res.err) {
          setAnalytics({ ...res });
        } else {
          notify("danger", "Unable to get analytics");
        }
      });
    }
  }, [store.session, store.company, dateBoundary]);

  useEffect(() => {
    if (store.session && store.company) {
      fetchRevenueAnalytics(store.session, {
        company_id: store.company.id,
        date_filter: graphBoundary,
      }).then((res) => {
        if (!res.err) {
          setRevenueAnalytics({ ...res.total_revenue });
        } else {
          notify("danger", "Unable to get revenue analytics");
        }
      });
    }
  }, [store.session, store.company, graphBoundary]);

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
      ></ATSBanner>
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
              <Spacer>
                <Title>New Jobs</Title>
                <MainNumber>{analytics.new_jobs.total}</MainNumber>
              </Spacer>
              <IncreaseIndicator value={analytics.new_jobs.percentage_change} />
            </AnalyticsBox>
            <AnalyticsBox color="red">
              <Spacer>
                <Title color="red">Jobs to fill</Title>
                <MainNumber color="red">
                  {analytics.jobs_to_fill.total}
                  <span>/{analytics.jobs_to_fill.job_total}</span>
                </MainNumber>
              </Spacer>
              <AnalyticsCirclePercentage
                total={analytics.jobs_to_fill.job_total}
                completed={analytics.jobs_to_fill.total}
                color="red"
              />
            </AnalyticsBox>
            <AnalyticsBox color="yellow">
              <Spacer>
                <Title color="yellow">Jobs to be accepted</Title>
                <MainNumber color="yellow">
                  {analytics.waiting_for_approval.total}
                  <span>/{analytics.waiting_for_approval.job_total}</span>
                </MainNumber>
              </Spacer>
              <AnalyticsCirclePercentage
                total={analytics.waiting_for_approval.job_total}
                completed={analytics.waiting_for_approval.total}
                color="yellow"
              />
            </AnalyticsBox>
            <AnalyticsBox color="green">
              <Spacer>
                <Title color="green">Jobs Accepted</Title>
                <MainNumber color="green">
                  {analytics.jobs_accepted.total}
                  <span>/{analytics.jobs_accepted.job_total}</span>
                </MainNumber>
              </Spacer>
              <AnalyticsCirclePercentage
                total={analytics.jobs_accepted.job_total}
                completed={analytics.jobs_accepted.total}
                color="green"
              />
            </AnalyticsBox>
            <AnalyticsBox>
              <Spacer>
                <Title>New candidates</Title>
                <MainNumber>{analytics.new_candidates.total}</MainNumber>
              </Spacer>
              <IncreaseIndicator
                value={analytics.new_candidates.percentage_change}
              />
            </AnalyticsBox>
            <AnalyticsBox>
              <Spacer>
                <Title>Placements</Title>
                <MainNumber>{analytics.placements.total}</MainNumber>
              </Spacer>
              <IncreaseIndicator
                value={analytics.placements.percentage_change}
              />
            </AnalyticsBox>
            <ShiftAnalyticsComponent
              total={analytics.total_shifts.total}
              confirmed={analytics.total_shifts.assigned}
              unconfirmed={analytics.total_shifts.to_be_acepted}
              to_fill={analytics.total_shifts.to_fill}
            />
            <AnalyticsBox span={2} background="rgba(223, 233, 244, 0.25)">
              <div className="d-flex">
                <Spacer>
                  <Title>{dateBoundary.adv || dateBoundary.name} Pay</Title>
                  <NumberFormat
                    value={analytics.pay.total}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={store.company.currency?.currency_name}
                    renderText={(value) => <CashValue>{value}</CashValue>}
                  />
                </Spacer>
                <IncreaseIndicator
                  value={Math.round(analytics.pay.percentage_change)}
                />
              </div>
              <div className="d-flex">
                <Spacer>
                  <Title>{dateBoundary.adv || dateBoundary.name} Charge</Title>
                  <NumberFormat
                    value={analytics.charge.total}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={store.company.currency?.currency_name}
                    renderText={(value) => <CashValue>{value}</CashValue>}
                  />
                </Spacer>
                <IncreaseIndicator
                  value={Math.round(analytics.charge.percentage_change)}
                />
              </div>
            </AnalyticsBox>
            <AnalyticsBox background="rgba(223, 233, 244, 0.25)">
              <Spacer>
                <Title>{dateBoundary.adv || dateBoundary.name} Profit</Title>
                <NumberFormat
                  value={analytics.profit.total}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={store.company.currency?.currency_name}
                  renderText={(value) => <CashValue>{value}</CashValue>}
                />
              </Spacer>
              <IncreaseIndicator
                value={Math.round(analytics.profit.percentage_change)}
              />
            </AnalyticsBox>
            <AnalyticsBox background="rgba(223, 233, 244, 0.25)">
              <Spacer>
                <Title>Avg Profit Margin</Title>
                <CashValue>%20</CashValue>
              </Spacer>
              <IncreaseIndicator value={20} />
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
    </>
  );
};

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

// const TotalIncome = styled.div`
//   height: 100%;
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
//
//   h3 {
//     font-weight: bold;
//     font-size: 12px;
//     line-height: 15px;
//     letter-spacing: 1.3px;
//     text-transform: uppercase;
//     color: #b0bdca;
//     margin-bottom: 5px;
//   }
//
//   span {
//     font-weight: bold;
//     font-size: 32px;
//     line-height: 39px;
//     color: #2a3744;
//   }
// `;

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

const Spacer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export default TempAnalytics;

// average_profit_margin
// total income
