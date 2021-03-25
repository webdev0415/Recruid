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
  const [dateText, setDateText] = useState("");

  const saveAttributeFilter = () => {
    if (!option.prop_value) {
      notify("danger", "Select an option to filter by");
    } else {
      saveFilter(option, index);
    }
  };

  useEffect(() => {
    if (showSelect && !option.prop_value) {
      setDateText(spacetime.now().format("{date} {month}, {year}"));
      setOption({
        ...option,
        keyword: "after",
        prop_value: {
          date: new Date(spacetime.now().epoch),
          modifier: "after",
        },
      });
    }
  }, [option]);

  useEffect(() => {
    if (!option.display_text) {
      setOption({
        ...option,
        display_text: option.text_constructor(
          "after",
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
            <OptionWrapper>
              <input
                type="radio"
                id="date-after"
                name="date-modifier"
                value={option.prop_value?.modifier}
                checked={option.prop_value?.modifier === "after"}
                onChange={() => {
                  setOption({
                    ...option,
                    keyword: "after",
                    prop_value: option.prop_value
                      ? { ...option.prop_value, modifier: "after" }
                      : { modifier: "after" },
                    display_text: option.text_constructor(
                      "after",
                      spacetime(dateText).format("{date} {month}, {year}")
                    ),
                  });
                }}
              />

              <label htmlFor="date-after">After</label>
            </OptionWrapper>
            <OptionWrapper>
              <input
                type="radio"
                id="date-on"
                name="date-modifier"
                value={option.prop_value?.modifier}
                checked={option.prop_value?.modifier === "on"}
                onChange={() => {
                  setOption({
                    ...option,
                    keyword: "on",
                    prop_value: option.prop_value
                      ? { ...option.prop_value, modifier: "on" }
                      : { modifier: "on" },
                    display_text: option.text_constructor(
                      "on",
                      spacetime(dateText).format("{date} {month}, {year}")
                    ),
                  });
                }}
              />

              <label htmlFor="date-after">On</label>
            </OptionWrapper>
            <OptionWrapper>
              <input
                type="radio"
                id="date-before"
                name="date-modifier"
                value={option.prop_value?.modifier}
                checked={option.prop_value?.modifier === "before"}
                onChange={() => {
                  setOption({
                    ...option,
                    keyword: "before",
                    prop_value: option.prop_value
                      ? { ...option.prop_value, modifier: "before" }
                      : { modifier: "before" },
                    display_text: option.text_constructor(
                      "before",
                      spacetime(dateText).format("{date} {month}, {year}")
                    ),
                  });
                }}
              />

              <label htmlFor="date-before">Before</label>
            </OptionWrapper>
            <DatePickerWrapper>
              <DatePicker
                startDate={new Date(selectedDate.epoch)}
                selected={new Date(selectedDate.epoch)}
                onChange={(date) => {
                  setSelectedDate(spacetime(date));
                  setDateText(spacetime(date).format("{date} {month}, {year}"));
                  setOption({
                    ...option,
                    display_text: option.text_constructor(
                      option.keyword,
                      spacetime(date).format("{date} {month}, {year}")
                    ),
                    prop_value: option.prop_value
                      ? { ...option.prop_value, date }
                      : { date },
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
