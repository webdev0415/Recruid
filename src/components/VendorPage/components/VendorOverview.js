import React from "react";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

import { device } from "helpers/device";

import AvatarIcon from "sharedComponents/AvatarIcon";
import ProfileRating from "sharedComponents/profile/ProfileRating";

import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import tagStyles from "assets/stylesheets/scss/collated/profileBody.module.scss";
import { AWS_CDN_URL } from "constants/api";
import { ATSContainer } from "styles/PageContainers";
// import { API_ROOT_PATH } from "constants/api";

// const activityMap = {
//   pending: "was invited to job,",
//   invited: "was added to job,",
//   "invited manual": "added to job,",
//   "invite accepted": "accepted the invite to job,",
//   applied: "applied for the job,",
//   shortlisted: "was shortlisted for the job,",
//   "to be screened": "was set to the status To be Screened for the job,",
//   "to be submitted": "was set to the status To be Submitted for the job,",
//   "awaiting review": "was set to the status Awaiting Review for the job,",
//   approved: "was approved for the job,",
//   interview_requested: "was offered and interview for the job,",
//   "to be scheduled":
//     "was set to the status Interview to be Scheduled for the job,",
//   interview_accepted:
//     "was set to the status Scheduled an interview for the job, ",
//   interview_conducted: "was set to the status Conducted Interview for the job",
//   interview_rescheduled:
//     "was set to the status Rescheduled Interview for the job",
//   interview_rescheduled_manual:
//     "was set to the status Rescheduled Interview for the job,",
//   "to be rescheduled":
//     "was set to the status Interview to be Rescheduled for the job,",
//   "invited to event": "was invited to an event for the job,",
//   "attending event": "is attending an event for the job,",
//   "to be offered": "was set to the status To be Offered for the job,",
//   "verbally offered": "was verbally offered the job,",
//   "contract sent": "was sent a contract for the job,",
//   "verbally accepted":
//     "was set to the status Verbally Accepted offer for the job,",
//   "formally accepted":
//     "was set to the status Formally Accepted offer for the job,",
//   offer_requested: "was sent an offer for the job,",
//   offer_accepted: "was set to the status Offer Accepted for the job,",
//   "gathering information":
//     "was set to the status Gathering information for job,",
//   "contract signed": "signed the contract for the job,",
//   "start date confirmed": "start date was confimed for the job,",
//   onboarding: "was set to the status Onboarding for the job,",
//   "hired applicant": "was hired for the job,",
//   hired: "was hired for the job,",
//   "hired manual": "was hired for the job,",
//   declined: "was declined for the job,",
//   declined_manual: "was declined for the job,",
//   rejected: "rejected the job,",
//   rejected_manual: "rejected the job,",
//   invite_tn: "was invited to join your Talent Network",
//   accept_tn: "accepted invitation to join your Talent Network",
//   cancelled: "cancelled the application for the job,"
// };

// const rejectionMap = {
//   1: "Did not fit company culture",
//   2: "Did not meet desired qualifications",
//   3: "Did not meet minimum qualifications",
//   4: "Did not meet screening requirements",
//   5: "Incomplete Application",
//   6: "Ineligible to work in location",
//   7: "Misrepresented qualifications",
//   8: "More qualified candidate selected",
//   9: "No show for interview",
//   10: "Other",
//   11: "Unresponsive"
// };
//
// const withdrawalMap = {
//   1: "Took another job",
//   2: "Compensation",
//   3: "Personal reasons",
//   4: "Commute",
//   5: "Cultural fit",
//   6: "Lack of recruiter follow-up",
//   7: "Confusing job description",
//   8: "Will stay in current company",
//   9: "Not interested in the first place."
// };
//
// function formatInteractionDescription(interaction) {
//   if (interaction.status !== "cancelled") {
//     return activityMap[interaction.candidate_status];
//   } else {
//     switch (interaction.candidate_status) {
//       case "pending":
//         return "Cancelled Invitation";
//       case "applied":
//         return "Cancelled Application";
//       case "interview_requested":
//         return "Cancelled Interview Request";
//       case "interview_accepted":
//         return "Cancelled Interview";
//       case "interview_conducted":
//         return "Cancelled Application";
//       case "offer_requested":
//         return "Cancelled Application";
//       case "offer_accepted":
//         return "Cancelled Application";
//       case "cancelled":
//         return "Cancelled Appllication";
//       default:
//     }
//   }
// }

// function ActivityItem({ interaction }) {
//   const date = new Date(interaction.created_at);
//   const time = date.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true
//   });
//   const dateString = date.toLocaleDateString("en-GB");
//   return (
//     <div className={generalStyles.activityContainer}>
//       <div className={generalStyles.activityDetails}>
//         <svg
//           width="30"
//           height="30"
//           viewBox="0 0 30 30"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <g fill-role="nonzero" fill="none">
//             <circle stroke="#C1C3C8" fill="#FFF" cx="15" cy="15" r="14.5" />
//             <path
//               d="M17.77 14.846h-5.54a.462.462 0 0 0 0 .923h5.54a.461.461 0 1 0 0-.923zm0 2.77h-5.54a.461.461 0 1 0 0 .922h5.54a.461.461 0 1 0 0-.923zm.46-6.462a.923.923 0 0 1-.922-.923V8.385l2.769 2.769H18.23zm1.847 9.23c0 .51-.414.924-.923.924h-8.308a.923.923 0 0 1-.923-.923V9.308c0-.51.414-.923.923-.923h5.526c-.009 1.105.013 1.846.013 1.846 0 1.02.826 1.846 1.846 1.846h1.846v8.308zm-2.77-12.922v.012c-.058 0-.305-.022-.922-.012h-5.539C9.826 7.462 9 8.288 9 9.308v11.077c0 1.02.827 1.846 1.846 1.846h8.308c1.02 0 1.846-.827 1.846-1.846v-9.231l-3.692-3.692z"
//               fill="#74767B"
//             />
//           </g>
//         </svg>
//         <div>
//           <span>{interaction.applicant_name}</span>
//           {` ${formatInteractionDescription(interaction)} `}
//           {interaction.candidate_status !== "accept_tn" &&
//             interaction.candidate_status !== "invite_tn" && (
//               <span>{interaction.job_title}</span>
//             )}
//
//           {interaction.candidate_status === "applied" &&
//             interaction.status === "accept" &&
//             interaction.body && (
//               <span>
//                 {interaction.body.require_sponsorship
//                   ? "and requires Sponsorship"
//                   : "and does not require Sponsorship"}
//               </span>
//             )}
//
//           {interaction.candidate_status === "declined" && (
//             <>
//               <span>- {rejectionMap[interaction.body.rejection_reason]}</span>
//               {interaction.body.feedback !== "" && (
//                 <div>{interaction.body.feedback}</div>
//               )}
//             </>
//           )}
//
//           {interaction.status === "cancelled" && (
//             <>
//               <span>- {withdrawalMap[interaction.body.withdrawal_reason]}</span>
//               {interaction.body.feedback !== "" && (
//                 <div>{interaction.body.feedback}</div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//       <div className={generalStyles.activityDate}>
//         {time} {dateString}
//       </div>
//     </div>
//   );
// }

const VendorOverview = ({ company, vendor, vendorAnalytics }) => {
  const industries =
    vendor.categorizations_attributes && vendor.categorizations_attributes;
  const skills =
    vendor.competencies_attributes && vendor.competencies_attributes;
  const locations =
    vendor.localizations_attributes && vendor.localizations_attributes;

  const Location = styled.span`
    padding-left: 10px;

    &:after {
      content: "·";
      padding-left: 10px;
    }

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      &:after {
        content: none;
      }
    }
  `;

  return (
    <ATSContainer>
      <Row>
        <Col sm={12}>
          <VendorDetails>
            <VendorHeader>
              <h2>{vendor.name}</h2>
              {locations && locations.length > 0 && (
                <div className="leo-flex">
                  {locations.map((location, index) => (
                    <Location key={`location_${index}`}>
                      {location.location_attributes.name}
                    </Location>
                  ))}
                </div>
              )}
              {vendor.average_rating > 0 && (
                <ProfileRating averageRating={vendor.average_rating} />
              )}
            </VendorHeader>
            {vendor.description && (
              <VendorDescription>
                <p>{vendor.description}</p>
              </VendorDescription>
            )}
            {(industries || vendor.skills) && (
              <VendorTags>
                <Row>
                  {industries && industries.length > 0 && (
                    <Col sm={6}>
                      <span className={tagStyles.tagLabel}>Industries</span>
                      <div
                        className={tagStyles.tagsContainer}
                        style={{ marginBottom: 0 }}
                      >
                        <div className={tagStyles.tags}>
                          {industries.map((industry, index) => (
                            <div
                              key={`industry_${index}`}
                              className={tagStyles.tag}
                            >
                              {industry.category_attributes.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Col>
                  )}
                  {skills && skills.length > 0 && (
                    <Col sm={6}>
                      <span className={tagStyles.tagLabel}>
                        Skills they hire for
                      </span>
                      <div
                        className={tagStyles.tagsContainer}
                        style={{ marginBottom: 0 }}
                      >
                        <div className={tagStyles.tags}>
                          {skills.map((skill, index) => (
                            <div
                              key={`skill_${index}`}
                              className={tagStyles.tag}
                            >
                              {skill.skill.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>
              </VendorTags>
            )}
          </VendorDetails>
          <VendorBody>
            {vendorAnalytics && (
              <>
                <StatContainerDouble>
                  <Stat>
                    <h3>{vendorAnalytics?.active_jobs?.total}</h3>
                    <h5>Total Active Jobs</h5>
                  </Stat>
                  <Stat>
                    <h3>{vendorAnalytics?.candidates_submitted?.total}</h3>
                    <h5>Total Candidates Submitted</h5>
                  </Stat>
                </StatContainerDouble>
                <StatContainerDouble>
                  <Stat>
                    <h3>{vendorAnalytics?.placements?.total}</h3>
                    <h5>Total Placements</h5>
                  </Stat>
                  <Stat>
                    <h3>
                      {company.currency?.currency_name}
                      {vendorAnalytics.total_agency_spend || 0}
                    </h3>
                    <h5>
                      {company.type === "Employer"
                        ? "Total Agency Spend"
                        : "Total Client Spend"}
                    </h5>
                  </Stat>
                </StatContainerDouble>
              </>
            )}
            <ContactsContainer className={sharedStyles.tableContainer}>
              <ContactsHeader>
                <h5>Contacts</h5>
              </ContactsHeader>
              <ContactsBody>
                {vendor.contacts || vendor.client_contacts ? (
                  displayContacts(vendor)
                ) : (
                  <div
                    className="leo-flex"
                    style={{
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <div
                      className={sharedStyles.empty}
                      style={{ margin: "0 auto" }}
                    >
                      <img
                        src={`${AWS_CDN_URL}/icons/empty-icons/addTalentNew.svg`}
                        alt="You dont have any contacts for this client"
                        style={{ height: "150px", marginBottom: "20px" }}
                      />
                      <h3>You dont have any contacts for this client.</h3>
                    </div>
                  </div>
                )}
              </ContactsBody>
            </ContactsContainer>
          </VendorBody>
        </Col>
        {/*{activities && activities.length > 0 && (
        <Col sm={12} style={{ marginTop: "30px" }}>
          {activities.map((int, index) => (
            <ActivityItem key={`interaction_${index}`} interaction={int} />
          ))}
          {hasMoreActivities ? (
            <div style={{ textAlign: "center", width: "100%" }}>
              <button
                className="button button--default button--blue-dark"
                onClick={loadMoreActivities}
              >
                Load More
              </button>
            </div>
          ) : null}
        </Col>
      )}*/}
      </Row>
    </ATSContainer>
  );
};

export default VendorOverview;

const VendorDetails = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  overflow: hidden;
  padding: 25px;
`;

const VendorBody = styled.div`
  display: grid;
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  grid-template-columns: repeat(2, 1fr);

  @media ${device.tablet} {
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    // grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatContainerSingle = styled.div`
  display: grid;
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  grid-template-columns: repeat(1, 1fr);
`;

export const StatContainerDouble = styled.div`
  display: grid;
  grid-column-gap: 15px;
  grid-row-gap: 15px;

  @media ${device.tablet} {
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Stat = styled.div`
  justify-content: space-between;
  flex-direction: column;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  height: 100%;
  padding: 15px;

  @media ${device.tablet} {
    padding: 25px;
  }

  h3 {
    color: #1e1e1e;
    font-size: 30px;
    font-weight: 500;
    line-height: normal;
    margin-bottom: 7px;

    @media ${device.tablet} {
      font-size: 50px;
    }
  }

  h5 {
    color: #9a9ca1;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.2px;
    line-height: normal;
    margin-bottom: 8px;
    text-transform: uppercase;

    @media ${device.tablet} {
      margin-bottom: 10px;
    }
  }

  span {
    align-items: center;
    color: #00cba7;
    display: flex;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    margin-top: 10px;

    svg,
    img {
      margin-right: 5px;
    }

    &.negative {
      color: #ff3159;
    }

    @media ${device.tablet} {
      font-size: 15px;
    }
  }
`;

const VendorHeader = styled.div`
  h2 {
    font-weight: 500;
    font-size: 26px;
    margin-bottom: 10px;
  }

  span {
    color: #74767b;
    font-size: 15px;
    margin-bottom: 10px;
  }

  .info-rating__number {
    margin-bottom: 0 !important;
  }
`;

const VendorDescription = styled.div`
  margin-top: 10px;
`;

const VendorTags = styled.div`
  margin-top: 30px;
`;

const ContactsContainer = styled.div`
  grid-column-end: 3;
  grid-column-start: 1;
  height: 304px;
  margin: 0 !important;

  @media ${device.tablet} {
    grid-column-end: 4;
    grid-column-start: 2;
    grid-row-end: 3;
    grid-row-start: 1;
  }
`;

const ContactsHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding: 10px 20px;
  position: relative;

  h5 {
    color: #9a9ca1;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.67px;
    text-transform: uppercase;
  }
`;

const ContactsBody = styled.div`
  height: 261px;
  overflow-y: auto;
`;

const displayContacts = (vendor) => {
  return (
    <>
      <>
        {vendor.contacts &&
          vendor.contacts.map((contact, index) => (
            <ContactCell
              contact={contact}
              name={contact.professional_name}
              key={index}
            />
          ))}
        {vendor.client_contacts &&
          vendor.client_contacts.map((contact, index) => (
            <ContactCell contact={contact} name={contact.name} key={index} />
          ))}
      </>
    </>
  );
};

function ContactCell({ contact, name }) {
  const ContactContainer = styled.div`
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
    transition: box-shadow 0.25s ease-in-out;
  `;

  const ContactDetails = styled.div`
    align-items: center;
    display: flex;
  `;

  const ContactAvatar = styled.div`
    margin-right: 15px;
  `;

  const ContactName = styled.div`
    h4 {
      color: #000000;
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 2px;
    }

    span {
      color: #9a9ca1;
      font-size: 12px;
    }
  `;

  const ContactOptions = styled.div`
    align-items: center;
    display: flex;
    position: relative;
  `;

  const ContactOption = styled.a`
    align-items: center;
    background: #ffffff;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    display: flex;
    height: 30px;
    justify-content: center;
    width: 30px;

    &:first-child {
      margin-right: 15px;
    }
  `;

  return (
    <ContactContainer>
      <ContactDetails>
        <ContactAvatar>
          <AvatarIcon name={name} imgUrl={contact.avatar} size={50} />
        </ContactAvatar>
        <ContactName>
          <h4>{name}</h4>
          {contact.title && <span>{contact.title}</span>}
        </ContactName>
      </ContactDetails>
      {(contact.phone || contact.email) && (
        <ContactOptions>
          {contact.phone && (
            <ContactOption href={`tel:${contact.phone}`}>
              <img src={`${AWS_CDN_URL}/icons/PhoneContactIcon.svg`} alt="" />
            </ContactOption>
          )}
          {contact.email && (
            <ContactOption href={`mailto:${contact.email}`}>
              <emailContactIcon />
            </ContactOption>
          )}
        </ContactOptions>
      )}
    </ContactContainer>
  );
}
