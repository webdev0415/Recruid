import React from "react";
import styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";

const SourceTypeSelect = () =>
  // {
  //   // sourceType, setSourceType
  // }
  {
    return (
      <DropdownWrapper>
        {/*}<Dropdown.Toggle as={DropButton}>
        <img src={selectedGroup?.icon} alt="button icon" />
        {selectedGroup?.label}
        <button>
          <li className="fas fa-caret-down" />
        </button>
      </Dropdown.Toggle>
      <Dropdown.Menu
        as="div"
        className="dropdown-menu dropdown-menu-right"
        style={{ top: "50px" }}
      >
        <DropdownItem>
          <DropdownLink
            onClick={() => {
              setSelectedGroup(options.yourself);
              setOwnerType(options.yourself.name);
              setSelectedFolder(undefined);
            }}
          >
            {options.yourself.label}
          </DropdownLink>
        </DropdownItem>
        <DropdownItem>
          <DropdownLink
            onClick={() => {
              setSelectedGroup(options.team);
              setOwnerType(options.team.name);
              setSelectedFolder(undefined);
            }}
          >
            {options.team.label}
          </DropdownLink>
        </DropdownItem>
      </Dropdown.Menu>*/}
      </DropdownWrapper>
    );
  };

const DropdownWrapper = styled(Dropdown)`
  display: flex;
  justify-content: flex-end;
  position: relative;
`;

export default SourceTypeSelect;
