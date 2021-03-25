import React, { useState } from "react";
import TextEditor from "sharedComponents/TextEditor";
import UniversalModal, {
  ModalFooter,
  ModalHeaderV2,
  ModalBody,
} from "modals/UniversalModal/UniversalModal";
import Toggle from "sharedComponents/Toggle";
import notify from "notifications";
import styled from "styled-components";
const RejectionModal = ({
  show,
  hide,
  name,
  userAvatar,
  subTitle,
  confirmChangeCandidateStatus,
  status,
  jobTitle,
  store,
}) => {
  const [rejection, setRejection] = useState({
    feedback: "",
    rejection_reason: undefined,
    rejection_email: false,
  });
  const [stage, setStage] = useState(1);
  const [initialBody, setInitialBody] = useState(undefined);

  const handleRejectionEmailUpdate = () =>
    setRejection((rej) => ({ ...rej, rejection_email: !rej.rejection_email }));

  const prepareStage2 = () => {
    setInitialBody(
      emailBodygenerator(name.split(" ")[0], jobTitle, store.company.name)
    );
    setStage(2);
  };
  return (
    <UniversalModal
      show={show}
      hide={hide}
      id={"rejection-modal"}
      width={stage === 1 ? 600 : 780}
    >
      <ModalHeaderV2 name={name} userAvatar={userAvatar} subTitle={subTitle} />
      <ModalBody>
        {stage === 1 && (
          <div style={{ padding: "30px" }}>
            <p className="paragraph">
              You are setting {name} to the status{" "}
              <span
                className="status"
                style={{ color: "#F27881", background: "#fcd9e3" }}
              >
                {statusExchanger[status]}
              </span>
              <br /> Please confirm the reason for rejection.
            </p>
            <select
              name="rejection_reasons"
              className={"form-control form-control-select"}
              style={{ marginBottom: 15 }}
              defaultValue=""
              onChange={(e) =>
                setRejection({
                  ...rejection,
                  rejection_reason: Number(e.target.value),
                })
              }
            >
              <option value="" disabled hidden>
                Select a rejection reason
              </option>
              {rejectionOptions.map((option, index) => (
                <option value={option.value} key={`reject-option-${index}`}>
                  {option.label}
                </option>
              ))}
            </select>
            <textarea
              className="form-control"
              name="reason"
              value={rejection.feedback}
              onChange={(e) =>
                setRejection({ ...rejection, feedback: e.target.value })
              }
              style={{ marginBottom: 0, maxWidth: "100%", maxHeight: "300px" }}
            />
            {(store.role.role_permissions.owner ||
              store.role.role_permissions.admin ||
              store.role.role_permissions.recruiter) && (
              <div
                className="leo-flex"
                style={{ alignItems: "center", marginTop: 20 }}
              >
                <Toggle
                  name="rejection-notification"
                  toggle={handleRejectionEmailUpdate}
                  checked={rejection.rejection_email}
                />
                <span style={{ fontSize: 12, marginLeft: 10 }}>
                  Notify Candidate?
                </span>
              </div>
            )}
          </div>
        )}

        {stage === 2 && initialBody && (
          <EditContainer>
            <p>Here you can edit the email that your candidate will receive.</p>
            <TextEditor
              returnState={(body) =>
                setRejection({ ...rejection, email_copy: body })
              }
              placeholder="Start typing..."
              initialBody={initialBody}
            />
          </EditContainer>
        )}
      </ModalBody>
      <ModalFooter hide={hide}>
        <button
          style={{ width: "auto" }}
          type="button"
          className="button button--default button--blue button--full"
          onClick={() => {
            if (rejection.rejection_reason) {
              if (rejection.rejection_email && stage === 1) {
                prepareStage2();
              } else {
                confirmChangeCandidateStatus(rejection);
              }
            } else {
              notify("danger", "You need to select a rejection reason");
            }
          }}
        >
          {rejection.rejection_email && stage === 1 ? "Continue" : "Confirm"}
        </button>
      </ModalFooter>
    </UniversalModal>
  );
};

export default RejectionModal;

const rejectionOptions = [
  { value: 1, label: "Did not fit company culture" },
  { value: 2, label: "Did not meet desired qualifications" },
  { value: 3, label: "Did not meet minimum qualifications" },
  { value: 4, label: "Did not meet screening requirements" },
  { value: 5, label: "Incomplete application" },
  { value: 6, label: "Ineligible to work in location" },
  { value: 7, label: "Misrepresented qualifications" },
  { value: 8, label: "More qualified candidate selected" },
  { value: 9, label: "No show for interview" },
  { value: 10, label: "Unresponsive" },
  { value: 11, label: "Other" },
];

const statusExchanger = {
  rejected: "REJECTED",
  declined: "DECLINED",
};

const emailBodygenerator = (addressee, jobTitle, companyName) => {
  return `<p>Hi ${addressee},</p><br>
  <p>Thank you for your application to ${jobTitle}</p>
  <p>Unfortunately this time your application was not successful.</p>
  <p>If you have any questions feel free to reach out to us.</p>
  <br/>
  <br/>
  <p>Thanks</p>
  <p>${companyName}</p><br>`;
};

const EditContainer = styled.div`
  padding: 30px;
`;
