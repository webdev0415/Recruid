import React from "react";
// import { PieChart } from "react-comps-svg-charts";
import { FrappeChart } from "./FrappeChart";
import styled from "styled-components";

import {
  ChartContainer,
  Column,
  Container,
  ContainerHeader,
  EmptyChart,
  // Toggle,
  // ToggleMenu,
  // ToggleMenuOption,
  // ToggleOption
} from "./components";
import { AWS_CDN_URL } from "constants/api";

// import "../../../../../node_modules/react-comps-svg-charts/dist/svg-charts-styles.css";

const Circle = styled.div`
  width: 195px;
  height: 195px;
  border-radius: 100%;
`;

// function formatSourceMix(data) {
//   let labels = [];
//   Object.keys(data).forEach(source => {
//     if (data[source] > 0) {
//       labels.push(source);
//     }
//   });
//   return {
//     datasets: [
//       {
//         data: Object.values(data).filter(count => count > 0),
//         backgroundColor: ["#00cba7", "#00cba7", "#00cba7", "#00cba7", "#00cba7"]
//       }
//     ],
//     labels: labels
//   };
// }

function checkEmptySourceMix(sourceMix) {
  let isEmpty = true;
  if (sourceMix) {
    sourceMix.forEach((source) => {
      if (source.count !== 0) {
        isEmpty = false;
        return;
      }
    });
  }
  return isEmpty;
}

export default function DoughnutChart({ data }) {
  // const [pieColor, setPieColor] = useState(null);

  // const capitalizedLabel = input => {
  //   let capitalized = input.charAt(0).toUpperCase() + input.slice(1);
  //   return capitalized.replace(`_`, ` `);
  // };

  // const mockedData = {
  //   datasets: [
  //     {
  //       title: "Another Set",
  //       color: "violet",
  //       values: [20, 20, 20, 20, 20]
  //     }
  //   ],
  //   labels: ["label1", "label2", "label3", "label4", "label5"]
  // };

  const formatData = (data) => {
    const dataObj = {
      datasets: [
        {
          title: "Another Set",
          color: "violet",
          values: [],
        },
      ],
      labels: [],
    };
    if (data) {
      for (let n of data) {
        dataObj.labels.push(n.source);
        dataObj.datasets[0].values.push(n.count);
      }
    }

    return dataObj;
  };

  const extractData = () => {
    const colorSets = [
      `124, 214, 253`,
      `94, 100, 255`,
      `116, 62, 226`,
      `255, 88, 88`,
      `255, 160, 10`,
    ];

    if (filteredValue.length === 1) {
      const index = formatData(data).datasets[0].values.indexOf(
        filteredValue[0]
      );
      return [colorSets[index], formatData(data).labels[index]];
    }
  };

  const filteredValue = formatData(data).datasets[0].values.filter(
    (item) => item > 0
  );

  return (
    <Column>
      <Container>
        <ContainerHeader>
          <h5>Source Mix</h5>
        </ContainerHeader>
        <ChartContainer style={{ marginTop: "-30px" }}>
          {/*<FrappeChart type="pie" data={mockedData} height={325} width={325} />*/}
          {checkEmptySourceMix(data) === false ? (
            <>
              {filteredValue.length === 1 ? (
                <div>
                  <Circle
                    style={{
                      backgroundColor: `rgb(${extractData()[0]})`,
                      marginTop: "30px",
                    }}
                  />
                  <span
                    style={{
                      textAlign: `center`,
                      marginTop: `20px`,
                      fontSize: `12px`,
                      fontWeight: `600`,
                      color: `#6c7680`,
                    }}
                  >
                    {extractData()[1]}: {filteredValue[0]}
                  </span>
                </div>
              ) : (
                <FrappeChart
                  type="pie"
                  // type="bar"
                  data={formatData(data)}
                  height={325}
                  width={325}
                  index={1}
                />
              )}
            </>
          ) : (
            <EmptyChart>
              <img
                alt="empty chart"
                src={`${AWS_CDN_URL}/icons/empty-icons/empty-chart.svg`}
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
