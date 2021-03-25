import React from "react";
import ManageTeam from "components/ViewJobs/JobDashboard/Components/ManageTeam";
import { ATSContainer } from "styles/PageContainers";
import styled from "styled-components";
import {
  inviteTeamMember,
  removeJob,
} from "components/ViewJobs/JobDashboard/helpers";

const TeamTab = ({
  store,
  job,
  jobId,
  assigned_team_member_ids,
  setAssignedTeamMemberIds,
  editingJob,
}) => {
  const inviteMemberToJob = (id) => {
    inviteTeamMember(
      { team_member_ids: [id] },
      jobId,
      store.company.id,
      store.session
    ).then((response) => {
      if (response !== "err") {
        setAssignedTeamMemberIds([...assigned_team_member_ids, id]);
      }
    });
  };

  const removeMemberFromJob = (id) => {
    removeJob(store.company.id, jobId, id, store.session).then((response) => {
      if (response !== "err") {
        let assignedIndex = assigned_team_member_ids.indexOf(id);
        let newAssigned = [...assigned_team_member_ids];
        newAssigned.splice(assignedIndex, 1);
        setAssignedTeamMemberIds(newAssigned);
      }
    });
  };

  return (
    <ATSContainer>
      <Container>
        <ManageTeam
          company={store.company}
          job={job}
          inviteToJob={inviteMemberToJob}
          removeFromJob={removeMemberFromJob}
          session={store.session}
          companyType={store.company?.type}
          jobOwner={job.selected_vendor || store.company.id}
          canRemove={editingJob ? false : true}
          assigned_team_member_ids={assigned_team_member_ids}
        />
      </Container>
    </ATSContainer>
  );
};

export default TeamTab;

const Container = styled.div`
  max-width: 500px;
`;
