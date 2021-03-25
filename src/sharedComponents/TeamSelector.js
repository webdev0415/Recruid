import React from "react";
import styled from "styled-components";
import AvatarIcon from "sharedComponents/AvatarIcon";
import { AWS_CDN_URL } from "constants/api";
const TeamSelector = ({
  availableMembers,
  addedMemberIds,
  addMember,
  removeMember,
  onlyView,
}) => {
  return (
    <>
      {availableMembers.map((member, index) => {
        if (addedMemberIds.indexOf(member.team_member_id) !== -1) {
          return (
            <MemberCell
              key={`team-member-${index}`}
              member={member}
              checked={addedMemberIds.indexOf(member.team_member_id) !== -1}
              addMember={addMember}
              removeMember={removeMember}
              onlyView={onlyView}
            />
          );
        } else {
          return null;
        }
      })}
      {availableMembers.map((member, index) => {
        if (addedMemberIds.indexOf(member.team_member_id) === -1) {
          return (
            <MemberCell
              key={`team-member-${index}`}
              member={member}
              checked={addedMemberIds.indexOf(member.team_member_id) !== -1}
              addMember={addMember}
              removeMember={removeMember}
              onlyView={onlyView}
            />
          );
        } else {
          return null;
        }
      })}
    </>
  );
};

export default TeamSelector;

const MemberCell = ({ member, checked, addMember, removeMember, onlyView }) => (
  <>
    <MemberWrapper className="leo-flex-center-between">
      <MemberInfo className="leo-flex-center">
        <AvatarIcon name={member.name} imgUrl={member.avatar} size={40} />
        <div className="info">
          <span className="name">{member.name}</span>
          <span className="role">
            {member.roles.map(
              (role, index) =>
                `${role}${index !== member.roles.length - 1 ? ", " : ""}`
            )}
          </span>
        </div>
      </MemberInfo>
      {!onlyView && (
        <button
          onClick={() =>
            !checked
              ? addMember(member.team_member_id)
              : removeMember(member.team_member_id)
          }
        >
          <img
            src={`${AWS_CDN_URL}/icons/${
              checked ? "SelectedMark" : "AddMark"
            }.svg`}
            alt=""
          />
        </button>
      )}
    </MemberWrapper>
  </>
);

const MemberWrapper = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #eeeeee;
`;

const MemberInfo = styled.div`
  .info {
    margin-left: 15px;

    .name {
      color: #1e1e1e;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 4px;
    }
    .role {
      color: #74767b;
      text-transform: capitalize;
    }
  }
`;
