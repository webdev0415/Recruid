import React, { useEffect } from "react";
import { ATSContainer } from "styles/PageContainers";
import { ReactTitle } from "react-meta-tags";
import { InnerPageContainer } from "styles/PageContainers";
import ManageTeam from "components/ViewJobs/JobDashboard/Components/ManageTeam";
import {
  inviteTeamMember,
  removeJob,
} from "components/ViewJobs/JobDashboard/helpers";
import styled from "styled-components";

const TempJobDashboardTeam = ({
  jobData,
  store,
  jobId,

  setJobData,
}) => {
  useEffect(() => {
    document.body.style.background = "white";
    return () => (document.body.style.background = "#eee");
  }, []);

  const inviteMemberToJob = (id) => {
    let index;
    store.teamMembers.map((member, ix) => {
      if (id === member.team_member_id) {
        index = ix;
      }
      return {};
    });
    inviteTeamMember(
      { team_member_ids: [store.teamMembers[index].team_member_id] },
      jobId,
      store.company.id,
      store.session
    ).then((response) => {
      if (response !== "err") {
        setJobData({
          ...jobData,
          assigned_team_member_ids: [...jobData.assigned_team_member_ids, id],
        });
      }
    });
  };

  const removeMemberFromJob = (id) => {
    let index;
    store.teamMembers.map((member, ix) => {
      if (id === member.team_member_id) {
        index = ix;
      }
      return {};
    });
    removeJob(
      store.company.id,
      jobId,
      store.teamMembers[index].team_member_id,
      store.session
    ).then((response) => {
      if (response !== "err") {
        let assignedIndex = jobData.assigned_team_member_ids.indexOf(id);
        let arr = [...jobData.assigned_team_member_ids];
        arr.splice(assignedIndex, 1);
        setJobData({
          ...jobData,
          assigned_team_member_ids: arr,
        });
      }
    });
  };

  return (
    <>
      <InnerPageContainer background="white">
        {store.company && (
          <>
            <ReactTitle title={`${jobData ? jobData.title : ""} | Leo`} />
          </>
        )}
        <ATSContainer>
          <TeamContainer>
            <ManageTeam
              company={store.company}
              job={jobData}
              inviteToJob={inviteMemberToJob}
              removeFromJob={removeMemberFromJob}
              session={store.session}
              companyType={store.company?.type}
              jobOwner={jobData.company.id}
              assigned_team_member_ids={jobData.assigned_team_member_ids}
            />
          </TeamContainer>
        </ATSContainer>
      </InnerPageContainer>
    </>
  );
};

const TeamContainer = styled.div`
  max-width: 500px;
`;

export default TempJobDashboardTeam;
