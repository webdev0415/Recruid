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

const DismissButton = styled.button`
  box-shadow: none !important;
`;

const Img = styled.img`
  height: 150%;
  position: absolute;
  right: 0;
  top: -40px;
`;

const TrialContainer = ({
  trialStatus,
  trialExpiryDate,
  upgradeFunction,
  dismissFunction,
}) => {
  const timeLeft = () => {
    let expiryDate = new Date(trialExpiryDate);
    let currentDate = Date.now();
    let difference = Math.abs(expiryDate - currentDate);
    return Math.floor(difference / 86400000);
  };
  return (
    <Container className="leo-relative">
      <h2>
        {trialStatus === "active"
          ? "Welcome to your free Leo Unlimited trial"
          : "Upgrade to maintain access"}
      </h2>
      {/*{trialStatus === "active" && (
        <h3>Your trial will expire in {timeLeft()} days</h3>
      )}*/}
      {trialStatus === "active" ? (
        <p>
          For the next {timeLeft()} days you’ll be able to forget about admin
          and focus on recruiting. We’ll check in with you soon to make sure
          everything is OK, and you can message us any time by hitting the green
          button at the bottom right of your screen. Happy recruiting!
        </p>
      ) : (
        <p>
          Your free 14-day trial is complete. To continue using our features,
          please upgrade your account.
        </p>
      )}
      <div>
        <UpgradeButton
          className="button button--default button--white"
          onClick={upgradeFunction}
        >
          Upgrade
        </UpgradeButton>
        {trialStatus === "active" && (
          <DismissButton
            className="button button--default"
            onClick={dismissFunction}
          >
            Dismiss
          </DismissButton>
        )}
      </div>
      <Img
        alt=""
        src={`${AWS_CDN_URL}/illustrations/Recruitd_Illustration_Unlock_full_access.svg`}
      />
    </Container>
  );
};
export default TrialContainer;
