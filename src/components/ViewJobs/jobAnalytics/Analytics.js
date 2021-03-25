import React, { Component } from "react";
import { ReactTitle } from "react-meta-tags";
import { InnerPageContainer } from "styles/PageContainers";

import { API_ROOT_PATH } from "constants/api";

// import {
//   professionalsAtStage,
//   averageApplicants,
//   jobAnalytics,
//   professionalsAtStagePerJob
// } from "containers/Analytics/helpers";
import JobStats from "components/Analytics/JobStats/index.js";

import download from "downloadjs";

class JobAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: {},
      jobs: undefined,
      selectedJob: undefined,
      user: undefined,
      tab: "jobs",
      professionalsAtStage: undefined,
      averageApplicants: undefined,
      dateBoundary: "today",
      selectedStage: "Applied",
      avgApplicantOption: "Per Job",
      singleJob: undefined,
    };
  }

  changeView(tab) {
    this.setState({ tab, dateBoundary: "this month" });
  }

  selectStage(stage) {
    this.setState({ selectedStage: stage });
    this.professionalsAtStage(
      this.state.company.id,
      this.state.dateBoundary,
      stage.toLowerCase()
    ).then((count) => {
      this.setState({ professionalsAtStage: count.professionals_at_stage });
    });
  }

  changeAverageOption(option) {
    this.setState({ avgApplicantOption: option });
    this.averageApplicants(this.state.company.id, this.state.dateBoundary).then(
      (count) => {
        this.setState({ averageApplicants: count.average_applicants });
      }
    );
  }

  async downloadReport() {
    // const res = await fetch(
    //   `${API_ROOT_PATH}/v1/analytics/${this.state.company.id}/candidate_report`,
    //   {
    //     method: "GET",
    //     headers: this.props.session
    //   }
    // );
    // if (res.ok) {
    //   const text = res.text();
    //   text.then(csv => {
    //     download(
    //       csv,
    //       `${this.state.company.name}-${
    //         new Date().toLocaleString().split(",")[0]
    //       }.csv`,
    //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    //     );
    //   });
    // }
    const url =
      API_ROOT_PATH + `/v1/analytics/${this.state.company.id}/candidate_report`;
    fetch(url, {
      method: "GET",
      headers: this.props.session,
    }).then((response) => {
      if (response.ok) {
        response.text().then((csv) => {
          download(
            csv,
            `${this.state.company.name}-${
              new Date().toLocaleString().split(",")[0]
            }.csv`,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
        });
      }
    });
  }

  render() {
    return (
      <InnerPageContainer>
        {this.props.company && (
          <ReactTitle
            title={`${
              this.props.jobData ? this.props.jobData.title : ""
            } | Leo`}
          />
        )}
        <React.Fragment>
          {this.props.jobData && (
            <JobStats
              user={this.props.teamMember}
              company={this.props.company}
              dateBoundary={this.state.dateBoundary}
              data={this.state.jobAnalytics}
              jobId={this.props.jobData}
            />
          )}
        </React.Fragment>
      </InnerPageContainer>
    );
  }
}

export default JobAnalytics;
