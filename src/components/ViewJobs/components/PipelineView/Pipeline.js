import React, { Fragment } from "react";
import { PipelineSC } from "./PipelineComponents";
import { uppercaseStageTitles } from "constants/stageOptions";
const { Wrapper, StageName, Value } = PipelineSC;
import { AWS_CDN_URL } from "constants/api";

const Pipeline = ({
  data,
  filterOption,
  client,
  setFilterOption,
  pipelineOverview = false,
  type,
  interviewStages,
}) => {
  let entries = Object.entries(data);

  const onFilterOptionClick = (option) => {
    if (filterOption === option) return setFilterOption("");
    setFilterOption(option);
  };

  const findInterviewStageTitle = (stageProp) => {
    let match;

    if (interviewStages) {
      interviewStages.map((stage) =>
        stage.static_name === stageProp ? (match = stage.name) : null
      );
    }
    return match;
  };

  return (
    <Wrapper
      className={`${type === "candidates" && "candidates"} ${
        client && "client"
      }`}
    >
      {!!data &&
        Object.keys(data).map((stage, idx) => {
          if (type === "candidates" && stage === "to_fill") {
            return null;
          }
          return (
            <Fragment key={`item-#${idx + 1}`}>
              <li
                onClick={() => {
                  if (!pipelineOverview && filterOption !== stage) {
                    onFilterOptionClick(stage);
                  }
                }}
                className={filterOption === stage ? "active" : ""}
              >
                <StageName>
                  {uppercaseStageTitles[stage] ||
                    findInterviewStageTitle(stage)}
                </StageName>
                <Value>{data[stage]}</Value>
              </li>
              {!pipelineOverview && idx < entries.length - 1 && (
                <img
                  src={`${AWS_CDN_URL}/icons/PipelineArrow.svg`}
                  alt="Arrow"
                />
              )}
            </Fragment>
          );
        })}
    </Wrapper>
  );
};

export default Pipeline;
