import React, { useEffect, useState } from "react";
import {
  SelectContainer,
  SaveButton,
  Label,
} from "sharedComponents/filterV2/StyledFilterComponents";
import AttributeSelect from "sharedComponents/AttributeSelect";
import {
  TyperMenuContainer,
  TypeMenuContent,
} from "sharedComponents/filterV2/StyledFilterComponents";
import notify from "notifications";

const FilterGender = ({ option, setOption, saveFilter, index, showSelect }) => {
  const [value, setValue] = useState(undefined);
  const saveValueFilter = () => {
    if (!option.prop_value) {
      notify("danger", "Select an option to filter by");
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
            <SelectContainer>
              <AttributeSelect
                value={
                  value
                    ? value[0].toUpperCase() + value.substring(1)
                    : undefined
                }
                placeholder="Select a qualification..."
                options={qualificationOptions}
                returnOption={(selected) => {
                  setValue(selected.name);
                  setOption({
                    ...option,
                    display_text: option.text_constructor(selected.name),
                    prop_value: selected.value,
                  });
                }}
              />
            </SelectContainer>
          </TypeMenuContent>
          <SaveButton onClick={saveValueFilter}>Save</SaveButton>
        </TyperMenuContainer>
      )}
    </>
  );
};
const qualificationOptions = [
  // { name: "Female", value: "female" },
  // { name: "Male", value: "male" },
  // { name: "Other", value: "other" },
  // { name: "Prefer not say", value: "prefer not say" },
  // { name: "Not defined", value: "not defined" },
];

export default FilterGender;
