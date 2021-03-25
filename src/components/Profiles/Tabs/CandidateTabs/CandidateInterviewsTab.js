import React, { useEffect, useState, Suspense } from "react";
import notify from "notifications";
import spacetime from "spacetime";
import styled from "styled-components";
import { setAsCompleted } from "helpers/calendar/eventsActions";
import { fetchCandidateInterviews } from "helpersV2/CandidateProfile";
import {
  ConfirmEventSvg,
  CancelEventSvg,
  CompletedBlock,
} from "components/Calendar/components/shared/EventCard";
import { CardButtons } from "components/Calendar/styles/CalendarComponents";

import AvatarIcon from "sharedComponents/AvatarIcon";
import EmptyTab from "components/Profiles/components/EmptyTab";
import retryLazy from "hooks/retryLazy";

const FeedbackModal = React.lazy(() =>
  retryLazy(() => import("modals/FeedbackModal"))
);
const CancelMeetingModal = React.lazy(() =>
  retryLazy(() => import("modals/CancelMeetingModal"))
);
const InterviewModal = React.lazy(() =>
  retryLazy(() => import("modals/InterviewModal/InterviewModal"))
);
const OfferModal = React.lazy(() =>
  retryLazy(() =>
    import(
      "oldContainers/ATS/ManageApplicants/components/ApplicantManager/modals/OfferModal"
    )
  )
);

const CandidateInterviewsTab = ({
  interviews,
  setInterviews,
  store,
  tnProfileId,
  canEdit,
}) => {
  const [activeModal, setActiveModal] = useState(undefined);
  const [currentInterview, setCurrentInterview] = useState(undefined);
  const [offerStatus, setOfferStatus] = useState(undefined);
  const [rescheduleInterview, setRescheduleInterview] = useState(false);
  const [cancelInterview, setCancelInterview] = useState(false);
  const [editInterview, setEditInterview] = useState(false);
  const [refresh, setRefresh] = useState(Math.random());
  useEffect(() => {
    if (tnProfileId && interviews === undefined && store.role) {
      fetchCandidateInterviews(
        store.session,
        store.company.id,
        tnProfileId,
        store.role.team_member.team_member_id
      ).then((res) => {
        if (!res.err) {
          setInterviews(res);
        } else {
          setInterviews(false);
          notify("danger", res);
        }
      });
    }
  }, [tnProfileId, interviews, refresh, store.role]);

  const openModal = (name, interview) => {
    setActiveModal(name);
    setCurrentInterview({
      ...interview,
      date: new Date(interview.start),
      dateEnd: new Date(interview.end),
    });
  };

  return (
    <EmptyTab
      data={interviews}
      title={"This candidate has no interviews."}
      copy={"Why don't you schedule some?"}
    >
      {interviews &&
        interviews.map((interview, index) => {
          let pastEvent = Date.now() - new Date(interview.end) > 0;
          return (
            <InterviewWrapper key={index}>
              <InterviewContainer>
                <InterviewDetails>
                  <h2>{interview.job.job_title}</h2>
                  <span>Interviewing</span>
                  <p>
                    {spacetime(new Date(interview.start)).format("{time}")} -{" "}
                    {spacetime(new Date(interview.end)).format(
                      "{time}, {date} {month} {year}"
                    )}
                  </p>
                </InterviewDetails>
                <InterviewCompanyAvatar>
                  <AvatarIcon
                    name={interview.company.company_name}
                    imgUrl={interview.company.company_avatar}
                    size="30"
                  />
                </InterviewCompanyAvatar>
              </InterviewContainer>
              {canEdit &&
                pastEvent &&
                interview.status !== "conducted" &&
                interview.event_type !== "meeting" && (
                  <CompContainer className="confirm-block">
                    <CompletedWrapper>
                      <div
                        style={{ fontWeight: "400" }}
                        // onClick={(e) => eventAction(e, interview)}
                      >
                        Completed?
                      </div>
                      <div className="leo-flex">
                        <button
                          onClick={() =>
                            setAsCompleted(interview.id, store.session, () => {
                              openModal("completeEvent", interview);
                              setRefresh(Math.random());
                            })
                          }
                        >
                          <ConfirmEventSvg />
                        </button>
                        <button
                          onClick={() => openModal("cancelEvent", interview)}
                        >
                          <CancelEventSvg />
                        </button>
                      </div>
                    </CompletedWrapper>
                  </CompContainer>
                )}
              {!pastEvent && canEdit && (
                <CompContainer className="confirm-block other-menu">
                  <CardButtons>
                    <div>
                      <button
                        onClick={() => {
                          setRescheduleInterview(true);
                          openModal("interviewModal", interview);
                        }}
                        style={{ textDecoration: "none" }}
                      >
                        Reschedule
                      </button>
                    </div>
                    <EditButtons>
                      <button
                        onClick={() => {
                          setEditInterview(true);
                          openModal("interviewModal", interview);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setCancelInterview(true);
                          openModal("interviewModal", interview);
                        }}
                      >
                        Cancel
                      </button>
                    </EditButtons>
                  </CardButtons>
                </CompContainer>
              )}
            </InterviewWrapper>
          );
        })}
      {activeModal === "cancelEvent" && currentInterview && (
        <Suspense fallback={<div />}>
          <CancelMeetingModal
            event={currentInterview}
            hide={() => {
              setCurrentInterview(undefined);
              setActiveModal(undefined);
              setCancelInterview(false);
              setEditInterview(false);
              setRescheduleInterview(false);
            }}
            session={store.session}
            afterFinish={() => setRefresh(Math.random())}
          />
        </Suspense>
      )}
      {activeModal === "completeEvent" && currentInterview && (
        <Suspense fallback={<div />}>
          <FeedbackModal
            show={true}
            hide={() => {
              setActiveModal(undefined);
              setCurrentInterview(undefined);
              setCancelInterview(false);
              setEditInterview(false);
              setRescheduleInterview(false);
            }}
            name={currentInterview.applicant.applicant_name}
            userAvatar={currentInterview.applicant.applicant_avatar}
            subTitle={`Applied for ${currentInterview.job.job_title} at ${currentInterview.company.company_name}`}
            interviewEvent={currentInterview}
            redirectToScheduleModal={() => setActiveModal("interviewModal")}
            redirectToOfferModal={(status) => {
              setActiveModal("offerModal");
              setOfferStatus(status);
            }}
            afterFinish={() => setRefresh(Math.random())}
          />
        </Suspense>
      )}
      {activeModal === "interviewModal" &&
        store.teamMembers &&
        store.role &&
        currentInterview && (
          <Suspense fallback={<div />}>
            <InterviewModal
              show={true}
              hide={() => {
                setActiveModal(undefined);
                setCurrentInterview(undefined);
                setCancelInterview(false);
                setEditInterview(false);
                setRescheduleInterview(false);
              }}
              interviewEvent={currentInterview}
              endTime={new Date(currentInterview.end)}
              companyId={store.company.id}
              company={store.company}
              rescheduleInterview={rescheduleInterview}
              cancelInterview={cancelInterview}
              editInterview={editInterview}
              teamMembers={store.teamMembers}
              statusMode={
                rescheduleInterview
                  ? "interview_rescheduled"
                  : "interview_scheduled"
              }
              changeToSchedule={() => setRescheduleInterview(true)}
              teamMemberId={store.role.team_member.team_member_id}
              afterFinish={() => setRefresh(Math.random())}
            />
          </Suspense>
        )}
      {activeModal === "offerModal" && currentInterview && (
        <Suspense fallback={<div />}>
          <OfferModal
            applicant={currentInterview.applicant}
            index={0}
            updateApplicantData={() => {}}
            closeModal={() => {
              setOfferStatus(undefined);
              setActiveModal(undefined);
            }}
            session={store.session}
            job={currentInterview.job}
            jobId={currentInterview.job_id}
            statusMode={offerStatus}
            setStageCount={() => {}}
            company={store.company}
            afterFinish={() => setRefresh(Math.random())}
          />
        </Suspense>
      )}
    </EmptyTab>
  );
};

export default CandidateInterviewsTab;

const InterviewContainer = styled.div`
  align-items: center;
  background: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  // margin-bottom: 10px;
  max-width: 460px;
  padding: 15px;
  width: 100%;
`;

const InterviewDetails = styled.div`
  h2 {
    font-size: 14px;
    line-height: normal;
    margin-bottom: 6px;
  }

  span {
    color: #74767b;
    font-size: 12px;
    line-height: normal;
    margin-bottom: 6px;
  }

  p {
    font-size: 12px;
    line-height: normal;
  }
`;

const InterviewCompanyAvatar = styled.div`
  img {
    border-radius: 50%;
    height: 30px;
    width: 30px;
  }
`;

const CompletedWrapper = styled(CompletedBlock)`
  border-top: none;
`;

const CompContainer = styled.div`
  max-width: 125px;
  &.other-menu {
    max-width: 200px;
  }
  margin-top: -5px;
  margin-bottom: 20px;
`;

const InterviewWrapper = styled.div`
  padding-bottom: 10px;
  .confirm-block {
    display: none;
  }
  &:hover {
    .confirm-block {
      display: block;
    }
  }
`;

const EditButtons = styled.div`
  button {
    color: #74767b;
    text-decoration: none !important;

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
`;
