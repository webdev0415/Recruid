import React, { Fragment } from "react";
import styled from "styled-components";
import useDropdown from "hooks/useDropdown";

export const FiltersDropdown = ({ name, style, options, onSelect }) => {
  const { node, showSelect, setShowSelect } = useDropdown();

  return (
    <ActionsWrapper ref={node} style={style}>
      <FilterButton
        onClick={() => setShowSelect(!showSelect)}
        className="leo-flex-center-end"
      >
        <div className="leo-flex-center-between leo-pointer">
          {name}
          <span>
            <li className="fas fa-caret-down" />
          </span>
        </div>
      </FilterButton>

      {showSelect && (
        <Menu>
          {options &&
            options.map((option, index) => (
              <Fragment key={`filter-${option.name}-${index}`}>
                {option.separator ? (
                  <>
                    <DropdownMenuHeader />
                    <Separator />
                    <DropdownMenuHeader />
                  </>
                ) : (
                  <FilterDropdownOption
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
    </ActionsWrapper>
  );
};

export const FilterDropdownOption = ({ name, onClick }) => (
  <MenuOption onClick={onClick}>{name}</MenuOption>
);

const ActionsWrapper = styled.div`
  position: relative;
`;

const DropdownMenuHeader = styled.span`
  color: #74767b;
  font-size: 11px;
  padding: 8px 14px 0;
`;

const Menu = styled.div`
  background-color: #fff;
  border: 0;
  border-radius: 0.25rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 5px rgba(0, 0, 0, 0.2);
  left: auto;
  margin: 0;
  max-height: 400px;
  min-width: 10rem;
  overflow: hidden;
  overflow-y: auto;
  padding: 8px 0;
  position: absolute;
  right: 0;
  top: 100%;
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

const FilterButton = styled.button`
  color: #74767b;
  font-size: 13px;
  font-weight: 500;
  margin-left: 15px;

  div {
    padding: 0;

    span {
      margin-left: 5px;
    }
  }
`;

const Separator = styled.div`
  border-bottom: solid #eee 1px;
`;
