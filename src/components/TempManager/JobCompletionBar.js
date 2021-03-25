import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { COLORS } from "constants/style";

const JobCompletionBar = ({
  total,
  confirmed,
  unconfirmed,
  to_fill,
  barWidth = 100,
}) => {
  const [percentages, setPercentages] = useState({
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
    setPercentages(newPerc);
  }, [total, confirmed, unconfirmed, to_fill]);

  return (
    <Container>
      <TotalNumber>{percentages.confirmed}%</TotalNumber>
      <BaseBar
        barWidth={barWidth}
        confirmed={percentages.confirmed}
        unconfirmed={percentages.unconfirmed}
        to_fill={percentages.to_fill}
      >
        <CompletedBar
          percentage={percentages.confirmed}
          className="high-fill"
        />
        <CompletedBar className="mid-fill" />
        <CompletedBar className="low-fill" />
      </BaseBar>
    </Container>
  );
};

export default JobCompletionBar;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const BaseBar = styled.div`
  background: ${COLORS.grey};
  border-radius: 6px;
  width: ${(props) => props.barWidth}px;
  position: relative;
  height: 8px;
  display: grid;
  grid-template-columns: ${(props) =>
    `${props.confirmed}% ${props.unconfirmed}% ${props.to_fill}% `};
  grid-gap: 2px;
  overflow: hidden;
`;

const CompletedBar = styled.div`
  width: 100%;
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
const TotalNumber = styled.span`
  margin-right: 20px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
`;
