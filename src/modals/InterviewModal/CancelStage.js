import React from "react";
import styled from "styled-components";

const CancelContainer = styled.div`
  align-items: center;
  display: flex;
  height: 300px;
  padding: 30px 60px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  /* justify-content: space-between; */
  margin-top: 30px;

  button {
    margin-right: 10px;
  }
`;

const CancelStage = ({ submitCancelInterview, setStage, changeToSchedule }) => {
  return (
    <CancelContainer>
      <div>
        <p>Was this interview cancelled? Confirm below or reschedule.</p>
        <ButtonsContainer>
          <button
            className="button button--default button--blue-dark"
            onClick={submitCancelInterview}
          >
            Cancel Interview
          </button>
          <button
            className="button button--default button--primary"
            onClick={() => {
              if (changeToSchedule) {
                changeToSchedule();
              }
              setStage("members");
            }}
          >
            Reschedule Interview
          </button>
        </ButtonsContainer>
      </div>
    </CancelContainer>
  );
};

export default CancelStage;
