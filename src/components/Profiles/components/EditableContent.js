import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Select from "react-select";
import PlacesAutocomplete from "react-places-autocomplete";

import sharedHelpers from "helpers/sharedHelpers";
import { StyledDatePicker } from "components/Profiles/components/ProfileComponents.js";
import AttributeSelect from "sharedComponents/AttributeSelect";

const StyledInput = styled.input`
  border-radius: 4px !important;
  font-size: 14px !important;
  height: 30px !important;
  margin-bottom: 12px !important;
  min-width: 200px !important;
  padding-left: 10px !important;

  &.header-name {
    margin-bottom: 0 !important;
    width: 200px;
  }
`;

const StyledTextArea = styled.textarea`
  /* margin-bottom: 0px !important; */
`;

const EditableContent = ({
  value,
  type,
  editing,
  onChange,
  children,
  teamMembers,
  industries,
  headerName,
  options,
  placeholder,
}) => {
  const [industryValue, setIndustryValue] = useState(undefined);
  const [locationValue, setLocationValue] = useState(undefined);

  const onSelectIndustry = (option) => {
    if (!option) return;
    onChange(option.label);
    setIndustryValue(option);
  };

  const onSelectLocation = (value) => {
    onChange(value);
    setLocationValue(value);
  };

  useEffect(() => {
    if (value && type === "industry" && !industryValue) {
      setIndustryValue({ label: value, value: value });
    }
  }, [value, type, industryValue]);

  useEffect(() => {
    if (value && type === "location" && locationValue === undefined) {
      setLocationValue(value);
    }
  }, [value, type, locationValue]);

  return (
    <>
      {!editing && <>{children}</>}
      {editing && type === "text" && (
        <StyledInput
          value={value ?? ""}
          className={`form-control ${headerName ? "header-name" : ""}`}
          onChange={onChange}
          type="text"
        />
      )}
      {editing && type === "number" && (
        <StyledInput
          value={value ?? 0}
          className="form-control"
          onChange={onChange}
          type="number"
        />
      )}
      {editing && type === "members" && (
        <select
          name="deal owner"
          className="form-control form-control-select"
          value={value}
          onChange={onChange}
        >
          <option value="" disabled hidden>
            Please select a team member
          </option>
          {teamMembers &&
            teamMembers.length > 0 &&
            teamMembers.map((member, index) => (
              <option key={`member-${index}`} value={index}>
                {member.name}
              </option>
            ))}
        </select>
      )}
      {editing && type === "date" && (
        <StyledDatePicker
          selected={new Date(value)}
          onChange={onChange}
          className="form-control profile"
          calendarClassName="picker-left"
        />
      )}
      {editing && type === "textarea" && (
        <StyledTextArea
          value={value}
          className="form-control"
          onChange={onChange}
        />
      )}
      {editing && type === "industry" && (
        <Select
          name="industries"
          placeholder="Industries"
          value={industryValue}
          options={sharedHelpers.extractOptions(industries)}
          onChange={onSelectIndustry}
        />
      )}
      {editing && type === "location" && (
        <div className="leo-relative">
          <PlacesAutocomplete
            value={locationValue || ""}
            onChange={(e) => setLocationValue(e)}
            onSelect={onSelectLocation}
            // searchOptions={{
            //   types: ["(cities)"],
            // }}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: "Location",
                    className: "location-search-input form-control",
                  })}
                />
                <div
                  className="autocomplete-dropdown-container"
                  style={{ left: "5px", minWidth: "190px" }}
                >
                  {suggestions.map((suggestion, index) => {
                    const className = suggestion.active
                      ? "suggestion-item--active"
                      : "suggestion-item";
                    const style = suggestion.active
                      ? {
                          backgroundColor: "#fafafa",
                          cursor: "pointer",
                        }
                      : {
                          backgroundColor: "#ffffff",
                          cursor: "pointer",
                        };
                    return (
                      <div
                        key={`suggestion-prop-${index}`}
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
      )}
      {editing && type === "select" && (
        <AttributeSelect
          value={value ? `${value[0].toUpperCase()}${value.slice(1)}` : ""}
          placeholder={placeholder}
          options={options}
          returnOption={(selected) => onChange(selected)}
        />
      )}
    </>
  );
};

export default EditableContent;
