import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { device } from "helpers/device";
import { fetchIndicators } from "../helpers.js";
import Spinner from "sharedComponents/Spinner";

const IndicatorsContainer = styled.div`
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  grid-column: span 2;
  grid-row-start: 3;
  grid-row-end: 5;
  overflow: hidden;

  @media ${device.tablet} {
    grid-row-end: 4;
  }
`;

const IndicatorsHeader = styled.div`
  border-bottom: 1px solid rgb(238, 238, 238);
  padding: 10px 20px;

  h5 {
    color: #9a9ca1;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.67px;
    text-transform: uppercase;
  }
`;

const IndicatorsBody = styled.div`
  padding: 15px 15px;

  @media ${device.tablet} {
    padding: 20px 25px;
  }
`;

const Indicators = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;

  @media ${device.tablet} {
    padding-left: 35px;
    padding-right: 35px;
  }
`;

const Indicator = styled.div`
  text-align: center;
`;

const IndicatorNumber = styled.div`
  align-items: center;
  border: 3px solid #eee;
  border-radius: 50%;
  color: #eee;
  display: flex;
  font-size: 30px;
  height: 90px;
  justify-content: center;
  margin-bottom: 20px;
  text-align: center;
  width: 90px;

  &.green {
    border-color: #00cba7;
    color: #00cba7;
  }

  &.orange {
    border-color: #faa448;
    color: #faa448;
  }

  &.red {
    border-color: #ff3159;
    color: #ff3159;
  }
`;

const JobDashboardCandidates = (props) => {
  const [indicators, setIndicators] = useState(undefined);

  useEffect(() => {
    fetchIndicators(props.jobId, props.companyId, props.session).then(
      (indicators) => {
        if (indicators !== "err") {
          setIndicators(indicators);
        }
      }
    );
  }, [props.jobId, props.companyId, props.session]);

  const indicatorData = indicators ? indicators.body : null;
  return (
    <IndicatorsContainer>
      <IndicatorsHeader>
        <h5>Total Candidate Overview</h5>
      </IndicatorsHeader>
      <IndicatorsBody>
        {indicatorData ? (
          <>
            <p>
              A snapshot of how long your candidates have been at their current
              status.
            </p>
            <Indicators>
              <Indicator>
                <IndicatorNumber className="green">
                  {indicatorData.one_or_two_days}
                </IndicatorNumber>
                <p>1-2 days</p>
              </Indicator>
              <Indicator>
                <IndicatorNumber className="orange">
                  {indicatorData.three_days}
                </IndicatorNumber>
                <p>3 days</p>
              </Indicator>
              <Indicator>
                <IndicatorNumber className="red">
                  {indicatorData.four_days_or_more}
                </IndicatorNumber>
                <p>4 days+</p>
              </Indicator>
            </Indicators>
          </>
        ) : (
          <Spinner
            className="leo-relative"
            style={{
              backgroundColor: "transparent",
              marginTop: "50px",
            }}
          />
        )}
      </IndicatorsBody>
    </IndicatorsContainer>
  );
};

export default JobDashboardCandidates;
