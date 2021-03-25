import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { Link } from "react-router-dom";
import AvatarIcon from "sharedComponents/AvatarIcon";
import styled from "styled-components";
import spacetime from "spacetime";
import { createJobSlug } from "helpersV2/jobs";
import { ROUTES } from "routes";

export const ResultBlock = ({ resultSource, result }) => {
  const store = useContext(GlobalContext);
  const [resultLimit, setResultLimit] = useState(4);
  // Name of the props that needs to be taken out from 'match' obj
  const [matchHeader, setMatchHeader] = useState([]);
  const [matchFooter, setMatchFooter] = useState([]);
  const [profileLink, setProfileLink] = useState(null);

  const changeResultLimit = (val) => () => setResultLimit(val);

  useEffect(() => {
    // GENERATE PROP NAMES FOR RESULT ITEM INFO
    ((resultSource) => {
      switch (resultSource) {
        case "candidates":
          setMatchHeader(["name"]);
          setProfileLink(() => (companyMentionTag, id) =>
            ROUTES.CandidateProfile.url(companyMentionTag, id)
          );
          return setMatchFooter(["title", "location"]);
        case "contacts":
          setMatchHeader(["name", "company"]);
          setProfileLink(() => (companyMentionTag, id) =>
            ROUTES.ContactProfile.url(companyMentionTag, id)
          );
          return setMatchFooter(["email", "number"]);
        case "clients":
          setMatchHeader(["name"]);
          setProfileLink(() => (companyMentionTag, id) =>
            ROUTES.ClientProfile.url(companyMentionTag, id)
          );
          return setMatchFooter(["industry", "location"]);
        case "deals":
          setMatchHeader(["title"]);
          setProfileLink(() => (companyMentionTag, id) =>
            ROUTES.DealProfile.url(companyMentionTag, id)
          );
          return setMatchFooter(["stage", "status", "value"]);
        case "jobs":
          setMatchHeader(["title"]);
          setProfileLink(() => (companyMentionTag, jobSlug) =>
            ROUTES.JobDashboard.url(companyMentionTag, jobSlug)
          );
          return setMatchFooter(["company", "applicants", "hired", "salary"]);
        case "interviews":
          setMatchHeader(["name"]);
          return setMatchFooter(["start", "end", "job", "company"]);
        case "meetings":
          setMatchHeader(["name"]);
          return setMatchFooter(["start", "end", "source", "company"]);
        case "emails":
          setMatchHeader(["subject"]);
          return setMatchFooter(["receiver", "sent_at"]);
        case "documents":
          setMatchHeader(["title"]);
          return setMatchFooter(["doc_for"]);
        default:
          setMatchHeader([]);
          return setMatchFooter([]);
      }
    })(resultSource);
  }, [resultSource]);

  return (
    <StyledBlock>
      <Heading>{resultSource.replace("_", " ")}</Heading>
      <div>
        {result[0]?.slice(0, resultLimit).map((match, index) => {
          let profileUrl = "";
          if (resultSource === "jobs") {
            profileUrl = profileLink?.(
              store.company.mention_tag,
              createJobSlug(match.title, match.id)
            );
          } else if (resultSource === "candidates") {
            profileUrl = profileLink?.(
              store.company.mention_tag,
              match.professional_id
            );
          } else if (resultSource === "clients") {
            profileUrl = profileLink?.(
              store.company.mention_tag,
              match.employer_id
            );
          } else {
            profileUrl = profileLink?.(store.company.mention_tag, match.id);
          }

          return (
            <Match
              key={`${resultSource}-match-#${index++}`}
              className="leo-flex leo-relative"
            >
              <AvatarIcon
                imgUrl={null}
                name={match[matchHeader[0]]}
                shape={"circle"}
                size={30}
              />
              <Info className="leo-flex leo-align-start leo-justify-between">
                <Link to={profileUrl}>
                  <h3>{matchHeader.map((prop) => match[prop]).join(" ")}</h3>
                </Link>
                <span>
                  {matchFooter
                    .map((prop) => {
                      if (prop === "salary" || prop === "value") {
                        return undefined;
                      }
                      if (prop === "applicants" || prop === "hired") {
                        let source =
                          prop.charAt(0).toUpperCase() + prop.slice(1);
                        return `${source} ${match[prop]}`;
                      }
                      if (
                        (prop === "start" || prop === "end") &&
                        !!match[prop]
                      ) {
                        let date = spacetime(match[prop]);
                        return date.format("{date} {month-short} {time}");
                      }

                      return match[prop];
                    })
                    .filter((val) => !!val)
                    .join(" - ")}
                </span>
                {resultSource === "deals" && !!match.value && (
                  <Currency>{match.value}</Currency>
                )}
              </Info>
            </Match>
          );
        })}
      </div>
      {result[0]?.length > 4 ? (
        resultLimit !== -1 ? (
          <Button onClick={changeResultLimit(-1)}>View All</Button>
        ) : (
          <Button onClick={changeResultLimit(4)}>Collapse</Button>
        )
      ) : null}
    </StyledBlock>
  );
};

const StyledBlock = styled.div``;

const Heading = styled.h3`
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
`;

const Button = styled.button`
  color: #fff;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
`;

const Match = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  margin: 10px 0;
  padding-bottom: 10px;
`;

const Info = styled.div`
  flex-direction: column;
  margin-left: 10px;

  h3 {
    color: #fff;
    font-size: 14px;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  span {
    color: rgba(255, 255, 255, 0.75);
    font-size: 12px;
  }
`;

const Currency = styled.div`
  background: #fff;
  border-radius: 4px;
  height: 20px;
  position: absolute;
  top: 20%;
  right: 0;
  width: 55px;

  color: #2a3744;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-align: center;
`;
