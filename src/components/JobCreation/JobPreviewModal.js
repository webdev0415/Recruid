import React from "react";
import styled from "styled-components";
import UniversalModal, {
  ModalBody,
} from "modals/UniversalModal/UniversalModal";
import NumberFormat from "react-number-format";
import JobFormPreview from "components/JobCreation/components/JobFormPreview";
import {
  isHtmlStringEmpty,
  findSomeLocation,
} from "components/JobCreation/helpers";
import { JOB_TYPES, EXPERIENCE_LEVELS } from "constants/job";
import { AWS_CDN_URL } from "constants/api";

const JobPreviewModal = ({
  application,
  job,
  store,
  closeModal,
  originalLocations,
  companyData,
  applicationQuestions,
}) => {
  const location = findSomeLocation(
    originalLocations,
    job.localizations_attributes
  );
  return (
    <UniversalModal
      show={true}
      hide={closeModal}
      id={"JobPreviewModal"}
      width={1040}
    >
      <ModalBody style={{ borderRadius: "4px" }}>
        <JobHeader className="leo-flex-center-between">
          <h3>Job Preview</h3>
          <button onClick={() => closeModal()}>
            <img src={`${AWS_CDN_URL}/icons/CloseSvg.svg`} alt="Close" />
          </button>
        </JobHeader>
        <ModalInfo className="leo-flex-center-center">
          <img
            src={companyData?.careers_portal?.logo || store.company.avatar_url}
            alt="Company Logo"
          />
          <h4>{job.title}</h4>
          <h5>{location}</h5>
          <div className="leo-flex-center-center">
            {job.experience_level && (
              <FlexBox className="right-margin">
                <label>Experience</label>
                <span>{EXPERIENCE_LEVELS[job.experience_level]}</span>
              </FlexBox>
            )}
            {job.job_type && (
              <FlexBox className="right-margin">
                <label>Job Type</label>
                <span>{JOB_TYPES[job.job_type]}</span>
              </FlexBox>
            )}
            {job.salary_status !== "hidden" && (
              <FlexBox className="right-margin">
                <label className="title-label">Salary</label>
                {job.salary_status === "negotiable" && <span>Negotiable</span>}
                {job.salary_status === "display" && (
                  <>
                    {job.job_type !== "temp" && (
                      <span>
                        <NumberFormat
                          value={job.min_rate}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={store.company.currency?.currency_name}
                          renderText={(value) => <>{value}</>}
                        />
                        {job.min_rate && job.max_rate && <> - </>}
                        <NumberFormat
                          value={job.max_rate}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={store.company.currency?.currency_name}
                          renderText={(value) => <>{value}</>}
                        />
                        {job.max_rate || job.min_rate
                          ? `/${periodExchanger[job.salary_interval]}`
                          : ""}
                      </span>
                    )}
                    {job.job_type === "temp" && job.pay_rate && (
                      <span>
                        {store.company.currency?.currency_name}
                        {job.pay_rate / 100}/
                        {job.pay_interval === "hourly" ? "hour" : "day"}
                      </span>
                    )}
                  </>
                )}
              </FlexBox>
            )}
            {job.salary_status !== "hidden" && job.salary_bonus && (
              <FlexBox className="right-margin">
                <label>Salary Bonus</label>
                <span>{job.salary_bonus}</span>
              </FlexBox>
            )}
          </div>
        </ModalInfo>
        <JobPreviewBody>
          <JobPreviewContent>
            <h4>{job.title}</h4>
            <h5>{location}</h5>
            {job.description && !isHtmlStringEmpty(job.description) && (
              <>
                <h6 className="section-title">Job Description</h6>
                <div dangerouslySetInnerHTML={{ __html: job.description }} />
              </>
            )}
            {job.requirements && !isHtmlStringEmpty(job.requirements) && (
              <>
                <h6 className="section-title">Requirements</h6>
                <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
              </>
            )}
            {job.benefits && !isHtmlStringEmpty(job.benefits) && (
              <>
                <h6 className="section-title">Benefits</h6>
                <div dangerouslySetInnerHTML={{ __html: job.benefits }} />
              </>
            )}
            {companyData &&
              companyData.career_portal &&
              companyData.careers_portal &&
              companyData.careers_portal.description && (
                <>
                  <h6 className="section-title">About {companyData.name}</h6>
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {companyData.careers_portal?.description}
                  </div>
                </>
              )}
          </JobPreviewContent>
          <JobFormPreview
            application={application}
            job={job}
            store={store}
            originalLocations={originalLocations}
            companyData={companyData}
            applicationQuestions={applicationQuestions}
          />
        </JobPreviewBody>
      </ModalBody>
    </UniversalModal>
  );
};

export default JobPreviewModal;

const JobHeader = styled.div`
  background: #f9f9f9;
  height: 71px;
  padding: 0px 25px;
  font-weight: 500;
  font-size: 20px;
`;

const ModalInfo = styled.div`
  border-bottom: solid #e7ebef 1px;
  flex-direction: column;
  margin-left: 40px;
  margin-right: 40px;
  padding-bottom: 30px;
  padding-top: 30px;

  img {
    max-width: 100px;
    margin-bottom: 20px;
    max-height: 100px;
  }

  h4 {
    font-size: 18px;
    font-weight: 500;
    line-height: 22px;
    margin-bottom: 2px;
  }

  h5 {
    color: #798999;
    font-size: 15px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;

const FlexBox = styled.div`
  text-align: center;
  label {
    color: #798999;
    font-size: 12px;
    line-height: 15px;
    margin-bottom: 5px;
  }

  span {
    color: #2a3744;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    min-height: 25px;
  }

  &.right-margin {
    margin-right: 40px;
    margin-left: 40px;
  }
`;

const JobPreviewBody = styled.div`
  align-items: start;
  display: grid;
  grid-gap: 50px;
  grid-template-columns: 1fr 400px;
  padding: 40px;
`;
const JobPreviewContent = styled.div`
  h4 {
    font-weight: 500;
    font-size: 22px;
    line-height: 27px;
  }

  h5 {
    font-size: 16px;
    line-height: 19px;
  }

  .section-title {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #2a3744;
    margin-top: 25px;
    margin-bottom: 10px;
  }
`;

const periodExchanger = {
  yearly: "year",
  hourly: "hour",
  daily: "day",
};
