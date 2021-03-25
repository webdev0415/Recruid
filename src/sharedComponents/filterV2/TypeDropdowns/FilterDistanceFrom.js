import React, { useEffect, useState, useRef } from "react";
import {
  SelectContainer,
  SaveButton,
  Label,
  TextInput,
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

const FilterDistanceFrom = ({
  option,
  setOption,
  saveFilter,
  index,
  showSelect,
}) => {
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const saveAttributeFilter = () => {
    if (!location || distance === "") {
      notify("danger", "Select an option to filter by");
    } else {
      saveFilter(option, index);
    }
  };

  useEffect(() => {
    if (!option.display_text) {
      setOption({
        ...option,
        display_text: option.text_constructor(distance, location),
      });
    }
  }, [option]);

  return (
    <>
      {showSelect && (
        <TyperMenuContainer>
          <TypeMenuContent>
            <Label>{option.keyword}</Label>
            <SelectContainer>
              <div className="leo-flex leo-align-end">
                <STNumberInput
                  value={distance}
                  type="number"
                  onChange={(e) => {
                    setDistance(e.target.value);
                    setOption({
                      ...option,
                      display_text: option.text_constructor(
                        e.target.value,
                        location
                      ),
                      prop_value: { location, distance: e.target.value },
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveAttributeFilter();
                    }
                  }}
                  placeholder="Distance in miles..."
                  min="0"
                  max="1000"
                />
                <Label>miles</Label>
              </div>
              <SecondLabel>of</SecondLabel>
              <LocationInput
                value={location}
                onSelect={(selected) => {
                  setLocation(selected);
                  setOption({
                    ...option,
                    display_text: option.text_constructor(distance, selected),
                    prop_value: { location: selected, distance },
                  });
                }}
              />
            </SelectContainer>
          </TypeMenuContent>
          <SaveButton onClick={saveAttributeFilter}>Save</SaveButton>
        </TyperMenuContainer>
      )}
    </>
  );
};

const LocationInput = ({ onSelect, value }) => {
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
                  {suggestions.map((suggestion, indx) => (
                    <li
                      {...getSuggestionItemProps(suggestion)}
                      key={`suggestion-${indx}`}
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

export default FilterDistanceFrom;

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

const SecondLabel = styled(Label)`
  display: block;
`;

const STNumberInput = styled(TextInput)`
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  height: 36px;
  padding-left: 15px;
  width: 100%;
  margin-bottom: 10px;
  margin-right: 5px;
`;
