import React, { useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";
import { stageTitles } from "constants/stageOptions";
const itemStyling = {
  borderBottom: "1px solid #eee",
  cursor: "pointer",
  height: "100%",
  padding: "9px 15px",
  width: "100%",
};
const stageNames = {
  applied: stageTitles.applied,
  shortlisted: stageTitles.shortlisted,
  submitted_to_hiring_manager: stageTitles.submitted_to_hiring_manager,
  assessment_stage: stageTitles.assessment_stage,
  interviewing: (interviewStages, selectStage) => {
    return interviewStages.map((stage, index) => (
      <DropdownItem
        style={itemStyling}
        onClick={() => selectStage(stage.static_name)}
        key={`interview-stage-${index}`}
      >
        {stage.name}
      </DropdownItem>
    ));
  },
  interviewing_client: `"Client Stages"`,
  offer_pending: stageTitles.offer_pending,
  offered: stageTitles.offered,
  onboarding: stageTitles.onboarding,
  hired: stageTitles.hired,
};

const AtStageSelector = ({ styles, stage, selectStage }) => {
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

  return (
    <Dropdown className="leo-relative">
      <Dropdown.Toggle as="button">
        <div className={styles.dropdown}>
          {stageNames[stage]
            ? stageNames[stage]
            : findInterviewStageTitle(stage)}
          <span>
            <li className="fas fa-caret-down" />
          </span>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu
        as="div"
        className="dropdown-new dropdown-menu"
        style={{ width: "190px" }}
      >
        {stageNames &&
          Object.keys(stageNames).map((key, index) => {
            if (
              store.company.type === "Employer" &&
              key === "interviewing_client"
            ) {
              return null;
            }
            if (typeof stageNames[key] === "string") {
              return (
                <DropdownItem
                  style={itemStyling}
                  onClick={() => selectStage(key)}
                  key={`stage-${index}`}
                >
                  {stageNames[key]}
                </DropdownItem>
              );
            } else if (store.interviewStages) {
              return stageNames[key](store.interviewStages, selectStage);
            }
            return "";
          })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const DropdownItem = styled(Dropdown.Item)`
  padding: 0;

  &:active {
    background: none;
    color: initial;
  }
`;

export default AtStageSelector;
