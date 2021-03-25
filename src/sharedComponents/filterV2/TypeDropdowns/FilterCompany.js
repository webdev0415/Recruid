import React, { useEffect, useState } from "react";
import {
  SelectContainer,
  SaveButton,
  Label
} from "sharedComponents/filterV2/StyledFilterComponents";
import AttributeSelect from "sharedComponents/AttributeSelect";
import {
  TyperMenuContainer,
  TypeMenuContent
} from "sharedComponents/filterV2/StyledFilterComponents";
import notify from "notifications";

const FilterCompany = ({
  option,
  setOption,
  saveFilter,
  index,
  store,
  showSelect
}) => {
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
                value={value}
                placeholder="Select a company..."
                options={store.allMyCompanies}
                returnOption={selected => {
                  setValue(selected.name);
                  setOption({
                    ...option,
                    display_text: option.text_constructor(selected.name),
                    prop_value: selected.id
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

export default FilterCompany;
