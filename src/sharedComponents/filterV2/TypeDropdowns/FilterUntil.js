import React, { useState, useEffect } from "react";
import spacetime from "spacetime";
import styled from "styled-components";
import {
  SaveButton,
  Label,
} from "sharedComponents/filterV2/StyledFilterComponents";
import {
  TyperMenuContainer,
  TypeMenuContent,
} from "sharedComponents/filterV2/StyledFilterComponents";
import DatePicker from "react-datepicker";
import notify from "notifications";
import "components/Calendar/styles/datepciker.scss";

const FilterDate = ({ option, setOption, saveFilter, index, showSelect }) => {
  const [selectedDate, setSelectedDate] = useState(spacetime.now());

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
        prop_value: {
          date: new Date(spacetime.now().epoch),
          modifier: "up to",
        },
      });
    }
     
  }, [option]);

  useEffect(() => {
    if (!option.display_text) {
      setOption({
        ...option,
        display_text: option.text_constructor(
          spacetime.now().format("{date} {month}, {year}")
        ),
      });
    }
     
  }, [option]);

  return (
    <>
      {showSelect && (
        <TyperMenuContainer>
          <TypeMenuContent>
            <Label>{option.keyword}</Label>
            <DatePickerWrapper>
              <DatePicker
                startDate={new Date(selectedDate.epoch)}
                selected={new Date(selectedDate.epoch)}
                onChange={(date) => {
                  setSelectedDate(spacetime(date));
                  setOption({
                    ...option,
                    display_text: option.text_constructor(
                      spacetime(date).format("{date} {month}, {year}")
                    ),
                    prop_value: { date, modifier: "up to" },
                  });
                }}
              />
            </DatePickerWrapper>
          </TypeMenuContent>
          <SaveButton onClick={saveAttributeFilter}>Save</SaveButton>
        </TyperMenuContainer>
      )}
    </>
  );
};

export default FilterDate;

const DatePickerWrapper = styled.div`
  input {
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    font-size: 14px;
    padding: 5px;
  }

  .react-datepicker {
    left: 0px;
    top: 10px;
  }
`;
