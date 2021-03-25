import React, { Component } from "react";
import styled from "styled-components";

import JobDashboardCandidates from "./Components/JobDashboardCandidates";
import LatestActivity from "./Components/LatestActivity";
import ManageAgencies from "./Components/ManageAgencies";
import CandidateJobNotes from "./Components/CandidateJobNotes";
import ManageTeam from "./Components/ManageTeam";
import StatCell from "sharedComponents/StatCell";
import PipelineView from "components/ViewJobs/components/PipelineView/PipelineView";

import { device } from "helpers/device";
import { ATSContainer } from "styles/PageContainers";

const JobDashboardContainer = styled.div`
  display: grid;
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 30px;

  @media ${device.tablet} {
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 20px;
    grid-row-gap: 20px;
  }
`;

const Activity = styled.div`
  grid-column: span 2;

  @media ${device.tablet} {
    // grid-column: span 4;
    grid-column: span 2;
  }
`;

export default class JobDashboardBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      job: props.job,
      candidates: props.candidates,
    };
  }
  render() {
    return (
      <ATSContainer>
        <div style={{ marginBottom: 20 }}>
          <PipelineView
            company={this.props.company}
            data={this.props.job}
            displayTable={true}
            type="candidates"
            interviewStages={this.props.interviewStages}
          />
        </div>
        <JobDashboardContainer>
          <StatCell
            metric="Vacancies"
            value={this.props.job.available_positions}
          />
          <StatCell metric="Hires" value={this.props.job.taken_positions} />
          <StatCell
            metric="Total Active Candidates"
            value={this.props.job.applicant_count}
          />
          {this.props.company.type === "Agency" ? (
            <StatCell
              metric="Total Submitted Candidates"
              value={
                this.props.company?.type === "Employer"
                  ? this.props.jobAnalytics?.total_applicants_count
                      ?.current_submitted_candidates
                  : this.props.jobAnalytics?.total_applicants_count
                      ?.submitted_by_agency
              }
            />
          ) : (
            <StatCell metric="Average time at stage (days)" value="-" />
          )}
          <ManageTeam
            company={this.props.company}
            job={this.props.jobData}
            inviteToJob={this.props.inviteMemberToJob}
            removeFromJob={this.props.removeMemberFromJob}
            session={this.props.session}
            companyType={this.props.companyType}
            jobOwner={this.props.job.job_owner_company_id}
            vendors={this.props.vendors ? true : false}
            assigned_team_member_ids={
              this.props.jobData.assigned_team_member_ids
            }
          />
          <JobDashboardCandidates
            companyId={this.props.company.id}
            jobId={this.state.job.id}
            session={this.props.session}
          />
          {this.props.vendors &&
            (this.props.role?.role_permissions.owner ||
              (this.props.role?.role_permissions.recruiter &&
                this.props.role?.role_permissions.admin)) && (
              <ManageAgencies
                vendors={this.props.vendors}
                inviteVendorToJob={this.props.inviteVendorToJob}
                removeVendorFromJob={this.props.removeVendorFromJob}
              />
            )}
          {this.props.timeline && this.props.timeline.length > 0 && (
            <Activity>
              <LatestActivity
                timeline={this.props.timeline}
                totalTimeline={this.props.totalTimeline}
                loadMoreActivities={this.props.loadMoreActivities}
              />
            </Activity>
          )}

          {this.props.candidateJobNotes && (
            <Activity>
              <CandidateJobNotes
                candidateJobNotes={this.props.candidateJobNotes}
              />
            </Activity>
          )}
        </JobDashboardContainer>
      </ATSContainer>
    );
  }
}

// function LatestCandidates({ candidates, job, company, companyType }) {
//   const Candidates = styled.div`
//     background: #fff;
//     border-radius: 4px !important;
//     margin-left: 0 !important;
//     margin-right: 0 !important;
//     margin-bottom: 30px;
//
//     @media (min-width: 768px) {
//       margin: 0;
//       height: ${props => props.size};
//       overflow-y: auto !important;
//     }
//   `;
//
//   const containerSize =
//     job.company.id === company.id && companyType !== "Agency"
//       ? "630px"
//       : "464px";
//
//   return (
//     <Candidates className={styles.container} size={containerSize}>
//       <table className="table table-borderless">
//         <thead>
//           <tr>
//             <th scope="col" className={sharedStyles.tableHeader}>
//               Latest Candidates
//             </th>
//             <th scope="col" className={sharedStyles.tableHeader}>
//               Status
//             </th>
//             <th scope="col" className={sharedStyles.tableStatus}>
//               Applied
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {candidates &&
//             candidates.map((candidate, id) => (
//               <tr key={`job_${id}`}>
//                 <th scope="row" className={sharedStyles.tableItemFirst}>
//                   {candidate.talent_name || candidate.name}
//                 </th>
//                 <td className={sharedStyles.tableItem}>
//                   {candidate.status}
//                 </td>
//                 <td className={sharedStyles.tableItem}>
//                   {candidate.date_added}
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </Candidates>
//   );
// }
//
// function NoCandidates({ openModal, job, company, companyType }) {
//   const Candidates = styled.div`
//     align-items: center;
//     background: #fff;
//     border-radius: 4px !important;
//     display: flex;
//     justify-content: center;
//     margin-left: 0 !important;
//     margin-right: 0 !important;
//     margin-bottom: 30px;
//
//     @media (min-width: 768px) {
//       margin: 0;
//       height: ${props => props.size};
//       overflow-y: auto !important;
//     }
//   `;
//
//   const containerSize =
//     job.company.id === company.id && companyType !== "Agency"
//       ? "630px"
//       : "464px";
//
//   return (
//     <Candidates className={styles.container} size={containerSize}>
//       <div className={sharedStyles.empty}>
//         <img src={emptyNetwork} alt="You haven't added any candidates yet" />
//         <h3>You haven't added any candidates yet</h3>
//         <button
//           style={{ marginTop: "10px", marginBottom: "40px" }}
//           className="button button--default button--blue-dark"
//           onClick={() => {
//             openModal("addCandidates");
//           }}
//         >
//           Add Candidates
//         </button>
//       </div>
//     </Candidates>
//   );
// }
