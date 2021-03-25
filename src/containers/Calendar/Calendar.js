import React, {
  Fragment,
  useContext,
  Component,
  useState,
  Suspense,
} from "react";
import { Redirect } from "react-router-dom";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { CalendarContext } from "contexts/calendarContext/calendarProvider";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import { InnerPageContainer } from "styles/PageContainers";
import { ROUTES } from "routes";
// Components/Containers
import CalendarBanner from "components/Calendar/components/CalendarBanner";
import { CalendarWrapper } from "components/Calendar/styles/CalendarComponents";
import AsyncRender from "components/Calendar/components/AsyncRender";
import CalendarSideBar from "components/Calendar/components/shared/CalendarSideBar";
// import EditEventModal from "containers/Calendar/components/EditEventModal";
import EventOverview from "components/Calendar/components/shared/EventOverview";
import retryLazy from "hooks/retryLazy";

const InterviewModal = React.lazy(() =>
  retryLazy(() => import("modals/InterviewModal/InterviewModal"))
);
const FeedbackModal = React.lazy(() =>
  retryLazy(() => import("modals/FeedbackModal"))
);
const OfferModal = React.lazy(() =>
  retryLazy(() =>
    import(
      "oldContainers/ATS/ManageApplicants/components/ApplicantManager/modals/OfferModal"
    )
  )
);
const CancelMeetingModal = React.lazy(() =>
  retryLazy(() => import("modals/CancelMeetingModal"))
);

const HookCalendar = (props) => {
  const { session, company, role, teamMembers } = useContext(GlobalContext);
  const { state, dispatch } = useContext(CalendarContext);
  const [eventType, setEventType] = useState(["interview", "meeting"]);
  return (
    <InnerPage
      pageTitle={(company && company.name ? company.name : "") + " - Schedule"}
      originName="Calendar"
    >
      <ATSWrapper activeTab="calendar" routeObject={ROUTES.Calendar}>
        <InnerPageContainer>
          <Calendar
            {...props}
            session={session}
            company={company}
            calendarStore={state}
            role={role ? role : undefined}
            teamMembers={teamMembers}
            permission={role ? role?.role_permissions?.is_member : undefined}
            calendarDispatch={dispatch}
            eventType={eventType}
            setEventType={setEventType}
          />
        </InnerPageContainer>
      </ATSWrapper>
    </InnerPage>
  );
};

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.mentionTag = this.props.match.params.companyMentionTag;
    this.months = {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December",
    };
    this.week = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    this.fullDate = new Date();
    this.state = {
      weekObj: [],
      currentYear: this.fullDate.getFullYear(),
      currentMonth: this.fullDate.getMonth(),
      currentDate: this.fullDate.getDate(),
      viewMode: null,
      activeModal: null,
      expiredTrial: undefined,
      modalView: undefined,
      displayInterviewModal: false,
      displayFeedbackModal: false,
      displayOfferModal: false,
      currentInterviewEvent: undefined,
      currentInterviewEndTime: undefined,
      rescheduleInterview: false,
      cancelInterview: false,
      cancelMeeting: false,
      editInterview: false,
      showOverview: true,
      eventOverview: null,
      offerStatus: undefined,
    };
    this.openUpgradeModal = this.openUpgradeModal.bind(this);
  }

  generateWeek = (
    year = this.state.currentYear,
    month = this.state.currentMonth,
    date = this.state.currentDate
  ) => {
    const nextWeek = [];
    let prevDate = date - 1;
    let nextDate = date;
    let firstPointer = this.fullDate.getDay() - 1;
    let secondPointer = this.fullDate.getDay();
    while (nextWeek.length <= 7) {
      if (firstPointer >= 0) {
        nextWeek.unshift(new Date(year, month, prevDate));
        firstPointer--;
        prevDate--;
      } else if (secondPointer <= 6) {
        nextWeek.push(new Date(year, month, nextDate));
        secondPointer++;
        nextDate++;
      } else {
        this.setState({ weekObj: nextWeek });
        return;
      }
    }
  };

  noScroll = () => window.scrollTo(0, 0);

  componentDidMount = () => {
    const body = document.getElementById("app-body");
    body.classList.add("overflow-hidden");
    this.generateWeek();
    window.addEventListener("scroll", this.noScroll);
  };

  componentWillUnmount = () => {
    const body = document.getElementById("app-body");
    body.classList.remove("overflow-hidden");
    window.removeEventListener("scroll", this.noScroll);
  };

  clearModalState = () => {
    this.setState({ viewMode: null, activeModal: null });
  };

  closeModal = () => {
    setTimeout(() => {
      this.clearModalState();
    }, 350);
    this.setState({
      viewModal: undefined,
      modalView: undefined,
    });
  };

  openUpgradeModal() {
    this.setState({ modalView: "upgradeModal" });
  }

  openModal = (id, event, endTime) => {
    let Modal;
    switch (id) {
      case "createEvent":
        this.setState({
          displayInterviewModal: true,
          currentInterviewEvent: event,
          currentInterviewEndTime: endTime,
        });
        break;
      case "rescheduleEvent":
        this.setState({
          displayInterviewModal: true,
          currentInterviewEvent: event,
          rescheduleInterview: true,
        });
        break;
      case "editEvent":
        this.setState({
          displayInterviewModal: true,
          currentInterviewEvent: event,
          editInterview: true,
          rescheduleEvent: true,
        });
        break;
      case "cancelEvent":
        this.setState({
          displayInterviewModal: true,
          currentInterviewEvent: event,
          cancelInterview: true,
        });
        break;
      case "cancelMeeting":
        this.setState({
          currentInterviewEvent: event,
          cancelMeeting: true,
        });
        break;
      case "completeEvent":
        this.setState({
          displayFeedbackModal: true,
          currentInterviewEvent: event,
        });
        break;
      default:
        Modal = null;
    }
    Promise.resolve(this.setState({ viewMode: null, activeModal: null })).then(
      () => {
        this.setState({ viewMode: id, activeModal: Modal });
      }
    );
  };
  // Funcs for TableCalendar week toggle
  nextWeek = () =>
    this.setState(
      { currentDate: this.state.currentDate + 7 },
      this.generateWeek
    );
  prevWeek = () =>
    this.setState(
      { currentDate: this.state.currentDate - 7 },
      this.generateWeek
    );
  // Funcs for EventOverview Card
  dismissEventOverview = () =>
    this.setState({ eventOverview: null, showOverview: false });
  diplayEventOverview = (event, data) => {
    this.setState({
      eventOverview: (
        <EventOverview
          event={data}
          openModal={this.openModal}
          dismiss={this.dismissEventOverview}
          positioning={{ top: event.clientY, left: event.clientX }}
        />
      ),
      showOverview: true,
    });
  };

  render() {
    const { months, diplayEventOverview } = this;
    const {
      weekObj,
      activeModal,
      viewMode,
      displayInterviewModal,
      displayFeedbackModal,
      displayOfferModal,
      currentInterviewEvent,
      currentInterviewEndTime,
      rescheduleInterview,
      cancelInterview,
      showOverview,
      eventOverview,
      editInterview,
    } = this.state;
    const { teamMembers, company, calendarStore, session, role } = this.props;
    const { openModal, prevWeek, nextWeek, generateWeek } = this;
    return (
      <Fragment>
        <>
          <CalendarBanner
            displayInterviewModal={(bool) =>
              this.setState({ displayInterviewModal: bool })
            }
          />
          {displayInterviewModal && teamMembers && !!role && (
            <Suspense fallback={<div />}>
              <InterviewModal
                show={displayInterviewModal}
                hide={() =>
                  this.setState({
                    displayInterviewModal: false,
                    currentInterviewEvent: undefined,
                    rescheduleInterview: false,
                    editInterview: false,
                    cancelInterview: false,
                    currentInterviewEndTime: null,
                  })
                }
                interviewEvent={currentInterviewEvent}
                endTime={currentInterviewEndTime}
                companyId={company.id}
                company={company}
                rescheduleInterview={rescheduleInterview}
                cancelInterview={cancelInterview}
                editInterview={editInterview}
                teamMembers={teamMembers}
                statusMode={
                  rescheduleInterview
                    ? "interview_rescheduled"
                    : "interview_scheduled"
                }
                changeToSchedule={() =>
                  this.setState({
                    cancelInterview: false,
                    rescheduleInterview: true,
                  })
                }
                teamMemberId={role.team_member.team_member_id}
                view="calendar"
              />
            </Suspense>
          )}
          {this.state.cancelMeeting && (
            <Suspense fallback={<div />}>
              <CancelMeetingModal
                event={currentInterviewEvent}
                hide={() =>
                  this.setState({
                    currentInterviewEvent: undefined,
                    cancelMeeting: false,
                  })
                }
                session={session}
              />
            </Suspense>
          )}
          {displayFeedbackModal && (
            <Suspense fallback={<div />}>
              <FeedbackModal
                show={displayFeedbackModal}
                hide={() =>
                  this.setState({
                    displayFeedbackModal: false,
                    // currentInterviewEvent: undefined,
                    currentInterviewEndTime: null,
                  })
                }
                name={currentInterviewEvent.applicant.applicant_name}
                userAvatar={currentInterviewEvent.applicant.applicant_avatar}
                subTitle={`Applied for ${currentInterviewEvent.job.job_title} at ${currentInterviewEvent.company.company_name}`}
                interviewEvent={currentInterviewEvent}
                redirectToScheduleModal={() => {
                  this.openModal("rescheduleEvent", currentInterviewEvent);
                  this.setState({
                    displayFeedbackModal: false,
                  });
                }}
                redirectToOfferModal={(status) => {
                  this.setState({
                    offerStatus: status,
                    displayOfferModal: true,
                    displayFeedbackModal: false,
                  });
                }}
              />
            </Suspense>
          )}
          {displayOfferModal && (
            <Suspense fallback={<div />}>
              <OfferModal
                applicant={currentInterviewEvent.applicant}
                index={0}
                updateApplicantData={() => {}}
                closeModal={() => {
                  this.setState({
                    offerStatus: undefined,
                    displayOfferModal: false,
                  });
                }}
                session={session}
                job={currentInterviewEvent.job}
                jobId={currentInterviewEvent.job_id}
                statusMode={this.state.offerStatus}
                setStageCount={() => {}}
                company={company}
              />
            </Suspense>
          )}
          <CalendarWrapper>
            <AsyncRender
              week={weekObj}
              openModal={openModal}
              prevWeek={prevWeek}
              nextWeek={nextWeek}
              months={months}
              diplayEventOverview={diplayEventOverview}
              generateWeek={generateWeek}
              globalView={calendarStore.globalView}
              eventType={this.props.eventType}
              setEventType={this.props.setEventType}
            />
            <CalendarSideBar
              monthsList={months}
              session={session}
              diplayEventOverview={diplayEventOverview}
              eventType={this.props.eventType}
              setEventType={this.props.setEventType}
            />
          </CalendarWrapper>
          {showOverview && eventOverview}
          {!!viewMode && activeModal}
        </>
        {this.state.redirectToCompanies && (
          <Redirect to={ROUTES.MyCompanies.url()} />
        )}
        {this.state.redirectToLogin && (
          <Redirect to={ROUTES.ProfessionalSignin.url()} />
        )}
      </Fragment>
    );
  }
}

export default HookCalendar;
