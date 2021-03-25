import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import ApplicantCell from "oldContainers/ATS/ManageApplicants/newComponents/ApplicantCell";
import { fetchMoreApplicantsByStageAndStatus } from "helpersV2/applicants";
import notify from "notifications";
import Checkbox from "sharedComponents/Checkbox";
import MarketingEmailModal from "modals/MarketingEmailModal";
import { selectStatusOptions } from "constants/stageOptions";
import { PermissionChecker } from "constants/permissionHelpers";
import { AWS_CDN_URL } from "constants/api";
const SLICE_LENGTH = 10;

const StageColumn = ({
  stage,
  index,
  title,
  candidates,
  setCandidates,
  stageCountVal,
  company,
  jobId,
  session,
  changeCandidateStatus,
  changeCandidateIndex,
  deleteCandidate,
  openAddReviewerModal,
  isClientJob,
  statusFilters,
  setStatusFilters,
  selectedJob,
  permission,
  store,
  toggleCandidate,
  availableHiringManagers,
  canViewAll,
}) => {
  const [hasMore, setHasMore] = useState(undefined);
  const [fetchMore, setFetchMore] = useState(false);
  const [{ isOver, candidateDroppable }, drop] = useDrop({
    accept: "applicant",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      candidateDroppable: monitor.getItem(),
    }),
  });
  const [clearFilters, setClearFilters] = useState(undefined);
  const [activeColumnModal, setActiveColumnModal] = useState(undefined);

  useEffect(() => {
    if (candidates && hasMore === undefined)
      setHasMore(candidates[stage].length === SLICE_LENGTH);
  }, [candidates]);

  useEffect(() => {
    if (fetchMore) {
      fetchMoreApplicantsByStageAndStatus(
        company.id,
        jobId,
        stage,
        `${candidates[stage].length},${SLICE_LENGTH}`,
        session,
        statusFilters[stage]
      ).then((res) => {
        if (!res.err) {
          setCandidates({
            ...candidates,
            [stage]: [...candidates[stage], ...res],
          });
          Promise.resolve(setHasMore(res.length === SLICE_LENGTH)).then(() =>
            setFetchMore(false)
          );
        } else {
          notify("danger", "Unable to fetch applicants");
        }
      });
    }
  }, [fetchMore]);

  useEffect(() => {
    if (statusFilters[stage]) {
      fetchMoreApplicantsByStageAndStatus(
        company.id,
        jobId,
        stage,
        `0,${SLICE_LENGTH}`,
        session,
        statusFilters[stage]
      ).then((res) => {
        if (!res.err) {
          setCandidates({
            ...candidates,
            [stage]: res,
          });
          Promise.resolve(setHasMore(res.length === SLICE_LENGTH)).then(() =>
            setFetchMore(false)
          );
        } else {
          notify("danger", "Unable to fetch applicants");
        }
      });
    }
  }, [statusFilters[stage]]);

  useEffect(() => {
    if (clearFilters) {
      fetchMoreApplicantsByStageAndStatus(
        company.id,
        jobId,
        stage,
        `0,${SLICE_LENGTH}`,
        session,
        statusFilters[stage]
      ).then((res) => {
        if (!res.err) {
          setCandidates({
            ...candidates,
            [stage]: res,
          });
          setClearFilters(undefined);
          Promise.resolve(setHasMore(res.length === SLICE_LENGTH)).then(() =>
            setFetchMore(false)
          );
        } else {
          notify("danger", "Unable to fetch applicants");
        }
      });
    }
  }, [clearFilters]);

  const toggleAllStageCandidates = () => {
    toggleStageCandidates(candidates, setCandidates, stage);
  };

  return (
    <ColumnWrapper ref={drop}>
      <StageBox
        deleteCandidate={deleteCandidate}
        title={title}
        stageCountVal={stageCountVal}
        stage={stage}
        index={index}
        isOverParent={isOver}
        activeFilterStatus={statusFilters[stage]}
        setActiveFilterStatus={(newStatus) =>
          setStatusFilters({ ...statusFilters, [stage]: newStatus })
        }
        setClearFilters={setClearFilters}
        totalStages={Object.keys(candidates).length}
        toggleAllStageCandidates={toggleAllStageCandidates}
        allSelected={
          candidates[stage].filter((cand) => cand.selected).length ===
            candidates[stage].length && candidates[stage].length !== 0
        }
        stageCandidates={candidates[stage]}
        selectedStageCandidates={candidates[stage].filter(
          (cand) => cand.selected
        )}
        setActiveColumnModal={setActiveColumnModal}
        store={store}
      />
      <StatusOptionsContainer
        className={
          isOver && candidateDroppable && candidateDroppable.stage !== stage
            ? "display"
            : ""
        }
      >
        {selectStatusOptions[stage] &&
          selectStatusOptions[stage].map((status) => (
            <StatusBox
              status={status}
              stage={stage}
              stageCountVal={stageCountVal}
              key={`status-stage-${status.value}`}
              changeCandidateStatus={changeCandidateStatus}
            />
          ))}
      </StatusOptionsContainer>
      <ColumnBody>
        <InfiniteScroller
          fetchMore={() => setFetchMore(true)}
          hasMore={hasMore}
          dataLength={candidates[stage].length}
          height={window.innerHeight - 310}
        >
          {(!isOver ||
            (candidateDroppable && candidateDroppable.stage === stage)) && (
            <>
              {candidates[stage] &&
                candidates[stage].map((candidate, ix) => (
                  <ApplicantCell
                    stage={stage}
                    index={ix}
                    candidate={candidate}
                    key={`${candidate}-${ix}`}
                    overSelfStage={
                      isOver &&
                      !statusFilters[stage] &&
                      candidateDroppable &&
                      candidateDroppable.stage === stage
                    }
                    changeCandidateStatus={changeCandidateStatus}
                    changeCandidateIndex={changeCandidateIndex}
                    openAddReviewerModal={openAddReviewerModal}
                    company={company}
                    isClientJob={isClientJob}
                    selectedJob={selectedJob}
                    permission={permission}
                    store={store}
                    toggleCandidate={toggleCandidate}
                    availableHiringManagers={availableHiringManagers}
                    canViewAll={canViewAll}
                  />
                ))}
            </>
          )}
        </InfiniteScroller>
      </ColumnBody>
      {activeColumnModal === "email-candidates" && (
        <MarketingEmailModal
          hide={() => {
            setActiveColumnModal(undefined);
          }}
          receivers={candidates[stage].filter((cand) => cand.selected)}
          source="candidate"
        />
      )}
    </ColumnWrapper>
  );
};

const StatusBox = ({ status, stage, stageCountVal, changeCandidateStatus }) => {
  const [{ isOverCurrent }, drop] = useDrop({
    accept: "applicant",
    drop(item, monitor) {
      let candidateDroppable = monitor.getItem();
      changeCandidateStatus(candidateDroppable, status.value, stage);
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });
  return (
    <StatusBoxST ref={drop} className={isOverCurrent ? "over" : ""}>
      <div>
        <span>{status.label}</span>
        <span className="stage-indicator">
          {stageCountVal[stage]
            ? stageCountVal[stage][statusCountExchanger[status.value]]
            : ""}
        </span>
      </div>
    </StatusBoxST>
  );
};

const StageBox = ({
  deleteCandidate,
  title,
  stageCountVal,
  stage,
  index,
  isOverParent,
  activeFilterStatus,
  setActiveFilterStatus,
  setClearFilters,
  totalStages,
  toggleAllStageCandidates,
  allSelected,
  stageCandidates,
  selectedStageCandidates,
  setActiveColumnModal,
  store,
}) => {
  const [{ isOverCurrent, candidateDroppable }, drop] = useDrop({
    accept: "applicant",
    drop(item, monitor) {
      let candidateDroppable = monitor.getItem();
      deleteCandidate(candidateDroppable);
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
      candidateDroppable: monitor.getItem(),
    }),
  });

  const clearSelectStatus = () => {
    setActiveFilterStatus(undefined);
    setClearFilters(Math.random());
    let selectBox = document.getElementById(`filter-select-${stage}`);
    if (selectBox) {
      selectBox.selectedIndex = 0;
    }
  };

  return (
    <ColumnHeader
      ref={drop}
      className={isOverCurrent && "delete"}
      // className="delete"
    >
      {(isOverCurrent || isOverParent) &&
      candidateDroppable &&
      candidateDroppable.stage === stage ? (
        <DeleteContainer className={isOverCurrent && "test"}>
          <div>Remove Candidate</div>
          <div>
            <svg
              width="16"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              xlinkHref="http://www.w3.org/1999/xlink"
            >
              <path
                d="M9.23 0c.995 0 1.804.809 1.804 1.803v.615H16V3.65h-1.276L13.63 17.854c-.076.99-.945 1.795-1.939 1.795H4.308c-.994 0-1.863-.805-1.939-1.795L1.276 3.649H0V2.42h4.966v-.616C4.966.81 5.776 0 6.77 0h2.462zm4.26 3.65H2.51l1.086 14.11c.027.35.36.658.712.658h7.384a.745.745 0 00.712-.658l1.085-14.11zM6.11 2.417h3.78v-.615a.66.66 0 00-.66-.658H6.77a.66.66 0 00-.66.658v.615zM4.924 6.111h1.23v9.846h-1.23V6.11zm2.462 0h1.23v9.846h-1.23V6.11zm2.461 0h1.23v9.846h-1.23V6.11z"
                fill="#000"
                fill-role="nonzero"
              />
            </svg>
          </div>
        </DeleteContainer>
      ) : (
        <>
          <div className="flex-wrapper title">
            <p>
              {(store.role?.role_permissions.owner ||
                (store.role?.role_permissions.admin &&
                  (store.role?.role_permissions.recruiter ||
                    store.role?.role_permissions.hiring_manager)) ||
                store.role?.role_permissions.marketer) &&
                stageCandidates?.length > 0 && (
                  <Checkbox
                    active={allSelected}
                    onClick={() => toggleAllStageCandidates()}
                    style={{ marginRight: "5px" }}
                  />
                )}
              {title}
            </p>
            {selectedStageCandidates.length > 0 && (
              <PermissionChecker valid={{ marketer: true }} type="view">
                <EmailButton
                  onClick={() => setActiveColumnModal("email-candidates")}
                >
                  <img src={`${AWS_CDN_URL}/icons/EmailIcon.svg`} alt="Email" />
                </EmailButton>
              </PermissionChecker>
            )}
            <span className={activeFilterStatus ? "filtered" : ""}>
              {activeFilterStatus &&
                stageCountVal[stage][statusCountExchanger[activeFilterStatus]]}
              {!activeFilterStatus && (
                <>
                  {!stageCountVal[stage]
                    ? ""
                    : stageCountVal[stage].rejected ===
                      stageCountVal[stage].total
                    ? "0"
                    : stageCountVal[stage].total}
                </>
              )}
            </span>
          </div>
          <div className="flex-wrapper">
            <CustomSelect
              name="status"
              placeholder="Filter by status"
              value={activeFilterStatus}
              options={selectStatusOptions[stage] || []}
              onChange={(e) => setActiveFilterStatus(e.target.value)}
              defaultValue=""
              id={`filter-select-${stage}`}
            >
              <option value="" disabled hidden>
                Filter by status
              </option>
              {selectStatusOptions[stage] &&
                selectStatusOptions[stage].map((status) => (
                  <option
                    value={status.value}
                    key={`option-status-${status.value}`}
                  >
                    {status.label}
                  </option>
                ))}
            </CustomSelect>
            {activeFilterStatus && (
              <ClearButton onClick={clearSelectStatus}>Clear</ClearButton>
            )}
          </div>
          <StageIndicator num={index + 1} total={totalStages} />
        </>
      )}
    </ColumnHeader>
  );
};

const StageIndicator = ({ num, total }) => {
  const [Rows, setRows] = useState({ Render: () => null });
  useEffect(() => {
    if ((num || num === 0) && total) {
      let arr = [];
      for (let i = 0; i < total; i++) {
        arr.push(
          <div
            key={`stage-indicator-${i}`}
            className={num > i ? "active" : ""}
          ></div>
        );
      }
      setRows({ Render: () => <>{arr}</> });
    }
  }, [num, total]);

  return (
    <StageIndicatorST>
      <Rows.Render />
    </StageIndicatorST>
  );
};

export default StageColumn;

const statusCountExchanger = {
  invited: "invited",
  "invite accepted": "invite_accepted",
  rejected: "rejected",
  declined: "declined",
  "to be screened": "to_be_screened",
  "to be submitted": "to_be_submitted",
  "to be approved": "to_be_approved",
  "awaiting review": "awaiting_review",
  approved: "approved",
  "assessment sent": "assessment sent",
  "assessment returned": "assessment returned",
  passed: "passed",
  interview_requested: "interview_requested",
  "to be scheduled": "to_be_scheduled",
  interview_scheduled: "scheduled",
  interview_conducted: "conducted",
  interview_rescheduled: "rescheduled",
  "to be rescheduled": "to_be_rescheduled",
  "invited to event": "invited_to_event",
  "attending event": "attending_event",
  "to be offered": "to_be_offered",
  "verbally offered": "verbally_offered",
  // offerStatus: "",
  "offer sent": "offer_sent",
  offer_requested: "offer_requested",
  "contract sent": "contract_sent",
  "verbally accepted": "verbally_accepted",
  "formally accepted": "formally_accepted",
  "gathering information": "gathering_information",
  "contract signed": "contract_signed",
  "start date confirmed": "start_date_confirmed",
  hired: "hired_applicant",
};

const toggleStageCandidates = (candidates, setCandidates, stage) => {
  let newCandidates = { ...candidates };
  let stageCandidates = [...newCandidates[stage]];
  let bool =
    stageCandidates.filter((cand) => cand.selected).length !==
    stageCandidates.length;
  stageCandidates = stageCandidates.map((cand) => {
    return { ...cand, selected: bool };
  });
  newCandidates[stage] = stageCandidates;
  setCandidates(newCandidates);
};

const StatusBoxST = styled.div`
  background: #74767b;
  border-radius: 4px;
  color: #fff;
  margin: 10px 0px;
  padding: 10px 15px;

  &.over {
    background: #00cba7;
    height: 100px;
    /* transition: all 400ms; */
  }

  div {
    align-items: center;
    display: flex;
    font-size: 14px;
    font-weight: 500;
    justify-content: space-between;
    line-height: 1;

    .stage-indicator {
      align-items: center;
      background-color: white;
      border-radius: 2px;
      color: #1f1f1f;
      display: flex;
      font-size: 10px;
      font-weight: 500;
      height: 18px;
      justify-content: center;
      /* margin-left: 8px; */
      padding: 0 6px;
    }
  }
`;

const StatusOptionsContainer = styled.div`
  max-height: 0px;
  overflow: hidden;
  width: 100%;
  /* transition: all 500ms; */

  &.display {
    max-height: none;
  }
`;

const ColumnWrapper = styled.div`
  flex: 0 0 auto;
  margin-right: 10px;
  width: 250px;
`;

const ColumnHeader = styled.div`
  position: relative;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
  height: 80px;
  margin-bottom: 10px;
  padding: 15px;

  &.delete {
    background: #ff3159;
    color: #fff;

    svg {
      path {
        fill: #fff;
      }
    }
  }

  .flex-wrapper {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    &.title {
      margin-bottom: 5px;

      p {
        display: flex;
        align-items: center;
      }
    }

    p {
      font-size: 15px;
      font-weight: 500;
      /* line-height: 1; */
      margin-bottom: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 220px;
    }

    span {
      align-items: center;
      background-color: #74767b;
      border-radius: 2px;
      color: #fff;
      display: flex;
      font-size: 10px;
      font-weight: 500;
      height: 18px;
      justify-content: center;
      margin-left: 8px;
      padding: 0 6px;

      &.filtered {
        background: #0a2444;
      }
    }
  }
`;

const DeleteContainer = styled.div`
  align-items: center;
  display: flex;
  font-size: 15px;
  font-weight: 500;
  justify-content: space-between;
  height: 100%;
`;

const ColumnBody = styled.div`
  /* min-height: 1000px; */
`;

const StageIndicatorST = styled.div`
  display: flex;

  div {
    background: #d8d8d8;
    height: 2px;
    width: 100%;

    &:not(:last-of-type) {
      margin-right: 2px;
    }

    &.active {
      background: #00cba7;
    }
  }
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
  color: grey;
  width: 70%;
`;

const ClearButton = styled.button`
  color: #1f1f1f;
  font-size: 12px !important;
  font-weight: 500;
  line-height: 1;

  &:hover {
    text-decoration: underline;
  }
`;

const EmailButton = styled.button`
  position: absolute;
  top: 14px;
  right: 50px;
`;
