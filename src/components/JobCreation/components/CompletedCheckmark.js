import React from "react";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";

const CompletedCheckmark = () => (
  <Mark className="leo-flex-center-center">
    <img src={`${AWS_CDN_URL}/icons/Checkmark.svg`} alt="" />
  </Mark>
);

const Mark = styled.span`
  border-radius: 50%;
  height: 20px;
  width: 20px;
  background: #35c3ae;
`;

export default CompletedCheckmark;
