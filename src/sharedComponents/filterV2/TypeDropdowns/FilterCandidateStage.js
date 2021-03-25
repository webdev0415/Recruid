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

import { stageOptions } from "sharedComponents/filterV2/staticOptions";

const FilterCandidateStage = ({
  option,
  setOption,
  saveFilter,
  index,
  store,
  showSelect,
}) => {
  const [value, setValue] = useState(undefined);
  const [options, setOptions] = useState(stageOptions);
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

  useEffect(() => {
    if (store.interviewStages && store.interviewStages.length > 0) {
      setOptions([
        ...stageOptions.slice(0, 4),
        ...store.interviewStages.map((stage) => {
          return { name: stage.name, value: stage.static_name };
        }),
        ...stageOptions.slice(4),
      ]);
    }
  }, [store.interviewStages]);

  return (
    <>
      {showSelect && (
        <TyperMenuContainer>
          <TypeMenuContent>
            <Label>{option.keyword}</Label>
            <SelectContainer>
              <AttributeSelect
                value={value}
                placeholder="Select an option..."
                options={options}
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

export default FilterCandidateStage;
