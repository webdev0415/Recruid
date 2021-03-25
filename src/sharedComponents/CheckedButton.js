import React from "react";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";
const CheckedButton = ({ checked, onClick, style }) => {
  return (
    <CKButton
      onClick={onClick}
      style={style}
      className={`${checked ? "checked" : "unchecked"} leo-flex-center-center`}
    >
      <img src={`${AWS_CDN_URL}/icons/CheckIcon.svg`} alt="" />
    </CKButton>
  );
};

export default CheckedButton;

const CKButton = styled.button`
  background: #fff;
  border-radius: 50%;
  height: 24px;
  width: 24px;

  &:hover:not(.checked) {
    border: none;
    background: #35c3ae9c;
  }

  &.checked {
    background: #35c3ae;
  }
  &.unchecked {
    border: 2px solid #9a9ca1;
  }
`;
