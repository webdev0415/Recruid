import React from "react";
import sharedStyles from "assets/stylesheets/scss/collated/filter.module.scss";
import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";

export default function InputComponent({
  options,
  placeholder,
  onSelect,
  showSelection,
  style,
  className,
}) {
  return (
    <Dropdown className="relative">
      <Dropdown.Toggle
        as="button"
        style={style && style}
        className={(style ? "" : sharedStyles.filterSelector) + className}
      >
        <div
          className={sharedStyles.filterSelectorInput}
          style={{
            color: showSelection ? "#3f3f3f" : null,
            padding: style && 0,
          }}
        >
          {placeholder}
          <span style={{ marginLeft: "10px" }}>
            <li className="fas fa-caret-down" />
          </span>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu
        as="div"
        className="dropdown-new dropdown-menu"
        style={{
          minWidth: "190px",
          maxHeight: "350px",
          overflowY: "auto",
        }}
      >
        <div>
          {options.map((option, index) => {
            return (
              <DropdownItem
                className="dropdown-new-option"
                key={`${placeholder}_${index}`}
                onClick={() => {
                  onSelect(options[index]);
                }}
              >
                <button className="dropdown-new-link">{option.label}</button>
              </DropdownItem>
            );
          })}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

const DropdownItem = styled(Dropdown.Item)`
  padding: 0;
`;
