import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import AppButton from "styles/AppButton";

// "create-shift"
// "edit-shift"
// "assign-candidate"

const ShiftEditModal = ({ closeModal, cancelShift }) => {
  const node = useRef();

  const handleClick = (e) => {
    if (!node.current.contains(e.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
     
  }, []);

  return (
    <Wrapper>
      <Container ref={node}>
        <Header>
          Cancel shift
          <button onClick={() => closeModal()}>
            <i className="fas fa-times"></i>
          </button>
        </Header>
        <BodyContainer>
          Are you sure you want to cancel this shift? The candidate will be
          notified of this change. Please ensure the candidate has not already
          worked on this shift.
        </BodyContainer>
        <Footer>
          <AppButton
            theme="dark-blue"
            size="small"
            onClick={() => cancelShift()}
          >
            Cancel Shift
          </AppButton>
        </Footer>
      </Container>
    </Wrapper>
  );
};

export default ShiftEditModal;

const Container = styled.div`
  background: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.35);
  border-radius: 4px;
  min-width: 350px;
`;

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #00000075;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
`;

const Header = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #2a3744;
  padding: 15px;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    color: grey;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 20px 0px;
  margin: 0px 20px;
  border-top: solid #eee 1px;

  div button {
    margin-left: 10px;
  }
`;

const BodyContainer = styled.div`
  padding: 30px;
  text-align: center;
  font-size: 16px;
  max-width: 500px;
  margin: auto;
`;
