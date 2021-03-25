import React, { Component } from "react";
import { ReactTitle } from "react-meta-tags";
import sharedHelpers from "helpers/sharedHelpers";
import JobDashboardBody from "components/ViewJobs/JobDashboard/JobDashboardBody";
import { InnerPageContainer } from "styles/PageContainers";

import notify from "notifications";

import {
  jobTimeline,
  vendorIndex,
  inviteTeamMember,
  removeJob,
  addJobToVendor,
  removeJobFromVendor,
  fetchJobCandidateNotes,
} from "./helpers.js";
import { fetchInterviewStages } from "helpersV2/interviews";
import Spinner from "sharedComponents/Spinner";

class JobDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobId: undefined,
      job: undefined,
      team: undefined,
      timeline: undefined,
      totalTimeline: undefined,
      vendors: undefined,
      hasMorePages: true,
      filtered: false,
      initialPageLoad: true,
      clientStages: undefined,
      existingApplicants: undefined,
      candidateJobNotes: undefined,
    };
    this.jobTimeline = jobTimeline.bind(this);
    this.fetchJobCandidateNotes = fetchJobCandidateNotes.bind(this);
    this.vendorIndex = vendorIndex.bind(this);
    this.inviteTeamMember = inviteTeamMember.bind(this);
    this.removeJob = removeJob.bind(this);
    this.addJobToVendor = addJobToVendor.bind(this);
    this.removeJobFromVendor = removeJobFromVendor.bind(this);
    this.applicantData = sharedHelpers.applicantData.bind(this);
    this.fetchDataOnLoad = this.fetchDataOnLoad.bind(this);
    this.loadMoreActivities = this.loadMoreActivities.bind(this);
  }

  componentDidMount() {
    this.fetchDataOnLoad().then(() =>
      setTimeout(() => this.setState({ initialPageLoad: false }), 750)
    );
  }

  componentDidUpdate() {
    if (this.props.refreshCandidates) {
      this.getCandidates();
    }
  }

  fetchDataOnLoad = async () => {
    if (this.props.jobId && this.props.teamMember && this.props.jobData) {
      this.setState({
        jobId: this.props.jobId,
        job: this.props.jobData,
        initialPageLoad: false,
      });

      this.jobTimeline(
        this.props.jobId,
        this.props.session,
        1,
        this.props.company.id
      ).then((timeline) => {
        if (timeline !== "err") {
          this.setState({
            timeline: timeline.results,
            totalTimeline: timeline.total,
          });
        }
      });

      if (this.props.jobId && this.props.company.id) {
        fetchJobCandidateNotes(
          {
            job_id: Number(this.props.jobId),
            company_id: this.props.company.id,
          },
          this.props.session
        ).then((response) => {
          if (response !== "err") {
            this.setState({ candidateJobNotes: response });
          }
        });
      }

      if (this.props.company.type !== "Agency") {
        this.vendorIndex(this.props.company.id, this.props.session).then(
          (vendors) => {
            this.setState({
              vendors:
                vendors &&
                vendors.list &&
                vendors.list.map((vendor) => {
                  if (
                    vendor.agency_jobs.indexOf(Number(this.props.jobId)) !== -1
                  ) {
                    vendor.status = "Remove";
                  } else {
                    vendor.status = "Add";
                  }
                  return vendor;
                }),
            });
          }
        );
      } else if (this.props.company.id !== this.props.jobData.company.id) {
        fetchInterviewStages(
          this.props.session,
          this.props.jobData.company.id
        ).then((res) => {
          if (!res.err) {
            this.setState({ clientStages: res });
          } else {
            notify("danger", "Unable to fetch client stages");
          }
        });
      }

      this.setState({
        jobId: this.props.jobId,
        job: this.props.jobData,
      });
    }
  };

  loadMoreActivities = () => {
    let nextPage = this.state.timeline.length / 20 + 1;
    jobTimeline(
      this.props.jobId,
      this.props.session,
      nextPage,
      this.props.company.id
    ).then((timeline) => {
      if (timeline !== "err") {
        let newState = { ...this.state };
        newState.timeline = newState.timeline.concat(timeline.results);
        this.setState(newState);
      }
    });
  };

  getCandidates = (flag, data) => {
    return this.applicantData(
      this.props.jobId,
      this.props.session,
      this.props.company.id,
      1,
      this.props.teamMember.team_member_id
    ).then((candidates) => {
      if (candidates !== "err") {
        if (data)
          this.setState({
            [flag]: data,
          });
        // else this.props.setCandidates(candidates.search_results);
      }
    });
  };

  inviteMemberToJob = (id) => {
    let team = [...this.props.teamMembers];
    let index;
    team.map((member, ix) => {
      if (id === member.team_member_id) {
        index = ix;
      }
      return {};
    });
    inviteTeamMember(
      { team_member_ids: [team[index].team_member_id] },
      this.state.jobId,
      this.props.company.id,
      this.props.session
    ).then((response) => {
      if (response !== "err") {
        this.props.setJobData({
          ...this.props.jobData,
          assigned_team_member_ids: [
            ...this.props.jobData.assigned_team_member_ids,
            id,
          ],
        });
        this.getCandidates("team", team);
      }
    });
  };

  removeMemberFromJob = (id) => {
    let team = [...this.props.teamMembers];
    let index;
    team.map((member, ix) => {
      if (id === member.team_member_id) {
        index = ix;
      }
      return {};
    });
    removeJob(
      this.props.company.id,
      this.state.jobId,
      team[index].team_member_id,
      this.props.session
    ).then((response) => {
      if (response !== "err") {
        this.getCandidates("team", team);
        let assignedIndex = this.props.jobData.assigned_team_member_ids.indexOf(
          id
        );
        let arr = [...this.props.jobData.assigned_team_member_ids];
        arr.splice(assignedIndex, 1);
        this.props.setJobData({
          ...this.props.jobData,
          assigned_team_member_ids: arr,
        });
      }
    });
  };

  inviteVendorToJob = (index) => {
    addJobToVendor(
      this.props.company.id,
      this.state.vendors[index].id,
      this.state.jobId,
      this.props.session
    ).then((response) => {
      if (response !== "err") {
        let vendors = this.state.vendors;
        vendors[index] = {
          ...vendors[index],
          agency_jobs: response.agency_jobs,
        };
        vendors = vendors.map((vendor) => {
          if (vendor.agency_jobs.indexOf(Number(this.state.jobId)) !== -1) {
            vendor.status = "Remove";
          } else {
            vendor.status = "Add";
          }
          return vendor;
        });
        this.getCandidates("vendors", vendors);
      }
    });
  };

  removeVendorFromJob = (index) => {
    const vendors = this.state.vendors;
    removeJobFromVendor(
      this.props.company.id,
      vendors[index].id,
      this.state.jobId,
      this.props.session
    ).then((response) => {
      if (response !== "err") {
        let vendors = this.state.vendors;
        vendors[index] = {
          ...vendors[index],
          agency_jobs: response.agency_jobs,
        };
        vendors = vendors.map((vendor) => {
          if (vendor.agency_jobs.indexOf(Number(this.state.jobId)) !== -1) {
            vendor.status = "Remove";
          } else {
            vendor.status = "Add";
          }
          return vendor;
        });
        this.getCandidates("vendors", vendors);
      }
    });
  };

  updateJob = () =>
    setTimeout(() => {
      this.props.updateJobData(
        this.state.jobId,
        this.props.session,
        this.props.company.id
      );
    }, 750);

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
        {this.state.initialPageLoad ? (
          <Spinner style={{ marginTop: "100px" }} />
        ) : this.state.job ? (
          <React.Fragment>
            <JobDashboardBody
              company={this.props.company}
              role={this.props.role}
              job={this.state.job}
              jobData={this.props.jobData}
              team={this.state.team}
              timeline={this.state.timeline}
              totalTimeline={this.state.totalTimeline}
              vendors={this.state.vendors}
              candidateJobNotes={this.state.candidateJobNotes}
              inviteMemberToJob={this.inviteMemberToJob}
              removeMemberFromJob={this.removeMemberFromJob}
              inviteVendorToJob={this.inviteVendorToJob}
              removeVendorFromJob={this.removeVendorFromJob}
              openModal={this.props.setActiveModal}
              session={this.props.session}
              companyType={this.props.company.type}
              loadMoreActivities={this.loadMoreActivities}
              jobAnalytics={this.props.jobAnalytics}
              interviewStages={
                this.state.clientStages || this.props.interviewStages
              }
            />
          </React.Fragment>
        ) : null}
      </InnerPageContainer>
    );
  }
}

export default JobDashboard;
