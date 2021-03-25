import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import NumberFormat from "react-number-format";
// import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";
import { ValueNum } from "components/ClientManager/ClientOverview/components";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const colors = [
  "#7DD8FF",
  "#5F65FF",
  "#753CE5",
  "#F4D16E",
  "#7DD8FF",
  "#5F65FF",
  "#753CE5",
  "#F4D16E",
];

const PercentageChart = ({ forecast, total, company }) => {
  return (
    <ChartWrapper className="leo-flex">
      {forecast &&
        forecast.dataset.map((amount, index) => (
          <ChartSingleData
            amount={amount}
            label={forecast.labels[index]}
            index={index}
            key={`chart-slice-${index}`}
            total={total}
            company={company}
          />
        ))}
    </ChartWrapper>
  );
};

const ChartSingleData = ({ amount, label, index, total, company }) => {
  const node = useRef();
  const [percentage, setPercentage] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    setShowText(node.current.offsetWidth > 40);
  }, [percentage]);

  useEffect(() => {
    setPercentage((amount * 100) / total);
  }, [amount, total]);

  return (
    <ChartPiece width={percentage} ref={node}>
      <PieceHeader>
        {showText && (
          <NumberFormat
            value={
              amount > 1000000
                ? amount / 1000000
                : amount > 1000
                ? amount / 1000
                : amount
            }
            displayType={"text"}
            thousandSeparator={true}
            prefix={company.currency?.currency_name}
            suffix={amount > 1000000 ? "M" : amount > 1000 ? "K" : ""}
            decimalScale={1}
            renderText={(value) => <ValueNum size="small">{value}</ValueNum>}
          />
        )}
      </PieceHeader>
      <OverlayTrigger
        placement={"top"}
        overlay={
          <ToolTipBox id={`tooltip-top ${index}`}>
            <strong>{label}: </strong>
            <NumberFormat
              value={amount}
              displayType={"text"}
              thousandSeparator={true}
              prefix={company.currency?.currency_name}
              renderText={(value) => <>{value}</>}
            />
            <span>{Math.floor(percentage || 0)}%</span>
          </ToolTipBox>
        }
      >
        <ChartSlice
          color={colors[index] ? colors[index] : colors[index - colors.length]}
        />
      </OverlayTrigger>
      {showText && (
        <PieceFooter>
          {label} <span>{Math.floor(percentage)}%</span>
        </PieceFooter>
      )}
    </ChartPiece>
  );
};

export default PercentageChart;

const ChartWrapper = styled.div`
  width: 100%;
`;

const ChartPiece = styled.div`
  min-width: 5px;
  width: ${(props) => props.width}%;
  margin-right: 3px;
  overflow: hidden;
`;

const ChartSlice = styled.div`
  height: 40px;
  background: ${(props) => props.color};
  width: 100%;
`;

const PieceHeader = styled.div`
  // padding-bottom: 5px;
  margin-bottom: 5px;
  border-bottom: solid #eee 1px;
  min-height: 32px;
`;

const PieceFooter = styled.div`
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1.33px;
  text-transform: uppercase;
  width: max-content;

  span {
    display: inline;
    color: #a7a9ad;
    font-weight: normal;
  }
`;

const ToolTipBox = styled(Tooltip)``;
