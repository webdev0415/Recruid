import React from "react";

const SimpleChangeStatusSelect = ({
  newStatus,
  newStage,
  setStageStatus,
  interviewStages,
}) => {
  return (
    <select
      name="startMonth"
      className="form-control"
      value={newStatus && newStage ? `${newStatus}-${newStage}` : "0"}
      onChange={(e) => {
        setStageStatus(
          e.target.value.split("-")[1],
          e.target.value.split("-")[0]
        );
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
      {interviewStages &&
        interviewStages.map((stage, index) => (
          <optgroup label={stage.name} key={`iterview-stage-${index}`}>
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
            <option value={`interview_rescheduled-${stage.static_name}`}>
              Interview Rescheduled
            </option>
            <option value={`to be rescheduled-${stage.static_name}`}>
              Interview to be Rescheduled
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
        ))}
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

export default SimpleChangeStatusSelect;
