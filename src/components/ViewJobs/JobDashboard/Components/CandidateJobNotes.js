import React, { useContext } from "react";
import AvatarIcon from "sharedComponents/AvatarIcon";
import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";
import styled from "styled-components";
import queryString from "query-string";
import { ROUTES } from "routes";
import { AWS_CDN_URL } from "constants/api";
import { generateBody } from "constants/noteMentions";

import GlobalContext from "contexts/globalContext/GlobalContext";

const JobNotes = ({ candidateJobNotes }) => {
  const store = useContext(GlobalContext);

  return (
    <>
      <JobNotesHeader>
        <h5>Candidate Notes</h5>
      </JobNotesHeader>
      {candidateJobNotes.map((note) => (
        <JobNoteContainer key={note.id}>
          <JobNoteHeader>
            <JobNoteHeaderLeft>
              <div style={{ marginRight: "10px", width: "20px" }}>
                <AvatarIcon
                  name={note.author_name}
                  imgUrl={note.avatar}
                  size={20}
                />
              </div>
              <strong>{note.author_name}</strong> wrote a note{" "}
              {note.source_name && (
                <>
                  on{" "}
                  <strong>
                    <Link
                      style={{ color: "#1e1e1e" }}
                      to={ROUTES.CandidateProfile.url(
                        store.company.mention_tag,
                        note.professional_id,
                        "overview",
                        "?" +
                          queryString.stringify({
                            job_id: note.job_id,
                            applicant_id: note.applicant_id,
                            client_id: note.client_id,
                          })
                      )}
                    >
                      {note.source_name}
                    </Link>
                  </strong>
                </>
              )}
            </JobNoteHeaderLeft>
            <JobNoteHeaderRight>
              <TimeAgo date={note.created_at} />
              {note.client_note && note.client_id !== store.company.id ? (
                <ClientTag>Client</ClientTag>
              ) : note.client_note && note.client_id === store.company.id ? (
                <ClientTag>Agency</ClientTag>
              ) : (
                ""
              )}
              <CandidateLink
                to={ROUTES.CandidateProfile.url(
                  store.company.mention_tag,
                  note.professional_id,
                  "overview",
                  "?" +
                    queryString.stringify({
                      job_id: note.job_id,
                      applicant_id: note.applicant_id,
                      client_id: note.client_id,
                    })
                )}
                style={{ marginLeft: 10 }}
              >
                View
              </CandidateLink>
            </JobNoteHeaderRight>
          </JobNoteHeader>
          <JobNoteBody>
            <div
              dangerouslySetInnerHTML={{
                __html: generateBody(note.body),
              }}
            ></div>
            {note.rating && (
              <>
                {note.rating === 1 ? (
                  <img
                    src={`${AWS_CDN_URL}/icons/Rating1SVG.svg`}
                    alt="Rating 1"
                  />
                ) : note.rating === 2 ? (
                  <img
                    src={`${AWS_CDN_URL}/icons/Rating2SVG.svg`}
                    alt="Rating 2"
                  />
                ) : note.rating === 3 ? (
                  <img
                    src={`${AWS_CDN_URL}/icons/Rating3SVG.svg`}
                    alt="Rating 3"
                  />
                ) : note.rating === 4 ? (
                  <img
                    src={`${AWS_CDN_URL}/icons/Rating4SVG.svg`}
                    alt="Rating 4"
                  />
                ) : note.rating === 5 ? (
                  <img
                    src={`${AWS_CDN_URL}/icons/Rating5SVG.svg`}
                    alt="Rating 5"
                  />
                ) : (
                  ""
                )}
              </>
            )}
          </JobNoteBody>
        </JobNoteContainer>
      ))}
    </>
  );
};

export default JobNotes;

const CandidateLink = styled(Link)`
  color: #74767b;
`;

const JobNotesHeader = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  padding: 10px 20px;
  position: relative;
  width: 100%;

  h5 {
    color: #9a9ca1;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.67px;
    text-transform: uppercase;
  }
`;

const JobNoteContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  padding: 20px 20px;
`;

const JobNoteHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 15px;
`;

const JobNoteHeaderLeft = styled.div`
  align-items: center;
  display: -webkit-box;
  font-size: 14px;
`;

const JobNoteHeaderRight = styled.div`
  align-items: center;
  display: flex;
  color: #74767b;
  font-size: 12px;
`;

const JobNoteBody = styled.div`
  font-weight: 14px;
  line-height: 1.5;
  white-space: pre-wrap;

  span {
    display: inline;
  }
`;

const ClientTag = styled.span`
  background: rgba(42, 55, 68, 0.2);
  border-radius: 4px;
  color: #2a3744;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-left: 10px;
  padding: 3px 5px;
  text-transform: uppercase;
`;
