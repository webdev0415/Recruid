import React, { useContext } from "react";
import { FrappeChart } from "./FrappeChart";
import GlobalContext from "contexts/globalContext/GlobalContext";
import {
  ChartContainer,
  Column,
  Container,
  ContainerHeader,
  EmptyChart,
} from "./components";
import { AWS_CDN_URL } from "constants/api";

import { stageTitles } from "constants/stageOptions";

function checkEmptyConversion(conversions) {
  if (
    !conversions ||
    !conversions.datasets ||
    conversions.datasets.length === 0
  ) {
    return true;
  }

  for (let val of conversions.datasets[0].values) {
    if (val) {
      return false;
    }
  }
  return true;
}

export default function BarChartContainer({ barData, col }) {
  const store = useContext(GlobalContext);

  const findInterviewStageTitle = (stageProp) => {
    let match;
    if (store.interviewStages) {
      store.interviewStages.map((stage) =>
        stage.static_name === stageProp ? (match = stage.name) : null
      );
    }
    return match;
  };

  const convertBarData = (barData) => {
    if (!barData) return [];
    const formattedData = {
      datasets: [
        {
          name: `Total`,
          color: `violet`,
          values: [],
        },
        {
          name: `Converted`,
          color: `light-blue`,
          values: [],
        },
        {
          name: `Rejected`,
          color: `red`,
          values: [],
        },
      ],
      labels: [],
    };
    let keys = Object.keys(barData);
    for (let n in keys)
      formattedData.labels.push(
        stageNames[keys[n]] || findInterviewStageTitle(keys[n])
      );
    for (let n in barData) {
      formattedData.datasets[0].values.push(barData[n][`total`]);
      formattedData.datasets[1].values.push(barData[n][`converted`]);
      formattedData.datasets[2].values.push(barData[n][`rejected`]);
    }
    return formattedData;
  };
  return (
    <Column className={`col-md-${col}`}>
      <Container>
        <ContainerHeader>
          <h5>Conversion at Stage</h5>
        </ContainerHeader>
        <ChartContainer style={{ paddingTop: "30px" }}>
          {!checkEmptyConversion(convertBarData(barData)) ? (
            <FrappeChart
              type="bar"
              data={convertBarData(barData)}
              height={300}
            />
          ) : (
            <EmptyChart>
              <img
                alt=""
                src={`${AWS_CDN_URL}/icons/empty-icons/empty-bar.svg`}
                title="No data to display for this period."
              />
              <p>No data to display for this period.</p>
            </EmptyChart>
          )}
        </ChartContainer>
      </Container>
    </Column>
  );
}

const stageNames = { ...stageTitles, interviewing_client: "Client Stages" };
