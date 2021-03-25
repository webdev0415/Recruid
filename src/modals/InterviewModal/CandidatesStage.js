import React, { useState, useEffect } from "react";
// Components
import { SearchBar } from "components/Calendar/components/shared/SearchBar";
// Helpers
import { candidateSearchRequest } from "helpers/jobFilters/helper";
// Styles
import styled from "styled-components";

import { statusNames } from "constants/stageOptions";

const CandidatesStage = (props) => {
  const [filteredCandidates, setFilteredCandidate] = useState([]);
  const [searchValue, setSearchValue] = useState(``);
  const [filterPage, setFilterPage] = useState(1);

  useEffect(() => {
    if (searchValue.length >= 2) {
      candidateSearchRequest(
        props.session,
        props.companyId,
        props.jobId,
        searchValue,
        setFilteredCandidate
      );
    } else setFilteredCandidate([]);
  }, [searchValue, filterPage, props.session, props.companyId, props.jobId]);

  function handleSearchChange(event) {
    setSearchValue(event.target.value);
  }

  const CandidateItem = ({ candidate, index }) => (
    <StyledCandidateRow
      className="table-row-hover"
      onClick={() => {
        props.setSelectedCandidate(candidate);
        props.setStage("interviewStages");
      }}
      style={!index ? { paddingTop: "50px" } : {}}
    >
      {/*props.selectedCandidate && candidate.id === props.selectedCandidate.id
      ? { background: "#f6f6f6" }
      : {}*/}
      <StyledCandidateName>
        {candidate.talent_name ||
          candidate.tn_name ||
          candidate.professional_name ||
          candidate.email}
      </StyledCandidateName>
      <ClientButton>{statusNames[candidate.status].format}</ClientButton>
    </StyledCandidateRow>
  );
  return (
    <StageContainer>
      {props.candidates && (
        <div>
          <SearchBar
            eventHandler={handleSearchChange}
            searchState={searchValue}
            placeholder={`Search for candidates...`}
          />
          {!filteredCandidates.length
            ? props.candidates.map((candidate, index) => (
                <CandidateItem
                  candidate={candidate}
                  key={`${candidate.id}-${index}`}
                  index={index}
                />
              ))
            : filteredCandidates.map((candidate, index) => (
                <CandidateItem
                  candidate={candidate}
                  key={`${candidate.id}-${index}`}
                  index={index}
                />
              ))}
          {!filteredCandidates.length
            ? props.moreCandidates && (
                <div
                  className="leo-flex"
                  style={{
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    padding: "20px",
                  }}
                >
                  <button
                    className="button button--default button--blue-dark"
                    onClick={props.loadMoreCandidates}
                  >
                    Load More
                  </button>
                </div>
              )
            : filteredCandidates.length >= 20 && (
                <div
                  className="leo-flex"
                  style={{
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    padding: "20px",
                  }}
                >
                  <button
                    className="button button--default button--blue-dark"
                    onClick={() => setFilterPage((page) => page + 1)}
                  >
                    Load More
                  </button>
                </div>
              )}
        </div>
      )}
    </StageContainer>
  );
};

export default CandidatesStage;

const StyledCandidateRow = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const StyledCandidateName = styled.div`
  font-weight: 500;
`;

const ClientButton = styled.div`
  background: rgba(0, 202, 165, 0.1);
  border-radius: 4px;
  color: #00cba7;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  line-height: 1;
  padding: 5px 8px;
  text-transform: uppercase;
`;

const StageContainer = styled.div`
  max-height: 470px;
  overflow-y: auto;
  min-height: 100px;
`;
