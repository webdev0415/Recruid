import React, { useState, useEffect } from "react";
import styled from "styled-components";
import UniversalModal, {
  ModalBody,
  MinimalHeader,
} from "modals/UniversalModal/UniversalModal";
import notify from "notifications";
import AppButton from "styles/AppButton";
import TextEditor from "sharedComponents/TextEditor";
import JobCheckbox from "components/JobCreation/components/JobCheckbox";
import ToggleV3 from "sharedComponents/ToggleV3";
import { fetchTriggerApproval } from "helpersV2/applicants";
import noteInputStyle from "sharedComponents/ActionCreator/NoteInputStyle";
import NoteInput from "components/Profiles/components/notes/NoteInput";
import { fetchCreateNote } from "helpersV2/notes/candidate";
import { prepareMentions } from "constants/noteMentions";

const ReviewASHMModal = ({
  hide,
  candidate,
  selectedJob,
  store,
  triggerStagesUpdate,
}) => {
  const [emailBody, setEmailBody] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [initialBody, setInitialBody] = useState(undefined);
  const [reviewValue, setReviewValue] = useState(undefined);
  const [sendEmail, setSendEmail] = useState(false);
  const [sendNote, setSendNote] = useState(false);
  const [availableMembers, setAvailableMembers] = useState([]);

  useEffect(() => {
    if (candidate && selectedJob) {
      setInitialBody(emailBodygenerator());
    }
  }, [candidate, selectedJob]);

  const actionReview = () => {
    if (sendNote && noteBody) {
      saveNote();
    }
    fetchTriggerApproval(store.session, store.company.id, {
      email_body: sendEmail ? emailBody : undefined,
      approved_by_hm: reviewValue,
      applicant_id: candidate.applicant_id,
      recruiter_id: candidate.approval_requested_by,
    }).then((res) => {
      if (!res.err) {
        notify("info", "Approval succesfully sent");
        triggerStagesUpdate(Math.random());
        hide();
      } else {
        notify("danger", "Unable to send approval");
      }
    });
  };

  useEffect(() => {
    if (store.teamMembers && selectedJob) {
      let members = [];
      store.teamMembers.map((member) => {
        if (
          member.permission === "owner" ||
          member.permission === "admin" ||
          selectedJob.assigned_team_member_ids.indexOf(
            member.team_member_id
          ) !== -1 ||
          selectedJob.posted_by_id === member.professional_id
        ) {
          members.push(member);
        }

        return null;
      });
      setAvailableMembers(members);
    }
  }, [store.teamMembers, selectedJob]);

  const saveNote = () => {
    let trimmedNote = noteBody.trim();
    if (trimmedNote === "") {
      return;
    }
    let { notifyAll, mentionTags } = prepareMentions(noteBody);
    const payload = {
      author_id: store.session.id,
      author_name: store.user.name,
      body: trimmedNote,
      title: `${candidate.name || candidate.talent_name} notes`,
      mention_tags: mentionTags?.length > 0 ? mentionTags : undefined,
      team_assigned_notification: notifyAll || undefined,
      company_id: store.company.id,

      // candidate profile props
      professional_id: candidate.professional_id,
      tn_profile_id: candidate.ptn_id,

      //job props
      job_id: selectedJob.id,
      applicant_id: candidate.applicant_id,
      // client_id: noteType === "client" ? queryParams?.client_id : undefined,
      // client_note:
      //   noteType === "client" && queryParams?.client_id ? true : false,
    };

    fetchCreateNote(
      store.session,
      payload,
      candidate.ptn_id,
      "ProfessionalTalentNetwork"
    ).then((res) => {
      if (!res.err) {
        notify("info", "Note succesfully created");
      } else {
        notify("danger", res);
      }
    });
  };

  return (
    <UniversalModal
      show={true}
      hide={hide}
      id="add-candidates-to-job-modal"
      width={780}
    >
      <MinimalHeader title="Review Applicant" hide={hide} />
      <STModalBody className="no-footer">
        <LabelWrapper>
          <label>Would you like to approve or not approve this applicant</label>
        </LabelWrapper>
        <CheckBoxesGrid gridColumns={2}>
          <JobCheckbox
            checked={reviewValue === true}
            labelText="Approved"
            onClick={() => {
              setReviewValue(true);
            }}
          />
          <JobCheckbox
            checked={reviewValue === false}
            labelText="Not Approved"
            onClick={() => setReviewValue(false)}
          />
        </CheckBoxesGrid>
        <LabelWrapper>
          <ToggleV3
            name="email-option"
            toggle={() => setSendEmail(!sendEmail)}
            checked={sendEmail}
          />
          <label className="label-text">You can send an email to the Recruiter</label>
        </LabelWrapper>
        {sendEmail && (
          <EditorContainer>
            <TextEditor
              returnState={(body) => setEmailBody(body)}
              placeholder="Start typing..."
              initialBody={initialBody}
            />
          </EditorContainer>
        )}
        <LabelWrapper>
          <ToggleV3
            name="note-option"
            toggle={() => setSendNote(!sendNote)}
            checked={sendNote}
          />
          <label className="label-text">
            You can also add a note to the applicant profile
          </label>
        </LabelWrapper>
        {sendNote && (
          <NoteInputContainer>
            <NoteInput
              members={availableMembers}
              currentNote={noteBody}
              setCurrentNote={setNoteBody}
              store={store}
              customStyle={noteInputStyle}
            />
          </NoteInputContainer>
        )}
        <Footer>
          <AppButton
            onClick={actionReview}
            size="small"
            disabled={reviewValue === undefined}
            theme={reviewValue === undefined ? "light-grey" : "dark-blue"}
          >
            Review
          </AppButton>
        </Footer>
      </STModalBody>
    </UniversalModal>
  );
};

export default ReviewASHMModal;

const emailBodygenerator = () => {
  return `<p>Sending Email</p>`;
  // return `<p>Hi <strong>${addressee || companyName}</strong>,</p><br>
  // <p>${
  //   attachements ? "Please find attached" : "I am submitting"
  // } <strong>${candidateName}</strong> for the role of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> and below a summary:</p><br>
  // <div>Candidate Name: ${candidateName}</div>
  // ${
  //   candidateSumary
  //     ? `<div>Candidate summary: ${candidateSumary.replace(
  //         /[\r\n]+/g,
  //         "<br>"
  //       )}</div>`
  //     : ""
  // }
  // ${
  //   salaryExpectations
  //     ? `<div>Salary Expectations: ${salaryExpectations}</div>`
  //     : ""
  // }<br>`;
};

const STModalBody = styled(ModalBody)`
  padding: 20px !important;
`;

const Footer = styled.div`
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  border-top: solid #eee 1px;
`;

const LabelWrapper = styled.div`
  margin-bottom: 15px;
  display: flex;
  align-content: center;

  .label-text {
    margin-left: 10px;
  }
`;

const EditorContainer = styled.div`
  margin-bottom: 20px;
  max-width: 650px;
`;

const CheckBoxesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  width: min-content;
  margin-bottom: 20px;
`;

const NoteInputContainer = styled.div`
  margin-bottom: 20px;
  max-width: 650px;
`;
