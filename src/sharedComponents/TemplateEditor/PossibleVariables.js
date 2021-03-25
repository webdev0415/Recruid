export const PROTO_VARIABLES = {
  candidate_name: {
    prop_value: "first_name",
    prop_title: "First Name",
    default_value: "Candidate",
  },
  candidate_surname: {
    prop_value: "last_name",
    prop_title: "Last Name",
    default_value: "Candidate",
  },
  candidate_email: {
    prop_value: "tn_email",
    prop_title: "Email Address",
    default_value: "Email Address",
  },
  candidate_phone: {
    prop_value: "number",
    prop_title: "Mobile Number",
    default_value: "Mobile Number",
  },
  candidate_location: {
    prop_value: "locations",
    prop_title: "Location",
    default_value: "Location",
  },
  job_title: {
    prop_value: "title",
    prop_title: "Title",
    default_value: "Title",
  },
  job_location: {
    prop_value: "locations",
    prop_title: "Location",
    default_value: "Locaton",
  },
  job_salary: {
    prop_value: "salary",
    prop_title: "Salary",
    default_value: "Salary",
  },
  job_type: {
    prop_value: "job_type",
    prop_title: "Job Type",
    default_value: "Job Type",
  },
  job_position: {
    prop_value: "available_positions",
    prop_title: "Job Position",
    default_value: "Job Position",
  },
  job_link: {
    prop_value: "slugified",
    prop_title: "Job Link",
    default_value: "Job Link",
    special_case: true,
    explanation: "This will add a link to your career portal.",
  },
  contact_name: {
    prop_value: "first_name",
    prop_title: "First Name",
    default_value: "Client",
  },
  contact_surname: {
    prop_value: "last_name",
    prop_title: "Last Name",
    default_value: "Client",
  },
  contact_email: {
    prop_value: "email",
    prop_title: "Email",
    default_value: "Email",
  },
  contact_number: {
    prop_value: "number",
    prop_title: "Number",
    default_value: "Number",
  },
  client_name: {
    prop_value: "name",
    prop_title: "Name",
    default_value: "Name",
  },
  client_location: {
    prop_value: "locality",
    prop_title: "Location",
    default_value: "Location",
  },
  client_domain: {
    prop_value: "domain",
    prop_title: "Domain",
    default_value: "Domain",
  },
};

const candidate_prototype = {
  source: "ProfessionalTalentNetwork",
  source_title: "Candidate",
};

export const job_protoype = {
  source: "JobPost",
  source_title: "Job",
};

const contact_prototype = {
  source: "Client",
  source_title: "Contact",
};

const client_prototype = {
  source: "Company",
  source_title: "Client",
};

export const CANDIDATE_VARIABLES = [
  { ...PROTO_VARIABLES.candidate_name, ...candidate_prototype },
  { ...PROTO_VARIABLES.candidate_surname, ...candidate_prototype },
  { ...PROTO_VARIABLES.candidate_email, ...candidate_prototype },
  { ...PROTO_VARIABLES.candidate_phone, ...candidate_prototype },
  { ...PROTO_VARIABLES.candidate_location, ...candidate_prototype },
];

export const JOB_VARIABLES = [
  { ...PROTO_VARIABLES.job_title, ...job_protoype },
  { ...PROTO_VARIABLES.job_location, ...job_protoype },
  { ...PROTO_VARIABLES.job_salary, ...job_protoype },
  { ...PROTO_VARIABLES.job_type, ...job_protoype },
  { ...PROTO_VARIABLES.job_position, ...job_protoype },
];

export const CONTACT_VARIABLES = [
  { ...PROTO_VARIABLES.contact_name, ...contact_prototype },
  { ...PROTO_VARIABLES.contact_surname, ...contact_prototype },
  { ...PROTO_VARIABLES.contact_email, ...contact_prototype },
  { ...PROTO_VARIABLES.contact_number, ...contact_prototype },
];

export const CLIENT_VARIABLES = [
  { ...PROTO_VARIABLES.client_name, ...client_prototype },
  { ...PROTO_VARIABLES.client_location, ...client_prototype },
  { ...PROTO_VARIABLES.client_domain, ...client_prototype },
];

export const ALL_VARIABLES = [
  ...CANDIDATE_VARIABLES,
  ...JOB_VARIABLES,
  ...CLIENT_VARIABLES,
  ...CONTACT_VARIABLES,
];
