import React, { useState, useContext, Suspense, useEffect } from "react";
import styled from "styled-components";
// import moment from "moment";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { getTeamMembers } from "contexts/globalContext/GlobalMethods";
import AvatarIcon from "sharedComponents/AvatarIcon";
import { API_ROOT_PATH } from "constants/api";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  ExtensionMenu,
  ExtensionMenuOption,
} from "sharedComponents/ExtensionMenu";

import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import styles from "./teamMemberTable.module.scss";
import { removeTeamMember } from "helpersV2/teamMembers";
import notify from "notifications";
import Spinner from "sharedComponents/Spinner";
import {
  permissionExchanger,
  rolesExchanger,
} from "constants/permissionHelpers";
import retryLazy from "hooks/retryLazy";
import { AWS_CDN_URL } from "constants/api";
const AssignVendorModal = React.lazy(() =>
  retryLazy(() =>
    import("components/TeamView/TeamMemberTable/assignVendorModal.js")
  )
);
const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);
const ChangePermissionModal = React.lazy(() =>
  retryLazy(() => import("modals/ChangePermissionModal"))
);
const AssignTeamMembersModal = React.lazy(() =>
  retryLazy(() => import("modals/AssignTeamMembersModal.js"))
);

export default function TeamMemberTable(props) {
  const store = useContext(GlobalContext);
  const [currentMember, setCurrentMember] = useState(undefined);
  const [viewModal, setViewModal] = useState(undefined);
  const [sortedMembers, setSortedMembers] = useState([]);
  const [clients, setClients] = useState(undefined);

  useEffect(() => {
    let members = [...store.teamMembers];
    if (props.searchValue !== "") {
      members = members.filter((member) =>
        member.name.toLowerCase().includes(props.searchValue.toLowerCase())
      );
    }
    setSortedMembers(members.sort(sortMembers));
  }, [store.teamMembers, props.searchValue]);

  const closeVendorModal = () => {
    setCurrentMember(undefined);
    setViewModal("noModal");
  };

  const updateTeamMember = () => {
    getTeamMembers(store.dispatch, store.session, store.company.id);
  };

  const closeModal = () => {
    setCurrentMember(undefined);
    setViewModal(undefined);
  };

  const cancelModal = (teamMember) => {
    setCurrentMember(teamMember);
    setViewModal("CancelModal");
  };

  const handleMemberRemove = async () => {
    const tmResponse = await removeTeamMember(
      store.company.id,
      store.session,
      currentMember.team_member_id
    );
    if (!tmResponse.error) {
      notify("info", tmResponse.message);
      await getTeamMembers(store.dispatch, store.session, store.company.id);
      return closeModal("CancelModal");
    }
    notify("info", tmResponse.message);
    return closeModal("CancelModal");
  };

  useEffect(() => {
    const fetchVendors = async () => {
      const url = API_ROOT_PATH + `/v1/clients/${store.company.id}/index`;
      try {
        const getData = await fetch(url, {
          method: `GET`,
          headers: store.session,
        });
        const data = await getData.json();
        return data;
      } catch (err) {
        console.error(`Error getting the list of vendors: ${err}`);
      }
    };

    fetchVendors().then((vendors) => {
      if (vendors && !vendors.message && vendors.list) {
        setClients([...vendors.list]);
      }
    });
  }, [store.company, store.session]);

  return (
    <div className={styles.container}>
      <div className="table-responsive">
        {!store.teamMembers ? (
          <Spinner />
        ) : (
          <table className="table table-borderless">
            <thead>
              <tr>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Name
                </th>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Role
                </th>
                {/*<th scope="col" className={sharedStyles.tableHeader}>
                  Last Signed In
                </th>*/}
                <th scope="col" className={sharedStyles.tableHeader} />
              </tr>
            </thead>
            <tbody>
              {sortedMembers &&
                sortedMembers.map((member, index) => {
                  return (
                    <tr key={`applicant_${index}`}>
                      <td className={sharedStyles.tableItemFirst}>
                        <TeamMemberCol>
                          <TeamMemberAvatar>
                            <AvatarIcon
                              name={member.name}
                              imgUrl={member.avatar}
                              size={30}
                            />
                          </TeamMemberAvatar>
                          <TeamMemberDetails>
                            <TeamMemberName>
                              <p>{member.name}</p>
                              {!member.last_sign_in && (
                                <TeamMemberInviteLabel>
                                  Invite Pending
                                </TeamMemberInviteLabel>
                              )}
                              {member.client_layer_name &&
                                member.roles?.includes("hiring_manager") && (
                                  <ClientLabel>
                                    {member.client_layer_name}
                                  </ClientLabel>
                                )}
                            </TeamMemberName>
                            {member.email && (
                              <TeamMemberEmail>{member.email}</TeamMemberEmail>
                            )}
                          </TeamMemberDetails>
                        </TeamMemberCol>
                      </td>
                      <td
                        className={sharedStyles.tableItem}
                        style={{ fontSize: "14px" }}
                      >
                        <FlexCont>
                          <RoleSpan>
                            {permissionExchanger[store.company.id]
                              ? permissionExchanger[store.company.id][
                                  member.permission
                                ]
                              : permissionExchanger.default[member.permission]}
                            {member.master_owner && (
                              <OverlayTrigger
                                key={"top"}
                                placement={"top"}
                                overlay={
                                  <Tooltip id={`tooltip-top`}>
                                    <strong>Master Owner</strong>
                                  </Tooltip>
                                }
                              >
                                <div
                                  style={{
                                    marginLeft: "10px",
                                    display: "inline",
                                  }}
                                >
                                  <img
                                    src={`${AWS_CDN_URL}/icons/CrownSvg.svg`}
                                    alt="Crown"
                                  />
                                </div>
                              </OverlayTrigger>
                            )}
                          </RoleSpan>

                          {member.roles?.includes("recruiter") && (
                            <Tag>
                              {rolesExchanger[store.company.id]
                                ? rolesExchanger[store.company.id].recruiter
                                : rolesExchanger.default.recruiter}
                            </Tag>
                          )}
                          {member.roles?.includes("hiring_manager") && (
                            <Tag>
                              {rolesExchanger[store.company.id]
                                ? rolesExchanger[store.company.id]
                                    .hiring_manager
                                : rolesExchanger.default.hiring_manager}
                            </Tag>
                          )}
                          {member.roles?.includes("business") && (
                            <Tag>
                              {rolesExchanger[store.company.id]
                                ? rolesExchanger[store.company.id].business
                                : rolesExchanger.default.business}
                            </Tag>
                          )}
                          {member.roles?.includes("marketer") && (
                            <Tag>
                              {rolesExchanger[store.company.id]
                                ? rolesExchanger[store.company.id].marketer
                                : rolesExchanger.default.marketer}
                            </Tag>
                          )}
                        </FlexCont>
                      </td>
                      <td
                        className={sharedStyles.tableItem}
                        style={{ width: "100px" }}
                      >
                        {((store.role?.role_permissions?.owner &&
                          (store.role?.role_permissions?.master_owner ||
                            member.permission !== "owner")) ||
                          (store.role?.role_permissions?.admin &&
                            (member.permission === "member" ||
                              member.permission === "manager")) ||
                          (store.role?.role_permissions?.manager &&
                            (member.permission === "member" ||
                              member.permission === "manager"))) && (
                          <ExtensionMenu name="Edit">
                            {((store.role?.role_permissions?.owner &&
                              (store.role?.role_permissions?.master_owner ||
                                member.permission !== "owner")) ||
                              (store.role?.role_permissions?.admin &&
                                (member.permission === "member" ||
                                  member.permission === "manager")) ||
                              (store.role?.role_permissions?.manager &&
                                member.permission === "member")) && (
                              <ExtensionMenuOption
                                onClick={() => {
                                  setViewModal("change-permission");
                                  setCurrentMember(member);
                                }}
                              >
                                Change Permissions
                              </ExtensionMenuOption>
                            )}
                            {(store.role.role_permissions.admin ||
                              store.role.role_permissions.owner) &&
                              member.permission === "manager" && (
                                <ExtensionMenuOption
                                  onClick={() => {
                                    setViewModal("assign-members");
                                    setCurrentMember(member);
                                  }}
                                >
                                  Assign Team Members
                                </ExtensionMenuOption>
                              )}
                            {store.role.role_permissions.manager &&
                              member.permission === "manager" && (
                                <ExtensionMenuOption
                                  onClick={() => {
                                    setViewModal("view-members");
                                    setCurrentMember(member);
                                  }}
                                >
                                  View Team Members
                                </ExtensionMenuOption>
                              )}
                            {(store.role.role_permissions.admin ||
                              store.role.role_permissions.owner) &&
                              member.roles.includes("hiring_manager") &&
                              clients &&
                              clients.length > 0 &&
                              store.company.type === "Agency" && (
                                <ExtensionMenuOption
                                  onClick={() => {
                                    setViewModal("vendorModal");
                                    setCurrentMember(member);
                                  }}
                                >
                                  Assign Client
                                </ExtensionMenuOption>
                              )}
                            {!member.master_owner &&
                              (store.role.role_permissions.admin ||
                                store.role.role_permissions.owner) && (
                                <ExtensionMenuOption
                                  divider
                                  red
                                  onClick={() => {
                                    cancelModal(member, "remove", index);
                                  }}
                                >
                                  Remove From Team
                                </ExtensionMenuOption>
                              )}
                          </ExtensionMenu>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
      {viewModal === "vendorModal" && currentMember && (
        <Suspense fallback={<div />}>
          <AssignVendorModal
            hiringManager={currentMember}
            closeModal={closeVendorModal}
            updateTeamMember={updateTeamMember}
            clients={clients}
          />
        </Suspense>
      )}
      {viewModal === "CancelModal" && (
        <Suspense fallback={<div />}>
          <ConfirmModalV2
            id="CancelModal"
            show={viewModal === "CancelModal"}
            hide={() => closeModal("CancelModal")}
            header="Remove Team Member"
            text="Are you sure you want to remove this team member? This action can not be undone"
            actionText="Remove"
            actionFunction={handleMemberRemove}
          />
        </Suspense>
      )}
      {viewModal === "change-permission" && currentMember && (
        <Suspense fallback={<div />}>
          <ChangePermissionModal
            hide={() => closeModal("CancelModal")}
            member={currentMember}
          />
        </Suspense>
      )}
      {viewModal === "assign-members" && currentMember && (
        <Suspense fallback={<div />}>
          <AssignTeamMembersModal
            hide={() => closeModal("CancelModal")}
            member={currentMember}
          />
        </Suspense>
      )}
      {viewModal === "view-members" && currentMember && (
        <Suspense fallback={<div />}>
          <AssignTeamMembersModal
            hide={() => closeModal("CancelModal")}
            member={currentMember}
            onlyView={true}
          />
        </Suspense>
      )}
    </div>
  );
}

const sortMembers = (firstMember, secondMember) => {
  if (firstMember.master_owner) {
    return -1;
  }
  if (
    firstMember.permission === "owner" &&
    secondMember.permission !== "owner"
  ) {
    return -1;
  } else if (
    firstMember.permission === "owner" &&
    secondMember.permission === "owner"
  ) {
    if (
      firstMember.roles.includes("recruiter") &&
      !secondMember.roles.includes("recruiter")
    ) {
      return -1;
    } else {
      return 0;
    }
  } else if (
    firstMember.permission === "admin" &&
    secondMember.permission === "member"
  ) {
    return -1;
  } else if (
    firstMember.permission === "admin" &&
    secondMember.permission === "manager"
  ) {
    return -1;
  } else if (
    firstMember.permission === "admin" &&
    secondMember.permission === "admin"
  ) {
    if (
      firstMember.roles.includes("recruiter") &&
      !secondMember.roles.includes("recruiter")
    ) {
      return -1;
    } else {
      return 0;
    }
  } else if (
    firstMember.permission === "manager" &&
    secondMember.permission === "member"
  ) {
    return -1;
  } else if (
    firstMember.permission === "manager" &&
    secondMember.permission === "manager"
  ) {
    if (
      firstMember.roles.includes("recruiter") &&
      !secondMember.roles.includes("recruiter")
    ) {
      return -1;
    } else {
      return 0;
    }
  } else if (
    firstMember.permission === "member" &&
    secondMember.permission === "member"
  ) {
    if (
      firstMember.roles.includes("recruiter") &&
      !secondMember.roles.includes("recruiter")
    ) {
      return -1;
    } else if (
      firstMember.roles.includes("recruiter") &&
      secondMember.roles.includes("recruiter")
    ) {
      return 0;
    } else if (
      !firstMember.roles.includes("recruiter") &&
      !secondMember.roles.includes("recruiter")
    ) {
      return 0;
    } else {
      return 1;
    }
  } else {
    return 1;
  }
};

const TeamMemberCol = styled.div`
  align-items: center;
  display: flex;
`;

const TeamMemberAvatar = styled.div`
  margin-right: 15px;
`;

const TeamMemberDetails = styled.div``;

const TeamMemberEmail = styled.span`
  color: #74767b;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0;
`;

const TeamMemberName = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 2px;

  p {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 0;
  }
`;

const TeamMemberInviteLabel = styled.span`
  background: rgba(255, 49, 89, 0.2);
  border-radius: 4px;
  color: #ff3159;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-left: 10px;
  padding: 4px 8px;
  text-transform: uppercase;
`;

const Tag = styled.span`
  background: gray;
  padding: 5px 10px 5px 10px;
  color: white;
  border-radius: 4px;
  position: relative;
  word-break: break-all;
  width: max-content;
  margin-left: 5px;
`;

const FlexCont = styled.div`
  display: flex;
  align-items: center;
`;

const RoleSpan = styled.span`
  min-width: 120px;
`;

const ClientLabel = styled.span`
  background: rgba(30, 30, 30, 0.1);
  border-radius: 4px;
  color: #1e1e1e;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  line-height: normal;
  max-width: 100px;
  overflow: hidden;
  padding: 5px 8px;
  text-align: center;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
  margin-left: 10px;
`;
