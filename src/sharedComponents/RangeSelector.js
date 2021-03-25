import React from "react";
import styled from "styled-components";

const RangeSelector = ({
  value,
  onChange,
  max,
  min,
  step,
  style,
  disabled,
}) => (
  <RangeInput
    type="range"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    min={min}
    max={max}
    step={step}
    style={style}
    disabled={disabled}
  />
);

export default RangeSelector;

const RangeInput = styled.input`
  width: 100%;
  margin: 5px 0;
  background-color: transparent;
  -webkit-appearance: none;

  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    background: #dfe9f4;
    border: 0px solid rgba(0, 0, 0, 0);
    border: 0;
    width: 100%;
    height: 5px;
    cursor: pointer;
  }
  &::-webkit-slider-thumb {
    margin-top: -5px;
    width: 15px;
    height: 15px;
    background: #2a3744;
    border: 0;
    border-radius: 20px;
    cursor: pointer;
    -webkit-appearance: none;
  }
  &:focus::-webkit-slider-runnable-track {
    background: #ffffff;
  }
  &::-moz-range-track {
    background: #dfe9f4;
    border: 0px solid rgba(0, 0, 0, 0);
    border: 0;
    width: 100%;
    height: 5px;
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #2a3744;
    border: 0;
    border-radius: 20px;
    cursor: pointer;
  }
  &::-ms-track {
    background: transparent;
    border-color: transparent;
    border-width: 5px 0;
    color: transparent;
    width: 100%;
    height: 5px;
    cursor: pointer;
  }
  &::-ms-fill-lower {
    background: #b1cae4;
    border: 0px solid rgba(0, 0, 0, 0);
    border: 0;
  }
  &::-ms-fill-upper {
    background: #dfe9f4;
    border: 0px solid rgba(0, 0, 0, 0);
    border: 0;
  }
  &::-ms-thumb {
    width: 15px;
    height: 15px;
    background: #2a3744;
    border: 0;
    border-radius: 20px;
    cursor: pointer;
    margin-top: 0px;
    /*Needed to keep the Edge thumb centred*/
  }
  &:focus::-ms-fill-lower {
    background: #dfe9f4;
  }
  &:focus::-ms-fill-upper {
    background: #ffffff;
  }
`;
