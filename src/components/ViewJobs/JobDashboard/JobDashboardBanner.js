import React, { useContext, useState, useEffect, Suspense } from "react";
import { Redirect } from "react-router-dom";
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
import QuickActionsMenuV2, {
  QuickActionsOption,
} from "sharedComponents/QuickActionsMenuV2";
import retryLazy from "hooks/retryLazy";
import sharedHelpers from "helpers/sharedHelpers";
import { AWS_CDN_URL } from "constants/api";
const ExistingWarning = React.lazy(() =>
  retryLazy(() =>
    import(
      "oldContainers/ATS/ManageApplicants/components/JobManager/ExistingWarning"
    )
  )
);
const AddCandidatesModal = React.lazy(() =>
  retryLazy(() => import("./AddCandidates/AddCandidates"))
);

const ShareJobSocialModal = React.lazy(() =>
  retryLazy(() => import("modals/ShareJobSocialModal"))
);

const JobDashboardBanner = (props) => {
  const store = useContext(GlobalContext);
  const [canPublish, setCanPublish] = useState(false);
  const [type, setType] = useState(undefined);
  const [tierStatus, setTierStatus] = useState(undefined);
  const [selectedTierName, setSelectedTierName] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);
  const [existingApplicants, setExistingApplicants] = useState(undefined);

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
        props.setActiveModal(undefined);
      } else {
        notify("danger", res);
      }
    });
  };

  const addSelectedProfessionalsToJob = (selectedProfessionals) => {
    const postBody = {
      company_id: props.jobData.company.id,
      job_id: props.jobData.id,
      candidate_ids: selectedProfessionals,
      recruiter_id: store.role.team_member.team_member_id,
      // Still need to come up with definitive way to decide if current user is acting on behalf of agency or employer
    };
    if (store.company.id !== props.jobData.company.id) {
      postBody.agency_id = store.company.id;
    }

    sharedHelpers
      .inviteProfessionalsToJob(postBody, store.session)
      .then((response) => {
        if (response && response.created_candidates.length > 0) {
          notify("info", "Successfully added candidates!");
        }
        props.setActiveModal(undefined);
        props.setRefreshCandidates();
        if (response && response.existing_applicants.length > 0) {
          setExistingApplicants(response.existing_applicants);
          props.setActiveModal("existingWarning");
        }
      });
  };

  return (
    <>
      {redirect && <Redirect to={redirect} />}
      <Header className={props.v2theme ? "v2theme" : ""}>
        <ATSContainer>
          <InnerHeader>
            <CompanyContainer>
              <div className="leo-flex-center-end leo-width-full">
                <AvatarContainer>
                  <AvatarIcon
                    name={props.company?.name}
                    imgUrl={props.company?.avatar_url}
                    size={50}
                  />
                </AvatarContainer>
                <div>
                  <CompanyName>{props.company?.name}</CompanyName>
                  <div
                    className="leo-flex-center-start leo-width-full"
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "baseline",
                    }}
                  >
                    <Title>{props.jobData?.title}</Title>
                    {props.jobData?.is_draft &&
                      (!props.jobData.approval?.id ||
                        !approvalStatuses[props.jobData.job_status]) && (
                        <Label>Draft</Label>
                      )}
                    {props.jobData &&
                      props.jobData.company?.id !== props.company?.id && (
                        <ClientButton>
                          {props.jobData.company.name}
                        </ClientButton>
                      )}
                    {props.jobData &&
                      !props.jobData.is_draft &&
                      (!props.jobData.approval?.id ||
                        !approvalStatuses[props.jobData.job_status]) && (
                        <div
                          className="leo-flex-center-end "
                          style={{ marginLeft: "20px" }}
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
                        </div>
                      )}
                    {props.jobData?.job_post_type === "public" &&
                      !props.jobData.is_draft && (
                        <button
                          style={{ marginLeft: "20px" }}
                          onClick={() =>
                            props.setActiveModal("share-job-social")
                          }
                        >
                          <img
                            src={`${AWS_CDN_URL}/icons/ShareIcon.svg`}
                            alt="ShareIcon"
                          />
                        </button>
                      )}
                  </div>
                  {props.jobData.approval?.id &&
                    approvalStatuses[props.jobData.job_status] && (
                      <ReviewRowComponent
                        job={props.jobData}
                        store={store}
                        style={{ marginTop: "5px" }}
                      />
                    )}
                </div>
              </div>
            </CompanyContainer>
            <div className="children-container leo-flex-center-end leo-width-full">
              <div className={sharedStyles.buttons + " leo-flex"}>
                <PermissionChecker
                  type="edit"
                  valid={{ recruiter: true, hiring_manager: true }}
                >
                  <>
                    {type && type !== "self" && tierStatus === "waiting" && (
                      <>
                        <CustomAppButton
                          theme="pink"
                          onClick={() => {
                            props.setActiveModal("decline-reason");
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
                  </>
                </PermissionChecker>
                {!(
                  (store.company.invited_by_agency ||
                    store.allMyCompanies[0].invited_by_employer) &&
                  store.allMyCompanies[0].trial !== "upgraded"
                ) && (
                  <QuickActionsMenuV2 disabled={false}>
                    <PermissionChecker type="edit" valid={{ recruiter: true }}>
                      <QuickActionsOption
                        onClick={() => props.openModal("addCandidates")}
                      >
                        {props.company.type === "Agency"
                          ? "Shortlist Candidates"
                          : "Add Candidates"}
                      </QuickActionsOption>
                    </PermissionChecker>
                    <PermissionChecker
                      type="edit"
                      valid={{ recruiter: true, hiring_manager: true }}
                    >
                      {props.jobData?.job_post_type === "public" &&
                        !props.jobData.is_draft && (
                          <QuickActionsOption
                            onClick={() =>
                              window.open(
                                `${CAREERS_PORTAL_URL}/${props.company.mention_tag}/${props.jobData.title_slug}`
                              )
                            }
                          >
                            View Job
                          </QuickActionsOption>
                        )}
                    </PermissionChecker>
                    <PermissionChecker
                      type="edit"
                      valid={{ recruiter: true, hiring_manager: true }}
                    >
                      {props.jobData?.is_draft &&
                        props.jobData?.owns &&
                        canPublish && (
                          <QuickActionsOption
                            onClick={() => props.publishJobCaller()}
                          >
                            Publish Job
                          </QuickActionsOption>
                        )}
                      {props.jobData?.is_draft &&
                        !canPublish &&
                        !props.jobData?.approval?.id && (
                          <QuickActionsOption
                            onClick={() => {
                              props.setActiveModal("select-reviewers");
                            }}
                          >
                            Request Approval
                          </QuickActionsOption>
                        )}
                      {!canPublish &&
                        props.jobData &&
                        props.jobData.approval?.id &&
                        props.jobData.job_status === "declined" && (
                          <QuickActionsOption
                            onClick={() => {
                              props.setActiveModal("re-select-reviewers");
                            }}
                          >
                            Re-Request Approval
                          </QuickActionsOption>
                        )}

                      {props.jobData && props.jobData.owns && (
                        <QuickActionsOption
                          onClick={() =>
                            setRedirect(
                              ROUTES.JobEdit.url(
                                props.company.mention_tag,
                                props.jobData.title_slug
                              )
                            )
                          }
                        >
                          Edit Job
                        </QuickActionsOption>
                      )}
                    </PermissionChecker>
                  </QuickActionsMenuV2>
                )}
                {props.children}
              </div>
            </div>
          </InnerHeader>
        </ATSContainer>
      </Header>
      {(props.activeModal === "select-reviewers" ||
        props.activeModal === "re-select-reviewers") &&
        store.teamMembers && (
          <SelectReviewersModal
            returnReviewers={() => console.log("arr")}
            hide={() => props.setActiveModal(undefined)}
            setRedirect={() => props.updateJob()}
            jobId={props.jobData.id}
            job={props.jobData}
            jobSlugSt={props.jobData.title_slug}
            saveJobDraftCaller={() => {}}
            rerequest={props.activeModal === "re-select-reviewers"}
          />
        )}
      {props.activeModal === "decline-reason" && (
        <DeclineJobModal
          hide={() => props.setActiveModal(undefined)}
          job={props.jobData}
          callDeclineJob={callDeclineJob}
          jobId={props.jobData.id}
          store={store}
        />
      )}
      {props.activeModal && props.activeModal === "addCandidates" && (
        <Suspense fallback={<div />}>
          <AddCandidatesModal
            closeModal={() => {
              props.setActiveModal(undefined);
            }}
            addSelectedProfessionalsToJob={addSelectedProfessionalsToJob}
          />
        </Suspense>
      )}
      {props.activeModal === "existingWarning" && (
        <Suspense fallback={<div />}>
          <ExistingWarning
            existingApplicants={existingApplicants}
            closeModal={() => {
              props.setActiveModal(undefined);
              setExistingApplicants(undefined);
            }}
          />
        </Suspense>
      )}
      {props.activeModal === "share-job-social" && (
        <Suspense fallback={<div />}>
          <ShareJobSocialModal
            job={props.jobData}
            company={store.company}
            hide={() => {
              props.setActiveModal(undefined);
            }}
          />
        </Suspense>
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
  height: 37px;
`;

export default JobDashboardBanner;
