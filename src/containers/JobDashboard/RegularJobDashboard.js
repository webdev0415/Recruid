import React, { useState, Suspense, useEffect } from "react";
import { Redirect } from "react-router-dom";
import ATSWrapper from "PageWrappers/ATSWrapper";
import { ROUTES } from "routes";
import retryLazy from "hooks/retryLazy";
import { AWS_CDN_URL } from "constants/api";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { jobAnalytics as fetchJobAnalytics } from "components/Analytics/helpers";
import JobDashboardBanner from "components/ViewJobs/JobDashboard/JobDashboardBanner";

const JobDashboard = React.lazy(() =>
  retryLazy(() => import("components/ViewJobs/JobDashboard"))
);
const JobAnalytics = React.lazy(() =>
  retryLazy(() => import("components/ViewJobs/jobAnalytics/Analytics.js"))
);
const ManageApplicants = React.lazy(() =>
  retryLazy(() => import("oldContainers/ATS/ManageApplicants"))
);
const JobDashboardNotes = React.lazy(() =>
  retryLazy(() => import("components/JobDashboard/JobDashboardNotes"))
);
const TempJobDashboardDetails = React.lazy(() =>
  retryLazy(() => import("components/TempJobDashboard/TempJobDashboardDetails"))
);

const RegularJobDashboard = ({
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
  const [candidates, setCandidates] = useState(undefined);
  const [jobAnalytics, setJobAnalytics] = useState(undefined);
  const [refreshCandidates, setRefreshCandidates] = useState(undefined);

  useEffect(() => {
    if (
      store.session &&
      store.company &&
      store.role &&
      store.role?.role_permissions?.is_member &&
      jobId
    ) {
      fetchJobAnalytics(
        store.company.id,
        jobId,
        "this month",
        store.session
      ).then((res) => setJobAnalytics(res));
    }
     
  }, [store.session, store.company, store.role, jobId]);

  return (
    <>
      {redirect && redirect !== props.location.pathname && (
        <Redirect to={redirect} />
      )}
      <ATSWrapper
        activeTab={props.match.params.tab || "overview"}
        routeObject={ROUTES.JobDashboard}
      >
        {!errorJob ? (
          <>
            {jobData && props.match.params.tab !== "applicants" && (
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
              />
            )}
            {(!props.match.params.tab ||
              props.match.params.tab === "overview") &&
              jobData && (
                <Suspense fallback={<div />}>
                  <JobDashboard
                    jobId={jobId}
                    companyTag={props.match.params.companyMentionTag}
                    teamMember={store.role ? store.role.team_member : undefined}
                    jobData={jobData}
                    candidates={candidates}
                    setCandidates={setCandidates}
                    updateJobData={updateJobData}
                    jobAnalytics={jobAnalytics}
                    interviewStages={store.interviewStages}
                    {...store}
                    publishJobCaller={publishJobCaller}
                    setJobData={setJobData}
                    activeModal={activeModal}
                    setActiveModal={setActiveModal}
                    refreshCandidates={refreshCandidates}
                    setRefreshCandidates={setRefreshCandidates}
                  />
                </Suspense>
              )}
            {props.match.params.tab === "analytics" && (
              <Suspense fallback={<div />}>
                <JobAnalytics
                  session={store.session}
                  match={props.match}
                  jobId={jobId}
                  companyTag={props.match.params.companyMentionTag}
                  company={store.company}
                  teamMember={store.role ? store.role.team_member : undefined}
                  jobData={jobData}
                  setJobData={setJobData}
                  refreshCandidates={refreshCandidates}
                  setRefreshCandidates={setRefreshCandidates}
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
                  candidates={candidates}
                  storage={{
                    skills: store.skills,
                    industries: store.industries,
                  }}
                  teamMembers={store.teamMembers}
                  professional={store.user}
                  interviewStages={store.interviewStages}
                  store={store}
                  setJobData={setJobData}
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
                  refreshCandidates={refreshCandidates}
                  setRefreshCandidates={setRefreshCandidates}
                />
              </Suspense>
            )}
            {props.match.params.tab === "details" && jobData && (
              <Suspense fallback={<div />}>
                <TempJobDashboardDetails
                  jobData={jobData}
                  setJobData={setJobData}
                  store={store}
                  jobId={jobId}
                  publishJobCaller={publishJobCaller}
                  refreshCandidates={refreshCandidates}
                  setRefreshCandidates={setRefreshCandidates}
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

export default RegularJobDashboard;
