import React from "react";
import styled from "styled-components";

const Checkbox = ({ active, onClick, style, size, disabled }) => (
  <STLabel
    onClick={() => {
      if (!disabled) {
        onClick();
      }
    }}
    style={style}
    size={size}
    className={disabled ? "disabled" : ""}
    disabled={disabled}
  >
    <input type="checkbox" />
    {active && (
      <>
        {size === "large" ? (
          <svg
            width="15"
            height="14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.238 13.044c-.486-.485-.472-1.286.03-1.788l7.273-7.273c.502-.502 1.303-.516 1.788-.03.486.485.472 1.286-.03 1.788l-7.273 7.273c-.502.502-1.303.516-1.788.03z"
              fill="#2A3744"
            />
            <path
              d="M1.45 10.256c-.485-.485-.472-1.286.03-1.788s1.303-.515 1.788-.03l2.788 2.788c.485.485.472 1.286-.03 1.788s-1.303.516-1.788.03L1.45 10.256z"
              fill="#2A3744"
            />
          </svg>
        ) : (
          <svg
            width="11"
            height="11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.852 9.923c-.378-.378-.367-1 .023-1.39l5.657-5.658c.39-.39 1.013-.4 1.391-.023.377.377.367 1-.024 1.39L4.243 9.9c-.39.391-1.014.402-1.391.024z"
              fill="#2A3744"
            />
            <path
              d="M.684 7.755c-.378-.378-.367-1 .023-1.391.39-.39 1.013-.401 1.39-.024l2.17 2.169c.377.377.366 1-.024 1.39-.39.391-1.014.402-1.391.024L.684 7.755z"
              fill="#2A3744"
            />
          </svg>
        )}
      </>
    )}
  </STLabel>
);

export default Checkbox;

const STLabel = styled.div`
  cursor: pointer;
  display: block;
  position: relative;
  user-select: none;
  width: ${(props) => (props.size === "large" ? "18" : "14")}px;
  height: ${(props) => (props.size === "large" ? "18" : "14")}px;
  background: #ffffff;
  border: 1px solid #d4dfea;
  border-radius: 3px;

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
  svg {
    position: absolute;
    top: 0px;
    left: 1px;
  }
`;
