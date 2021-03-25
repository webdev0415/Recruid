import React from "react";
// import { Table, TableRow, TableCell } from "styles/Table";
import { ROUTES } from "routes";
import { Link } from "react-router-dom";
import spacetime from "spacetime";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import styled from "styled-components";

import {
  TabTitle,
  SectionTitleContainer,
  SectionContainer,
} from "components/Profiles/components/ProfileComponents";
import AvatarIcon from "sharedComponents/AvatarIcon";
import Spinner from "sharedComponents/Spinner";
import { AWS_CDN_URL } from "constants/api";

const EmailRecipients = ({
  store,
  candidates,
  contacts,
  companies,
  emailInteractions,
}) => {
  return (
    <>
      {!candidates && !contacts && !companies ? (
        <Spinner />
      ) : (
        <SectionContainer>
          <SectionTitleContainer>
            <TabTitle>Recipients</TabTitle>
          </SectionTitleContainer>
          <div>
            <Table>
              <thead>
                <tr>
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody>
                {candidates &&
                  candidates.length > 0 &&
                  candidates.map((cand, index) => (
                    <RecipientRow
                      key={`email-row-${index}`}
                      className="leo-flex-center-between"
                    >
                      <div className="leo-flex-center">
                        <AvatarIcon
                          name={cand.name}
                          imgUrl={cand.avatar}
                          size={30}
                        />
                        <NameContainer className="leo-flex leo-align-start">
                          <STLink
                            to={ROUTES.CandidateProfile.url(
                              store.company.mention_tag,
                              cand.professional_id
                            )}
                          >
                            {cand.name}
                          </STLink>
                          <EmailSpan>{cand.email}</EmailSpan>
                        </NameContainer>
                      </div>
                      <RecipientExtra className="leo-flex-center">
                        {emailInteractions?.[cand.email]?.opens ? (
                          <OverlayTrigger
                            key={`overlay-recepient-opens-${index + 1}`}
                            placement={"top"}
                            overlay={
                              <Tooltip
                                id={`email-recepient-opens-${index + 1}`}
                              >
                                <strong>
                                  Last opened:{" "}
                                  {spacetime(
                                    emailInteractions?.[cand.email]?.lastOpen
                                  ).format("nice")}
                                </strong>
                              </Tooltip>
                            }
                          >
                            <EventStat>
                              <img
                                src={`${AWS_CDN_URL}/icons/ViewIcon.svg`}
                                alt=""
                              />
                              {emailInteractions?.[cand.email]?.opens}
                            </EventStat>
                          </OverlayTrigger>
                        ) : (
                          <EventStat>
                            <img
                              src={`${AWS_CDN_URL}/icons/ViewIcon.svg`}
                              alt=""
                            />
                            0
                          </EventStat>
                        )}
                        {emailInteractions?.[cand.email]?.clicks ? (
                          <OverlayTrigger
                            key={`overlay-recepient-clicks-${index + 1}`}
                            placement={"top"}
                            overlay={
                              <Tooltip
                                id={`email-recepient-clicks-${index + 1}`}
                              >
                                <strong>
                                  Last click:{" "}
                                  {spacetime(
                                    emailInteractions?.[cand.email]?.lastClick
                                  ).format("nice")}
                                </strong>
                              </Tooltip>
                            }
                          >
                            <EventStat>
                              <img
                                src={`${AWS_CDN_URL}/icons/ClickIcon.svg`}
                                alt=""
                              />
                              {emailInteractions?.[cand.email]?.clicks}
                            </EventStat>
                          </OverlayTrigger>
                        ) : (
                          <EventStat>
                            <img
                              src={`${AWS_CDN_URL}/icons/ClickIcon.svg`}
                              alt=""
                            />
                            0
                          </EventStat>
                        )}
                      </RecipientExtra>
                    </RecipientRow>
                  ))}
                {contacts &&
                  contacts.length > 0 &&
                  contacts.map((contact, index) => (
                    <RecipientRow key={`email-row-${index}`}>
                      <div className="leo-flex-center">
                        <AvatarIcon
                          name={contact.name}
                          imgUrl={contact.avatar}
                          size={30}
                        />
                        <NameContainer className="leo-flex leo-align-start">
                          <STLink
                            to={ROUTES.ContactProfile.url(
                              store.company.mention_tag,
                              contact.id
                            )}
                          >
                            {contact.name}
                          </STLink>
                          <EmailSpan>{contact.email}</EmailSpan>
                        </NameContainer>
                      </div>
                      <RecipientExtra className="leo-flex-center">
                        {emailInteractions?.[contact.email]?.opens ? (
                          <OverlayTrigger
                            key={`overlay-recepient-opens-${index + 1}`}
                            placement={"top"}
                            overlay={
                              <Tooltip
                                id={`email-recepient-opens-${index + 1}`}
                              >
                                <strong>
                                  Last opened:{" "}
                                  {spacetime(
                                    emailInteractions?.[contact.email]?.lastOpen
                                  ).format("nice")}
                                </strong>
                              </Tooltip>
                            }
                          >
                            <EventStat>
                              <img
                                src={`${AWS_CDN_URL}/icons/ViewIcon.svg`}
                                alt=""
                              />
                              {emailInteractions?.[contact.email]?.opens}
                            </EventStat>
                          </OverlayTrigger>
                        ) : (
                          <EventStat>
                            <img
                              src={`${AWS_CDN_URL}/icons/ViewIcon.svg`}
                              alt=""
                            />
                            0
                          </EventStat>
                        )}
                        {emailInteractions?.[contact.email]?.clicks ? (
                          <OverlayTrigger
                            key={`overlay-recepient-clicks-${index + 1}`}
                            placement={"top"}
                            overlay={
                              <Tooltip
                                id={`email-recepient-clicks-${index + 1}`}
                              >
                                <strong>
                                  Last click:{" "}
                                  {spacetime(
                                    emailInteractions?.[contact.email]
                                      ?.lastClick
                                  ).format("nice")}
                                </strong>
                              </Tooltip>
                            }
                          >
                            <EventStat>
                              <img
                                src={`${AWS_CDN_URL}/icons/ClickIcon.svg`}
                                alt=""
                              />
                              {emailInteractions?.[contact.email]?.clicks}
                            </EventStat>
                          </OverlayTrigger>
                        ) : (
                          <EventStat>
                            <img
                              src={`${AWS_CDN_URL}/icons/ClickIcon.svg`}
                              alt=""
                            />
                            0
                          </EventStat>
                        )}
                      </RecipientExtra>
                    </RecipientRow>
                  ))}
                {companies &&
                  companies.length > 0 &&
                  companies.map((company, index) => (
                    <RecipientRow key={`email-row-${index}`}>
                      <div className="leo-flex-center">
                        <AvatarIcon
                          name={company.company_name}
                          imgUrl={company.avatar}
                          size={30}
                        />
                        <STLink
                          to={ROUTES.ClientProfile.url(
                            store.company.mention_tag,
                            company.client_id
                          )}
                        >
                          {company.company_name}
                        </STLink>
                      </div>
                      <RecipientExtra className="leo-flex-center">
                        {company.location}
                      </RecipientExtra>
                    </RecipientRow>
                  ))}
              </tbody>
            </Table>
          </div>
        </SectionContainer>
      )}
    </>
  );
};

const Table = styled.table`
  width: 100%;
`;

const STLink = styled(Link)`
  color: #1e1e1e;
  font-weight: 500;
`;

const RecipientRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
`;

const RecipientExtra = styled.td`
  margin-left: 10px;
  max-width: 300px;
  min-width: 80px;
  text-align: end;
`;

const EmailSpan = styled.span`
  color: #74767b;
  display: inline;
  font-weight: 400;
`;

const NameContainer = styled.div`
  flex-direction: column;
  margin-left: 10px;
`;

const EventStat = styled.span.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center",
}))`
  font-weight: 500;

  svg,
  img {
    margin-right: 5px;
  }

  &:not(:last-child) {
    margin-right: 15px;
  }
`;

export default EmailRecipients;
