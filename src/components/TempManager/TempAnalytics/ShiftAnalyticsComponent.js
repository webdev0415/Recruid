import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AnalyticsBox } from "components/TempManager/TempAnalytics/components";
import { COLORS } from "constants/style";

const ShiftAnalyticsComponent = ({
  total,
  confirmed,
  unconfirmed,
  to_fill,
}) => {
  const [percentage, setPercentage] = useState({
    confirmed: 0,
    unconfirmed: 0,
    to_fill: 0,
  });

  useEffect(() => {
    let newPerc = {
      confirmed: total !== 0 ? Math.round((confirmed / total) * 100) : 0,
      unconfirmed: total !== 0 ? Math.round((unconfirmed / total) * 100) : 0,
      to_fill: total !== 0 ? Math.round((to_fill / total) * 100) : 0,
    };
    newPerc = {
      confirmed:
        newPerc.confirmed > 100
          ? 100
          : newPerc.confirmed < 0
          ? 0
          : newPerc.confirmed,
      unconfirmed:
        newPerc.unconfirmed > 100
          ? 100
          : newPerc.unconfirmed < 0
          ? 0
          : newPerc.unconfirmed,
      to_fill:
        newPerc.to_fill > 100 ? 100 : newPerc.to_fill < 0 ? 0 : newPerc.to_fill,
    };
    setPercentage(newPerc);
  }, [total, confirmed, unconfirmed, to_fill]);

  return (
    <CustomAnalyticsBox span={2}>
      <PieContainer>
        <h4 className="title">Total Shifts</h4>
        <DonutChart percentage={percentage} total={total} />
      </PieContainer>
      <BarsContainer>
        <span className="subtitle">Shifts to fill</span>
        <span>
          {to_fill}/{total}
        </span>
        <span>{percentage.to_fill}%</span>
        <Bar className="low-fill" percentage={percentage.to_fill} />
        <span className="subtitle">Waiting to be accepted</span>
        <span>
          {unconfirmed}/{total}
        </span>
        <span>{percentage.unconfirmed}%</span>
        <Bar className="mid-fill" percentage={percentage.unconfirmed} />
        <span className="subtitle">Shifts assigned</span>
        <span>
          {confirmed}/{total}
        </span>
        <span>{percentage.confirmed}%</span>
        <Bar className="high-fill" percentage={percentage.confirmed} />
      </BarsContainer>
    </CustomAnalyticsBox>
  );
};

export default ShiftAnalyticsComponent;

const Bar = ({ percentage, className }) => (
  <BaseBar className={className}>
    <CompletedBar percentage={percentage} className={className} />
  </BaseBar>
);

const DonutChart = ({ percentage, total }) => {
  return (
    <ChartContainer>
      <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
        <circle
          className="donut-hole"
          cx="21"
          cy="21"
          r="15.91549430918954"
          fill="#fff"
        ></circle>
        <circle
          className="donut-ring"
          cx="21"
          cy="21"
          r="15.91549430918954"
          fill="transparent"
          stroke="#d2d3d4"
          strokeWidth="7"
        ></circle>
        <circle
          className="donut-segment"
          cx="21"
          cy="21"
          r="15.91549430918954"
          fill="transparent"
          stroke="#F27881"
          strokeWidth="7"
          strokeDasharray={`${percentage.to_fill} ${100 - percentage.to_fill}`}
          strokeDashoffset="25"
        ></circle>
        <circle
          className="donut-segment"
          cx="21"
          cy="21"
          r="15.91549430918954"
          fill="transparent"
          stroke="#f4d16e"
          strokeWidth="7"
          strokeDasharray={`${percentage.unconfirmed} ${
            100 - percentage.unconfirmed
          }`}
          strokeDashoffset={100 - percentage.to_fill + 25}
        ></circle>
        <circle
          className="donut-segment"
          cx="21"
          cy="21"
          r="15.91549430918954"
          fill="transparent"
          stroke="#00CBA7"
          strokeWidth="7"
          strokeDasharray={`${percentage.confirmed} ${
            100 - percentage.confirmed
          }`}
          strokeDashoffset={
            100 - percentage.to_fill - percentage.unconfirmed + 25
          }
        ></circle>
      </svg>
      <TotalSpan>{total}</TotalSpan>
    </ChartContainer>
  );
};

const CustomAnalyticsBox = styled(AnalyticsBox)`
  padding: 0;
`;

const PieContainer = styled.div`
  background: white;
  display: flex;
  padding: 10px 25px;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .title {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #b0bdca;
  }
`;

const BarsContainer = styled.div`
  background: #f7f9fc;
  height: 100%;
  width: 100%;
  padding: 15px;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;

  .subtitle {
    font-weight: bold;
    font-size: 12px;
    line-height: 15px;
    color: #b0bdca;
    text-align: start;
    width: max-content;
  }

  span {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #53585f;
    text-align: end;
  }
`;

const BaseBar = styled.div`
  background: ${COLORS.grey};
  border-radius: 6px;
  width: 100%;
  position: relative;
  height: 8px;
  grid-column: span 3;

  &.low-fill {
    background: #fce4e6;
  }
  &.mid-fill {
    background: rgba(249, 227, 169, 0.77);
  }
  &.high-fill {
    background: #b1e8e0;
  }
`;

const CompletedBar = styled.div`
  border-radius: 6px;
  width: ${(props) => props.percentage}%;
  position: absolute;
  height: 8px;

  &.low-fill {
    background: ${COLORS.complementary_4};
  }
  &.mid-fill {
    background: ${COLORS.complementary_6};
  }
  &.high-fill {
    background: ${COLORS.secondary_3};
  }
`;

const ChartContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  overflow: hidden;
  margin-top: 10px;

  .chart-legend {
    display: none;
  }
  .graph-svg-tip.comparison {
    display: none !important;
  }
`;

const TotalSpan = styled.span`
  position: absolute;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  color: #53585f;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
