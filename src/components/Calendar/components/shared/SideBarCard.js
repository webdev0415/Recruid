import React, { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
// Packages
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { ROUTES } from "routes";
// Styles
import AvatarIcon from "sharedComponents/AvatarIcon";
import {
  SideBarCardStyles,
  InterviewName,
  InterviewDetails,
  SideBarCardFooter,
  InterviewParticipant,
  MoreParticipants,
  InterviewApplicant,
  MemberDetails,
} from "components/Calendar/styles/CalendarComponents";
import { GoogleLogo } from "components/Calendar/components/assets/GoogleLogo.js";
import { AWS_CDN_URL } from "constants/api";
// Helpers
// import { getApplicantProfile } from "helpers/calendar/eventsActions";

const SideBarCard = ({ event, eventAction }) => {
  const store = useContext(GlobalContext);
  if (event) {
    return (
      <Fragment>
        <SideBarCardStyles onClick={(e) => eventAction(e, event)}>
          <InterviewName>{event.name}</InterviewName>
          {event.source === "recruitd" && (
            <InterviewDetails>
              <img src={`${AWS_CDN_URL}/icons/JobIcon.svg`} alt="" />
              <a
                href={ROUTES.JobDashboard.url(
                  store.company.mention_tag,
                  event.job.job_slug
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.job.job_title}
              </a>{" "}
              at {event.company.company_name}
            </InterviewDetails>
          )}
          <InterviewDetails>
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
            {!!event.date &&
              `${event.date.getHours()}:${
                !event.date.getMinutes() ? `00` : event.date.getMinutes()
              }`}
            {!!event.dateEnd &&
              ` - ${event.dateEnd.getHours()}:${
                !event.dateEnd.getMinutes() ? `00` : event.dateEnd.getMinutes()
              }`}
          </InterviewDetails>

          <SideBarCardFooter>
            {event.source === "google" && <GoogleLogo />}
            {event.source === "recruitd" && event.applicant.applicant_name && (
              <Link
                to={ROUTES.CandidateProfile.url(
                  store.company.mention_tag,
                  event.applicant.applicant_prof_id
                )}
              >
                <InterviewApplicant>
                  <AvatarIcon
                    imgUrl={event.applicant.applicant_avatar}
                    name={event.applicant.applicant_name || "Fancy Names"}
                    size={30}
                  />
                  <MemberDetails>
                    <span>{event.applicant.applicant_name}</span>
                    <p>
                      {event.applicant.applicant_current_position ||
                        event.applicant.applicant_email}
                    </p>
                  </MemberDetails>
                </InterviewApplicant>
              </Link>
            )}
            <div className="leo-flex-center-end">
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
                            <strong>
                              {participant.name || participant.email}
                            </strong>
                          </Tooltip>
                        }
                      >
                        <InterviewParticipant>
                          <AvatarIcon
                            key={`${participant}-${index}`}
                            imgUrl={participant.avatar}
                            name={participant.name || participant.email}
                            size={30}
                          />
                        </InterviewParticipant>
                      </OverlayTrigger>
                    );
                  } else return false;
                })}
              {!!event.participants && event.participants.length > 3 && (
                <MoreParticipants>
                  +{event.participants.length - 3}
                </MoreParticipants>
              )}
            </div>
          </SideBarCardFooter>
        </SideBarCardStyles>
      </Fragment>
    );
  } else return null;
};

export default SideBarCard;
