import {
  JOB_TYPES,
  JOB_STATUS,
  HIRE_TYPES,
  WORKING_HOURS,
  ADVERTISED_OPTIONS,
} from "constants/job";

export const availabilityOptions = [
  { name: "Invited", value: "invited" },
  { name: "Passive", value: "passive" },
  { name: "Active", value: "active" },
  { name: "Available", value: "available" },
  { name: "Not Active", value: "not active" },
];

export const genderOptions = [
  { name: "Female", value: "female" },
  { name: "Male", value: "male" },
  { name: "Other", value: "other" },
  { name: "Prefer not say", value: "prefer not say" },
  { name: "Not defined", value: "not defined" },
];

export const statusOptions = Object.entries(JOB_STATUS).map((status) => {
  return { name: status[1], value: status[0] };
});
export const typeOptions = Object.entries(JOB_TYPES).map((status) => {
  return { name: status[1], value: status[0] };
});
export const hireOptions = Object.entries(HIRE_TYPES).map((status) => {
  return { name: status[1], value: status[0] };
});
export const workingHoursOptions = Object.entries(WORKING_HOURS).map(
  (status) => {
    return { name: status[1], value: status[0] };
  }
);
export const advertisedOptions = Object.entries(ADVERTISED_OPTIONS).map(
  (status) => {
    return { name: status[1], value: status[0] };
  }
);

export const stageOptions = [
  { value: "applied", name: "Applied" },
  { value: "shortlisted", name: "Shortlisted" },
  {
    value: "submitted_to_hiring_manager",
    name: "Submitted",
  },
  { value: "assessment_stage", name: "Assessment Stage" },
  { value: "offer_pending", name: "Offer Pending" },
  { value: "offered", name: "Offered" },
  { value: "onboarding", name: "Onboarding" },
  { value: "hired", name: "Hired" },
];

export const taskTypes = [
  { name: "Call", value: "Call" },
  { name: "Email", value: "Email" },
  { name: "To-do", value: "To-do" },
];

export const taskPriority = [
  { name: "High", value: "High" },
  { name: "Medium", value: "Medium" },
  { name: "Low", value: "Low" },
];

export const taskSource = [
  { name: "Candidate", value: "candidate" },
  { name: "Deal", value: "deal" },
  { name: "Contact", value: "contact" },
  { name: "Client", value: "client" },
];

export const workplaceOptions = [
  { name: "Remote", value: "remote" },
  { name: "Flexible", value: "flexible" },
  { name: "In Office", value: "office" },
];
export const clientStatusOptions = [
  { name: "Lead", value: "lead" },
  { name: "Active", value: "active" },
  { name: "Business Ended", value: "business_terminated" },
  { name: "Re-Engage", value: "re_engage" },
];
