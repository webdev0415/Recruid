import React, { useState, useEffect } from "react";
import {
  SelectContainer,
  SaveButton,
  Label,
} from "sharedComponents/filterV2/StyledFilterComponents";
import AttributeSelect from "sharedComponents/AttributeSelect";
import {
  TyperMenuContainer,
  TypeMenuContent,
} from "sharedComponents/filterV2/StyledFilterComponents";
import notify from "notifications";

const FilterStatus = ({
  option,
  setOption,
  saveFilter,
  index,
  store,
  showSelect,
}) => {
  const [statusOptions, setStatusOptions] = useState(undefined);
  const saveValueFilter = () => {
    if (!option.prop_value) {
      notify("danger", "Select an option to filter by");
    } else {
      saveFilter(option, index);
    }
  };

  useEffect(() => {
    if (store.interviewStages && !statusOptions && showSelect) {
      let interviewStageOptions = [];
      store.interviewStages.map(
        (stage) =>
          (interviewStageOptions = [
            ...interviewStageOptions,
            {
              name: stage.name,
              option_group: true,
              group_labels: [
                "Offer Interview",
                "Interview Requested",
                "Interview to be Scheduled",
                "Interview Scheduled",
                "Interview Conducted",
                "Reschedule Interview",
                "Interview to be rescheduled",
                "Invited to Event",
                "Attending Event",
                "Rejected",
                "Declined",
              ],
            },
            {
              name: "Offer Interview",
              value: "offer interview",
              stage: stage.static_name,
            },
            {
              name: "Interview Requested",
              value: "interview_requested",
              stage: stage.static_name,
            },
            {
              name: "Interview to be Scheduled",
              value: "to be scheduled",
              stage: stage.static_name,
            },
            {
              name: "Interview Scheduled",
              value: "interview_scheduled",
              stage: stage.static_name,
            },
            {
              name: "Interview Conducted",
              value: "interview_conducted",
              stage: stage.static_name,
            },
            {
              name: "Reschedule Interview",
              value: "reschedule interview",
              stage: stage.static_name,
            },
            {
              name: "Interview to be rescheduled",
              value: "to be rescheduled",
              stage: stage.static_name,
            },
            {
              name: "Invited to Event",
              value: "invited to event",
              stage: stage.static_name,
            },
            {
              name: "Attending Event",
              value: "attending event",
              stage: stage.static_name,
            },
            { name: "Rejected", value: "rejected", stage: stage.static_name },
            { name: "Declined", value: "declined", stage: stage.static_name },
          ])
      );
      let optionsCopy = [...options];
      optionsCopy.splice(21, 0, ...interviewStageOptions);
      setStatusOptions(optionsCopy);
    }
  }, [store.interviewStages, showSelect, statusOptions]);

  useEffect(() => {
    if (!option.display_text) {
      setOption({ ...option, display_text: option.text_constructor("") });
    }
     
  }, [option]);

  return (
    <>
      {showSelect && (
        <TyperMenuContainer>
          <TypeMenuContent>
            <Label>{option.keyword}</Label>
            <SelectContainer>
              <AttributeSelect
                searchOptions={true}
                placeholder="Select a status..."
                options={statusOptions}
                returnOption={(selected) => {
                  setOption({
                    ...option,
                    display_text: option.text_constructor(selected.name),
                    prop_value: {
                      status: selected.value,
                      stage: selected.stage,
                    },
                  });
                }}
              />
            </SelectContainer>
          </TypeMenuContent>
          <SaveButton onClick={saveValueFilter}>Save</SaveButton>
        </TyperMenuContainer>
      )}
    </>
  );
};

const options = [
  {
    name: "Applied",
    option_group: true,
    group_labels: ["Invite Accepted", "Rejected", "Declined"],
  },
  {
    name: "Invite Accepted",
    value: "invite accepted",
    stage: "applied",
  },
  { name: "Rejected", value: "rejected", stage: "applied" },
  { name: "Declined", value: "declined", stage: "applied" },
  {
    name: "Shortlisted",
    option_group: true,
    group_labels: [
      "To Be Screened",
      "To Be Approved",
      "To Be Submitted",
      "Rejected",
      "Declined",
    ],
  },
  {
    name: "To Be Screened",
    value: "to be screened",
    stage: "shortlisted",
  },
  {
    name: "To Be Approved",
    value: "to be approved",
    stage: "shortlisted",
  },
  {
    name: "To Be Submitted",
    value: "to be submitted",
    stage: "shortlisted",
  },
  { name: "Rejected", value: "rejected", stage: "shortlisted" },
  { name: "Declined", value: "declined", stage: "shortlisted" },
  {
    name: "Submitted",
    option_group: true,
    group_labels: ["Awaiting Review", "Approved", "Rejected", "Declined"],
  },
  {
    name: "Awaiting Review",
    value: "awaiting review",
    stage: "submitted_to_hiring_manager",
  },
  {
    name: "Approved",
    value: "approved",
    stage: "submitted_to_hiring_manager",
  },
  {
    name: "Rejected",
    value: "rejected",
    stage: "submitted_to_hiring_manager",
  },
  {
    name: "Declined",
    value: "declined",
    stage: "submitted_to_hiring_manager",
  },
  {
    name: "Assessment Stage",
    option_group: true,
    group_labels: [
      "Assessment Sent",
      "Assessment Returned",
      "Passed",
      "Rejected",
      "Declined",
    ],
  },
  {
    name: "Assessment Sent",
    value: "assessment sent",
    stage: "assessment_stage",
  },
  {
    name: "Assessment Returned",
    value: "assessment returned",
    stage: "assessment_stage",
  },
  {
    name: "Passed",
    value: "passed",
    stage: "assessment_stage",
  },
  {
    name: "Rejected",
    value: "rejected",
    stage: "assessment_stage",
  },
  {
    name: "Declined",
    value: "declined",
    stage: "assessment_stage",
  },
  {
    name: "Offer Pending",
    option_group: true,
    group_labels: [
      "To be offered",
      "Verbally Offered",
      "Offer Position",
      "Rejected",
      "Declined",
    ],
  },
  {
    name: "To be offered",
    value: "to be offered",
    stage: "offer_pending",
  },
  {
    name: "Verbally Offered",
    value: "verbally offered",
    stage: "offer_pending",
  },
  {
    name: "Offer Position",
    value: "offer position",
    stage: "offer_pending",
  },
  { name: "Rejected", value: "rejected", stage: "offer_pending" },
  { name: "Declined", value: "declined", stage: "offer_pending" },
  {
    name: "Offered",
    option_group: true,
    group_labels: [
      "Offer Requested",
      "Contract Sent",
      "Verbally Accepted",
      "Formally Accepted",
      "Rejected",
      "Declined",
    ],
  },
  { name: "Offer Sent", value: "offer sent", stage: "offered" },
  {
    name: "Offer Requested",
    value: "offer_requested",
    stage: "offered",
  },
  { name: "Contract Sent", value: "contract sent", stage: "offered" },
  {
    name: "Verbally Accepted",
    value: "verbally accepted",
    stage: "offered",
  },
  {
    name: "Formally Accepted",
    value: "formally accepted",
    stage: "offered",
  },
  { name: "Rejected", value: "rejected", stage: "offered" },
  { name: "Declined", value: "declined", stage: "offered" },
  {
    name: "Onboarding",
    option_group: true,
    group_labels: [
      "Gathering Information",
      "Contract Signed",
      "Start Date Confirmed",
      "Rejected",
      "Declined",
    ],
  },
  {
    name: "Gathering Information",
    value: "gathering information",
    stage: "onboarding",
  },
  {
    name: "Contract Signed",
    value: "contract signed",
    stage: "onboarding",
  },
  {
    name: "Start Date Confirmed",
    value: "start date confirmed",
    stage: "onboarding",
  },
  { name: "Rejected", value: "rejected", stage: "onboarding" },
  { name: "Declined", value: "declined", stage: "onboarding" },
  { name: "Hired", option_group: true, group_labels: ["Hired"] },
  { name: "Hired", value: "hired", stage: "hired" },
];

export default FilterStatus;
