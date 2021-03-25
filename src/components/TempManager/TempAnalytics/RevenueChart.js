import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

const chartColors = ["#01295F", "#8CD4ED", "#35C3AE"];

const RevenueChart = ({ revenueAnalytics }) => {
  const [tooltipOptions, setTooltipOptions] = useState(undefined);
  const [formattedAnalytics, setFormattedAnalytics] = useState(undefined);

  useEffect(() => {
    if (revenueAnalytics) {
      setFormattedAnalytics({
        labels: Object.keys(revenueAnalytics).map(
          (key) => exchangerLabel[key] || key
        ),
        datasets: [
          {
            name: "Charge Fee",
            type: "bar",
            values: Object.values(revenueAnalytics).map(
              (entry) => entry.charge
            ),
          },
          {
            name: "Pay Fee",
            type: "bar",
            values: Object.values(revenueAnalytics).map((entry) => entry.pay),
          },
          {
            name: "Profit",
            type: "bar",
            values: Object.values(revenueAnalytics).map(
              (entry) => entry.profit
            ),
          },
        ],
      });
    }
  }, [revenueAnalytics]);
  useEffect(() => {
    if (formattedAnalytics) {
      new Chart("#revenue-chart", {
        // title: "My Awesome Chart",
        data: formattedAnalytics,
        type: "bar",
        height: 300,
        colors: chartColors,
        barOptions: {
          spaceRatio: 0.5,
          stacked: true,
        },
      });
    }
  }, [formattedAnalytics]);

  const onMouseOver = (e) => {
    if (
      e.target.classList.contains("bar") &&
      e.target.classList.contains("mini")
    ) {
      let index = e.target.getAttribute("data-point-index");
      setTooltipOptions({
        top: e.target.getAttribute("y"),
        left: e.target.getAttribute("x"),
        index: index,
        data: {
          charge: formattedAnalytics.datasets[0].values[index],
          pay: formattedAnalytics.datasets[1].values[index],
          profit: formattedAnalytics.datasets[2].values[index],
          margin: Object.values(revenueAnalytics)[index].margin,
        },
      });
    } else {
      setTooltipOptions(undefined);
    }
  };

  return (
    <ChartWrapper>
      <div id="revenue-chart" onMouseOver={onMouseOver} />
      <Legend>
        <div className="label-container">
          <div className="legend-box color-1"></div>
          <label>Charge fee</label>
        </div>
        <div className="label-container">
          <div className="legend-box color-2"></div>
          <label>Pay fee</label>
        </div>
        <div className="label-container">
          <div className="legend-box color-3"></div>
          <label>Profit</label>
        </div>
      </Legend>
      {tooltipOptions && <ToolTip tooltipOptions={tooltipOptions} />}
    </ChartWrapper>
  );
};

const ToolTip = ({ tooltipOptions }) => {
  return (
    <ToolTipContainer left={tooltipOptions.left} top={tooltipOptions.top}>
      <label>Monthly Charge:</label>
      <span className=" color-1">${tooltipOptions.data.charge}</span>
      <label>Monthly Pay:</label>
      <span className=" color-2">${tooltipOptions.data.pay}</span>
      <label>Monthly Profit:</label>
      <span className=" color-3">${tooltipOptions.data.profit}</span>
      <label>Profit Margin:</label>
      <span className=" color-3">%{tooltipOptions.data.margin}</span>
    </ToolTipContainer>
  );
};

const ChartWrapper = styled.div`
  position: relative;

  #revenue-chart {
    min-height: 300px;
  }
  .chart-legend {
    display: none;
  }
  .graph-svg-tip.comparison {
    display: none !important;
  }
`;

const ToolTipContainer = styled.div`
  position: absolute;
  top: ${(props) => props.top - 100}px;
  left: ${(props) => props.left}px;
  background: #2a3744c4;
  border-radius: 4px;
  padding: 15px;
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
  win-width: 100px;

  label {
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    color: #ffffff;
    width: max-content;
  }

  span {
    font-weight: bold;
    font-size: 12px;
    line-height: 15px;

    &.color-1 {
      color: ${chartColors[0]};
    }
    &.color-2 {
      color: ${chartColors[1]};
    }
    &.color-3 {
      color: ${chartColors[2]};
    }
  }
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .label-container {
    margin: 0px 15px;
    display: flex;
    align-items: center;

    label {
      font-size: 12px;
      line-height: 15px;
      color: #74767b;
      margin-left: 5px;
    }
  }
  .legend-box {
    width: 15px;
    height: 15px;
    &.color-1 {
      background: ${chartColors[0]};
    }
    &.color-2 {
      background: ${chartColors[1]};
    }
    &.color-3 {
      background: ${chartColors[2]};
    }
  }
`;

const exchangerLabel = {
  jan: "Jan",
  feb: "Feb",
  mar: "Mar",
  apr: "Apr",
  may: "May",
  jun: "Jun",
  jul: "Jul",
  aug: "Aug",
  sep: "Sep",
  oct: "Oct",
  nov: "Nov",
  dec: "Dec",
  "1st quarter": "Jan - Mar",
  "2nd quarter": "Apr - Jun",
  "3rd quarter": "Jul - Sep",
  "4th quarter": "Oct - Dec",
};

export default RevenueChart;
