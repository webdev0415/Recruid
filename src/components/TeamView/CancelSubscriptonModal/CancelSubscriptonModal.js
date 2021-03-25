import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { cancelAllSubscriptions } from "components/TeamView/helpers/teamViewHelpers";
import Spinner from "sharedComponents/Spinner";

import styled from "styled-components";

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px;
`;

const CancelSubModal = ({
  modalView,
  handleCloseModal,
  setParentState,
  state,
  companyId,
  session,
}) => {
  const [cancel, setCancel] = useState("");
  const [view, setView] = useState("initial");

  const submitCancelRequest = (e) => {
    e.preventDefault();
    setView("waiting");
    cancelAllSubscriptions(companyId, session).then((res) => {
      if (res.status === "ok") {
        setView("confirmed");
      }
    });
  };
  return (
    <Modal show={modalView} onHide={handleCloseModal}>
      <StyledHeader>
        <h2 className="modal-title">Cancel Subscription</h2>
        <button type="button" className="close" onClick={handleCloseModal}>
          &times;
        </button>
      </StyledHeader>
      {view === "initial" && (
        <Modal.Body>
          <p>
            Deleting your Leo subscription will permanently remove the access to
            the ATS for all paid users on your account
          </p>
          <p className="font-weight-bold">
            To continue, please type CANCEL below:
          </p>
          <form onSubmit={submitCancelRequest}>
            <input
              className="form-control"
              type="text"
              placeholder=""
              value={cancel}
              onChange={(e) => setCancel(e.target.value)}
            />
            <button
              type="submit"
              className={`button button--default ${
                cancel === "CANCEL" ? "button--blue-dark" : "button--grey"
              }`}
              disabled={cancel !== "CANCEL"}
            >
              Yes, cancel my subscription
            </button>
          </form>
        </Modal.Body>
      )}
      {view === "waiting" && <Spinner style={{ minHeight: "260px" }} />}
      {view === "confirmed" && (
        <Modal.Body className="text-center">
          <h1>All your subscriptions have been cancelled</h1>
          <button
            type="button"
            className="button button--default button--blue-dark"
            onClick={() => {
              let newState = { ...state };
              newState.company.trial = "expired";
              setParentState(newState);
              handleCloseModal();
            }}
          >
            Close
          </button>
        </Modal.Body>
      )}
    </Modal>
  );
};

export default CancelSubModal;
