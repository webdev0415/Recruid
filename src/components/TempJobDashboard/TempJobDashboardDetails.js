import React, { useState, useEffect } from "react";
import { ATSContainer } from "styles/PageContainers";
import { ReactTitle } from "react-meta-tags";
import styled from "styled-components";
import { InnerPageContainer } from "styles/PageContainers";
import AppButton from "styles/AppButton";
import {
  DepContainer,
  Label,
  SalaryInput,
  CheckBoxesGrid,
} from "components/JobCreation/components";
import JobInput from "components/JobCreation/components/JobInput";
import JobCheckbox from "components/JobCreation/components/JobCheckbox";
import JobDateSelect from "components/JobCreation/components/JobDateSelect";
import { fetchEditJob } from "helpersV2/jobs";
import notify from "notifications";
import Spinner from "sharedComponents/Spinner";
import RateCalculatorModal from "modals/RateCalculatorModal";
import spacetime from "spacetime";
import humanizeDuration from "humanize-duration";
import { isHtmlStringEmpty } from "components/JobCreation/helpers";
import {
  JOB_TYPES,
  HIRE_TYPES,
  WORKING_HOURS,
  // EXPERIENCE_LEVELS,
  // SALARY_TYPES,
  ADVERTISED_OPTIONS,
} from "constants/job";
let timeout;

const TempJobDashboardDetails = ({ jobData, setJobData, store, jobId }) => {
  const [changes, setChanges] = useState({});
  const [triggerSave, setTriggerSave] = useState(false);
  const controller = new AbortController();
  const signal = controller.signal;
  const [saving, setSaving] = useState(false);
  const [activeModal, setActiveModal] = useState(undefined);

  useEffect(() => {
    if (Object.entries(changes).length > 0) {
      timeout = setTimeout(function () {
        setTriggerSave(true);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [changes]);

  useEffect(() => {
    if (triggerSave) {
      let body = {
        job_post: {
          ...changes,
          fixed_charge_rate: undefined,
          company_id: jobData.company.id,
        },
        job_owner: jobData.company.id,
        agency_ids:
          jobData.company.id !== store.company.id
            ? store.company.id
            : undefined,
      };
      if (changes.contract_start_date) {
        body.contract_start_date = new Date(changes.contract_start_date.epoch);
      }
      if (changes.contract_end_date) {
        body.contract_end_date = new Date(changes.contract_end_date.epoch);
      }
      setSaving(true);
      fetchEditJob(store.session, body.job_owner, jobId, body, signal)
        .then((res) => {
          if (!res.err) {
            notify("info", "Job succesfully edited");
            setJobData({ ...jobData, ...changes });
          } else if (!signal.aborted) {
            notify("danger", "Unable to save job changes");
          }
        })
        .finally(() => {
          setSaving(false);
          setTriggerSave(false);
        });
    }
    return () => controller.abort();
  }, [triggerSave]);

  return (
    <>
      <InnerPageContainer>
        {store.company && (
          <>
            <ReactTitle title={`${jobData ? jobData.title : ""} | Leo`} />
          </>
        )}
        <ATSContainer>
          <FlexContainer>
            <WhiteBox style={{ gridRow: "span 2" }}>
              <DepContainer>
                <Label>Job Title</Label>
                <JobInput
                  value={jobData.title}
                  readOnly={true}
                  disabled={true}
                />
              </DepContainer>
              {jobData.company.id !== store.company.id && (
                <DepContainer>
                  <Label>Client</Label>
                  <JobInput
                    value={jobData.company.name}
                    readOnly={true}
                    disabled={true}
                  />
                </DepContainer>
              )}

              {jobData.localizations && jobData.localizations.length > 0 && (
                <DepContainer>
                  <Label>Location</Label>
                  <TagsList>
                    {jobData.localizations.map(
                      (location, index) =>
                        `${location.location.name}${
                          index !== jobData.localizations.length - 1 ? ", " : ""
                        }`
                    )}
                  </TagsList>
                </DepContainer>
              )}
              <DepContainer>
                <Label>Remote</Label>
                <TagsList>{jobData.remote ? "Yes" : "No"}</TagsList>
              </DepContainer>
              {jobData.categorizations && jobData.categorizations.length > 0 && (
                <DepContainer>
                  <Label>Job Industries</Label>
                  <TagsList>
                    {jobData.categorizations.map(
                      (category, index) =>
                        `${category.category.name}${
                          index !== jobData.categorizations.length - 1
                            ? ", "
                            : ""
                        }`
                    )}
                  </TagsList>
                </DepContainer>
              )}
              {jobData.competencies && jobData.competencies.length > 0 && (
                <DepContainer>
                  <Label>Job Skills</Label>
                  <TagsList>
                    {jobData.competencies.map(
                      (skill, index) =>
                        `${skill.skill.name}${
                          index !== jobData.competencies.length - 1 ? ", " : ""
                        }`
                    )}
                  </TagsList>
                </DepContainer>
              )}
              {jobData.description && !isHtmlStringEmpty(jobData.description) && (
                <DepContainer>
                  <Label>Job Description</Label>
                  <div
                    dangerouslySetInnerHTML={{ __html: jobData.description }}
                  />
                </DepContainer>
              )}
              {jobData.requirements &&
                !isHtmlStringEmpty(jobData.requirements) && (
                  <DepContainer>
                    <Label>Requirements</Label>
                    <div
                      dangerouslySetInnerHTML={{ __html: jobData.requirements }}
                    />
                  </DepContainer>
                )}
              {jobData.benefits && !isHtmlStringEmpty(jobData.benefits) && (
                <DepContainer>
                  <Label>Benefits</Label>
                  <div dangerouslySetInnerHTML={{ __html: jobData.benefits }} />
                </DepContainer>
              )}
              {jobData.budgeted !== null && (
                <DepContainer>
                  <Label className="large-margin">Budgeted</Label>
                  <CheckBoxesGrid style={{ opacity: "0.5" }}>
                    <JobCheckbox
                      checked={jobData.budgeted}
                      labelText="Budgeted"
                      readOnly={true}
                    />
                    <JobCheckbox
                      checked={!jobData.budgeted}
                      labelText="Non-Budgeted"
                      readOnly={true}
                    />
                  </CheckBoxesGrid>
                </DepContainer>
              )}
              {jobData.areas && jobData.areas?.length > 0 && (
                <DepContainer>
                  <Label>Business Area</Label>
                  <TagsList>
                    {jobData.areas.map(
                      (area, index) =>
                        `${area.business_area.name}${
                          index !== jobData.areas.length - 1 ? ", " : ""
                        }`
                    )}
                  </TagsList>
                </DepContainer>
              )}
              {jobData.sectors && jobData.sectors?.length > 0 && (
                <>
                  <DepContainer>
                    <Label>Department</Label>
                    <TagsList>
                      {jobData.sectors.map(
                        (department, index) =>
                          `${department.department.name}${
                            index !== jobData.sectors.length - 1 ? ", " : ""
                          }`
                      )}
                    </TagsList>
                  </DepContainer>
                </>
              )}
              {jobData.po_reference && (
                <DepContainer>
                  <Label className="large-margin">Po. Reference</Label>
                  <JobInput
                    value={jobData.po_reference}
                    readOnly={true}
                    disabled={true}
                    placeholder="PO. Reference"
                  />
                </DepContainer>
              )}
              {jobData.work_pattern && (
                <DepContainer>
                  <Label className="large-margin">Work Pattern</Label>
                  <JobInput
                    value={jobData.work_pattern}
                    readOnly={true}
                    disabled={true}
                    placeholder="Work Pattern"
                  />
                </DepContainer>
              )}
              {/*}<DepContainer>
                <Label>Job Reference</Label>
                <JobInput value={"Net0567JK"} readOnly={true} />
              </DepContainer>
              <DepContainer>
                <Label>Purchase Number</Label>
                <JobInput value={"GBN6781"} readOnly={true} />
              </DepContainer>
              <DepContainer>
                <Label>Client Contact</Label>
                <JobInput value={"Net0567JK"} readOnly={true} />
              </DepContainer>
              <DepContainer>
                <Label>Client Email</Label>
                <JobInput value={"xxxxxxxx@gmail.com"} readOnly={true} />
              </DepContainer>
              <DepContainer>
                <Label>Work Address</Label>
                <JobInput
                  value={"E18 2GH, 10 Hammersmith Grove, London, UK"}
                  readOnly={true}
                />
              </DepContainer>*/}
            </WhiteBox>
            <WhiteBox>
              <DepContainer>
                <Label className="large-margin">Job Type</Label>
                <CheckBoxesGrid style={{ opacity: "0.5" }} gridColumns={2}>
                  {Object.entries(JOB_TYPES).map((type, index) => (
                    <JobCheckbox
                      key={`job-type-${index}`}
                      checked={jobData.job_type === type[0]}
                      labelText={type[1]}
                      readOnly={true}
                    />
                  ))}
                </CheckBoxesGrid>
              </DepContainer>
              <DepContainer>
                <StCheckboxesGrid style={{ opacity: "0.5" }}>
                  <SalaryCont>
                    <Label>Vacancies</Label>
                    <VacanciesInput
                      value={jobData.available_positions}
                      readOnly={true}
                    />
                  </SalaryCont>
                </StCheckboxesGrid>
              </DepContainer>
              {(jobData.job_type === "temp" ||
                jobData.job_type === "fixed_term") &&
                (jobData.contract_start_date || jobData.contract_end_date) && (
                  <DepContainer>
                    <StCheckboxesGrid style={{ opacity: "0.5" }}>
                      {jobData.contract_start_date && (
                        <SalaryCont>
                          <Label>Job start date</Label>
                          <JobDateSelect
                            placeholder="Start Date"
                            value={spacetime(
                              new Date(jobData.contract_start_date)
                            )}
                            style={{ height: "30px", width: "130px" }}
                            readOnly={true}
                          />
                        </SalaryCont>
                      )}
                      {jobData.contract_end_date && (
                        <SalaryCont>
                          <Label>Job end date</Label>
                          <JobDateSelect
                            placeholder="End Date"
                            value={spacetime(
                              new Date(jobData.contract_end_date)
                            )}
                            style={{ height: "30px", width: "130px" }}
                            readOnly={true}
                          />
                        </SalaryCont>
                      )}
                      {jobData.contract_start_date &&
                        jobData.contract_end_date && (
                          <SalaryCont>
                            <Label>Duration</Label>
                            <VacanciesInput
                              value={humanizeDuration(
                                new Date(jobData.contract_end_date) -
                                  new Date(jobData.contract_start_date)
                              )}
                              readOnly={true}
                            />
                          </SalaryCont>
                        )}
                    </StCheckboxesGrid>
                  </DepContainer>
                )}

              {jobData.advertised && (
                <DepContainer>
                  <Label className="large-margin">Advertised</Label>
                  <CheckBoxesGrid style={{ opacity: "0.5" }}>
                    {Object.entries(ADVERTISED_OPTIONS).map((option, inx) => (
                      <JobCheckbox
                        key={`advertised-options-${inx}`}
                        checked={jobData.advertised === option[0]}
                        labelText={option[1]}
                        readOnly={true}
                      />
                    ))}
                  </CheckBoxesGrid>
                </DepContainer>
              )}
              {jobData.hire_type && (
                <DepContainer>
                  <Label className="large-margin">Hire Type</Label>
                  <CheckBoxesGrid gridColumns={2} style={{ opacity: "0.5" }}>
                    {Object.entries(HIRE_TYPES).map((type, index) => (
                      <JobCheckbox
                        key={`hire-options-${index}`}
                        checked={jobData.hire_type === type[0]}
                        labelText={type[1]}
                        readOnly={true}
                      />
                    ))}
                  </CheckBoxesGrid>
                </DepContainer>
              )}
              {jobData.working_hours && (
                <DepContainer>
                  <Label className="large-margin">Working Hours</Label>
                  <CheckBoxesGrid gridColumns={2} style={{ opacity: "0.5" }}>
                    {Object.entries(WORKING_HOURS).map((hoursType, index) => (
                      <JobCheckbox
                        key={`working-hours-options-${index}`}
                        checked={jobData.working_hours === hoursType[0]}
                        labelText={hoursType[1]}
                        readOnly={true}
                      />
                    ))}
                  </CheckBoxesGrid>
                </DepContainer>
              )}
            </WhiteBox>

            {jobData.salary_status === "display" && (
              <WhiteBox>
                <DepContainer>
                  {(jobData.job_type === "permanent" ||
                    jobData.job_type === "fixed_term" ||
                    jobData.job_type === "contract") && (
                    <>
                      <Label className="large-margin">Pay Interval</Label>
                      <CheckBoxesGrid style={{ marginBottom: "25px" }}>
                        <JobCheckbox
                          checked={
                            changes.salary_interval !== undefined
                              ? changes.salary_interval === "yearly"
                              : jobData.salary_interval === "yearly"
                          }
                          labelText="Yearly"
                          onClick={() => {
                            setChanges({
                              ...changes,
                              salary_interval: "yearly",
                            });
                          }}
                        />
                        <JobCheckbox
                          checked={
                            changes.salary_interval !== undefined
                              ? changes.salary_interval === "daily"
                              : jobData.salary_interval === "daily"
                          }
                          labelText="Daily"
                          onClick={() => {
                            setChanges({
                              ...changes,
                              salary_interval: "daily",
                            });
                          }}
                        />
                        <JobCheckbox
                          checked={
                            changes.salary_interval !== undefined
                              ? changes.salary_interval === "hourly"
                              : jobData.salary_interval === "hourly"
                          }
                          labelText="Hourly"
                          onClick={() => {
                            setChanges({
                              ...changes,
                              salary_interval: "hourly",
                            });
                          }}
                        />
                      </CheckBoxesGrid>
                    </>
                  )}
                  <CheckBoxesGrid>
                    {jobData.job_type !== "temp" && (
                      <>
                        <SalaryCont>
                          <Label>Currency</Label>
                          <SalaryInput
                            value={store.company.currency.currency_name}
                            readOnly
                            disabled
                          />{" "}
                        </SalaryCont>
                        <>
                          <SalaryCont>
                            <Label>Minimum</Label>
                            <SalaryInput
                              value={
                                changes.min_rate !== undefined
                                  ? changes.min_rate
                                  : jobData.min_rate
                              }
                              onChange={(e) =>
                                setChanges({
                                  ...changes,
                                  min_rate: e.target.value,
                                })
                              }
                              type="number"
                            />
                          </SalaryCont>
                          <SalaryCont>
                            <Label>Maximum</Label>
                            <SalaryInput
                              value={
                                changes.max_rate !== undefined
                                  ? changes.max_rate
                                  : jobData.max_rate
                              }
                              onChange={(e) =>
                                setChanges({
                                  ...changes,
                                  max_rate: e.target.value,
                                })
                              }
                              type="number"
                            />
                          </SalaryCont>
                        </>
                        <SalaryCont>
                          <Label>Bonus</Label>
                          <SalaryInput
                            value={jobData.salary_bonus}
                            onChange={(e) => {
                              setChanges({
                                ...changes,
                                salary_bonus: e.target.value,
                              });
                            }}
                            type="text"
                            maxlength="100"
                          />
                        </SalaryCont>
                        {store.company.type === "Agency" && (
                          <SalaryCont>
                            <Label>Fee Percentage</Label>
                            <SalaryInput
                              value={
                                changes.fee_percentage !== undefined
                                  ? changes.fee_percentage
                                  : jobData.fee_percentage
                              }
                              onChange={(e) =>
                                setChanges({
                                  ...changes,
                                  fee_percentage: e.target.value,
                                })
                              }
                              type="number"
                            />
                          </SalaryCont>
                        )}
                      </>
                    )}
                    {jobData.job_type === "temp" && (
                      <RateSelector
                        store={store}
                        changes={changes}
                        setChanges={setChanges}
                        jobData={jobData}
                        setActiveModal={setActiveModal}
                      />
                    )}
                  </CheckBoxesGrid>
                </DepContainer>
              </WhiteBox>
            )}

            {activeModal === "rate-calculator" && (
              <RateCalculatorModal
                hide={() => setActiveModal(undefined)}
                store={store}
                returnChanges={(newVals) => {
                  setChanges({
                    ...changes,
                    ...newVals,
                  });
                }}
                jobId={jobId}
              />
            )}
          </FlexContainer>
          {saving && (
            <SavingIndicator>
              <Spinner size="sm" inline />
              <span>Saving Job...</span>
            </SavingIndicator>
          )}
        </ATSContainer>
      </InnerPageContainer>
    </>
  );
};

export const RateSelector = ({
  store,
  jobData,
  changes,
  setChanges,
  setActiveModal,
}) => {
  const [intervalType, setIntervalType] = useState(undefined);
  const [margin, setMargin] = useState(0);
  useEffect(() => {
    if (jobData && jobData.pay_interval === null) {
      setChanges({ ...changes, pay_interval: "hourly" });
    }
  }, [jobData]);

  useEffect(() => {
    if (jobData) {
      setIntervalType(changes.pay_interval || jobData.pay_interval);
      let payRate =
        (changes.pay_rate !== undefined ? changes.pay_rate : jobData.pay_rate) /
          100 || "";
      let chargeRate =
        (changes.charge_rate !== undefined
          ? changes.charge_rate
          : jobData.charge_rate) / 100 || "";
      setMargin(chargeRate - payRate);
    }
  }, [jobData, changes]);

  return (
    <RateContainer>
      <DepContainer>
        <StCheckboxesGrid>
          <div className="cell-container">
            <Label>Currency</Label>
            <VacanciesInput
              value={store.company.currency.currency_name}
              readOnly
              disabled
            />
          </div>
          <div className="cell-container">
            <Label>Interval</Label>
            <select
              className="form-control form-control-select"
              value={
                changes.pay_interval !== undefined
                  ? changes.pay_interval
                  : jobData.pay_interval
              }
              onChange={(e) =>
                setChanges({ ...changes, pay_interval: e.target.value })
              }
              style={{ maxWidth: "130px" }}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          <div className="cell-container button-calculator">
            <Label>{"   "}</Label>
            <AppButton
              className="leo-flex"
              theme="dark-blue"
              style={{
                padding: "6px 20px",
                width: "100%",
                maxWidth: "130px",
                maxHeight: "30px",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setActiveModal("rate-calculator")}
            >
              Rate calculator
            </AppButton>
          </div>
          <div className="cell-container">
            <Label>Pay Rate</Label>
            <VacanciesInput
              type="number"
              value={
                (changes.pay_rate !== undefined
                  ? changes.pay_rate
                  : jobData.pay_rate) / 100 || ""
              }
              onChange={(e) =>
                setChanges({ ...changes, pay_rate: e.target.value * 100 })
              }
            />
          </div>
          <div className="cell-container">
            <Label>Charge Rate</Label>
            <VacanciesInput
              type="number"
              value={
                changes.fixed_charge_rate ||
                (changes.charge_rate !== undefined
                  ? changes.charge_rate
                  : jobData.charge_rate) / 100 ||
                ""
              }
              onChange={(e) =>
                setChanges({ ...changes, charge_rate: e.target.value * 100 })
              }
            />
          </div>
          <div className="cell-container">
            <Label>
              {intervalType === "daily" ? "Daily" : "Hourly"} Margin
            </Label>
            <VacanciesInput value={margin} readOnly={true} disabled={true} />
          </div>
          <div className="cell-container">
            <Label>Bonus</Label>
            <VacanciesInput
              maxlength="100"
              type="text"
              value={changes.salary_bonus || jobData.salary_bonus || ""}
              onChange={(e) =>
                setChanges({ ...changes, salary_bonus: e.target.value })
              }
            />
          </div>
          {/*}<div className="cell-container">
            <Label>Payment Frequency</Label>
            <select
              className="form-control form-control-select"
              // value={rateType}
              // onChange={(e) => setRateType(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="cell-container">
            <Label>Invoice Frequency</Label>
            <select
              className="form-control form-control-select"
              // value={rateType}
              // onChange={(e) => setRateType(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="cell-container">
            <Label>Send Timesheet</Label>
            <select
              className="form-control form-control-select"
              // value={rateType}
              // onChange={(e) => setRateType(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">MNonthly</option>
            </select>
          </div>*/}
        </StCheckboxesGrid>
      </DepContainer>
    </RateContainer>
  );
};

export default TempJobDashboardDetails;

const FlexContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;
const SalaryCont = styled.div`
  display: flex;
  flex-direction: column;
`;

const VacanciesInput = styled(SalaryInput)`
  font-size: 12px;
  padding: 4px;
  max-width: 130px;
  max-height: 30px;
`;

const StCheckboxesGrid = styled(CheckBoxesGrid)`
  width: 100%;

  .cell-container {
    height: min-content;
  }

  .button-calculator {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
  }

  select,
  input {
    margin: 0px !important;
    font-size: 12px !important;
    height: 30px !important;
    box-shadow: none;
    border: solid #c4c4c4 1px;
  }
`;

const RateContainer = styled.div`
margin-top: 25px
border: solid #eee 1px;
border-radious: 4px;
`;

const SavingIndicator = styled.div`
  align-items: center;
  color: #8d8d8d;
  display: flex;
  margin-left: 10px;
  position: fixed;
  bottom: 20px;

  span {
    font-size: 10px;
    margin-left: 5px;
  }
`;

const WhiteBox = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  padding: 25px 35px 25px 25px;
`;

const TagsList = styled.div`
  font-size: 12px;
`;
