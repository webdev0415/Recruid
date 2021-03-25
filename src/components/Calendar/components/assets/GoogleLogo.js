import React from "react";
import styled from "styled-components";

export const GoogleLogoWrapper = styled.div`
  align-items: center;
  background: #ffffff;
  border: 2px solid #eeeeee;
  border-radius: 50%;
  height: 30px;
  justify-content: center;
  max-width: 30px;
  min-width: 30px;
  width: 30px;
`;

export const GoogleLogo = () => (
  <GoogleLogoWrapper className="leo-flex">
    <GoogleLogo />
  </GoogleLogoWrapper>
);
