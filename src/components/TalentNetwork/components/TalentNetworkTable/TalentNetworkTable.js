import React, { useState, useEffect } from "react";
// import moment from "moment";
import { API_ROOT_PATH } from "constants/api";
import { ROUTES } from "routes";
import { Link } from "react-router-dom";
import ApplicantMenu from "sharedComponents/CellMenuApplicant";
import ConfirmModalV2 from "modals/ConfirmModalV2";
import MarketingEmailModal from "modals/MarketingEmailModal";
import CreateListModal from "modals/CreateListModal";
import styles from "./style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import notify from "notifications";
import {
  permissionChecker,
  PermissionChecker,
} from "constants/permissionHelpers";
import {
  fetchRemoveCandidate,
  changeCandidateStatus,
} from "helpersV2/candidates";
import Marquee from "sharedComponents/Marquee";
import StatusSelect from "sharedComponents/StatusSelect";
import { CandidateStatusOptions } from "constants/statusOptions";
import CandidateRating from "sharedComponents/CandidateRating";
import CandidateBlacklist from "sharedComponents/CandidateBlacklist";
import LoadIndicator from "sharedComponents/LoadIndicator";
import styled from "styled-components";
import Checkbox from "sharedComponents/Checkbox";
import AddCandidatesToJobModal from "modals/AddCandidatesToJobModal";

const TalentNetworkTable = ({
  store,
  network,
  setNetwork,
  fetchMore,

  setRedirect,
  totalResults,
  loadingMore,
  selectedTotal,
  setSelectedTotal,
  clearSelected,
  setSelectAll,
  selectAll,
  selectedJob,
  setSelectedJob,
  activeModal,
  setActiveModal,
}) => {
  const [candidateIndex, setCandidateIndex] = useState(undefined);

  const [deleting, setDeleting] = useState(false);
  const [hoveringRow, setHoveringRow] = useState(undefined);

  const selectCandidate = (index) => {
    let newNetwork = [...network];
    newNetwork[index].selected = newNetwork[index].selected ? false : true;
    setSelectedTotal(
      newNetwork[index].selected ? selectedTotal + 1 : selectedTotal - 1
    );
    setNetwork(newNetwork);
  };

  useEffect(() => {
    if (network) {
      let newNetwork = [...network];
      newNetwork = newNetwork.map((candidate) => {
        return { ...candidate, selected: selectAll };
      });
      setSelectedTotal(selectAll ? network.length : 0);
      setNetwork(newNetwork);
    }
     
  }, [selectAll]);

  const resendInvitation = (id) => {
    const url =
      API_ROOT_PATH +
      `/v1/talent_network/${store.company.id}/resend_invite/${id}`;
    fetch(url, {
      method: "GET",
      headers: store.session,
    }).then((response) => {
      if (response.ok) {
        notify("info", "Invitation sent");
      } else {
        notify("danger", "We were unable to resend the invitation");
      }
    });
  };

  const changeStatus = (status, index) => {
    changeCandidateStatus(
      store.session,
      store.company.id,
      network[index].professional_id,
      status
    ).then((res) => {
      if (!res.err) {
        notify("info", "Status succesfully changed");
        let newNetwork = [...network];
        newNetwork[index] = { ...newNetwork[index], status };
        setNetwork(newNetwork);
      } else {
        notify("danger", res);
      }
    });
  };

  const removeCandidate = () => {
    fetchRemoveCandidate(
      store.session,
      store.company.id,
      network[candidateIndex].professional_id
    ).then((res) => {
      if (!res.err) {
        notify("info", "Candidate succesfully removed");
        let newNetwork = [...network];
        newNetwork.splice(candidateIndex, 1);
        setNetwork(newNetwork);
        setActiveModal(undefined);
        setCandidateIndex(undefined);
      } else {
        notify("danger", res);
      }
    });
  };

  const deleteMultiple = () => {
    let toRemove = [];
    let newNetwork = [...network];
    newNetwork.map((candidate, index) => {
      if (candidate.selected) {
        toRemove.push({ ...candidate, original_index: index });
      }
      return null;
    });
    let parsedCorrectly = 0;
    let parsedIncorrectly = 0;
    let count = 0;
    setDeleting(true);
    const recursiveDelete = (index, candsLeft) => {
      if (candsLeft === 0 || index === toRemove.length) {
        setDeleting(false);
        return;
      }
      candsLeft--;
      index++;

      fetchRemoveCandidate(
        store.session,
        store.company.id,
        toRemove[index].professional_id
      )
        .then((res) => {
          if (!res.err) {
            newNetwork[toRemove[index].original_index] = {
              ...newNetwork[toRemove[index].original_index],
              deleted: true,
            };
            parsedCorrectly++;
          } else {
            parsedIncorrectly++;
          }
          count++;
          if (count === toRemove.length) {
            setActiveModal(undefined);
            setNetwork(newNetwork.filter((cand) => !cand.deleted));
            setSelectedTotal(selectedTotal - parsedCorrectly);
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

    recursiveDelete(-1, toRemove.length);
  };

  const editCandidateRating = (rating, index) => {
    let newNetwork = [...network];
    newNetwork[index] = { ...newNetwork[index], rating };
    setNetwork(newNetwork);
  };
  const editCandidateBlacklist = (blacklistState, index) => {
    let newNetwork = [...network];
    newNetwork[index] = { ...newNetwork[index], blacklisted: blacklistState };
    setNetwork(newNetwork);
  };

  return (
    <>
      <div className={styles.container}>
        <div className="table-responsive">
          <table className="table table-borderless">
            <thead>
              <tr>
                <PermissionChecker
                  type="edit"
                  valid={{ marketer: true, recruiter: true }}
                >
                  <th scope="col" className={sharedStyles.tableItemCheckBox}>
                    <Checkbox
                      active={selectAll}
                      onClick={() => setSelectAll(!selectAll)}
                    />
                  </th>
                </PermissionChecker>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Applicant Name
                </th>
                <th scope="col" className={sharedStyles.tableHeader} />
                <th scope="col" className={sharedStyles.tableHeader}>
                  Rating
                </th>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Location
                </th>
                <th scope="col" className={sharedStyles.tableStatus}>
                  Availability
                </th>
                <th scope="col" className={sharedStyles.tableDate}>
                  Last action
                </th>
                <th scope="col" className={sharedStyles.tableHeader} />
              </tr>
            </thead>
            <STTbody onMouseLeave={() => setHoveringRow(undefined)}>
              {network &&
                network.map((candidate, index) => {
                  return (
                    <tr
                      key={`candidate_${index}`}
                      className="table-row-hover"
                      onMouseEnter={() => setHoveringRow(index)}
                    >
                      <PermissionChecker
                        type="edit"
                        valid={{ recruiter: true, marketer: true }}
                      >
                        <td className={sharedStyles.tableItem}>
                          <Checkbox
                            active={candidate.selected}
                            onClick={() => selectCandidate(index)}
                          />
                        </td>
                      </PermissionChecker>
                      <th scope="row" className={sharedStyles.tableItemFirst}>
                        <Link
                          className={styles.name}
                          to={ROUTES.CandidateProfile.url(
                            store.company.mention_tag,
                            candidate.professional_id
                          )}
                        >
                          <Marquee
                            height="25"
                            width={{
                              s: 150,
                              m: 200,
                              l: 250,
                              xl: 300,
                            }}
                          >
                            {candidate.name || candidate.email}
                          </Marquee>
                        </Link>
                      </th>
                      <td
                        className={sharedStyles.tableItemStatus}
                        style={{ overflow: "hidden" }}
                      >
                        <CandidateBlacklist
                          blacklisted={candidate.blacklisted}
                          store={store}
                          changeBlacklistedState={(blackListState) =>
                            editCandidateBlacklist(blackListState, index)
                          }
                          candidate_id={candidate.ptn_id}
                          show={hoveringRow === index}
                        />
                      </td>
                      <td
                        className={sharedStyles.tableItem}
                        style={{ overflow: "hidden" }}
                      >
                        <CandidateRating
                          rating={candidate.rating}
                          store={store}
                          changeNewRating={(newRating) =>
                            editCandidateRating(newRating, index)
                          }
                          candidate_id={candidate.professional_id}
                        />
                      </td>
                      <td
                        className={sharedStyles.tableItem}
                        style={{ overflow: "hidden" }}
                      >
                        <Marquee
                          height="25"
                          width={{
                            s: 100,
                            m: 150,
                            l: 200,
                            xl: 250,
                          }}
                        >
                          {candidate.localizations &&
                          candidate.localizations.length > 0
                            ? candidate.localizations.length !== 1
                              ? `${
                                  candidate.localizations[0].location.name
                                } + ${candidate.localizations.length - 1}`
                              : `${candidate.localizations[0].location.name}`
                            : ""}
                        </Marquee>
                      </td>
                      <td className={sharedStyles.tableItemStatus}>
                        <StatusSelect
                          selectedStatus={candidate.status}
                          statusOptions={CandidateStatusOptions}
                          onStatusSelect={(status) => {
                            if (status === "invited") {
                              resendInvitation(candidate.professional_id);
                            } else {
                              changeStatus(status, index);
                            }
                          }}
                          disabled={
                            !permissionChecker(store.role?.role_permissions, {
                              recruiter: true,
                            }).edit
                          }
                        />
                      </td>
                      <td className={sharedStyles.tableItem}>
                        {candidate.last_action &&
                          (function toDate() {
                            let date = new Date(candidate.last_action);
                            return date.toLocaleString("en-GB").split(",")[0];
                          })()}
                      </td>
                      <td className={sharedStyles.tableItemStatus}>
                        <ApplicantMenu
                          company={store.company}
                          professional={candidate}
                          source={"professional_id"}
                          removeCandidate={() => {
                            setActiveModal("remove-candidate");
                            setCandidateIndex(index);
                          }}
                          index={index}
                        />
                      </td>
                    </tr>
                  );
                })}
            </STTbody>
          </table>
          <LoadIndicator
            displayText="Candidates"
            displayed={network?.length}
            total={totalResults}
            fetchMore={fetchMore}
            loading={loadingMore}
          />
        </div>
        {activeModal === "remove-candidate" && candidateIndex !== undefined && (
          <ConfirmModalV2
            show={true}
            hide={() => {
              setActiveModal(undefined);
              setCandidateIndex(undefined);
            }}
            header={"Remove Candidate"}
            text={
              "Are you sure you want to remove this professional from your Talent Network?"
            }
            actionText="Remove"
            actionFunction={removeCandidate}
            id="remove-candidate"
          />
        )}
        {activeModal === "delete-multiple" && (
          <ConfirmModalV2
            show={true}
            hide={() => {
              setActiveModal(undefined);
            }}
            loading={deleting}
            header={!deleting ? "Remove Candidates" : "Removing candidates"}
            text={
              "Are you sure you want to remove these professionals from your Talent Network?"
            }
            actionText="Remove"
            actionFunction={deleteMultiple}
            id="remove-multiple"
          />
        )}
        {activeModal === "invite-confirmation" && selectedJob && (
          <ConfirmModalV2
            show={true}
            hide={() => {
              setActiveModal(undefined);
              setSelectedJob(undefined);
            }}
            header={"Candidates Added"}
            text={`Candidates were added successfully to ${selectedJob.title} as employer job.`}
            actionText="Manage Applicants"
            cancelText="Back to Talent"
            actionFunction={() => {
              setActiveModal(undefined);
              setRedirect(
                `/${store.company.mention_tag}/jobs/${selectedJob.title_slug}`
              );
            }}
            id="remove-candidate"
          />
        )}
        {activeModal === "create-email" && (
          <MarketingEmailModal
            hide={() => {
              setActiveModal(undefined);
              clearSelected();
            }}
            receivers={network.filter((cand) => cand.selected)}
            source="candidate"
          />
        )}
        {activeModal === "create_list_from_candidates" && (
          <CreateListModal
            hide={() => {
              setActiveModal(undefined);
              clearSelected();
            }}
            modalType="create_with_candidates"
            refreshList={() => {}}
            parentReceivers={network.filter((cand) => cand.selected)}
          />
        )}
        {activeModal === "add_candidates_to_list" && (
          <CreateListModal
            hide={() => {
              setActiveModal(undefined);
              clearSelected();
            }}
            modalType="add_candidates_to_list"
            refreshList={() => {}}
            parentReceivers={network.filter((cand) => cand.selected)}
          />
        )}
        {activeModal === "add-to-job" && (
          <AddCandidatesToJobModal
            hide={() => {
              setActiveModal(undefined);
              clearSelected();
              setSelectedJob(undefined);
            }}
            store={store}
            network={network}
            setNetwork={setNetwork}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            setActiveModal={setActiveModal}
            activeModal={activeModal}
            clearSelected={clearSelected}
            tempPlus={false}
          />
        )}
      </div>
    </>
  );
};

const STTbody = styled.tbody`
  tr:last-child {
    border-bottom: solid #eee 1px;
  }
`;

export default TalentNetworkTable;
