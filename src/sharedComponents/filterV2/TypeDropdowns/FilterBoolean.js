import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  SaveButton,
  Label,
} from "sharedComponents/filterV2/StyledFilterComponents";
import {
  TyperMenuContainer,
  TypeMenuContent,
} from "sharedComponents/filterV2/StyledFilterComponents";
import notify from "notifications";

const FilterDate = ({ option, setOption, saveFilter, index, showSelect }) => {
  const [bool, setBool] = useState(true);
  const saveAttributeFilter = () => {
    if (option.prop_value === undefined) {
      notify("danger", "Select an option to filter by");
    } else {
      saveFilter(option, index);
    }
  };

  useEffect(() => {
    if (showSelect && option.prop_value === undefined) {
      setOption({
        ...option,
        prop_value: true,
      });
    }
  }, [option]);

  useEffect(() => {
    if (!option.display_text) {
      setOption({
        ...option,
        display_text: option.text_constructor(),
        prop_value: option.prop_value !== undefined ? option.prop_value : true,
      });
    }
  }, [option]);

  return (
    <>
      {showSelect && (
        <TyperMenuContainer>
          <TypeMenuContent>
            <Label>{option.keyword}</Label>
            <OptionWrapper>
              <input
                type="radio"
                id="true-option"
                name="boolean-option"
                value={bool}
                checked={bool}
                onChange={() => {
                  setBool(true);
                  setOption({
                    ...option,
                    prop_value: true,
                    display_text: option.text_constructor(true),
                  });
                }}
              />
              <label htmlFor="true-option">Yes</label>
            </OptionWrapper>
            <OptionWrapper>
              <input
                type="radio"
                id="false-option"
                name="boolean-option"
                value={bool}
                checked={!bool}
                onChange={() => {
                  setBool(false);
                  setOption({
                    ...option,
                    prop_value: false,
                    display_text: option.text_constructor(false),
                  });
                }}
              />

              <label htmlFor="false-option">No</label>
            </OptionWrapper>
          </TypeMenuContent>
          <SaveButton onClick={saveAttributeFilter}>Save</SaveButton>
        </TyperMenuContainer>
      )}
    </>
  );
};

export default FilterDate;

const OptionWrapper = styled.div`
  margin-bottom: 5px;

  &:last-of-type {
    margin-bottom: 12px;
  }

  label {
    font-size: 14px;
    margin-left: 8px;
  }
`;
