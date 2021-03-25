import React, { useState, useEffect, useContext } from "react";
import ManageApplicantsHeader from "oldContainers/ATS/ManageApplicants/newComponents/ManageApplicantsHeader";
import { Redirect } from "react-router-dom";
import ApplicantsBoard from "oldContainers/ATS/ManageApplicants/newComponents/ApplicantsBoard";
import { fetchJobApplicants } from "helpersV2/applicants";
import { fetchInterviewStages } from "helpersV2/interviews";
import styled from "styled-components";
import { stageCount } from "./helpers/ManageApplicantFetchers";
import notify from "notifications";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import GlobalContext from "contexts/globalContext/GlobalContext";
import ApplicantsActionBar from "oldContainers/ATS/ManageApplicants/newComponents/ApplicantsActionBar";
const ManageApplicants = (props) => {
  const store = useContext(GlobalContext);
  const [initialPageLoad, setInitialPageLoader] = useState(true);
  const [activeModal, setActiveModal] = useState(undefined);
  const [stageCountVal, setStageCountVal] = useState(undefined);
  const [stagesUpdate, triggerStagesUpdate] = useState(undefined);
  const [candidates, setCandidates] = useState(undefined);
  const [displayAddCandidateModal, triggerAddCandidateModal] = useState(false);
  const [redirect, setRedirect] = useState(undefined);

  const [clientsInterviewStages, setClientsInterviewStages] = useState(null);
  const [isAgenciesClientJob, setIsAgenciesClientJob] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  // const [filters, setFilters] = useState({
  //   recruiter: undefined,
  //   reviewer: undefined,
  //   // date_from: undefined,
  //   // date_to: undefined,
  //   submitted: false
  // });

  useEffect(() => {
    if (
      props.session &&
      props.company &&
      props.permission.view &&
      props.jobId &&
      props.teamMember
    ) {
      fetchJobApplicants(props.company.id, props.jobId, props.session, {}).then(
        (res) => {
          if (!res.err) {
            setCandidates(res);
          } else {
            notify("Unable to fetch applicants");
          }
        }
      );
    }
  }, [
    props.session,
    props.company,
    props.permission,
    props.jobId,
    props.teamMember,
    props.candidatesUpdate,
    stagesUpdate,
  ]);

  useEffect(() => {
    if (props.jobId && props.company && props.session && props.teamMember) {
      stageCount(
        props.jobId,
        props.company.id,
        props.teamMember.team_member_id,
        props.session
      ).then((count) => {
        if (count !== "err") {
          setStageCountVal(count);
        }
      });
    }
  }, [
    props.jobId,
    props.company,
    props.session,
    props.teamMember,
    stagesUpdate,
  ]);

  useEffect(() => {
    if (candidates && stageCountVal && initialPageLoad) {
      setInitialPageLoader(false);
    }
  }, [stageCountVal, candidates]);

  useEffect(() => {
    if (redirect) setRedirect(undefined);
  }, [redirect]);

  useEffect(() => {
    if (props.jobData?.job_owner_company_id && props?.company) {
      (async (props) => {
        let agenciesClientJob =
          props.company.type === "Agency" &&
          props?.company.id !== props.jobData.job_owner_company_id;
        setIsAgenciesClientJob(agenciesClientJob);
        if (agenciesClientJob) {
          const interviewStagesData = await fetchInterviewStages(
            props.session,
            props.jobData.job_owner_company_id
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
      })(props);
    }
  }, [isAgenciesClientJob, props]);

  const openModal = (modalId) => {
    setActiveModal(modalId);
  };

  const closeModal = () => {
    setActiveModal(undefined);
  };

  const attachNewCandidates = (newCandidates) => {
    if (candidates) {
      setCandidates({
        ...candidates,
        applied: [...newCandidates, ...candidates.applied],
      });
    } else {
      setCandidates({ applied: newCandidates });
    }

    triggerStagesUpdate(Math.random());
  };

  useEffect(() => {
    if (candidates) {
      let selCands = [];
      Object.values(candidates).map((arr) =>
        arr.map((cand) => (cand.selected ? selCands.push({ ...cand }) : null))
      );
      setSelectedCandidates(selCands);
    }
  }, [candidates]);

  return (
    <>
      <BoardContainer>
        {props.jobData ? (
          <>
            <ManageApplicantsHeader
              jobData={props.jobData}
              setJobData={props.setJobData}
              company={props.company}
              session={props.session}
              jobId={props.jobId}
              teamMember={props.teamMember}
              openModal={openModal}
              closeModal={closeModal}
              activeModal={activeModal}
              setActiveModal={setActiveModal}
              attachNewCandidates={attachNewCandidates}
              displayAddCandidateModal={displayAddCandidateModal}
              store={store}
              selectedCandidates={selectedCandidates}
              candidates={candidates}
            />
            {initialPageLoad ? (
              <ATSContainer>
                <Spinner />
              </ATSContainer>
            ) : candidates ? (
              <>
                <ApplicantsBoard
                  candidates={candidates}
                  setCandidates={setCandidates}
                  activeParentModal={activeModal}
                  setActiveParentModal={setActiveModal}
                  stageCountVal={stageCountVal}
                  company={props.company}
                  jobId={props.jobId}
                  session={props.session}
                  triggerStagesUpdate={triggerStagesUpdate}
                  selectedJob={props.jobData}
                  teamMembers={props.teamMembers}
                  teamMember={props.teamMember}
                  triggerAddCandidateModal={triggerAddCandidateModal}
                  interviewStages={
                    isAgenciesClientJob && clientsInterviewStages
                      ? clientsInterviewStages
                      : props.interviewStages
                  }
                  triggerCandidatesUpdate={props.triggerCandidatesUpdate}
                  permission={props.permission}
                  store={props.store}
                  selectedCandidates={selectedCandidates}
                />
              </>
            ) : null}
          </>
        ) : null}
        {redirect && <Redirect to={redirect} />}
      </BoardContainer>
      <ApplicantsActionBar
        selectedTotal={selectedCandidates?.length}
        store={store}
        openModal={openModal}
        activeModal={activeModal}
      />
    </>
  );
};

const BoardContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - 200px);
  padding: 0;

  .infinite-scroll-component {
    overflow: auto !important;
  }
`;

export default ManageApplicants;
