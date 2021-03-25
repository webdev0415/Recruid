import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { device } from "helpers/device";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const IncreaseIndicator = ({ value }) => {
  return (
    <IncreaseContainer className={value < 0 ? "negative" : ""}>
      {value >= 0 ? (
        <i className="fas fa-caret-up"></i>
      ) : (
        <i className="fas fa-caret-down"></i>
      )}
      {value}%
    </IncreaseContainer>
  );
};

export const AnalyticsCirclePercentage = ({ total, completed, color }) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    let val = Math.round((completed / total) * 100);
    if (Number.isNaN(val)) {
      val = 0;
    }
    setPercentage(val);
  }, [total, completed]);

  return (
    <CircleContainer>
      <CircularProgressbar
        value={percentage}
        maxValue={100}
        minValue={0}
        text={`${percentage}%`}
        styles={buildStyles({
          textSize: "18px",
          pathColor: progressBarColors[color][1],
          textColor: progressBarColors[color][1],
          trailColor: progressBarColors[color][0],
        })}
      />
    </CircleContainer>
  );
};

const progressBarColors = {
  red: ["rgba(242, 120, 129, 0.35)", "#E25667", "rgba(242, 120, 129, 0.2)"],
  yellow: ["rgba(244, 209, 110, 0.5)", "#9C7B1B", "rgba(244, 209, 110, 0.25)"],
  green: ["rgba(53, 195, 174, 0.32)", "#00CBA7", "rgba(53, 195, 174, 0.1)"],
};

const IncreaseContainer = styled.span`
  align-items: flex-end;
  color: #00cba7;
  display: flex;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  margin-top: 10px;

  &.negative {
    color: #ff3159;
  }

  i {
    margin-right: 5px;
    font-size: 25px;
  }

  @media ${device.tablet} {
    font-size: 15px;
  }
`;

const CircleContainer = styled.div`
  width: 80px;
  height: 80px;
  max-width: 80px;
  max-height: 80px;
`;

export const AnalyticsBox = styled.div`
  background: ${(props) =>
    props.background || progressBarColors[props.color]?.[2] || "inherit"};
  border: ${(props) =>
    progressBarColors[props.color] ? "none" : "1px solid #e7e7e7"};
  border-radius: 4px;
  padding: 20px;
  grid-column: span ${(props) => props.span || 1};
  display: flex;
  justify-content: space-between;
`;

export const Title = styled.h5`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: ${(props) => progressBarColors[props.color]?.[1] || "#acadb0"};
`;
export const MainNumber = styled.h4`
  font-weight: 500;
  font-size: 36px;
  color: ${(props) => progressBarColors[props.color]?.[1] || "#53585f"};
  margin-top: 25px;

  span {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: ;
    color: ${(props) => progressBarColors[props.color]?.[0] || "#acadb0"};
    display: inline;
  }
`;
