import React from "react";
import styled from "styled-components";
import UniversalModal, {
  ModalBody,
} from "modals/UniversalModal/UniversalModal";

const ExistingList = styled.div`
  margin-top: 10px;
  text-align: initial;
  padding: 10px;
`;

const StyledCandidateRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const StyledCandidateName = styled.div`
  font-weight: 500;
`;

const ClientButton = styled.div`
  background: rgba(0, 202, 165, 0.1);
  border-radius: 4px;
  color: #00cba7;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  line-height: 1;
  padding: 5px 8px;
  text-transform: uppercase;
`;

const confirmationMessage = styled.div`
  color: #1f1f1f;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  width: 400px;
  text-align: center;
`;

const ReturnButton = styled.button`
  background-color: #9a9ca1;
  color: white;
  border-radius: 4px;
  width: 200px;
  height: 39px;
  margin: 5px;
`;

export default function ExistingWarning(props) {
  return (
    <UniversalModal
      show={true}
      hide={props.closeModal}
      id={"existingWarning"}
      width={480}
    >
      <ModalBody className="no-footer no-header">
        <div
          className="leo-flex"
          style={{
            flexDirection: "column",
            alignItems: "center",
            padding: "40px",
          }}
        >
          {!props.existingApplicants ||
          props.existingApplicants.length === 0 ? (
            <confirmationMessage>
              Candidates were added successfully to {props.jobTitle} job.
            </confirmationMessage>
          ) : (
            <confirmationMessage>
              Not all the candidates could be added to the job because they have
              already been added.
              <ExistingList style={{ marginTop: "10px" }}>
                {props.existingApplicants.map((existing, index) => (
                  <StyledCandidateRow
                    className="table-row-hover"
                    key={`existing-${index}`}
                  >
                    <StyledCandidateName>
                      {existing.talent_name || existing.name}
                    </StyledCandidateName>
                    <ClientButton>{existing.status}</ClientButton>
                  </StyledCandidateRow>
                ))}
              </ExistingList>
            </confirmationMessage>
          )}
          <div style={{ marginTop: "30px" }}>
            <ReturnButton
              onClick={() =>
                setTimeout(() => {
                  props.closeModal();
                }, 300)
              }
            >
              Close
            </ReturnButton>
          </div>
        </div>
      </ModalBody>
    </UniversalModal>
  );
}
