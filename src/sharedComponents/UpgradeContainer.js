import React from "react";
import styled from "styled-components";

import { AWS_CDN_URL } from "constants/api";
import { ATSContainer } from "styles/PageContainers";

const StyledContainer = styled.div`
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  max-width: 680px;
  padding: 50px;
  margin: 0 auto;
  margin-top: 100px;

  h2 {
    color: #1e1e1e;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  p {
    margin: 0 auto 20px;
    max-width: 480px;
  }
`;

const Img = styled.img`
  max-width: 340px;
  width: 100%;
`;

const UpgradeContainer = ({ upgradeFunction }) => {
  return (
    <>
      <ATSContainer className="text-center">
        <StyledContainer className="background-white">
          <Img alt="" src={`${AWS_CDN_URL}/illustrations/Recruitd_Illustration_Unlock_full_access.svg`} />
          <h2>Upgrade to reactivate this feature</h2>
          <p>
            Your free 14-day trial is complete. Upgrade your account to
            reactivate this feature.
          </p>
          <button
            className="button button--default button--blue-dark"
            onClick={upgradeFunction}
          >
            Upgrade Now
          </button>
        </StyledContainer>
      </ATSContainer>
    </>
  );
};

export default UpgradeContainer;
