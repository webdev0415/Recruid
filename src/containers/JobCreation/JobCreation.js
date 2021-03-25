import React, { useContext, useState, useEffect, Suspense } from "react";
import { Redirect } from "react-router-dom";
import GlobalContext from "contexts/globalContext/GlobalContext";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import { InnerPageContainer } from "styles/PageContainers";
import { ROUTES } from "routes";
import notify from "notifications";
import JobCreationHeader from "components/JobCreation/JobCreationHeader";
import JobSaveBar from "components/JobCreation/JobSaveBar";
import { updateCompany } from "contexts/globalContext/GlobalMethods";
import companyHelpers from "helpers/company/company.helpers";
import { fetchCreateJob, fetchEditJob } from "helpersV2/jobs";
import queryString from "query-string";
import HistoryContext from "contexts/historyContext/HistoryContext";
import {
  deleteJob,
  // publishDraft,
} from "components/ViewJobs/helpers/viewJobsHelpers";
import { singleJobData } from "components/ViewJobs/JobDashboard/helpers.js";
import {
  flattenSkills,
  flattenIndustries,
  flattenLocations,
  flattenDepartment,
  flattenBusinessArea,
} from "sharedComponents/TagsComponent/methods/tags";

import {
  updateCareersApplicationForm,
  createCareersApplicationForm,
  getCareersApplicationForm,
} from "helpersV2/jobs/application";
import { fetchFullCompanyData } from "helpersV2/company";
import SelectReviewersModal from "modals/SelectReviewersModal";
import retryLazy from "hooks/retryLazy";
import DeclineJobModal from "modals/DeclineJobModal";
import {
  fetchRejectTierRequest,
  fetchApproveTierRequest,
  fetchDeleteApproval,
} from "helpersV2/jobs/approval";
import spacetime from "spacetime";
const JobDetails = React.lazy(() =>
  retryLazy(() => import("components/JobCreation/JobDetails"))
);
const ApplicationForm = React.lazy(() =>
  retryLazy(() => import("components/JobCreation/ApplicationForm"))
);
const PostJobBoards = React.lazy(() =>
  retryLazy(() => import("components/JobCreation/PostJobBoards"))
);
const TeamTab = React.lazy(() =>
  retryLazy(() => import("components/JobCreation/TeamTab"))
);
const JobPreviewModal = React.lazy(() =>
  retryLazy(() => import("components/JobCreation/JobPreviewModal"))
);
const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);

// let saveInterval = null;

const JobCreation = (props) => {
  const store = useContext(GlobalContext);
  const [companyData, setCompanyData] = useState(undefined);
  const historyStore = useContext(HistoryContext);
  const [activeTab, setActiveTab] = useState("details");
  const [redirect, setRedirect] = useState(undefined);
  const [queryParams, setQueryParams] = useState({});
  const [missingFields, setMissingFields] = useState({});
  const [editingJob, setEditingJob] = useState(undefined);
  const [allTabsViewed, setAllTabsViewed] = useState(false);
  const [jobId, setJobId] = useState(undefined);
  const [activeModal, setActiveModal] = useState(undefined);
  const [originalSkills, setOriginalSkills] = useState(undefined);
  const [originalIndustries, setOriginalIndustries] = useState(undefined);
  const [originalLocations, setOriginalLocations] = useState(undefined);
  const [originalBusinessArea, setOriginalBusinessArea] = useState(undefined);
  const [originalDepartment, setOriginalDepartment] = useState(undefined);
  const [locationTags, setLocationTags] = useState([]);
  const [industryTags, setIndustryTags] = useState([]);
  const [skillTags, setSkillTags] = useState([]);
  const [businessAreaTags, setBusinessAreaTags] = useState([]);
  const [departmentTags, setDepartmentTags] = useState([]);
  const [benefitsEditor, setBenefitsEditor] = useState(undefined);
  const [requirementsEditor, setRequirementsEditor] = useState(undefined);
  const [descriptionEditor, setDescriptionEditor] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const [
    triggerSave,
    // setTriggerSave
  ] = useState(undefined);
  const [jobSlugSt, setJobSlug] = useState(undefined);
  const [selectedTierName, setSelectedTierName] = useState(undefined);
  const [assigned_team_member_ids, setAssignedTeamMemberIds] = useState([]);
  const [hasTags, setHasTags] = useState({
    business_area: false,
    department: false,
  });
  const [updated, setUpdated] = useState(false);
  const [job, setJob] = useState({
    title: "",
    salary_status: "hidden",
    selected_vendor: undefined,
    localizations_attributes: [],
    categorizations_attributes: [],
    competencies_attributes: [],
    type: "internal",
    job_post_type: "private",
    post_to_google: false,
    //need changes
    job_type: "permanent",
    temp_job: false,
    experience_level: "",
    description: "",
    requirements: "",
    benefits: "",
    post_to_leo: false,
    remote: false,
    is_draft: true,
    //not on design
    available_positions: 1,

    // fee_percentage:	0,
    max_rate: "",
    min_rate: "",
    salary_interval: "yearly",
    // status	"",
    // trigger_update_stages:	false,
    // website_link:	""
    contract_start_date: undefined,
    salary_bonus: undefined,
  });
  const [application, setApplication] = useState({
    input_fields: {
      name: "required",
      email: "required",
      phone: "optional",
      resume: "required",
      cover_letter: "optional",
      // questions: [],
    },
  });
  const [visitedTabs, setVisitedTabs] = useState({
    details: true,
    application: false,
    boards: false,
  });
  const [applicationQuestions, setApplicationQuestions] = useState(undefined);

  useEffect(() => {
    if (store.company && store.session) {
      fetchFullCompanyData(store.session, store.company.mention_tag).then(
        (res) => {
          if (!res.err) {
            setCompanyData(res);
          } else {
            notify("danger", res);
          }
        }
      );
    }
  }, [store.company, store.session]);

  useEffect(() => {
    setQueryParams(queryString.parse(props.location?.search));
  }, [props.location]);

  useEffect(() => {
    if (queryParams.client_id) {
      setJob({ ...job, selected_vendor: queryParams.client_id });
    }
    if (queryParams.temp_job) {
      setJob({ ...job, temp_job: true, job_type: "temp" });
    }
  }, [queryParams]);

  useEffect(() => {
    if (activeTab && !visitedTabs[activeTab]) {
      setVisitedTabs({ ...visitedTabs, [activeTab]: true });
    }
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    if (visitedTabs.details && visitedTabs.application && visitedTabs.boards) {
      setAllTabsViewed(true);
    }
  }, [visitedTabs]);

  useEffect(() => {
    if (
      props.match.path === ROUTES.JobEdit.path &&
      store.session &&
      store.company &&
      store.role
    ) {
      if (props.match.params.job_slug) {
        let jobSlug = props.match.params.job_slug;
        let currentJobId = jobSlug.split("-")[jobSlug.split("-").length - 1];
        //fetch job
        if (!jobSlugSt) {
          setJobSlug(props.match.params.job_slug);
        }
        singleJobData(
          currentJobId,
          store.session,
          store.company.id,
          store.role.team_member.team_member_id
        ).then((res) => {
          if (res !== "err" && !res.errors && !res.not_allowed) {
            setJobId(currentJobId);
            setEditingJob({ ...res });
          } else if (res.not_allowed) {
            setRedirect(ROUTES.JobCreation.url(store.company.mention_tag));
          } else if (res.errors) {
            notify("danger", res.errors);
          }
        });
      }
    }
  }, [
    props.match.params.job_slug,
    props.match.path,
    store.session,
    store.company,
    store.role,
  ]);
  useEffect(() => {
    if (editingJob) {
      setOriginalSkills(flattenSkills(editingJob.competencies));
      setOriginalIndustries(flattenIndustries(editingJob.categorizations));
      setOriginalLocations(flattenLocations(editingJob.localizations));
      setOriginalDepartment(flattenDepartment(editingJob.sectors || []));
      setOriginalBusinessArea(flattenBusinessArea(editingJob.areas || []));
      setAssignedTeamMemberIds(editingJob.assigned_team_member_ids || []);
      setJob((jobobj) => {
        return {
          ...jobobj,
          title: editingJob.title,
          salary_status: editingJob.salary_status,
          selected_vendor: editingJob.company.id,
          type: editingJob.jobpost_for,
          job_post_type: editingJob.job_post_type,
          post_to_google: editingJob.post_to_google,
          job_type: editingJob.job_type,
          temp_job: editingJob.temp_plus.temp_job,
          experience_level: editingJob.experience,
          description: editingJob.description,
          requirements: editingJob.requirements,
          benefits: editingJob.benefits,
          post_to_leo: editingJob.post_to_leo,
          remote: editingJob.remote,
          is_draft: editingJob.is_draft,
          available_positions: editingJob.available_positions,
          max_rate: editingJob.max_rate,
          min_rate: editingJob.min_rate,
          salary_interval: editingJob.salary_interval || "yearly",
          charge_rate: editingJob.charge_rate,
          pay_rate: editingJob.pay_rate,
          pay_interval: editingJob.pay_interval,
          weekly_margin: editingJob.weekly_margin,
          fee_percentage: editingJob.fee_percentage,
          budgeted: editingJob.budgeted,
          hire_type: editingJob.hire_type,
          advertised: editingJob.advertised,
          working_hours: editingJob.working_hours,
          po_reference: editingJob.po_reference,
          work_pattern: editingJob.work_pattern,
          salary_bonus: editingJob.salary_bonus,
          contract_start_date: spacetime(editingJob.contract_start_date),
          contract_end_date: spacetime(editingJob.contract_end_date),
          job_status: undefined,
        };
      });
    }
  }, [editingJob]);

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
    }
  }, [redirect]);

  useEffect(() => {
    if (jobId && store.session) {
      getCareersApplicationForm(store.session, jobId).then((res) => {
        if (!res.err) {
          setApplication({ ...res });
        }
      });
    }
  }, [store.session, jobId]);

  // useEffect(() => {
  //   if (props.match.path !== ROUTES.JobEdit.path) {
  //     saveInterval = setInterval(function () {
  //       setTriggerSave(Math.random());
  //     }, 30000);
  //   }
  //   return () => clearInterval(saveInterval);
  //
  // }, [props.match]);

  useEffect(() => {
    if (triggerSave && job.title && !saving) {
      saveJobDraftCaller(true);
    }
  }, [triggerSave]);

  const publishJobCaller = async (isDraft) => {
    if (
      !validateJobPostData(store, job, setActiveTab, setMissingFields, hasTags)
    )
      return;
    setSaving(true);
    let body = bodyBuilder();
    body.job_post.is_draft = isDraft || false;
    //IF JOB IS SET TO CAREERS PORTAL AND CAREERS PORTAL HAS NOT BEEN ACTIVATED CALL ACTIVATION ENDPOINT
    if (!store.company.career_portal && job.job_post_type === "public") {
      await companyHelpers
        .toggleCareersPortal(store.company.id, store.session)
        .then((res) => {
          if (res.message === "Updated career portal property") {
            updateCompany(store, store.company.mention_tag);
          } else {
            notify("danger", "Unable to activate career portal");
          }
        });
    }
    //=================================================================
    if (!jobId) {
      //create job not previously saved
      fetchCreateJob(store.session, store.company.id, body).then((res) =>
        afterPublishCall({ ...res }, "create")
      );
    } else {
      console.log(body);
      //save preexisting job and publish
      fetchEditJob(store.session, body.job_owner, jobId, body).then((res) =>
        afterPublishCall({ ...res }, "edit")
      );
    }
  };

  const afterPublishCall = (response, type) => {
    if (!response.err) {
      notify(
        "info",
        `Job succesfully ${type === "create" ? "created" : "saved"}`
      );
      if (!jobSlugSt) {
        setJobSlug(response.title_slug);
      }
      saveCareersForm(
        response.id,
        ROUTES.JobDashboard.url(store.company.mention_tag, response.title_slug)
      );
      setUpdated(false);
    } else {
      notify("danger", response);
    }
  };

  const saveJobDraftCaller = (autoSave) => {
    let body = bodyBuilder();
    setSaving(true);
    if (!jobId) {
      //Initial save of a job
      fetchCreateJob(store.session, store.company.id, body)
        .then((res) => afterSaveCall({ ...res }, autoSave, "create"))
        .catch(() => {
          if (!autoSave) {
            notify("danger", "Unable to save a job");
          }
          setSaving(false);
        });
    } else {
      //Edit save of a job
      console.log(body);
      fetchEditJob(store.session, body.job_owner, jobId, body)
        .then((res) => afterSaveCall({ ...res }, autoSave, "edit"))
        .catch(() => {
          if (!autoSave) {
            notify("danger", "Unable to edit job");
          }
          setSaving(false);
        });
    }
  };

  const afterSaveCall = (response, autoSave, type) => {
    if (!response.err) {
      if (!autoSave) {
        notify(
          "info",
          `Job succesfully ${type === "create" ? "created" : "saved"}`
        );
      }
      if (!jobSlugSt) {
        setJobSlug(response.title_slug);
      }
      if (!editingJob && !autoSave) {
        if (activeTab === "details") {
          setActiveTab("application");
        }
        if (activeTab === "application") {
          setActiveTab("boards");
        }
      }
      setJobId(response.id);
      prepSavedJob({ ...response });
      saveCareersForm(response.id);
      setUpdated(false);
    } else {
      if (!autoSave) {
        notify("danger", response);
      }
      setSaving(false);
    }
  };
  const saveCareersForm = (responseJobId, url) => {
    let body = {
      ...application,
      job_post_id: jobId || responseJobId,
    };
    const thenFunction = (res) => {
      setSaving(false);
      if (!res.err) {
        setApplication(res);
        if (url) {
          setRedirect(url);
        }
      }
    };
    if (!application.id) {
      createCareersApplicationForm(store.session, body).then(thenFunction);
    } else {
      updateCareersApplicationForm(store.session, body).then(thenFunction);
    }
  };

  const triggerDelete = () => {
    deleteJob(store.company.id, jobId, store.session).then((response) => {
      if (response !== "err") {
        setActiveModal(undefined);
        setRedirect(
          historyStore.state.length > 1
            ? historyStore.state[1]?.pathname + historyStore.state[1]?.search
            : ROUTES.ViewJobs.url(store.company.mention_tag)
        );
      } else {
        notify("danger", "Unable to delete job");
      }
    });
  };

  const bodyBuilder = () => {
    return {
      job_post: {
        ...job,
        // fixed_charge_rate: undefined,
        company_id: job.selected_vendor || store.company.id,
        deal_id: queryParams.deal_id,
        contract_start_date: job.contract_start_date
          ? new Date(job.contract_start_date.epoch)
          : undefined,
        contract_end_date: job.contract_end_date
          ? new Date(job.contract_end_date.epoch)
          : undefined,
        application_questions: applicationQuestions,
      },
      job_owner: job.selected_vendor || store.company.id,
      agency_ids: job.selected_vendor ? store.company.id : undefined,
    };
  };

  const prepSavedJob = (res) => {
    setOriginalSkills(flattenSkills(res.competencies));
    setOriginalIndustries(flattenIndustries(res.categorizations));
    setOriginalLocations(flattenLocations(res.localizations));
    setOriginalDepartment(flattenDepartment(res.sectors || []));
    setOriginalBusinessArea(flattenBusinessArea(res.business_area || []));
    setLocationTags(flattenLocations(res.localizations));
    setIndustryTags(flattenIndustries(res.categorizations));
    setSkillTags(flattenSkills(res.competencies));
    setDepartmentTags(flattenDepartment(res.sectors || []));
    setBusinessAreaTags(flattenBusinessArea(res.areas || []));
    setJob({
      ...job,
      categorizations_attributes: [],
      localizations_attributes: [],
      competencies_attributes: [],
      areas_attributes: [],
      sectors_attributes: [],
    });
  };
  const callApproveJob = () => {
    fetchApproveTierRequest(
      store.session,
      store.company.id,
      editingJob.approval.id,
      selectedTierName,
      store.role.team_member.team_member_id
    ).then((res) => {
      if (!res.err) {
        notify("info", "You have sent your approval for this job");
        setRedirect(
          ROUTES.JobDashboard.url(store.company.mention_tag, jobSlugSt)
        );
      } else {
        notify("danger", res);
      }
    });
  };

  const callDeclineJob = (noteId) => {
    fetchRejectTierRequest(
      store.session,
      store.company.id,
      editingJob.approval.id,
      selectedTierName,
      store.role.team_member.team_member_id,
      noteId
    ).then((res) => {
      if (!res.err) {
        notify("info", "You have rejected this job review");
        setRedirect(
          ROUTES.JobDashboard.url(store.company.mention_tag, jobSlugSt)
        );
      } else {
        notify("danger", res);
      }
    });
  };

  const deleteApprovalAndSave = () => {
    fetchDeleteApproval(
      store.session,
      store.company.id,
      editingJob.approval.id
    ).then((res) => {
      if (!res.err) {
        setEditingJob({ ...editingJob, approval: undefined });
        if (activeModal === "revert-approval-save-publish") {
          publishJobCaller();
        } else if (activeModal === "revert-approval-save-continue") {
          saveJobDraftCaller();
        } else if (activeModal === "revert-approval-save-leave") {
          publishJobCaller(true);
        }
        setActiveModal(undefined);
      } else {
        notify("danger", "UNable to delete approval process");
      }
    });
  };

  return (
    <>
      {redirect && redirect !== props.location.pathname && !saving && (
        <Redirect to={redirect} />
      )}
      <InnerPage
        pageTitle={`${store.company ? store.company.name : ""} - Create Job`}
        originName="Create Job"
      >
        <InnerPageContainer background="white">
          <ATSWrapper activeTab="create job" routeObject={ROUTES.JobCreation}>
            <JobCreationHeader
              store={store}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              job={job}
              setActiveModal={setActiveModal}
              saving={saving}
              jobId={jobId}
            />
            {activeTab === "details" && (
              <Suspense fallback={<div />}>
                <JobDetails
                  store={store}
                  job={job}
                  setJob={setJob}
                  jobId={jobId}
                  queryParams={queryParams}
                  missingFields={missingFields}
                  originalSkills={originalSkills}
                  originalIndustries={originalIndustries}
                  originalLocations={originalLocations}
                  originalBusinessArea={originalBusinessArea}
                  originalDepartment={originalDepartment}
                  match={props.match}
                  editingJob={editingJob}
                  locationTags={locationTags}
                  industryTags={industryTags}
                  skillTags={skillTags}
                  businessAreaTags={businessAreaTags}
                  departmentTags={departmentTags}
                  setLocationTags={setLocationTags}
                  setIndustryTags={setIndustryTags}
                  setSkillTags={setSkillTags}
                  setBusinessAreaTags={setBusinessAreaTags}
                  setDepartmentTags={setDepartmentTags}
                  benefitsEditor={benefitsEditor}
                  setBenefitsEditor={setBenefitsEditor}
                  requirementsEditor={requirementsEditor}
                  setRequirementsEditor={setRequirementsEditor}
                  descriptionEditor={descriptionEditor}
                  setDescriptionEditor={setDescriptionEditor}
                  setHasTags={setHasTags}
                  setUpdated={setUpdated}
                />
              </Suspense>
            )}
            {activeTab === "application" && (
              <Suspense fallback={<div />}>
                <ApplicationForm
                  store={store}
                  application={application}
                  setApplication={setApplication}
                  job={job}
                  setJob={setJob}
                  originalLocations={originalLocations}
                  companyData={companyData}
                  setUpdated={setUpdated}
                  applicationQuestions={applicationQuestions}
                  setApplicationQuestions={setApplicationQuestions}
                />
              </Suspense>
            )}
            {activeTab === "boards" && (
              <Suspense fallback={<div />}>
                <PostJobBoards
                  store={store}
                  job={job}
                  setJob={setJob}
                  setUpdated={setUpdated}
                />
              </Suspense>
            )}
            {activeTab === "team" && jobId && (
              <Suspense fallback={<div />}>
                <TeamTab
                  store={store}
                  job={job}
                  jobId={jobId}
                  assigned_team_member_ids={assigned_team_member_ids}
                  setAssignedTeamMemberIds={setAssignedTeamMemberIds}
                  setUpdated={setUpdated}
                  editingJob={editingJob}
                />
              </Suspense>
            )}
            <JobSaveBar
              store={store}
              allTabsViewed={allTabsViewed}
              publishJobCaller={publishJobCaller}
              saveJobDraftCaller={saveJobDraftCaller}
              jobId={jobId}
              job={job}
              activeModal={activeModal}
              setActiveModal={setActiveModal}
              historyStore={historyStore}
              activeTab={activeTab}
              saving={saving}
              setRedirect={setRedirect}
              editingJob={editingJob}
              callApproveJob={callApproveJob}
              setSelectedTierName={setSelectedTierName}
              callDeclineJob={callDeclineJob}
              updated={updated}
            />
            {activeModal === "preview" && (
              <Suspense fallback={<div />}>
                <JobPreviewModal
                  application={application}
                  job={job}
                  store={store}
                  closeModal={() => setActiveModal(undefined)}
                  originalLocations={originalLocations}
                  companyData={companyData}
                  applicationQuestions={applicationQuestions}
                />
              </Suspense>
            )}
            {activeModal && activeModal.includes("revert-approval") && (
              <Suspense fallback={<div />}>
                <ConfirmModalV2
                  show={true}
                  hide={() => {
                    setActiveModal(undefined);
                  }}
                  header="Restart approval process"
                  text="If you make changes to the job you will have to restart your approval process. Would you like to continue?"
                  actionText="Confirm"
                  actionFunction={() => deleteApprovalAndSave()}
                />
              </Suspense>
            )}
            {activeModal === "delete" && (
              <Suspense fallback={<div />}>
                <ConfirmModalV2
                  show={true}
                  hide={() => {
                    setActiveModal(undefined);
                  }}
                  header="Delete Job"
                  text="Are you sure you want to delete this job?"
                  actionText="Delete"
                  actionFunction={() => triggerDelete()}
                />
              </Suspense>
            )}
            {(activeModal === "select-reviewers" ||
              activeModal === "re-select-reviewers") &&
              store.teamMembers && (
                <SelectReviewersModal
                  returnReviewers={() => console.log("arr")}
                  hide={() => setActiveModal(undefined)}
                  setRedirect={setRedirect}
                  jobId={jobId}
                  jobSlugSt={jobSlugSt}
                  saveJobDraftCaller={saveJobDraftCaller}
                  rerequest={activeModal === "re-select-reviewers"}
                  job={job}
                />
              )}
            {activeModal === "decline-reason" && (
              <DeclineJobModal
                hide={() => setActiveModal(undefined)}
                job={job}
                callDeclineJob={callDeclineJob}
                store={store}
                jobId={jobId}
              />
            )}
          </ATSWrapper>
        </InnerPageContainer>
      </InnerPage>
    </>
  );
};

export default JobCreation;

const validateJobPostData = (
  store,
  job,
  setActiveTab,
  setMissingFields,
  hasTags
) => {
  let isValid = true;
  let missFields = {
    title: false,
    salary: false,
  };
  if (!job.title) {
    // notify("danger", "Job must have a valid title");
    isValid = false;
    missFields.title = true;
  }

  if (job.salary_status === "display" && job.job_type !== "temp") {
    if (
      (job.max_rate === "" || job.max_rate === "0") &&
      (job.min_rate === "" || job.min_rate === "0")
    ) {
      isValid = false;
      missFields.rate = true;
    }
  }
  //
  //
  if (store.job_extra_fields?.advertised_required && !job.advertised) {
    isValid = false;
    missFields.advertised = true;
  }
  if (
    store.job_extra_fields?.budgeted_required &&
    (job.budgeted === undefined || job.budgeted === null)
  ) {
    isValid = false;
    missFields.budgeted = true;
  }
  if (
    store.job_extra_fields?.business_area_required &&
    !hasTags.business_area
  ) {
    isValid = false;
    missFields.areas_attributes = true;
  }
  if (store.job_extra_fields?.department_required && !hasTags.department) {
    isValid = false;
    missFields.sectors_attributes = true;
  }
  if (store.job_extra_fields?.hire_type_required && !job.hire_type) {
    isValid = false;
    missFields.hire_type = true;
  }
  if (store.job_extra_fields?.po_reference_required && !job.po_reference) {
    isValid = false;
    missFields.po_reference = true;
  }
  if (store.job_extra_fields?.work_pattern_required && !job.work_pattern) {
    isValid = false;
    missFields.work_pattern = true;
  }
  if (store.job_extra_fields?.working_hours_required && !job.working_hours) {
    isValid = false;
    missFields.working_hours = true;
  }
  if (!isValid) {
    setActiveTab("details");
    setMissingFields(missFields);
    notify("danger", "Some fields are required");
  }
  return isValid;
};
