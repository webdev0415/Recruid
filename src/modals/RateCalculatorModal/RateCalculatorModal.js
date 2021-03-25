import React, { useState, useEffect } from "react";
import notify from "notifications";
import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";
import styled from "styled-components";
import { Label, SalaryInput } from "components/JobCreation/components";
import AppButton from "styles/AppButton";

import {
  fetchJobGlobalValues,
  fetchSaveJobGlobalValues,
  fetchCreateJobGlobalValues,
} from "helpersV2/tempPlus/job";
import { AWS_CDN_URL } from "constants/api";

const RateCalculatorModal = ({ hide, store, returnChanges, jobId }) => {
  const [calculationType, setCalculationType] = useState("charge");
  const [viewMode, setViewMode] = useState("initial");
  const [inputValues, setInputValues] = useState({
    interval: "hourly",
    charge_rate: "",
    pay_rate: "",
    margin: "",
    profit: "",
    margin_int: "",
    hours_per_day: "",
    days_per_week: "",
  });
  const [settings, setSettings] = useState({
    max_year_working_days: "",
    // paid_holidays: "",
    // paid_bank_holidays: "",
    // paid_sick_days: "",
    employer_national_insurance: "",
    employer_pension_contribution: "",
    hours_per_day: "",
    break_time: "",
  });
  const [results, setResults] = useState({
    employer_national_insurance: "",
    employer_pension_contribution: "",
    holiday_sick_pay: "",
    charge: "",
    margin: "",
    ltd_contractor: "",
    paye: "",
    exponentials: {
      year: { cost: 0, charge: 0, gross_profit: 0 },
      month: { cost: 0, charge: 0, gross_profit: 0 },
      week: { cost: 0, charge: 0, gross_profit: 0 },
      day: { cost: 0, charge: 0, gross_profit: 0 },
      hour: { cost: 0, charge: 0, gross_profit: 0 },
    },
  });
  const [calculated, setCalculated] = useState(false);
  const [selectedEmployeeType, setSelectedEmployeeType] = useState(false);
  const [jobSettings, setJobSettings] = useState(undefined);
  const [globalSettings, setGlobalSettings] = useState(undefined);
  useEffect(() => {
    if (store.session && store.company) {
      fetchJobGlobalValues(store.session, store.company.id, {
        global: true,
      }).then((res) => {
        if (!res.err) {
          setGlobalSettings(res);
        }
      });
    }
  }, [store.session, store.company]);

  useEffect(() => {
    if (store.session && store.company && jobId) {
      fetchJobGlobalValues(store.session, store.company.id, {
        global: false,
        job_id: jobId,
      }).then((res) => {
        if (!res.err) {
          setJobSettings(res);
        }
      });
    }
  }, [store.session, store.company, jobId]);
  useEffect(() => {
    if (jobSettings || globalSettings) {
      if (jobSettings) {
        setSettings({
          max_year_working_days: jobSettings.max_working_days,
          employer_national_insurance: jobSettings.employers_ni,
          employer_pension_contribution:
            jobSettings.employers_pension_contribution,
          hours_per_day: jobSettings.hours_per_day,
          break_time: jobSettings.unpaid_hours,
        });
      } else if (globalSettings) {
        setSettings({
          max_year_working_days: globalSettings.max_working_days,
          employer_national_insurance: globalSettings.employers_ni,
          employer_pension_contribution:
            globalSettings.employers_pension_contribution,
          hours_per_day: globalSettings.hours_per_day,
          break_time: globalSettings.unpaid_hours,
        });
      }
    }
  }, [jobSettings, globalSettings]);

  const generateCalculations = () => {
    // let values = checkInputValues(calculationType, inputValues);
    // if (!values) {
    //   return;
    // }
    let newResults = {
      employer_national_insurance: "",
      employer_pension_contribution: "",
      holiday_sick_pay: "",
      charge: "",
      profit: "",
      margin: inputValues.margin,
      ltd_contractor: "",
      paye: "",
      exponentials: {},
    };
    let charge;
    let payRate;
    let profit;
    if (calculationType === "charge") {
      charge = inputValues.charge_rate;
      profit = (inputValues.margin / 100) * charge;
      payRate = charge - profit;
    } else if (calculationType === "pay") {
      payRate = inputValues.pay_rate;

      let payRatePercentage = 100 - inputValues.margin;
      charge = (payRate / payRatePercentage) * 100;
      profit = charge - payRate;
    } else {
      profit = inputValues.margin_int;
      charge = (inputValues.margin_int / inputValues.margin) * 100;
      payRate = charge - profit;
    }
    newResults.charge = charge;
    newResults.profit = profit;
    newResults.ltd_contractor = payRate;

    //PAYE
    let NI;
    let pensionContribution;

    NI = (settings.employer_national_insurance / 100) * payRate;
    pensionContribution =
      (settings.employer_pension_contribution / 100) * payRate;
    newResults.employer_national_insurance = NI;
    newResults.employer_pension_contribution = pensionContribution;
    newResults.paye = payRate - NI - pensionContribution;

    //exponentials calculations
    let calcs = {
      year: { cost: 0, charge: 0, gross_profit: 0 },
      month: { cost: 0, charge: 0, gross_profit: 0 },
      week: { cost: 0, charge: 0, gross_profit: 0 },
      day: { cost: 0, charge: 0, gross_profit: 0 },
      hour: { cost: 0, charge: 0, gross_profit: 0 },
    };
    if (inputValues.interval === "daily") {
      //day
      calcs.day.cost = payRate;
      calcs.day.charge = charge;
      calcs.day.gross_profit = profit;

      //hour
      let hoursPerDay = inputValues.hours_per_day || 1;
      calcs.hour.cost = payRate / hoursPerDay;
      calcs.hour.charge = charge / hoursPerDay;
      calcs.hour.gross_profit = profit / hoursPerDay;
    } else {
      let hoursPerDay = inputValues.hours_per_day || 1;
      if (hoursPerDay >= settings.hours_per_day && settings.break_time > 0) {
        hoursPerDay -= settings.break_time;
      }
      calcs.hour.cost = payRate;
      calcs.hour.charge = charge;
      calcs.hour.gross_profit = profit;

      //day
      calcs.day.cost = payRate * hoursPerDay;
      calcs.day.charge = charge * hoursPerDay;
      calcs.day.gross_profit = profit * hoursPerDay;
    }

    //week
    let workingDays = inputValues.days_per_week || 1;
    calcs.week.cost = calcs.day.cost * workingDays;
    calcs.week.charge = calcs.day.charge * workingDays;
    calcs.week.gross_profit = calcs.day.gross_profit * workingDays;

    //year
    let total_year_days = workingDays * 52;
    if (
      settings &&
      settings.max_year_working_days > 0 &&
      total_year_days > settings.max_year_working_days
    ) {
      total_year_days = settings.max_year_working_days;
    }
    calcs.year.cost = calcs.day.cost * total_year_days;
    calcs.year.charge = calcs.day.charge * total_year_days;
    calcs.year.gross_profit = calcs.day.gross_profit * total_year_days;

    //month
    calcs.month.cost = calcs.year.cost / 12;
    calcs.month.charge = calcs.year.charge / 12;
    calcs.month.gross_profit = calcs.year.gross_profit / 12;

    newResults.exponentials = calcs;
    setResults(newResults);
    setCalculated(true);
  };

  const saveGlobalValues = (type) => {
    let body = {
      max_working_days: settings.max_year_working_days,
      employers_ni: settings.employer_national_insurance,
      employers_pension_contribution: settings.employer_pension_contribution,
      hours_per_day: settings.hours_per_day,
      unpaid_hours: settings.break_time,
      is_global: type === "global",
      company_id: store.company.id,
      job_post_id: jobId,
    };
    if (
      (type === "job" && !jobSettings) ||
      (type === "global" && !globalSettings)
    ) {
      fetchCreateJobGlobalValues(store.session, store.company.id, body).then(
        (res) => {
          if (!res.err) {
            notify("info", "Settings succesfully saved");
            setViewMode("initial");
            setCalculated(false);
            setSelectedEmployeeType(undefined);
          } else {
            notify("danger", "Settings could not be saved");
          }
        }
      );
    } else {
      fetchSaveJobGlobalValues(
        store.session,
        store.company.id,
        type === "global" ? globalSettings.id : jobSettings.id,
        body
      ).then((res) => {
        if (!res.err) {
          notify("info", "Settings succesfully saved");
          setViewMode("initial");
          setCalculated(false);
          setSelectedEmployeeType(undefined);
        } else {
          notify("danger", "Settings could not be saved");
        }
      });
    }
  };

  const changePayData = () => {
    returnChanges({
      pay_interval: inputValues.interval,
      charge_rate: results.charge * 100,
      fixed_charge_rate: results.charge * 100,
      pay_rate:
        (selectedEmployeeType === "ltd"
          ? results.ltd_contractor
          : results.paye) * 100,
    });
    hide();
  };

  return (
    <UniversalModal show={true} hide={hide} id="rate-calculator" width={960}>
      <ModalHeaderClassic
        title="Rate Negotiation Calculator"
        closeModal={hide}
        theme="v2theme"
      />
      <STModalBody className="no-footer">
        {viewMode === "initial" && (
          <>
            <SelectorWrapper>
              <button
                className={`button-selector ${
                  calculationType === "charge" ? "active" : ""
                }`}
                onClick={() => setCalculationType("charge")}
              >
                Charge Rate
              </button>
              <button
                className={`button-selector ${
                  calculationType === "margin" ? "active" : ""
                }`}
                onClick={() => setCalculationType("margin")}
              >
                Margin
              </button>
              <button
                className={`button-selector ${
                  calculationType === "pay" ? "active" : ""
                }`}
                onClick={() => setCalculationType("pay")}
              >
                Pay Rate
              </button>
            </SelectorWrapper>
            <InputsContainer>
              <div>
                <InputBox>
                  <STLabel>Rate Units</STLabel>
                  <select
                    className="form-control form-control-select"
                    value={inputValues.interval}
                    onChange={(e) =>
                      setInputValues({
                        ...inputValues,
                        interval: e.target.value,
                      })
                    }
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                  </select>
                </InputBox>
                {calculationType === "charge" && (
                  <InputBox>
                    <STLabel>Charge Rate</STLabel>
                    <VacanciesInput
                      type="number"
                      value={inputValues.charge_rate}
                      onChange={(e) =>
                        setInputValues({
                          ...inputValues,
                          charge_rate: e.target.value,
                        })
                      }
                      min="0"
                    />
                  </InputBox>
                )}
                {calculationType === "pay" && (
                  <InputBox>
                    <STLabel>Pay Rate</STLabel>
                    <VacanciesInput
                      type="number"
                      value={inputValues.pay_rate}
                      onChange={(e) =>
                        setInputValues({
                          ...inputValues,
                          pay_rate: e.target.value,
                        })
                      }
                      min="0"
                    />
                  </InputBox>
                )}
                {calculationType === "margin" && (
                  <InputBox>
                    <STLabel>Margin</STLabel>
                    <VacanciesInput
                      type="number"
                      value={inputValues.margin_int}
                      onChange={(e) =>
                        setInputValues({
                          ...inputValues,
                          margin_int: e.target.value,
                        })
                      }
                      min="0"
                    />
                  </InputBox>
                )}
                <InputBox>
                  <STLabel>Markup %</STLabel>
                  <VacanciesInput
                    type="number"
                    value={inputValues.margin}
                    onChange={(e) =>
                      setInputValues({ ...inputValues, margin: e.target.value })
                    }
                    min="0"
                    max="100"
                  />
                </InputBox>
              </div>
              <div className="column-right">
                <InputBox>
                  <STLabel>Hours per day</STLabel>
                  <VacanciesInput
                    type="number"
                    value={inputValues.hours_per_day}
                    onChange={(e) =>
                      setInputValues({
                        ...inputValues,
                        hours_per_day: e.target.value,
                      })
                    }
                    min="0"
                    max="24"
                  />
                </InputBox>
                <InputBox>
                  <STLabel>Days per week</STLabel>
                  <VacanciesInput
                    type="number"
                    value={inputValues.days_per_week}
                    onChange={(e) =>
                      setInputValues({
                        ...inputValues,
                        days_per_week: e.target.value,
                      })
                    }
                    min="0"
                    max="7"
                  />
                </InputBox>
              </div>
            </InputsContainer>
            <AppButton
              theme="grey"
              size="small"
              style={{ marginTop: "45px" }}
              onClick={() => generateCalculations()}
            >
              Calculate
            </AppButton>
          </>
        )}
        {calculated && viewMode === "initial" && (
          <>
            <ResultsWrapper>
              <TitleResult>Results</TitleResult>
              <div className="flex-container">
                <div className="column-container">
                  <SectionTitle className="red">Cost</SectionTitle>
                  <FlexResults>
                    <div className="label-title">Employes NI</div>
                    <div className="value-title">
                      {Number(results.employer_national_insurance).toFixed(2)}
                    </div>
                  </FlexResults>
                  <FlexResults>
                    <div className="label-title">
                      Employes Pension Contribuition
                    </div>
                    <div className="value-title">
                      {Number(results.employer_pension_contribution).toFixed(2)}
                    </div>
                  </FlexResults>
                </div>
                <div className="column-container">
                  <SectionTitle className="orange">Charge</SectionTitle>
                  <FlexResults>
                    <div className="label-title">
                      {inputValues.interval === "hourly" ? "Hourly" : "Daily"}{" "}
                      Charge
                    </div>
                    <div className="value-title">
                      {Number(results.charge).toFixed(2)}
                    </div>
                  </FlexResults>
                  <SectionTitle className="orange">Pay</SectionTitle>
                  <FlexResults
                    onClick={() => setSelectedEmployeeType("ltd")}
                    className={`${
                      selectedEmployeeType === "ltd" ? "active" : ""
                    }`}
                  >
                    <div className="label-title">Ltd contractor</div>
                    <div className="value-title">
                      {Number(results.ltd_contractor).toFixed(2)}
                    </div>
                  </FlexResults>
                  <FlexResults
                    onClick={() => setSelectedEmployeeType("paye")}
                    className={`${
                      selectedEmployeeType === "paye" ? "active" : ""
                    }`}
                  >
                    <div className="label-title">PAYE</div>
                    <div className="value-title">
                      {Number(results.paye).toFixed(2)}
                    </div>
                  </FlexResults>
                </div>
                <div className="column-container">
                  <SectionTitle className="green">Profit Rate</SectionTitle>
                  <FlexResults>
                    <div className="label-title">Markup %</div>
                    <div className="value-title">
                      {Number(results.margin).toFixed(2)}
                    </div>
                  </FlexResults>
                  <FlexResults>
                    <div className="label-title">Margin</div>
                    <div className="value-title">
                      {Number(results.profit).toFixed(2)}
                    </div>
                  </FlexResults>
                </div>
              </div>
            </ResultsWrapper>
            <TitleResult>Average Figures</TitleResult>
            <StTable>
              <thead>
                <tr>
                  <th></th>
                  <th>Annual</th>
                  <th>Month</th>
                  <th>Week</th>
                  <th>Day</th>
                  <th>Hour</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cost</td>
                  <td>{Number(results.exponentials.year.cost).toFixed(2)}</td>
                  <td>{Number(results.exponentials.month.cost).toFixed(2)}</td>
                  <td>{Number(results.exponentials.week.cost).toFixed(2)}</td>
                  <td>{Number(results.exponentials.day.cost).toFixed(2)}</td>
                  <td>{Number(results.exponentials.hour.cost).toFixed(2)}</td>
                </tr>
                <tr className="second-row">
                  <td>Charge</td>
                  <td>{Number(results.exponentials.year.charge).toFixed(2)}</td>
                  <td>
                    {Number(results.exponentials.month.charge).toFixed(2)}
                  </td>
                  <td>{Number(results.exponentials.week.charge).toFixed(2)}</td>
                  <td>{Number(results.exponentials.day.charge).toFixed(2)}</td>
                  <td>{Number(results.exponentials.hour.charge).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Gross Profit</td>
                  <td>
                    {Number(results.exponentials.year.gross_profit).toFixed(2)}
                  </td>
                  <td>
                    {Number(results.exponentials.month.gross_profit).toFixed(2)}
                  </td>
                  <td>
                    {Number(results.exponentials.week.gross_profit).toFixed(2)}
                  </td>
                  <td>
                    {Number(results.exponentials.day.gross_profit).toFixed(2)}
                  </td>
                  <td>
                    {Number(results.exponentials.hour.gross_profit).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </StTable>
            {selectedEmployeeType && (
              <ButtonsContainer>
                <AppButton
                  theme="dark-blue"
                  size="small"
                  onClick={() => {
                    changePayData();
                  }}
                >
                  {selectedEmployeeType === "ltd"
                    ? "Use Ltd Contractor Rates"
                    : "Use PAYE rates"}
                </AppButton>
              </ButtonsContainer>
            )}
          </>
        )}
        {viewMode === "settings" && (
          <>
            <SettingsTitle>
              Allowances added to Client Charge Rate
            </SettingsTitle>
            <InputsContainer>
              <div>
                <InputBox>
                  <STLabel>Max Working Days in the year</STLabel>
                  <VacanciesInput
                    type="number"
                    value={settings.max_year_working_days}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        max_year_working_days: e.target.value,
                      })
                    }
                  />
                </InputBox>
                {/*}<InputBox>
                  <STLabel>Paid holidays</STLabel>
                  <VacanciesInput
                    type="number"
                    value={settings.paid_holidays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        paid_holidays: e.target.value,
                      })
                    }
                  />
                </InputBox>
                <InputBox>
                  <STLabel>Paid Bank Holidays</STLabel>
                  <VacanciesInput
                    type="number"
                    value={settings.paid_bank_holidays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        paid_bank_holidays: e.target.value,
                      })
                    }
                  />
                </InputBox>
                <InputBox>
                  <STLabel>Paid Sick Days</STLabel>
                  <VacanciesInput
                    type="number"
                    value={settings.paid_sick_days}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        paid_sick_days: e.target.value,
                      })
                    }
                  />
                </InputBox>*/}
              </div>
              <div className="column-right">
                <InputBox>
                  <STLabel>Employers NI %</STLabel>
                  <VacanciesInput
                    type="number"
                    value={settings.employer_national_insurance}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        employer_national_insurance: e.target.value,
                      })
                    }
                  />
                </InputBox>
                <InputBox>
                  <STLabel>Employers Pension Contribution %</STLabel>
                  <VacanciesInput
                    type="number"
                    value={settings.employer_pension_contribution}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        employer_pension_contribution: e.target.value,
                      })
                    }
                  />
                </InputBox>
              </div>
            </InputsContainer>
            <SettingsTitle>Pay</SettingsTitle>
            <InputsContainer style={{ alignItems: "center" }}>
              <STLabel style={{ marginBottom: "0", marginRight: "10px" }}>
                If Hours per day
              </STLabel>
              <VacanciesInput
                type="number"
                value={settings.hours_per_day}
                onChange={(e) =>
                  setSettings({ ...settings, hours_per_day: e.target.value })
                }
                style={{ maxWidth: "50px", marginRight: "20px" }}
              />
              <STLabel style={{ marginBottom: "0", marginRight: "10px" }}>
                then unpaid hours
              </STLabel>{" "}
              <VacanciesInput
                type="number"
                value={settings.break_time}
                onChange={(e) =>
                  setSettings({ ...settings, break_time: e.target.value })
                }
                style={{ maxWidth: "50px" }}
              />
            </InputsContainer>
            <ButtonsContainer>
              {globalSettings && jobSettings && (
                <AppButton
                  theme="dark-blue"
                  size="small"
                  style={{ left: "45px" }}
                  className="leo-absolute"
                  onClick={() => {
                    setSettings({
                      max_year_working_days: globalSettings.max_working_days,
                      employer_national_insurance: globalSettings.employers_ni,
                      employer_pension_contribution:
                        globalSettings.employers_pension_contribution,
                      hours_per_day: globalSettings.hours_per_day,
                      break_time: globalSettings.unpaid_hours,
                    });
                  }}
                >
                  Use Global Values
                </AppButton>
              )}
              <AppButton
                theme="light-grey"
                size="small"
                style={{ marginRight: "15px" }}
                onClick={() => {
                  saveGlobalValues("job");
                }}
              >
                Save
              </AppButton>
              <AppButton
                theme="grey"
                size="small"
                onClick={() => saveGlobalValues("global")}
              >
                Save as Global default
              </AppButton>
            </ButtonsContainer>
          </>
        )}
        {viewMode !== "settings" && (
          <SettingsButton onClick={() => setViewMode("settings")}>
            <img src={`${AWS_CDN_URL}/icons/SettingsSvg.svg`} alt="Settings" />
          </SettingsButton>
        )}
      </STModalBody>
    </UniversalModal>
  );
};

export default RateCalculatorModal;

const STModalBody = styled(ModalBody)`
  padding: 45px !important;
`;

const SelectorWrapper = styled.div`
  width: 100%;
  border-bottom: solid #c4c4c4 1px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 10px;
  padding-bottom: 20px;
  margin-bottom: 35px;
  .button-selector {
    border: 1px solid #c4c4c4;
    border-radius: 4px;
    width: 160px;
    height: 60px;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #74767b;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #2a442f;
      border: 1px solid #2a442f;
    }
    &.active {
      color: #2a442f;
      border: 1px solid #2a442f;
    }
  }
`;
const SettingsButton = styled.button`
  position: absolute;
  top: 15px;
  right: 45px;
`;

const InputsContainer = styled.div`
  display: flex;

  .column-right {
    margin-left: 77px;
  }
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  // width: 200px;
  justify-content: space-between;
  margin-bottom: 15px;

  label {
    margin-bottom: 0px !important;
  }

  select,
  input {
    margin: 0px !important;
    font-size: 12px !important;
    height: 24px !important;
    box-shadow: none;
    border: solid #c4c4c4 1px;
    max-width: 90px;
    padding: 2px 4px;
  }
`;

const VacanciesInput = styled(SalaryInput)`
  font-size: 12px;
  padding: 4px;
  max-width: 150px;
`;

const SettingsTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #2a3744;
  margin-bottom: 30px;
`;

const STLabel = styled(Label)`
  min-width: max-content;
  margin-right: 25px;
`;

const ResultsWrapper = styled.div`
  background: rgba(196, 196, 196, 0.09);
  border-radius: 8px;
  padding: 20px;
  margin: 35px 0px;

  .flex-container {
    display: flex;
    .column-container {
      width: 100%;
      margin-right: 40px;
    }
  }
`;

const TitleResult = styled.h3`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 16px;
  color: rgba(30, 30, 30, 0.9);
`;

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  border-left: solid black 5px;
  padding-left: 8px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-bottom: 10px;

  &.green {
    color: #35c3ae;
    border-color: #35c3ae;
  }

  &.orange {
    color: #ffa076;
    border-color: #ffa076;
  }

  &.red {
    color: #f27881;
    border-color: #f27881;
  }
`;
const FlexResults = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  cursor: pointer;
  .label-title {
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    color: #74767b;
  }
  .value-title {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #c4c4c4;
  }

  &.active {
    .label-title {
      color: black;
    }
    .value-title {
      color: black;
    }
  }
`;

const StTable = styled.table`
  width: 100%;
  max-width: 800px;
  th {
    font-weight: bold;
    font-size: 14px;
    line-height: 17px;
    color: #74767b;
    padding: 9px 13px;
    padding-left: 0px;
    text-align: right;
  }

  .second-row {
    background: rgba(196, 196, 196, 0.15);
    border-radius: 4px;
  }

  tr {
    td {
      font-weight: bold;
      font-size: 12px;
      line-height: 15px;
      color: #c4c4c4;
      padding: 9px 13px;
      padding-left: 0px;
      text-align: right;
    }
    td:first-child {
      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
      color: #74767b;
      padding: 9px 13px;
      text-align: left;
    }
  }
`;
const ButtonsContainer = styled.div`
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
//
// const checkInputValues = (calculationType, inputValues) => {
//   let returnVal = {};
//   if (calculationType === "charge") {
//     if (inputValues.charge_rate === "") {
//       notify("danger", "Charge rate cannot be empty");
//       return false;
//     } else if (
//       inputValues.charge_rate === "0" ||
//       inputValues.charge_rate === 0
//     ) {
//       notify("danger", "Charge rate cannot be 0");
//       return false;
//     } else {
//       let numVal = Number(inputValues.charge_rate);
//       if (Number.isNaN(numVal)) {
//         notify("danger", "Charge rate is not a number");
//         return false;
//       } else if (numVal < 0) {
//         notify("danger", "Charge rate cannot be lower than 0");
//         return false;
//       } else {
//         returnVal.charge_rate = numVal;
//       }
//     }
//   } else {
//     if (inputValues.pay_rate === "") {
//       notify("danger", "Charge rate cannot be empty");
//       return false;
//     } else if (inputValues.pay_rate === "0" || inputValues.pay_rate === 0) {
//       notify("danger", "Charge rate cannot be 0");
//       return false;
//     } else {
//       let numVal = Number(inputValues.pay_rate);
//       if (Number.isNaN(numVal)) {
//         notify("danger", "Charge rate is not a number");
//         return false;
//       } else if (numVal < 0) {
//         notify("danger", "Charge rate cannot be lower than 0");
//         return false;
//       } else {
//         returnVal.pay_rate = numVal;
//       }
//     }
//   }
//   if (inputValues.margin === "") {
//     returnVal.margin = 0;
//   } else {
//     let valNum = Number(inputValues.margin);
//     if (Number.isNaN(valNum)) {
//       notify("danger", "Margin is not a number");
//       return false;
//     } else if (valNum < 0) {
//       notify("danger", "margin cannot be lower than 0");
//       return false;
//     } else {
//       returnVal.margin = valNum;
//     }
//   }
//
//   if (inputValues.hours_per_day === "") {
//     returnVal.hours_per_day = 0;
//   } else {
//     let valNum = Number(inputValues.hours_per_day);
//     if (Number.isNaN(valNum)) {
//       notify("danger", "Hours per day is not a number");
//       return false;
//     } else if (valNum < 0) {
//       notify("danger", "hours per day cannot be lower than 0");
//       return false;
//     } else {
//       returnVal.hours_per_day = valNum;
//     }
//   }
//
//   if (inputValues.days_per_week === "") {
//     returnVal.days_per_week = 0;
//   } else {
//     let valNum = Number(inputValues.days_per_week);
//     if (Number.isNaN(valNum)) {
//       notify("danger", "Days per week is not a number");
//       return false;
//     } else if (valNum < 0) {
//       notify("danger", "days per week cannot be lower than 0");
//       return false;
//     } else {
//       returnVal.days_per_week = valNum;
//     }
//   }
//   return returnVal;
// };
