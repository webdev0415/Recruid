import React, { useState, useEffect, Suspense } from "react";
import notify from "notifications";
// import ApplicantFilter from "./ApplicantFilter";
import styled from "styled-components";
import sharedHelpers from "helpers/sharedHelpers";
import ATSBanner from "sharedComponents/ATSBanner";
import { PermissionChecker } from "constants/permissionHelpers";
import retryLazy from "hooks/retryLazy";
const ExistingWarning = React.lazy(() =>
  retryLazy(() =>
    import(
      "oldContainers/ATS/ManageApplicants/components/JobManager/ExistingWarning"
    )
  )
);
const AddCandidatesModal = React.lazy(() =>
  retryLazy(() =>
    import("components/ViewJobs/JobDashboard/AddCandidates/AddCandidates")
  )
);

const ShareJobSocialModal = React.lazy(() =>
  retryLazy(() => import("modals/ShareJobSocialModal"))
);

const ManageApplicantsHeader = ({
  company,
  session,
  jobId,
  jobData,
  setJobData,
  teamMember,
  openModal,
  closeModal,
  activeModal,
  attachNewCandidates,
  displayAddCandidateModal,
  store,
  setActiveModal,
}) => {
  const [existingApplicants, setExistingApplicants] = useState(undefined);

  useEffect(() => {
    if (displayAddCandidateModal) {
      openModal("addCandidates");
    }
  }, [displayAddCandidateModal]);

  const addSelectedProfessionalsToJob = (selectedProfessionals) => {
    const postBody = {
      company_id: company.id,
      job_id: jobId,
      candidate_ids: selectedProfessionals,
      recruiter_id: teamMember.team_member_id,
      // Still need to come up with definitive way to decide if current user is acting on behalf of agency or employer
    };

    const job = jobData;

    if (job.company.id !== company.id) {
      postBody.agency_id = company.id;
    }

    sharedHelpers
      .inviteProfessionalsToJob(postBody, session)
      .then((response) => {
        const responseValidation = (obj) =>
          Object.prototype.toString.call(response) === `[object Object]` &&
          Object.keys(obj).length !== 0;
        if (
          responseValidation(response) &&
          `created_candidates` in response &&
          response.created_candidates.length > 0
        ) {
          if (attachNewCandidates) {
            attachNewCandidates(response.created_candidates);
          }
          closeModal();
        } else if (
          response &&
          !!response.existing_applicants &&
          response.created_candidates.length === 0
        ) {
          // alert(`All of the listed applicants have already been applied.`);
        } else alert(`Unexpected error occured, please try again later.`);
        if (response && response.existing_applicants.length > 0) {
          closeModal();
          setExistingApplicants(response.existing_applicants);
          openModal("existingWarning");
        } else if (response) {
          notify("info", "Candidates succesfully added");
          setExistingApplicants(response.existing_applicants);
        }
      });
  };

  return (
    <>
      <ATSBanner
        name={company?.name}
        avatar={company?.avatar_url}
        page={jobData?.title}
        clientButton={
          jobData.company?.id !== company?.id ? jobData.company.name : undefined
        }
        job={jobData}
        setJob={setJobData}
        setActiveModal={setActiveModal}
      >
        <PermissionChecker type="edit" valid={{ recruiter: true }}>
          {jobData &&
            !(
              (store.company.invited_by_agency ||
                store.allMyCompanies[0].invited_by_employer) &&
              store.allMyCompanies[0].trial !== "upgraded"
            ) && (
              <ButtonsContainer>
                <React.Fragment>
                  <button
                    className={"button button--default button--blue-dark"}
                    onClick={() => {
                      openModal("addCandidates");
                    }}
                  >
                    {company.type === "Agency"
                      ? "Shortlist Candidates"
                      : "Add Candidates"}
                  </button>
                </React.Fragment>
              </ButtonsContainer>
            )}
        </PermissionChecker>
      </ATSBanner>
      {activeModal === "addCandidates" && (
        <Suspense fallback={<div />}>
          <AddCandidatesModal
            closeModal={closeModal}
            addSelectedProfessionalsToJob={addSelectedProfessionalsToJob}
          />
        </Suspense>
      )}
      {activeModal === "existingWarning" && (
        <Suspense fallback={<div />}>
          <ExistingWarning
            existingApplicants={existingApplicants}
            closeModal={() => {
              closeModal();
              setExistingApplicants(undefined);
            }}
          />
        </Suspense>
      )}
      {activeModal === "share-job-social" && (
        <Suspense fallback={<div />}>
          <ShareJobSocialModal
            job={jobData}
            company={company}
            hide={() => {
              setActiveModal(undefined);
            }}
          />
        </Suspense>
      )}
    </>
  );
};

const ButtonsContainer = styled.div`
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: -5px;

  @media screen and (min-width: 768px) {
    margin: 0;
  }

  button {
    margin-left: 5px;
    margin-right: 5px;
    width: calc(50% - 10px);

    @media screen and (min-width: 768px) {
      margin: 0;
      margin-left: 10px;
      width: auto;
    }
  }
`;

export default ManageApplicantsHeader;
