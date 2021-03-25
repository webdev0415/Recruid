import React, { useState, Suspense, useEffect } from "react";
import { Redirect } from "react-router-dom";
import ATSWrapper from "PageWrappers/ATSWrapper";
import { ROUTES } from "routes";
import retryLazy from "hooks/retryLazy";
import { AWS_CDN_URL } from "constants/api";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
// import { jobAnalytics as fetchJobAnalytics } from "components/Analytics/helpers";
import { fetchJobCandidateNotes } from "components/ViewJobs/JobDashboard/helpers.js";
import JobDashboardBanner from "components/ViewJobs/JobDashboard/JobDashboardBanner";

const TempJobDashboardTab = React.lazy(() =>
  retryLazy(() => import("components/TempJobDashboard/TempJobDashboardTab"))
);
// const JobDashboard = React.lazy(() =>
//   retryLazy(() => import("components/ViewJobs/JobDashboard"))
// );
// const JobAnalytics = React.lazy(() =>
//   retryLazy(() => import("components/ViewJobs/jobAnalytics/Analytics.js"))
// );
const ManageApplicants = React.lazy(() =>
  retryLazy(() => import("oldContainers/ATS/ManageApplicants"))
);
const JobDashboardNotes = React.lazy(() =>
  retryLazy(() => import("components/JobDashboard/JobDashboardNotes"))
);
const JobDashboardShifts = React.lazy(() =>
  retryLazy(() => import("components/TempJobDashboard/JobDashboardShifts"))
);
const TempJobDashboardAnalytics = React.lazy(() =>
  retryLazy(() =>
    import("components/TempJobDashboard/TempJobDashboardAnalytics")
  )
);
const TempJobDashboardDetails = React.lazy(() =>
  retryLazy(() => import("components/TempJobDashboard/TempJobDashboardDetails"))
);
const TempJobDashboardTeam = React.lazy(() =>
  retryLazy(() => import("components/TempJobDashboard/TempJobDashboardTeam"))
);

// {(!props.match.params.tab ||
//   props.match.params.tab === "overview") &&
//   jobData && (
//     <Suspense fallback={<div />}>
//       <JobDashboard
//         jobData={jobData}
//         store={store}
//         jobId={jobId}
//         publishJobCaller={publishJobCaller}
//         candidateJobNotes={candidateJobNotes}
//         //
//         companyTag={props.match.params.companyMentionTag}
//         teamMember={store.role ? store.role.team_member : undefined}
//         candidates={candidates}
//         setCandidates={setCandidates}
//         updateJobData={updateJobData}
//         jobAnalytics={jobAnalytics}
//         interviewStages={store.interviewStages}
//         {...store}
//       />
//     </Suspense>
//   )}

const TempJobDashboard = ({
  store,
  errorJob,
  jobId,
  jobData,
  setJobData,
  permission,
  updateJobData,
  publishJobCaller,
  activeModal,
  setActiveModal,
  ...props
}) => {
  const [
    redirect,
    // setRedirect
  ] = useState(undefined);
  const [
    candidates,
    // setCandidates
  ] = useState(undefined);
  const [teamMembers, setTeamMembers] = useState([]);
  const [candidateJobNotes, setCandidateJobNotes] = useState(undefined);
  const [refreshCandidates, setRefreshCandidates] = useState(undefined);

  // const [jobAnalytics, setJobAnalytics] = useState(undefined);

  // useEffect(() => {
  //   if (
  //     store.session &&
  //     store.company &&
  //     store.role &&
  //     store.role?.role_permissions?.is_member &&
  //     jobId
  //   ) {
  //     fetchJobAnalytics(
  //       store.company.id,
  //       jobId,
  //       "this month",
  //       store.session
  //     ).then((res) => setJobAnalytics(res));
  //   }
  //    
  // }, [store.session, store.company, store.role, jobId]);

  useEffect(() => {
    if (store.company && store.session && jobId) {
      fetchJobCandidateNotes(
        {
          job_id: jobId,
          company_id: store.company.id,
        },
        store.session
      ).then((response) => {
        if (response !== "err") {
          setCandidateJobNotes(response);
        }
      });
    }
  }, [store.company, store.session, jobId]);

  return (
    <>
      {redirect && redirect !== props.location.pathname && (
        <Redirect to={redirect} />
      )}
      <ATSWrapper
        activeTab={props.match.params.tab || "overview"}
        routeObject={ROUTES.TempJobDashboard}
      >
        {!errorJob ? (
          <>
            {jobData &&
              props.match.params.tab !== "shifts" &&
              props.match.params.tab !== "applicants" && (
                <JobDashboardBanner
                  company={store.company}
                  jobId={jobId}
                  jobData={jobData}
                  setJobData={setJobData}
                  page="overview"
                  openModal={(id) => setActiveModal(id)}
                  activeModal={activeModal}
                  setActiveModal={setActiveModal}
                  publishJobCaller={publishJobCaller}
                  updateJob={() =>
                    updateJobData(jobId, store.session, store.company.id)
                  }
                  setRefreshCandidates={setRefreshCandidates}
                  refreshCandidates={refreshCandidates}
                  v2theme={true}
                />
              )}
            {(!props.match.params.tab ||
              props.match.params.tab === "overview") &&
              jobData && (
                <Suspense fallback={<div />}>
                  <TempJobDashboardTab
                    jobData={jobData}
                    setJobData={setJobData}
                    store={store}
                    jobId={jobId}
                    publishJobCaller={publishJobCaller}
                    candidateJobNotes={candidateJobNotes}
                    updateJobData={updateJobData}
                  />
                </Suspense>
              )}
            {props.match.params.tab === "applicants" && (
              <Suspense fallback={<div />}>
                <ManageApplicants
                  match={props.match}
                  session={store.session}
                  jobId={jobId}
                  companyTag={props.match.params.companyMentionTag}
                  company={store.company}
                  permission={permission}
                  teamMember={store.role ? store.role.team_member : undefined}
                  jobData={jobData}
                  setJobData={setJobData}
                  candidates={candidates}
                  storage={{
                    skills: store.skills,
                    industries: store.industries,
                  }}
                  teamMembers={store.teamMembers}
                  professional={store.user}
                  interviewStages={store.interviewStages}
                  store={store}
                  candidatesUpdate={refreshCandidates}
                  triggerCandidatesUpdate={setRefreshCandidates}
                />
              </Suspense>
            )}
            {props.match.params.tab === "notes" && (
              <Suspense fallback={<div />}>
                <JobDashboardNotes
                  company={store.company}
                  jobData={jobData}
                  setJobData={setJobData}
                  store={store}
                  jobId={jobId}
                />
              </Suspense>
            )}
            {props.match.params.tab === "shifts" && (
              <Suspense fallback={<div />}>
                <JobDashboardShifts
                  jobData={jobData}
                  setJobData={setJobData}
                  store={store}
                  jobId={jobId}
                />
              </Suspense>
            )}
            {props.match.params.tab === "analytics" && (
              <Suspense fallback={<div />}>
                <TempJobDashboardAnalytics
                  jobData={jobData}
                  setJobData={setJobData}
                  store={store}
                  jobId={jobId}
                />
              </Suspense>
            )}
            {props.match.params.tab === "details" && (
              <Suspense fallback={<div />}>
                <TempJobDashboardDetails
                  jobData={jobData}
                  setJobData={setJobData}
                  store={store}
                  jobId={jobId}
                  publishJobCaller={publishJobCaller}
                />
              </Suspense>
            )}
            {props.match.params.tab === "team" && (
              <Suspense fallback={<div />}>
                <TempJobDashboardTeam
                  jobData={jobData}
                  setJobData={setJobData}
                  store={store}
                  jobId={jobId}
                  publishJobCaller={publishJobCaller}
                  teamMembers={teamMembers}
                  setTeamMembers={setTeamMembers}
                />
              </Suspense>
            )}
          </>
        ) : (
          <div style={{ marginTop: "50px" }}>
            <div className={sharedStyles.emptyContainer}>
              <div className={sharedStyles.empty}>
                <img src={`${AWS_CDN_URL}/icons/empty-icons/empty-team.svg`} alt="not found illustration" />
                <h2>404 Not Found</h2>
                <p>
                  Were sorry the page your looking for cannot be found, click
                  below to head back to the dashboard.
                </p>
              </div>
            </div>
          </div>
        )}
      </ATSWrapper>
    </>
  );
};

export default TempJobDashboard;
