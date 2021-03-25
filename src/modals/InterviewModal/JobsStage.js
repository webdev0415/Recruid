import React, { useState, useEffect } from "react";
// Components
import { SearchBar } from "components/Calendar/components/shared/SearchBar";
// Styles
import styled from "styled-components";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
const ClientButton = styled.span`
  background: rgba(30, 30, 30, 0.1);
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  line-height: 1;
  max-width: 90px;
  overflow: hidden;
  padding: 5px 8px;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
`;

const StyledJobRow = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;

  &:first-of-type {
    padding-top: 50px;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const StyledJobTitle = styled.div`
  p {
    font-size: 14px;
    font-weight: 500;
    margin: 0 !important;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: #74767b;
    font-size: 12px;
  }
`;

const StageContainer = styled.div``;

const RightSide = styled.div`
  align-items: center;
  display: flex;

  p {
    color: #74767b;
    font-size: 12px !important;
    margin: 0 !important;
  }

  span {
    margin-left: 15px;
  }
`;

let timeout = null;

const JobsStage = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const [updateValue, setUpdateValue] = useState(false);

  useEffect(() => {
    if (searchValue !== props.search) {
      timeout = setTimeout(() => setUpdateValue(true), 500);
    }
    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    if (updateValue) {
      if (searchValue.length > 2) {
        props.setSearch(searchValue);
      } else if (props.search !== "") {
        props.setSearch("");
      }
      setUpdateValue(false);
    }
  }, [updateValue]);

  const JobItem = ({ job }) => (
    <StyledJobRow
      className="table-row-hover"
      onClick={() => {
        props.setCandidates(undefined);
        props.setSelectedJob(job);
        props.setStage("candidates");
      }}
      style={
        props.selectedJob && job.id === props.selectedJob.id
          ? { background: "#f6f6f6" }
          : {}
      }
    >
      <StyledJobTitle>
        <p>{job.title}</p>
        {job.localizations?.length > 0 && (
          <>{<span>{job.localizations[0].location.name}</span>}</>
        )}
      </StyledJobTitle>
      <RightSide>
        <p>{job.applicant_count} candidates</p>
        {props.companyId !== job.job_owner_company_id && (
          <ClientButton>{job.company.name}</ClientButton>
        )}
      </RightSide>
    </StyledJobRow>
  );

  return (
    <StageContainer>
      {props.jobs && (
        <div>
          <SearchBar
            eventHandler={(e) => setSearchValue(e.target.value)}
            searchState={searchValue}
            placeholder="Search for jobs..."
          />
          <InfiniteScroller
            fetchMore={props.loadMoreJobs}
            hasMore={props.moreJobs}
            dataLength={props.jobs?.length || 0}
            scrollableTarget={"modal-container-scroll"}
          >
            <STContainer id="modal-container-scroll">
              {props.jobs.map((job, index) => {
                return <JobItem job={job} key={`${job.id}-${index}`} />;
              })}
            </STContainer>
          </InfiniteScroller>
        </div>
      )}
    </StageContainer>
  );
};

const STContainer = styled.div`
  max-height: 500px;
  overflow: auto;
`;

export default JobsStage;
