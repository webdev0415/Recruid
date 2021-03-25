import React, { Component, Suspense } from "react";

import FilterSelector from "../FilterSelector";
import RecruitdSelect from "sharedComponents/RecruitdSelect";
import {
  StatContainer,
  StatContainerSingle,
  StatContainerDouble,
} from "../shared/components";

import analyticsStyles from "assets/stylesheets/scss/collated/analytics.module.scss";
import emptyStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import retryLazy from "hooks/retryLazy";

import { jobAnalytics, professionalsAtStagePerJob } from "../helpers";
import Spinner from "sharedComponents/Spinner";

import {
  receivedReviews,
  recruiterAnalytics,
  hmAnalytics,
  agencyAnalytics,
} from "./helpers";
import { vendorIndex } from "components/Vendors/helpers/vendorsHelpers";
import StatCell from "sharedComponents/StatCell";

import Doughnut from "../shared/Doughnut";
import Bar from "../shared/Bar";

import { AWS_CDN_URL } from "constants/api";
import { ROUTES } from "routes";
import { ATSContainer } from "styles/PageContainers";

const ViewProfilesListsModal = React.lazy(() =>
  retryLazy(() => import("modals/ViewProfilesListsModal"))
);

export default class RoleStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: undefined,
      selectedRole: "Recruiter",
      selectedTeamMember: undefined,
      selectedStagePerJob: "Applied",
      dateBoundary: "this month",
      sourceDisplay: "%",
      analytics: undefined,
      vendors: undefined,
      modal: undefined,
      activeInfo: undefined,
      loading: false,
    };
    this.professionalsAtStagePerJob = professionalsAtStagePerJob.bind(this);
    this.jobAnalytics = jobAnalytics.bind(this);
    this.receivedReviews = receivedReviews.bind(this);
    this.recruiterAnalytics = recruiterAnalytics.bind(this);
    this.hmAnalytics = hmAnalytics.bind(this);
    this.agencyAnalytics = agencyAnalytics.bind(this);
    this.vendorIndex = vendorIndex.bind(this);
  }

  componentDidMount() {
    let t = this.props.teamMembers?.filter(
      (member) =>
        member.permission !== "owner" && member.roles.includes("recruiter")
    );
    if (this.props.role?.role_permissions.manager) {
      t = t.filter(
        (member) =>
          this.props.role.team_member.assigned_members.indexOf(
            member.team_member_id
          ) !== -1 ||
          member.team_member_id === this.props.role.team_member.team_member_id
      );
    }
    if (t && t?.length > 0) {
      this.setState({
        team: t,
        selectedTeamMember: {
          label: t[0].name,
          value: 0,
          pro_id: t[0].professional_id,
        },
      });
      this.receivedReviews("professionals", t[0].professional_id).then(
        (reviews) => {
          if (reviews !== "err") {
            this.setState({ memberReview: reviews[0] });
          }
        }
      );
      this.recruiterAnalytics(
        this.props.company.id,
        t[0].professional_id,
        "this month"
      ).then((analytics) => {
        this.setState({ analytics });
      });
    } else {
      this.setState({ team: [], analytics: {} });
    }

    // TEMPORARY FIX --> CODE BELOW SET OWNER AS SELECTED TM.

    // if (this.props.teamMembers.length) {
    //   let defaultMember = {};
    //   defaultMember = {
    //     label: this.props.teamMembers[0] && this.props.teamMembers[0].name,
    //     pro_id:
    //       this.props.teamMembers[0] &&
    //       this.props.teamMembers[0].professional_id,
    //     value: 0
    //   };
    //   this.changeTeamMember(defaultMember);
    // }
  }

  setDateBoundary(option) {
    this.setState({ dateBoundary: option });
    if (this.state.team.length > 0) {
      this.setState({ loading: true });
      // call for newly scoped analytics data
      if (this.state.selectedRole === "Recruiter") {
        this.recruiterAnalytics(
          this.props.company.id,
          this.state.selectedTeamMember.pro_id,
          option
        )
          .then((analytics) => {
            this.setState({ analytics });
          })
          .finally(() => this.setState({ loading: false }));
      } else if (this.state.selectedRole === "Hiring Manager") {
        this.hmAnalytics(
          this.props.company.id,
          this.state.selectedTeamMember.pro_id,
          option
        )
          .then((analytics) => {
            this.setState({ analytics });
          })
          .finally(() => this.setState({ loading: false }));
      }
    }
  }

  changeTeamMember(member) {
    this.setState({ loading: true });
    if (this.state.selectedRole === "Recruiter") {
      this.recruiterAnalytics(
        this.props.company.id,
        member.pro_id,
        this.state.dateBoundary
      )
        .then((analytics) => {
          this.setState({
            selectedTeamMember: member,
            analytics,
          });
        })
        .finally(() => this.setState({ loading: false }));
    } else {
      this.hmAnalytics(
        this.props.company.id,
        member.pro_id,
        this.state.dateBoundary
      )
        .then((analytics) => {
          this.setState({
            selectedTeamMember: member,
            analytics,
          });
        })
        .finally(() => this.setState({ loading: false }));
    }
  }

  setSourceDisplay(option) {
    this.setState({ sourceDisplay: option });
  }

  memberOptions() {
    return this.state.team.map((member, ix) => {
      return {
        label: member.name,
        value: ix,
        pro_id: member.professional_id,
      };
    });
  }

  render() {
    if (this.state.team && this.state.analytics) {
      const {
        average_time_to_fill,
        total_number_submissions,
        average_time_to_hire,
        total_interviews_conducted,
        total_jobs_hiring_for,
        number_of_placements,
        total_income_earned,
        interviews_scheduled,
      } = this.state.analytics;

      return (
        <>
          {this.state.team.length > 0 ? (
            <ATSContainer>
              <div
                className="leo-flex"
                style={{
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div className="leo-flex">
                  <RecruitdSelect
                    options={this.memberOptions()}
                    placeholder={this.state.selectedTeamMember.label}
                    onSelect={(option) => this.changeTeamMember(option)}
                    showSelection
                    className="leo-flex"
                    style={{
                      alignItems: "center",
                      background: "transparent",
                      cursor: "pointer",
                      justifyContent: "space-between",
                      marginBottom: "5px",
                      minWidth: "100px",
                      padding: "0",
                    }}
                  />
                </div>
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
                  }}
                />
              </div>
              {this.state.loading && <Spinner />}
              {!this.state.loading && (
                <StatContainer>
                  <StatContainerDouble>
                    {this.state.selectedRole === "Recruiter" && (
                      <StatCell
                        value={
                          average_time_to_fill
                            ? average_time_to_fill.current_time_period
                            : 0
                        }
                        metric={"Average Time To Fill"}
                        col="6"
                        increase={
                          average_time_to_fill
                            ? average_time_to_fill.percentage_change
                            : 0
                        }
                      />
                    )}
                    {this.state.selectedRole === "Recruiter" && (
                      <StatCell
                        value={
                          average_time_to_hire
                            ? average_time_to_hire.current_time_period
                            : 0
                        }
                        metric={"Average Time To Hire"}
                        col="6"
                        increase={
                          average_time_to_hire
                            ? average_time_to_hire.percentage_change
                            : 0
                        }
                      />
                    )}
                    {this.state.selectedRole === "Hiring Manager" && (
                      <StatCell
                        value={
                          total_interviews_conducted
                            ? total_interviews_conducted.current_time_period
                            : 0
                        }
                        metric={"Total Interviews Conducted"}
                        col="6"
                        increase={
                          total_interviews_conducted
                            ? total_interviews_conducted.percentage_change
                            : 0
                        }
                      />
                    )}
                    {this.state.selectedRole === "Hiring Manager" && (
                      <StatCell
                        value={
                          total_interviews_conducted
                            ? total_interviews_conducted.current_time_period
                            : 0
                        }
                        metric={"Total Interviews Conducted"}
                        col="6"
                        increase={
                          total_interviews_conducted
                            ? total_interviews_conducted.percentage_change
                            : 0
                        }
                      />
                    )}
                  </StatContainerDouble>

                  <StatContainerDouble>
                    {this.state.selectedRole === "Recruiter" && (
                      <StatCell
                        value={
                          total_number_submissions
                            ? total_number_submissions.current_time_period
                            : 0
                        }
                        metric={"Total Number Of Submissions"}
                        increase={
                          total_number_submissions
                            ? total_number_submissions.percentage_change
                            : 0
                        }
                      />
                    )}
                    {this.state.selectedRole === "Recruiter" && (
                      <StatCell
                        value={
                          total_jobs_hiring_for
                            ? total_jobs_hiring_for.current_time_period
                            : 0
                        }
                        metric={"Total number of active jobs"}
                        increase={
                          total_jobs_hiring_for
                            ? total_jobs_hiring_for.percentage_change
                            : 0
                        }
                      />
                    )}
                  </StatContainerDouble>
                  <StatContainerDouble>
                    {this.state.selectedRole === "Recruiter" && (
                      <StatCell
                        value={
                          interviews_scheduled
                            ? interviews_scheduled.current_time_period
                            : 0
                        }
                        metric={"Interviews Scheduled"}
                        increase={
                          interviews_scheduled
                            ? interviews_scheduled.percentage_change
                            : 0
                        }
                        onClick={() =>
                          this.setState({
                            activeInfo: [
                              "interview_objects",
                              interviews_scheduled.interview_objects,
                            ],
                            modal: "view-profiles",
                          })
                        }
                      />
                    )}
                    {this.state.selectedRole === "Recruiter" && (
                      <StatCell
                        value={
                          number_of_placements
                            ? number_of_placements.current_time_period
                            : 0
                        }
                        metric={"Total number of placements"}
                        increase={
                          number_of_placements
                            ? number_of_placements.percentage_change
                            : 0
                        }
                      />
                    )}
                  </StatContainerDouble>
                  <StatContainerSingle>
                    <div className={analyticsStyles.statsSpend}>
                      <div>
                        <h3>
                          {this.props.company.currency?.currency_name}
                          {total_income_earned?.current_time_period.toLocaleString(
                            "en"
                          )}
                        </h3>
                        <h5>Total Income</h5>
                      </div>
                    </div>
                  </StatContainerSingle>
                  <StatContainerSingle>
                    <Bar
                      barData={
                        this.state.analytics.average_conversion_rate_at_stage
                      }
                    />
                  </StatContainerSingle>
                  <StatContainerSingle>
                    {this.state.selectedRole === "Recruiter" && (
                      <Doughnut
                        data={this.state.analytics.rec_source_mix}
                        sourceDisplay={this.state.sourceDisplay}
                        setSourceDisplay={this.setSourceDisplay.bind(this)}
                      />
                    )}
                  </StatContainerSingle>
                </StatContainer>
              )}
            </ATSContainer>
          ) : this.state.team.length === 0 ? (
            <div className={emptyStyles.emptyContainer}>
              <div className={emptyStyles.empty}>
                <img src={`${AWS_CDN_URL}/icons/empty-icons/empty-team.svg`} alt="You currently have no team members" />
                <h2>Invite a team member</h2>
                <p>
                  Make the most of Leo by hiring with your team and clients.
                  Share candidate comments and feedback.
                </p>
                <button
                  className="button button--default button--blue-dark"
                  onClick={() => {
                    window.open(
                      ROUTES.TeamView.url(
                        this.props.company.mention_tag,
                        "team"
                      ),
                      "_self"
                    );
                  }}
                >
                  Invite Team Member
                </button>
              </div>
            </div>
          ) : (
            <Spinner />
          )}
          {this.state.modal === "view-profiles" && this.state.activeInfo && (
            <Suspense fallback={<div />}>
              <ViewProfilesListsModal
                source={sourceExchanger[this.state.activeInfo[0]]}
                elasticIds={[]}
                interviews={this.state.activeInfo[1]}
                title={performanceNames[this.state.activeInfo[0]]}
                hide={() => {
                  this.setState({
                    modal: undefined,
                    activeInfo: undefined,
                  });
                }}
                store={this.props.store}
              />
            </Suspense>
          )}
        </>
      );
    } else return <Spinner />;
  }
}

const sourceExchanger = {
  interview_objects: "interviews",
};

const performanceNames = {
  interview_objects: "Interviews",
};
