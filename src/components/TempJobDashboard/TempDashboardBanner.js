import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "routes";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import {
  Header,
  InnerHeader,
  Title,
  Label,
  ClientButton,
  CompanyName,
  CompanyContainer,
  FlexContainer,
  AvatarContainer,
} from "sharedComponents/ATSBanner";
import { PermissionChecker } from "constants/permissionHelpers";
import { CAREERS_PORTAL_URL } from "constants/api";
import ReviewRowComponent from "components/ViewJobs/components/ViewJobTable/ReviewRowComponent";
import { ATSContainer } from "styles/PageContainers";
import AvatarIcon from "sharedComponents/AvatarIcon";
import JobHold from "sharedComponents/JobHold";
import SizzlingComponent from "sharedComponents/SizzlingComponent";
import GlobalContext from "contexts/globalContext/GlobalContext";
import AppButton from "styles/AppButton";
import notify from "notifications";
import styled from "styled-components";
import {
  fetchRejectTierRequest,
  fetchApproveTierRequest,
} from "helpersV2/jobs/approval";
import SelectReviewersModal from "modals/SelectReviewersModal";
import DeclineJobModal from "modals/DeclineJobModal";

const TempDashboardBanner = (props) => {
  const store = useContext(GlobalContext);
  const [canPublish, setCanPublish] = useState(false);
  const [type, setType] = useState(undefined);
  const [tierStatus, setTierStatus] = useState(undefined);
  const [selectedTierName, setSelectedTierName] = useState(undefined);
  const [activeModal, setActiveModal] = useState(undefined);

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
        if (props.jobData && props.jobData.approval?.all_tiers_approved) {
          setCanPublish(true);
        }
      }
      // if(store.approval_process.hiring_manager && store.role.team)
    }
  }, [store.approval_process, store.role, props.jobData]);

  useEffect(() => {
    if (props.jobData && props.jobData.approval) {
      if (
        props.jobData.approval.created_by ===
        store.role.team_member.team_member_id
      ) {
        setType("self");
      } else {
        let match;
        let lastApprovedTier;
        if (
          props.jobData.approval.tier_one &&
          props.jobData.approval.tier_one.members?.length > 0
        ) {
          let statusName = "waiting";
          props.jobData.approval.tier_one.members.map((member) => {
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
          props.jobData.approval.tier_two &&
          props.jobData.approval.tier_two.members?.length > 0 &&
          lastApprovedTier === 1
        ) {
          let statusName = "waiting";
          props.jobData.approval.tier_two.members.map((member) => {
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
          props.jobData.approval.tier_three &&
          props.jobData.approval.tier_three.members?.length > 0 &&
          lastApprovedTier === 2
        ) {
          let statusName = "waiting";
          props.jobData.approval.tier_three.members.map((member) => {
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
          props.jobData.approval.extra_tier &&
          props.jobData.approval.extra_tier.members?.length > 0
        ) {
          let statusName = "waiting";
          props.jobData.approval.extra_tier.members.map((member) => {
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
    } else {
      setType("self");
    }
     
  }, [props.jobData, store.role]);

  const callApproveJob = () => {
    fetchApproveTierRequest(
      store.session,
      store.company.id,
      props.jobData.approval.id,
      selectedTierName,
      store.role.team_member.team_member_id
    ).then((res) => {
      if (!res.err) {
        notify("info", "You have sent your approval for this job");
        props.updateJob();
      } else {
        notify("danger", res);
      }
    });
  };

  const callDeclineJob = (noteId) => {
    fetchRejectTierRequest(
      store.session,
      store.company.id,
      props.jobData.approval.id,
      selectedTierName,
      store.role.team_member.team_member_id,
      noteId
    ).then((res) => {
      if (!res.err) {
        notify("info", "You have rejected this job review");
        props.updateJob();
        setActiveModal(undefined);
      } else {
        notify("danger", res);
      }
    });
  };

  return (
    <>
      <Header>
        <ATSContainer>
          <InnerHeader>
            <CompanyContainer>
              <FlexContainer>
                <AvatarContainer>
                  <AvatarIcon
                    name={props.company?.name}
                    imgUrl={props.company?.avatar_url}
                    size={50}
                  />
                </AvatarContainer>
                <div>
                  <CompanyName>{props.company?.name}</CompanyName>
                  <FlexContainer
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "baseline",
                    }}
                  >
                    <Title>{props.job?.title}</Title>
                    {props.jobData?.is_draft &&
                      (!props.jobData.approval?.id ||
                        !approvalStatuses[props.jobData.job_status]) && (
                        <Label>Draft</Label>
                      )}
                    {props.job &&
                      props.job.company?.id !== props.company?.id && (
                        <ClientButton>{props.job.company.name}</ClientButton>
                      )}
                    {props.jobData &&
                      !props.jobData.is_draft &&
                      (!props.jobData.approval?.id ||
                        !approvalStatuses[props.jobData.job_status]) && (
                        <FlexContainer
                          style={{ marginLeft: "20px", width: "auto" }}
                        >
                          <JobHold
                            onHold={props.jobData.on_hold}
                            job_id={props.jobData.id}
                            job={props.jobData}
                            store={store}
                            changeHoldState={(on_hold) =>
                              props.setJobData({ ...props.jobData, on_hold })
                            }
                            style={{ marginRight: "14px" }}
                          />
                          <SizzlingComponent
                            hotness={props.jobData.sizzle_score}
                            job_id={props.jobData.id}
                            job={props.jobData}
                            store={store}
                            changeNewSizzlingFactor={(sizzle_score) =>
                              props.setJobData({
                                ...props.jobData,
                                sizzle_score,
                              })
                            }
                          />
                        </FlexContainer>
                      )}
                  </FlexContainer>
                  {props.jobData.approval?.id &&
                    approvalStatuses[props.jobData.job_status] && (
                      <ReviewRowComponent
                        job={props.jobData}
                        store={store}
                        style={{ marginTop: "5px" }}
                      />
                    )}
                </div>
              </FlexContainer>
            </CompanyContainer>
            <FlexContainer className="children-container">
              <div className={sharedStyles.buttons}>
                <PermissionChecker
                  type="edit"
                  valid={{ recruiter: true, hiring_manager: true }}
                >
                  {props.job?.job_post_type === "public" &&
                    !props.jobData.is_draft && (
                      <a
                        href={`${CAREERS_PORTAL_URL}/${props.company.mention_tag}/${props.job.title_slug}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        style={{ marginRight: "10px" }}
                        className="button button--default button--blue-dark"
                      >
                        View Job
                      </a>
                    )}
                </PermissionChecker>
                <PermissionChecker
                  type="edit"
                  valid={{ recruiter: true, hiring_manager: true }}
                >
                  {props.jobData?.is_draft && props.job?.owns && canPublish && (
                    <button
                      className="button button--default button--blue-dark"
                      style={{ marginRight: "10px" }}
                      onClick={() => props.publishJobCaller()}
                    >
                      Publish Job
                    </button>
                  )}
                  {props.jobData?.is_draft &&
                    !canPublish &&
                    !props.jobData?.approval?.id && (
                      <CustomAppButton
                        theme="dark-blue"
                        onClick={() => {
                          setActiveModal("select-reviewers");
                        }}
                      >
                        Request Approval
                      </CustomAppButton>
                    )}
                  {!canPublish &&
                    props.jobData &&
                    props.jobData.approval?.id &&
                    props.jobData.job_status === "declined" && (
                      <CustomAppButton
                        theme="pink"
                        onClick={() => {
                          setActiveModal("re-select-reviewers");
                        }}
                      >
                        Re-Request Approval
                      </CustomAppButton>
                    )}
                  {type && type !== "self" && tierStatus === "waiting" && (
                    <>
                      <CustomAppButton
                        theme="pink"
                        onClick={() => {
                          setActiveModal("decline-reason");
                        }}
                      >
                        Decline Job
                      </CustomAppButton>
                      <CustomAppButton
                        theme="primary"
                        onClick={() => {
                          callApproveJob();
                        }}
                      >
                        Approve Job
                      </CustomAppButton>
                    </>
                  )}
                  {props.job && props.job.owns && (
                    <STLink
                      className="button button--default button--grey-light"
                      to={ROUTES.JobEdit.url(
                        props.company.mention_tag,
                        props.job.title_slug
                      )}
                    >
                      Edit Job
                    </STLink>
                  )}
                </PermissionChecker>
              </div>
            </FlexContainer>
          </InnerHeader>
        </ATSContainer>
      </Header>
      {(activeModal === "select-reviewers" ||
        activeModal === "re-select-reviewers") &&
        store.teamMembers && (
          <SelectReviewersModal
            returnReviewers={() => console.log("arr")}
            hide={() => setActiveModal(undefined)}
            setRedirect={() => props.updateJob()}
            jobId={props.jobData.id}
            job={props.jobData}
            jobSlugSt={props.jobData.title_slug}
            saveJobDraftCaller={() => {}}
            rerequest={activeModal === "re-select-reviewers"}
          />
        )}
      {activeModal === "decline-reason" && (
        <DeclineJobModal
          hide={() => setActiveModal(undefined)}
          job={props.jobData}
          callDeclineJob={callDeclineJob}
          jobId={props.jobData.id}
          store={store}
        />
      )}
    </>
  );
};

const approvalStatuses = {
  "awaiting for review": true,
  declined: true,
  approved: true,
};

const CustomAppButton = styled(AppButton)`
  margin-right: 10px;
`;

const STLink = styled(Link)`
  background: #ffffff;
  border: 1px solid #2a3744;
  color: #2a3744;

  &:hover {
    background: #fbfbfb;
    border: 1px solid #2a3744;
    color: #2a3744;
  }
`;

export default TempDashboardBanner;
