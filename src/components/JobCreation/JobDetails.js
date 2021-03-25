import React, { useState, useEffect } from "react";
import {
  SectionTitle,
  DepContainer,
  SuggestionText,
  Label,
  SalaryInput,
  SalaryLabel,
} from "components/JobCreation/components";
import { ROUTES } from "routes";
import JobInput from "components/JobCreation/components/JobInput";
import JobDateSelect from "components/JobCreation/components/JobDateSelect";
import JobCheckbox from "components/JobCreation/components/JobCheckbox";
import ClientSelect from "components/JobCreation/components/ClientSelect";
import { ATSContainer } from "styles/PageContainers";
import styled from "styled-components";
import TagsComponent from "sharedComponents/TagsComponent";
import JobTextEditor from "components/JobCreation/components/JobTextEditor";
import RemoteToggle from "components/JobCreation/components/RemoteToggle";
import { AWS_CDN_URL } from "constants/api";
import { RateSelector } from "components/TempJobDashboard/TempJobDashboardDetails";
import RateCalculatorModal from "modals/RateCalculatorModal";
import ConfirmModalV2 from "modals/ConfirmModalV2";
import {
  JOB_TYPES,
  HIRE_TYPES,
  WORKING_HOURS,
  EXPERIENCE_LEVELS,
  SALARY_TYPES,
  ADVERTISED_OPTIONS,
} from "constants/job";

const JobDetails = ({
  store,
  job,
  setJob,
  queryParams,
  missingFields,
  originalSkills,
  originalIndustries,
  originalLocations,
  originalBusinessArea,
  originalDepartment,
  match,
  editingJob,
  locationTags,
  industryTags,
  skillTags,
  businessAreaTags,
  departmentTags,
  setLocationTags,
  setIndustryTags,
  setSkillTags,
  setBusinessAreaTags,
  setDepartmentTags,
  benefitsEditor,
  setBenefitsEditor,
  requirementsEditor,
  setRequirementsEditor,
  descriptionEditor,
  setDescriptionEditor,
  jobId,
  setHasTags,
  setUpdated,
}) => {
  const [clientToggle, setClientToggle] = useState("internal");
  const [activeModal, setActiveModal] = useState(undefined);
  const [selectedVendor, setSelectedVendor] = useState(undefined);
  const [hasInternalFields, setHasInternalFields] = useState(false);

  const dropToBottom = () => {
    setTimeout(function () {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  };

  useEffect(() => {
    if (editingJob && !editingJob.has_submitted_applicants) {
      if (
        editingJob.company.id !== selectedVendor &&
        editingJob.company.id !== store.company.id
      ) {
        setSelectedVendor(editingJob.company.id);
        setClientToggle("client");
      }
    }
  }, [editingJob]);

  useEffect(() => {
    if (store.job_extra_fields) {
      let has = false;
      if (store.job_extra_fields?.advertised_visible) {
        has = true;
      } else if (store.job_extra_fields?.budgeted_visible) {
        has = true;
      } else if (store.job_extra_fields?.business_area_visible) {
        has = true;
      } else if (store.job_extra_fields?.department_visible) {
        has = true;
      } else if (store.job_extra_fields?.hire_type_visible) {
        has = true;
      } else if (store.job_extra_fields?.po_reference_visible) {
        has = true;
      } else if (store.job_extra_fields?.working_hours_visible) {
        has = true;
      } else if (store.job_extra_fields?.work_pattern_visible) {
        has = true;
      }
      if (has) {
        setHasInternalFields(true);
      }
    }
  }, [store.job_extra_fields]);

  return (
    <ATSContainer>
      <GridContainer>
        <SectionTitle>Job Details</SectionTitle>
        {/*If Editing a job and agency*/}
        {store.company.type === "Agency" &&
          match.path === ROUTES.JobEdit.path &&
          editingJob &&
          !editingJob.has_submitted_applicants && (
            <>
              {/*Select Internal or client job*/}
              <DepContainer>
                <Label>Who are you posting a job for? </Label>
                <CheckBoxesGrid
                  style={{ marginBottom: "15px" }}
                  gridColumns={2}
                >
                  <JobCheckbox
                    checked={clientToggle === "internal"}
                    labelText="Internal"
                    onClick={() => {
                      setClientToggle("internal");
                      if (
                        !job.selected_vendor ||
                        job.selected_vendor === store.company.id
                      ) {
                        setUpdated(1);
                        setJob({ ...job, selected_vendor: undefined });
                      } else {
                        setActiveModal("confirm-owner");
                        setSelectedVendor(undefined);
                      }
                    }}
                  />
                  <JobCheckbox
                    checked={clientToggle === "client"}
                    labelText="Client"
                    onClick={() => setClientToggle("client")}
                    mark="add"
                  />
                </CheckBoxesGrid>
                {/*Select client companny if not an internal job*/}
                {clientToggle === "client" && (
                  <ClientSelect
                    value={job.selected_vendor}
                    setValue={(selected_vendor) => {
                      if (selected_vendor !== job.selected_vendor) {
                        setActiveModal("confirm-owner");
                        setSelectedVendor(selected_vendor);
                      } else {
                        setUpdated(2);
                        setJob({ ...job, selected_vendor });
                      }
                    }}
                    store={store}
                    validation={job.selected_vendor !== undefined}
                  />
                )}
              </DepContainer>
              <SuggestionText />
            </>
          )}
        {/*If Creating a job and agency*/}
        {store.company.type === "Agency" &&
          !queryParams.client_id &&
          match.path !== ROUTES.JobEdit.path && (
            <>
              {/*Select Internal or client job*/}
              <DepContainer>
                <Label>Who are you posting a job for? </Label>
                <CheckBoxesGrid
                  style={{ marginBottom: "15px" }}
                  gridColumns={2}
                >
                  <JobCheckbox
                    checked={clientToggle === "internal"}
                    labelText="Internal"
                    onClick={() => {
                      setClientToggle("internal");
                      setUpdated(3);
                      setJob({ ...job, selected_vendor: undefined });
                    }}
                  />
                  <JobCheckbox
                    checked={clientToggle === "client"}
                    labelText="Client"
                    onClick={() => setClientToggle("client")}
                    mark="add"
                  />
                </CheckBoxesGrid>
                {/*Select client companny if not an internal job*/}
                {clientToggle === "client" && (
                  <ClientSelect
                    value={job.selected_vendor}
                    setValue={(selected_vendor) => {
                      setUpdated(4);
                      setJob({ ...job, selected_vendor });
                    }}
                    store={store}
                    validation={job.selected_vendor !== undefined}
                  />
                )}
              </DepContainer>
              <SuggestionText />
            </>
          )}
        {/*Job title*/}
        <DepContainer>
          <Label>Job Title</Label>
          {missingFields.title && job.title === "" && (
            <ErrorDisplay text="Job must have a title" />
          )}
          <JobInput
            value={job.title}
            setValue={(title) => {
              setUpdated(5);
              setJob({ ...job, title });
            }}
            validation={job.title !== ""}
            placeholder="Job Title"
          />
        </DepContainer>
        <SuggestionText>
          <p>Use common job titles</p>
          <p>Advertise one job at a time, eg: ‘Designer’, not ‘designers’</p>
        </SuggestionText>
        {/*Job types selection*/}
        {!queryParams.temp_job && (
          <>
            <DepContainer>
              <Label className="large-margin">Job Type</Label>
              <CheckBoxesGrid gridColumns={2}>
                {Object.entries(JOB_TYPES).map((type, index) => (
                  <JobCheckbox
                    key={`job-type-${index}`}
                    checked={job.job_type === type[0]}
                    labelText={type[1]}
                    onClick={() => {
                      setUpdated(6);
                      setJob({
                        ...job,
                        job_type: type[0],
                        temp_job: type[0] === "temp",
                      });
                    }}
                  />
                ))}
              </CheckBoxesGrid>
            </DepContainer>
            <SuggestionText />
          </>
        )}
        <DepContainer>
          <Label>Location</Label>
          <TagsContainer>
            <TagsComponent
              type="locations"
              originalTags={originalLocations}
              returnTags={(localizations_attributes) => {
                setUpdated(7);
                setJob({
                  ...job,
                  localizations_attributes,
                });
              }}
              parentTags={locationTags}
              setParentTags={setLocationTags}
            />
          </TagsContainer>
          <Label>Remote</Label>
          <RemoteToggle
            checked={job.remote}
            onToggle={(remote) => {
              setUpdated(8);
              setJob({ ...job, remote });
            }}
          />
        </DepContainer>
        <SuggestionText>
          Select remote for jobs that can be done anywhere.
        </SuggestionText>
        <DepContainer>
          <Label className="large-margin">Experience</Label>
          <CheckBoxesGrid>
            {Object.entries(EXPERIENCE_LEVELS).map((entry, index) => (
              <JobCheckbox
                key={`experience-entry-${index}`}
                checked={job.experience_level === entry[0]}
                labelText={entry[1]}
                onClick={() => {
                  setUpdated(9);
                  setJob({ ...job, experience_level: entry[0] });
                }}
              />
            ))}
          </CheckBoxesGrid>
        </DepContainer>
        <SuggestionText />
        <DepContainer>
          <VacancyFlex className="leo-flex-center">
            <SalaryCont>
              <Label>Vacancies</Label>
              <VacanciesInput
                value={job.available_positions}
                onChange={(e) => {
                  setUpdated(10);
                  setJob({ ...job, available_positions: e.target.value });
                }}
                type="number"
              />
            </SalaryCont>
            {(job.temp_job || job.job_type === "fixed_term") && (
              <>
                <SalaryCont>
                  <Label>Job start date</Label>
                  <JobDateSelect
                    placeholder="Start"
                    value={job.contract_start_date}
                    setValue={(contract_start_date) => {
                      setUpdated(11);
                      setJob({ ...job, contract_start_date });
                    }}
                  />
                </SalaryCont>
                <SalaryCont>
                  <Label>Job end date</Label>
                  <JobDateSelect
                    placeholder="End"
                    value={job.contract_end_date}
                    setValue={(contract_end_date) => {
                      setUpdated(12);
                      setJob({ ...job, contract_end_date });
                    }}
                  />
                </SalaryCont>
              </>
            )}
          </VacancyFlex>
        </DepContainer>
        <SuggestionText>
          <p></p>
        </SuggestionText>
        <Separator />
        <SectionTitle>Industries & Skills</SectionTitle>
        <DepContainer>
          <Label>Job Industries</Label>
          <TagsContainer>
            <TagsComponent
              type="industries"
              originalTags={originalIndustries}
              returnTags={(categorizations_attributes) => {
                setUpdated(13);
                setJob({
                  ...job,
                  categorizations_attributes,
                });
              }}
              parentTags={industryTags}
              setParentTags={setIndustryTags}
            />
          </TagsContainer>
        </DepContainer>
        <SuggestionText>
          <p>
            Include the industry and skills to boost the job’s visibility on
            some job boards
          </p>
        </SuggestionText>
        <DepContainer style={{ marginBottom: 0 }}>
          <Label>Job Skills</Label>
          <TagsContainer>
            <TagsComponent
              type="skills"
              originalTags={originalSkills}
              returnTags={(competencies_attributes) => {
                setUpdated(14);
                setJob({ ...job, competencies_attributes });
              }}
              parentTags={skillTags}
              setParentTags={setSkillTags}
            />
          </TagsContainer>
        </DepContainer>
        <SuggestionText />
        <Separator />
        <SectionTitle>Job Description</SectionTitle>
        <DepContainer style={{ marginBottom: 0 }}>
          <EditorsContainer>
            <JobTextEditor
              returnState={(description) => {
                if (
                  description !== job.description &&
                  !(
                    (!job.description || job.description === "") &&
                    description === TEXT_INITIAL
                  )
                ) {
                  setUpdated(15);
                }
                setJob({ ...job, description });
              }}
              headerText="Description"
              placeholder="Enter the job desciption here; include key areas of responsability."
              initialBody={editingJob?.description}
              updateFromParent={editingJob !== undefined}
              parentEditor={descriptionEditor}
              setParentEditor={setDescriptionEditor}
              useParentState={true}
            />
            <JobTextEditor
              returnState={(requirements) => {
                if (
                  requirements !== job.requirements &&
                  !(
                    (!job.requirements || job.requirements === "") &&
                    requirements === TEXT_INITIAL
                  )
                ) {
                  setUpdated(16);
                }

                setJob({ ...job, requirements });
              }}
              headerText="Requirements"
              placeholder="Enter the job requirements here; from soft skills to the specific qualifications needed for this role."
              initialBody={editingJob?.requirements}
              updateFromParent={editingJob !== undefined}
              parentEditor={requirementsEditor}
              setParentEditor={setRequirementsEditor}
              useParentState={true}
            />
            <JobTextEditor
              returnState={(benefits) => {
                if (
                  benefits !== job.benefits &&
                  !(
                    (!job.benefits || job.benefits === "") &&
                    benefits === TEXT_INITIAL
                  )
                ) {
                  setUpdated(17);
                }
                setJob({ ...job, benefits });
              }}
              headerText="Benefits"
              placeholder="Enter the benefits here; include the perks that ake your company unique"
              initialBody={editingJob?.benefits}
              updateFromParent={editingJob !== undefined}
              parentEditor={benefitsEditor}
              setParentEditor={setBenefitsEditor}
              useParentState={true}
            />
          </EditorsContainer>
        </DepContainer>
        <SuggestionText>
          <p>
            Use formatting like bold headings and lists to make text easier to
            read.
          </p>
          <p>Dont add a link to apply (one is added automatically)</p>
          <p>
            For remote workers, Include the tools that people need for remote
            work. Eg internet access, phone, etc
          </p>
          <p>
            Include companies benefits to attract a major number of candidates.
          </p>
        </SuggestionText>
        <Separator />
        <SectionTitle style={{ marginBottom: "30px" }}>
          {job.job_type !== "permanent" && job.job_type !== "fixed_term"
            ? "Pay Rate details"
            : "Salary Details"}
        </SectionTitle>
        <DepContainer>
          <CheckBoxesGrid>
            {Object.entries(SALARY_TYPES).map((entry, index) => (
              <JobCheckbox
                key={`salary-status-${index}`}
                checked={job.salary_status === entry[0]}
                labelText={
                  entry[0] === "display" &&
                  job.job_type !== "permanent" &&
                  job.job_type !== "fixed_term"
                    ? "Add Pay Rate"
                    : entry[1]
                }
                onClick={() => {
                  if (entry[0] === "display" && !hasInternalFields) {
                    dropToBottom();
                  }
                  setUpdated(18);
                  setJob({ ...job, salary_status: entry[0] });
                }}
                mark={entry[0] === "display" ? "add" : undefined}
              />
            ))}
          </CheckBoxesGrid>
        </DepContainer>
        <SuggestionText>
          <p>
            {`Include a ${
              job.job_type !== "permanent" ? "pay rate" : "salary"
            } to
            boost the job's performance on some job board`}
          </p>
        </SuggestionText>
        {job.salary_status === "display" && (
          <DepContainer>
            {missingFields.rate &&
              (job.max_rate === "" || job.max_rate === "0") &&
              (job.min_rate === "" || job.min_rate === "0") && (
                <ErrorDisplay
                  text={`${
                    job.salary_interval === "yearly" ? "Salary" : "Rate"
                  } must have a value`}
                />
              )}
            {(job.job_type === "permanent" ||
              job.job_type === "fixed_term" ||
              job.job_type === "contract") && (
              <CheckBoxesGrid style={{ marginBottom: "25px" }}>
                <JobCheckbox
                  checked={job.salary_interval === "yearly"}
                  labelText="Yearly"
                  onClick={() => {
                    setJob({ ...job, salary_interval: "yearly" });
                    setUpdated(30);
                  }}
                />
                <JobCheckbox
                  checked={job.salary_interval === "daily"}
                  labelText="Daily"
                  onClick={() => {
                    setUpdated(31);
                    setJob({ ...job, salary_interval: "daily" });
                  }}
                />
                <JobCheckbox
                  checked={job.salary_interval === "hourly"}
                  labelText="Hourly"
                  onClick={() => {
                    setUpdated(31);
                    setJob({ ...job, salary_interval: "hourly" });
                  }}
                />
              </CheckBoxesGrid>
            )}
            <SalaryFlex className="leo-flex-center-between">
              {job.job_type !== "temp" && (
                <>
                  <SalaryCont>
                    <SalaryLabel>Currency</SalaryLabel>
                    <SalaryInput
                      value={store.company.currency.currency_name}
                      readOnly
                      disabled
                      style={{ width: "65px" }}
                    />
                  </SalaryCont>
                  <SalaryCont>
                    <SalaryLabel>Minimum</SalaryLabel>
                    <SalaryInput
                      value={job.min_rate}
                      onChange={(e) => {
                        setUpdated(19);
                        setJob({
                          ...job,
                          min_rate: e.target.value,
                        });
                      }}
                      type="number"
                    />
                  </SalaryCont>
                  <SalaryCont>
                    <SalaryLabel>Maximum</SalaryLabel>
                    <SalaryInput
                      value={job.max_rate}
                      onChange={(e) => {
                        setUpdated(20);
                        setJob({
                          ...job,
                          max_rate: e.target.value,
                        });
                      }}
                      type="number"
                    />
                  </SalaryCont>
                  <SalaryCont>
                    <SalaryLabel>Bonus</SalaryLabel>
                    <SalaryInput
                      value={job.salary_bonus}
                      onChange={(e) => {
                        setUpdated(21);
                        setJob({ ...job, salary_bonus: e.target.value });
                      }}
                      type="text"
                      maxlength="100"
                    />
                  </SalaryCont>
                  {store.company.type === "Agency" && (
                    <SalaryCont>
                      <SalaryLabel>Fee Percentage</SalaryLabel>
                      <SalaryInput
                        value={job.fee_percentage}
                        onChange={(e) => {
                          setUpdated(21);
                          setJob({ ...job, fee_percentage: e.target.value });
                        }}
                        type="number"
                      />
                    </SalaryCont>
                  )}
                </>
              )}
              {job.job_type === "temp" && (
                <RateSelector
                  store={store}
                  changes={job}
                  setChanges={setJob}
                  jobData={job}
                  setActiveModal={setActiveModal}
                />
              )}
              {activeModal === "rate-calculator" && (
                <RateCalculatorModal
                  hide={() => setActiveModal(undefined)}
                  store={store}
                  returnChanges={(newVals) => {
                    setUpdated(22);
                    setJob({ ...job, ...newVals });
                  }}
                  jobId={jobId}
                />
              )}
            </SalaryFlex>
          </DepContainer>
        )}
        {store.job_extra_fields && hasInternalFields && (
          <>
            <Separator />
            <SectionTitle style={{ marginBottom: "30px" }}>
              Internal Information
            </SectionTitle>
            {store.job_extra_fields?.po_reference_visible && (
              <>
                <DepContainer>
                  <Label className="large-margin">Po. Reference</Label>
                  {missingFields.po_reference && !job.po_reference && (
                    <ErrorDisplay text="PO. Reference cannot be empty" />
                  )}
                  <JobInput
                    value={job.po_reference}
                    setValue={(po_reference) => {
                      setUpdated(25);
                      setJob({ ...job, po_reference });
                    }}
                    placeholder="PO. Reference"
                  />
                </DepContainer>
                <SuggestionText></SuggestionText>
              </>
            )}
            {store.job_extra_fields?.work_pattern_visible && (
              <>
                <DepContainer>
                  <Label className="large-margin">Work Pattern</Label>
                  {missingFields.work_pattern && !job.work_pattern && (
                    <ErrorDisplay text="Work pattern cannot be empty" />
                  )}
                  <JobInput
                    value={job.work_pattern}
                    setValue={(work_pattern) => {
                      setUpdated(35);
                      setJob({ ...job, work_pattern });
                    }}
                    placeholder="Work Pattern"
                  />
                </DepContainer>
                <SuggestionText></SuggestionText>
              </>
            )}
            {store.job_extra_fields?.budgeted_visible && (
              <>
                <DepContainer>
                  <Label className="large-margin">Budgeted</Label>
                  {missingFields.budgeted &&
                    (job.budgeted === undefined || job.budgeted === null) && (
                      <ErrorDisplay text="You must select  budgeted option" />
                    )}
                  <CheckBoxesGrid>
                    <JobCheckbox
                      checked={job.budgeted}
                      labelText="Budgeted"
                      onClick={() => {
                        setUpdated(26);
                        setJob({
                          ...job,
                          budgeted: true,
                        });
                      }}
                    />
                    <JobCheckbox
                      checked={job.budgeted === false}
                      labelText="Non-Budgeted"
                      onClick={() => {
                        setUpdated(27);
                        setJob({
                          ...job,
                          budgeted: false,
                        });
                      }}
                    />
                  </CheckBoxesGrid>
                </DepContainer>
                <SuggestionText></SuggestionText>
              </>
            )}
            {store.job_extra_fields?.business_area_visible && (
              <>
                <DepContainer>
                  <Label>Business Area</Label>
                  {missingFields.areas_attributes && (
                    <ErrorDisplay text="You must select  at least one business area" />
                  )}
                  <TagsComponent
                    type="business_areas"
                    originalTags={originalBusinessArea}
                    returnTags={(areas_attributes) => {
                      setUpdated(28);
                      setJob({
                        ...job,
                        areas_attributes,
                      });
                    }}
                    parentTags={businessAreaTags}
                    setParentTags={setBusinessAreaTags}
                    returnHasTags={(val) =>
                      setHasTags((hasTags) => {
                        return { ...hasTags, business_area: val };
                      })
                    }
                  />
                </DepContainer>
                <SuggestionText></SuggestionText>
              </>
            )}
            {store.job_extra_fields?.department_visible && (
              <>
                <DepContainer>
                  <Label>Department</Label>
                  {missingFields.sectors_attributes && (
                    <ErrorDisplay text="You must select  at least one department" />
                  )}
                  <TagsComponent
                    type="departments"
                    originalTags={originalDepartment}
                    returnTags={(sectors_attributes) => {
                      setUpdated(29);
                      setJob({
                        ...job,
                        sectors_attributes,
                      });
                    }}
                    parentTags={departmentTags}
                    setParentTags={setDepartmentTags}
                    returnHasTags={(val) =>
                      setHasTags((hasTags) => {
                        return { ...hasTags, department: val };
                      })
                    }
                  />
                </DepContainer>
                <SuggestionText></SuggestionText>
              </>
            )}
            {store.job_extra_fields?.hire_type_visible && (
              <>
                <DepContainer>
                  <Label className="large-margin">Hire Type</Label>
                  {missingFields.hire_type &&
                    (job.hire_type === undefined || job.hire_type === null) && (
                      <ErrorDisplay text="You must select  at least one hire type" />
                    )}
                  <CheckBoxesGrid gridColumns={2}>
                    {Object.entries(HIRE_TYPES).map((type, index) => (
                      <JobCheckbox
                        key={`hire-type-option-${index}`}
                        checked={job.hire_type === type[0]}
                        labelText={type[1]}
                        onClick={() => {
                          setUpdated(30);
                          setJob({
                            ...job,
                            hire_type: type[0],
                          });
                        }}
                      />
                    ))}
                  </CheckBoxesGrid>
                </DepContainer>
                <SuggestionText></SuggestionText>
              </>
            )}
            {store.job_extra_fields?.advertised_visible && (
              <>
                <DepContainer>
                  <Label className="large-margin">Advertised</Label>
                  {missingFields.advertised &&
                    (job.advertised === undefined ||
                      job.advertised === null) && (
                      <ErrorDisplay text="You must select an advertised option" />
                    )}
                  <CheckBoxesGrid>
                    {Object.entries(ADVERTISED_OPTIONS).map((option, index) => (
                      <JobCheckbox
                        key={`advertised-option-${index}`}
                        checked={job.advertised === option[0]}
                        labelText={option[1]}
                        onClick={() => {
                          setUpdated(31);
                          setJob({
                            ...job,
                            advertised: option[0],
                          });
                        }}
                      />
                    ))}
                  </CheckBoxesGrid>
                </DepContainer>
                <SuggestionText></SuggestionText>
              </>
            )}
            {store.job_extra_fields?.working_hours_visible && (
              <>
                <DepContainer>
                  <Label className="large-margin">Working Hours</Label>
                  {missingFields.working_hours &&
                    (job.working_hours === undefined ||
                      job.working_hours === null) && (
                      <ErrorDisplay text="You must select the working hours" />
                    )}
                  <CheckBoxesGrid gridColumns={2}>
                    {Object.entries(WORKING_HOURS).map((hoursType, index) => (
                      <JobCheckbox
                        key={`workin-hours-option-${index}`}
                        checked={job.working_hours === hoursType[0]}
                        labelText={hoursType[1]}
                        onClick={() => {
                          setUpdated(32);
                          setJob({
                            ...job,
                            working_hours: hoursType[0],
                          });
                        }}
                      />
                    ))}
                  </CheckBoxesGrid>
                </DepContainer>
                <SuggestionText></SuggestionText>
              </>
            )}
          </>
        )}
      </GridContainer>
      {activeModal === "confirm-owner" && (
        <ConfirmModalV2
          id="confirm-owner"
          show={true}
          hide={() => {
            setActiveModal(undefined);
            setSelectedVendor(undefined);
          }}
          header="Change job owner"
          text="Are you sure you want change the job ownership of this job"
          actionText="Change"
          actionFunction={() => {
            setUpdated(33);
            setJob({
              ...job,
              selected_vendor: selectedVendor,
            });
            setActiveModal(undefined);
            setSelectedVendor(undefined);
          }}
        />
      )}
    </ATSContainer>
  );
};

export default JobDetails;

const ErrorDisplay = ({ text }) => (
  <ErrorWrap className="leo-flex-center">
    <img src={`${AWS_CDN_URL}/icons/ErrorCheckMark.svg`} alt="Error" />
    <span>{text}</span>
  </ErrorWrap>
);

const GridContainer = styled.div`
  grid-template-columns: 1fr 200px;
  display: grid;
  // grid-gap: 30px;
`;

const CheckBoxesGrid = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.gridColumns === 2 ? "1fr 1fr" : "1fr 1fr 1fr"};
  grid-gap: 10px;
  width: min-content;
`;

const SalaryFlex = styled.div`
  width: min-content;
`;
const SalaryCont = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex",
}))`
  flex-direction: column;
  margin-right: 10px;
`;

const EditorsContainer = styled.div`
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  padding: 20px;
  max-height: 500px;
  overflow: auto;
`;

const TagsContainer = styled.div`
  max-width: 530px;
`;

const ErrorWrap = styled.div`
  margin-bottom: 15px;
  color: #f27881;

  span {
    margin-left: 10px;
  }
`;

const Separator = styled.div`
  background: #dfe9f4;
  height: 2px;
  width: 100%;
  grid-column: span 2;
  margin-top: 50px;
`;

const VacancyFlex = styled.div`
  max-width: 440px;
`;

const VacanciesInput = styled(SalaryInput)`
  font-size: 12px;
  padding: 4px;
`;

const TEXT_INITIAL = `<p style="margin-top:0px;margin-left:0px;margin-right:0px;margin-bottom:5px;min-height:22px;text-align:initial"></p>`;
