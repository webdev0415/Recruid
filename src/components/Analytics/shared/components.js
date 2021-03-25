import styled from "styled-components";

import { device } from "helpers/device";

export const StatContainer = styled.div`
  display: grid;
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  grid-template-columns: repeat(1, 1fr);

  @media ${device.tablet} {
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    grid-template-columns: repeat(2, 1fr);
  }

  .frappe-chart {
    width: 100%;

    @media ${device.tablet} {
    }
  }
`;

export const StatContainerSingle = styled.div`
  display: grid;
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  grid-template-columns: repeat(1, 1fr);
`;

export const StatContainerDouble = styled.div`
  display: grid;
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  grid-template-columns: repeat(2, 1fr);

  @media ${device.tablet} {
    grid-column-gap: 20px;
    grid-row-gap: 20px;
  }
`;

export const Column = styled.div``;

export const Container = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
  min-height: 155px;
  padding: 0;

  .graph-svg-tip .title {
    text-transform: capitalize;
  }

  .chart-legend {
    flex-wrap: wrap;
    padding: 0;
    padding-left: 25px;
    padding-right: 25px;

    g {
      align-items: center;
      display: flex;
      margin-right: 15px;
      padding-bottom: 10px !important;

      .legend-dot {
        margin-right: 5px;
      }

      .legend-dataset-text {
        font-size: 12px;
        margin: 0;
        margin-right: 5px;
        text-transform: capitalize;
      }
    }
  }
`;

export const ContainerHeader = styled.div.attrs((props) => ({
  className: (props.className || " ") + " leo-flex-center-between",
}))`
  border-bottom: 1px solid rgb(154, 156, 161, 0.3);
  height: 50px;
  padding: 0 25px;

  h5 {
    color: #9a9ca1;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 1.67px;
    margin: 0;
    text-transform: uppercase;

    @media screen and (min-width: 768px) {
      font-size: 10px;
    }
  }
`;

export const ToggleOption = styled.div`
  padding-right: 5px;
`;

export const ToggleMenu = styled.div`
  min-width: 0px;
  right: 40px;
  top: 40px;
`;

export const ToggleMenuOption = styled.div`
  cursor: pointer;
  padding: 5px 10px;

  &:first-child {
    border-bottom: 1px solid rgb(154, 156, 161, 0.3);
  }

  &:hover {
    background: #f6f6f6;
  }
`;

export const ChartContainer = styled.div.attrs((props) => ({
  className: (props.className || " ") + " leo-flex-center-center",
}))`
  min-height: 350px;
  padding-bottom: 30px;
  padding-top: 30px;

  .chart-container {
    font-family: inherit;
  }

  .title {
    display: none;
  }

  .chart {
    margin: 0 !important;
    padding: 0 !important;
  }
`;

export const EmptyChart = styled.div`
  padding: 20px;
  text-align: center;

  img {
    margin-bottom: 20px;
    max-width: 150px;
  }
`;
