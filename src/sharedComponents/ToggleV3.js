import React from "react";
import styled from "styled-components";

const ToggleV3 = ({ name, toggle, checked, disabled = false }) => (
  <Container>
    <Input
      id={`${name}-checkbox`}
      type="checkbox"
      name={name}
      onChange={toggle}
      checked={checked}
      disabled={disabled}
    />
    <Label
      htmlFor={`${name}-checkbox`}
      className={checked ? "checked" : "unchecked"}
    />
  </Container>
);

const Container = styled.div`
  position: relative;
  border: 1px solid #b0bdca;
  border-radius: 16px;
  width: 35px;
  height: 20px;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const Label = styled.label`
  position: absolute;
  border-radius: 4px;
  width: 15px;
  height: 10px;
  top: 4px;
  cursor: pointer;

  &.unchecked {
    animation-name: toUnchecked;
    animation-duration: 150ms;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in;
  }

  &.checked {
    animation-name: toChecked;
    animation-duration: 150ms;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in;
  }

  @keyframes toChecked {
    0% {
      background: #d4dfea;
      left: 5px;
      width: 15px;
    }
    50% {
      width: 23px;
    }
    100% {
      width: 15px;
      right: 5px;
      background: #2a3744;
    }
  }

  @keyframes toUnchecked {
    0% {
      background: #2a3744;
      right: 5px;
      width: 15px;
    }
    50% {
      width: 23px;
    }
    100% {
      width: 15px;
      left: 5px;
      background: #d4dfea;
    }
  }
`;

export default ToggleV3;
