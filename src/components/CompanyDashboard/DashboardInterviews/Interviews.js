import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ROUTES } from "routes";

import AvatarIcon from "sharedComponents/AvatarIcon";

const Interviews = ({ company, data, mentionTag }) => {
  return (
    <InterviewsContainer>
      {data.length > 0 ? (
        data.map((interview, i) => {
          return (
            <InterviewContainer key={i} className="leo-flex">
              <InterviewTime>
                <svg
                  width="15"
                  height="15"
                  xmlns="http://www.w3.org/2000/svg"
                  xlinkHref="http://www.w3.org/1999/xlink"
                >
                  <g fill="none" fill-role="evenodd">
                    <path
                      stroke="#E1E1E1"
                      fill="#FFF"
                      d="M-40.5-625.5h1060v767h-1060z"
                    />
                    <path
                      d="M8.203 9.023h-.01L3.69 8.552a.584.584 0 01-.527-.583c0-.303.227-.554.527-.583l2.886-.289.34-3.406c.03-.3.28-.527.583-.527.302 0 .553.227.582.527l.473 4.97a.355.355 0 01-.352.362M7.5 0A7.5 7.5 0 000 7.5 7.5 7.5 0 107.5 0"
                      fill="#C1C3C8"
                      fill-role="nonzero"
                    />
                  </g>
                </svg>
                {interview.interaction.body.selected_dates}
              </InterviewTime>
              <InterviewCandidate
                to={ROUTES.CandidateProfile.url(
                  mentionTag,
                  interview.candidate.id
                )}
              >
                <div style={{ marginRight: 10 }}>
                  <AvatarIcon
                    imgUrl={interview.candidate.avatar_url}
                    name={interview.candidate.name}
                    shape={"circle"}
                    size={30}
                  />
                </div>
                {interview.candidate.name}
              </InterviewCandidate>
              <InterviewJob>
                {company.id === interview.interaction.company_id ? (
                  <div style={{ marginRight: 10 }}>
                    <AvatarIcon
                      imgUrl={company.avatar_url}
                      name={company.name}
                      shape={"circle"}
                      size={30}
                    />
                  </div>
                ) : (
                  <>
                    {interview.interaction.client_name ? (
                      <div style={{ marginRight: 10 }}>
                        <AvatarIcon
                          imgUrl={""}
                          name={interview.interaction.client_name}
                          shape={"circle"}
                          size={30}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                )}
                <Link
                  to={ROUTES.JobDashboard.url(
                    mentionTag,
                    interview.interaction.job_id,
                    "applicants"
                  )}
                >
                  {interview.job.title}
                </Link>
              </InterviewJob>
              <InterviewParticipants className="leo-justify-end">
                {interview.participants.map((participant, i) => (
                  <InterviewParticipant key={i}>
                    <AvatarIcon
                      imgUrl={participant.avatar_url}
                      name={participant.name}
                      shape={"circle"}
                      size={30}
                    />
                  </InterviewParticipant>
                ))}
              </InterviewParticipants>
            </InterviewContainer>
          );
        })
      ) : (
        <InterviewContainer className="leo-flex">
          You have no upcoming interviews
        </InterviewContainer>
      )}
    </InterviewsContainer>
  );
};

export default Interviews;

const InterviewsContainer = styled.div`
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
`;

const InterviewContainer = styled.div`
  align-items: center;
  font-size: 14px;
  justify-content: space-between;
  padding: 10px;

  &:not(:last-of-type) {
    border-bottom: 1px solid#eee;
  }

  @media screen and (min-width: 902px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 100px;
    justify-content: normal;
    padding: 10px 20px;
  }
`;

const InterviewCandidate = styled(Link).attrs((props) => ({
  className: (props.className || "") + " leo-flex-center leo-pointer ",
}))`
  font-weight: 500;

  div {
    display: none;
  }

  @media screen and (min-width: 902px) {
    div {
      display: flex;
    }
  }
`;

const InterviewJob = styled.div`
  align-items: center;
  display: none;

  a {
    color: #1e1e1e;
  }

  @media screen and (min-width: 902px) {
    display: flex;
  }
`;

const InterviewTime = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center",
}))`
  color: #74767b;

  svg {
    margin-right: 10px;
  }
`;

const InterviewParticipants = styled.div`
  display: none;

  @media screen and (min-width: 902px) {
    display: flex;
  }
`;

const InterviewParticipant = styled.div`
  margin-left: -10px;
  z-index: 1;
  background: rgb(255, 255, 255);
  border-radius: 50%;
  padding: 2px;
`;
