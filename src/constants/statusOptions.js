export const JobStatusOptions = {
  open: {
    prop: "open",
    title: "Open",
    text: "Set the Job Status to Open",
    background: "#004A6D",
  },
  hired: {
    prop: "hired",
    title: "Hired",
    text: "Set the Job Status to Hired",
    background: "secondary_3",
  },

  closed: {
    prop: "closed",
    title: "Closed",
    text: "Set the Job Status to Closed",
    background: "black",
  },
  "awaiting for review": {
    prop: "awaiting for review",
    title: "Waiting for Review",
    text: "This job is pending review",
    background: "#FFA076",
    hidden: true,
  },
  declined: {
    prop: "declined",
    title: "Declined",
    text: "This job review has been declined",
    background: "#F27881",
    hidden: true,
  },
  approved: {
    prop: "approved",
    title: "Approved",
    text: "This job has been approved",
    background: "secondary_3",
    hidden: true,
  },
};

export const CandidateStatusOptions = {
  invited: {
    prop: "invited",
    title: "Invited",
    option_title: "Send Invitation",
    text: "Invite candidate to the platform",
    background: "#9A9CA1",
  },
  passive: {
    prop: "passive",
    title: "Passive",
    text: "Set Status to Passive",
    background: "secondary_3",
  },
  active: {
    prop: "active",
    title: "Active",
    text: "Set Status to Active",
    background: "secondary_3",
  },
  "not active": {
    prop: "not active",
    title: "Not Active",
    text: "Set Status to Not Active",
    background: "#A8ABB1",
  },
  private: {
    prop: "private",
    title: "Invited",
    option_title: "Re-Send Invitation",
    text: "Set Status to Private",
    background: "black",
    hidden: true,
  },
  available: {
    prop: "available",
    title: "Available",
    text: "Set Status to Available",
    background: "#ff3159",
    // hidden: true,
  },
};
export const clientStatusOptions = {
  lead: {
    prop: "lead",
    title: "Lead",
    option_title: "Lead Client",
    text: "There are active deals with the client",
    background: "secondary_3",
  },
  active: {
    prop: "active",
    title: "Active",
    option_title: "Active Client",
    text: "There are active jobs with the client",
    background: "#004A6D",
  },
  business_terminated: {
    prop: "business_terminated",
    title: "Business Ended",
    option_title: "Business Ended",
    text: "No longer in business with the Client",
    background: "black",
  },
  re_engage: {
    prop: "re_engage",
    title: "Re-Engage",
    option_title: "Re-Engage with Client",
    text: "Need to re-engage with the client",
    background: "#FFA076",
  },
};
