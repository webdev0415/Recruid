import React from "react";
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";

import AvatarIcon from "sharedComponents/AvatarIcon";

import modalStyles from "assets/stylesheets/scss/collated/modals.module.scss";

// SettingsModal
const ModalBody = styled.div`
  padding: 30px 60px;
`;

const GoogleContainer = styled.div`
  margin-bottom: 30px;
`;

const GoogleWrapper = styled.div`
  align-items: center;
  background: #fafafa;
  border: 1px solid rgba(193, 195, 200, 0.5);
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  justify-content: space-between;
  padding: 15px;
`;

const GoogleProfile = styled.div`
  align-items: center;
`;

const GoogleProfileDetails = styled.div`
  margin-left: 15px;

  p {
    font-size: 14px;
    font-weight: 500;
    margin: 0;
  }

  span {
    color: #74767b;
    font-size: 13px;
  }
`;

const ModalFooter = styled.div`
  border-top: 1px solid #eee;
  padding-top: 30px;
  text-align: center;
  width: 100%;
`;

const FooterButton = styled.button``;

const IntegrationModal = ({
  closeModal,
  signIn,
  signOut,
  userName,
  userEmail,
  userAvatar,
  show,
}) => (
  <Modal show={show} dialogClassName="modal-480w" onHide={closeModal}>
    <Modal.Dialog>
      <div className={modalStyles.modalHeader}>
        <h3>Connect Mail Accounts</h3>
      </div>
      <ModalBody>
        <p>
          Connect your Google calendar to see your Google events in the
          schedule.
        </p>
        <GoogleContainer>
          {!!userName && !!userEmail ? (
            <GoogleWrapper className="leo-flex">
              <GoogleProfile className="leo-flex">
                <AvatarIcon imgUrl={userAvatar} name={userName} size={40} />
                <GoogleProfileDetails>
                  <p>{userName}</p>
                  <span>{userEmail}</span>
                </GoogleProfileDetails>
              </GoogleProfile>
              <button
                className="button button--default button--white "
                onClick={signOut}
              >
                Disconnect
              </button>
            </GoogleWrapper>
          ) : (
            <button
              className="button button--default button--white button--full"
              onClick={signIn}
            >
              Connect Google Calendar
            </button>
          )}
        </GoogleContainer>
        <ModalFooter>
          <FooterButton
            className="button button--default button--grey-light"
            onClick={closeModal}
          >
            Close
          </FooterButton>
        </ModalFooter>
      </ModalBody>
    </Modal.Dialog>
  </Modal>
);

export default IntegrationModal;
