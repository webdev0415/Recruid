import React, { useEffect, useState } from "react";
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

const FilterInput = ({ option, setOption, saveFilter, index, showSelect }) => {
  const [value, setValue] = useState("");
  const saveTextFilter = () => {
    if (!option.prop_value) {
      notify("danger", "Filter must have a value");
    } else {
      saveFilter(option, index);
    }
  };

  useEffect(() => {
    if (!option.display_text) {
      setOption({ ...option, display_text: option.text_constructor("") });
    }
     
  }, [option]);

  return (
    <>
      {showSelect && (
        <TyperMenuContainer>
          <TypeMenuContent>
            <Label>{option.keyword}</Label>
            <TextInput
              autoFocus
              value={value || ""}
              onChange={(e) => {
                setValue(e.target.value);
                setOption({
                  ...option,
                  display_text: option.text_constructor(e.target.value),
                  prop_value: e.target.value,
                });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveTextFilter();
                }
              }}
              placeholder="Type here..."
            />
          </TypeMenuContent>
          <SaveButton onClick={saveTextFilter}>Save</SaveButton>
        </TyperMenuContainer>
      )}
    </>
  );
};

export default FilterInput;
