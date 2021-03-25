import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 30px;

  button {
    /* font-weight: 500; */
    /* width: 100%; */
  }
`;

const Text = styled.p`
  font-size: 15px;
`;

const AvailabilityStage = ({ name, setStage, status, company }) => {
  return (
    <Wrapper>
      <Text>
        {name && (
          <>
            You are setting {name} to the status{" "}
            <span className="status">{status}</span> <br />
          </>
        )}
        {!(
          (company.invited_by_agency || company.invited_by_employer) &&
          company.trial !== "upgraded"
        ) &&
          "Would you like to book an interview or request the candidates availability?"}
      </Text>
      {!(
        (company.invited_by_agency || company.invited_by_employer) &&
        company.trial !== "upgraded"
      ) && (
        <div>
          <button
            className="button button--default button--blue-dark"
            onClick={() => setStage("members")}
            style={{ marginRight: 10 }}
          >
            Book an Interview
          </button>
          <button
            className="button button--default button--blue-dark"
            onClick={() => setStage("requestAvailability")}
          >
            Send Availability
          </button>
        </div>
      )}
    </Wrapper>
  );
};

export default AvailabilityStage;
