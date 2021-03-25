import React, {
  useContext,
  useState,
  useEffect,
  Component,
  Suspense,
} from "react";
import { Redirect } from "react-router-dom";
import { ROUTES } from "routes";

import GlobalContext from "contexts/globalContext/GlobalContext";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import { InnerPageContainer } from "styles/PageContainers";
import ViewJobBanner from "components/ViewJobs/components/ViewJobBanner/ViewJobBanner";
import ViewJobTable from "components/ViewJobs/components/ViewJobTable/ViewJobTable";

import FilterV2 from "sharedComponents/filterV2";
import { permissionChecker } from "constants/permissionHelpers";
import { fetchJobs } from "helpersV2/jobs";
import {
  setJobStatus,
  deleteJob,
  publishDraft,
} from "components/ViewJobs/helpers/viewJobsHelpers";
// import { fetchCompanyClients } from "helpersV2/vendors/clients";

// import { clientIndex } from "components/Vendors/helpers/vendorsHelpers";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { editJob } from "components/ViewJobs/helpers/viewJobsHelpers";
import notify from "notifications";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import retryLazy from "hooks/retryLazy";
import DuplicateJobModal from "modals/DuplicateJobModal";
import { EmptyJobs } from "assets/svg/EmptyImages";
const SLICE_LENGHT = 20;
const EmptyTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/components/EmptyTab"))
);

const PipelineView = React.lazy(() =>
  retryLazy(() =>
    import("components/ViewJobs/components/PipelineView/PipelineView")
  )
);
const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);
const ShareJobSocialModal = React.lazy(() =>
  retryLazy(() => import("modals/ShareJobSocialModal"))
);

const ATSDifferentiator = (props) => {
  return (
    <>
      {!props.as_component ? (
        <InnerPage
          pageTitle={
            (props.store.company && props.store.company.name
              ? props.store.company.name
              : "") + " - Jobs"
          }
          originName="Jobs"
        >
          <ATSWrapper activeTab="jobs" routeObject={ROUTES.ViewJobs}>
            <InnerPageContainer>{props.children}</InnerPageContainer>
          </ATSWrapper>
        </InnerPage>
      ) : (
        <>{props.children}</>
      )}
    </>
  );
};

const HookViewJobs = (props) => {
  const store = useContext(GlobalContext);
  const [jobs, setJobs] = useState(undefined);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [initialPageLoad, setInitialPageLoad] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const controller = new AbortController();
  const signal = controller.signal;
  const [permission, setPermission] = useState({ view: false, edit: false });
  const [redirect, setRedirect] = useState(undefined);
  const [refreshJobs, setRefreshJobs] = useState(undefined);
  useEffect(() => {
    if (store.role) {
      setPermission(
        permissionChecker(store.role?.role_permissions, {
          recruiter: true,
          hiring_manager: true,
        })
      );
    }
  }, [store.role]);

  useEffect(() => {
    if (store.company && store.role && permission.view) {
      fetchJobs(
        store.session,
        store.company.id,
        {
          ...filters,
          slice: [0, SLICE_LENGHT],
          operator: "and",
          team_member_id: store.role.team_member.team_member_id,
          id: props.elastic_ids,
          search: search?.length > 0 ? [search] : undefined,
        },
        signal
      ).then((jbs) => {
        if (!jbs.err) {
          setJobs(jbs);
          if (jbs.length === SLICE_LENGHT) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
          setInitialPageLoad(false);
        } else if (!signal.aborted) {
          notify("danger", jbs);
        }
      });
    }
    return () => controller.abort();
  }, [
    store.company,
    store.role,
    store.session,
    filters,
    props.elastic_ids,
    search,
    permission,
    refreshJobs,
  ]);

  const fetchMore = () => {
    fetchJobs(
      store.session,
      store.company.id,
      {
        ...filters,
        slice: [jobs.length, SLICE_LENGHT],
        operator: "and",
        team_member_id: store.role.team_member.team_member_id,
        search: search?.length > 0 ? [search] : undefined,
        id: props.elastic_ids,
      },
      signal
    ).then((jbs) => {
      if (!jbs.err) {
        setJobs([...jobs, ...jbs]);
        if (jbs.length === SLICE_LENGHT) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else if (!signal.aborted) {
        notify("danger", jbs);
      }
    });
  };

  const changeFilters = (newFilters) => {
    if (
      Object.values(filters).length === 0 &&
      Object.values(newFilters).length === 0
    ) {
      return;
    }
    setFilters(newFilters);
  };

  useEffect(() => {
    if (redirect) {
      setRedirect(undefined);
    }
  }, [redirect]);

  return (
    <ATSDifferentiator {...props} store={store}>
      <ViewJobs
        {...props}
        {...store}
        jobs={jobs}
        setJobs={setJobs}
        changeFilters={changeFilters}
        fetchMore={fetchMore}
        hasMore={hasMore}
        initialPageLoad={initialPageLoad}
        search={search}
        setSearch={setSearch}
        permission={permission}
        redirect={redirect}
        setRedirect={setRedirect}
        refreshJobs={() => setRefreshJobs(Math.random())}
      />
    </ATSDifferentiator>
  );
};

class ViewJobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeModal: null,
      activeJob: null,
      activeJobIx: null,
      selectedClients: [],
      expiredTrial: undefined,
      modalView: undefined,
      pipelineView: false,
    };
    this.setJobStatus = setJobStatus.bind(this);
    this.publishDraft = publishDraft.bind(this);
    this.deleteJob = deleteJob.bind(this);
    this.edit = editJob.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.setActiveJob = this.setActiveJob.bind(this);
  }

  updateJobStatus(status, jobId) {
    this.setJobStatus(status, this.props.company.id, jobId).then((response) => {
      if (response !== "err") {
        const index = this.props.jobs.findIndex((job) => job.id === jobId);
        let jobs = [...this.props.jobs];
        if (jobs[index]) {
          jobs[index].job_status = status;
        }
        this.props.setJobs(jobs);
      }
    });
  }

  openModal(modalId) {
    this.setState({ activeModal: modalId });
  }

  closeModal() {
    this.setState({
      activeModal: null,
      viewModal: undefined,
      modalView: undefined,
    });
  }

  insertNewJob(job) {
    this.props.setJobs([job, ...this.props.jobs]);
  }

  editJob(job, index) {
    this.setState({ activeJob: job, activeJobIx: index });
    setTimeout(() => {
      this.openModal("EditJobModal");
    });
  }

  delete() {
    this.deleteJob(this.props.company.id, this.state.activeJob.id).then(
      (response) => {
        if (response !== "err") {
          let jobs = [...this.props.jobs];
          jobs.splice(this.state.activeJobIx, 1);
          this.props.setJobs(jobs);
          notify("info", "Job successfully deleted");
          this.closeModal();
        } else {
          notify("danger", "Unable to delete job");
        }
      }
    );
  }

  openConfirmation(job, ix) {
    this.setState({ activeJob: job, activeJobIx: ix });
    this.openModal("confirmation");
  }

  publishDraft() {}

  togglePipelineView = () =>
    this.setState({ pipelineView: !this.state.pipelineView });

  setActiveJob = (activeJob) => {
    this.setState({ activeJob });
  };

  render() {
    return (
      <>
        <>
          {!this.props.as_component && (
            <ViewJobBanner
              jobs={this.props.jobs}
              company={this.props.company}
              session={this.props.session}
              activeModal={this.state.activeModal}
              openModal={this.openModal.bind(this)}
              insertNewJob={this.insertNewJob.bind(this)}
              closeModal={this.closeModal.bind(this)}
              role={this.props.role.team_member}
              pipelineView={this.state.pipelineView}
              togglePipelineView={this.togglePipelineView.bind(this)}
              as_component={this.props.as_component}
              search={this.props.search}
              setSearch={this.props.setSearch}
            />
          )}
          <ATSContainer>
            {this.props.initialPageLoad ? (
              <Spinner />
            ) : (
              <>
                {this.state.pipelineView ? (
                  <div style={{ marginTop: 20 }}>
                    <Suspense fallback={<div />}>
                      <PipelineView
                        company={this.props.company}
                        teamMembers={this.props.teamMembers}
                        interviewStages={this.props.interviewStages}
                        displayTable={true}
                        type="jobs"
                        role={this.props.role.team_member}
                        deleteJob={this.openConfirmation.bind(this)}
                        editJob={this.editJob.bind(this)}
                        publishDraft={(companyId, job) =>
                          this.publishDraft(companyId, job.id).then(
                            (response) => {
                              if (response !== "err") {
                                this.updateJobStatus("open", job.id).bind(this);
                                notify(
                                  "info",
                                  "Successfully Published Draft Job!"
                                );
                              }
                            }
                          )
                        }
                      />
                    </Suspense>
                  </div>
                ) : this.props.jobs.length > 0 ? (
                  <>
                    <FilterV2
                      source="job"
                      returnFilters={(newFilters) =>
                        this.props.changeFilters(newFilters)
                      }
                    />
                    <ViewJobTable
                      jobs={this.props.jobs}
                      setJobs={this.props.setJobs}
                      fetchMore={this.props.fetchMore}
                      hasMore={this.props.hasMore}
                      editJob={this.editJob.bind(this)}
                      deleteJob={this.openConfirmation.bind(this)}
                      updateJobStatus={this.updateJobStatus.bind(this)}
                      role={this.props.role.team_member}
                      company={this.props.company}
                      publishDraft={this.publishDraft}
                      refreshJobs={this.props.refreshJobs}
                      setActiveJob={this.setActiveJob}
                      openModal={this.openModal}
                    />
                  </>
                ) : (
                  <div
                    className={sharedStyles.emptyContainer}
                    style={{
                      minHeight: "calc(100vh - 260px)",
                    }}
                  >
                    {!this.props.company?.invited_by_employer?.length ? (
                      <Suspense fallback={<div />}>
                        <EmptyTab
                          data={this.props.jobs}
                          title={"Create a job"}
                          copy={
                            "Create a job to work on, then publish it to job boards or open it internally for private sourcing."
                          }
                          image={<EmptyJobs />}
                          action={
                            this.props.role.role_permissions.owner ||
                            this.props.role.role_permissions.admin ||
                            this.props.role.role_permissions.recruiter
                              ? () => {
                                  this.props.setRedirect(
                                    ROUTES.JobCreation.url(
                                      this.props.company.mention_tag
                                    )
                                  );
                                }
                              : undefined
                          }
                          actionText={
                            this.props.role.role_permissions.owner ||
                            this.props.role.role_permissions.admin ||
                            this.props.role.role_permissions.recruiter
                              ? "Create Your First Job"
                              : undefined
                          }
                        />
                      </Suspense>
                    ) : (
                      <Suspense fallback={<div />}>
                        <EmptyTab
                          data={this.props.jobs}
                          title={"Create a job"}
                          copy={
                            "Create a job to work on, then publish it to job boards or open it internally for private sourcing."
                          }
                          image={<EmptyJobs />}
                        />
                      </Suspense>
                    )}
                  </div>
                )}
              </>
            )}
          </ATSContainer>
          {this.state.activeModal && this.state.activeModal === "confirmation" && (
            <Suspense fallback={<div />}>
              <ConfirmModalV2
                show={true}
                hide={() => {
                  this.closeModal();
                }}
                header="Delete Job"
                text="Are you sure you want to delete this job?"
                actionText="Delete"
                actionFunction={() => this.delete()}
              />
            </Suspense>
          )}
          {this.state.activeJob && this.state.activeModal === "duplicate-job" && (
            <DuplicateJobModal
              jobId={this.state.activeJob.id}
              hide={() => {
                this.setState({ activeJob: null, activeModal: null });
              }}
              store={this.props}
              refreshJobs={this.props.refreshJobs}
            />
          )}
        </>
        {this.state.activeModal === "share-job-social" && this.state.activeJob && (
          <Suspense fallback={<div />}>
            <ShareJobSocialModal
              job={this.state.activeJob}
              company={this.props.company}
              hide={() => {
                this.setState({ activeJob: null, activeModal: null });
              }}
            />
          </Suspense>
        )}
        {this.state.redirectToCompanies && (
          <Redirect to={ROUTES.MyCompanies.url()} />
        )}
        {this.state.redirectToLogin && (
          <Redirect to={ROUTES.ProfessionalSignin.url()} />
        )}
        {this.props.redirect &&
          this.props.redirect !== this.props.location.pathname && (
            <Redirect to={this.props.redirect} />
          )}
      </>
    );
  }
}

export default HookViewJobs;
