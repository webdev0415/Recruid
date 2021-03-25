import React from "react";
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";

const UnlockAccessModal = ({ company, upgradePlan, show, hide }) => {
  return (
    <Modal show={show} onHide={hide}>
      <Container>
        <Illustration>
          <img src={`${AWS_CDN_URL}/illustrations/Recruitd_Illustration_Unlock_full_access.svg`} alt="Illustration" />
        </Illustration>
        <h1>Unlock full access</h1>
        <p>{`Your free account is tied to ${company.invited_by_employer ||
          "your agency"} right now. If you want full access to the platform and Leo's ATS, upgrade now.`}</p>
        <button
          className="button button--default button--blue-dark"
          onClick={upgradePlan}
        >
          Upgrade
        </button>
      </Container>
    </Modal>
  );
};

export default UnlockAccessModal;

const Illustration = styled.div`
  img {
    width: 70%;
  }
`;

const Container = styled.div`
  padding: 20px 80px 40px;
  text-align: center;

  h1 {
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 10px;
  }
`;
