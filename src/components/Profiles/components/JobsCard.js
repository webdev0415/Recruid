import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import GlobalContext from "contexts/globalContext/GlobalContext";
import SimpleChangeStatusSelect from "sharedComponents/SimpleChangeStatusSelect";
import { ROUTES } from "routes";
import { stageTitles } from "constants/stageOptions";
import { statusNames } from "constants/stageOptions";
import { CheckboxSvg, MultiselectSvg } from "assets/svg/icons";
import useDropdown from "hooks/useDropdown";

const JobsCard = ({
  job,
  newStatus,
  setNewStatus,
  newStage,
  setNewStage,
  selectedJob,
  setSelectedJob,
  allClientStages,

  canEdit,
}) => {
  const store = useContext(GlobalContext);
  const [status, setStatus] = useState(undefined);
  const [rejected, setRejected] = useState(undefined);
  const [stages, setStages] = useState(undefined);
  const { node, showSelect, setShowSelect } = useDropdown();

  useEffect(() => {
    if (allClientStages[job.job_post.company.id]) {
      setStages([
        { static_name: "applied" },
        { static_name: "shortlisted" },
        { static_name: "submitted_to_hiring_manager" },
        { static_name: "assessment_stage" },
        ...allClientStages[job.job_post.company.id],

        { static_name: "offer_pending" },
        { static_name: "offered" },
        { static_name: "onboarding" },
        { static_name: "hired" },
      ]);
    } else if (store.interviewStages && job) {
      setStages([
        { static_name: "applied" },
        { static_name: "shortlisted" },
        { static_name: "submitted_to_hiring_manager" },
        { static_name: "assessment_stage" },
        ...store.interviewStages,
        { static_name: "offer_pending" },
        { static_name: "offered" },
        { static_name: "onboarding" },
        { static_name: "hired" },
      ]);
    }
  }, [job, store.interviewStages, allClientStages]);

  useEffect(() => {
    if (stages && job) {
      stages.map((stage, index) => {
        if (stage.static_name === job.applicant.stage) {
          setStatus(index + 1);
        }
        return null;
      });
    }
  }, [stages, job]);

  useEffect(() => {
    if (job && status) {
      setRejected(
        job.applicant_status === "declined_manual" ||
          job.applicant_status === "rejected"
          ? status
          : 0
      );
    }
  }, [job, status]);

  const findInterviewStageTitle = (stageProp) => {
    let match;
    if (store.interviewStages) {
      store.interviewStages.map((stage) =>
        stage.static_name === stageProp ? (match = stage.name) : null
      );
    }
    return match;
  };

  return (
    <JobCardSC ref={node}>
      <JobContainer className="leo-flex-center-between">
        <div>
          <Link
            onClick={() => {
              let backdrop = document.querySelector(".modal-backdrop.in");
              if (backdrop) {
                backdrop.style.display = "none";
              }
            }}
            to={ROUTES.JobDashboard.url(
              store.company.mention_tag,
              job.job_post.title_slug
            )}
          >
            <h5>{job.job_post.title}</h5>
          </Link>
          {store.company.type === "Agency" &&
            store.company.id !== job.job_post.company.id && (
              <span>{job.job_post.company.name}</span>
            )}
          <JobStatus>
            <JobBlocks className="leo-flex">
              {stages &&
                stages.map((stage, index) => (
                  <JobBlock
                    key={`job-card-tag-${index}`}
                    className={`${status >= index + 1 && "active"} " " ${
                      rejected === index + 1 && "rejected"
                    }`}
                  />
                ))}
            </JobBlocks>
            {job.applicant && (
              <span>
                {stageTitles[job.applicant.stage]
                  ? stageTitles[job.applicant.stage]
                  : findInterviewStageTitle(job.applicant.stage)}{" "}
                - {statusNames[job.applicant.status] || ""}
              </span>
            )}
          </JobStatus>
        </div>
        <div>
          {canEdit ? (
            <SimpleChangeStatusSelect
              newStatus={
                newStatus && selectedJob?.job_post?.id === job.job_post.id
                  ? newStatus
                  : job.applicant.status
              }
              newStage={
                newStage && selectedJob?.job_post?.id === job.job_post.id
                  ? newStage
                  : job.applicant.stage
              }
              interviewStages={
                allClientStages[job.job_post.company.id] ||
                store.interviewStages
              }
              setStageStatus={(stage, status) => {
                setNewStage(stage);
                setNewStatus(status);
                setSelectedJob(job);
              }}
            />
          ) : (
            job.applicant.status
          )}
        </div>
      </JobContainer>
      {job?.applicant?.application_questions_answers?.length && (
        <div className="questionnaire">
          <button onClick={() => setShowSelect((state) => !state)}>
            View Questionnaire ...
          </button>
          {showSelect &&
            job.applicant.application_questions_answers.map(
              (question, index) => (
                <div
                  key={`qpp-quest-answ-${index}`}
                  className="application-question"
                >
                  <span>{question.question}</span>
                  {question.type === "short" && (
                    <p className="short-answer">{question.answer}</p>
                  )}
                  {question.type === "multiselect" && (
                    <p>
                      <MultiselectSvg selected /> {question.answer}
                    </p>
                  )}
                  {question.type === "checkbox" &&
                    question.answer.map((ans, idx) => (
                      <p key={`qpp-quest-answ-${index}-${idx}`}>
                        <CheckboxSvg checked /> {ans}
                      </p>
                    ))}
                  {!question.answer.length && <p>No answer submitted</p>}
                </div>
              )
            )}
        </div>
      )}
    </JobCardSC>
  );
};

const JobCardSC = styled.div`
  background: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.05);
  padding: 15px;
  max-width: 700px;
  width: 100%;
  margin-bottom: 10px;

  .questionnaire {
    margin-top: 15px;

    button {
      font-weight: 600;
      font-size: 12px;
      color: #2a3744;
    }
  }

  .application-question {
    margin: 20px 0;

    span {
      margin-bottom: 10px;
      font-weight: 600;
      font-size: 14px;
      color: #2a3744;
    }

    p {
      margin: 0;
      padding: 0;
      font-weight: 500;
      font-size: 12px;
      color: #74767b;
    }
  }
`;

const JobContainer = styled.div`
  h5 {
    color: #1e1e1e;
    font-size: 16px;
    font-weight: 500;
    line-height: normal;
    margin-bottom: 6px;
  }

  span {
    color: #74767b;
    font-size: 12px;
  }

  select {
    margin: 0;
  }
`;

const JobStatus = styled.div`
  margin-top: 8px;

  span {
    color: #1e1e1e;
  }
`;

const JobBlocks = styled.div`
  margin-bottom: 7px;
`;

const JobBlock = styled.div`
  background: #d8d8d8;
  height: 2px;
  width: 30px;

  &.active {
    background: #00cba7;
  }

  &.rejected {
    background: #ff3159;
  }

  &:not(:last-child) {
    margin-right: 2px;
  }
`;

export default JobsCard;
