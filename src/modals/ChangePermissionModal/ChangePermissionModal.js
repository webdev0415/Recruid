import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
  ModalFooter,
} from "modals/UniversalModal/UniversalModal";
import PermissionScreen from "modals/ChangePermissionModal/PermissionScreen";
import styled from "styled-components";
import {
  fetchUpdateMemberRole,
  fetchUpdateMemberPermissionRole,
} from "helpersV2/teamMembers";
import { getTeamMembers, getRole } from "contexts/globalContext/GlobalMethods";
import notify from "notifications";

const ChangePermissionModal = ({ hide, member }) => {
  const store = useContext(GlobalContext);
  const [permission, setPermission] = useState("");
  const [roles, setRoles] = useState({
    recruiter: false,
    hiring_manager: false,
    marketer: false,
    business: false,
  });

  useEffect(() => {
    if (member) {
      setPermission(member.permission || "");
      setRoles({
        recruiter: member.roles?.includes("recruiter"),
        hiring_manager: member.roles?.includes("hiring_manager"),
        business: member.roles?.includes("business"),
        marketer: member.roles?.includes("marketer"),
      });
    }
  }, [member]);

  const confirmChanges = async () => {
    let permRes;
    let roleRes;
    let newRoles = Object.entries(roles)
      .filter((role) => role[1])
      .map((role) => role[0]);
    if (permission !== "owner" && newRoles.length === 0) {
      return notify("danger", "Member must have at least one role");
    }
    if (permission !== member.permission) {
      permRes = await fetchUpdateMemberPermissionRole(
        store.session,
        store.company.id,
        {
          assigner: store.role.team_member.team_member_id,
          assignee: member.team_member_id,
          permission,
        }
      );
    }

    roleRes = await fetchUpdateMemberRole(store.session, store.company.id, {
      assigner: store.role.team_member.team_member_id,
      assignee: member.team_member_id,
      roles: newRoles,
    });
    if (permRes && !permRes.err) {
      notify("info", "Permission succesfully changed");
    } else if (permRes) {
      notify("danger", "Unable to update  permission");
    }
    if (roleRes && !roleRes.err) {
      notify("info", "Roles succesfully changed");
    } else if (roleRes) {
      notify("danger", "Unable to update  roles");
    }
    if (permRes || roleRes) {
      getTeamMembers(store.dispatch, store.session, store.company.id);
      if (store.role.team_member.team_member_id === member.team_member_id) {
        getRole(store.dispatch, store.session, store.company.id);
      }
      hide();
    }
  };

  return (
    <UniversalModal
      show={true}
      hide={hide}
      id="change-permission-modal"
      width={600}
    >
      <ModalHeaderClassic title="Change Permissions" closeModal={hide} />
      <STModalBody>
        <PermissionScreen
          permission={permission}
          setPermission={setPermission}
          roles={roles}
          setRoles={setRoles}
          store={store}
        />
      </STModalBody>
      <ModalFooter hide={hide} cancelText="Cancel">
        <button
          id="forward"
          className="button button--default button--blue-dark"
          onClick={() => confirmChanges()}
          style={{ maxWidth: "max-content" }}
        >
          Confirm
        </button>
      </ModalFooter>
    </UniversalModal>
  );
};

export default ChangePermissionModal;

const STModalBody = styled(ModalBody)`
  padding: 30px !important;
`;
