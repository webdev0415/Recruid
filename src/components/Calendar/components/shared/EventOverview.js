import React, { useEffect, useState, Fragment, useContext } from "react";
import validUrl from "valid-url";
import { Link } from "react-router-dom";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { CalendarContext } from "contexts/calendarContext/calendarProvider";
import { ROUTES } from "routes";

import styled from "styled-components";
import { setAsCompleted } from "helpers/calendar/eventsActions";
import { AWS_CDN_URL } from "constants/api";
import AvatarIcon from "sharedComponents/AvatarIcon";
import {
  OverviewWrapper,
  OverviewCard,
  CardName,
  CardDetails,
  CardParticipants,
  IntervieweeBlock,
  MemberDetails,
  CardButtons,
  InterviewDetails,
  MemberBlock,
} from "components/Calendar/styles/CalendarComponents";
import { GoogleLogo } from "components/Calendar/components/assets/GoogleLogo";
// Helpers
// import { getApplicantProfile } from "helpers/calendar/eventsActions";

const InterviewType = styled.div`
  svg {
    top: -1px;
  }

  a {
    color: #004a6d !important;

    &:hover {
      color: #004a6d !important;
      text-decoration: underline !important;
    }
  }
`;

const EditButtons = styled.div`
  button {
    color: #74767b;

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
`;

const EventOverview = ({ event, dismiss, openModal, positioning }) => {
  const store = useContext(GlobalContext);
  const { state, dispatch } = useContext(CalendarContext);
  const { name, participants, date, dateEnd } = event;
  const [cardPosition, setCardPosition] = useState({});
  // const [applicantProfile, setApplicantProfile] = useState({});

  // useEffect(() => {
  //   if (
  //     !!event.applicant &&
  //     event.applicant.hasOwnProperty("applicant_username")
  //   ) {
  //     let username = event.applicant.applicant_username;
  //     getApplicantProfile(username, session, setApplicantProfile);
  //   }
  // }, [event.applicant, session]);

  useEffect(() => {
    const styles = { ...positioning };
    const el = document.getElementById("overview-card");
    // Check X-position of the EventOverview
    const totalWidth = window.innerWidth;
    const elWidth = el.offsetWidth;
    const xPosition = positioning.left;
    if (elWidth + xPosition > totalWidth) {
      styles.right = `-${totalWidth - elWidth}px`;
      delete styles.left;
    }
    // Check Y-porition of the EventOverview
    const totalHeight = window.innerHeight;
    const elHeight = el.offsetHeight;
    const yPostion = positioning.top;
    if (elHeight + yPostion > totalHeight) {
      styles.bottom = `-${totalHeight - elHeight}px`;
      delete styles.top;
    }
    setCardPosition(styles);
  }, [positioning]);

  function displayInterviewDetails() {
    let linkUrl = "";
    switch (event.interview_type) {
      case "address":
        if (!!event.interview_location && event.interview_location.length > 0) {
          //eslint-disable-next-line
          function address(ads) {
            return ads.replace(/\s/g, `+`);
          }
          linkUrl = `https://www.google.com/maps/place/${address(
            event.interview_location
          )}`;

          return (
            <InterviewType className="leo-flex-center">
              <svg
                width="11"
                height="14"
                xmlns="http://www.w3.org/2000/svg"
                xlinkHref="http://www.w3.org/1999/xlink"
                className="leo-relative"
              >
                <path
                  d="M5.25 7a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5m0-7C1.75 0 0 2.625 0 5.25S5.25 14 5.25 14s5.25-6.125 5.25-8.75S8.75 0 5.25 0"
                  fill="#C1C3C8"
                  fill-role="nonzero"
                />
              </svg>
              <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                {event.interview_location}
              </a>
            </InterviewType>
          );
        }
        break;
      case "phone_number":
        if (!!event.interview_info && event.interview_info.length > 0) {
          return (
            <InterviewType className="leo-flex">
              <svg
                width="12"
                height="15"
                xmlns="http://www.w3.org/2000/svg"
                xlinkHref="http://www.w3.org/1999/xlink"
              >
                <path
                  d="M7.021 10.931c.586-.439 1.263-.896 1.867-.585.805.42 1.61.842 2.415 1.244.659.348.897.732.513 1.41-.604 1.097-2.196 1.994-3.404 1.646A11.558 11.558 0 0 1 .032 2.679C.121 1.434 1.512.226 2.738.025c.769-.128 1.062.238 1.153.97l.33 2.708c.091.677-.568 1.153-1.172 1.556-1.464 1.024 2.507 6.697 3.971 5.672z"
                  fill="#C1C3C8"
                  fill-role="evenodd"
                />
              </svg>
              <span>{event.interview_info}</span>
            </InterviewType>
          );
        }
        break;
      case "web_link":
        if (!!event.interview_info && event.interview_info.length > 0) {
          let webLink = undefined;
          if (validUrl.isUri(event.interview_info)) {
            webLink = event.interview_info;
          }
          if (webLink) {
            return (
              <InterviewType className="leo-flex">
                <svg
                  width="12"
                  height="9"
                  xmlns="http://www.w3.org/2000/svg"
                  xlinkHref="http://www.w3.org/1999/xlink"
                >
                  <path
                    d="M9 3.15v2.7l3 1.35V1.8L9 3.15zM6.545 0h-5.09C.655 0 0 .675 0 1.5v6C0 8.325.655 9 1.455 9h5.09C7.345 9 8 8.325 8 7.5v-6C8 .675 7.345 0 6.545 0z"
                    fill="#004A6D"
                    fill-role="nonzero"
                  />
                </svg>
                <a href={webLink} target="_blank" rel="noopener noreferrer">
                  Join Video
                </a>
              </InterviewType>
            );
          }
        }
        break;
      case "google_meet":
        if (event.conference_link) {
          return (
            <InterviewType className="leo-flex">
              <svg
                width="12"
                height="9"
                xmlns="http://www.w3.org/2000/svg"
                xlinkHref="http://www.w3.org/1999/xlink"
              >
                <path
                  d="M9 3.15v2.7l3 1.35V1.8L9 3.15zM6.545 0h-5.09C.655 0 0 .675 0 1.5v6C0 8.325.655 9 1.455 9h5.09C7.345 9 8 8.325 8 7.5v-6C8 .675 7.345 0 6.545 0z"
                  fill="#004A6D"
                  fill-role="nonzero"
                />
              </svg>
              <a
                href={event.conference_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Conference Call
              </a>
            </InterviewType>
          );
        }
        break;

      default:
        return null;
    }
  }

  const closeModal = (event) => {
    if (event.target.id === "overview") dismiss();
  };

  const GoogleAttenndeeStatus = styled.div`
    align-items: center;
    background: #fff;
    border: 2px solid #fff;
    border-radius: 50%;
    bottom: -3px;
    height: 16px;
    justify-content: center;
    right: -3px;
    position: absolute;
    width: 16px;
  `;

  function attendeeStatusBg(attendee) {
    switch (attendee.responseStatus) {
      case "accepted":
        return (
          <svg width="14" height="14" viewBox="0 0 14 14">
            <g fill="none" fill-role="evenodd">
              <circle fill="#CCF5ED" cx="7" cy="7" r="7" />
              <path
                d="M5.8 10a.387.387 0 0 1-.283-.125l-2.4-2.572a.45.45 0 0 1 0-.606.381.381 0 0 1 .566 0L5.8 8.965l4.517-4.84a.381.381 0 0 1 .566 0 .45.45 0 0 1 0 .607l-4.8 5.143A.387.387 0 0 1 5.8 10z"
                fill="#00cba7"
                fill-role="nonzero"
              />
            </g>
          </svg>
        );
      case "tentative":
        return (
          <svg width="14" height="14" viewBox="0 0 14 14">
            <g fill="none" fill-role="evenodd">
              <circle fill="#FFF6CC" cx="7" cy="7" r="7" />
              <path
                d="M7.244 8.327h-.852c0-2.316 1.776-2.046 1.776-3.452 0-.696-.455-1.136-1.123-1.136-.582 0-1.15.34-1.15 1.179H5C5 3.71 5.895 3 7.045 3c1.25 0 1.975.81 1.975 1.918 0 1.775-1.776 1.505-1.776 3.409zm-.426 2.159a.673.673 0 0 1-.682-.682c0-.384.299-.696.682-.696.37 0 .682.312.682.696a.682.682 0 0 1-.682.682z"
                fill="#CBA800"
                fill-role="nonzero"
              />
            </g>
          </svg>
        );
      case "needsAction":
        return (
          <svg width="14" height="14" viewBox="0 0 14 14">
            <g fill="none" fill-role="evenodd">
              <circle fill="#FFF6CC" cx="7" cy="7" r="7" />
              <path
                d="M7.244 8.327h-.852c0-2.316 1.776-2.046 1.776-3.452 0-.696-.455-1.136-1.123-1.136-.582 0-1.15.34-1.15 1.179H5C5 3.71 5.895 3 7.045 3c1.25 0 1.975.81 1.975 1.918 0 1.775-1.776 1.505-1.776 3.409zm-.426 2.159a.673.673 0 0 1-.682-.682c0-.384.299-.696.682-.696.37 0 .682.312.682.696a.682.682 0 0 1-.682.682z"
                fill="#CBA800"
                fill-role="nonzero"
              />
            </g>
          </svg>
        );
      case "declined":
        return (
          <svg width="14" height="14" viewBox="0 0 14 14">
            <g fill="none" fill-role="evenodd">
              <circle fill="#FFD6DE" cx="7" cy="7" r="7" />
              <path
                d="M7.53 7l2.36-2.36a.375.375 0 1 0-.53-.53L7 6.47 4.64 4.11a.375.375 0 0 0-.53.53L6.47 7 4.11 9.36a.375.375 0 1 0 .53.53L7 7.53l2.36 2.36a.374.374 0 0 0 .53 0 .375.375 0 0 0 0-.53L7.53 7z"
                fill="#FF3159"
                fill-role="nonzero"
              />
            </g>
          </svg>
        );
      default:
        return "";
    }
  }

  return (
    <>
      <OverviewWrapper onClick={closeModal} id="overview">
        <OverviewCard style={cardPosition} id="overview-card">
          <CardName>{name || `Event Name`}</CardName>
          <CardDetails>
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
              {!!date &&
                `${date.getHours()}:${
                  !date.getMinutes() ? `00` : date.getMinutes()
                }`}
              {!!dateEnd &&
                ` - ${dateEnd.getHours()}:${
                  !dateEnd.getMinutes() ? `00` : dateEnd.getMinutes()
                }`}
            </InterviewDetails>
            {event.source === "recruitd" && (
              <InterviewDetails>{displayInterviewDetails()}</InterviewDetails>
            )}
          </CardDetails>
          {event.source === "recruitd" && (
            <IntervieweeBlock>
              <Link
                to={ROUTES.CandidateProfile.url(
                  store.company.mention_tag,
                  event.applicant.applicant_prof_id
                )}
              >
                <MemberBlock>
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
                </MemberBlock>
              </Link>
            </IntervieweeBlock>
          )}
          <CardParticipants>
            {!!participants &&
              participants.map((participant, index) => (
                <MemberBlock key={`${participant}-${index}`}>
                  <div className="leo-relative">
                    <AvatarIcon
                      imgUrl={participant.avatar}
                      name={participant.name}
                      size={30}
                    />
                    {event.source === "google" && (
                      <GoogleAttenndeeStatus className="leo-flex">
                        {attendeeStatusBg(participant)}
                      </GoogleAttenndeeStatus>
                    )}
                  </div>
                  <MemberDetails>
                    <span>{participant.name}</span>
                    <p>{participant.email}</p>
                  </MemberDetails>
                </MemberBlock>
              ))}
          </CardParticipants>
          {event.source !== "google" ? (
            <CardButtons>
              {date - Date.now() > 0 ? (
                <Fragment>
                  {event.event_type !== "meeting" && (
                    <div>
                      <button
                        onClick={() => {
                          openModal("rescheduleEvent", event);
                          dismiss();
                        }}
                      >
                        Reschedule
                      </button>
                    </div>
                  )}
                  <EditButtons>
                    {event.event_type !== "meeting" && (
                      <button
                        onClick={() => {
                          openModal("editEvent", event);
                          dismiss();
                        }}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (event.event_type !== "meeting") {
                          openModal("cancelEvent", event);
                        } else {
                          openModal("cancelMeeting", event);
                        }
                        dismiss();
                      }}
                    >
                      {event.event_type !== "meeting"
                        ? "Cancel"
                        : "Cancel Meeting"}
                    </button>
                  </EditButtons>
                </Fragment>
              ) : (
                <Fragment>
                  {event.status !== "conducted" ? (
                    <Fragment>
                      {event.event_type !== "meeting" && (
                        <button
                          onClick={() => {
                            setAsCompleted(
                              event.id,
                              store.session,
                              () => openModal("completeEvent", event),
                              () =>
                                dispatch({
                                  type: "SET_FORCE_UPDATE",
                                  payload: !state.forceUpdate,
                                })
                            );
                            dismiss();
                          }}
                        >
                          Set Completed
                        </button>
                      )}
                      {event.event_type !== "meeting" && (
                        <button
                          onClick={() => {
                            openModal("rescheduleEvent", event);
                            dismiss();
                          }}
                        >
                          Reschedule
                        </button>
                      )}
                    </Fragment>
                  ) : (
                    <button>Interview Completed</button>
                  )}
                  <EditButtons>
                    <button
                      onClick={() => {
                        if (event.event_type !== "meeting") {
                          openModal("cancelEvent", event);
                        } else {
                          openModal("cancelMeeting", event);
                        }
                        dismiss();
                      }}
                    >
                      {event.event_type !== "meeting"
                        ? "Cancel"
                        : "Cancel Meeting"}
                    </button>
                  </EditButtons>
                </Fragment>
              )}
            </CardButtons>
          ) : (
            <CardButtons>
              <a
                href={event.htmlLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google
              </a>
              <GoogleLogo />
            </CardButtons>
          )}
        </OverviewCard>
      </OverviewWrapper>
    </>
  );
};

export default EventOverview;
