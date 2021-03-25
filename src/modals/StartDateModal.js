import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { StyledDatePicker } from "components/Profiles/components/ProfileComponents.js";
import styled from "styled-components";

import { AWS_CDN_URL } from "constants/api";

import UniversalModal, {
  ModalFooter,
  ModalHeaderV2,
  ModalBody,
} from "modals/UniversalModal/UniversalModal";
import "assets/stylesheets/css/react-datetime.css";

const Inputs = styled.div`
  display: grid;
  grid-column-gap: 40px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 100px;

  label {
    color: #1e1e1e;
    font-size: 13px;
    /* line-height: 1; */
    margin-bottom: 10px;
  }

  input {
    margin: 0;
  }

  .date {
    input {
      background: url(${AWS_CDN_URL}/icons/icon-chevron-small.svg) center
        right 15px no-repeat #fff !important;
      border: 0;
      box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.05),
        inset 0 0 0 1px rgba(0, 0, 0, 0.1);
      cursor: pointer;

      &:focus {
        border: 0 !important;
        box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.05),
          inset 0 0 0 1px rgba(0, 0, 0, 0.1) !important;
      }
    }
  }
`;

const StartDateModal = ({
  show,
  hide,
  name,
  userAvatar,
  subTitle,
  confirmChangeCandidateStatus,
  selectedJob,
  salary,
  startDate,
  status,
  finalFee,
}) => {
  const store = useContext(GlobalContext);
  const [salary_rate, setSalaryRate] = useState("");
  const [start_date, setStartDate] = useState(Date.now());
  const [final_fee, setFinalFee] = useState(0);

  useEffect(() => {
    if (salary) {
      setSalaryRate(salary);
    }
  }, [salary]);

  useEffect(() => {
    if (startDate) {
      let date = new Date(startDate);
      setStartDate(date.getTime());
    }
  }, [startDate]);

  useEffect(() => {
    if (finalFee) {
      setFinalFee(finalFee);
    }
  }, [finalFee]);

  useEffect(() => {
    if (selectedJob && salary_rate) {
      if (selectedJob.fee_percentage) {
        setFinalFee((selectedJob.fee_percentage / 100) * salary_rate);
      }
    }
  }, [selectedJob, salary_rate]);

  return (
    <UniversalModal show={show} hide={hide} id={"rejection-modal"} width={600}>
      <ModalHeaderV2 name={name} userAvatar={userAvatar} subTitle={subTitle} />
      <ModalBody>
        <div style={{ padding: "30px" }}>
          <p className="paragraph">
            You are setting {name} to the status{" "}
            <span className="status">{statusExchanger[status]}</span>
            <br />
            Please confirm the candidates start date
            {store.company.type === "Agency" &&
            store.company.id !== selectedJob.company?.id ? (
              <>, salary and log the fee to start tracking your income.</>
            ) : store.company.type === "Employer" &&
              selectedJob.assigned_to_agency ? (
              <>
                , salary and log the agency fee to start tracking your agency
                spend.
              </>
            ) : (
              <> and salary.</>
            )}
          </p>
          <Inputs>
            <div>
              <label className="form-label form-heading">Start Date</label>
              <StyledDatePicker
                selected={start_date}
                onChange={(date) => setStartDate(date)}
                className="form-control"
              />
            </div>
            {(store.company.id !== selectedJob.company?.id ||
              selectedJob.assigned_to_agency) && (
              <div>
                <label className="form-label form-heading form-heading--salary">
                  Agreed Fee Percentage
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="fee percentage"
                  value={`${selectedJob.fee_percentage || 0}%`}
                  disabled
                />
              </div>
            )}
            <div>
              <label className="form-label form-heading form-heading--salary">
                {selectedJob.jobType === "contract" ? "Day Rate" : "Salary"}
              </label>
              <input
                type="text"
                className="form-control"
                name="salary"
                placeholder="eg. £30,000"
                value={salary_rate}
                onChange={(e) => setSalaryRate(e.target.value)}
                required
              />
            </div>
            {(store.company.id !== selectedJob.company?.id ||
              selectedJob.assigned_to_agency) && (
              <div>
                <label className="form-label form-heading form-heading--salary">
                  Final Fee
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="salary"
                  placeholder="eg. £30,000"
                  value={final_fee}
                  onChange={(e) => setFinalFee(e.target.value)}
                />
              </div>
            )}
          </Inputs>
        </div>
      </ModalBody>
      <ModalFooter hide={hide}>
        <button
          style={{ width: "auto" }}
          type="button"
          className="button button--default button--blue-dark button--full"
          onClick={() => {
            if (salary_rate && start_date) {
              confirmChangeCandidateStatus({
                salary_rate,
                start_date: new Date(start_date),
                final_fee:
                  store.company.id !== selectedJob.company?.id ||
                  selectedJob.assigned_to_agency
                    ? final_fee
                    : undefined,
              });
            } else {
              alert("All fields must be filled");
            }
          }}
        >
          Confirm
        </button>
      </ModalFooter>
    </UniversalModal>
  );
};

const statusExchanger = {
  "start date confirmed": "START DATE CONFIRMED",
  hired: "HIRED",
};

export default StartDateModal;
