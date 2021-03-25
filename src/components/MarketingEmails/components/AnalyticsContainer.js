import React from "react";
import styled from "styled-components";
import { COLORS } from "constants/style";

const AnalyticsContainer = ({ analytics }) => (
  <AnalyticsWrapper>
    <div className="analytics-box leo-flex-center-center">
      <span className="numeric">{analytics.delivered}</span>
      <span className="num-label">Emails Sent</span>
    </div>
    <div className="analytics-box leo-flex-center-center">
      <span className="numeric">
        {analytics.unique_opens
          ? Math.floor((analytics.unique_opens * 100) / analytics.delivered)
          : 0}
        %
      </span>
      <span className="num-label">Open Rate</span>
    </div>
    <div className="analytics-box leo-flex-center-center">
      <span className="numeric">
        {analytics.unique_opens
          ? Math.floor((analytics.unique_clicks * 100) / analytics.delivered)
          : 0}
        %
      </span>
      <span className="num-label">Click Rate</span>
    </div>
  </AnalyticsWrapper>
);

export default AnalyticsContainer;

const AnalyticsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  grid-gap: 20px;
  margin-bottom: 20px;

  .analytics-box {
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    color: ${COLORS.dark_1};
    padding: 30px 0px;

    .numeric {
      font-size: 28px;
      font-weight: 500;
    }

    .num-label {
      font-size: 14px;
      font-weight: 500;
      margin-left: 10px;
      opacity: 0.75;
    }
  }
`;
