import React from "react";
import styled from "styled-components";
import { device } from "helpers/device";
import NumberFormat from "react-number-format";

export const OverviewContainer = styled.div`
  display: grid;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 20px;
`;

export const CellContainer = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100%;
  padding: 0;
  grid-column: span ${(props) => props.columns || 1};
  grid-row: span ${(props) => props.rows || 1};
`;
export const CellHeader = ({ title, children }) => (
  <STCellHeader className="leo-flex">
    <h5>{title}</h5>
    {children}
  </STCellHeader>
);

export const CellBody = styled.div`
  padding: ${(props) => (props.padding === "large" ? "50" : "20")}px;
`;

const STCellHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid rgb(154, 156, 161, 0.3);
  height: 50px;
  justify-content: space-between;
  padding: 0 25px;

  h5 {
    color: #9a9ca1;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.67px;
    margin: 0;
    text-transform: uppercase;
  }
`;

export const NumericStat = ({
  currency,
  totalValue,
  title,
  changePercentage,
  changeOverPeriod,
  increase,
}) => (
  <NumericWrapper className="leo-flex">
    <ValueNum>
      {title === "Total Income" ? (
        <NumberFormat
          value={
            totalValue > 1000000
              ? totalValue / 1000000
              : totalValue > 1000
              ? totalValue / 1000
              : totalValue
          }
          displayType={"text"}
          thousandSeparator={true}
          prefix={currency}
          suffix={totalValue > 1000000 ? "M" : totalValue > 1000 ? "K" : ""}
          decimalScale={1}
          renderText={(value) => <>{value}</>}
        />
      ) : (
        totalValue
      )}
    </ValueNum>
    <ValueTitle>{title}</ValueTitle>
    <ChangeIndicator increase={increase} className="leo-flex">
      {increase ? "+" : ""}
      {changePercentage}%({changeOverPeriod})
    </ChangeIndicator>
  </NumericWrapper>
);

const NumericWrapper = styled.div`
  align-items: center;
  justify-content: space-between;
  flex-direction: column;

  h3 {
    margin-bottom: 7px;
  }

  h5 {
    margin-bottom: 8px;

    @media ${device.tablet} {
      margin-bottom: 10px;
    }
  }
  span {
    margin-top: 10px;
  }
`;

export const ValueNum = styled.h3`
  color: #1e1e1e;
  font-size: ${(props) =>
    props.size === "large"
      ? 30
      : props.size === "medium"
      ? 20
      : props.size === "small"
      ? 10
      : 30}px;
  font-weight: 500;
  line-height: normal;

  @media ${device.tablet} {
    font-size: ${(props) =>
      props.size === "large"
        ? 50
        : props.size === "medium"
        ? 35
        : props.size === "small"
        ? 20
        : 50}px;
  }
`;
const ValueTitle = styled.h5`
  color: #9a9ca1;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.2px;
  line-height: normal;
  text-transform: uppercase;
`;

const ChangeIndicator = styled.span`
  align-items: center;
  color: ${(props) => (props.increase ? "#00cba7" : "#ff3159")};
  font-size: 12px;
  font-weight: 500;
  line-height: normal;

  @media ${device.tablet} {
    font-size: 15px;
  }
`;
