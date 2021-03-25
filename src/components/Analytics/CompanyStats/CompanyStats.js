import React, { Component } from "react";

import FilterSelector from "../FilterSelector";
import StatCell from "sharedComponents/StatCell";

import analyticsStyles from "assets/stylesheets/scss/collated/analytics.module.scss";
import sharedStyles from "../style/shared.module.scss";

import {
  companyAnalytics,
  professionalsAtStage,
  averageApplicants,
  jobAnalytics,
} from "../helpers";

import Bar from "../shared/Bar";
import Doughnut from "../shared/Doughnut";
import StageSelector from "../shared/StageSelector";
import {
  StatContainer,
  StatContainerSingle,
  StatContainerDouble,
} from "../shared/components";
import { ATSContainer } from "styles/PageContainers";

export default class CompanyStats extends Component {
  constructor() {
    super();
    this.state = {
      company: {},
      jobs: undefined,
      jobAnalytics: undefined,
      selectedJob: undefined,
      user: undefined,
      companyAnalytics: undefined,
      professionalsAtStage: undefined,
      averageApplicants: undefined,
      dateBoundary: "this month",
      selectedStage: "applied",
      avgApplicantOption: "Per Job",
      sourceDisplay: "%",
    };
    this.companyAnalytics = companyAnalytics.bind(this);
    this.professionalsAtStage = professionalsAtStage.bind(this);
    this.averageApplicants = averageApplicants.bind(this);
    this.jobAnalytics = jobAnalytics.bind(this);
  }

  componentDidMount() {
    this.setState({
      companyAnalytics: this.props.companyAnalytics,
      professionalsAtStage: this.props.professionalsAtStage,
      averageApplicants: this.props.averageApplicants,
    });
  }

  setSourceDisplay(option) {
    this.setState({ sourceDisplay: option });
  }

  setDateBoundary(option) {
    this.setState({ dateBoundary: option });
    this.companyAnalytics(this.props.company.id, option).then((data) => {
      this.setState({ companyAnalytics: data });
      setTimeout(() => {
        this.professionalsAtStage(
          this.props.company.id,
          this.state.dateBoundary,
          this.state.selectedStage
        ).then((count) => {
          this.setState({
            professionalsAtStage: count,
          });
        });

        this.averageApplicants(
          this.props.company.id,
          this.state.dateBoundary
        ).then((count) => {
          this.setState({ averageApplicants: count });
        });
      });
    });
  }

  selectStage(stage) {
    this.setState({ selectedStage: stage });
    this.professionalsAtStage(
      this.props.company.id,
      this.state.dateBoundary,
      stage
    ).then((count) => {
      this.setState({ professionalsAtStage: count });
    });
  }

  render() {
    if (this.state.companyAnalytics) {
      const {
        open_positions,
        total_candidates,
        average_time_to_fill,
        average_time_to_hire,
        total_agency_spend,
      } = this.state.companyAnalytics;
      return (
        <>
          <ATSContainer>
            <div
              className="leo-flex leo-justify-end"
              style={{
                marginBottom: "10px",
              }}
            >
              <FilterSelector
                dateBoundary={this.state.dateBoundary}
                setDateBoundary={this.setDateBoundary.bind(this)}
                boundaryMap={{
                  today: "Today",
                  "7": "Last 7 Days",
                  "14": "Last 14 Days",
                  "30": "Last 30 Days",
                  "90": "Last 90 Days",
                  "this week": "This Week",
                  "this month": "This Month",
                  "this quarter": "This Quarter",
                  "this year": "This Year",
                  "all time": "All Time",
                }}
                isCompanyAnalytics
              />
            </div>
            <StatContainer>
              <StatContainerDouble>
                <StatCell
                  value={open_positions?.current_time_period}
                  metric={"New Jobs"}
                  increase={open_positions?.percentage_position_change}
                />
                <StatCell
                  value={total_candidates?.current_time_period}
                  metric={"Total Candidates"}
                  increase={total_candidates?.percantage_candidate_change}
                />
              </StatContainerDouble>
              <StatContainerDouble>
                <StatCell
                  value={average_time_to_fill?.current_time_period}
                  metric={"Average Time to Fill"}
                  increase={
                    average_time_to_fill?.percentage_time_to_fill_change
                  }
                />
                <StatCell
                  value={average_time_to_hire?.current_time_period}
                  metric={"Average Time to Hire"}
                  increase={
                    average_time_to_hire?.percantage_time_to_hire_change
                  }
                />
              </StatContainerDouble>
              <StatContainerDouble>
                {this.state.professionalsAtStage && (
                  <StatCell
                    value={
                      this.state.professionalsAtStage
                        ?.current_professionals_at_stage
                    }
                    metric={"Professionals At Stage"}
                    increase={
                      this.state.professionalsAtStage?.percentage_difference
                    }
                  >
                    <StageSelector
                      styles={sharedStyles}
                      stage={this.state.selectedStage}
                      selectStage={this.selectStage.bind(this)}
                    />
                  </StatCell>
                )}
                {this.state.averageApplicants && (
                  <StatCell
                    value={
                      this.state.averageApplicants
                        ? this.state.averageApplicants?.current_average_applicants.toFixed(
                            2
                          )
                        : 0
                    }
                    metric={"Average Applicants (Per Job)"}
                    increase={this.state.averageApplicants?.percentage_average_applicants_change.toFixed(
                      2
                    )}
                    col="3"
                  />
                )}
              </StatContainerDouble>
              <StatContainerSingle>
                {this.props.company.type === "Agency" ? (
                  <div className={analyticsStyles.statsSpend}>
                    <div>
                      <h3>
                        {this.props.company.currency?.currency_name}
                        {total_agency_spend?.toLocaleString("en")}
                      </h3>
                      <h5>Total Client Income</h5>
                    </div>
                  </div>
                ) : (
                  <div className={analyticsStyles.statsSpend}>
                    <div>
                      <h3>
                        {this.props.company.currency?.currency_name}
                        {total_agency_spend?.toLocaleString("en")}
                      </h3>
                      <h5>Total Agency Spend</h5>
                    </div>
                  </div>
                )}
              </StatContainerSingle>
              <StatContainerSingle>
                <Doughnut
                  data={this.state.companyAnalytics.source_mix}
                  sourceDisplay={this.state.sourceDisplay}
                  setSourceDisplay={this.setSourceDisplay.bind(this)}
                  toolTip={this.toolTip}
                />
              </StatContainerSingle>
              <StatContainerSingle>
                <Bar barData={this.state.companyAnalytics.average_conversion} />
              </StatContainerSingle>
            </StatContainer>
          </ATSContainer>
        </>
      );
    } else return null;
  }
}
