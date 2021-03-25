import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ROUTES } from "routes";

import AvatarIcon from "sharedComponents/AvatarIcon";

const Starters = ({ data, mentionTag }) => {
  return (
    <StartersContainer>
      {data.length > 0 ? (
        data.map((starter, i) => {
          return (
            <StarterContainer key={i}>
              <Time>
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
                {starter.start_date}
              </Time>
              {starter.candidate?.id ? (
                <Candidate
                  to={ROUTES.CandidateProfile.url(
                    mentionTag,
                    starter.candidate.id
                  )}
                >
                  <div style={{ marginRight: 10 }}>
                    <AvatarIcon
                      imgUrl={starter.avatar}
                      name={starter.name}
                      shape={"circle"}
                      size={30}
                    />
                  </div>
                  {starter.name}
                </Candidate>
              ) : (
                <>{starter.name}</>
              )}
              <Job>
                <div style={{ marginRight: 10 }}>
                  <AvatarIcon
                    imgUrl={starter.job_post_owner_avatar}
                    name={starter.job_post_owner_name}
                    shape={"circle"}
                    size={30}
                  />
                </div>
                <Link
                  to={ROUTES.JobDashboard.url(
                    mentionTag,
                    starter.job_post_slug
                  )}
                >
                  {starter.job_post_title}
                </Link>
              </Job>
            </StarterContainer>
          );
        })
      ) : (
        <StarterContainer>You have no upcoming starters</StarterContainer>
      )}
    </StartersContainer>
  );
};

export default Starters;

const StartersContainer = styled.div`
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
`;

const StarterContainer = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-between",
}))`
  font-size: 14px;
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

const Candidate = styled(Link).attrs((props) => ({
  className: (props.className || "") + " leo-flex-center leo-pointer",
}))`
  font-weight: 500;
`;

const Job = styled.div`
  align-items: center;
  display: none;

  a {
    color: #1e1e1e;
  }

  @media screen and (min-width: 902px) {
    display: flex;
  }
`;

const Time = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center",
}))`
  color: #74767b;

  svg {
    margin-right: 10px;
  }
`;
