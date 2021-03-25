import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AppButton from "styles/AppButton";
import { findSomeLocation } from "components/JobCreation/helpers";
import { QuestionTooltip } from "./QuestionComponent/QuestionTooltip";
import { MultiselectSvg, CheckboxSvg } from "assets/svg/icons";

const JobFormPreview = ({
  previewWarn,
  job,
  store,
  disabled,
  originalLocations,
  application,
  companyData,
  applicationQuestions,
}) => {
  const [location, setLocation] = useState(undefined);

  useEffect(() => {
    if (job) {
      setLocation(
        findSomeLocation(originalLocations, job.localizations_attributes)
      );
    }
  }, [job.localizations_attributes, originalLocations]);

  return (
    <Wrapper className={disabled ? "disabled" : ""}>
      {previewWarn && <PrevWarn>Preview of your application form</PrevWarn>}

      <Header className="leo-flex">
        {(companyData?.careers_portal?.logo || store.company.avatar_url) && (
          <img
            src={companyData?.careers_portal?.logo || store.company.avatar_url}
            alt="Company Logo"
          />
        )}
        <JobText>
          <h4>{job.title}</h4>
          <h5 className="leo-flex-center">{location}</h5>
        </JobText>
      </Header>
      {application.input_fields.name !== "disabled" && (
        <div>
          <FormLabel>
            Name {application.input_fields.name === "required" && <i>*</i>}
          </FormLabel>
          <FormInput placeholder="Name" disabled />
        </div>
      )}

      {application.input_fields.email !== "disabled" && (
        <div>
          <FormLabel>
            Email {application.input_fields.email === "required" && <i>*</i>}
          </FormLabel>
          <FormInput placeholder="Email address" disabled />
        </div>
      )}

      {application.input_fields.phone !== "disabled" && (
        <div>
          <FormLabel>
            Mobile Number{" "}
            {application.input_fields.phone === "required" && <i>*</i>}
          </FormLabel>
          <FormInput placeholder="Mobile Number" disabled />
        </div>
      )}

      {application.input_fields.resume !== "disabled" && (
        <div>
          <FormLabel>
            Resume {application.input_fields.resume === "required" && <i>*</i>}
          </FormLabel>
          <FormDropArea>
            <strong>Upload a file</strong> or drag and drop here
          </FormDropArea>
        </div>
      )}

      {application.input_fields.cover_letter !== "disabled" && (
        <div>
          <FormLabel>
            Cover Letter{" "}
            {application.input_fields.cover_letter === "required" && <i>*</i>}
          </FormLabel>
          <FormDropArea>
            <strong>Upload a file</strong> or drag and drop here
          </FormDropArea>
        </div>
      )}
      {application.input_fields.questions &&
        application.input_fields.questions.map((question, inx) => (
          <div key={`input-fields-${inx}`}>
            <FormLabel>
              {question.question}
              {question.status === "required" && <i>*</i>}
            </FormLabel>
            <FormTextArea rows="4" placeholder="Answer..." />
          </div>
        ))}
      {applicationQuestions?.map((question, index) => (
        <div key={`application-question-${index}`}>
          <FormLabel>
            {question.question}
            {!!question.note?.length && (
              <QuestionTooltip questionNote={question.note} />
            )}
          </FormLabel>
          {question.type === "short" && (
            <FormTextArea disabled rows="4" placeholder="Answer..." />
          )}
          {question.type !== "short" &&
            question.answers?.map((answer, idx) => (
              <FormSelectList
                className="leo-flex"
                key={`application-question-${index}-answer-${idx}`}
              >
                {question.type === "checkbox" && (
                  <CheckboxSvg checked={false} />
                )}
                {question.type === "multiselect" && (
                  <MultiselectSvg selected={false} />
                )}
                <span>{answer}</span>
              </FormSelectList>
            ))}
        </div>
      ))}
      <CheckboxContainer className="leo-flex leo-align-start">
        <input type="checkbox" disabled />
        <p>
          {`I have read and accept Recruitd's Privacy Policy and Terms of Use.`}
        </p>
      </CheckboxContainer>
      <AppButton theme="dark-blue" disabled className="leo-flex">
        Apply
      </AppButton>
    </Wrapper>
  );
};

export default JobFormPreview;

const Wrapper = styled.div`
  background: #f7f9fc;
  border-radius: 4px;
  padding: 25px;
  width: 100%;

  &.disabled {
    opacity: 0.2;
  }
`;

const PrevWarn = styled.div`
  border-bottom: 1px solid #e7ebef;
  color: #2a3744;
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 40px;
  padding-bottom: 15px;
  text-align: left;
`;

const Header = styled.div`
  flex-direction: column;

  img {
    min-width: 50px;
    margin-bottom: 20px;
    max-height: 100px;
    max-width: 100px;
  }
`;

const JobText = styled.div`
  h4 {
    font-weight: 600;
    font-size: 20px;
    color: #2a3744;
    word-wrap: anywhere;
  }

  h5 {
    font-size: 16px;
    color: #798999;
  }
`;

const FormLabel = styled.label.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center",
}))`
  font-size: 14px;
  margin-top: 25px;
  margin-bottom: 10px;

  i {
    color: #35c3ae;
  }
`;
const FormInput = styled.input`
  background: #fff;
  border: 1px solid #e7ebef;
  border-radius: 4px;
  font-size: 14px;
  height: 40px;
  padding: 5px 15px;
  pointer-events: none;
  width: 100%;
`;

const FormTextArea = styled.textarea`
  border: 1px solid #e7ebef;
  border-radius: 4px;
  padding: 5px 8px;
  width: 100%;
  background: #fff;
  font-size: 14px;
  resize: "none";
`;
const FormDropArea = styled.div`
  background: #fff;
  border: 1px dashed #e7ebef;
  border-radius: 4px;
  font-size: 14px;
  padding: 10px 15px;
  pointer-events: none;
`;

const FormSelectList = styled.div`
  margin: 10px 0 10px 10px;
  span {
    font-size: 14px;
  }
`;

const CheckboxContainer = styled.div`
  margin-top: 35px;
  margin-bottom: 35px;
  font-size: 12px;

  input {
    margin-top: 5px;
    margin-right: 10px;
  }
`;
