import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ATSContainer } from "styles/PageContainers";
import AppButton from "styles/AppButton";
import "./style/intercom.scss";
import { ROUTES } from "routes";
import notify from "notifications";
import Spinner from "sharedComponents/Spinner";

const JobSaveBar = ({
  store,
  allTabsViewed,
  setActiveModal,
  publishJobCaller,
  saveJobDraftCaller,
  historyStore,
  jobId,

  job,
  saving,
  setRedirect,
  editingJob,
  callApproveJob,
  setSelectedTierName,

  updated,
}) => {
  const [bottomReached, setBottomReached] = useState(false);
  const [savingOption, setSavingOption] = useState(undefined);
  const [canPublish, setCanPublish] = useState(false);
  const [type, setType] = useState(undefined);
  const [tierStatus, setTierStatus] = useState(undefined);

  useEffect(() => {
    placing();
    window.onscroll = () => placing();
  }, []);

  const placing = () => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      setBottomReached(true);
    } else {
      setBottomReached(false);
    }
  };

  useEffect(() => {
    if (saving === false) {
      setSavingOption(undefined);
    }
  }, [saving]);

  useEffect(() => {
    if (store.role) {
      if (
        store.role.role_permissions.owner ||
        store.role.role_permissions.admin
      ) {
        setCanPublish(true);
      } else if (store.approval_process) {
        if (
          store.role.role_permissions.recruiter &&
          !store.approval_process.recruiter
        ) {
          setCanPublish(true);
        }
        if (
          store.role.role_permissions.hiring_manager &&
          !store.approval_process.hiring_manager
        ) {
          setCanPublish(true);
        }
        if (editingJob && editingJob.approval?.all_tiers_approved) {
          setCanPublish(true);
        }
      }
      // if(store.approval_process.hiring_manager && store.role.team)
    }
  }, [store.approval_process, store.role, editingJob]);

  useEffect(() => {
    if (editingJob && editingJob.approval) {
      if (
        editingJob.approval.created_by === store.role.team_member.team_member_id
      ) {
        setType("self");
      } else {
        let match;
        let lastApprovedTier;
        if (
          editingJob.approval.tier_one &&
          editingJob.approval.tier_one.members?.length > 0
        ) {
          let statusName = "waiting";
          editingJob.approval.tier_one.members.map((member) => {
            if (store.role.team_member.team_member_id === member.id) {
              match = "tier_one";
            }
            if (member.approved !== null) {
              if (member.approved === false) {
                statusName = "rejected";
              } else if (member.approved && statusName !== "rejected") {
                statusName = "approved";
              }
            }
            if (member.approved === true) {
              lastApprovedTier = 1;
            }
            return null;
          });
          if (match) {
            setTierStatus(statusName);
            setSelectedTierName(match);
            return setType(match);
          }
        }
        if (
          editingJob.approval.tier_two &&
          editingJob.approval.tier_two.members?.length > 0 &&
          lastApprovedTier === 1
        ) {
          let statusName = "waiting";
          editingJob.approval.tier_two.members.map((member) => {
            if (store.role.team_member.team_member_id === member.id) {
              match = "tier_two";
            }
            if (member.approved !== null) {
              if (member.approved === false) {
                statusName = "rejected";
              } else if (member.approved && statusName !== "rejected") {
                statusName = "approved";
              }
            }
            if (member.approved === true) {
              lastApprovedTier = 2;
            }
            return null;
          });
          if (match) {
            setTierStatus(statusName);
            setSelectedTierName(match);
            return setType(match);
          }
        }
        if (
          editingJob.approval.tier_three &&
          editingJob.approval.tier_three.members?.length > 0 &&
          lastApprovedTier === 2
        ) {
          let statusName = "waiting";
          editingJob.approval.tier_three.members.map((member) => {
            if (store.role.team_member.team_member_id === member.id) {
              match = "tier_three";
            }
            if (member.approved !== null) {
              if (member.approved === false) {
                statusName = "rejected";
              } else if (member.approved && statusName !== "rejected") {
                statusName = "approved";
              }
            }
            return null;
          });
          if (match) {
            setTierStatus(statusName);
            setSelectedTierName(match);
            return setType(match);
          }
        }
        if (
          editingJob.approval.extra_tier &&
          editingJob.approval.extra_tier.members?.length > 0
        ) {
          let statusName = "waiting";
          editingJob.approval.extra_tier.members.map((member) => {
            if (store.role.team_member.team_member_id === member.id) {
              match = "extra_tier";
              statusName = member.approved
                ? "approved"
                : member.approved === false
                ? "rejected"
                : "waiting";
            }
            return null;
          });
          if (match) {
            setTierStatus(statusName);
            setSelectedTierName(match);
            return setType(match);
          }
        }
      }
    } else if (editingJob && !editingJob.approval) {
      setType("self");
    }
  }, [editingJob, store.role]);

  return (
    <BarContainer className={bottomReached ? "cleared" : ""}>
      <ATSContainer>
        <FlexContainer className="leo-flex-center-between">
          <div className="leo-flex-center">
            {!jobId ? (
              <AppButton
                theme="white"
                disabled={saving}
                onClick={() =>
                  setRedirect(
                    historyStore.state.length > 1
                      ? historyStore.state[1]?.pathname +
                          historyStore.state[1]?.search
                      : ROUTES.ViewJobs.url(store.company.mention_tag)
                  )
                }
              >
                Cancel
              </AppButton>
            ) : (
              <CustomAppButton
                theme="pink"
                onClick={() => setActiveModal("delete")}
                disabled={saving}
              >
                Delete {job.is_draft ? "draft" : "job"}
              </CustomAppButton>
            )}
            {saving && savingOption === undefined && (
              <SavingIndicator isDraft={job.is_draft} />
            )}
          </div>
          <RightContainer className="leo-flex">
            {(updated || !editingJob) &&
              (allTabsViewed || editingJob) &&
              job.is_draft && (
                <CustomAppButton
                  theme="white"
                  onClick={() => {
                    if (!job.title) {
                      notify(
                        "danger",
                        "Job must have a title before you can save it"
                      );
                    } else if (
                      type === "self" &&
                      editingJob &&
                      editingJob.approval?.id
                    ) {
                      setActiveModal("revert-approval-save-leave");
                      //warn user
                    } else {
                      setSavingOption("draft");
                      publishJobCaller(true);
                    }
                  }}
                  disabled={saving}
                >
                  {saving && savingOption === "draft" && (
                    <Spinner size="sm" inline className="custom-spinner" />
                  )}
                  Save as Draft
                </CustomAppButton>
              )}
            {(updated || !editingJob) && (
              <CustomAppButton
                theme="primary"
                onClick={() => {
                  if (!job.title) {
                    notify(
                      "danger",
                      "Job must have a title before you can save it"
                    );
                  } else if (
                    type === "self" &&
                    editingJob &&
                    editingJob.approval?.id
                  ) {
                    setActiveModal("revert-approval-save-continue");
                    //warn user
                  } else {
                    setSavingOption("continue");
                    saveJobDraftCaller();
                  }
                }}
                disabled={saving}
              >
                {saving && savingOption === "continue" && (
                  <Spinner
                    color="white"
                    size="sm"
                    inline
                    className="custom-spinner"
                  />
                )}
                {editingJob ? "Save" : "Save & Continue"}
              </CustomAppButton>
            )}
            {(allTabsViewed || editingJob) && (!job.is_draft || canPublish) && (
              <CustomAppButton
                theme="dark-blue"
                onClick={() => {
                  if (!job.title) {
                    notify(
                      "danger",
                      "Job must have a title before you can save it"
                    );
                  } else if (
                    type === "self" &&
                    editingJob &&
                    editingJob.approval?.id &&
                    updated
                  ) {
                    setActiveModal("revert-approval-save-publish");
                    //warn user
                  } else {
                    setSavingOption("publish");
                    publishJobCaller();
                  }
                }}
                disabled={saving}
              >
                {saving && savingOption === "publish" && (
                  <Spinner
                    color="white"
                    size="sm"
                    inline
                    className="custom-spinner"
                  />
                )}
                {job.is_draft ? "Publish" : "Done"}
              </CustomAppButton>
            )}
            {(allTabsViewed || editingJob) &&
              !canPublish &&
              !editingJob?.approval?.id && (
                <CustomAppButton
                  theme="dark-blue"
                  onClick={() => {
                    if (!job.title) {
                      notify(
                        "danger",
                        "Job must have a title before you can save it"
                      );
                    } else {
                      setActiveModal("select-reviewers");
                    }
                  }}
                  disabled={saving}
                >
                  Request Approval
                </CustomAppButton>
              )}
            {!canPublish &&
              editingJob &&
              editingJob.approval?.id &&
              editingJob.job_status === "declined" && (
                <CustomAppButton
                  theme="pink"
                  onClick={() => {
                    if (!job.title) {
                      notify(
                        "danger",
                        "Job must have a title before you can save it"
                      );
                    } else {
                      setActiveModal("re-select-reviewers");
                    }
                  }}
                  disabled={saving}
                >
                  Re-Request Approval
                </CustomAppButton>
              )}
            {type === "self" &&
              editingJob &&
              editingJob.approval &&
              !editingJob.approval.all_tiers_approved &&
              editingJob.job_status !== "declined" && (
                <CustomAppButton
                  theme="pink"
                  onClick={() => {
                    notify("info", "You have already requested a review");
                  }}
                  disabled={saving}
                >
                  Review Requested
                </CustomAppButton>
              )}
            {type && type !== "self" && tierStatus === "waiting" && (
              <>
                <CustomAppButton
                  theme="pink"
                  onClick={() => {
                    setActiveModal("decline-reason");
                  }}
                  disabled={saving}
                >
                  Decline Job
                </CustomAppButton>
                <CustomAppButton
                  theme="primary"
                  onClick={() => {
                    if (!job.title) {
                      notify(
                        "danger",
                        "Job must have a title before you can save it"
                      );
                    } else {
                      callApproveJob();
                    }
                  }}
                  disabled={saving}
                >
                  Approve Job
                </CustomAppButton>
              </>
            )}
          </RightContainer>
        </FlexContainer>
      </ATSContainer>
    </BarContainer>
  );
};

export default JobSaveBar;

const BarContainer = styled.div`
  position: fixed;
  background: #f9f9f9;
  width: 100%;
  bottom: 0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  transition: all 500ms;

  &.cleared {
    background: none;
    box-shadow: none;
    padding: 30px 0px;
    // position: initial;
  }
`;

const FlexContainer = styled.div`
  padding: 15px 0px;
`;

const RightContainer = styled.div`
  button {
    margin-left: 10px;
  }
`;

const CustomAppButton = styled(AppButton).attrs((props) => ({
  className: (props.className || "") + " leo-flex",
}))`
  .custom-spinner {
    margin-right: 10px;
  }
`;

const SavingIndicator = ({ isDraft }) => (
  <SaveInd className="leo-flex-center">
    <Spinner size="sm" inline />
    <span>Saving {isDraft ? "draft" : "job"}...</span>
  </SaveInd>
);

const SaveInd = styled.div`
  color: #8d8d8d;
  margin-left: 10px;

  span {
    font-size: 10px;
    margin-left: 5px;
  }
`;
