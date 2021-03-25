import React from "react";
import styled from "styled-components";

import { AWS_CDN_URL } from "constants/api";

const Container = styled.div`
  background: #2a3744;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  color: #ffffff;
  margin-bottom: 20px;
  overflow: hidden;
  padding: 25px 20px;
  position: relative;

  @media screen and (min-height: 768px) {
    padding: 30px 40px;
  }

  img {
    display: none;

    @media screen and (min-height: 768px) {
      display: block;
    }
  }

  h2 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  p {
    max-width: 600px;
  }
`;

const UpgradeButton = styled.button`
  color: #2a3744 !important;

  &:hover {
    color: #2a3744 !important;
  }
`;

const Img = styled.img`
  height: 150%;
  position: absolute;
  right: 0;
  top: -40px;
`;

const GuestEmployer = ({ vendor, upgradeFunction }) => {
  return (
    <Container>
      <h2>Unlock full access</h2>
      <p>{`Your free account is tied to ${vendor.name} right now. If you want full access to the platform and Leo's ATS, upgrade now.`}</p>
      <div>
        <UpgradeButton
          className="button button--default button--white"
          onClick={upgradeFunction}
        >
          Upgrade Now
        </UpgradeButton>
      </div>
      <Img alt="" src={`${AWS_CDN_URL}/illustrations/Recruitd_Illustration_Unlock_full_access.svg`} />
    </Container>
  );
};
export default GuestEmployer;
