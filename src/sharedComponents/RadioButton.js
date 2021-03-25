import React from "react";
import styled from "styled-components";

const RadioButton = ({
  onClick,
  style,
  size,
  disabled,
  name,
  value,
  active,
  id,
}) => (
  <STLabel
    onClick={() => {
      if (!disabled) {
        onClick();
      }
    }}
    htmlFor={id}
    style={style}
    size={size}
    className={`${
      disabled ? "disabled" : ""
    } leo-flex-center-center leo-relative`}
    disabled={disabled}
  >
    <input type="radio" id={id} name={name} value={value} />
    {active && <div className="active-circle" />}
  </STLabel>
);

export default RadioButton;

const STLabel = styled.label`
  cursor: pointer;
  display: block;
  user-select: none;
  border: 1px solid #74767b;
  border-radius: 20px;
  height: 15px;
  width: 15px;

  &.disabled {
    opacity: 0.5;
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    margin: 0 !important;
  }

  .active-circle {
    width: 9px;
    height: 9px;
    background: #2a3744;
    border-radius: 20px;
  }
`;
