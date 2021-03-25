import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import AvatarIcon from "sharedComponents/AvatarIcon";
import TimeAgo from "react-timeago";
import { ROUTES } from "routes";
import useDropdown from "hooks/useDropdown";
import { AWS_CDN_URL } from "constants/api";

const ReviewRowComponent = ({ job, store, style }) => {
  const { node, showSelect, setShowSelect } = useDropdown();
  const [type, setType] = useState(undefined);
  const [tierStatus, setTierStatus] = useState(undefined);
  const [ownAdm, setOwnAdm] = useState(false);
  useEffect(() => {
    if (job.approval.created_by === store.role.team_member.team_member_id) {
      setType("self");
    } else {
      let status = "waiting";
      let tierStatus;
      let match;
      if (job.approval.tier_one && job.approval.tier_one.members?.length > 0) {
        job.approval.tier_one.members.map((member) => {
          if (store.role.team_member.team_member_id === member.id) {
            match = "tier_one";
          }
          if (member.approved !== null) {
            if (member.approved === false) {
              status = "rejected";
            } else if (member.approved && status !== "rejected") {
              status = "approved";
            }
          }
          if (member.approved === true) {
            tierStatus = 1;
          }
          return null;
        });
      }
      if (
        job.approval.tier_two &&
        job.approval.tier_two.members?.length > 0 &&
        tierStatus === 1
      ) {
        job.approval.tier_two.members.map((member) => {
          if (store.role.team_member.team_member_id === member.id) {
            match = "tier_two";
          }
          if (member.approved !== null) {
            if (member.approved === false) {
              status = "rejected";
            } else if (member.approved && status !== "rejected") {
              status = "approved";
            }
          }
          if (member.approved === true) {
            tierStatus = 2;
          }
          return null;
        });
      }
      if (
        job.approval.tier_three &&
        job.approval.tier_three.members?.length > 0 &&
        tierStatus === 2
      ) {
        job.approval.tier_three.members.map((member) => {
          if (store.role.team_member.team_member_id === member.id) {
            match = "tier_three";
          }
          if (member.approved !== null) {
            if (member.approved === false) {
              status = "rejected";
            } else if (member.approved && status !== "rejected") {
              status = "approved";
            }
          }
          return null;
        });
      }
      if (
        job.approval.extra_tier &&
        job.approval.extra_tier.members?.length > 0
      ) {
        job.approval.extra_tier.members.map((member) => {
          if (store.role.team_member.team_member_id === member.id) {
            match = "extra_tier";
            status = member.approved
              ? "approved"
              : member.approved === false
              ? "rejected"
              : "waiting";
          }
          return null;
        });
      }
      if (match) {
        setTierStatus(status);
        return setType(match);
      }
    }
  }, [job.approval, store.role]);

  useEffect(() => {
    if (
      store.role &&
      (store.role.role_permissions.owner || store.role.role_permissions.admin)
    ) {
      setOwnAdm(true);
    }
  }, [store.role]);

  return (
    <>
      {(type || ownAdm) && (
        <Container ref={node} style={style}>
          {(type === "self" || ownAdm) && (
            <DropdownButton onClick={() => setShowSelect(true)}>
              <i className="fas fa-users"></i>
            </DropdownButton>
          )}
          {/*IF SELF OR OWNER OR ADMIN AND SHOW DROPDOWN CLICKED*/}
          {(type === "self" || ownAdm) && showSelect && (
            <ViewStatus job={job} store={store} />
          )}
          {/*IF REVIEW REQUESTED AND NOT ALL TIERS APPROVED*/}
          {(type === "self" || (!type && ownAdm)) &&
            !job.approval.all_tiers_approved && (
              <RequestedInfo>
                {type === "self" && <>You requested a review </>}
                {!type && ownAdm && <>Requested review </>}
                <TimeAgo date={job.approval.created_at} />
              </RequestedInfo>
            )}
          {type && type !== "self" && tierStatus === "waiting" && (
            <RequestedInfo className="green">
              Your were requested to review{" "}
              <TimeAgo date={job.approval.created_at} />
            </RequestedInfo>
          )}
          {((type !== "self" && tierStatus === "approved") ||
            ((type === "self" || ownAdm) &&
              job.approval.all_tiers_approved)) && (
            <RequestedInfo className="green">Job Approved</RequestedInfo>
          )}
          {type !== "self" && tierStatus === "rejected" && (
            <RequestedInfo className="pink">Job Declined</RequestedInfo>
          )}
          {type !== "self" && tierStatus && tierStatus !== "waiting" && (
            <RequestedInfo className="margin-sep">
              Updated <TimeAgo date={job.approval.updated_at} />
            </RequestedInfo>
          )}
          {((job.approval.decline_note && type === "self") ||
            (job.approval.submit_note && type !== "self")) && (
            <STLink
              to={ROUTES.JobDashboard.url(
                store.company.mention_tag,
                job.title_slug,
                "notes"
              )}
            >
              <img src={`${AWS_CDN_URL}/icons/Filesvg.svg`} alt="" />
            </STLink>
          )}
        </Container>
      )}
    </>
  );
};

export default ReviewRowComponent;

const ViewStatus = ({ store, job }) => {
  const [
    tiers,
    // setTiers
  ] = useState({
    tier_1: [...job.approval.tier_one?.members],
    tier_2: [...job.approval.tier_two?.members],
    tier_3: [...job.approval.tier_three?.members],
  });
  const [tierStatus, setTierStatus] = useState({
    tier_1: undefined,
    tier_2: undefined,
    tier_3: undefined,
  });
  const [
    extra,
    // setExtra
  ] = useState([...job.approval.extra_tier?.members]);

  useEffect(() => {
    let newStatus = {
      tier_1: undefined,
      tier_2: undefined,
      tier_3: undefined,
    };
    if (job.approval.tier_one) {
      job.approval.tier_one.members.map((member) => {
        if (member.approved === true || member.approved === false) {
          newStatus.tier_1 = member;
        }
        return null;
      });
    }
    if (job.approval.tier_two) {
      job.approval.tier_two.members.map((member) => {
        if (member.approved === true || member.approved === false) {
          newStatus.tier_2 = member;
        }
        return null;
      });
    }
    if (job.approval.tier_three) {
      job.approval.tier_three.members.map((member) => {
        if (member.approved === true || member.approved === false) {
          newStatus.tier_3 = member;
        }
        return null;
      });
    }
    setTierStatus(newStatus);
  }, [job]);

  return (
    <ProcessContainer>
      <div className="header-box">Approval Process</div>
      <TiersContainer>
        {Object.entries(tiers).map((tier, index) => {
          let status = tierStatus[tier[0]]
            ? tierStatus[tier[0]].approved
              ? "approved"
              : "rejected"
            : "waiting";
          if (tier[1] && tier[1].length > 0) {
            return (
              <TierRow className="tier-row" key={`tier-review-${index}`}>
                <div className="tier-header">
                  <h4>
                    {statusMessages[status](
                      store.approval_process[customExchanger[tier[0]]]
                        .custom_name
                    )}
                  </h4>
                  <span className={`approval-status ${colors[status]}`}>
                    {titles[status]}
                  </span>
                </div>
                <div className="tier-list">
                  {status === "waiting" ? (
                    <>
                      {tier &&
                        tier[1].map((member, inx) => (
                          <MemberTierRow key={`member-row-${inx}`}>
                            <AvatarIcon
                              name={member.name}
                              imgUrl={member.avatar}
                              size={30}
                            />
                            <span className="tier-reviewer">{member.name}</span>
                          </MemberTierRow>
                        ))}
                    </>
                  ) : (
                    <MemberTierRow>
                      <AvatarIcon
                        name={tierStatus[tier[0]].name}
                        imgUrl={tierStatus[tier[0]].avatar}
                        size={30}
                      />
                      <span className="tier-reviewer">
                        {tierStatus[tier[0]].name}
                      </span>
                    </MemberTierRow>
                  )}
                </div>
              </TierRow>
            );
          }
          return null;
        })}
        {extra && extra.length > 0 && (
          <TierRow className="tier-row">
            <div className="tier-header">
              <h4>Extra reviewers</h4>
            </div>
            <div className="tier-list">
              {extra.map((member, inx) => {
                let status = member.approved
                  ? "approved"
                  : member.approved === false
                  ? "rejected"
                  : "waiting";
                return (
                  <MemberTierRow key={`member-tier-row-${inx}`}>
                    <AvatarIcon
                      name={member.name}
                      imgUrl={member.avatar}
                      size={30}
                    />
                    <span className="tier-reviewer">{member.name}</span>
                    <span className={`approval-status ${colors[status]}`}>
                      {titles[status]}
                    </span>
                  </MemberTierRow>
                );
              })}
            </div>
          </TierRow>
        )}
      </TiersContainer>
    </ProcessContainer>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: max-content;
  padding-right: 30px;
`;

const RequestedInfo = styled.div`
  font-size: 10px;
  line-height: 12px;
  color: #74767b;

  button {
    display: inline;
    color: inherit;
    text-decoration: underline;
  }

  &.green {
    color: #35c3ae;
  }

  &.pink {
    color: #e25667;
  }

  &.margin-sep {
    margin-left: 20px;
  }
`;

const ProcessContainer = styled.div`
  border-radius: 8px;
  background: white;
  box-shadow: 0px 1px 6px rgba(116, 118, 123, 0.17);
  position: absolute;
  top: 20px;
  left: 0px;
  z-index: 1;
  width: 350px;

  .header-box {
    padding: 20px 15px;
    border-bottom: solid 1px #eee;
    font-size: 16px;
    line-height: 19px;
    color: #2a3744;
  }
`;

const STLink = styled(Link)`
  margin-left: 20px;
  position: absolute;
  right: 0;
`;

const TiersContainer = styled.div`
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  max-width: 500px;
  padding: 10px 15px;
  margin-bottom: 20px;
`;

const TierRow = styled.div`
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  // background: white;

  &:hover {
    .button-options {
      display: flex;
    }
  }

  .tier-header {
    padding-bottom: 5px;
    border-bottom: solid 1px #eee;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .approval-status {
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;

    &.green {
      color: #35c3ae;
    }
    &.orange {
      color: #ffa076;
    }
    &.pink {
      color: #e25667;
    }
  }

  h4 {
    font-size: 10px;
    color: #9f9f9f;
  }
`;

const MemberTierRow = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 15px;
  cursor: pointer;
  position: relative;

  .tier-reviewer {
    font-size: 14px;
    line-height: 17px;
    color: #1e1e1e;
    margin-left: 5px;
  }

  .approval-status {
    position: absolute;
    right: 0;
  }
`;

const statusMessages = {
  approved: (name) => `${name} approved by`,

  rejected: (name) => `${name} rejected by`,
  waiting: (name) => `${name} waiting for approval from a reviewer`,
};

const titles = {
  approved: "Approved",
  rejected: "Declined",
  waiting: "Pending",
};
const colors = {
  approved: "green",

  rejected: "pink",
  waiting: "orange",
};

const customExchanger = {
  tier_1: "approval_tier_one",
  tier_2: "approval_tier_two",
  tier_3: "approval_tier_three",
};

const DropdownButton = styled.button`
  margin-right: 5px;
  font-size: 10px;
  text-decoration: none;
  color: #004a6d;

  &:hover {
    text-decoration: none;
  }
`;
