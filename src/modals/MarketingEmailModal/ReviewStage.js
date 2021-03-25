import React, { useState, Suspense } from "react";
import EditButtons from "components/Profiles/components/EditButtons";

import styled from "styled-components";
import {
  DetailContainer,
  Subtitle,
} from "components/Profiles/components/ProfileComponents";
import { WarningIcon } from "components/TempJobDashboard/JobDashboardShifts/icons";
import retryLazy from "hooks/retryLazy";
const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);

const ReviewStage = ({
  email,
  setEmail,
  editSection,
  setEditSection,
  triggerEditSection,
  cancelEdit,
  participants,
  setView,
  createEmail,
  setPreview,
  selectedJob,
  filesToAdd,
  source,
  handleSendingTestEmail,
  hasJobLink,
}) => {
  const [innerModal, setInnerModal] = useState(undefined);
  return (
    <>
      <FinalWrapper>
        <DetailContainer>
          <Subtitle>Subject</Subtitle>
          <div className="flex-div">
            {editSection !== "subject" ? (
              <Content>{email.subject}</Content>
            ) : (
              <Input
                value={email.subject}
                onChange={(e) =>
                  setEmail({ ...email, subject: e.target.value })
                }
              />
            )}
            <EditButtons
              editing={editSection === "subject"}
              onClickEdit={() => triggerEditSection("subject")}
              onClickCancel={cancelEdit}
              onClickSave={() => setEditSection(undefined)}
            />
          </div>
        </DetailContainer>
        <DetailContainer>
          <Subtitle>From Name</Subtitle>
          <div className="flex-div">
            {editSection !== "from_name" ? (
              <Content>{email.from_name}</Content>
            ) : (
              <Input
                value={email.from_name}
                onChange={(e) =>
                  setEmail({ ...email, from_name: e.target.value })
                }
              />
            )}

            <EditButtons
              editing={editSection === "from_name"}
              onClickEdit={() => triggerEditSection("from_name")}
              onClickCancel={cancelEdit}
              onClickSave={() => setEditSection(undefined)}
            />
          </div>
        </DetailContainer>
        <DetailContainer>
          <Subtitle>From Email</Subtitle>
          <div className="flex-div">
            {editSection !== "from_email" ? (
              <Content>{email.from_email}</Content>
            ) : (
              <Input
                value={email.from_email}
                onChange={(e) => setEmail({ ...email, email: e.target.value })}
              />
            )}

            <EditButtons
              editing={editSection === "from_email"}
              onClickEdit={() => triggerEditSection("from_email")}
              onClickCancel={cancelEdit}
              onClickSave={() => setEditSection(undefined)}
            />
          </div>
        </DetailContainer>
        <DetailContainer>
          <Subtitle>Sending To</Subtitle>
          <div className="flex-div">
            <Content>
              {participants &&
                participants.filter((part) => part.selected).length}{" "}
              {source === "candidate"
                ? "Candidates"
                : source === "contact"
                ? "Contacts"
                : "Participants"}
            </Content>
            <EditButtons
              editing={false}
              onClickEdit={() => setView("confirm-participants")}
              onClickCancel={cancelEdit}
              onClickSave={() => setEditSection(undefined)}
              addButton={true}
              onClickAdd={() => setView("select-list")}
            />
          </div>
        </DetailContainer>
        {filesToAdd.length > 0 && (
          <DetailContainer>
            <Subtitle>Attachments</Subtitle>
            <div className="flex-div">
              <Content>{filesToAdd.length} attachments</Content>
              <EditButtons
                editing={false}
                onClickEdit={() => setView("initial")}
                onClickCancel={cancelEdit}
                onClickSave={() => setEditSection(undefined)}
              />
            </div>
          </DetailContainer>
        )}
        {selectedJob && (
          <DetailContainer>
            <Subtitle>Selected Job</Subtitle>
            <div className="flex-div">
              <Content className="leo-flex">
                {selectedJob.title}
                {hasJobLink &&
                  (selectedJob.job_post_type === "private" ||
                    selectedJob.jobpost_for === "internal") &&
                  !selectedJob.is_draft && (
                    <ErrorDisplay text="This job has not been posted to the careers portal" />
                  )}
                {hasJobLink && selectedJob.is_draft && (
                  <ErrorDisplay text="This job is still a draft" />
                )}
              </Content>
              <EditButtons
                editing={false}
                onClickEdit={() => setView("select-job")}
                onClickCancel={cancelEdit}
                onClickSave={() => setEditSection(undefined)}
              />
            </div>
          </DetailContainer>
        )}
        <ButtonsContainer>
          <button
            className="button button--default button--blue-dark"
            onClick={() => setPreview(true)}
          >
            Preview Email
          </button>
          <button
            className="button button--default button--blue-dark"
            onClick={() => handleSendingTestEmail(true)}
            style={{ margin: "0 10px" }}
          >
            Send Test Email
          </button>
          <button
            type="button"
            className="button button--default button--grey-light"
            onClick={() => setView("initial")}
          >
            Edit Email
          </button>
        </ButtonsContainer>
      </FinalWrapper>
      <Footer>
        <div>
          <button
            type="button"
            className="button button--default button--blue"
            onClick={() => createEmail(true)}
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="button button--default button--primary"
            onClick={() => {
              if (
                hasJobLink &&
                (selectedJob.job_post_type === "private" ||
                  selectedJob.jobpost_for === "internal" ||
                  selectedJob.is_draft)
              ) {
                setInnerModal("confirm-warn");
              } else {
                createEmail(false);
              }
            }}
          >
            Send Email
          </button>
        </div>
      </Footer>
      {innerModal === "confirm-warn" && (
        <>
          <Suspense fallback={<div />}>
            <ConfirmModalV2
              show={true}
              hide={() => {
                setInnerModal(undefined);
              }}
              header="Review Job"
              text={`Oh no! 🙈 The job you are trying to send a link to is a draft or has not been posted to your careers portal, there will be no link for the recipient to click through. Are you sure you want to go ahead?`}
              actionText="Send Anyway"
              actionFunction={() => createEmail(false)}
            />
          </Suspense>
        </>
      )}
    </>
  );
};

export default ReviewStage;

const FinalWrapper = styled.div`
  text-align: initial;
  margin: 0px 30px 20px 30px;
  .flex-div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const Content = styled.div`
  font-size: 14px;
`;

const Input = styled.input`
  border: #c8c8c8 solid 1px !important;
  width: 100%;
  max-width: 250px !important;
  padding: 5px;
  border-radius: 4px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: 260px;
  justify-content: space-between;
`;

const Footer = styled.div`
  padding-top: 30px;
  border-top: solid #eee 1px;
  div {
    button:first-of-type {
      margin-right: 10px;
    }
  }
`;

const ErrorDisplay = ({ text }) => (
  <ErrorWrap>
    <WarningIcon color="red" />
    <span>{text}</span>
  </ErrorWrap>
);

const ErrorWrap = styled.div`
  display: flex;
  align-items: center;
  color: #d24650;
  font-size: 10px;
  margin-left: 10px;

  span {
    margin-left: 5px;
  }
`;
