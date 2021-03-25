import React, { useEffect, useState } from "react";
import { SectionTitle } from "components/JobCreation/components";
import { ATSContainer } from "styles/PageContainers";
import styled from "styled-components";
import JobCheckbox from "components/JobCreation/components/JobCheckbox";
import { AWS_CDN_URL } from "constants/api";

const PostJobBoards = ({ job, setJob, setUpdated }) => {
  const [showCareerOptions, setShowCareerOptions] = useState(undefined);
  useEffect(() => {
    if (job && showCareerOptions === undefined) {
      setShowCareerOptions(job.job_post_type !== "private");
    }
  }, [job, showCareerOptions]);

  return (
    <ATSContainer>
      <SectionTitle>Publish the job to a selection of job boards</SectionTitle>
      <Text>
        Post to a selection of free job boards on Leo’s network and receive
        applications straight into your job.
        <br />* Note that you need to have Careers Portal enabled.
      </Text>
      {showCareerOptions && (
        <>
          <Text>Post to your careers website</Text>
          <CheckBoxesGrid>
            <JobCheckbox
              checked={job.job_post_type === "public"}
              labelText="Yes"
              onClick={() => {
                setUpdated(34);
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
                setUpdated(35);
                setJob({
                  ...job,
                  job_post_type: "private",
                  post_to_google: false,
                  post_to_leo: false,
                });
              }}
            />
          </CheckBoxesGrid>
          <Separator style={{ marginBottom: 60 }} />
        </>
      )}

      <div className="leo-flex-center">
        <JobBoard
          className={job.job_post_type === "public" ? "" : "inactive"}
          onClick={() =>
            job.job_post_type === "public"
              ? setJob({ ...job, post_to_leo: !job.post_to_leo })
              : null
          }
          disabled={job.job_post_type === "private"}
        >
          {job.post_to_leo && (
            <img
              src={`${AWS_CDN_URL}/icons/PostToJobCheckmark.svg`}
              alt="Checked"
              className="checkmark-image"
            />
          )}
          <img
            src={`${AWS_CDN_URL}/illustrations/logo-leo.svg`}
            alt={"Leo Jobs"}
          />
        </JobBoard>
        <JobBoard
          onClick={() =>
            job.job_post_type === "public"
              ? setJob({ ...job, post_to_google: !job.post_to_google })
              : null
          }
          className={job.job_post_type === "public" ? "" : "inactive"}
        >
          {job.post_to_google && (
            <img
              src={`${AWS_CDN_URL}/icons/PostToJobCheckmark.svg`}
              alt="Checked"
              className="checkmark-image"
            />
          )}
          <img
            src={`${AWS_CDN_URL}/illustrations/logo-googlejobs.png`}
            alt={"Google Jobs"}
          />
        </JobBoard>
        <JobBoard className="inactive">
          <img
            src={`${AWS_CDN_URL}/illustrations/logo-facebookjobs.png`}
            alt={"Facebook Jobs"}
          />
        </JobBoard>
        <JobBoard className="inactive">
          <img
            src={`${AWS_CDN_URL}/illustrations/logo-indeed.png`}
            alt={"Indeed Jobs"}
          />
        </JobBoard>
        <JobBoard className="inactive">
          <img
            src={`${AWS_CDN_URL}/illustrations/logo-glassdoor.png`}
            alt={"Glassdoor Jobs"}
          />
        </JobBoard>
        <JobBoard className="inactive">
          <img
            src={`${AWS_CDN_URL}/illustrations/logo-ziprecruiter.png`}
            alt={"ZipRecruiter Jobs"}
          />
        </JobBoard>
      </div>
    </ATSContainer>
  );
};

export default PostJobBoards;

const Text = styled.p`
  font-size: 14px;
  margin-top: 20px !important;
`;

const JobBoard = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-center leo-relative",
}))`
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  height: 100px;
  width: 100px;

  img {
    height: 20px;
  }

  svg,
  .checkmark-image {
    position: absolute;
    right: -6px;
    top: -6px;
  }

  &:not(:last-child) {
    margin-right: 20px;
  }

  &.inactive {
    cursor: auto;
    opacity: 0.25;
  }
`;

const CheckBoxesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  width: min-content;
`;

const Separator = styled.div`
  background: #dfe9f4;
  grid-column: span 2;
  height: 2px;
  margin-top: 50px;
  width: 100%;
`;
