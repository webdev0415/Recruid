import React from "react";
import styled from "styled-components";
import useDropdown from "hooks/useDropdown";

export const ActionsDropdown = ({ name, children, style, menuId }) => {
  const { node, showSelect, setShowSelect } = useDropdown();

  return (
    <ActionsWrapper ref={node} style={style}>
      <ActionsButton
        onClick={() => setShowSelect(!showSelect)}
        className="leo-flex-center-between"
      >
        {name}
        <svg width="7" height="4" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h7L3.5 4z" fill="#FFF" fill-role="evenodd" />
        </svg>
      </ActionsButton>
      {showSelect && <Menu id={menuId}>{children}</Menu>}
    </ActionsWrapper>
  );
};

export const ActionsDropdownOption = ({ name, onClick, divider, active }) => (
  <MenuOption
    onClick={onClick}
    className={`${divider ? "divider" : ""} ${active ? "active" : ""}`}
  >
    {name}
  </MenuOption>
);

export const StickyDropdownOption = ({ name, onClick }) => {
  return (
    <StickyMenuOption onClick={onClick} className="leo-flex leo-justify-center">
      {name}
    </StickyMenuOption>
  );
};

const ActionsWrapper = styled.div`
  position: relative;
`;

const ActionsButton = styled.button`
  background: #74767b;
  border-radius: 4px;
  color: #fff;
  font-size: 10px;
  padding: 2px 6px !important;

  svg {
    margin-left: 5px;
  }
`;

const Menu = styled.div`
  position: absolute;
  background: white;
  width: max-content;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 8px 3px rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  top: 30px;
  width: 200px;
  z-index: 1;
  max-height: 300px;
  overflow-y: auto;
`;

const MenuOption = styled.button`
  padding: 10px 15px !important;
  color: #1e1e1e !important;
  cursor: pointer;
  font-size: 14px !important;
  font-weight: 500 !important;
  width: 100%;
  text-align: inherit;
  word-wrap: break-word;

  &:hover {
    background-color: #f6f6f6 !important;
  }

  &.divider {
    border-top: 1px solid #eeeeee;
  }

  &.active {
    background: grey;
    color: white !important;

    &:hover {
      background-color: grey !important;
    }
  }
`;

const StickyMenuOption = styled.button`
  padding: 10px 15px !important;
  cursor: pointer;
  font-size: 14px !important;
  font-weight: 500 !important;
  width: 100%;
  color: white !important;
  background: #2a3744;
  position: sticky;
  bottom: 0;
`;
