import React, { useState } from "react";
import styled from "styled-components";
import { COLORS } from "constants/style";
import VariableDropdown from "sharedComponents/TemplateEditor/VariableDropdown";
import notify from "notifications";
// import { PROTO_VARIABLES } from "sharedComponents/TemplateEditor/PossibleVariables";
import { careersSiteBaseUrl } from "constants/api";
import useDropdown from "hooks/useDropdown";

const VariableSelector = ({ addVariable, source, type, createLink, store }) => {
  const { node, showSelect, setShowSelect } = useDropdown();

  const insertVariable = (option) => {
    if (!option) {
      notify("danger", "You must select an option first.");
    } else {
      if (option.special_case) {
        if (option.source === "JobPost" && option.prop_value === "slugified") {
          createLink({
            text: "View Job",
            // text: "Job : Job Title",
            href: `${careersSiteBaseUrl(store.company.mention_tag)}{{${
              option.source
            }.${option.prop_value}}}`,
            // second_variable: `{{${option.source}.${PROTO_VARIABLES.job_title.prop_value}}}`,
            ...option,
          });
        }
      } else {
        addVariable(` {{${option.source}.${option.prop_value}}} `, option);
      }
      setShowSelect(undefined);
    }
  };
  return (
    <div ref={node} className="leo-relative">
      <SelectButton
        onClick={() => setShowSelect(!showSelect)}
        className="leo-flex-center-end"
      >
        <div className="leo-flex-center-between leo-pointer">
          Personalise
          <span>
            <i className="fas fa-caret-down"></i>
          </span>
        </div>
      </SelectButton>
      {showSelect && (
        <PersonaliseMenu
          setShowSelect={setShowSelect}
          insertVariable={insertVariable}
          source={source}
          type={type}
          store={store}
        />
      )}
    </div>
  );
};

export default VariableSelector;

const PersonaliseMenu = ({
  setShowSelect,
  insertVariable,
  source,
  type,
  store,
}) => {
  const [selectedOption, setSelectedOption] = useState(undefined);
  return (
    <Menu>
      <h3>Personalise</h3>
      <p>What do you want to add?</p>
      <VariableDropdown
        selected={selectedOption}
        onSelect={(option) => setSelectedOption(option)}
        source={source}
        type={type}
        store={store}
      />
      {/*selectedOption && (
        <>
          <p>Default Value</p>
          <DefaultInput
            value={selectedOption.default_value}
            readOnly
            onChange={(e) =>
              setSelectedOption({
                ...selectedOption,
                default_value: e.target.value,
              })
            }
          />
        </>
      )*/}
      <div className="buttons-container">
        <button
          type="button"
          className="button button--default button--primary"
          onClick={() => insertVariable(selectedOption)}
        >
          Insert
        </button>
        <button
          type="button"
          className="button button--default button--grey"
          onClick={() => setShowSelect(undefined)}
        >
          Cancel
        </button>
      </div>
    </Menu>
  );
};

const SelectButton = styled.button`
  color: ${COLORS.dark_4};
  font-weight: 500;
  font-size: 12px;

  div {
    padding: 0;
    width: 100%;

    span {
      margin-left: 15px;
    }
  }
`;

const Menu = styled.div`
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  bottom: 30px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  left: -10px;
  min-width: 350px;
  position: absolute;
  padding: 20px;
  z-index: 1;

  h3 {
    font-size: 18px;
    font-weight: 500;
  }

  p {
    color: ${COLORS.dark_4};
    font-weight: normal;
    font-size: 14px;
    margin-bottom: 15px;
    margin-top: 15px;
  }

  .buttons-container {
    padding: 0 !important;
    margin-top: 20px;

    button:first-of-type {
      margin-right: 10px;
    }
  }
`;
