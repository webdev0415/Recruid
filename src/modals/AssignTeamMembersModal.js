import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
  ModalFooter,
} from "modals/UniversalModal/UniversalModal";
import styled from "styled-components";
import { fetchAssignMembers } from "helpersV2/teamMembers";
import { getTeamMembers, getRole } from "contexts/globalContext/GlobalMethods";
import notify from "notifications";
import TeamSelector from "sharedComponents/TeamSelector";

const AssignTeamMembersModal = ({ hide, member, onlyView }) => {
  const store = useContext(GlobalContext);
  const [memberIds, setMemberIds] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);

  useEffect(() => {
    if (member) {
      setMemberIds(member.assigned_members || []);
    }
  }, [member]);

  useEffect(() => {
    if (member && store.teamMembers) {
      setMemberOptions(
        store.teamMembers.filter((memb) => {
          let val = false;
          if (memb.permission !== "member") {
            return false;
          }
          if (
            onlyView &&
            member.assigned_members.indexOf(memb.team_member_id) === -1
          ) {
            return false;
          }
          memb.roles.map((role) =>
            member.roles.includes(role) ? (val = true) : null
          );
          return val;
        })
      );
    }
  }, [member, store.teamMembers, onlyView]);

  const confirmChanges = () => {
    let body = {
      manager_id: member.team_member_id,
      member_ids: memberIds,
    };
    fetchAssignMembers(store.session, store.company.id, body).then((res) => {
      if (!res.err) {
        notify("info", "Members succesfully changed");
        getTeamMembers(store.dispatch, store.session, store.company.id);
        if (store.role.team_member.team_member_id === member.team_member_id) {
          getRole(store.dispatch, store.session, store.company.id);
        }
        hide();
      } else {
        notify("danger", res);
      }
    });
  };

  const addMember = (newId) => {
    setMemberIds([...memberIds, newId]);
  };

  const removeMember = (newId) => {
    let newMembers = [...memberIds];
    newMembers.splice(memberIds.indexOf(newId), 1);
    setMemberIds(newMembers);
  };

  return (
    <UniversalModal
      show={true}
      hide={hide}
      id="assign-members-modal"
      width={600}
    >
      <ModalHeaderClassic
        title={onlyView ? "Assigned Team Members" : "Assign Team Members"}
        closeModal={hide}
      />
      <STModalBody>
        <TeamContainer>
          <TeamSelector
            addedMemberIds={memberIds}
            availableMembers={memberOptions}
            addMember={addMember}
            removeMember={removeMember}
            onlyView={onlyView}
          />
        </TeamContainer>
      </STModalBody>
      <ModalFooter hide={hide} cancelText={onlyView ? "Close" : "Cancel"}>
        {!onlyView && (
          <button
            id="forward"
            className="button button--default button--blue-dark"
            onClick={() => confirmChanges()}
            style={{ maxWidth: "max-content" }}
          >
            Confirm
          </button>
        )}
      </ModalFooter>
    </UniversalModal>
  );
};

export default AssignTeamMembersModal;

const STModalBody = styled(ModalBody)`
  // padding: 30px !important;
`;

const TeamContainer = styled.div`
  max-height: 300px;
  overflow: auto;
`;

// const changesInArray = (originalArray, modifiedArray) => {
//   let addValues = [];
//   let deleteValues = [...originalArray];
//
//   modifiedArray.map((value) => {
//     let index = deleteValues.indexOf(value);
//     if (index === -1) {
//       addValues.push(value);
//     } else {
//       deleteValues.splice(index, 1);
//     }
//     return null;
//   });
//   return { add: addValues, delete: deleteValues };
// };
