import React, { useState, useEffect } from "react";
import { ROUTES } from "routes";
import { Link } from "react-router-dom";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import spacetime from "spacetime";
import AvatarIcon from "sharedComponents/AvatarIcon";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Checkbox from "sharedComponents/Checkbox";
import { selectStatusOptions } from "constants/stageOptions";
// import MarketingEmailModal from "modals/MarketingEmailModal";

const ApplicantCell = ({
  stage,
  index,
  candidate,
  overSelfStage,
  changeCandidateStatus,
  changeCandidateIndex,
  openAddReviewerModal,
  company,
  isClientJob,
  selectedJob,
  permission,
  store,
  toggleCandidate,
  availableHiringManagers,
  canViewAll,
}) => {
  const [missingStatus, setMissingStatus] = useState(undefined);
  const [{ candidateDroppable, isDragging }, drag] = useDrag({
    item: {
      type: "applicant",
      applicant_id: candidate.applicant_id,
      sourceIndex: index,
      candidateIndex: candidate.index,
      stage: stage,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      candidateDroppable: monitor.getItem(),
    }),
  });
  const [isCandidateHM, setIsCandidateHM] = useState(false);
  const [canViewApplicant, setCanViewApplicant] = useState(false);
  // const [cellModal, setCellModal] = useState(undefined);
  const date = new spacetime(new Date(candidate.last_update));
  const daysSince = candidate.last_update
    ? Math.floor(
        (Date.now() - new Date(candidate.last_update)) / (1000 * 60 * 60 * 24)
      )
    : 0;

  useEffect(() => {
    let match;
    selectStatusOptions[candidate.stage].map((status) => {
      if (status.value === candidate.status) match = true;
      return null;
    });
    if (!match) setMissingStatus(candidate.status);
  }, []);

  useEffect(() => {
    if (candidate && store.role && candidate.hiring_managers) {
      let ids = candidate.hiring_managers.map(
        (member) => member.team_member_id
      );
      if (ids.indexOf(store.role.team_member.team_member_id) !== -1) {
        setIsCandidateHM(true);
      }
    }
  }, [candidate, store.role]);

  useEffect(() => {
    if (canViewAll) {
      setCanViewApplicant(true);
    } else if (isCandidateHM) {
      setCanViewApplicant(true);
    }
  }, [canViewAll, isCandidateHM]);

  return (
    <>
      {canViewApplicant &&
        overSelfStage &&
        !isDragging &&
        candidateDroppable &&
        candidateDroppable.candidateIndex - 1 !== candidate.index && (
          <ApplicantDropSeparator
            changeCandidateIndex={(candidateDroppable) =>
              changeCandidateIndex(candidateDroppable, index, candidate.index)
            }
          />
        )}

      <StageCellST
        ref={permission.edit ? drag : null}
        className={`${overSelfStage ? "no-margin" : ""} ${
          isDragging ? "dragging" : ""
        } ${declinedIndicator[candidate.status] ? "rejected" : ""} ${
          !canViewApplicant ? "no-show" : ""
        }`}
      >
        {!exceptionIndicator[candidate.status] && (
          <OverlayTrigger
            key={"bottom"}
            placement={"bottom"}
            overlay={
              <Tooltip id={`tooltip-bottom`}>
                {candidate.talent_name} hasn’t been engaged with for{" "}
                {Math.floor(daysSince)} days
              </Tooltip>
            }
          >
            <CandidateIndicator className={daysSince <= 2 ? "none" : ""}>
              <svg
                width="20"
                height="20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="10"
                  fill={
                    daysSince <= 2
                      ? "none"
                      : daysSince >= 4
                      ? "#EC475D"
                      : "#B88910"
                  }
                />
                <path
                  d="M10.874 4.818l-.13 7.254H9.367l-.13-7.254h1.637zm-.816 10.277a.97.97 0 01-.706-.289.945.945 0 01-.288-.706.924.924 0 01.288-.696.963.963 0 01.706-.293c.269 0 .5.098.696.293a.959.959 0 01.154 1.198c-.09.15-.208.269-.358.358a.939.939 0 01-.492.134z"
                  fill="#fff"
                />
              </svg>
            </CandidateIndicator>
          </OverlayTrigger>
        )}
        <FlexContainer>
          <CandidateAvatarOptions>
            {!candidate.selected && (
              <AvatarIcon
                name={candidate.talent_name}
                imgUrl={candidate.avatar_url}
                size={30}
              />
            )}
            {(store.role?.role_permissions.owner ||
              (store.role?.role_permissions.admin &&
                (store.role?.role_permissions.recruiter ||
                  store.role?.role_permissions.hiring_manager)) ||
              store.role?.role_permissions.marketer) && (
              <div
                className={`${"checkBoxContainer"} ${
                  candidate.selected ? "active" : ""
                }`}
              >
                <Checkbox
                  active={candidate.selected}
                  onClick={() => toggleCandidate(index, stage)}
                  size="large"
                />
              </div>
            )}
          </CandidateAvatarOptions>
          <StageCellName
            to={ROUTES.CandidateProfile.url(
              company.mention_tag,
              candidate.professional_id,
              "overview",
              `?applicant_id=${candidate.applicant_id}&job_id=${
                selectedJob.id
              }${isClientJob ? `&client_id=${selectedJob.company.id}` : ""}`
            )}
          >
            {candidate.talent_name}
          </StageCellName>
        </FlexContainer>
        {!overSelfStage && (
          <>
            <CustomSelect
              name="status"
              placeholder="Select a new status"
              style={{
                width: `${
                  statusExchanger[candidate.status]
                    ? statusExchanger[candidate.status].length
                    : 100
                }px`,
              }}
              value={candidate.status}
              options={selectStatusOptions[candidate.stage]}
              onChange={(e) =>
                changeCandidateStatus(
                  candidate,
                  e.target.value,
                  undefined,
                  index
                )
              }
              disabled={!permission.edit}
            >
              {selectStatusOptions[candidate.stage].map((status) => (
                <option
                  value={status.value}
                  key={`option-status-${status.value}`}
                  disabled={status.value === candidate.status}
                >
                  {status.label}
                </option>
              ))}
              {missingStatus && (
                <option value={missingStatus} hidden>
                  {missingStatusExchanger[missingStatus]}
                </option>
              )}
            </CustomSelect>
            <StageCellUpdate>
              Last Update: {date.date()} {date.format("month-short")}{" "}
              {date.year()}
            </StageCellUpdate>
            {/* Check field is present */}
            {candidate.added_by_company || candidate.added_by ? (
              <StageCellUpdate style={{ marginTop: 5 }}>
                {/* Display Submitted by `Company` if the added_by_company doesnt match the current company name, else display the professionals name who added the candidate */}
                {candidate.added_by_company !== company.name ? (
                  <>Submitted by {candidate.added_by_company}</>
                ) : candidate.added_by ? (
                  <>Added by {candidate.added_by}</>
                ) : (
                  ""
                )}
              </StageCellUpdate>
            ) : (
              <StageCellUpdate style={{ marginTop: 5 }}> - </StageCellUpdate>
            )}
            <IconsWrapper>
              <LeftIcons>
                {!isClientJob &&
                  (isCandidateHM ||
                    candidate.approved_by_hm === true ||
                    candidate.approved_by_hm === false) && (
                    <ReviewButton
                      className={isCandidateHM ? "show-button" : ""}
                      onClick={() => {
                        if (isCandidateHM) {
                          openAddReviewerModal(
                            candidate,
                            "review-candidate-as-hm"
                          );
                        }
                      }}
                    >
                      {(candidate.approved_by_hm === null ||
                        candidate.approved_by_hm === undefined) && (
                        <span className="not-reviewed">Review</span>
                      )}
                      {candidate.approved_by_hm && (
                        <span className="approved">Approved</span>
                      )}
                      {candidate.approved_by_hm === false && (
                        <span className="rejected">Not Approved</span>
                      )}
                    </ReviewButton>
                  )}
              </LeftIcons>
              <RightIcons>
                {isClientJob && (
                  <>
                    {!candidate.submitted_to_client &&
                    (store.role?.role_permissions.owner ||
                      (store.role?.role_permissions.admin &&
                        store.role?.role_permissions.recruiter)) ? (
                      <SubmitButton
                        onClick={() =>
                          openAddReviewerModal(
                            candidate,
                            "submit-to-client-modal"
                          )
                        }
                      >
                        Submit to Client
                      </SubmitButton>
                    ) : (
                      candidate.submitted_to_client && (
                        <SubmittedSpan>Submitted</SubmittedSpan>
                      )
                    )}
                  </>
                )}
                {/*!isClientJob && selectedJob && (
              <AvatarContainer className="av-cont">
                <div className="icon-holder">
                  <AvatarIcon
                    name={selectedJob.company.name}
                    imgUrl={selectedJob.company.avatar_url}
                    size={30}
                  />
                </div>
              </AvatarContainer>
            )*/}
                {!isClientJob &&
                  (store.role.role_permissions.owner ||
                    store.role.role_permissions.admin ||
                    store.role.role_permissions.recruiter) &&
                  candidate.hiring_managers &&
                  candidate.hiring_managers.map((participant, index) => (
                    <AvatarContainer className="av-cont" key={index}>
                      <div
                        className="icon-holder"
                        key={`participant-${index}-${stage.stageName}`}
                      >
                        <AvatarIcon
                          name={participant.name}
                          imgUrl={participant.avatar_url}
                          size={30}
                        />
                      </div>
                    </AvatarContainer>
                  ))}
                {!isClientJob &&
                  (store.role.role_permissions.owner ||
                    store.role.role_permissions.admin ||
                    store.role.role_permissions.recruiter) &&
                  availableHiringManagers?.length > 0 && (
                    <AvatarContainer
                      className="av-cont"
                      onClick={() =>
                        openAddReviewerModal(candidate, "assign-contact-modal")
                      }
                    >
                      <svg
                        width="30"
                        height="30"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g fill="none" fill-role="evenodd">
                          <circle fill="#EEE" cx="15" cy="15" r="15" />
                          <path
                            d="M15 9a1 1 0 011 1v4h4a1 1 0 010 2h-4v4a1 1 0 01-2 0v-4h-4a1 1 0 010-2h4v-4a1 1 0 011-1z"
                            fill="#74767B"
                          />
                        </g>
                      </svg>
                    </AvatarContainer>
                  )}
              </RightIcons>
            </IconsWrapper>
            {/*}<EmailButton
              className="email-button"
              onClick={() => setCellModal("email-candidate")}
            >
              <img src={`${AWS_CDN_URL}/icons/EmailIcon.svg`} alt="Email" />
            </EmailButton>*/}
          </>
        )}
        {/*cellModal === "email-candidate" && (
          <MarketingEmailModal
            hide={() => {
              setCellModal(undefined);
            }}
            receivers={[candidate]}
            source="candidate"
          />
        )*/}
      </StageCellST>
    </>
  );
};

const ApplicantDropSeparator = ({ changeCandidateIndex }) => {
  const [{ isOverCurrent }, drop] = useDrop({
    accept: "applicant",
    drop(item, monitor) {
      let candidateDroppable = monitor.getItem();
      changeCandidateIndex(candidateDroppable);
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });
  return (
    <ApplicantDropSeparatorST
      ref={drop}
      className={isOverCurrent ? "over" : ""}
    >
      <div className={isOverCurrent ? "over" : ""}></div>
    </ApplicantDropSeparatorST>
  );
};

export default ApplicantCell;

const ApplicantDropSeparatorST = styled.div`
  padding: 5px 0px;
  /* transition: all 300ms; */
  width: 100%;

  &.over {
    // padding: 20px 0px;
  }

  div {
    border-radius: 4px;
    height: 5px;
    width: 100%;
  }

  .over {
    background: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    height: 100px;
    opacity: 0.5;
  }
`;

const StageCellST = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  cursor: grab;
  margin-bottom: 10px;
  padding: 10px 15px;
  position: relative;

  &.no-show {
    display: none !important;
  }

  &.no-margin {
    margin-bottom: 0px;
  }

  &.dragging {
    opacity: 0;
  }

  &.rejected {
    background: #f8f8f8;

    .av-cont {
      background: #f8f8f8 !important;
    }
  }

  p {
    font-size: 13px;
    line-height: 1;
    margin-bottom: 0;
  }

  span {
    color: #74767b;
    font-size: 13px;
  }
  &:hover {
    .email-button {
      display: initial;
    }
  }
`;

const CandidateIndicator = styled.div`
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  display: flex;
  font-size: 18px;
  font-weight: 800;
  height: 20px;
  justify-content: center;
  position: absolute;
  right: 22px;
  bottom: 54px;
  width: 20px;

  &.none {
    display: none;
  }

  &.orange {
    background: #faa448;
  }

  &.red {
    background: #ff3159;
  }
`;

const StageCellName = styled(Link)`
  color: #000000;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 170px;
  word-break: break-all;
`;

const CustomSelect = styled.select`
  background-color: transparent !important;
  background-position: center right !important;
  border: none;
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 4px;
  width: auto;
`;

const StageCellUpdate = styled.p`
  color: #74767b;
  font-size: 12px !important;
`;

const AvatarContainer = styled.div`
  background: rgb(255, 255, 255);
  border-radius: 50%;
  cursor: pointer;
  height: 34px;
  padding: 2px;
  width: 34px;
  z-index: 1;

  &:not(:first-of-type) {
    margin-left: -10px;
  }
`;

const IconsWrapper = styled.div`
  display: flex;
  height: 30px;
  margin-left: -2px;
  margin-top: 10px;
  justify-content: space-between;
`;

const SubmitButton = styled.button`
  background: #eeeeee;
  border-radius: 15px;
  color: #2a3744;
  font-size: 14px !important;
  font-weight: 500;
  line-height: 1;
  padding: 8px 15px;

  &:hover {
    background: #e1e1e1;
    color: #1f1f1f;
  }
`;

const SubmittedSpan = styled.span`
  background: #eeeeee;
  border-radius: 15px;
  color: #74767a;
  font-size: 14px !important;
  font-weight: 500;
  line-height: 1;
  margin-right: 5px;
  padding: 8px 15px;
  position: relative;
  top: 2px;
`;

const statusExchanger = {
  "invite accepted": { value: "Invited", length: 60 },
  rejected: { value: "Rejected", length: 72 },
  declined: { value: "Declined", length: 72 },
  "to be screened": { value: "To Be Screened", length: 115 },
  "to be submitted": { value: "To Be Submitted", length: 121 },
  "to be approved": { value: "To Be Approved", length: 117 },
  "awaiting review": { value: "Awaiting Review", length: 119 },
  approved: { value: "Approved", length: 78 },
  "assessment sent": { value: "Assessment Sent", length: 125 },
  "assessment returned": { value: "Assessment Returned", length: 155 },
  passed: { value: "Passed", length: 60 },
  interview_requested: { value: "Interview Requested", length: 146 },
  "to be scheduled": { value: "Interview to be Scheduled", length: 181 },
  interview_scheduled: { value: "Interview Scheduled", length: 148 },
  interview_conducted: { value: "Interview Conducted", length: 148 },
  interview_rescheduled: { value: "Interview Rescheduled", length: 152 },
  "to be rescheduled": { value: "Interview to be Rescheduled", length: 195 },
  "invited to event": { value: "Invited to Event", length: 116 },
  "attending event": { value: "Attending Event", length: 116 },
  "to be offered": { value: "To Be Offered", length: 104 },
  "verbally offered": { value: "Verbally Offered", length: 120 },
  "offer sent": { value: "Offer Sent", length: 82 },
  "contract sent": { value: "Contract Sent", length: 105 },
  "verbally accepted": { value: "Verbally Accepted", length: 132 },
  "formally accepted": { value: "Formally Accepted", length: 134 },
  "Gathering Information": { value: "gathering information", length: 154 },
  "gathering information": { value: "gathering information", length: 154 },
  "contract signed": { value: "Contract Signed", length: 120 },
  "start date confirmed": { value: "Start Date Confirmed", length: 150 },
  hired: { value: "Hired", length: 52 },
  invited: { value: "Invited", length: 60 },
  offer_requested: { value: "Offer Requested", length: 120 },
  "hired applicant": { value: "Hired", length: 52 },
};

const exceptionIndicator = {
  rejected: true,
  rejected_manual: true,
  declined: true,
  declined_manual: true,
  hired: true,
  hired_manual: true,
  "hired applicant": true,
};

const declinedIndicator = {
  rejected: true,
  rejected_manual: true,
  declined: true,
  declined_manual: true,
};

const missingStatusExchanger = {
  invited: "Invited",
  declined_manual: "Declined",
  rejected_manual: "Rejected",
};

const CandidateAvatarOptions = styled.div`
  margin-right: 5px;
  position: relative;
  width: 30px;
  height: 30px;

  &:hover {
    .checkBoxContainer {
      display: flex;
    }
  }

  .checkBoxContainer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    border-radius: 50%;
    background: #d4dfea;
    display: none;

    align-items: center;
    justify-content: center;

    &.active {
      display: flex;
    }
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const ReviewButton = styled.button`
  cursor: auto !important;

  &.show-button {
    cursor: pointer !important;
  }
  span {
    display: flex;
    height: min-content;
    padding: 2px 10px;
    border-radius: 10px;
    color: #74767b;
  }

  .not-reviewed {
    background: #eee;
  }
  .approved {
    background: #00cba7;
    color: white;
  }
  .rejected {
    background: #ff3159;
    color: white;
  }
`;

const LeftIcons = styled.div`
  align-items: center;
  display: flex;
`;
const RightIcons = styled.div`
  align-items: center;
  display: flex;
`;

// const EmailIcon = () => (
//   <svg width="14" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path
//       d="M12.633.014L6.997.028 1.362 0h-.003C.6 0 0 .727 0 1.636v7.617c0 .909.601 1.636 1.359 1.636H12.64c.758 0 1.359-.727 1.359-1.636V1.636c0-.91-.596-1.622-1.367-1.622zm-.442 1.123L7.156 5.843l-.019.017-.016.02a.222.222 0 01-.17.075.214.214 0 01-.168-.081l-.016-.02-4.812-4.74 5.042.034 5.194-.011zm.45 8.63H1.36c-.096 0-.261-.186-.261-.514V1.816l4.875 4.816c.247.28.596.443.967.449h.016c.365 0 .706-.155.955-.424l4.997-4.676v7.272c-.006.328-.17.513-.267.513z"
//       fill="#74767B"
//     />
//   </svg>
// );
//
// const EmailButton = styled.button`
//   position: absolute;
//   top: 14px;
//   right: 21px;
//   display: none;
// `;
