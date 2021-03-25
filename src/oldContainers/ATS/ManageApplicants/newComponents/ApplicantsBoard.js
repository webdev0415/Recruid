import React, { useState, useEffect, Suspense } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import styled from "styled-components";
import StageColumn from "oldContainers/ATS/ManageApplicants/newComponents/StageColumn";
import {
  fetchChangeCandidateStatus,
  fetchChangeCandidateIndex,
  fetchRemoveCandidate,
  addHiringManagers,
  removeHiringManagers,
} from "helpersV2/applicants";

import { submitCandidatesToClient } from "oldContainers/ATS/ManageApplicants/helpers/ManageApplicantFetchers";
import notify from "notifications";
import retryLazy from "hooks/retryLazy";
import ConfirmModalV2 from "modals/ConfirmModalV2";
import MarketingEmailModal from "modals/MarketingEmailModal";
import CreateListModal from "modals/CreateListModal";
import { stageTitles } from "constants/stageOptions";

const RejectionModal = React.lazy(() =>
  retryLazy(() => import("modals/RejectionModal"))
);
const StartDateModal = React.lazy(() =>
  retryLazy(() => import("modals/StartDateModal"))
);
const AssignHiringManagerModal = React.lazy(() =>
  retryLazy(() => import("modals/AssignHiringManagerModal"))
);
const SubmitToClientModal = React.lazy(() =>
  retryLazy(() => import("modals/SubmitToClientModal"))
);
const InterviewModal = React.lazy(() =>
  retryLazy(() => import("modals/InterviewModal/InterviewModal.js"))
);

const ReviewAsHMModal = React.lazy(() =>
  retryLazy(() => import("modals/ReviewAsHMModal"))
);

const SLICE_LENGHT = 10;

const ApplicantsBoard = ({
  candidates,
  setCandidates,
  stageCountVal,
  company,
  jobId,
  session,
  triggerStagesUpdate,
  selectedJob,
  teamMembers,
  teamMember,
  triggerAddCandidateModal,
  interviewStages,
  triggerCandidatesUpdate,
  permission,
  store,
  activeParentModal,
  setActiveParentModal,
  selectedCandidates,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState(undefined);
  const [droppedCandidate, setDroppedCandidate] = useState(undefined);
  const [newStatus, setNewStatus] = useState(undefined);
  const [newStage, setNewStage] = useState(undefined);
  const [selectedCandidateIndex, setSelectedCadidateIndex] = useState(
    undefined
  );
  const [boardModal, setBoardModal] = useState(undefined);
  const [newResCandidate, setNewResCandidate] = useState(undefined);
  const [statusFilters, setStatusFilters] = useState({
    applied: undefined,
    shortlisted: undefined,
    submitted_to_hiring_manager: undefined,
    assessment_stage: undefined,
    interview_stage_zero: undefined,
    interview_stage_one: undefined,
    interview_stage_two: undefined,
    interview_stage_three: undefined,
    interview_stage_four: undefined,
    offer_pending: undefined,
    onboarding: undefined,
    offered: undefined,
    hired: undefined,
  });
  const [deleting, setDeleting] = useState(false);
  const [canViewAll, setcanViewAll] = useState(false);
  const [availableHiringManagers, setAvailableHiringManagers] = useState([]);

  useEffect(() => {
    if (
      store.role &&
      (store.role.role_permissions.owner ||
        store.role.role_permissions.admin ||
        store.role.role_permissions.recruiter)
    ) {
      setcanViewAll(true);
    }
  }, [store.role]);

  useEffect(() => {
    if (store.teamMembers && selectedJob && store.role) {
      setAvailableHiringManagers(
        store.teamMembers.filter(
          (member) =>
            member.roles.includes("hiring_manager") &&
            selectedJob.assigned_team_member_ids.indexOf(
              member.team_member_id
            ) !== -1
        )
      );
    }
  }, [selectedJob, store.teamMembers, store.role]);

  useEffect(() => {
    if (newResCandidate) {
      replaceWithNewCandidate(
        newResCandidate,
        candidates,
        setCandidates,
        setNewResCandidate
      );
    }
  }, [newResCandidate, candidates, setCandidates]);

  const changeCandidateStatus = (candidate, nStatus, nStage, arrIndex) => {
    if (!candidate) return;
    if (
      promptModal[nStatus] &&
      !(
        selectedJob.job_type === "temp" &&
        (nStatus === "start date confirmed" || nStatus === "hired")
      )
    ) {
      setBoardModal(promptModal[nStatus]);
      if (candidate.sourceIndex || candidate.sourceIndex === 0) {
        setDroppedCandidate(candidate);
        setSelectedCandidate(
          candidates[candidate.stage][candidate.sourceIndex]
        );
      } else {
        setSelectedCandidate(candidate);
      }
      setSelectedCadidateIndex(candidate.sourceIndex || arrIndex);
      setNewStatus(nStatus);
      if (nStage && nStage !== candidate.stage) setNewStage(nStage);
    } else {
      let candidatesCopy = { ...candidates };
      if (nStage && nStage !== candidate.stage) {
        updateBoardForCandidateStageAndStatus(
          candidate,
          nStatus,
          nStage,
          candidates,
          setCandidates
        );
      }
      let missingInfo;
      if (
        selectedJob.job_type === "temp" &&
        (nStatus === "start date confirmed" || nStatus === "hired")
      ) {
        missingInfo = {
          salary_rate: 0,
          final_fee: 0,
        };
      }
      fetchChangeCandidateStatus(
        company.id,
        candidate.applicant_id,
        nStatus,
        nStage,
        session,
        missingInfo
      ).then((res) => {
        if (!res.err) {
          notify("info", "Candidate status succesfully changed");
          triggerStagesUpdate(Math.random());
          if (!nStage || nStage === candidate.stage) {
            updateBoardForCandidateStatus(
              res,
              arrIndex,
              candidates,
              setCandidates
            );
          }
          setNewResCandidate(res);
        } else {
          notify("danger", "Unable to change status at the moment");
          if (nStage && nStage !== candidate.stage)
            setCandidates(candidatesCopy);
        }
      });
    }
  };
  //change candidate status from modal with extra info
  const confirmChangeCandidateStatus = (missingInfo) => {
    if (!selectedCandidate) return;
    fetchChangeCandidateStatus(
      company.id,
      selectedCandidate.applicant_id,
      newStatus,
      newStage,
      session,
      missingInfo
    )
      .then((res) => {
        if (!res.err) {
          notify("info", "Candidate status succesfully changed");
          triggerStagesUpdate(Math.random());
          if (newStage) {
            updateBoardForCandidateStageAndStatus(
              droppedCandidate,
              newStatus,
              newStage,
              candidates,
              setCandidates
            );
            setNewResCandidate(res);
          } else {
            updateBoardForCandidateStatus(
              res,
              selectedCandidateIndex,
              candidates,
              setCandidates
            );
          }
        } else {
          notify("danger", "Unable to change status at the moment");
        }
      })
      .finally(() => {
        setDroppedCandidate(undefined);
        setSelectedCadidateIndex(undefined);
        setNewStatus(undefined);
        if (boardModal !== "schedule-interview-modal") {
          setBoardModal(undefined);
          setSelectedCandidate(undefined);
        }
      });
  };
  //CHANGE CANDIDATE POSITIONING IN THE SAME STAGE WITH ON DROP FUNCTIONALITY
  const changeCandidateIndex = async (
    candidateDroppable,
    indexPos,
    indexProp
  ) => {
    if (!candidateDroppable) return;
    let candidatesCopy = { ...candidates };
    updateBoardForCandidateIndex(
      candidateDroppable,
      indexPos,
      indexProp,
      candidates,
      setCandidates
    );
    fetchChangeCandidateIndex(
      company.id,
      candidateDroppable.applicant_id,
      indexProp,
      session
    ).then((res) => {
      if (!res.err) {
        notify("info", "Candidate position succesfully changed");
      } else {
        notify("danger", "Unable to change candidate position at the moment");
        setCandidates(candidatesCopy);
      }
    });
  };

  const deleteCandidate = (droppedCandidate) => {
    if (!droppedCandidate) return;
    let candidatesCopy = { ...candidates };
    updateBoardForCandidateRemove(droppedCandidate, candidates, setCandidates);
    fetchRemoveCandidate(
      company.id,
      droppedCandidate.applicant_id,
      session
    ).then((res) => {
      if (!res.err) {
        notify("info", "Candidate succesfully deleted");
      } else {
        notify("danger", "Unable to delete candidate at the moment");
        setCandidates(candidatesCopy);
      }
    });
  };

  const closeBoardModal = () => {
    setSelectedCandidate(undefined);
    setDroppedCandidate(undefined);
    setSelectedCadidateIndex(undefined);
    setNewStatus(undefined);
    setNewStage(undefined);
    setBoardModal(undefined);
  };

  const openAddReviewerModal = (candidate, modalName) => {
    setSelectedCandidate(candidate);
    setBoardModal(modalName);
  };

  const addRemoveReviewers = (
    hiringManagersToAdd,
    hiringManagersToRemove,
    emailBody
  ) => {
    if (hiringManagersToAdd && hiringManagersToAdd.length > 0) {
      addHiringManagers(
        company.id,
        selectedCandidate.applicant_id,
        session,
        hiringManagersToAdd,
        emailBody,
        store.role.team_member.team_member_id
      )
        .then((res) => {
          if (!res.err) {
            setNewResCandidate(res);
            notify("info", "Hiring managers succesfully added");
          } else {
            notify("danger", "Unable to add hiring managers");
          }
        })
        .finally(() => {
          closeBoardModal();
        });
    }
    if (hiringManagersToRemove && hiringManagersToRemove.length > 0) {
      removeHiringManagers(
        company.id,
        selectedCandidate.applicant_id,
        session,
        hiringManagersToRemove
      )
        .then((res) => {
          if (!res.err) {
            setNewResCandidate(res);
            notify("info", "Hiring managers succesfully deleted");
          } else {
            notify("danger", "Unable to remove hiring managers");
          }
        })
        .finally(() => {
          closeBoardModal();
        });
    }
    if (
      (!hiringManagersToAdd || hiringManagersToAdd.length === 0) &&
      (!hiringManagersToRemove || hiringManagersToRemove.length === 0)
    ) {
      closeBoardModal();
    }
  };

  const submitCandidateToClient = (
    docIds,
    emailBody,
    contactId,
    justSubmit
  ) => {
    if (company.type !== "Agency" || selectedCandidate.submitted_to_client) {
      closeBoardModal();
      return;
    }
    submitCandidatesToClient(
      selectedJob.company.id,
      [selectedCandidate.applicant_id],
      session,
      company.id,
      docIds,
      emailBody,
      contactId,
      justSubmit
    ).then((res) => {
      if (res !== "err") {
        let selectedCandidateCopy = { ...selectedCandidate };
        selectedCandidateCopy.submitted_to_client = true;
        setNewResCandidate(selectedCandidateCopy);
        if (
          selectedCandidate.stage === "applied" ||
          selectedCandidate.stage === "shortlisted"
        ) {
          triggerCandidatesUpdate(Math.random());
        }

        closeBoardModal();
      } else {
        notify("danger", "Unable to submit candidate at the moment");
      }
    });
  };

  const findInterviewStageTitle = (stageProp) => {
    let match;
    if (interviewStages) {
      interviewStages.map((stage) =>
        stage.static_name === stageProp ? (match = stage.name) : null
      );
    }
    return match;
  };

  const toggleCandidate = (candidateIndex, stageName) => {
    toggleSingleCandidateMethod(
      candidateIndex,
      stageName,
      candidates,
      setCandidates
    );
  };

  const deleteMultiple = () => {
    let parsedCorrectly = 0;
    let parsedIncorrectly = 0;
    let count = 0;
    setDeleting(true);
    const recursiveDelete = (index, candsLeft) => {
      if (candsLeft === 0 || index === selectedCandidates.length) {
        setDeleting(false);
        return;
      }
      candsLeft--;
      index++;
      fetchRemoveCandidate(
        company.id,
        selectedCandidates[index].applicant_id,
        session
      )
        .then((res) => {
          if (!res.err) {
            parsedCorrectly++;
          } else {
            parsedIncorrectly++;
          }
          count++;
          if (count === selectedCandidates.length) {
            setActiveParentModal(undefined);
            triggerCandidatesUpdate(Math.random());
            if (parsedCorrectly) {
              notify("info", "Candidates succesfully removed");
            }
            if (parsedIncorrectly) {
              notify("info", "Unable to remove some candidate at the moment");
            }
          }
          recursiveDelete(index, candsLeft);
        })
        .catch(() => recursiveDelete(index, candsLeft));
    };

    recursiveDelete(-1, selectedCandidates.length);
  };

  return (
    <>
      {candidates &&
      (checkHasCandidates(candidates) || checkHasFilters(statusFilters)) &&
      stageCountVal ? (
        <DndProvider backend={HTML5Backend}>
          <ManagerWrapper>
            {Object.keys(candidates).map((stage, index) => (
              <StageColumn
                candidates={candidates}
                setCandidates={setCandidates}
                stage={stage}
                index={index}
                key={`stage-${index}`}
                title={stageTitles[stage] || findInterviewStageTitle(stage)}
                stageCountVal={stageCountVal}
                company={company}
                jobId={jobId}
                session={session}
                changeCandidateStatus={changeCandidateStatus}
                changeCandidateIndex={changeCandidateIndex}
                deleteCandidate={deleteCandidate}
                openAddReviewerModal={openAddReviewerModal}
                isClientJob={
                  company.type === "Agency" &&
                  company.id !== selectedJob.company.id
                }
                selectedJob={selectedJob}
                statusFilters={statusFilters}
                setStatusFilters={setStatusFilters}
                permission={permission}
                store={store}
                toggleCandidate={toggleCandidate}
                canViewAll={canViewAll}
                availableHiringManagers={availableHiringManagers}
              />
            ))}
          </ManagerWrapper>
        </DndProvider>
      ) : candidates && stageCountVal ? (
        <NoCandidatesContainer>
          <h2>You have no candidates for this job</h2>
          {(store.role?.role_permissions.owner ||
            store.role?.role_permissions.admin ||
            store.role?.role_permissions.recruiter) &&
            !(
              (store.company.invited_by_agency ||
                store.allMyCompanies[0].invited_by_employer) &&
              store.allMyCompanies[0].trial !== "upgraded"
            ) && (
              <>
                <p>Click the button below to add some candidates.</p>
                <button
                  className="button button--default button--blue-dark"
                  onClick={() => triggerAddCandidateModal(Math.random())}
                >
                  {company.type === "Agency"
                    ? "Shortlist Candidates"
                    : "Add Candidates"}
                </button>
              </>
            )}
        </NoCandidatesContainer>
      ) : null}
      {boardModal === "rejection-modal" && selectedCandidate && (
        <Suspense fallback={<div />}>
          <RejectionModal
            show={true}
            hide={closeBoardModal}
            name={selectedCandidate.talent_name}
            userAvatar={selectedCandidate.avatar_url}
            subTitle={`Applied for ${selectedJob.title} at ${company.name}`}
            confirmChangeCandidateStatus={confirmChangeCandidateStatus}
            status={newStatus}
            store={store}
            jobTitle={selectedJob.title}
          />
        </Suspense>
      )}
      {boardModal === "start-date-modal" && selectedCandidate && (
        <Suspense fallback={<div />}>
          <StartDateModal
            show={true}
            hide={closeBoardModal}
            name={selectedCandidate.talent_name}
            userAvatar={selectedCandidate.avatar_url}
            subTitle={`Applied for ${selectedJob.title} at ${company.name}`}
            confirmChangeCandidateStatus={confirmChangeCandidateStatus}
            selectedJob={selectedJob}
            salary={selectedCandidate.salary}
            startDate={selectedCandidate.start_date}
            finalFee={selectedCandidate.final_fee}
            status={newStatus}
          />
        </Suspense>
      )}
      {boardModal === "assign-contact-modal" && selectedCandidate && (
        <Suspense fallback={<div />}>
          <AssignHiringManagerModal
            show={true}
            hide={closeBoardModal}
            candidate={selectedCandidate}
            store={store}
            addRemoveReviewers={addRemoveReviewers}
            selectedJob={selectedJob}
            availableHiringManagers={availableHiringManagers}
          />
        </Suspense>
      )}
      {boardModal === "review-candidate-as-hm" && selectedCandidate && (
        <Suspense fallback={<div />}>
          <ReviewAsHMModal
            show={true}
            hide={closeBoardModal}
            candidate={selectedCandidate}
            store={store}
            selectedJob={selectedJob}
            triggerStagesUpdate={triggerStagesUpdate}
          />
        </Suspense>
      )}

      {boardModal === "submit-to-client-modal" && (
        <Suspense fallback={<div />}>
          <SubmitToClientModal
            show={true}
            hide={closeBoardModal}
            name={selectedCandidate?.talent_name}
            userAvatar={selectedCandidate?.avatar_url}
            subTitle={`Applied for ${selectedJob.title} at ${company.name}`}
            candidate={selectedCandidate}
            submitCandidateToClient={submitCandidateToClient}
            company={company}
            session={session}
            job={selectedJob}
          />
        </Suspense>
      )}
      {boardModal === "schedule-interview-modal" && selectedCandidate && (
        <Suspense fallback={<div />}>
          <InterviewModal
            show={true}
            hide={closeBoardModal}
            companyId={company.id}
            company={company}
            teamMembers={teamMembers}
            statusMode={newStatus}
            teamMemberId={teamMember.team_member_id}
            // applicant manager properties
            applicantManager={true}
            selectedJob={selectedJob}
            name={selectedCandidate.talent_name}
            jobId={jobId}
            selectedCandidate={selectedCandidate}
            index={undefined}
            updateApplicantData={confirmChangeCandidateStatus}
            setStageCount={() => {}}
          />
        </Suspense>
      )}
      {activeParentModal === "delete-multiple" && (
        <ConfirmModalV2
          show={true}
          hide={() => {
            setActiveParentModal(undefined);
          }}
          loading={deleting}
          header={!deleting ? "Remove Candidates" : "Removing candidates"}
          text={
            "Are you sure you want to remove these professionals from the job?"
          }
          actionText="Remove"
          actionFunction={deleteMultiple}
          id="remove-multiple"
        />
      )}
      {activeParentModal === "create-email" && (
        <MarketingEmailModal
          hide={() => {
            setActiveParentModal(undefined);
          }}
          receivers={selectedCandidates}
          source="candidate"
        />
      )}
      {activeParentModal === "create_list_from_candidates" && (
        <CreateListModal
          hide={() => {
            setActiveParentModal(undefined);
          }}
          modalType="create_with_candidates"
          refreshList={() => {}}
          parentReceivers={selectedCandidates}
        />
      )}
      {activeParentModal === "add_candidates_to_list" && (
        <CreateListModal
          hide={() => {
            setActiveParentModal(undefined);
          }}
          modalType="add_candidates_to_list"
          refreshList={() => {}}
          parentReceivers={selectedCandidates}
        />
      )}
    </>
  );
};

//CHANGE CANDIDATE STATE WITH SELECT
//UPDATE BOARD WITH NEW CANDIDATE
const updateBoardForCandidateStatus = (
  candidate,
  index,
  candidates,
  setCandidates
) => {
  if (!candidate) return;
  let candidatesCopy = { ...candidates };
  if (!candidatesCopy[candidate.stage]) return;
  let stageCandidatesCopy = [...candidatesCopy[candidate.stage]];
  if (!declinedRejectedCheck[candidate.status]) {
    stageCandidatesCopy[index] = candidate;
    candidatesCopy[candidate.stage] = stageCandidatesCopy;
  } else {
    let firstSlice = stageCandidatesCopy.slice(0, index);
    let secondSlice = stageCandidatesCopy.slice(
      index + 1,
      stageCandidatesCopy.length - 1
    );

    secondSlice = secondSlice.map((cand) => {
      return { ...cand, index: cand.index + 1 };
    });
    if (stageCandidatesCopy.length % SLICE_LENGHT !== 0) {
      candidatesCopy[candidate.stage] = [
        ...firstSlice,
        ...secondSlice,
        candidate,
      ];
    } else {
      candidatesCopy[candidate.stage] = [...firstSlice, ...secondSlice];
    }
  }

  setCandidates(candidatesCopy);
};

//CHANGE CANDIDATE STATUS BY DRAGGING TO A DIFFFERENT COLUMN
const updateBoardForCandidateStageAndStatus = (
  candidateDroppable,
  nStatus,
  nStage,
  candidates,
  setCandidates
) => {
  if (!candidateDroppable) return;
  let newCandidates = { ...candidates };
  if (!newCandidates[candidateDroppable.stage]) return;
  let oldStageCandidates = [...newCandidates[candidateDroppable.stage]];
  let newStageCandidates = [...newCandidates[nStage]];
  let currentCandidate = {
    ...oldStageCandidates[candidateDroppable.sourceIndex],
  };

  let firstSlice = oldStageCandidates.slice(0, candidateDroppable.sourceIndex);
  currentCandidate.index =
    newStageCandidates.length > 0 ? newStageCandidates[0].index + 1 : 0;
  currentCandidate.status = nStatus;
  currentCandidate.stage = nStage;
  currentCandidate.last_action = Date.now();
  let lastSlice = oldStageCandidates.slice(
    candidateDroppable.sourceIndex + 1,
    oldStageCandidates.length
  );
  firstSlice = firstSlice.map((cand) => {
    return { ...cand, index: cand.index - 1 };
  });

  oldStageCandidates = [...firstSlice, ...lastSlice];
  if (!declinedRejectedCheck[nStatus]) {
    newStageCandidates.unshift(currentCandidate);
  } else {
    newStageCandidates = newStageCandidates.map((cand) => {
      return { ...cand, index: cand.index + 1 };
    });
    if (newStageCandidates.length % SLICE_LENGHT !== 0) {
      newStageCandidates.push(currentCandidate);
    }
  }

  newCandidates[candidateDroppable.stage] = oldStageCandidates;
  newCandidates[nStage] = newStageCandidates;
  setCandidates(newCandidates);
};

//UPDATE CANDIDATE POSITION IN THE LIST BY DRAGGING BETWEEN CANDIDATES
const updateBoardForCandidateIndex = (
  candidateDroppable,
  indexPos,
  indexProp,
  candidates,
  setCandidates
) => {
  if (!candidateDroppable) return;
  //copy arrays and objects to avoid modifying state
  let newCandidates = { ...candidates };
  if (!newCandidates[candidateDroppable.stage]) return;
  let stageCandidates = [...newCandidates[candidateDroppable.stage]];
  let currentCandidate = {
    ...stageCandidates[candidateDroppable.sourceIndex],
  };
  //check what direction the candidate is moving in the array and define 3 slices of the array
  let movingUpDown = indexPos < candidateDroppable.sourceIndex ? "up" : "down";
  let firstSlice;
  let middleSlice;
  let finalSlice;

  if (movingUpDown === "up") {
    //cut the slices based on the indexes
    firstSlice = stageCandidates.slice(0, indexPos);
    finalSlice = stageCandidates.slice(
      candidateDroppable.sourceIndex + 1,
      stageCandidates.length
    );
    middleSlice = stageCandidates.slice(
      indexPos,
      candidateDroppable.sourceIndex
    );
    //change the index prop in the candidateDroppable and the middle slice
    currentCandidate.index = indexProp;
    middleSlice = middleSlice.map((cand) => {
      return { ...cand, index: cand.index - 1 };
    });
    //recreate the newly organised array
    newCandidates[candidateDroppable.stage] = [
      ...firstSlice,
      currentCandidate,
      ...middleSlice,
      ...finalSlice,
    ];
  } else {
    //cut the slices based on the indexes
    firstSlice = stageCandidates.slice(0, candidateDroppable.sourceIndex);
    finalSlice = stageCandidates.slice(indexPos, stageCandidates.length);
    middleSlice = stageCandidates.slice(
      candidateDroppable.sourceIndex + 1,
      indexPos
    );
    //change the index prop in the candidateDroppable and the middle slice
    currentCandidate.index = indexProp + 1;
    middleSlice = middleSlice.map((cand) => {
      return { ...cand, index: cand.index + 1 };
    });
    //recreate the newly organised array
    newCandidates[candidateDroppable.stage] = [
      ...firstSlice,
      ...middleSlice,
      currentCandidate,
      ...finalSlice,
    ];
  }
  setCandidates(newCandidates);
};

const updateBoardForCandidateRemove = (
  droppedCandidate,
  candidates,
  setCandidates
) => {
  let newCandidates = { ...candidates };
  let stageCandidates = [...newCandidates[droppedCandidate.stage]];
  let firstSlice = stageCandidates.slice(0, droppedCandidate.sourceIndex);
  let secondSlice = stageCandidates.slice(
    droppedCandidate.sourceIndex + 1,
    stageCandidates.length
  );
  firstSlice = firstSlice.map((cand) => {
    return { ...cand, index: cand.index - 1 };
  });
  newCandidates[droppedCandidate.stage] = [...firstSlice, ...secondSlice];
  setCandidates(newCandidates);
};

const replaceWithNewCandidate = (
  candidateRes,
  candidates,
  setCandidates,
  setNewResCandidate
) => {
  let newCandidates = { ...candidates };
  let stageCandidates = [...newCandidates[candidateRes.stage]];
  let candidateMatchIndex;
  stageCandidates.map((candidate, index) => {
    if (candidate.professional_id === candidateRes.professional_id) {
      candidateMatchIndex = index;
    }
    return null;
  });
  if (candidateMatchIndex || candidateMatchIndex === 0) {
    stageCandidates[candidateMatchIndex] = candidateRes;
    newCandidates[candidateRes.stage] = stageCandidates;
    setNewResCandidate(undefined);
    setCandidates(newCandidates);
  } else {
    return;
  }
};

const checkHasCandidates = (candidates) => {
  if (!candidates) return false;
  const arrays = Object.values(candidates);
  let reply = false;
  let index = arrays.length - 1;
  while (reply === false && index >= 0) {
    arrays[index].length > 0 ? (reply = true) : index--;
  }
  return reply;
};
const checkHasFilters = (filters) => {
  if (!filters) return false;
  const arrays = Object.values(filters);
  let reply = false;
  let index = arrays.length - 1;
  while (reply === false && index >= 0) {
    arrays[index] ? (reply = true) : index--;
  }
  return reply;
};

const toggleSingleCandidateMethod = (
  candidateIndex,
  stageName,
  candidates,
  setCandidates
) => {
  let newCandidates = { ...candidates };
  let stageCandidates = [...newCandidates[stageName]];
  let cand = stageCandidates[candidateIndex];
  cand = { ...cand, selected: cand.selected ? false : true };
  stageCandidates[candidateIndex] = cand;
  newCandidates[stageName] = stageCandidates;
  setCandidates(newCandidates);
};

const promptModal = {
  rejected: "rejection-modal",
  interview_scheduled: "schedule-interview-modal",
  "start date confirmed": "start-date-modal",
  hired: "start-date-modal",
  // "to be approved": "to-be-approved-modal",
};

const ManagerWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-left: 15px;
  width: 100%;
`;

const NoCandidatesContainer = styled.div`
  padding-top: 50px;
  text-align: center;

  h2 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 20px;
  }
`;

const declinedRejectedCheck = {
  rejected: true,
  rejected_manual: true,
  declined: true,
  declined_manual: true,
};

export default ApplicantsBoard;
