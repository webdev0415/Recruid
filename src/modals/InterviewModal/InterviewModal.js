import React, { useState, useEffect, useContext } from "react";
import UniversalModal, {
  ModalFooter,
  ModalBody,
  ModalHeaderClassic,
  ModalHeaderV2,
} from "modals/UniversalModal/UniversalModal";

import GlobalContext from "contexts/globalContext/GlobalContext";
import { CalendarContext } from "contexts/calendarContext/calendarProvider";

import JobsStage from "modals/InterviewModal/JobsStage";
import CandidatesStage from "modals/InterviewModal/CandidatesStage";
import MembersStage from "modals/InterviewModal/MembersStage";
import ConfirmStage from "modals/InterviewModal/ConfirmStage";
import SuccessStage from "modals/InterviewModal/SuccessStage";
import CancelStage from "modals/InterviewModal/CancelStage";
import AvailabilityStage from "modals/InterviewModal/AvailabilityStage";
import RequestAvailabilityStage from "modals/InterviewModal/RequestAvailabilityStage";
import ConfirmAvailability from "modals/InterviewModal/ConfirmAvailability";
import InterviewStages from "modals/InterviewModal/InterviewStages";
import { fetchJobs } from "helpersV2/jobs";
import { getGoogleEventsByRange } from "helpers/calendar/eventsActions";
import {
  fetchMemberInterviews,
  fetchEditInterview,
  fetchMembersTokens,
  fetchCancelInterview,
  fetchSubmitInterview,
  fetchRequestAvailability,
} from "helpersV2/interviews";
import { fetchChangeCandidateStatus } from "helpersV2/applicants";
import { fetchInterviewStages } from "helpersV2/interviews";
import sharedHelpers from "helpers/sharedHelpers";
import notify from "notifications";
import Spinner from "sharedComponents/Spinner";

const daysNumbers = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

const modalStageHeaders = {
  jobs: "Select a Job",
  candidates: "Select a Candidate",
  members: "Select Date and Time",
  confirm: "Interview Details",
  cancel: "Cancel Interview",
  interviewStages: "Select an interview stage",
};

const parseDays = (arr) => {
  let result = [];
  for (let i of arr) {
    result.push(daysNumbers[i]);
  }
  return result;
};

const getCandidateName = (candidate) => {
  return (
    candidate.applicant_name ||
    candidate.talent_name ||
    candidate.tn_name ||
    candidate.professional_name ||
    candidate.email
  );
};
const SLICE_LENGHT = 20;

const InterviewModal = (props) => {
  // eslint-disable-next-line
  const store = useContext(GlobalContext);
  const { state, dispatch } = useContext(CalendarContext);
  const [stage, setStage] = useState("jobs");
  const [jobs, setJobs] = useState(undefined);
  const [moreJobs, setMoreJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState(undefined);
  const [candidates, setCandidates] = useState(undefined);
  const [moreCandidates, setMoreCandidates] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(undefined);
  const [teamMembers, setTeamMembers] = useState(undefined);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [membersInterviews, setMembersInterviews] = useState(undefined);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [interviewType, setInterviewType] = useState("address");
  const [interviewInfo, setInterviewInfo] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [interviewRes, setInterviewRes] = useState(undefined);
  const [timeZone, setTimeZone] = useState(undefined);
  const [availableDays, setAvailvableDays] = useState([]);
  const [additionalParticipants, setAdditionalParticipants] = useState([]);
  const [interviewTitle, setInterviewTitle] = useState("");
  const [selectedInterviewStage, setSelectedInterviewStage] = useState(
    undefined
  );
  const [sendCandidateEmail, setSendCandidateEmail] = useState(true);
  // CLIENTS INTERVIEW STAGES
  const [isAgenciesClientJob, setIsAgenciesClientJob] = useState(null);
  const [clientsInterviewStages, setClientsInterviewStages] = useState(null);
  const [search, setSearch] = useState("");
  const controller = new AbortController();
  const signal = controller.signal;
  // IF RESCHEDULING AN ALREADY SET INTERVIEW REDIRECT TO
  useEffect(() => {
    if (props.rescheduleInterview && props.interviewEvent) {
      setSelectedJob(props.interviewEvent.job);
      setSelectedCandidate(props.interviewEvent.applicant);
      console.log(props.interviewEvent);
      setStage("members");
    }
  }, [props.rescheduleInterview]);

  // IF EDITING AN INTERVIEW REDIRECT TO CONFIRM STAGE
  useEffect(() => {
    if (props.editInterview) {
      setSelectedJob(props.interviewEvent.job);
      setSelectedCandidate(props.interviewEvent.applicant);
      setStage("confirm");
    }
  }, [props.editInterview]);

  // IF CANCELLING AN INTERVIEW REDIRECT TO CANCEL STAGE
  useEffect(() => {
    if (props.cancelInterview) {
      setSelectedJob(props.interviewEvent.job);
      setSelectedCandidate(props.interviewEvent.applicant);
      setStage("cancel");
    }
  }, [props.cancelInterview]);

  //IF COMMING FROM THE APPLICANT MANAGER REDIRECT TO
  useEffect(() => {
    if (props.applicantManager) {
      setSelectedJob(props.selectedJob);
      setSelectedCandidate(props.selectedCandidate);
      setStage("availability");
    }
  }, [props.applicantManager]);

  useEffect(() => {
    if (props.interviewEvent) {
      if (props.editInterview || props.rescheduleInterview) {
        const {
          date,
          dateEnd,
          job,
          company,
          applicant,
          job_id,
          interview_type,
          interview_location,
          interview_info,
        } = props.interviewEvent;
        setSelectedDate(date);
        let difference = dateEnd - date;
        setSelectedDuration(difference / 60000);
        setSelectedJob({
          title: job.job_title,
          job_owner: company.company_name,
          id: job_id,
        });
        setSelectedCandidate(applicant);
        setInterviewType(interview_type);
        if (interview_type === `address`)
          setInterviewLocation(interview_location);
        else setInterviewInfo(interview_info);
      } else if (!props.rescheduleInterview && !props.cancelInterview) {
        setSelectedDate(props.interviewEvent);
        if (props.endTime) {
          let difference = props.endTime - props.interviewEvent;
          setSelectedDuration(difference / 60000);
        }
      } else {
        setSelectedDate(props.interviewEvent.date);
        let difference =
          props.interviewEvent.dateEnd - props.interviewEvent.date;
        setSelectedDuration(difference / 60000);
      }
    } else {
      let unformattedDate = new Date(Date.now());
      let unformattedMin = unformattedDate.getMinutes();
      if (unformattedMin % 15 !== 0) {
        unformattedMin = unformattedMin + (15 - (unformattedMin % 15));
      }
      unformattedDate.setMinutes(unformattedMin);
      setSelectedDate(unformattedDate);
    }
  }, [
    props.interviewEvent,
    props.rescheduleInterview,
    props.endTime,
    props.editInterview,
  ]);

  // IF IT'S A NEW INTERVIEW FETCH JOBS TO SELECT
  useEffect(() => {
    if (!props.rescheduleInterview && props.companyId && store.role) {
      fetchJobs(
        store.session,
        store.company.id,
        {
          slice: [0, SLICE_LENGHT],
          operator: "and",
          team_member_id: store.role.team_member.team_member_id,
          search: search?.length > 0 ? [search] : undefined,
        },
        signal
      ).then((jbs) => {
        if (!jbs.err) {
          setJobs(jbs);
          if (jbs.length === SLICE_LENGHT) {
            setMoreJobs(true);
          } else if (moreJobs === true) {
            setMoreJobs(false);
          }
        } else if (!signal.aborted) {
          notify("danger", jbs);
        }
      });
    }
    return () => controller.abort();
  }, [
    props.companyId,
    store.session,
    props.rescheduleInterview,
    search,
    store.role,
  ]);

  // IF NEW INTERVIEW AND THE JOB HAS BEEN SELECTED FETCH CANDIDATES
  useEffect(() => {
    if (selectedJob && !props.rescheduleInterview && !props.selectedCandidate) {
      const jobId = !selectedJob.id
        ? props.interviewEvent?.job_id
        : selectedJob.id;
      sharedHelpers
        .applicantData(
          jobId,
          store.session,
          props.companyId,
          1,
          props.teamMemberId
        )
        .then((cands) => {
          setCandidates(cands.search_results);
          setMoreCandidates(cands.total_pages > 1 ? true : false);
        });
    }
  }, [props.companyId, store.session, selectedJob, props.rescheduleInterview]);

  //SET THE TEAM MEMBERS ASSIGNED TO THE INTERVIEW OR JUST SELF IF INTERVIEW IS NEW
  useEffect(() => {
    if (props.teamMembers) {
      let self;
      props.teamMembers.map((member) =>
        member.professional_id === store.session.id ? (self = member) : null
      );
      if (
        props.rescheduleInterview &&
        props.interviewEvent &&
        props.interviewEvent.participants.length > 0
      ) {
        setSelectedTeamMembers(props.interviewEvent.participants);
      } else if (self !== undefined) {
        setSelectedTeamMembers([self]);
      }

      setTeamMembers(props.teamMembers);
    }
  }, [
    props.teamMembers,
    store.session,
    props.interviewEvent,
    props.rescheduleInterview,
  ]);

  // FETCH TEAM MEMBER INTERVIEWS TO DISPLAY ON MEMBERS STAGE
  useEffect(() => {
    if (
      selectedTeamMembers &&
      selectedTeamMembers.length > 0 &&
      selectedDate &&
      membersInterviews === undefined
    ) {
      fetchAllMembersInterviews(selectedDate);
    }
    // eslint-disable-next-line
  }, [selectedTeamMembers, selectedDate]);

  // IF THE INTERVIEW IS FOR THE CLIENTS JOB GET HIS INTERVIEW STAGES
  useEffect(() => {
    if (selectedJob?.job_owner_company_id && props.company) {
      (async (selectedJob, company, session) => {
        let agenciesClientJob =
          company.type === "Agency" &&
          company.id !== selectedJob.job_owner_company_id;
        setIsAgenciesClientJob(agenciesClientJob);
        if (agenciesClientJob) {
          const interviewStagesData = await fetchInterviewStages(
            session,
            selectedJob.job_owner_company_id
          );
          if (
            interviewStagesData?.err ||
            interviewStagesData?.error ||
            interviewStagesData?.errors
          ) {
            return notify("Unable to get clients interview stages");
          }
          return setClientsInterviewStages(interviewStagesData);
        }
      })(selectedJob, props.company, store.session);
    }
  }, [selectedJob, props.company, store.session]);

  function getAllGEvents(arr, team, date = selectedDate) {
    let professionalIds = team.map((member) => member.professional_id);
    let start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let end = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );
    let nextEvents = [...arr];
    async function getEventsOfMembers() {
      const tokens = await fetchMembersTokens(
        store.session,
        props.companyId,
        professionalIds
      );
      if (!tokens.err) {
        for (let i = 0; i < tokens.length; i++) {
          if (!!tokens[i] && !!tokens[i].length) {
            let gEvents = await getGoogleEventsByRange(
              start.toISOString(),
              end.toISOString(),
              tokens[i],
              "interviewModal"
            );
            if (gEvents) {
              nextEvents[i].push(...gEvents);
            }
          }
        }
      }
      return nextEvents;
    }
    return getEventsOfMembers();
  }

  const fetchAllMembersInterviews = (date) => {
    let memberIds = selectedTeamMembers.map((member) => member.team_member_id);
    fetchMemberInterviews(memberIds, date, store.session, "interview").then(
      (res) => {
        if (!res.err) {
          let nextEvents = [...res.body];
          getAllGEvents(nextEvents, selectedTeamMembers, date).then((data) => {
            setMembersInterviews(data);
          });
        }
      }
    );
  };

  const loadMoreJobs = () => {
    fetchJobs(
      store.session,
      store.company.id,
      {
        slice: [jobs.length, SLICE_LENGHT],
        operator: "and",
        team_member_id: store.role.team_member.team_member_id,
        search: search?.length > 0 ? [search] : undefined,
      },
      signal
    ).then((jbs) => {
      if (!jbs.err) {
        setJobs([...jobs, ...jbs]);
        if (jbs.length === SLICE_LENGHT) {
          setMoreJobs(true);
        } else if (moreJobs === true) {
          setMoreJobs(false);
        }
      } else if (!signal.aborted) {
        notify("danger", jbs);
      }
    });
  };

  const loadMoreCandidates = () => {
    sharedHelpers
      .applicantData(
        selectedJob.id,
        store.session,
        props.companyId,
        Math.floor(candidates.length / 20) + 1,
        props.teamMemberId
      )
      .then((cands) => {
        if (cands !== "err") {
          setMoreCandidates(
            Math.floor((candidates.length + cands.search_results.length) / 20) <
              cands.total_pages
              ? true
              : false
          );
          setCandidates([...candidates, ...cands.search_results]);
        }
      });
  };

  const addMember = (member) => {
    let newMembers = [...selectedTeamMembers];
    newMembers.push(member);
    setSelectedTeamMembers(newMembers);
    let memberIds = newMembers.map((member) => member.team_member_id);
    fetchMemberInterviews(
      memberIds,
      selectedDate,
      store.session,
      "interview"
    ).then((res) => {
      if (!res.err) {
        let nextEvents = [...res.body];
        getAllGEvents(nextEvents, newMembers).then((data) => {
          setMembersInterviews(data);
        });
      }
    });
  };

  const removeMember = (i) => {
    if (i !== 0) {
      let newSelected = [...selectedTeamMembers];
      let newInterviews = [...membersInterviews];
      newSelected.splice(i, 1);
      newInterviews.splice(i, 1);
      setSelectedTeamMembers(newSelected);
      setMembersInterviews(newInterviews);
    }
  };

  const moveToNextStage = () =>
    stage === "members" && !selectedDate
      ? null
      : stage === "members"
      ? setStage("confirm")
      : null;

  function editInterview() {
    const body = { interview_type: interviewType };
    body[
      interviewType === `address` ? `interview_location` : `interview_info`
    ] = interviewType === `address` ? interviewLocation : interviewInfo;
    fetchEditInterview(store.session, props.interviewEvent.id, body).then(
      (res) => {
        if (!res.err) {
          dispatch({ type: "SET_FORCE_UPDATE", payload: !state.forceUpdate });
          setStage("success");
        } else {
          notify("danger", `An error occured while editing an event!`);
        }
      }
    );
  }

  const requestAvailability = () => {
    let postBody = {
      name:
        interviewTitle ||
        `${getCandidateName(selectedCandidate)}, ${selectedJob.title}`,
      source: "recruitd",
      interviewer_prof_id: store.session.id,
      start: selectedDate,
      end: new Date(Date.parse(selectedDate) + selectedDuration * 60000),
      participants: selectedTeamMembers,
      active_company: props.companyId,
      job_id: selectedJob.id,
      applicant_id: selectedCandidate.applicant_id,
      interview_type: interviewType,
      available_days: parseDays(availableDays),
      interview_info: interviewInfo || undefined,
      interview_location: interviewLocation || undefined,
      interview_stage: selectedInterviewStage?.static_name,
      // generate_link: interviewType === "google_meet" ? true : undefined
    };
    fetchRequestAvailability(store.session, postBody).then((res) => {
      if (!res.err && res.body === "Success") {
        notify("info", "Request has been successfully sent to the candidate.");
        if (props.updateApplicantData) {
          props.updateApplicantData();
        } else if (selectedInterviewStage) {
          fetchChangeCandidateStatus(
            store.company.id,
            selectedCandidate.applicant_id,
            "interview_requested",
            selectedInterviewStage.static_name,
            store.session
          );
        }
        props.hide();
      } else {
        notify(
          "danger",
          "Failed to make a request for candidate availability."
        );
      }
    });
  };
  const submitInterview = () => {
    let postBody = {
      name:
        interviewTitle ||
        `${getCandidateName(selectedCandidate)}, ${selectedJob.title}`,
      source: "recruitd",
      interviewer_prof_id: store.session.id,
      start: selectedDate,
      end: new Date(Date.parse(selectedDate) + selectedDuration * 60000),
      participants: selectedTeamMembers,
      active_company: props.companyId,
      job_id: selectedJob.id,
      applicant_id: selectedCandidate.applicant_id,
      interview_type: interviewType,
      interview_info: interviewInfo || undefined,
      interview_location: interviewLocation || undefined,
      // generate_link: interviewType === "google_meet" ? true : undefined,
      external_participants:
        additionalParticipants?.length > 0 ? additionalParticipants : undefined,
      email_toggle: sendCandidateEmail,
    };
    fetchSubmitInterview(
      store.session,
      postBody,
      props.rescheduleInterview ? props.interviewEvent.id : undefined
    )
      .then((res) => {
        if (!res.err) {
          if (props.updateApplicantData) {
            props.updateApplicantData();
          } else if (selectedInterviewStage) {
            fetchChangeCandidateStatus(
              store.company.id,
              selectedCandidate.applicant_id,
              "interview_scheduled",
              selectedInterviewStage?.static_name,
              store.session
            );
          }
          setInterviewRes(res);
          setStage("success");
        } else {
          alert("Unable to set the interview event");
        }
      })
      .finally(() => {
        if (props.afterFinish) {
          props.afterFinish();
        }
        dispatch({ type: "SET_FORCE_UPDATE", payload: !state.forceUpdate });
      });
  };

  const submitCancelInterview = () => {
    fetchCancelInterview(store.session, props.interviewEvent.id).then((res) => {
      if (!res.err) {
        setInterviewRes(res);
        dispatch({ type: "SET_FORCE_UPDATE", payload: !state.forceUpdate });
        if (props.afterFinish) {
          props.afterFinish();
        }
        notify("info", "Interview event cancelled");
        props.hide();
      } else {
        alert("Unable to set the interview event");
      }
    });
  };

  return (
    <UniversalModal
      show={props.show}
      hide={props.hide}
      id="interview-modal"
      width={stage === "members" || stage === "confirm" ? 960 : 600}
    >
      {(!selectedCandidate || stage === "interviewStages") && (
        <ModalHeaderClassic
          title={modalStageHeaders[stage] || "Interview Scheduled"}
          closeModal={props.hide}
        />
      )}
      {selectedCandidate && stage !== "interviewStages" && (
        <ModalHeaderV2
          name={
            selectedCandidate.name ||
            selectedCandidate.talent_name ||
            selectedCandidate.applicant_name
          }
          userAvatar={selectedCandidate.avatar_url || ""}
          subTitle={`Applied for ${selectedJob?.title || ""} at ${
            props.company.name
          }`}
        />
      )}
      <ModalBody>
        {stage === "jobs" && jobs && (
          <JobsStage
            jobs={jobs}
            moreJobs={moreJobs}
            loadMoreJobs={loadMoreJobs}
            companyId={props.companyId}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            setCandidates={setCandidates}
            setStage={setStage}
            session={store.session}
            search={search}
            setSearch={setSearch}
          />
        )}
        {stage === "candidates" && candidates && (
          <CandidatesStage
            candidates={candidates}
            moreCandidates={moreCandidates}
            loadMoreCandidates={loadMoreCandidates}
            selectedCandidate={selectedCandidate}
            setSelectedCandidate={setSelectedCandidate}
            setStage={setStage}
            companyId={props.companyId}
            session={store.session}
            jobId={selectedJob.id}
          />
        )}
        {stage === "interviewStages" && (
          <InterviewStages
            interviewStages={
              isAgenciesClientJob && clientsInterviewStages
                ? clientsInterviewStages
                : store.interviewStages
            }
            setSelectedInterviewStage={setSelectedInterviewStage}
            selectedInterviewStage={selectedInterviewStage}
            setModalStage={setStage}
          />
        )}
        {stage === "availability" && (
          <AvailabilityStage
            name={props.name}
            setStage={setStage}
            status={props.statusMode}
            company={store.company}
          />
        )}
        {stage === "requestAvailability" && (
          <RequestAvailabilityStage
            teamMembers={teamMembers}
            selectedTeamMembers={selectedTeamMembers}
            setSelectedTeamMembers={setSelectedTeamMembers}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
            interviewType={interviewType}
            setInterviewType={setInterviewType}
            interviewInfo={interviewInfo}
            setInterviewInfo={setInterviewInfo}
            interviewLocation={interviewLocation}
            setInterviewLocation={setInterviewLocation}
            availableDays={availableDays}
            setAvailvableDays={setAvailvableDays}
          />
        )}
        {stage === "confirmAvailability" && <ConfirmAvailability />}
        {stage === "members" && teamMembers && (
          <MembersStage
            interviewEvent={props.interviewEvent}
            teamMembers={teamMembers}
            selectedTeamMembers={selectedTeamMembers}
            membersInterviews={membersInterviews}
            setSelectedTeamMembers={setSelectedTeamMembers}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedCandidate={selectedCandidate}
            addMember={addMember}
            fetchAllMembersInterviews={fetchAllMembersInterviews}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
            timeZone={timeZone}
            setTimeZone={setTimeZone}
            removeMember={removeMember}
          />
        )}
        {stage === "confirm" && (
          <ConfirmStage
            selectedTeamMembers={selectedTeamMembers}
            selectedDate={selectedDate}
            selectedJob={selectedJob}
            selectedCandidate={selectedCandidate}
            selectedDuration={selectedDuration}
            rescheduleInterview={props.rescheduleInterview}
            wipeCandidate={() => setSelectedCandidate(undefined)}
            returnToStage={(val) => setStage(val)}
            interviewType={interviewType}
            setInterviewType={setInterviewType}
            interviewInfo={interviewInfo}
            setInterviewInfo={setInterviewInfo}
            interviewLocation={interviewLocation}
            setInterviewLocation={setInterviewLocation}
            editInterview={props.editInterview}
            timeZone={timeZone}
            additionalParticipants={additionalParticipants}
            setAdditionalParticipants={setAdditionalParticipants}
            interviewTitle={interviewTitle}
            setInterviewTitle={setInterviewTitle}
            sendCandidateEmail={sendCandidateEmail}
            setSendCandidateEmail={setSendCandidateEmail}
          />
        )}
        {stage === "success" && (
          <SuccessStage
            selectedTeamMembers={selectedTeamMembers}
            selectedDate={selectedDate}
            selectedJob={selectedJob}
            selectedCandidate={selectedCandidate}
            selectedDuration={selectedDuration}
            interviewRes={interviewRes}
            timeZone={timeZone}
            interviewTitle={interviewTitle}
          />
        )}
        {stage === "cancel" && (
          <CancelStage
            interviewEvent={props.interviewEvent}
            setStage={setStage}
            submitCancelInterview={submitCancelInterview}
            changeToSchedule={props.changeToSchedule}
          />
        )}
        {(stage === "jobs" && !jobs) ||
        (stage === "candidates" && !candidates) ||
        (stage === "members" && !teamMembers) ||
        (stage !== "success" && interviewRes) ? (
          <Loader />
        ) : null}
      </ModalBody>
      <ModalFooter hide={props.hide}>
        {stage === "availability" && props.applicantManager && (
          <button
            className="button button--default button--blue-dark"
            onClick={() => props.updateApplicantData()}
          >
            Just set Status
          </button>
        )}
        {stage === "members" && (
          <button
            className="button button--default button--blue-dark"
            onClick={moveToNextStage}
          >
            Next
          </button>
        )}
        {stage === "confirm" && props.editInterview && (
          <button
            className="button button--default button--blue-dark"
            onClick={editInterview}
          >
            Edit
          </button>
        )}
        {stage === "confirm" && !props.editInterview && (
          <button
            className="button button--default button--blue-dark"
            onClick={submitInterview}
          >
            Schedule
          </button>
        )}
        {stage === "requestAvailability" && (
          <button
            className="button button--default button--blue-dark"
            onClick={requestAvailability}
          >
            Request
          </button>
        )}
      </ModalFooter>
    </UniversalModal>
  );
};

const Loader = () => <Spinner />;

export default InterviewModal;
