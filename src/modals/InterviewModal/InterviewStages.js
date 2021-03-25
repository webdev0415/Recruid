import React from "react";
// Styles
import styled from "styled-components";

const InterviewStages = ({
  interviewStages,
  setSelectedInterviewStage,
  selectedInterviewStage,
  setModalStage
}) => {
  return (
    <StageContainer>
      {interviewStages.map((stage, index) => (
        <StageRow
          stage={stage}
          selectedInterviewStage={selectedInterviewStage}
          setSelectedInterviewStage={setSelectedInterviewStage}
          key={`${stage.id}-${index}`}
          setModalStage={setModalStage}
        />
      ))}
    </StageContainer>
  );
};

const StageRow = ({
  stage,
  selectedInterviewStage,
  setSelectedInterviewStage,
  setModalStage
}) => (
  <StyledStageRow
    className="table-row-hover"
    onClick={() => {
      setSelectedInterviewStage(stage);
      setModalStage("availability");
    }}
    style={
      selectedInterviewStage && stage.id === selectedInterviewStage.id
        ? { background: "#f6f6f6" }
        : {}
    }
  >
    <StyledJobTitle>{stage.name}</StyledJobTitle>
    <RightSide></RightSide>
  </StyledStageRow>
);

export default InterviewStages;

const StyledStageRow = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const StyledJobTitle = styled.div`
  p {
    font-size: 14px;
    font-weight: 500;
    margin: 0 !important;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: #74767b;
    font-size: 12px;
  }
`;

const StageContainer = styled.div`
  max-height: 470px;
  overflow-y: auto;
`;

const RightSide = styled.div`
  align-items: center;
  display: flex;

  p {
    color: #74767b;
    font-size: 12px !important;
    margin: 0 !important;
  }

  span {
    margin-left: 15px;
  }
`;
