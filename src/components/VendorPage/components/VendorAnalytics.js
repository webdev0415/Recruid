import React from "react";
// Packages
// Components
import Bar from "components/Analytics/shared/Bar";
import Doughnut from "components/Analytics/shared/Doughnut";
import StatCell from "sharedComponents/StatCell";
import {
  StatContainer,
  StatContainerSingle,
  StatContainerDouble,
} from "components/Analytics/shared/components";

// Styles
import analyticsStyles from "assets/stylesheets/scss/collated/analytics.module.scss";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";

const VendorAnalytics = ({ company, vendorAnalytics }) => {
  if (vendorAnalytics) {
    return (
      <ATSContainer>
        <StatContainer>
          <StatContainerDouble>
            <StatCell
              value={vendorAnalytics?.active_jobs?.total || 0}
              metric={"Total Active Jobs"}
            />
            <StatCell
              value={vendorAnalytics?.candidates_submitted?.total}
              metric={"Total Candidates Submitted"}
            />
          </StatContainerDouble>
          <StatContainerSingle>
            <StatCell
              value={vendorAnalytics?.placements?.total}
              metric={"Total Placements"}
            />
          </StatContainerSingle>
          <StatContainerDouble>
            <StatCell
              value={vendorAnalytics?.placements?.total}
              metric={"Average time to fill"}
            />
            <StatCell
              value={vendorAnalytics?.average_time_to_hire?.total}
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
                  {company.currency?.currency_name}
                  {vendorAnalytics.total_agency_spend?.toLocaleString("en")}
                </h3>
                <h5>
                  {company.type === "Employer"
                    ? "Total Agency Spend"
                    : "Total Client Spend"}
                </h5>
              </div>
            </div>
          </StatContainerSingle>
          <StatContainerSingle>
            <Doughnut
              data={!!vendorAnalytics.source_mix && vendorAnalytics.source_mix}
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
      </ATSContainer>
    );
  } else return <Spinner />;
};

export default VendorAnalytics;
