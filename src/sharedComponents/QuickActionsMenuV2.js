import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";

const QuickActionsMenuV2 = ({ children, disabled }) => {
  return (
    <Dropdown>
      {disabled ? (
        <ToggleButton disabled={true} className={disabled ? "disabled" : ""}>
          Quick Actions <li className="fas fa-caret-down" />
        </ToggleButton>
      ) : (
        <Dropdown.Toggle as={ToggleButton} type="button" disabled={disabled}>
          Quick Actions <li className="fas fa-caret-down" />
        </Dropdown.Toggle>
      )}

      <Dropdown.Menu as={DropMenu}>{children}</Dropdown.Menu>
    </Dropdown>
  );
};

export const QuickActionsOption = ({ onClick, children, divider }) => {
  return (
    <Dropdown.Item
      as={DropOption}
      onClick={onClick}
      className={`${divider ? "divider" : ""}`}
    >
      {children}
    </Dropdown.Item>
  );
};

export default QuickActionsMenuV2;

const ToggleButton = styled.div`
  background: #ffffff;
  border: 1px solid #2a3744;
  border-radius: 4px;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  color: #2a3744;
  padding: 10px;

  &.disabled {
    opacity: 0.2;
  }

  li {
    position: initial !important;
    display: inline !important;
    color: #2a3744 !important;
  }
`;

const DropMenu = styled.div`
  background: #ffffff;
  border: 1px solid #2a3744;
  box-sizing: border-box;
  border-radius: 4px;
  top: 5px !important;
`;

const DropOption = styled.button`
  padding: 10px 15px;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #2a3744;

  &:active,
  &:hover {
    background-color: #f6f6f6;
    color: #2a3744;
  }

  &.divider {
    border-top: 1px solid #eeeeee;
  }
`;
