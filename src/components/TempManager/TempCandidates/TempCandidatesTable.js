import React, { useState, useEffect } from "react";
import { ROUTES } from "routes";
import { Link } from "react-router-dom";
import Marquee from "sharedComponents/Marquee";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import { API_ROOT_PATH } from "constants/api";
import {
  permissionChecker,
  PermissionChecker,
} from "constants/permissionHelpers";
import { Table, TableHeader, TableRow, TableCell } from "styles/Table";
import Checkbox from "sharedComponents/Checkbox";
import styled from "styled-components";
import AvatarIcon from "sharedComponents/AvatarIcon";
import { COLORS } from "constants/style";
import StatusSelect from "sharedComponents/StatusSelect";
import { CandidateStatusOptions } from "constants/statusOptions";
import ApplicantMenu from "sharedComponents/CellMenuApplicant";
import {
  fetchRemoveCandidate,
  changeCandidateStatus,
} from "helpersV2/candidates";
import notify from "notifications";
import ConfirmModalV2 from "modals/ConfirmModalV2";
import MarketingEmailModal from "modals/MarketingEmailModal";
import CreateListModal from "modals/CreateListModal";
import CandidateRating from "sharedComponents/CandidateRating";
import CandidateBlacklist from "sharedComponents/CandidateBlacklist";
import AddCandidatesToJobModal from "modals/AddCandidatesToJobModal";

const TempCandidatesTable = ({
  store,
  network,
  setNetwork,
  hasMore,
  fetchMore,
  setRedirect,
  activeModal,
  setActiveModal,
  selectedTotal,
  setSelectedTotal,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [candidateIndex, setCandidateIndex] = useState(undefined);
  const [selectedJob, setSelectedJob] = useState(false);
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

  const clearSelected = () => {
    let newNetwork = [...network];
    newNetwork = newNetwork.map((candidate) => {
      return { ...candidate, selected: false };
    });
    setSelectedTotal(0);
    setSelectAll(false);
    setNetwork(newNetwork);
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
      <InfiniteScroller
        fetchMore={fetchMore}
        hasMore={hasMore}
        dataLength={network?.length || 0}
      >
        <Table>
          <thead>
            <TableRow className="header-row">
              <PermissionChecker
                type="edit"
                valid={{ marketer: true, recruiter: true }}
              >
                <TableHeader>
                  <Checkbox
                    active={selectAll}
                    onClick={() => setSelectAll(!selectAll)}
                  />
                </TableHeader>
              </PermissionChecker>
              <TableHeader>Name</TableHeader>
              <TableHeader />
              <TableHeader>Location</TableHeader>
              <TableHeader>Job Title</TableHeader>
              <TableHeader>Rating</TableHeader>
              <TableHeader>Rate</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader />
            </TableRow>
          </thead>
          <tbody onMouseLeave={() => setHoveringRow(undefined)}>
            {network &&
              network.map((candidate, index) => {
                return (
                  <TableRow
                    key={`candidate_${index}`}
                    onMouseEnter={() => setHoveringRow(index)}
                  >
                    <PermissionChecker type="edit" valid={{ recruiter: true }}>
                      <TableCell>
                        <Checkbox
                          active={candidate.selected}
                          onClick={() => selectCandidate(index)}
                        />
                      </TableCell>
                    </PermissionChecker>
                    <TableCell>
                      <UnstyledLink
                        to={ROUTES.CandidateProfile.url(
                          store.company.mention_tag,
                          candidate.professional_id
                        )}
                      >
                        <AvatarIcon
                          name={candidate.name}
                          imgUrl={candidate.source?.avatar}
                          size={25}
                          style={{
                            marginRight: "10px",
                          }}
                        />
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
                      </UnstyledLink>
                    </TableCell>
                    <TableCell>
                      <CandidateBlacklist
                        blacklisted={candidate.blacklisted}
                        store={store}
                        changeBlacklistedState={(blackListState) =>
                          editCandidateBlacklist(blackListState, index)
                        }
                        candidate_id={candidate.ptn_id}
                        show={hoveringRow === index}
                      />
                    </TableCell>
                    <TableCell>
                      <GreyedSpan>
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
                      </GreyedSpan>
                    </TableCell>
                    <TableCell>
                      <GreyedSpan>{candidate.current_job_title}</GreyedSpan>
                    </TableCell>
                    <TableCell>
                      <CandidateRating
                        rating={candidate.rating}
                        store={store}
                        changeNewRating={(newRating) =>
                          editCandidateRating(newRating, index)
                        }
                        candidate_id={candidate.professional_id}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="leo-flex">
                        {candidate.hour_rate && (
                          <>
                            {store.company?.currency?.currency_name}
                            {candidate.hour_rate}
                            <GreyedSpan>/hour</GreyedSpan>
                          </>
                        )}
                        {!candidate.hour_rate && candidate.day_rate && (
                          <>
                            {store.company?.currency?.currency_name}
                            {candidate.day_rate}
                            <GreyedSpan>/day</GreyedSpan>
                          </>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                );
              })}
          </tbody>
        </Table>
      </InfiniteScroller>
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
          tempPlus={true}
        />
      )}
    </>
  );
};

const UnstyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  display: flex;

  &:hover {
    color: inherit;
    text-decoration: none;
  }
`;

const GreyedSpan = styled.span`
  color: ${COLORS.dark_4};
`;

export default TempCandidatesTable;
