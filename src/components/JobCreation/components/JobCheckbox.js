import React from "react";
import styled from "styled-components";
import { COLORS } from "constants/style";
import { AWS_CDN_URL } from "constants/api";

const JobCheckbox = ({
  checked,
  labelText,
  onClick,
  mark,
  readOnly,
  hideCheckbox,
  noBorder,
}) => (
  <Container
    className={`${
      mark === "add" && checked ? "border-selected" : ""
    } leo-relative leo-flex-center`}
    noBorder={noBorder}
    readOnly={readOnly}
    onClick={(e) => {
      e.preventDefault();
      if (!readOnly) {
        onClick();
      }
    }}
  >
    {!hideCheckbox && (
      <>
        <input type="checkbox" readOnly={readOnly} />
        {checked ? (
          <>
            {mark !== "add" ? (
              <img src={`${AWS_CDN_URL}/icons/CheckSvg.svg`} alt="Add" />
            ) : (
              <img src={`${AWS_CDN_URL}/icons/AddSvg.svg`} alt="Remove" />
            )}
          </>
        ) : (
          <div className="unfilled-circle" />
        )}
      </>
    )}

    <span>{labelText}</span>
  </Container>
);

export default JobCheckbox;

const Container = styled.label`
  border-radius: 4px;
  background: #f9f9f9;
  width: 140px;
  height: 40px;
  cursor: ${(props) => (props.readOnly ? "initial" : "pointer")};
  user-select: none;
  padding-left: 15px;

  &.border-selected {
    border: ${(props) =>
      props.noBorder ? "none" : `solid ${COLORS.secondary_4} 1px`};
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    margin: 0 !important;
  }

  span {
    margin-left: 10px;
    font-size: 12px;
    font-weight: 500;
    max-width: 90px;
  }

  .unfilled-circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${COLORS.white};
    border: 1px solid ${COLORS.dark_4};
  }
`;
