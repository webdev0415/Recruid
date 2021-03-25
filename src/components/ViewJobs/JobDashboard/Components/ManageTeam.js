import React, { useEffect, useState, useContext } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import GlobalContext from "contexts/globalContext/GlobalContext";
import styled from "styled-components";

import AvatarIcon from "sharedComponents/AvatarIcon";
import { ManageTeamTitle } from "./JobDashboardComponents";

import { device } from "helpers/device";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { PermissionChecker } from "constants/permissionHelpers";
import { ATSContainer } from "styles/PageContainers";
import TabsMenu from "sharedComponents/TabsMenu/TabsMenu";
import { AWS_CDN_URL } from "constants/api";

const ManageTeam = ({
  inviteToJob,
  removeFromJob,

  job,

  vendors,
  canRemove,
  assigned_team_member_ids,
}) => {
  const store = useContext(GlobalContext);
  const [jobOwnerObj, setJobOwnerObj] = useState(undefined);
  const [recruiters, setRecruiters] = useState(undefined);
  const [hiringManagers, setHiringManagers] = useState(undefined);
  const [activeTab, setActiveTab] = useState("recruiter");
  const [searchValue, setSearchValue] = useState("");
  const [totals, setTotals] = useState({
    hiring_managers: 0,
    recruiters: 0,
  });
  const [team, setTeam] = useState([]);

  useEffect(() => {
    if (team && job) {
      team.map((member) =>
        member.professional_id === job.posted_by_id
          ? setJobOwnerObj(member)
          : null
      );
    }
  }, [job, team]);

  useEffect(() => {
    if (team && team.length > 0) {
      let rc;
      let hm;
      rc = team.filter(
        (member) =>
          member.roles.includes("recruiter") &&
          (member.name?.toLowerCase().includes(searchValue) ||
            member.email?.toLowerCase().includes(searchValue))
      );
      rc = rc.sort((member) =>
        assigned_team_member_ids?.indexOf(member.team_member_id) === -1 ? 1 : -1
      );

      hm = team.filter(
        (member) =>
          member.roles.includes("hiring_manager") &&
          !member.roles.includes("recruiter") &&
          (member.name?.toLowerCase().includes(searchValue) ||
            member.email?.toLowerCase().includes(searchValue))
      );
      hm = hm.sort((member) =>
        assigned_team_member_ids?.indexOf(member.team_member_id) === -1 ? 1 : -1
      );
      setRecruiters(rc);
      setHiringManagers(hm);
      if (searchValue === "") {
        setTotals({
          hiring_managers: hm.length,
          recruiters: rc.length,
        });
      }
    }
  }, [team, searchValue, assigned_team_member_ids]);

  useEffect(() => {
    if (store.teamMembers && store.role) {
      let tm;
      if (
        store.role.role_permissions.owner ||
        store.role.role_permissions.admin ||
        store.role.role_permissions.recruiter
      ) {
        tm = [...store.teamMembers];
      } else if (store.role.role_permissions.hiring_manager) {
        tm = store.teamMembers.filter(
          (memb) =>
            (memb.permission =
              "owner" ||
              memb.permission === "admin" ||
              memb.roles.includes("hiring_manager"))
        );
      } else {
        tm = [];
      }
      setTeam(tm);
    }
  }, [store.teamMembers, store.role]);

  useEffect(() => {
    if (totals.recruiters === 0 && totals.hiring_manager > 0) {
      setActiveTab("hm");
    }
  }, [totals]);

  const displayMembers = () => {
    let filteredTeam = [
      ...(activeTab === "recruiter" && recruiters
        ? recruiters
        : hiringManagers
        ? hiringManagers
        : []),
    ];
    filteredTeam = filteredTeam.map((member, index) => (
      <TeamCell
        member={member}
        index={index}
        key={`teammember_${index}`}
        inviteToJob={() => inviteToJob(member.team_member_id)}
        removeFromJob={() => removeFromJob(member.team_member_id)}
        store={store}
        canRemove={
          canRemove ||
          store.role.role_permissions.owner ||
          store.role.role_permissions.admin ||
          store.role.role_permissions.recruiter ||
          (store.role.role_permissions.manager &&
            store.role.team_member.assigned_members.indexOf(
              member.team_member_id
            ) !== -1)
        }
        assigned_team_member_ids={assigned_team_member_ids}
      />
    ));

    return filteredTeam;
  };

  return (
    <>
      {team && team.length > 0 && (
        <ManageTeamContainer
          className={sharedStyles.tableContainer}
          vendors={vendors ? true : false}
        >
          <ManageTeamHeader>
            <ManageTeamTitle>
              <h5>
                <PermissionChecker type="edit" valid={{ recruiter: true }}>
                  {"Manage "}
                </PermissionChecker>
                Team for this job
              </h5>
              {jobOwnerObj && (
                <OverlayTrigger
                  key={"top"}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-top`}>
                      <strong>{jobOwnerObj.name}</strong>
                    </Tooltip>
                  }
                >
                  <img src={`${AWS_CDN_URL}/icons/CrownSvg.svg`} alt="" />
                </OverlayTrigger>
              )}
            </ManageTeamTitle>

            <SubMenu>
              <ATSContainer>
                <FlexContainer>
                  {totals.recruiters > 0 && totals.hiring_managers > 0 && (
                    <TabsMenu
                      tabsArr={[
                        {
                          name: "recruiter",
                          title: "Recruiters",
                        },
                        {
                          name: "hm",
                          title: "Hiring Managers",
                        },
                      ]}
                      activeTab={activeTab}
                      type={"button"}
                      setActiveTab={setActiveTab}
                    />
                  )}
                  <Input
                    placeholder="Search member..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </FlexContainer>
              </ATSContainer>
            </SubMenu>
          </ManageTeamHeader>
          <ManageTeamBody className={vendors ? "vendors" : ""}>
            {team && team.length > 0 && displayMembers()}
          </ManageTeamBody>
        </ManageTeamContainer>
      )}
    </>
  );
};

export default ManageTeam;

function TeamCell({
  member,
  index,
  inviteToJob,
  removeFromJob,
  canRemove,
  assigned_team_member_ids,
}) {
  return (
    <div
      className="job-post-cell-item leo-flex-center-between"
      key={`member_${index}`}
      style={{ padding: "15px 20px" }}
    >
      <div className="job-post-cell-details leo-flex">
        <div
          style={{
            marginRight: "15px",
          }}
        >
          <AvatarIcon name={member.name} imgUrl={member.avatar} size={50} />
        </div>
        <div>
          <span className="cell-title">{member.name}</span>
          <span
            style={{
              color: "#74767B",
              textTransform: "capitalize",
            }}
          >
            {member.roles.includes("recruiter")
              ? "recruiter"
              : member.roles.includes("hiring_manager")
              ? "Hiring Manager"
              : ""}
          </span>
        </div>
      </div>
      {assigned_team_member_ids?.indexOf(member.team_member_id) !== -1 && (
        <div
          className="job-post-cell-options"
          style={canRemove ? { cursor: "pointer" } : {}}
        >
          <div onClick={() => (canRemove ? removeFromJob() : null)}>
            <img src={`${AWS_CDN_URL}/icons/SelectedMark.svg`} alt="" />
          </div>
        </div>
      )}
      {assigned_team_member_ids?.indexOf(member.team_member_id) === -1 && (
        <div className="job-post-cell-options" style={{ cursor: "pointer" }}>
          <div onClick={() => inviteToJob()}>
            <img src={`${AWS_CDN_URL}/icons/AddMark.svg`} alt="" />
          </div>
        </div>
      )}
    </div>
  );
}

const ManageTeamContainer = styled.div`
  grid-column: span 2;
  margin: 0 !important;
  position: relative;

  @media ${device.tablet} {
    grid-row-start: 1;
    grid-row-end: ${(props) => (props.vendors === true ? 3 : 4)};
    grid-column-start: 3;
    grid-column-end: 5;
    margin: 0;
    overflow: hidden;
  }
`;

const SubMenu = styled.div`
  border-bottom: 1px solid #eee;
  box-shadow: none !important;
  margin: 0 !important;
  overflow: hidden !important;
  padding-top: 15px;
  height: initial;

  .container {
    padding-left: 25px;
    padding-right: 25px;
  }

  .nav-link {
    padding-top: 0 !important;
  }
`;

const ManageTeamHeader = styled.div`
  position: relative;

  h5 {
    color: #9a9ca1;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.67px;
    text-transform: uppercase;
  }
`;

const ManageTeamBody = styled.div`
  max-height: 253px;
  overflow-y: auto;

  @media ${device.tablet} {
    max-height: 559px;

    &.vendors {
      max-height: 253px;
    }
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  align-items: flex-start;
`;

const Input = styled.input`
  border: none;
  font-size: 13px;
  padding: 5px 15px;
  background: #eee;
  border-radius: 5px;
  margin-bottom: 5px;
  max-width: 200px;
`;
