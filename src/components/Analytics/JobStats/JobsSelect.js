import React from "react";
import styled from "styled-components";
import useDropdown from "hooks/useDropdown";
import sharedStyles from "assets/stylesheets/scss/collated/filter.module.scss";
import SearchInput from "sharedComponents/SearchInput";
import InfiniteScroller from "sharedComponents/InfiniteScroller";

const JobsSelect = ({
  jobs,
  onSelect,
  search,
  setSearch,
  store,
  hasMore,
  fetchMore,
  selectedJob,
}) => {
  const { node, showSelect, setShowSelect } = useDropdown();

  return (
    <div className="leo-relative" ref={node}>
      <Button onClick={() => setShowSelect(!showSelect)} className="leo-flex">
        <div
          className={sharedStyles.filterSelectorInput + " leo-flex"}
          style={{
            padding: 0,
            color: "black",
            alignItems: "center",
          }}
        >
          {selectedJob.title}
          <span style={{ marginLeft: "10px" }}>
            <li className="fas fa-caret-down" />
          </span>
        </div>
      </Button>
      {showSelect && (
        <JobsContainer id="jobs-container">
          <InfiniteScroller
            fetchMore={fetchMore}
            hasMore={hasMore}
            dataLength={jobs?.length || 0}
            scrollableTarget={"jobs-container"}
          >
            <SearchInput
              value={search}
              onChange={(val) => setSearch(val)}
              placeholder="Search Jobs..."
            />
            {jobs && jobs.length > 0 && (
              <JobsList>
                {jobs.map((job, index) => (
                  <JobLi
                    className="leo-flex"
                    key={`job-list-item-${index}`}
                    onClick={() => {
                      onSelect(job);
                      setShowSelect(false);
                    }}
                  >
                    <div className="job-text-container">
                      <div className="title">{job.title}</div>
                      {job.localizations && job.localizations.length > 0 && (
                        <span className="sub-title">
                          {job.localizations[0].location.name}
                        </span>
                      )}
                    </div>
                    {job.company.id !== store.company?.id && (
                      <ClientButton>{job.company.name}</ClientButton>
                    )}
                  </JobLi>
                ))}
              </JobsList>
            )}
          </InfiniteScroller>
          {jobs && jobs.length === 0 && (
            <EmptyInfo>There are no jobs to show</EmptyInfo>
          )}
        </JobsContainer>
      )}
    </div>
  );
};

const Button = styled.button`
  align-items: center,
  background: transparent,
  cursor: pointer,
  justify-content: space-between,
  margin-bottom: 5px,
  min-width: 240px,
  padding: 0,
`;

const JobsContainer = styled.div`
  position: absolute;
  width: 330px;
  height: 410px;
  background: #ffffff;
  border: 1px solid #c4c4c4;
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1;
  padding: 20px;
  overflow: scroll;
`;

const JobsList = styled.ul`
  margin-top: 20px;
`;

const JobLi = styled.li`
  padding: 10px 10px 10px 0px;
  border-bottom: 1px solid #eeeeee;
  justify-content: space-between;
  cursor: pointer;

  .title {
    font-size: 14px;
    line-height: 16px;
    color: #000000;
    white-space: nowrap;
    max-width: 185px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sub-title {
    font-size: 12px;
    line-height: 15px;
    color: #74767b;
    white-space: nowrap;
    max-width: 185px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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
  min-width: 85px;
`;

const EmptyInfo = styled.div``;

export default JobsSelect;
