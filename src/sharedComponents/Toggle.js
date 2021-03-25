import React from "react";
import styled from "styled-components";

const Toggle = ({ name, toggle, checked, style }) => (
  <>
    <StyledInput
      id={`${name}-checkbox`}
      type={`checkbox`}
      name={name}
      onChange={toggle}
      checked={checked}
    />
    <label htmlFor={`${name}-checkbox`} style={style} />
  </>
);
const StyledInput = styled.input`
  opacity: 0;
  position: absolute;

  & + label {
    cursor: pointer;
    position: relative;
    padding: 0;
    margin-bottom: 0;

    background: #eeeeee;
    border-radius: 10px;
    height: 20px;
    width: 40px;
  }

  & + label:before {
    content: "";
    background: #74767b;
    border-radius: 8px;
    display: block;
    height: 16px;
    left: 2px;
    position: absolute;
    top: 2px;
    width: 16px;
  }

  &:focus + label:before {
    box-shadow: none;
  }

  &:checked + label {
    background: #00cba7;
  }

  // Box checked
  &:checked + label:before {
    background: #fff;
    left: auto;
    right: 2px;
  }
`;

export default Toggle;
