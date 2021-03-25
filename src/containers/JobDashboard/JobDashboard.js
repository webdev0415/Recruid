import React, { useState, useEffect, Suspense, useContext } from "react";
import { Redirect } from "react-router-dom";
import GlobalContext from "contexts/globalContext/GlobalContext";
import InnerPage from "PageWrappers/InnerPage";
import { ROUTES } from "routes";
// import AsyncComponent from "helpers/AsyncComponent.js";
import { singleJobData } from "components/ViewJobs/JobDashboard/helpers.js";
import notify from "notifications";
import { permissionChecker } from "constants/permissionHelpers";
import { fetchEditJob } from "helpersV2/jobs";
import { updateCompany } from "contexts/globalContext/GlobalMethods";
import companyHelpers from "helpers/company/company.helpers";
import retryLazy from "hooks/retryLazy";
import EmptyTab from "components/Profiles/components/EmptyTab";
import emptyStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { EmptyActivity } from "assets/svg/EmptyImages";
const TempJobDashboard = React.lazy(() =>
  retryLazy(() => import("containers/JobDashboard/TempJobDashboard"))
);
const RegularJobDashboard = React.lazy(() =>
  retryLazy(() => import("containers/JobDashboard/RegularJobDashboard"))
);

const JobDetailContainer = (props) => {
  const store = useContext(GlobalContext);
  const [jobId, setJobId] = useState(undefined);
  const [jobData, setJobData] = useState(undefined);
  const [notAllowed, setNotAllowed] = useState(false);

  const [errorJob, setErrorJob] = useState(false);
  const controller = new AbortController();
  const signal = controller.signal;
  const [redirect, setRedirect] = useState(undefined);
  const [activeModal, setActiveModal] = useState(undefined);

  const [permission, setPermission] = useState({ view: false, edit: false });
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
    let jobSlug = props.match.params.jobSlug;
    let currentJobId = jobSlug.split("-")[jobSlug.split("-").length - 1];
    setJobId(currentJobId);
  }, [props.match.params.jobSlug]);

  //if job is temp or no temp redirect to the right route
  useEffect(() => {
    if (jobData && store.company) {
      if (
        props.match.path === ROUTES.JobDashboard.path &&
        jobData.temp_plus.temp_job
      ) {
        setRedirect(
          ROUTES.TempJobDashboard.url(
            store.company.mention_tag,
            props.match.params.jobSlug,
            props.match.params.tab
          )
        );
      }
      if (
        props.match.path === ROUTES.TempJobDashboard.path &&
        !jobData.temp_plus.temp_job
      ) {
        console.log("uncomment this");
        // setRedirect(
        //   ROUTES.JobDashboard.url(
        //     store.company.mention_tag,
        //     props.match.params.jobSlug,
        //     props.match.params.tab
        //   )
        // );
      }
    }
  }, [jobData, props.match, store.company]);

  useEffect(() => {
    if (redirect) {
      setRedirect(undefined);
    }
  }, [redirect]);

  useEffect(() => {
    if (
      store.session &&
      store.company &&
      store.role &&
      store.role?.role_permissions?.is_member &&
      jobId
    ) {
      singleJobData(
        jobId,
        store.session,
        store.company.id,
        store.role.team_member.team_member_id,
        signal
      ).then((res) => {
        if (res !== "err" && !res.errors) {
          if (!res.not_allowed) {
            setJobData(res);
          } else {
            setNotAllowed(true);
          }
        } else if (res.errors) {
          !signal.aborted && notify("danger", res.errors);
          setErrorJob(true);
        }
      });
    }
    return () => controller.abort();
  }, [store.session, store.company, store.role, jobId]);

  const updateJobData = (jobId, session, companyId) => {
    singleJobData(
      jobId,
      session,
      companyId,
      store.role.team_member.team_member_id,
      signal
    ).then((job) => {
      if (job !== "err" && !job.not_allowed) {
        setJobData(job);
      }
    });
  };

  const publishJobCaller = async () => {
    if (
      !validateJobPostData(store, jobData, () => {
        setRedirect(
          ROUTES.JobEdit.url(store.company.mention_tag, jobData.title_slug)
        );
      })
    )
      return;
    // let body = bodyBuilder();
    let body = {
      job_post: {
        is_draft: false,
      },
    };
    // body.job_post.is_draft = false;
    //IF JOB IS SET TO CAREERS PORTAL AND CAREERS PORTAL HAS NOT BEEN ACTIVATED CALL ACTIVATION ENDPOINT
    if (!store.company.career_portal && jobData.job_post_type === "public") {
      await companyHelpers
        .toggleCareersPortal(store.company.id, store.session)
        .then((res) => {
          if (res.message === "Updated career portal property") {
            updateCompany(store, this.props.company.mention_tag);
          } else {
            notify("danger", "Unable to activate career portal");
          }
        });
    }
    //save preexisting job and publish
    fetchEditJob(
      store.session,
      jobData.job_owner_company_id,
      jobId,
      body
    ).then((res) => afterPublishCall({ ...res }));
  };

  const afterPublishCall = (response) => {
    if (!response.err) {
      notify("info", `Job succesfully published`);
      setJobData({ ...jobData, is_draft: false });
    } else {
      notify("danger", response);
    }
  };

  return (
    <InnerPage
      pageTitle={
        (store.company && store.company.name ? store.company.name : "") +
        " - Job Dashboard"
      }
      originName={jobData?.title}
    >
      {redirect && redirect !== props.location.pathname && (
        <Redirect to={redirect} />
      )}
      {jobData &&
        props.match.path === ROUTES.JobDashboard.path &&
        jobData?.temp_plus?.temp_job !== true && (
          <Suspense fallback={<div />}>
            <RegularJobDashboard
              store={store}
              {...props}
              errorJob={errorJob}
              jobId={jobId}
              jobData={jobData}
              setJobData={setJobData}
              permission={permission}
              updateJobData={updateJobData}
              publishJobCaller={publishJobCaller}
              activeModal={activeModal}
              setActiveModal={setActiveModal}
            />
          </Suspense>
        )}
      {jobData &&
        props.match.path === ROUTES.TempJobDashboard.path &&
        jobData?.temp_plus?.temp_job === true && (
          <Suspense fallback={<div />}>
            <TempJobDashboard
              store={store}
              {...props}
              errorJob={errorJob}
              jobId={jobId}
              jobData={jobData}
              setJobData={setJobData}
              permission={permission}
              updateJobData={updateJobData}
              publishJobCaller={publishJobCaller}
              activeModal={activeModal}
              setActiveModal={setActiveModal}
            />
          </Suspense>
        )}
      {notAllowed && (
        <div
          className={emptyStyles.emptyContainer}
          style={{
            minHeight: "calc(100vh - 200px)",
          }}
        >
          <EmptyTab
            data={true}
            title={"Permission needed!"}
            copy={
              "Oops! Unfortunately, you do not have permission to access this job. Just give the job owner a quick nudge to add you to it."
            }
            image={<EmptyActivity />}
            action={() => {
              setRedirect(ROUTES.ViewJobs.url(store.company.mention_tag));
            }}
            actionText={"View Jobs"}
          />
        </div>
      )}
    </InnerPage>
  );
};

const validateJobPostData = (store, job, redirectToJob) => {
  let isValid = true;
  if (!job.title) {
    isValid = false;
  }

  if (job.salary_status === "display") {
    if (
      (job.max_rate === "" || job.max_rate === "0") &&
      (job.min_rate === "" || job.min_rate === "0")
    ) {
      isValid = false;
    }
  }
  //
  //
  if (store.job_extra_fields?.advertised_required && !job.advertised) {
    isValid = false;
  }
  if (
    store.job_extra_fields?.budgeted_required &&
    (job.budgeted === undefined || job.budgeted === null)
  ) {
    isValid = false;
  }
  if (
    store.job_extra_fields?.business_area_required &&
    job.areas.length === 0
  ) {
    isValid = false;
  }
  if (store.job_extra_fields?.department_required && job.sectors.length === 0) {
    isValid = false;
  }
  if (store.job_extra_fields?.hire_type_required && !job.hire_type) {
    isValid = false;
  }
  if (store.job_extra_fields?.po_reference_required && !job.po_reference) {
    isValid = false;
  }
  if (store.job_extra_fields?.working_hours_required && !job.working_hours) {
    isValid = false;
  }
  if (!isValid) {
    notify("danger", "Some fields are required");
    redirectToJob();
  }
  return isValid;
};

export default JobDetailContainer;
