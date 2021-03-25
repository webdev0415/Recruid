export const stageTitles = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  submitted_to_hiring_manager: "Submitted",
  assessment_stage: "Assessment Stage",
  interviewing_client: "Client Stages",
  offer_pending: "Offer Pending",
  offered: "Offered",
  onboarding: "Onboarding",
  hired: "Hired",
};

export const uppercaseStageTitles = {
  to_fill: "TO FILL",
  applied: "APPLIED",
  shortlisted: "SHORTLISTED",
  submitted_to_hiring_manager: "SUBMITTED",
  assessment_stage: "ASSESSMENT STAGE",
  offer_pending: "OFFER PENDING",
  offered: "OFFERED",
  onboarding: "ONBOARDING",
  hired: "HIRED",
};

export const rejectedDeclinedStatuses = [
  { label: "Rejected", value: "rejected" },
  { label: "Declined", value: "declined" },
];
export const interviewingStatuses = [
  { label: "Interview Requested", value: "interview_requested" },
  { label: "Interview to be Scheduled", value: "to be scheduled" },
  { label: "Interview Scheduled", value: "interview_scheduled" },
  { label: "Interview Conducted", value: "interview_conducted" },
  { label: "Interview Rescheduled", value: "interview_rescheduled" },
  { label: "Interview to be Rescheduled", value: "to be rescheduled" },
  { label: "Invited to Event", value: "invited to event" },
  { label: "Attending Event", value: "attending event" },
  ...rejectedDeclinedStatuses,
];

export const selectStatusOptions = {
  applied: [
    { label: "Invited", value: "invite accepted" },
    ...rejectedDeclinedStatuses,
  ],
  shortlisted: [
    { label: "To Be Screened", value: "to be screened" },
    { label: "To Be Approved", value: "to be approved" },
    { label: "To Be Submitted", value: "to be submitted" },
    ...rejectedDeclinedStatuses,
  ],
  submitted_to_hiring_manager: [
    { label: "Awaiting Review", value: "awaiting review" },
    { label: "Approved", value: "approved" },
    ...rejectedDeclinedStatuses,
  ],
  assessment_stage: [
    { label: "Assessment Sent", value: "assessment sent" },
    { label: "Assessment Returned", value: "assessment returned" },
    { label: "Passed", value: "passed" },
    ...rejectedDeclinedStatuses,
  ],
  interview_stage_zero: interviewingStatuses,
  interview_stage_one: interviewingStatuses,
  interview_stage_two: interviewingStatuses,
  interview_stage_three: interviewingStatuses,
  interview_stage_four: interviewingStatuses,
  offer_pending: [
    { label: "To Be Offered", value: "to be offered" },
    { label: "Verbally Offered", value: "verbally offered" },
    // { label: "Offer Position", value: "offerStatus" },
    ...rejectedDeclinedStatuses,
  ],
  offered: [
    { label: "Offer Sent", value: "offer sent" },
    { label: "Offer Requested", value: "offer_requested" },
    { label: "Contract Sent", value: "contract sent" },
    { label: "Verbally Accepted", value: "verbally accepted" },
    { label: "Formally Accepted", value: "formally accepted" },
    ...rejectedDeclinedStatuses,
  ],
  onboarding: [
    { label: "Gathering Information", value: "gathering information" },
    { label: "Contract Signed", value: "contract signed" },
    { label: "Start Date Confirmed", value: "start date confirmed" },
    ...rejectedDeclinedStatuses,
  ],
  hired: [{ label: "Hired", value: "hired" }],
};

export const statusNames = {
  "invite accepted": "Invited",
  rejected: "Rejected",
  declined: "Declined",
  "to be screened": "To Be Screened",
  "to be submitted": "To Be Submitted",
  "to be approved": "To Be Approved",
  "awaiting review": "Awaiting Review",
  approved: "Approved",
  "assessment sent": "Assessment Sent",
  "assessment returned": "Assessment Returned",
  passed: "Passed",
  interview_requested: "Interview Requested",
  "to be scheduled": "Interview to be Scheduled",
  interview_scheduled: "Interview Scheduled",
  interview_conducted: "Interview Conducted",
  interview_rescheduled: "Interview Rescheduled",
  "to be rescheduled": "Interview to be Rescheduled",
  "invited to event": "Invited to Event",
  "attending event": "Attending Event",
  "to be offered": "To Be Offered",
  "verbally offered": "Verbally Offered",
  "offer sent": "Offer Sent",
  "contract sent": "Contract Sent",
  "verbally accepted": "Verbally Accepted",
  "formally accepted": "Formally Accepted",
  "Gathering Information": "gathering information",
  "gathering information": "gathering information",
  "contract signed": "Contract Signed",
  "start date confirmed": "Start Date Confirmed",
  hired: "Hired",
  invited: "Invited",
  offer_requested: "Offer Requested",
  "hired applicant": "Hired",
};
