import React from "react";
import styled from "styled-components";
import Spinner from "sharedComponents/Spinner";

const ActionCreatorFooter = ({ actionName, confirmAction, sendingRequest }) => {
  return (
    <Buttons>
      <button
        className="button button--default button--blue-dark"
        onClick={confirmAction}
        disabled={sendingRequest || false}
      >
        {!sendingRequest ? (
          actionName
        ) : (
          <Spinner inline size="sm" color="white" />
        )}
      </button>
    </Buttons>
  );
};

export default ActionCreatorFooter;

const Buttons = styled.div`
  margin-bottom: 20px;
  * {
    &:not(:last-child) {
      margin-right: 10px;
    }
  }
`;
