import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useDropdown from "hooks/useDropdown";
import AvatarIcon from "sharedComponents/AvatarIcon";
import { fetchJobTempReadyCandidates } from "helpersV2/tempPlus";
import notify from "notifications";
import { TimerSvg } from "components/TempJobDashboard/JobDashboardShifts/icons";
import SearchInput from "sharedComponents/SearchInput";
import Spinner from "sharedComponents/Spinner";
import { WarningIcon } from "components/TempJobDashboard/JobDashboardShifts/icons";
import ReactTooltip from "react-tooltip";
import { fetchNetwork } from "helpersV2/candidates";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import SimpleDelayedInput from "sharedComponents/SimpleDelayedInput";
import { AWS_CDN_URL } from "constants/api";

const SLICE_LENGTH = 20;

const CandidateSelect = ({
  selectedCandidate,
  setSelectedCandidate,
  store,
  jobId,
  type,
  shiftId,
  rateDisplay,
}) => {
  const { node, showSelect, setShowSelect } = useDropdown();
  const [candidateList, setCandidateList] = useState(undefined);
  const [filteredCandidates, setFilteredCandidates] = useState(undefined);
  const [search, setSearch] = useState("");
  const controller = new AbortController();
  const signal = controller.signal;
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (showSelect && candidateList === undefined) {
      fetchJobTempReadyCandidates(store.session, jobId, shiftId).then((res) => {
        if (!res.err) {
          setCandidateList(res);
          setFilteredCandidates(res);
        } else {
          notify("danger", "Unable to get job candidates");
        }
      });
    }
  }, [showSelect, candidateList, jobId, store.session, shiftId]);

  useEffect(() => {
    if (store.company && store.role && search !== "") {
      fetchNetwork(
        store.session,
        store.company.id,
        {
          slice: [0, SLICE_LENGTH],
          operator: "and",
          search: [search],
          team_member_id: store.role.team_member.team_member_id,
        },
        signal
      ).then((talentNetwork) => {
        if (!talentNetwork.err) {
          setFilteredCandidates(talentNetwork.results);
          if (talentNetwork.results.length !== talentNetwork.total) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
        } else if (!signal.aborted) {
          notify("danger", talentNetwork);
        }
      });
    }
    return () => controller.abort();
  }, [store.company, store.role, store.session, search]);

  //LOAD MORE CANDIDATES
  const fetchMore = () => {
    fetchNetwork(
      store.session,
      store.company.id,
      {
        slice: [filteredCandidates.length, SLICE_LENGTH],
        operator: "and",
        search: [search],
        team_member_id: store.role.team_member.team_member_id,
      },
      signal
    ).then((talentNetwork) => {
      if (!talentNetwork.err) {
        let arr = [...filteredCandidates, ...talentNetwork.results];
        setFilteredCandidates(arr);
        if (arr.length !== talentNetwork.total) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else if (!signal.aborted) {
        notify("danger", talentNetwork);
      }
    });
  };

  useEffect(() => {
    if (search === "") {
      setHasMore(false);
      if (candidateList) {
        setFilteredCandidates(candidateList);
      }
    }
  }, [search, candidateList]);

  useEffect(() => {
    if (type === "assign-candidate") {
      setShowSelect(true);
    }
  }, [type]);

  const checkSetSelectedCandidate = (cand) => {
    if (cand?.applicant_id) {
      setSelectedCandidate(cand);
    } else if (candidateList?.length > 0) {
      let match;
      candidateList.map((candidate) =>
        candidate.professional_id === cand?.professional_id
          ? (match = candidate)
          : null
      );
      if (match) {
        setSelectedCandidate(match);
      } else {
        setSelectedCandidate(cand);
      }
    }
  };

  if (type === "assign-candidate") {
    return (
      <BodyContainer>
        <SearchInput
          value={search}
          onChange={(val) => setSearch(val)}
          placeholder="Search applicants..."
          className="search-input"
        />
        <InfiniteScroller
          fetchMore={fetchMore}
          hasMore={hasMore}
          dataLength={filteredCandidates?.length || 0}
        >
          <div className="candidate-container">
            <CandidateUL>
              {filteredCandidates &&
                filteredCandidates.length > 0 &&
                filteredCandidates.map((cand, ix) => (
                  <CandidateLi
                    store={store}
                    cand={cand}
                    selectedCandidate={selectedCandidate}
                    setSelectedCandidate={checkSetSelectedCandidate}
                    key={`candidate-list-${ix}`}
                    search={search}
                    rateDisplay={rateDisplay}
                  />
                ))}
              {candidateList === undefined && (
                <FlexLi>
                  <Spinner />
                </FlexLi>
              )}
              {candidateList?.length === 0 && (
                <li>There are no candidates ready to take on shifts</li>
              )}
              {candidateList?.length > 0 &&
                filteredCandidates?.length === 0 && (
                  <li>No candidates match your search</li>
                )}
            </CandidateUL>
          </div>
        </InfiniteScroller>
      </BodyContainer>
    );
  } else {
    return (
      <Container ref={node}>
        {!selectedCandidate ? (
          <SimpleDelayedInput
            placeholder="Select Candidate"
            value={search}
            onChange={(val) => setSearch(val)}
            onClick={() => setShowSelect(true)}
          />
        ) : (
          <CandidateShow
            candidate={selectedCandidate}
            clearCandidate={() => setSelectedCandidate(undefined)}
          />
        )}

        {showSelect && (
          <InfiniteScroller
            fetchMore={fetchMore}
            hasMore={hasMore}
            dataLength={filteredCandidates?.length || 0}
          >
            <div className="candidate-select-container">
              <CandidateUL>
                {filteredCandidates &&
                  filteredCandidates.length > 0 &&
                  filteredCandidates.map((cand, ix) => (
                    <CandidateLi
                      store={store}
                      cand={cand}
                      selectedCandidate={selectedCandidate}
                      setSelectedCandidate={checkSetSelectedCandidate}
                      key={`candidate-list-${ix}`}
                      assignOnSelect={true}
                      setShowSelect={setShowSelect}
                      search={search}
                      rateDisplay={rateDisplay}
                    />
                  ))}
                {candidateList === undefined && (
                  <FlexLi>
                    <Spinner />
                  </FlexLi>
                )}
                {candidateList?.length === 0 && (
                  <li>There are no candidates ready to take on shifts</li>
                )}
                {candidateList?.length > 0 &&
                  filteredCandidates?.length === 0 && (
                    <li>No candidates match your search</li>
                  )}
              </CandidateUL>
            </div>
          </InfiniteScroller>
        )}
      </Container>
    );
  }
};

const CandidateShow = ({ candidate, clearCandidate }) => {
  return (
    <CandidateShowContainer>
      <AvatarIcon
        name={candidate.name}
        imgUrl={candidate.avatar_url}
        size={20}
      />
      <span className="candidate-name">{candidate.name}</span>
      <button onClick={() => clearCandidate()}>
        <i className="fas fa-times"></i>
      </button>
    </CandidateShowContainer>
  );
};

const CandidateLi = ({
  cand,
  store,
  setSelectedCandidate,
  selectedCandidate,
  assignOnSelect,
  setShowSelect,
  search,
  rateDisplay,
}) => {
  return (
    <li
      onClick={() => {
        if (cand.professional_id === selectedCandidate?.professional_id) {
          setSelectedCandidate(undefined);
        } else {
          setSelectedCandidate(cand);
        }
        if (assignOnSelect) {
          setShowSelect(false);
        }
      }}
    >
      <AvatarIcon name={cand.name} imgUrl={cand.avatar_url} size={30} />
      <div className="name-container">
        <span className="candidate-name">
          {cand.name}{" "}
          {cand.blacklisted && (
            <img src={`${AWS_CDN_URL}/icons/CancelSvg.svg`} alt="" />
          )}
        </span>

        {rateDisplay === "hourly" && cand.hour_rate && (
          <span className="candidate-title">
            <TimerSvg />
            {store.company?.currency?.currency_name}
            {cand.hour_rate}/hour
          </span>
        )}
        {rateDisplay === "daily" && cand.day_rate && (
          <span className="candidate-title">
            <TimerSvg />
            {store.company?.currency?.currency_name}
            {cand.day_rate}/day
          </span>
        )}
      </div>
      {!assignOnSelect &&
        cand.professional_id === selectedCandidate?.professional_id && (
          <CheckMark>
            <img src={`${AWS_CDN_URL}/icons/CheckIcon.svg`} alt="" />
          </CheckMark>
        )}
      {search === "" && !cand.is_available && (
        <>
          <Indicator
            className="indicator-marker"
            data-tip="The candidate has not set themselves available for this shift"
          >
            <WarningIcon color="orange" />
          </Indicator>
          <ReactTooltip effect="solid" backgroundColor="#FFA076" />
        </>
      )}
    </li>
  );
};

const Container = styled.div`
  display: flex;
  position: relative;
  border: 1px solid #eeeeee;
  border-radius: 4px;

  input {
    border: none;
    width: 100%;
    font-size: 12px;
    padding: 5px;
  }

  .candidate-select-container {
    width: 100%;
    position: absolute;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.74);
    top: 35px;
    left: 0;
    max-height: 180px;
    overflow: scroll;
  }
`;

const CandidateUL = styled.ul`
  li {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    padding: 12px 30px;

    :hover {
      background: rgba(196, 196, 196, 0.25);
    }

    .name-container {
      margin-left: 10px;

      .candidate-title {
        font-size: 12px;
        line-height: 14px;
        color: #74767b;
        display: flex;
        align-items: center;
        margin-top: 3px;

        svg {
          margin-right: 5px;
        }
      }
      .candidate-name {
        font-size: 14px;
        line-height: 16px;
      }
    }
  }
`;

const BodyContainer = styled.div`
  .candidate-container {
    max-height: 180px;
    overflow: scroll;
  }
  .search-input {
    margin: 15px;
    width: 90%;
  }
`;

const CheckMark = styled.div`
  position: absolute;
  right: 30px;
  background: #35c3ae;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

const CandidateShowContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;

  .candidate-name {
    margin-left: 10px;
    margin-right: 30px;
    font-size: 14px;
    line-height: 16px;
    color: #53585f;
  }

  button {
    color: #d24650;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      color: #d24650;
    }
  }
`;

const FlexLi = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Indicator = styled.div`
  position: absolute;
  right: 80px;
  transition: all 200ms;
`;

export default CandidateSelect;
