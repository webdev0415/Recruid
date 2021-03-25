import React, { useState, useEffect } from "react";
import { ROUTES } from "routes";
import { Redirect } from "react-router-dom";
import UniversalModal, {
  ModalBody,
  MinimalHeader,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";
import Spinner from "sharedComponents/Spinner";
import styled from "styled-components";
import Checkbox from "sharedComponents/Checkbox";
import AppButton from "styles/AppButton";
import FilterV2 from "sharedComponents/filterV2";
import sharedStyles from "assets/stylesheets/scss/collated/filter.module.scss";
import styles from "components/ViewJobs/JobDashboard/AddCandidates/style/addCandidates.module.scss";
import CandidateTable from "components/ViewJobs/JobDashboard/AddCandidates/CandidateTable";
import { fetchNetwork } from "helpersV2/candidates";
import notify from "notifications";
import {
  singleJobData,
  fetchJobApplicantIds,
} from "components/ViewJobs/JobDashboard/helpers.js";
import { fetchCreateJob, fetchEditJob } from "helpersV2/jobs";
import sharedHelpers from "helpers/sharedHelpers";
import {
  generateSkillCompetencies,
  generateIndustryCategories,
  generateLocalizations,
  generateDepartmentCategories,
  generateBusinessAreaCategories,
} from "sharedComponents/TagsComponent/methods/tags";
import {
  flattenLocations,
  flattenSkills,
  flattenIndustries,
  flattenDepartment,
  flattenBusinessArea,
} from "sharedComponents/TagsComponent/methods/tags";
import {
  createCareersApplicationForm,
  getCareersApplicationForm,
} from "helpersV2/jobs/application";
import SimpleDelayedInput from "sharedComponents/SimpleDelayedInput";
import { AWS_CDN_URL } from "constants/api";
// const SLICE_LENGTH = 20;

const DuplicateJobModal = ({ jobId, hide, store, refreshJobs }) => {
  const [loading, setLoading] = useState(false);
  const [copyOptions, setCopyOptions] = useState({
    candidates: false,
    candidate_ids: [],
  });
  const [modalView, setModalView] = useState("initial");
  const [filters, setFilters] = useState({});
  const [selectedProfessionals, setSelectedProfessionals] = useState([]);
  const [search, setSearch] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [hasMore, setHasMore] = useState(false);
  const controller = new AbortController();
  const signal = controller.signal;
  const [job, setJob] = useState(undefined);
  const [newJob, setNewJob] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);
  const [application, setApplication] = useState(undefined);
  const [candidateIds, setCandidateIds] = useState(undefined);

  useEffect(() => {
    if (store.session && store.company && jobId && store.role) {
      //fetch job
      singleJobData(
        jobId,
        store.session,
        store.company.id,
        store.role.team_member.team_member_id
      ).then((res) => {
        if (res !== "err" && !res.errors && !res.not_allowed) {
          setJob(res);
        } else if (res.errors) {
          notify("danger", res.errors);
        }
      });
      fetchJobApplicantIds(store.session, store.company.id, jobId).then(
        (res) => {
          if (!res.err) {
            setCandidateIds(res);
            // setCopyOptions((copy) => {
            //   return { ...copy, candidate_ids: res };
            // });
          } else {
            setCandidateIds(false);
            notify("danger", "unable to fetch candidates");
          }
        }
      );
    }
  }, [jobId, store.session, store.company, store.role]);

  const changeFilters = (newFilters) => {
    if (
      Object.values(filters).length === 0 &&
      Object.values(newFilters).length === 0
    ) {
      return;
    }
    setFilters(newFilters);
  };
  //FETCH COMPANY CANDIDATES
  useEffect(() => {
    if (
      store.company &&
      store.role &&
      candidateIds &&
      candidateIds.length > 0
    ) {
      fetchNetwork(
        store.session,
        store.company.id,
        {
          ...filters,
          slice: [0, candidateIds.length],
          operator: "and",
          id: candidateIds,
          search: search?.length > 0 ? [search] : undefined,
          team_member_id: store.role.team_member.team_member_id,
        },
        signal
      ).then((talentNetwork) => {
        if (!talentNetwork.err) {
          setSelectedProfessionals(
            talentNetwork.results.map((cand) => {
              return { ...cand, selected: true };
            })
          );
          setNetwork(
            talentNetwork.results.map((cand) => {
              return { ...cand, selected: true };
            })
          );
          setCopyOptions((copy) => {
            return {
              ...copy,
              candidate_ids: talentNetwork.results.map(
                (cand) => cand.professional_id
              ),
            };
          });
          if (talentNetwork.results.length !== talentNetwork.total) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
        } else if (!signal.aborted) {
          notify("danger", talentNetwork);
        }
      });
    }
    return () => controller.abort();
  }, [store.company, store.role, store.session, filters, candidateIds, search]);

  const addRemoveSelectedProfessional = (bool, index) => {
    let professionals = [...network];
    professionals[index] = {
      ...professionals[index],
      selected: bool,
    };
    setNetwork(professionals);
    setSelectedProfessionals(professionals.filter((cand) => cand.selected));
  };

  const selectAll = (action) => {
    let professionals = [...network];
    professionals = professionals.map((pro) => {
      return { ...pro, selected: action === "add" ? true : false };
    });
    setNetwork(professionals);
    if (action === "add") {
      setSelectedProfessionals(professionals);
    } else {
      setSelectedProfessionals([]);
    }
  };
  const bodyBuilder = () => {
    return {
      job_post: {
        assigned_team_member_ids: job.assigned_team_member_ids,
        available_positions: job.available_positions,
        charge_rate: job.charge_rate,
        contract_end_date: job.contract_end_date,
        contract_start_date: job.contract_start_date,
        fee_percentage: job.fee_percentage,
        is_active: job.is_active,
        is_draft: true, //job.is_draft,
        is_sponsor: job.is_sponsor,
        job_post_type: job.job_post_type,
        job_status: "open",
        job_type: job.job_type,
        type: job.jobpost_for,
        max_rate: job.max_rate,
        min_rate: job.min_rate,
        salary_interval: job.salary_interval || "yearly",
        on_hold: job.on_hold,
        pay_interval: job.pay_interval,
        pay_rate: job.pay_rate,
        post_to_google: job.post_to_google,
        remote: job.remote,
        salary_status: job.salary_status,
        sizzle_score: job.sizzle_score,
        title: job.title,
        weekly_margin: job.weekly_margin,
        selected_vendor: job.company.id,
        temp_job: job.temp_plus.temp_job,
        experience_level: job.experience,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
        post_to_leo: job.post_to_leo,
        fixed_charge_rate: job.fixed_charge_rate,
        company_id: job.company.id,
        budgeted: job.budgeted,
        hire_type: job.hire_type,
        advertised: job.advertised,
        working_hours: job.working_hours,
        po_reference: job.po_reference,
        salary_bonus: job.salary_bonus,
        competencies_attributes: generateSkillCompetencies(
          flattenSkills(job.competencies),
          [],
          store.company.id
        ),
        localizations_attributes: generateLocalizations(
          flattenLocations(job.localizations),
          [],
          store.company.id
        ),
        categorizations_attributes: generateIndustryCategories(
          flattenIndustries(job.categorizations),
          [],
          store.company.id
        ),
        areas_attributes: generateBusinessAreaCategories(
          flattenBusinessArea(job.areas),
          [],
          store.company.id
        ),
        sectors_attributes: generateDepartmentCategories(
          flattenDepartment(job.sectors),
          [],
          store.company.id
        ),
      },
      job_owner: job.company.id,
      agency_ids:
        job.company.id !== store.company.id ? store.company.id : undefined,
    };
  };

  const createJobDuplicate = () => {
    let body = bodyBuilder();
    setLoading(true);
    fetchCreateJob(store.session, store.company.id, body).then((res) =>
      afterPublishCall({ ...res }, "create")
    );
  };

  const afterPublishCall = (response) => {
    if (!response.err) {
      if (application) {
        createCareersApplicationForm(store.session, {
          ...application,
          id: undefined,
        });
      }
      if (copyOptions.candidates && copyOptions.candidate_ids?.length > 0) {
        addSelectedProfessionalsToJob(response);
      } else {
        setLoading(false);
        setNewJob(response);
        notify("info", `Job succesfully duplicated`);
        if (refreshJobs) {
          refreshJobs();
        }
      }
    } else {
      setLoading(false);
      notify("danger", response);
    }
  };

  const addSelectedProfessionalsToJob = (responseJob) => {
    const postBody = {
      company_id: responseJob.company.id,
      job_id: responseJob.id,
      candidate_ids: copyOptions.candidate_ids,
      recruiter_id: store.role.team_member.team_member_id,
    };

    if (responseJob.company.id !== store.company.id) {
      postBody.agency_id = store.company.id;
    }

    sharedHelpers
      .inviteProfessionalsToJob(postBody, store.session)
      .then((response) => {
        if (response) {
          notify("info", `Job succesfully duplicated`);
        } else {
          notify(
            "danger",
            `Job succesfully duplicated but were unable to add the candidates`
          );
        }
        if (refreshJobs) {
          refreshJobs();
        }
        setLoading(false);
        setNewJob(responseJob);
      });
  };

  const publishJobCaller = async () => {
    let body = {
      job_post: {
        is_draft: false,
      },
    };
    //save preexisting job and publish
    fetchEditJob(store.session, newJob.company.id, newJob.id, body).then(
      (res) => {
        if (!res.err) {
          notify("info", "Job succesfully published");
          setRedirect(
            ROUTES.JobDashboard.url(
              store.company.mention_tag,
              newJob.title_slug
            )
          );
        } else {
          notify("danger", "Unable to publish job at the moment");
        }
      }
    );
  };

  useEffect(() => {
    if (jobId && store.session) {
      getCareersApplicationForm(store.session, jobId).then((res) => {
        if (!res.err) {
          setApplication({ ...res });
        }
      });
    }
  }, [store.session, jobId]);

  return (
    <>
      {redirect && <Redirect to={redirect} />}
      {modalView === "initial" && (
        <UniversalModal
          show={true}
          hide={hide}
          id="duplicate-job-modal"
          width={330}
        >
          <MinimalHeader
            title={`Duplicate ${job?.title || "job"}`}
            hide={hide}
          />
          <STModalBody className="no-footer">
            {!newJob ? (
              <>
                {candidateIds && candidateIds.length > 0 ? (
                  <>
                    <InfoText>
                      Would you also like to move the candidates on this job?
                    </InfoText>
                    <SelectRow>
                      <Checkbox
                        active={copyOptions.candidates}
                        onClick={() =>
                          setCopyOptions({
                            ...copyOptions,
                            candidates: !copyOptions.candidates,
                          })
                        }
                      />
                      <RowInfo>Candidates</RowInfo>
                      <button onClick={() => setModalView("candidates")}>
                        <img
                          src={`${AWS_CDN_URL}/icons/EditPen.svg`}
                          alt="Edit"
                        />
                      </button>
                    </SelectRow>
                  </>
                ) : candidateIds === false || candidateIds?.length === 0 ? (
                  <>
                    <InfoText>
                      A copy of this job will be created. You will be able to
                      edit it before publish it.
                    </InfoText>
                  </>
                ) : (
                  <Spinner />
                )}
              </>
            ) : (
              <ConfirmContainer>
                A copy of this job has been succesfully created as a{" "}
                <strong>Draft</strong> You can continue to work on it or edit
                and publish it.
              </ConfirmContainer>
            )}

            <CustomFooter>
              {newJob ? (
                <>
                  <AppButton
                    size="small"
                    disabled={job === undefined}
                    theme="white"
                    onClick={() =>
                      setRedirect(
                        ROUTES.JobDashboard.url(
                          store.company.mention_tag,
                          newJob.title_slug
                        )
                      )
                    }
                    style={{ marginRight: "10px" }}
                  >
                    Manage Job
                  </AppButton>
                  <AppButton
                    size="small"
                    disabled={job === undefined}
                    theme="white"
                    onClick={() =>
                      setRedirect(
                        ROUTES.JobEdit.url(
                          store.company.mention_tag,
                          newJob.title_slug
                        )
                      )
                    }
                    style={{ marginRight: "10px" }}
                  >
                    Edit Job
                  </AppButton>
                  <AppButton
                    size="small"
                    disabled={job === undefined}
                    theme="dark-blue"
                    onClick={() => publishJobCaller()}
                  >
                    Publish
                  </AppButton>
                </>
              ) : (
                <AppButton
                  size="small"
                  disabled={job === undefined}
                  theme={job ? "dark-blue" : "light-grey"}
                  onClick={() => createJobDuplicate()}
                >
                  Copy
                </AppButton>
              )}
            </CustomFooter>
          </STModalBody>
          {loading && (
            <LoadContainer>
              <Spinner />
            </LoadContainer>
          )}
        </UniversalModal>
      )}
      {modalView === "candidates" && (
        <UniversalModal
          show={true}
          hide={hide}
          id={"add-candidates-job"}
          width={960}
        >
          <ModalHeaderClassic title="Add Candidates" closeModal={hide} />
          <ModalBody className="no-footer">
            <div
              className={sharedStyles.container}
              style={{
                borderBottom: "1px solid #eee",
                borderRadius: "0",
                boxShadow: "none",
                background: "#eee",
              }}
            >
              <div
                className="leo-flex"
                style={{
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <FilterV2
                  source="candidate"
                  returnFilters={(newFilters) => changeFilters(newFilters)}
                  cleanSlate={true}
                />
                <div className={styles.inputContainer}>
                  <div>
                    <SimpleDelayedInput
                      className={styles.searchNetwork}
                      placeholder="Search..."
                      value={search}
                      onChange={(val) => setSearch(val)}
                      style={{
                        boxShadow: "0 1px 2px 0 rgba(0,0,0,0.1)",
                        background: "white",
                        marginLeft: "10px",
                      }}
                    />

                    <li className="fas fa-search search" />
                  </div>
                </div>
              </div>
            </div>
            <CandidateTable
              talentNetwork={network}
              selectAll={selectAll}
              style={{ height: "300px", minHeight: "0px" }}
              morePages={false}
              addRemoveSelectedProfessional={addRemoveSelectedProfessional}
              parentSelectedAll={true}
            />
            <div className={styles.modalFooter}>
              <button
                type="button"
                className="button button--default button--grey-light"
                onClick={() => {
                  setModalView("initial");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button button--default button--blue-dark"
                onClick={() => {
                  if (selectedProfessionals.length < 1) {
                    notify(
                      "danger",
                      "Please select at least one professional to add to job"
                    );
                  } else {
                    setCopyOptions({
                      ...copyOptions,
                      candidate_ids: selectedProfessionals.map(
                        (prof) => prof.professional_id
                      ),
                    });
                    setModalView("initial");
                  }
                }}
              >
                Add{" "}
                {selectedProfessionals.length > 0
                  ? `(${selectedProfessionals.length})`
                  : null}
              </button>
            </div>
          </ModalBody>
        </UniversalModal>
      )}
    </>
  );
};

export default DuplicateJobModal;

const LoadContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background: #eeeeee61;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const STModalBody = styled(ModalBody)`
  padding: 20px !important;
`;

const InfoText = styled.span`
  font-size: 14px;
  margin-bottom: 15px;
  color: #74767b;
  display: block;
`;

const SelectRow = styled.div`
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  grid-gap: 5px;
`;

const RowInfo = styled.div`
  font-size: 14px;
  color: #2a3744;
`;

const CustomFooter = styled.div`
  margin-top: 10px;
  border-top: solid #eeeeee 1px;
  padding-top: 14px;
  display: flex;
  justify-content: flex-end;
`;

const ConfirmContainer = styled.div`
  text-align: center;
  padding: 15px;
  font-size: 15px;

  strong {
    background: #00cba7;
    border-radius: 15px;
    color: white;
    display: inline;
    font-size: 12px;
    font-weight: 500;
    padding: 3px 10px;
  }
`;
