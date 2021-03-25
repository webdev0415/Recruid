import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";

const ExtensionMenu = ({ children, style, name }) => {
  return (
    <CheckboxWrapper style={style}>
      <Dropdown.Toggle as="button" type="button">
        {name ? (
          name
        ) : (
          <svg
            width="16"
            height="4"
            viewBox="0 0 16 4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 4a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM2 4a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm12 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
              fill="#9A9CA1"
              fill-role="nonzero"
            />
          </svg>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu
        as="div"
        className="dropdown-new dropdown-menu dropdown-menu-right"
        style={{ top: "30px" }}
      >
        {children}
      </Dropdown.Menu>
    </CheckboxWrapper>
  );
};

const ExtensionMenuOption = ({ onClick, children, red }) => {
  return (
    <Option className="dropdown-new-option">
      <button
        className={`dropdown-new-link ${red ? "red-color" : ""}`}
        onClick={onClick}
      >
        {children}
      </button>
    </Option>
  );
};

const CheckboxWrapper = styled(Dropdown)`
  margin: 0 auto;
  position: relative;
  width: 26px;
`;

const Option = styled(Dropdown.Item)`
  padding: 0;
  a:hover {
    text-decoration: none;
  }
  button {
    margin: 0;
  }
  .red-color {
    color: #ff3159 !important;
  }
`;

export { ExtensionMenu, ExtensionMenuOption };
