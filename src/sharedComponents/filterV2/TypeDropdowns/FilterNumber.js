import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  TextInput,
  SaveButton,
  Label,
} from "sharedComponents/filterV2/StyledFilterComponents";
import {
  TyperMenuContainer,
  TypeMenuContent,
} from "sharedComponents/filterV2/StyledFilterComponents";
import notify from "notifications";

const FilterNumber = ({ option, setOption, saveFilter, index, showSelect }) => {
  const [value, setValue] = useState("");
  const [modifier, setModifier] = useState("exactly");
  const saveAttributeFilter = () => {
    if (!option.prop_value) {
      notify("danger", "Select an option to filter by");
    } else {
      saveFilter(option, index);
    }
  };

  useEffect(() => {
    if (showSelect && !option.prop_value) {
      setOption({
        ...option,
        prop_value: option.prop_value
          ? { ...option.prop_value, modifier: modifier }
          : { modifier: modifier },
      });
    }
     
  }, [option]);

  useEffect(() => {
    if (!option.display_text) {
      setOption({
        ...option,
        display_text: option.text_constructor(modifier, ""),
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
                id="num-exactly"
                name="numeric-modifier"
                value={option.prop_value?.modifier}
                checked={option.prop_value?.modifier === "exactly"}
                onChange={() => {
                  setModifier("exactly");
                  setOption({
                    ...option,
                    display_text: option.text_constructor("exactly", value),
                    prop_value: option.prop_value
                      ? { ...option.prop_value, modifier: "exactly" }
                      : { modifier: "exactly" },
                  });
                }}
              />

              <label htmlFor="num-exactly">exactly</label>
            </OptionWrapper>
            <OptionWrapper>
              <input
                type="radio"
                id="name-up-to"
                name="numeric-modifier"
                value={option.prop_value?.modifier}
                checked={option.prop_value?.modifier === "up to"}
                onChange={() => {
                  setModifier("up to");
                  setOption({
                    ...option,
                    display_text: option.text_constructor("up to", value),
                    prop_value: option.prop_value
                      ? { ...option.prop_value, modifier: "up to" }
                      : { modifier: "up to" },
                  });
                }}
              />

              <label htmlFor="name-up-to">up to</label>
            </OptionWrapper>
            <OptionWrapper>
              <input
                type="radio"
                id="num-at-least"
                name="numeric-modifier"
                value={option.prop_value?.modifier}
                checked={option.prop_value?.modifier === "at least"}
                onChange={() => {
                  setModifier("at least");
                  setOption({
                    ...option,
                    display_text: option.text_constructor("at least", value),
                    prop_value: option.prop_value
                      ? { ...option.prop_value, modifier: "at least" }
                      : { modifier: "at least" },
                  });
                }}
              />

              <label htmlFor="num-at-least">at least</label>
            </OptionWrapper>
            <TextInput
              value={value}
              type="number"
              onChange={(e) => {
                setValue(e.target.value);
                setOption({
                  ...option,
                  display_text: option.text_constructor(
                    modifier,
                    e.target.value
                  ),
                  prop_value: option.prop_value
                    ? { ...option.prop_value, number: e.target.value }
                    : { number: e.target.value },
                });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveAttributeFilter();
                }
              }}
              placeholder="Type here..."
            />
          </TypeMenuContent>
          <SaveButton onClick={saveAttributeFilter}>Save</SaveButton>
        </TyperMenuContainer>
      )}
    </>
  );
};

export default FilterNumber;

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
