import React, { useEffect } from "react";
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

const FilterAttribute = ({
  option,
  setOption,
  saveFilter,
  index,
  store,
  showSelect,
}) => {
  const saveAttributeFilter = () => {
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
                searchOptions={true}
                placeholder="Select an option..."
                options={store[option.master_type]}
                returnOption={(selected) =>
                  setOption({
                    ...option,
                    display_text: option.text_constructor(selected.name),
                    prop_value: selected.id,
                  })
                }
              />
            </SelectContainer>
          </TypeMenuContent>
          <SaveButton onClick={saveAttributeFilter}>Save</SaveButton>
        </TyperMenuContainer>
      )}
    </>
  );
};

export default FilterAttribute;
