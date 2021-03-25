import React from "react";
import { QuestionTooltipSvg } from "assets/svg/icons";
import useDropdown from "hooks/useDropdown";
import styled from "styled-components";

export const QuestionTooltip = ({ questionNote }) => {
  const { showSelect, setShowSelect } = useDropdown();

  const handleShowChange = (newState) => () => setShowSelect(newState);

  return (
    <QuestionTooltipSC
      onMouseOverCapture={handleShowChange(true)}
      onMouseOutCapture={handleShowChange(false)}
      className="leo-relative leo-pointer"
    >
      <QuestionTooltipSvg />
      {showSelect && <div className="note-content">{questionNote}</div>}
    </QuestionTooltipSC>
  );
};

const QuestionTooltipSC = styled.div`
  padding: 0;

  .note-content {
    width: 400px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    position: absolute;
    bottom: 100%;
    right: 100%;
    padding: 20px;
    background: #eee;
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.02em;
    color: #2a3744;
  }
`;
