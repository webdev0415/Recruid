import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useDropdown from "hooks/useDropdown";

const AttributeSelect = ({
  placeholder,
  options,
  value,
  returnOption,
  searchOptions,
}) => {
  const [val, setVal] = useState(value || "");
  const [suggestions, setSuggestions] = useState(false);
  const {
    node,
    showSelect: showSuggestions,
    setShowSelect: setShowSuggestions,
  } = useDropdown();

  useEffect(() => {
    if (options && val.length > 0) {
      let newSuggestions = options.filter((opt) => {
        if (opt.option_group) {
          if (opt.group_labels) {
            let match = false;
            opt.group_labels.map((label) =>
              label.toLowerCase().includes(val.toLowerCase())
                ? (match = true)
                : null
            );
            return match;
          } else {
            return true;
          }
        } else if (opt.name.toLowerCase().includes(val.toLowerCase())) {
          return true;
        } else {
          return false;
        }
      });
      setSuggestions(newSuggestions);
    } else if (options) {
      setSuggestions(options);
    }
  }, [options, val]);

  return (
    <SelectContainer ref={node}>
      <InputWrapper className="leo-flex-center-between">
        {searchOptions ? (
          <SelectInput
            value={val}
            placeholder={placeholder}
            onChange={(e) => {
              setVal(e.target.value);
              if (e.target.value !== "" && !showSuggestions) {
                setShowSuggestions(true);
              } else if (e.target.value === "" && showSuggestions) {
                setShowSuggestions(false);
              }
            }}
          />
        ) : (
          <DropButton
            onClick={() => {
              setShowSuggestions(!showSuggestions);
              if (!showSuggestions && val !== "") {
                setVal("");
              }
            }}
          >
            {value ? <>{value}</> : <span>{placeholder}</span>}
          </DropButton>
        )}

        <ChevronButton
          onClick={() => {
            setShowSuggestions(!showSuggestions);
            if (!showSuggestions && val !== "") {
              setVal("");
            }
          }}
        >
          <svg width="8" height="5" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.414 0h5.172a1 1 0 01.707 1.707L4.707 4.293a1 1 0 01-1.414 0L.707 1.707A1 1 0 011.414 0z"
              fill="#9A9CA1"
              fill-role="evenodd"
            />
          </svg>
        </ChevronButton>
      </InputWrapper>
      {showSuggestions && (
        <SubMenu>
          <ul>
            {suggestions &&
              suggestions.map((suggestion, index) => (
                <React.Fragment key={`option-${index}`}>
                  {suggestion.option_group ? (
                    <li className="group-option">
                      <span>{suggestion.name}</span>
                    </li>
                  ) : (
                    <li
                      key={`option-${index}`}
                      onClick={() => {
                        returnOption(suggestion);
                        setVal(suggestion.name);
                        setShowSuggestions(false);
                      }}
                    >
                      <span>{suggestion.name}</span>
                    </li>
                  )}
                </React.Fragment>
              ))}
            {suggestions.length === 0 && (
              <li>
                <span>No matches</span>
              </li>
            )}
          </ul>
        </SubMenu>
      )}
    </SelectContainer>
  );
};

export default AttributeSelect;

const SelectContainer = styled.div`
  position: relative;
`;

const SelectInput = styled.input`
  background: none;
  border: none;
  height: 100%;
  padding-left: 15px;
  width: 200px;
`;

const SubMenu = styled.div`
  background: #ffffff;
  border: 1px solid #d4dfea;
  border-radius: 4px;
  box-shadow: 0px 1px 6px rgba(116, 118, 123, 0.17);
  max-height: 250px;
  overflow: auto;
  position: absolute;
  top: 45px;
  width: 190px;
  z-index: 1;

  ul {
    list-style: none;
    margin: 0;
    margin-left: -1px;
    margin-right: -1px;
    padding: 7px 0;

    li {
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      padding: 8px 20px;

      &:hover {
        background: #1f3653 !important;
        color: #fff;
      }

      &.group-option {
        font-size: 10px;
        background: #f1f1f1 !important;

        &:hover {
          color: black;
          background: #f1f1f1 !important;
        }
      }
    }
  }
`;

const ChevronButton = styled.button`
  height: 36px;
  margin-top: -1px;
  width: 40px;
`;

const InputWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  height: 36px;
`;

const DropButton = styled.button`
  width: 100%;
  height: 100%;
  text-align: inherit;
  padding-left: 10px;
  max-width: 210px;
  overflow: hidden;

  span {
    color: grey;
  }
`;
