import React from "react";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";

export const CloseBtn = () => (
  <CloseButton>
    <img src={`${AWS_CDN_URL}/icons/close_white_ico.svg`} alt="Close" />
  </CloseButton>
);

export default CloseBtn;

const CloseButton = styled.div`
  img {
    height: 12px;
    width: 12px;
  }
`;
