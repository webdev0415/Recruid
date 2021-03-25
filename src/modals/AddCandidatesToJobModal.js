import React, { useState, useEffect } from "react";

import UniversalModal, {
  ModalBody,
  MinimalHeader,
} from "modals/UniversalModal/UniversalModal";
import styled from "styled-components";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import ConfirmInviteBlacklistedModal from "modals/ConfirmInviteBlacklistedModal";
import notify from "notifications";
import { fetchJobs } from "helpersV2/jobs";
import { fetchTempJobs } from "helpersV2/tempPlus";
import sharedHelpers from "helpers/sharedHelpers";
import AppButton from "styles/AppButton";
import SearchInput from "sharedComponents/SearchInput";
import Spinner from "sharedComponents/Spinner";
import HandHold from "assets/svg/icons/handHold";
import SizzlingFlame from "assets/svg/icons/sizzling";
import FilterV2 from "sharedComponents/filterV2";
import Checkbox from "sharedComponents/Checkbox";
import { Table, TableHeader, TableRow, TableCell } from "styles/Table";
import StatusSelect from "sharedComponents/StatusSelect";
import { JobStatusOptions } from "constants/statusOptions";
import Marquee from "sharedComponents/Marquee";
const SLICE_LENGHT = 10;

const AddCandidatesToJobModal = ({
  hide,
  store,
  network,
  setNetwork,
  selectedJob,
  setSelectedJob,
  setActiveModal,

  clearSelected,
  tempPlus,
  afterCall,
}) => {
  const [jobs, setJobs] = useState(undefined);
  const [hasMore, setHasMore] = useState(true);
  const controller = new AbortController();
  const signal = controller.signal;
  const [search, setSearch] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState(undefined);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [innerModal, setInnerModal] = useState(undefined);

  useEffect(() => {
    fethJobsCaller(
      store.session,
      store.company.id,
      {
        ...filters,
        slice: [0, SLICE_LENGHT],
        operator: "and",
        team_member_id: store.role.team_member.team_member_id,
        search: search?.length >= 2 ? [search] : undefined,
      },
      signal
    ).then((jbs) => {
      if (!jbs.err) {
        setJobs(jbs);
        if (jbs.length === SLICE_LENGHT) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else if (!signal.aborted) {
        notify("danger", jbs);
      }
    });
    return () => controller.abort();
     
  }, [search, filters]);

  const fetchMore = () => {
    fethJobsCaller(
      store.session,
      store.company.id,
      {
        ...filters,
        slice: [jobs.length, SLICE_LENGHT],
        operator: "and",
        team_member_id: store.role.team_member.team_member_id,
        search: search?.length >= 2 ? [search] : undefined,
      },
      signal
    ).then((jbs) => {
      if (!jbs.err) {
        setJobs([...jobs, ...jbs]);
        if (jbs.length === SLICE_LENGHT) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else if (!signal.aborted) {
        notify("danger", jbs);
      }
    });
  };

  const fethJobsCaller = async (session, companyId, body, signal) =>
    !tempPlus
      ? fetchJobs(session, companyId, body, signal)
      : fetchTempJobs(session, companyId, body, signal);

  const checkBlacklisted = () => {
    let blacklisted = network.filter(
      (cand) => cand.selected && cand.blacklisted
    );
    if (blacklisted.length > 0) {
      setInnerModal("confirm-invite-blacklisted");
    } else {
      addSelectedProfessionalsToJob();
    }
  };

  const addSelectedProfessionalsToJob = () => {
    const postBody = {
      company_id: store.company.id,
      job_id: selectedJob.id,
      candidate_ids: network.reduce((accumulator, candidate) => {
        if (candidate.selected) {
          accumulator.push(candidate.professional_id);
        }
        return accumulator;
      }, []),
      recruiter_id: store.role.team_member.team_member_id,
    };
    if (store.company?.id !== selectedJob.company?.id) {
      postBody.agency_id = store.company.id;
    }
    setLoading(true);
    sharedHelpers
      .inviteProfessionalsToJob(postBody, store.session)
      .then((response) => {
        if (response?.message === "Done") {
          clearSelected();
          setActiveModal("invite-confirmation");
          notify("info", "Candidate/s succesfully added");
          if (afterCall) {
            afterCall();
          }
        } else {
          notify("danger", "Unable to add candidates to job");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deselectBlackListed = (cand) => {
    let index;
    network.map((candidate, ix) =>
      candidate.ptn_id === cand.ptn_id ||
      candidate.professional_id === cand.professional_id
        ? (index = ix)
        : null
    );
    let newNetwork = [...network];
    newNetwork[index].selected = newNetwork[index].selected ? false : true;
    setNetwork(newNetwork);
  };

  useEffect(() => {
    if (network) {
      setSelectedNetwork(network.filter((cand) => cand.selected));
    }
  }, [network]);

  const changeFilters = (newFilters) => {
    if (
      Object.values(filters).length === 0 &&
      Object.values(newFilters).length === 0
    ) {
      return;
    }
    setFilters(newFilters);
  };

  return (
    <>
      <UniversalModal
        show={true}
        hide={hide}
        id="add-candidates-to-job-modal"
        width={620}
      >
        <MinimalHeader
          title={
            selectedNetwork?.length > 1
              ? `Add ${selectedNetwork.length} candidates to a job`
              : selectedNetwork?.length === 1
              ? `Add candidate ${
                  selectedNetwork[0].name ||
                  selectedNetwork[0].talent_name ||
                  selectedNetwork[0].candidate_name ||
                  ""
                } to a job`
              : "Add candidate to a job"
          }
          hide={hide}
        />
        <STModalBody className="no-footer">
          {jobs ? (
            <>
              <SearchInput
                placeholder="Search jobs..."
                value={search}
                onChange={(val) => setSearch(val)}
              />
              <FilterV2
                source="job"
                returnFilters={(newFilters) => changeFilters(newFilters)}
                v2theme={true}
                hideSegments={true}
              />
              <ListContainer id="add-jobs-dropdown">
                <InfiniteScroller
                  fetchMore={fetchMore}
                  hasMore={hasMore}
                  dataLength={jobs?.length || 0}
                  scrollableTarget={"add-jobs-dropdown"}
                >
                  <Table>
                    <thead>
                      <TableRow>
                        <TableHeader />
                        <TableHeader />
                        {store.company.type === "Agency" && <TableHeader />}
                        <TableHeader />
                        <TableHeader />
                      </TableRow>
                    </thead>
                    <tbody>
                      {jobs &&
                        jobs.map((job, index) => (
                          <TableRow key={`job-row-${index}`}>
                            <TableCell
                              style={{ verticalAlign: "top !important" }}
                            >
                              <CheckboxContainer>
                                <Checkbox
                                  active={job.id === selectedJob?.id}
                                  onClick={() => setSelectedJob(job)}
                                />
                              </CheckboxContainer>
                            </TableCell>
                            <TableCell>
                              <div>
                                <Marquee
                                  height="25"
                                  width={{
                                    s: 125,
                                    m: 125,
                                    l: 125,
                                    xl: 125,
                                  }}
                                >
                                  {job.title}
                                </Marquee>
                                {job.localizations?.length > 0 && (
                                  <GreyedSpan>
                                    {job.localizations[0].location?.name}
                                  </GreyedSpan>
                                )}
                              </div>
                            </TableCell>
                            {store.company.type === "Agency" && (
                              <TableCell>
                                {job.company.id !== store.company.id && (
                                  <ClientButton>
                                    {job.company.name}
                                  </ClientButton>
                                )}
                              </TableCell>
                            )}
                            <TableCell>
                              {(!job.approval?.id ||
                                !approvalStatuses[job.job_status]) && (
                                <FlexContainer>
                                  {job.is_draft ? (
                                    <DraftButton>Draft</DraftButton>
                                  ) : (
                                    <IconsFlex>
                                      <HoldContainer>
                                        <HandHold onHold={job.on_hold} />
                                      </HoldContainer>
                                      <FlamesContainer>
                                        <SizzlingFlame
                                          active={job.sizzle_score > 0}
                                        />
                                        <SizzlingFlame
                                          active={job.sizzle_score > 1}
                                        />
                                        <SizzlingFlame
                                          active={job.sizzle_score > 2}
                                        />
                                      </FlamesContainer>
                                    </IconsFlex>
                                  )}
                                </FlexContainer>
                              )}
                            </TableCell>
                            <TableCell>
                              <StatusSelect
                                selectedStatus={job.job_status}
                                statusOptions={JobStatusOptions}
                                onStatusSelect={() => {}}
                                disabled={true}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </tbody>
                  </Table>
                </InfiniteScroller>
              </ListContainer>
            </>
          ) : (
            <Spinner />
          )}
          <Footer>
            {selectedJob && (
              <AppButton onClick={() => checkBlacklisted()}>
                Add to job
              </AppButton>
            )}
          </Footer>
        </STModalBody>
        {loading && (
          <LoadContainer>
            <Spinner />
          </LoadContainer>
        )}
      </UniversalModal>
      {innerModal === "confirm-invite-blacklisted" && (
        <ConfirmInviteBlacklistedModal
          hide={() => setActiveModal(undefined)}
          actionFunction={addSelectedProfessionalsToJob}
          blacklistedCandidates={network.filter(
            (cand) => cand.selected && cand.blacklisted
          )}
          deselectBlackListed={deselectBlackListed}
        />
      )}
    </>
  );
};

export default AddCandidatesToJobModal;

const STModalBody = styled(ModalBody)`
  padding: 20px !important;
  text-align: center;
`;

const Footer = styled.div`
  padding: 10px;
  display: flex;
  justify-content: flex-end;
`;

const ListContainer = styled.div`
  margin: 10px 0px;
  max-height: 350px;
  overflow: scroll;
  border-bottom: solid 1px #eee;
`;

const FlamesContainer = styled.div`
  display: inline;
  width: max-content;

  svg {
    display: inline !important;
    margin-right: 2px !important;
  }
`;

const IconsFlex = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;
const HoldContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 5px;
`;

const DraftButton = styled.div`
  background: #00cba7;
  border-radius: 15px;
  color: white;
  display: inline;
  font-size: 12px;
  font-weight: 500;
  padding: 0px 10px;
  margin-left: 30px;
`;

const ClientButton = styled.div`
  background: rgba(30, 30, 30, 0.1);
  border-radius: 4px;
  color: #1e1e1e;
  display: inline-block;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  line-height: normal;
  max-width: 85px;
  overflow: hidden;
  padding: 5px 8px;
  text-align: center;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
`;

const approvalStatuses = {
  "awaiting for review": true,
  declined: true,
  approved: true,
};

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const GreyedSpan = styled.span`
  color: #74767b;
  font-size: 12px;
  line-height: 15px;
  max-width: 125px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LoadContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background: #eeeeee61;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CheckboxContainer = styled.div``;
