import React, { useState, useEffect, Suspense } from "react";
import JobsCard from "components/Profiles/components/JobsCard";
import EmptyTab from "components/Profiles/components/EmptyTab";
import retryLazy from "hooks/retryLazy";
import {
  fetchChangeCandidateStatus,
  fetchCandidateApplications,
} from "helpersV2/applicants";
import { fetchInterviewStages } from "helpersV2/interviews";
import notify from "notifications";
import AppButton from "styles/AppButton";
import AddCandidatesToJobModal from "modals/AddCandidatesToJobModal";
import styled from "styled-components";
import { EmptyJobs } from "assets/svg/EmptyImages";
//modals
const RejectionModal = React.lazy(() =>
  retryLazy(() => import("modals/RejectionModal"))
);
const StartDateModal = React.lazy(() =>
  retryLazy(() => import("modals/StartDateModal"))
);
const InterviewModal = React.lazy(() =>
  retryLazy(() => import("modals/InterviewModal/InterviewModal.js"))
);

const CandidateJobsTab = ({
  jobs,
  setJobs,
  store,
  tnProfileId,
  tnProfile,
  allClientStages,
  setAllClientStages,
  permission,
  activeModal,
  setActiveModal,
}) => {
  //INNER modals
  const [innerModal, setInnerModal] = useState(undefined);
  const [selectedJob, setSelectedJob] = useState(undefined);
  const [refreshJobs, setRefreshJobs] = useState(false);

  const [newStatus, setNewStatus] = useState(undefined);
  const [newStage, setNewStage] = useState(undefined);

  useEffect(() => {
    if ((tnProfileId && store.role && jobs === undefined) || refreshJobs) {
      fetchCandidateApplications(
        tnProfileId,
        store.company.id,
        store.session,
        store.role.team_member.team_member_id
      ).then((res) => {
        setRefreshJobs(false);
        if (!res.err) {
          setJobs(res);
        } else {
          setJobs(false);
          notify("danger", res);
        }
      });
    }
  }, [tnProfileId, jobs, refreshJobs, store.role]);

  useEffect(() => {
    if (jobs && store.company.type === "Agency") {
      let clientIds = {};
      jobs.map((job) =>
        !clientIds[job.job_post.company.id]
          ? (clientIds[job.job_post.company.id] = true)
          : null
      );
      const fetchStages = {};
      Object.keys(clientIds).map((clientId) => {
        if (clientId !== store.company.id && !allClientStages[clientId]) {
          fetchInterviewStages(store.session, clientId).then((res) => {
            if (!res.err) {
              fetchStages[clientId] = res;
              if (
                Object.keys(clientIds).length ===
                Object.keys(fetchStages).length
              ) {
                setAllClientStages({
                  ...allClientStages,
                  ...fetchStages,
                });
              }
            }
          });
        }
        return null;
      });
    }
  }, [jobs]);

  const callChangeStatusEndpoint = (missingInfo) => {
    fetchChangeCandidateStatus(
      store.company.id,
      selectedJob.applicant.applicant_id,
      newStatus,
      newStage,
      store.session,
      missingInfo
    ).then((res) => {
      if (!res.err) {
        setRefreshJobs(true);
        setSelectedJob(undefined);
        setNewStatus(undefined);
        setNewStage(undefined);
        notify("info", "Candidate status succesfully changed");
      } else {
        notify("danger", "Unable to update candidate status");
      }
    });
  };

  useEffect(() => {
    if (newStage && newStatus && selectedJob) {
      if (statusPromptSalary[newStatus]) {
        setInnerModal("start-date-modal");
      } else if (statusPromptSchedule[newStatus]) {
        setInnerModal("schedule-interview-modal");
      } else if (statusRejectDecline[newStatus]) {
        setInnerModal("rejection-modal");
      } else {
        callChangeStatusEndpoint();
      }
    }
  }, [newStage, newStatus, selectedJob]);

  const closeInnerModal = () => {
    setInnerModal(undefined);
    setSelectedJob(undefined);
    setNewStatus(undefined);
    setNewStage(undefined);
  };

  const confirmChangeCandidateStatus = (missingInfo) => {
    callChangeStatusEndpoint(missingInfo);
  };

  return (
    <>
      <ButtonContainer>
        <AppButton onClick={() => setActiveModal("add-to-job")}>
          Add To Job
        </AppButton>
      </ButtonContainer>
      <EmptyTab
        data={jobs}
        title={"This candidate has no jobs."}
        copy={`"Why don't you add them to some?"`}
        image={<EmptyJobs />}
      >
        {jobs &&
          jobs.map((job, index) => (
            <JobsCard
              key={`job-card-${index}`}
              job={job}
              newStage={newStage}
              newStatus={newStatus}
              setNewStatus={setNewStatus}
              setNewStage={setNewStage}
              selectedJob={selectedJob}
              setSelectedJob={setSelectedJob}
              allClientStages={allClientStages}
              setAllClientStages={setAllClientStages}
              canEdit={permission.edit}
            />
          ))}
        {innerModal === "rejection-modal" && selectedJob && (
          <Suspense fallback={<div />}>
            <RejectionModal
              show={true}
              hide={closeInnerModal}
              name={
                tnProfile.name ||
                tnProfile.talent_name ||
                tnProfile.candidate_name
              }
              userAvatar={tnProfile.avatar_url}
              subTitle={`Applied for ${selectedJob.job_post.title} at ${selectedJob.job_post.company.name}`}
              confirmChangeCandidateStatus={confirmChangeCandidateStatus}
              status={newStatus}
              store={store}
              jobTitle={selectedJob.job_post.title}
            />
          </Suspense>
        )}
        {innerModal === "start-date-modal" && selectedJob && (
          <Suspense fallback={<div />}>
            <StartDateModal
              show={true}
              hide={closeInnerModal}
              name={
                tnProfile.name ||
                tnProfile.talent_name ||
                tnProfile.candidate_name
              }
              userAvatar={tnProfile.avatar_url}
              subTitle={`Applied for ${selectedJob.job_post.title} at ${selectedJob.job_post.company.name}`}
              confirmChangeCandidateStatus={confirmChangeCandidateStatus}
              selectedJob={selectedJob}
              salary={selectedJob.applicant.salary_rate}
              startDate={selectedJob.applicant.start_date}
              finalFee={selectedJob.applicant.final_fee}
              status={newStatus}
            />
          </Suspense>
        )}
        {innerModal === "schedule-interview-modal" && selectedJob && (
          <Suspense fallback={<div />}>
            <InterviewModal
              show={true}
              hide={closeInnerModal}
              companyId={store.company.id}
              company={store.company}
              teamMembers={store.teamMembers}
              // applicant manager properties
              applicantManager={true}
              selectedJob={selectedJob.job_post}
              name={
                tnProfile.name ||
                tnProfile.talent_name ||
                tnProfile.candidate_name
              }
              jobId={selectedJob.job_post.id}
              selectedCandidate={{
                ...tnProfile,
                applicant_id: selectedJob.applicant?.applicant_id,
              }}
              index={undefined}
              updateApplicantData={confirmChangeCandidateStatus}
              statusMode={newStatus}
              setStageCount={() => {}}
              teamMemberId={store.role.team_member.team_member_id}
            />
          </Suspense>
        )}
      </EmptyTab>
      {activeModal === "add-to-job" && (
        <AddCandidatesToJobModal
          hide={() => {
            setActiveModal(undefined);
            setSelectedJob(undefined);
          }}
          store={store}
          network={[
            { ...tnProfile, selected: true, professional_id: tnProfileId },
          ]}
          setNetwork={() => {}}
          selectedJob={selectedJob}
          setSelectedJob={setSelectedJob}
          setActiveModal={setActiveModal}
          activeModal={activeModal}
          clearSelected={() => {}}
          tempPlus={false}
          afterCall={() => setRefreshJobs(true)}
        />
      )}
    </>
  );
};

const statusPromptSchedule = {
  "offer interview": true,
  interview_scheduled: true,
  "reschedule interview": true,
};

const statusPromptSalary = {
  "start date confirmed": true,
  hired: true,
  "offer position": true,
};

const statusRejectDecline = {
  rejected: true,
  declined: true,
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 17px;
`;

export default CandidateJobsTab;
