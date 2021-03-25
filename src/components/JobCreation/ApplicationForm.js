import React from "react";
import styled from "styled-components";
import { SectionTitle } from "components/JobCreation/components";
import { ATSContainer } from "styles/PageContainers";
import JobCheckbox from "components/JobCreation/components/JobCheckbox";
import StatusSelect from "sharedComponents/StatusSelect";
import JobFormPreview from "components/JobCreation/components/JobFormPreview";
import QuestionsComponent from "components/JobCreation/components/QuestionsComponent";

const ApplicationForm = ({
  store,
  job,
  setJob,
  application,
  setApplication,
  originalLocations,
  companyData,
  setUpdated,
  applicationQuestions,
  setApplicationQuestions,
}) => {
  return (
    <ATSContainer>
      <Text>Post to your careers website</Text>
      <CheckBoxesGrid>
        <JobCheckbox
          checked={job.job_post_type === "public"}
          labelText="Yes"
          onClick={() => {
            setUpdated(36);
            setJob({
              ...job,
              job_post_type: "public",
            });
          }}
        />
        <JobCheckbox
          checked={job.job_post_type === "private"}
          labelText="No"
          onClick={() => {
            setUpdated(37);
            setJob({
              ...job,
              job_post_type: "private",
              post_to_google: false,
              post_to_leo: false,
            });
          }}
        />
      </CheckBoxesGrid>
      <Separator />
      <SectionTitle>Customise your application form</SectionTitle>
      <FlexContainer>
        <ApplicationContainer
          className={job.job_post_type === "private" ? "disabled" : ""}
        >
          <BoxTitle>Personal Information</BoxTitle>
          <BoxRow>
            <Name>Name and Surname</Name>
            <StatusSelect
              selectedStatus={application.input_fields.name}
              statusOptions={requirementOptions}
              onStatusSelect={(status) =>
                setApplication({
                  ...application,
                  input_fields: { ...application.input_fields, name: status },
                })
              }
              disabled={true}
            />
          </BoxRow>
          <BoxRow>
            <Name>Email</Name>
            <StatusSelect
              selectedStatus={application.input_fields.email}
              statusOptions={{
                optional: requirementOptions.optional,
                required: requirementOptions.required,
              }}
              onStatusSelect={(status) =>
                setApplication({
                  ...application,
                  input_fields: { ...application.input_fields, email: status },
                })
              }
              disabled={true}
            />
          </BoxRow>
          <BoxRow>
            <Name className="last">Mobile Number</Name>
            <StatusSelect
              selectedStatus={application.input_fields.phone}
              statusOptions={requirementOptions}
              onStatusSelect={(status) =>
                setApplication({
                  ...application,
                  input_fields: { ...application.input_fields, phone: status },
                })
              }
              disabled={job.job_post_type === "private"}
            />
          </BoxRow>
          <BoxTitle>Details</BoxTitle>
          <BoxRow>
            <Name>Resume</Name>
            <StatusSelect
              selectedStatus={application.input_fields.resume}
              statusOptions={requirementOptions}
              onStatusSelect={(status) =>
                setApplication({
                  ...application,
                  input_fields: { ...application.input_fields, resume: status },
                })
              }
              disabled={true}
            />
          </BoxRow>
          <BoxRow className="last">
            <Name>Cover Letter</Name>
            <StatusSelect
              selectedStatus={application.input_fields.cover_letter}
              statusOptions={requirementOptions}
              onStatusSelect={(status) =>
                setApplication({
                  ...application,
                  input_fields: {
                    ...application.input_fields,
                    cover_letter: status,
                  },
                })
              }
              disabled={job.job_post_type === "private"}
            />
          </BoxRow>
          <BoxTitle>Questions</BoxTitle>
          <QuestionsComponent
            applicationQuestions={applicationQuestions}
            setApplicationQuestions={setApplicationQuestions}
            disabled={job.job_post_type === "private"}
            job={job}
          />
        </ApplicationContainer>
        <JobFormPreview
          application={application}
          previewWarn={true}
          job={job}
          store={store}
          disabled={job.job_post_type === "private"}
          originalLocations={originalLocations}
          companyData={companyData}
          applicationQuestions={applicationQuestions}
        />
      </FlexContainer>
    </ATSContainer>
  );
};

export default ApplicationForm;

const FlexContainer = styled.div`
  display: grid;
  grid-gap: 50px;
  grid-template-columns: 1fr 500px;
  margin-top: 30px;
`;

const CheckBoxesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  width: min-content;
`;

const Text = styled.p`
  font-size: 14px;
  margin-top: 20px !important;
  margin-bottom: 20px !important;
`;

const ApplicationContainer = styled.div`
  border: 1px solid #eeeeee;
  border-radius: 4px;
  width: 100%;
  margin-right: 20px;
  height: max-content;
  width: 100%;

  &.disabled {
    opacity: 0.2;
  }
`;

const BoxTitle = styled.div`
  background: rgba(238, 238, 238, 0.36);
  border-bottom: solid #eee 1px;
  font-size: 18px;
  font-weight: 500;
  line-height: 22px;
  padding: 20px 25px;
  width: 100%;
`;

export const BoxRow = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-between",
}))`
  border-bottom: solid #eee 1px;
  padding: 20px 25px;

  &.last {
    border-bottom: none;
    padding-bottom: 45px;
  }
`;

const Name = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
`;

const Separator = styled.div`
  background: #dfe9f4;
  grid-column: span 2;
  height: 2px;
  margin-top: 50px;
  width: 100%;
`;

const requirementOptions = {
  optional: {
    prop: "optional",
    title: "Optional",
    option_title: "Optional",
    text: "The candidate can skip this step",
    background: "complementary_5",
  },
  required: {
    prop: "required",
    title: "Required",
    option_title: "Required",
    text: "The candidate must fill this step",
    background: "secondary_4",
  },
  disabled: {
    prop: "disabled",
    title: "Disabled",
    option_title: "Disabled",
    text: "This step will not show for the candidate",
    background: "black",
  },
};
