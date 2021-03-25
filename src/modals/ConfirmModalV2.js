import React from "react";

import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
  ModalFooter,
} from "modals/UniversalModal/UniversalModal";
import Spinner from "sharedComponents/Spinner";
import styled from "styled-components";

const ConfirmModalV2 = ({
  show,
  hide,
  header,
  text,
  actionText,
  actionFunction,
  id,
  loading,
  cancelText,
  size,
}) => {
  return (
    <UniversalModal show={show} hide={hide} id={id} width={size || 480}>
      <ModalHeaderClassic title={header} closeModal={hide} />
      <STModalBody>
        <p>{text}</p>
      </STModalBody>
      <ModalFooter hide={hide} cancelText={cancelText}>
        <button
          id="forward"
          className="button button--default button--blue-dark"
          onClick={actionFunction}
          style={{ maxWidth: "max-content" }}
        >
          {actionText}
        </button>
      </ModalFooter>
      {loading && (
        <LoadContainer>
          <Spinner />
        </LoadContainer>
      )}
    </UniversalModal>
  );
};

export default ConfirmModalV2;

const STModalBody = styled(ModalBody)`
  padding: 30px !important;
  text-align: center;
`;

const LoadContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background: #eeeeee61;
  display: flex;
  align-items: center;
  justify-content: center;
`;
