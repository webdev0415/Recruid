import React from "react";
import PropTypes from "prop-types";
import { API_ROOT_PATH } from "constants/api";
import * as Datetime from "react-datetime";
import UniversalModal, {
  ModalHeaderV2,
  ModalBody,
  ModalFooter,
} from "modals/UniversalModal/UniversalModal";

import {
  onboarding,
  hireApplicant,
  startConfirmed,
} from "../../../helpers/ManageApplicantFetchers";
import notify from "notifications";

const monthAbbreviations = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default class OfferModal extends React.Component {
  constructor() {
    super();
    this.state = {
      jobStartDate: "",
      salary: undefined,
    };
    this.onboarding = onboarding.bind(this);
    this.hireApplicant = hireApplicant.bind(this);
    this.startConfirmed = startConfirmed.bind(this);
  }

  handleStartDateChange(event) {
    let date = String(event._d).split(" ");
    let reconstruction = `${date[3]}-${
      monthAbbreviations.indexOf(date[1]) + 1
    }-${date[2]}`;
    this.setState({ jobStartDate: reconstruction });
  }

  // disablePastDate(current) {
  //   let yesterday = Datetime.moment().subtract(1, "day");
  //   return current.isAfter(yesterday);
  // }

  offerPosition() {
    const url = API_ROOT_PATH + "/v1/companies/interactions/offer_position";
    const postBody = {
      job_post_id: this.props.jobId,
      applicant_id: this.props.applicant.applicant_id,
      salary_rate: this.state.salary,
      start_date: this.state.jobStartDate,
    };
    fetch(url, {
      method: "POST",
      headers: this.props.session,
      body: JSON.stringify(postBody),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          if (data.message === "Success") {
            Promise.resolve(
              this.props.updateApplicantData(
                this.props.index,
                "status",
                "offered"
              )
            ).then(() => {
              this.props.setStageCount();
              notify("info", "Applicant status successfully updated!");
              if (this.props.afterFinish) {
                this.props.afterFinish();
              }
              this.props.closeModal();
            });
          } else {
            notify("danger", "Something went wrong, Please try again...");
          }
        });
      }
    });
  }

  boarding() {
    this.onboarding(this.props.jobId, this.props.applicant.id, {
      salary_rate: this.state.salary,
      start_date: this.state.jobStartDate,
    }).then((response) => {
      if (response !== "err") {
        Promise.resolve(
          this.props.updateApplicantData(
            this.props.index,
            "status",
            "onboarding"
          )
        ).then(() => {
          this.props.setStageCount();
          notify("info", "Applicant status successfully updated!");
          this.props.closeModal();
        });
      } else {
        notify("danger", "Something went wrong, Please try again...");
      }
    });
  }

  hiredApplicant() {
    this.hireApplicant(
      this.props.jobId,
      this.props.applicant.id || this.props.applicant.applicant_prof_id,
      {
        start_date: this.state.jobStartDate,
        salary_rate: this.state.salary,
      }
    ).then((response) => {
      if (response !== "err") {
        Promise.resolve(
          this.props.updateApplicantData(
            this.props.index,
            "status",
            "hired applicant"
          )
        ).then(() => {
          this.props.setStageCount();
          notify("info", "Applicant status successfully updated!");
          this.props.closeModal();
        });
      } else {
        notify("danger", "Something went wrong, Please try again...");
      }
    });
  }

  confirmStart() {
    this.startConfirmed(this.props.jobId, this.props.applicant.applicant_id, {
      start_date: this.state.jobStartDate,
      salary_rate: this.state.salary,
    }).then((response) => {
      if (response !== "err") {
        Promise.resolve(
          this.props.updateApplicantData(
            this.props.index,
            "status",
            "start date confirmed"
          )
        ).then(() => {
          this.props.setStageCount();
          notify("info", "Applicant status successfully updated!");
          this.props.closeModal();
        });
      } else {
        notify("danger", "Something went wrong, Please try again...");
      }
    });
  }

  render() {
    return (
      <UniversalModal
        show={true}
        hide={() => this.setState({ showModal: undefined })}
        id={"offerStatus"}
        // width={480}
      >
        <ModalHeaderV2
          name={this.props.applicant.name || this.props.applicant.talent_name}
          userAvatar={this.props.applicant.avatar_url}
        />
        <ModalBody>
          <div className="row">
            <div className="col-sm-12">
              <label className="form-label form-heading form-heading--salary">
                {this.props.job.jobType === "contract" ? "Day Rate" : "Salary"}
              </label>
              {this.props.job.jobpostfor === "recruitd" && (
                <label className="form-label form-heading form-heading--fee">
                  {this.props.job.feePercentage}% Fee:{" "}
                  {this.props.company.currency?.currency_name}
                  {this.state.calculatedFees}
                </label>
              )}
              <input
                type="number"
                className="form-control"
                name="salary"
                // value={this.state.salary}
                onChange={(e) => this.setState({ salary: e.target.value })}
                required
              />
            </div>
            <div className="col-sm-12">
              <label className="form-label form-heading">Start Date</label>
              {/* <input type='date' className='form-control' name="start_date" value={this.state.jobStartDate} onChange={this.handleStartDateChange} required /> */}
              <Datetime
                value={
                  this.state.jobStartDate || this.props.applicant.start_date
                }
                timeFormat={false}
                // isValidDate={this.disablePastDate}
                onChange={this.handleStartDateChange.bind(this)}
                inputProps={{ placeholder: "Select Date/Time" }}
                strictParsing={true}
                closeOnSelect={true}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter hide={this.props.closeModal}>
          <button
            type="button"
            className="button button--default button--primary button--full"
            onClick={() => {
              if (this.props.statusMode === "onboarding") {
                this.boarding();
              } else if (this.props.statusMode === "hired") {
                this.hiredApplicant();
              } else if (this.props.statusMode === "start date confirmed") {
                this.confirmStart();
              } else {
                this.offerPosition();
              }
            }}
          >
            Confirm
          </button>
        </ModalFooter>
      </UniversalModal>
    );
  }
}

OfferModal.propTypes = {
  session: PropTypes.object.isRequired,
  applicant: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  updateApplicantData: PropTypes.func.isRequired,
  job: PropTypes.object.isRequired,
  jobId: PropTypes.number.isRequired,
  closeModal: PropTypes.func.isRequired,
};
