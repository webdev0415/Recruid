import React, { useContext } from "react";
import { ROUTES } from "routes";
import { Link } from "react-router-dom";
import GlobalContext from "contexts/globalContext/GlobalContext";
// Bootstrap
import { OverlayTrigger, Tooltip } from "react-bootstrap";
// Components
import AvatarIcon from "sharedComponents/AvatarIcon";
// Styles
import styled from "styled-components";
import {
  // ListCardInterviewType,
  MoreParticipants,
} from "components/Calendar/styles/CalendarComponents";
// Assets
import { GoogleLogo } from "components/Calendar/components/assets/GoogleLogo";
// Helpers

const ListItemWrapper = styled.div`
  display: grid;
  grid-column-gap: 40px;
  grid-template-columns: 130px 1fr 1fr 120px;
  padding: 10px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const ListItemTime = styled.div`
  align-items: center;
  color: #74767b;
  font-size: 15px;

  svg {
    margin-right: 10px;
  }
`;

const ListItemEvent = styled.div`
  align-items: center;
  overflow: hidden;

  span {
    margin-left: 15px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ListItemJob = styled.div`
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ListItemJobLink = styled(Link)`
  color: #004a6d;
  font-size: 15px;
  font-weight: 500;
  margin-left: 15px;
`;

// const ListItemType = styled.div``;
const ListItemParticipants = styled.div`
  align-items: center;
  justify-content: flex-end;
`;

const AvatarContainer = styled.div`
  background: #fff;
  border-radius: 50%;
  margin-left: -10px;
  padding: 2px;
  z-index: 1;
`;

const ListCard = ({ event, eventAction }) => {
  const store = useContext(GlobalContext);
  // function displayInterviewDetails() {
  //   switch (event.interview_type) {
  //     case "address":
  //       let link = ``;
  //       if (!!event.interview_location) {
  //         function address(ads) {
  //           return ads.replace(/\s/g, `+`);
  //         }
  //         link = `https://www.google.com/maps/place/${address(
  //           event.interview_location
  //         )}`;
  //       }
  //       return (
  //         <InterviewType>
  //           <svg
  //             width="11"
  //             height="14"
  //             xmlns="http://www.w3.org/2000/svg"
  //             xlinkHref="http://www.w3.org/1999/xlink"
  //           >
  //             <path
  //               d="M5.25 7a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5m0-7C1.75 0 0 2.625 0 5.25S5.25 14 5.25 14s5.25-6.125 5.25-8.75S8.75 0 5.25 0"
  //               fill="#C1C3C8"
  //               fill-role="nonzero"
  //             />
  //           </svg>
  //           <a href={link} target="_blank" rel="noopener noreferrer">
  //             {event.interview_location}
  //           </a>
  //         </InterviewType>
  //       );
  //     case "phone_number":
  //       return (
  //         <InterviewType>
  //           <svg
  //             width="12"
  //             height="15"
  //             xmlns="http://www.w3.org/2000/svg"
  //             xlinkHref="http://www.w3.org/1999/xlink"
  //           >
  //             <path
  //               d="M7.021 10.931c.586-.439 1.263-.896 1.867-.585.805.42 1.61.842 2.415 1.244.659.348.897.732.513 1.41-.604 1.097-2.196 1.994-3.404 1.646A11.558 11.558 0 0 1 .032 2.679C.121 1.434 1.512.226 2.738.025c.769-.128 1.062.238 1.153.97l.33 2.708c.091.677-.568 1.153-1.172 1.556-1.464 1.024 2.507 6.697 3.971 5.672z"
  //               fill="#C1C3C8"
  //               fill-role="evenodd"
  //             />
  //           </svg>
  //           <span>{event.interview_info}</span>
  //         </InterviewType>
  //       );
  //     case "web_link":
  //       let webLink = `#`;
  //       return (
  //         <InterviewType>
  //           <svg
  //             width="12"
  //             height="9"
  //             xmlns="http://www.w3.org/2000/svg"
  //             xlinkHref="http://www.w3.org/1999/xlink"
  //           >
  //             <path
  //               d="M9 3.15v2.7l3 1.35V1.8L9 3.15zM6.545 0h-5.09C.655 0 0 .675 0 1.5v6C0 8.325.655 9 1.455 9h5.09C7.345 9 8 8.325 8 7.5v-6C8 .675 7.345 0 6.545 0z"
  //               fill="#004A6D"
  //               fill-role="nonzero"
  //             />
  //           </svg>
  //           <a href={webLink} target="_blank" rel="noopener noreferrer">
  //             Join Video
  //           </a>
  //         </InterviewType>
  //       );
  //     default:
  //       return null;
  //   }
  // }

  return (
    <>
      <ListItemWrapper onClick={(e) => eventAction(e, event)}>
        <ListItemTime className="leo-flex">
          {event.status !== "conducted" ? (
            <svg
              width="12"
              height="12"
              xmlns="http://www.w3.org/2000/svg"
              xlinkHref="http://www.w3.org/1999/xlink"
            >
              <path
                d="M6.563 7.219l-.01-.001-3.6-.377a.467.467 0 0 1-.422-.466c0-.242.182-.443.422-.466l2.309-.231.272-2.725A.466.466 0 0 1 6 2.531c.242 0 .442.182.466.422l.378 3.976c0 .163-.126.29-.282.29M6 0a6 6 0 0 0-6 6 6 6 0 1 0 6-6"
                fill="#C1C3C8"
                fill-role="nonzero"
              />
            </svg>
          ) : (
            <svg
              id="check"
              width="14"
              height="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" fill-role="evenodd">
                <circle
                  strokeOpacity=".5"
                  stroke="#2a3744"
                  cx="7"
                  cy="7"
                  r="6.5"
                />
                <path
                  d="M10.276 4.617a.375.375 0 0 1 0 .53L6.564 8.86a.375.375 0 0 1-.58-.06.36.36 0 0 1-.153-.077L4.107 7.276a.375.375 0 0 1 .482-.574l1.67 1.401 3.487-3.486a.375.375 0 0 1 .53 0z"
                  fill="#2a3744"
                />
              </g>
            </svg>
          )}
          {!!event.date &&
            `${event.date.getHours()}:${
              !event.date.getMinutes() ? `00` : event.date.getMinutes()
            }`}
          {!!event.dateEnd &&
            ` - ${event.dateEnd.getHours()}:${
              !event.dateEnd.getMinutes() ? `00` : event.dateEnd.getMinutes()
            }`}
        </ListItemTime>
        <ListItemEvent className="leo-flex">
          {event.source === "google" ? (
            <GoogleLogo />
          ) : (
            <ListItemJobLink
              to={ROUTES.CandidateProfile.url(
                store.company.mention_tag,
                event.applicant.applicant_prof_id
              )}
              style={{ cursor: "pointer" }}
            >
              <AvatarIcon
                size={30}
                imgUrl={event.applicant.applicant_avatar}
                name={event.applicant.applicant_name || "Fancy Names"}
              />
            </ListItemJobLink>
          )}
          <span>{event.name}</span>
        </ListItemEvent>
        <ListItemJob className="leo-flex">
          {event.source === "recruitd" ? (
            <>
              <AvatarIcon
                imgUrl={event.company.company_avatar}
                name={event.company.company_name}
                size={30}
              />
              <ListItemJobLink
                to={ROUTES.JobDashboard.url(
                  store.company.mention_tag,
                  event.job.job_slug
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.job.job_title}
              </ListItemJobLink>
            </>
          ) : event.event_type === "meeting" ? (
            "Client Meeting"
          ) : (
            ""
          )}
        </ListItemJob>
        {/*<ListCardInterviewType>
          {displayInterviewDetails()}
        </ListCardInterviewType>*/}
        <ListItemParticipants className="leo-flex">
          {!!event.participants &&
            event.participants.map((participant, index) => {
              let limit = event.source === "recruitd" ? 3 : 2;
              if (index < limit) {
                return (
                  <OverlayTrigger
                    key={`top-${index + 1}`}
                    placement={"top"}
                    overlay={
                      <Tooltip id={`tooltip-top ${index}`}>
                        <strong>{participant.name || participant.email}</strong>
                      </Tooltip>
                    }
                  >
                    <AvatarContainer>
                      <AvatarIcon
                        key={`${participant}-${index}`}
                        imgUrl={participant.avatar}
                        name={participant.name || participant.email}
                        size={30}
                      />
                    </AvatarContainer>
                  </OverlayTrigger>
                );
              } else return false;
            })}
          {!!event.participants && event.participants.length > 3 && (
            <MoreParticipants>
              +{event.participants.length - 3}
            </MoreParticipants>
          )}
        </ListItemParticipants>
      </ListItemWrapper>
    </>
  );
};

export default ListCard;
