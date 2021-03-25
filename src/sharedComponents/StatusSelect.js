import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";
import { COLORS } from "constants/style";

const StatusSelect = ({
  selectedStatus,
  statusOptions,
  onStatusSelect,
  disabled,
}) => {
  // if (!selectedStatus || !statusOptions) {
  //   return null;
  // }
  return (
    <Dropdown>
      <Dropdown.Toggle
        as={DropButton}
        background={statusOptions[selectedStatus]?.background}
        disabled={disabled}
      >
        {statusOptions[selectedStatus]?.title || "No Status Set"}
        {!disabled && (
          <span>
            <li className="fas fa-caret-down" />
          </span>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {Object.values(statusOptions).map((option, index) => {
          if (option && !option.hidden) {
            return (
              <DropdownOption
                key={`status-drop-option-${index}`}
                onClick={() => onStatusSelect(option.prop)}
              >
                {option.option_title || option.title}
                {option.text && <span>{option.text}</span>}
              </DropdownOption>
            );
          } else {
            return null;
          }
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const DropdownOption = styled(Dropdown.Item)`
  min-width: 180px;
  width: 100%;
  clear: both;
  white-space: nowrap;
  border: 0;
  color: ${COLORS.dark_1};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 15px;
  text-align: left;
  width: 100%;

  &:active {
    background: initial;
    color: initial;
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${COLORS.grey};
  }

  span {
    font-size: 11px;
    font-weight: 400;
    opacity: 0.6;
  }
`;

const DropButton = styled.button.attrs((props) => ({
  className: (props.className || "") +" leo-flex-center-between",
}))`
  width: 100%;
  border-radius: 13px;
  font-weight: 500;
  font-size: 12px;
  background: ${(props) =>
    COLORS[props.background] || props.background || "#9a9ca1"};
  padding: 2px 15px !important;
  color: ${COLORS.white};
  min-width: 100px;
  max-width: 150px;

  &:disabled {
    justify-content: center;
  }

  span {
    margin-left: 10px;
    position: relative;
    top: -1px;
  }
`;

export default StatusSelect;
