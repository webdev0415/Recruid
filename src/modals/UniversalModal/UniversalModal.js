import React from "react";
import styled from "styled-components";
import Modal from "react-bootstrap/Modal";
import AvatarIcon from "sharedComponents/AvatarIcon";
import { Link } from "react-router-dom";
import { AWS_CDN_URL } from "constants/api";

const UniversalModal = ({ show, hide, id, width, children }) => (
  <STUniModal
    show={show}
    onHide={hide}
    dialogClassName={width ? `modal-${width}w` : `modal-480w`}
    id={id}
  >
    <Modal.Dialog className={width ? `modal-${width}w` : `modal-480w`}>
      {children}
    </Modal.Dialog>
  </STUniModal>
);

export default UniversalModal;

export const ModalFooter = ({ children, hide, cancelText }) => (
  <ModalFooterST>
    <CloseButton
      type="button"
      className="button button--default button--grey-light button--full"
      onClick={hide}
    >
      {cancelText || "Close"}
    </CloseButton>
    {children}
  </ModalFooterST>
);

export const ModalHeaderClassic = ({ title, closeModal, theme }) => (
  <ClassicModalHeader className={theme === "v2theme" ? "v2theme" : ""}>
    <h3>{title}</h3>
    <button type="button" onClick={closeModal}>
      <img src={`${AWS_CDN_URL}/icons/CloseModal2.svg`} alt="Close" />
    </button>
  </ClassicModalHeader>
);

export const ModalHeaderV2 = ({ name, userAvatar, subTitle, link }) => (
  <ModalHeader>
    <div style={{ alignItems: "center" }} className="leo-flex">
      <AvatarIcon name={name} imgUrl={userAvatar} size={50} />
      <div style={{ marginLeft: "15px" }}>
        <h2>{name}</h2>
        <span>{subTitle}</span>
      </div>
    </div>
    {link && <OpenButton to={link}>Open</OpenButton>}
  </ModalHeader>
);

export const MinimalHeader = ({ title, hide }) => (
  <MinimalHeaderST>
    <h3>{title}</h3>
    <button onClick={() => (hide ? hide() : null)}>
      <i className="fas fa-times"></i>
    </button>
  </MinimalHeaderST>
);

export const ModalBody = styled(Modal.Body)`
  padding: 0 !important;

  &.no-header {
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important;
  }

  &.no-footer {
    border-bottom-left-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
  }
`;

const ModalHeader = styled.div`
  align-items: center;
  background: #2a3744;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  padding: 30px;

  h2 {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 5px;
  }

  span {
    font-size: 12px;
    opacity: 0.75;
  }
`;

const ClassicModalHeader = styled.div`
  padding: 30px 0;
  position: relative;
  border-bottom: 1px solid #eee;
  background: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  h3 {
    color: #1e1e1e;
    font-size: 20px;
    letter-spacing: -0.3px;
    text-align: center;
  }

  &.v2theme {
    background: #2a3744;
    h3 {
      text-align: left;
      color: white;
      margin-left: 30px;
    }
  }

  button {
    opacity: 1;
    position: absolute;
    right: 30px;
    top: 31px;
  }
`;

const ModalFooterST = styled(Modal.Footer)`
  background: #cccccc;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end !important;
`;

const OpenButton = styled(Link)`
  background: #fff;
  border-radius: 4px;
  color: #1e1e1e;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  text-transform: uppercase;

  &:hover {
    text-decoration: none;
  }
`;

const CloseButton = styled.button`
  width: auto;
`;

const STUniModal = styled(Modal)`
  .modal-dialog {
  }

  .modal-1040w {
    min-width: 1040px;
  }
  .modal-330w {
    min-width: 330px;
  }
  .modal-380w {
    min-width: 380px;
  }
  .modal-780w {
    min-width: 780px;
  }
  .modal-550w {
    min-width: 550px;
  }
  .modal-620w {
    min-width: 620px;
  }

  .modal-content {
    background: transparent;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .modal-body {
    background: #fff;
    border-radius: 0;

    .paragraph {
      font-size: 15px;
      line-height: 25px;
      margin: 0;
      margin-bottom: 20px;
    }

    span {
      &.status {
        background: rgba(0, 202, 165, 0.1);
        border-radius: 4px;
        color: #00cba7;
        display: inline-block;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.5px;
        line-height: 1;
        padding: 5px 8px;
        position: relative;
        text-transform: uppercase;
        top: -1px;
      }
    }
  }

  .modal-footer {
    background: #fafafa;
    border: 0;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top: 1px solid #eeeeee;
  }
`;

const MinimalHeaderST = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #2a3744;
  padding: 15px;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 8px 8px 0px 0px;

  h3 {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #2a3744;
    max-width: 280px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  button {
    color: grey;
  }
`;
