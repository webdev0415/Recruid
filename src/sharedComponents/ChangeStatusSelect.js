import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { fetchChangeCandidateStatus } from "helpersV2/applicants";
import { fetchInterviewStages } from "helpersV2/interviews";
import notify from "notifications";

const ChangeStatusSelect = ({
  applicantId,
  redirectToScheduleModal,
  redirectToOfferModal,
  setCallbackStatusFunction,
  isAgenciesClientJob,
  jobOwnerId,
}) => {
  const store = useContext(GlobalContext);
  const [newStatus, setNewStatus] = useState(undefined);
  const [newStage, setNewStage] = useState(undefined);

  const [clientsInterviewStages, setClientsInterviewStages] = useState(null);

  useEffect(() => {
    if (isAgenciesClientJob && store.session && jobOwnerId) {
      (async (session, jobOwnerId) => {
        const clientsStages = await fetchInterviewStages(session, jobOwnerId);
        if (clientsStages.err) {
          notify("Failed to get clients interview stages");
          return false;
        }
        return setClientsInterviewStages(clientsStages);
      })(store.session, jobOwnerId);
    }
  }, [isAgenciesClientJob, store.session, jobOwnerId]);

  useEffect(() => {
    if (newStatus && newStage) {
      if (statusFunctions[newStatus]) {
        setCallbackStatusFunction({
          call: () =>
            fetchChangeCandidateStatus(
              store.company.id,
              applicantId,
              newStatus,
              newStage,
              store.session
            ),
        });
      } else if (statusPromptSchedule[newStatus]) {
        setCallbackStatusFunction({ call: () => redirectToScheduleModal() });
      } else if (statusPromptSalary[newStatus]) {
        setCallbackStatusFunction({
          call: () => redirectToOfferModal(newStatus),
        });
      }
    }
  }, [newStatus, newStage, isAgenciesClientJob, clientsInterviewStages]);

  const mapInterviewStages = (stage, index) => (
    <optgroup
      label={stage.name}
      key={`${stage.static_name}-status-#${index + 1}`}
    >
      <option value={`offer interview-${stage.static_name}`}>
        Offer Interview
      </option>
      <option value={`interview_requested-${stage.static_name}`}>
        Interview Requested
      </option>
      <option value={`to be scheduled-${stage.static_name}`}>
        Interview to be Scheduled
      </option>
      <option value={`interview_scheduled-${stage.static_name}`}>
        Interview Scheduled
      </option>
      <option value={`interview_conducted-${stage.static_name}`}>
        Interview Conducted
      </option>
      <option value={`reschedule interview-${stage.static_name}`}>
        Reschedule Interview
      </option>
      <option value={`to be rescheduled-${stage.static_name}`}>
        Interview to be rescheduled
      </option>
      <option value={`invited to event-${stage.static_name}`}>
        Invited to Event
      </option>
      <option value={`attending event-${stage.static_name}`}>
        Attending Event
      </option>
      <option value={`rejected-${stage.static_name}`}>Rejected</option>
      <option value={`declined-${stage.static_name}`}>Declined</option>
    </optgroup>
  );

  return (
    <select
      name="startMonth"
      className="form-control"
      value={`${newStatus}-${newStage}` || "0"}
      onChange={(e) => {
        setNewStage(e.target.value.split("-")[1]);
        setNewStatus(e.target.value.split("-")[0]);
      }}
    >
      <option value="0" disabled>
        Select a status
      </option>
      <optgroup label="Applied">
        <option value="invite accepted-applied">Invite Accepted</option>
        <option value="rejected-applied">Rejected</option>
        <option value="declined-applied">Declined</option>
      </optgroup>
      <optgroup label="Shortlisted">
        <option value="to be screened-shortlisted">To Be Screened</option>
        <option value="to be approved-shortlisted">To Be Approved</option>
        <option value="to be submitted-shortlisted">To Be Submitted</option>
        <option value="rejected-shortlisted">Rejected</option>
        <option value="declined-shortlisted">Declined</option>
      </optgroup>
      <optgroup label="Submitted">
        <option value="awaiting review-submitted_to_hiring_manager">
          Awaiting Review
        </option>
        <option value="approved-submitted_to_hiring_manager">Approved</option>
        <option value="rejected-submitted_to_hiring_manager">Rejected</option>
        <option value="declined-submitted_to_hiring_manager">Declined</option>
      </optgroup>
      <optgroup label="Assessment Stage">
        <option value="assessment sent-assessment_stage">
          Assessment Sent
        </option>
        <option value="assessment returned-assessment_stage">
          Assessment Returned
        </option>
        <option value="passed-assessment_stage">Passed</option>
        <option value="rejected-assessment_stage">Rejected</option>
        <option value="declined-assessment_stage">Declined</option>
      </optgroup>
      {isAgenciesClientJob && clientsInterviewStages
        ? clientsInterviewStages.map(mapInterviewStages)
        : store.interviewStages.map(mapInterviewStages)}
      <optgroup label="Offer Pending">
        <option value="to be offered-offer_pending">To be offered</option>
        <option value="verbally offered-offer_pending">Verbally Offered</option>
        <option value="offer position-offer_pending">Offer Position</option>
        <option value="rejected-offer_pending">Rejected</option>
        <option value="declined-offer_pending">Declined</option>
      </optgroup>
      <optgroup label="Offered">
        <option value="offer sent-offered">Offer Sent</option>
        <option value="offer_requested-offered">Offer Requested</option>
        <option value="contract sent-offered">Contract Sent</option>
        <option value="verbally accepted-offered">Verbally Accepted</option>
        <option value="formally accepted-offered">Formally Accepted</option>
        <option value="rejected-offered">Rejected</option>
        <option value="declined-offered">Declined</option>
      </optgroup>
      <optgroup label="Onboarding">
        <option value="gathering information-onboarding">
          Gathering Information
        </option>
        <option value="contract signed-onboarding">Contract Signed</option>
        <option value="start date confirmed-onboarding">
          Start Date Confirmed
        </option>
        <option value="rejected-onboarding">Rejected</option>
        <option value="declined-onboarding">Declined</option>
      </optgroup>
      <optgroup label="Hired">
        <option value="hired-hired">Hired</option>
      </optgroup>
    </select>
  );
};

const statusFunctions = {
  "invite accepted": true,
  rejected: true,
  declined: true,
  "to be screened": true,
  "to be approved": true,
  "awaiting review": true,
  approved: true,
  interview_requested: true,
  "to be scheduled": true,
  interview_conducted: true,
  "to be rescheduled": true,
  "invited to event": true,
  "attending event": true,
  "to be offered": true,
  "verbally offered": true,
  "offer sent": true,
  offer_requested: true,
  "contract sent": true,
  "verbally accepted": true,
  "formally accepted": true,
  "gathering information": true,
  "contract signed": true,
  "to be submitted": true,
};

const statusPromptSchedule = {
  "offer interview": true,
  interview_scheduled: true,
  "reschedule interview": true,
};

const statusPromptSalary = {
  "start date confirmed": true,
  hired: true,
  "offer position": true,
};

export default ChangeStatusSelect;
