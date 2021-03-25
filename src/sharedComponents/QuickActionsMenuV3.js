import React, { useContext, createContext } from "react";
import styled from "styled-components";
import useDropdown from "hooks/useDropdown";

const DropdownContext = createContext();

const QuickActionsMenuV3 = ({ children, disabled, style }) => {
  const { node, showSelect, setShowSelect } = useDropdown();
  return (
    <DropdownContext.Provider value={{ setShowSelect }}>
      <Container ref={node} style={style}>
        <ToggleButton
          disabled={disabled}
          className={disabled ? "disabled" : ""}
          onClick={() => setShowSelect(!showSelect)}
        >
          Quick Actions <li className="fas fa-caret-up" />
        </ToggleButton>
        {showSelect && (
          <DropMenu className="leo-flex leo-align-start leo-absolute">
            {children}
          </DropMenu>
        )}
      </Container>
    </DropdownContext.Provider>
  );
};

export const QuickActionsOption = ({ onClick, children, divider }) => {
  const menuProps = useContext(DropdownContext);
  return (
    <DropOption
      onClick={() => {
        onClick();
        menuProps.setShowSelect(false);
      }}
      className={`${divider ? "divider" : ""}`}
    >
      {children}
    </DropOption>
  );
};

export default QuickActionsMenuV3;

const Container = styled.div`
  position: relative;
`;

const ToggleButton = styled.button`
  background: #ffffff;
  border-radius: 4px;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  color: #2a3744;
  padding: 11px 20px;

  &.disabled {
    opacity: 0.2;
  }

  li {
    position: initial !important;
    display: inline !important;
    color: #2a3744 !important;
    margin-left: 5px;
  }
`;

const DropMenu = styled.div`
  background: #ffffff;
  box-sizing: border-box;
  border-radius: 4px;
  bottom: 40px;
  width: max-content;
  flex-direction: column;
  right: 0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.47);
  min-width: 100%;
  overflow: hidden;
`;

const DropOption = styled.button`
  padding: 10px 15px;
  width: 100%;
  text-align: left;
  font-weight: 500;
  font-size: 11px;
  line-height: 13px;
  color: #74767b;

  &:active,
  &:hover {
    background-color: #f6f6f6;
    color: #2a3744;
  }

  &.divider {
    border-top: 1px solid #eeeeee;
  }
`;
