import React, { Fragment } from "react";
import styled from "styled-components";
import { COLORS } from "constants/style";
import useDropdown from "hooks/useDropdown";

const SelectDropdown = ({ name, style, options, onSelect }) => {
  const { node, showSelect, setShowSelect } = useDropdown();

  return (
    <Wrapper ref={node} style={style}>
      <SelectButton
        onClick={() => setShowSelect(!showSelect)}
        className="leo-flex-center-end"
      >
        <div className="leo-flex-center-between leo-pointer">
          {name}
          <span>
            <i className="fas fa-angle-down"></i>
          </span>
        </div>
      </SelectButton>
      {showSelect && (
        <Menu>
          {options &&
            options.map((option, index) => (
              <Fragment key={`filter-${option.name}-${index}`}>
                {option.separator ? (
                  <>
                    <MenuHeader />
                    <Separator />
                    <MenuHeader />
                  </>
                ) : (
                  <SelectOption
                    name={option.name}
                    onClick={() => {
                      onSelect(option);
                      setShowSelect(false);
                    }}
                  />
                )}
              </Fragment>
            ))}
        </Menu>
      )}
    </Wrapper>
  );
};

export default SelectDropdown;

const SelectOption = ({ name, onClick }) => (
  <MenuOption onClick={onClick}>{name}</MenuOption>
);

const Wrapper = styled.div`
  position: relative;
`;

const MenuHeader = styled.span`
  color: #74767b;
  font-size: 11px;
  padding: 8px 14px 0;
`;

const Menu = styled.div`
  background-color: ${COLORS.white};
  border: 0;
  border-radius: 0.25rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 5px rgba(0, 0, 0, 0.2);
  left: auto;
  margin: 0;
  max-height: 250px;
  min-width: 10rem;
  overflow: hidden;
  overflow-y: hidden;
  overflow-y: auto;
  padding: 8px 0;
  position: absolute;
  right: 0;
  top: 110%;
  z-index: 1;
`;

const MenuOption = styled.button`
  color: #212529 !important;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 14px 5px !important;
  text-align: left;
  width: 100%;

  &:hover {
    background-color: #f6f6f6 !important;
  }

  &.active {
    background: grey;
    color: white !important;

    &:hover {
      background-color: grey !important;
    }
  }
`;

const SelectButton = styled.button`
  color: ${COLORS.dark_4};
  font-weight: 500;
  font-size: 12px;

  div {
    padding: 0;

    span {
      margin-left: 15px;
    }
  }
`;

const Separator = styled.div`
  border-bottom: solid #eee 1px;
`;
