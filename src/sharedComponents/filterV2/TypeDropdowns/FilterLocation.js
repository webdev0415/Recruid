import React, { useEffect, useState, useRef } from "react";
import {
  SelectContainer,
  SaveButton,
  Label,
} from "sharedComponents/filterV2/StyledFilterComponents";
import styled from "styled-components";
import { TagsSubMenu } from "sharedComponents/TagsComponent/StyleTagsComponent";
import PlacesAutocomplete from "react-places-autocomplete";
import {
  TyperMenuContainer,
  TypeMenuContent,
} from "sharedComponents/filterV2/StyledFilterComponents";
import notify from "notifications";

// const searchOptions = { types: ["(cities)"] };

const FilterLocation = ({
  option,
  setOption,
  saveFilter,
  index,
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
              <LocationInput
                value={option.prop_value}
                onSelect={(selected) =>
                  setOption({
                    ...option,
                    display_text: option.text_constructor(selected),
                    prop_value: selected,
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

export const LocationInput = ({ onSelect, value }) => {
  const [val, setVal] = useState(value || "");
  const [showSelect, setShowSelect] = useState(false);
  const node = useRef();
  const inputRef = useRef();

  const handleClick = (e) => {
    if (!node?.current?.contains(e.target)) {
      if (inputRef?.current?.value === "") {
        setShowSelect(false);
      }
      return;
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const upperCaseValue = (value) => {
    let formattedName = value.split(" ");
    formattedName = formattedName.map((word) => {
      return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;
    });
    formattedName = formattedName.join(" ");
    onSelect({ name: formattedName });
    return;
  };

  return (
    <Container ref={node}>
      <PlacesAutocomplete
        value={val}
        onChange={setVal}
        onSelect={(value) => {
          setVal(value);
          onSelect(value);
          setShowSelect(false);
        }}
        // searchOptions={searchOptions}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <>
            <Input
              ref={inputRef}
              value={val}
              autoFocus={true}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  upperCaseValue(e.target.value);
                } else {
                  setShowSelect(true);
                }
              }}
              {...getInputProps({
                placeholder: "Location...",
              })}
            />
            {val?.length > 0 && suggestions.length > 0 && showSelect && (
              <TagsSubMenu>
                <ul>
                  {suggestions.map((suggestion, index) => (
                    <li
                      {...getSuggestionItemProps(suggestion)}
                      key={`location-suggestion-${index}`}
                    >
                      <span>{suggestion.description}</span>
                    </li>
                  ))}
                </ul>
              </TagsSubMenu>
            )}
            {val?.length > 0 && suggestions.length === 0 && showSelect && (
              <TagsSubMenu>
                <ul>
                  <li>
                    <span>No matches</span>
                  </li>
                </ul>
              </TagsSubMenu>
            )}
          </>
        )}
      </PlacesAutocomplete>
    </Container>
  );
};

export default FilterLocation;

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  height: 36px;
  padding-left: 15px;
  width: 100%;
`;
