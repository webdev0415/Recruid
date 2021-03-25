import React from "react";
import styled from "styled-components";
import {
  ModalBody,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";

const STModalBody = styled(ModalBody)`
  .add-agency-container {
    margin: 0 auto;
    max-width: 360px;
    padding: 30px 0 60px;
    width: 100%;
  }
`;

const SubTitle = styled.div`
  color: #74767b;
  font-size: 14px;
  letter-spacing: -0.3px;
  line-height: 20px;
  margin-bottom: 20px;
  text-align: center;
`;

const Card = styled.div`
  background: #f6f6f6;
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: -0.3px;
  padding: 25px 30px;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  &:hover {
    background: #004a6d;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

    h3,
    p {
      color: #ffffff;
    }
  }

  h3 {
    color: #1f1f1f;
    font-size: 20px;
    margin-bottom: 5px;
  }

  p {
    color: #74767b;
    font-size: 13px;
    line-height: 20px;
  }
`;

const InitialModal = ({ setViewMode, closeModal }) => (
  <>
    <ModalHeaderClassic title="Add Agency" closeModal={closeModal} />
    <STModalBody className="no-footer">
      <div className="add-agency-container">
        <SubTitle>
          Want some help finding candidates? Add a vendor for your company to
          help fill your roles faster.
        </SubTitle>
        <Card onClick={() => setViewMode(`search`)}>
          <h3>Search for an Agency</h3>
          <p>
            Discover the agencies already using Leo and delve into a new world
            of talent.
          </p>
        </Card>
        <Card onClick={() => setViewMode(`invite`)}>
          <h3>Invite an Agency</h3>
          <p>
            Invite an external agency to Leo and keep track of your candidates
            in one place.
          </p>
        </Card>
      </div>
    </STModalBody>
  </>
);

export default InitialModal;
