import React, { useEffect, useState } from "react";
import notify from "notifications";

import Bar from "components/Analytics/shared/Bar";
import Doughnut from "components/Analytics/shared/Doughnut";
import StatCell from "sharedComponents/StatCell";
import {
  StatContainer,
  StatContainerSingle,
  StatContainerDouble,
} from "components/Analytics/shared/components";
import FilterSelector from "components/Analytics/FilterSelector";
import vendorHelpers from "helpers/vendorPage/vendorPage.helpers";
import Spinner from "sharedComponents/Spinner";

// Styles
import analyticsStyles from "assets/stylesheets/scss/collated/analytics.module.scss";

const CompanyAnalyticsTab = ({ store, selectedCompanyId }) => {
  const [vendorAnalytics, setVendorAnalytics] = useState(undefined);
  const [dateFilter, setDateFilter] = useState("this month");

  useEffect(() => {
    if (selectedCompanyId) {
      vendorHelpers
        .fetchVendorAnalytics(
          store.company.id,
          selectedCompanyId,
          store.session,
          dateFilter
        )
        .then((res) => {
          if (!res.err) {
            setVendorAnalytics(res);
          } else {
            setVendorAnalytics(false);
            notify("danger", "Unable to fetch analytics");
          }
        });
    }
  }, [selectedCompanyId, dateFilter]);
  return (
    <>
      {vendorAnalytics === undefined ? (
        <Spinner />
      ) : (
        <>
          <div
            className="leo-flex"
            style={{
              justifyContent: "flex-end",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            <FilterSelector
              dateBoundary={dateFilter}
              setDateBoundary={setDateFilter}
              boundaryMap={{
                today: "Today",
                "7": "Last 7 Days",
                "14": "Last 14 Days",
                "30": "Last 30 Days",
                "90": "Last 90 Days",
                "this week": "This Week",
                "this month": "This Month",
                "this quarter": "This Quarter",
                "this year": "This Year",
                // "all time": "All Time"
              }}
            />
          </div>
          <StatContainer style={{ marginBottom: "50px" }}>
            <StatContainerDouble>
              <StatCell
                value={vendorAnalytics?.active_jobs?.total ?? 0}
                increase={vendorAnalytics?.active_jobs?.diff_per ?? 0}
                metric={"Total Active Jobs"}
              />
              <StatCell
                value={vendorAnalytics?.candidates_submitted?.total}
                increase={vendorAnalytics?.candidates_submitted?.diff_per}
                metric={"Total Candidates Submitted"}
              />
            </StatContainerDouble>
            <StatContainerSingle>
              <StatCell
                value={vendorAnalytics?.placements?.total}
                increase={vendorAnalytics?.placements?.diff_per}
                metric={"Total Placements"}
              />
            </StatContainerSingle>
            <StatContainerDouble>
              <StatCell
                value={vendorAnalytics?.average_time_to_fill?.total}
                increase={vendorAnalytics?.average_time_to_fill?.diff_per}
                metric={"Average time to fill"}
              />
              <StatCell
                value={vendorAnalytics?.average_time_to_hire?.total}
                increase={vendorAnalytics?.average_time_to_hire?.diff_per}
                metric={"Average time to hire"}
              />
            </StatContainerDouble>
            <StatContainerSingle>
              <div
                className={analyticsStyles.statsSpend + " leo-flex"}
                style={{
                  justifyContent: "center",
                  minHeight: 0,
                }}
              >
                <div
                  className="leo-flex"
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <h3>
                    {store.company.currency?.currency_name}
                    {vendorAnalytics.total_agency_spend?.toLocaleString("en")}
                  </h3>
                  <h5>
                    {store.company.type === "Employer"
                      ? "Total Agency Spend"
                      : "Total Client Spend"}
                  </h5>
                </div>
              </div>
            </StatContainerSingle>
            <StatContainerSingle>
              <Doughnut
                data={
                  !!vendorAnalytics.source_mix && vendorAnalytics.source_mix
                }
              />
            </StatContainerSingle>
            <StatContainerSingle>
              <Bar
                barData={
                  !!vendorAnalytics.average_conversion_at_stage &&
                  vendorAnalytics.average_conversion_at_stage
                }
              />
            </StatContainerSingle>
          </StatContainer>
        </>
      )}
    </>
  );
};

export default CompanyAnalyticsTab;
