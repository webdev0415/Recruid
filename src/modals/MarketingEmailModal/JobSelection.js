import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { Table, TableRow, TableCell } from "styles/Table";
import Checkbox from "sharedComponents/Checkbox";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import { fetchJobs } from "helpersV2/jobs";
import notify from "notifications";
import SearchInput from "sharedComponents/SearchInput";
import Spinner from "sharedComponents/Spinner";
import { WarningIcon } from "components/TempJobDashboard/JobDashboardShifts/icons";
const SLICE_LENGHT = 20;
const ParticipantsList = ({
  setView,
  selectedJob,
  setSelectedJob,
  jobs,
  setJobs,
  store,
  participants,
  originalSource,
  hasJobLink,
}) => {
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (store.company && store.role) {
      fetchJobs(store.session, store.company.id, {
        slice: [0, SLICE_LENGHT],
        operator: "and",
        team_member_id: store.role.team_member.team_member_id,
        search: search?.length > 0 ? [search] : undefined,
      }).then((jbs) => {
        if (!jbs.err) {
          setJobs(jbs);
          if (jbs.length === SLICE_LENGHT) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
        } else {
          notify("danger", jbs);
        }
      });
    }
  }, [store.company, store.role, store.session, search]);

  const fetchMore = () => {
    fetchJobs(store.session, store.company.id, {
      slice: [jobs.length, SLICE_LENGHT],
      operator: "and",
      team_member_id: store.role.team_member.team_member_id,
      search: search?.length > 0 ? [search] : undefined,
    }).then((jbs) => {
      if (!jbs.err) {
        setJobs([...jobs, ...jbs]);
        if (jbs.length === SLICE_LENGHT) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else {
        notify("danger", jbs);
      }
    });
  };

  return (
    <>
      {!jobs && <Spinner />}
      {jobs?.length >= 0 && (
        <SearchContainer>
          <p>Select a job to use on your variables.</p>
          <SearchInput
            value={search}
            onChange={(val) => setSearch(val)}
            placeholder="Search Jobs..."
          />
        </SearchContainer>
      )}
      <TableScroll id="table-scroll-container">
        <InfiniteScroller
          fetchMore={fetchMore}
          hasMore={hasMore}
          dataLength={jobs?.length || 0}
          scrollableTarget="table-scroll-container"
        >
          <Table>
            <tbody>
              {jobs &&
                jobs.map((job, index) => {
                  return (
                    <TableRow key={`job_${index}`}>
                      <TableCell>
                        {(selectedJob === undefined ||
                          selectedJob?.id === job.id) && (
                          <Checkbox
                            active={selectedJob?.id === job.id}
                            onClick={() =>
                              setSelectedJob(
                                selectedJob?.id === job.id ? undefined : job
                              )
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="leo-flex">
                          {job.title}
                          {hasJobLink &&
                            (job.job_post_type === "private" ||
                              job.jobpost_for === "internal") &&
                            !job.is_draft && (
                              <ErrorDisplay text="This job has not been posted to the careers portal" />
                            )}
                          {job.is_draft && (
                            <ErrorDisplay text="This job is still a draft" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell center>
                        {job.job_status
                          ? job.job_status[0].toUpperCase() +
                            job.job_status.slice(1, job.job_status.length)
                          : null}
                      </TableCell>
                      <TableCell center>{job.created_at}</TableCell>
                    </TableRow>
                  );
                })}
            </tbody>
          </Table>
        </InfiniteScroller>
      </TableScroll>
      <Footer>
        <div>
          <button
            type="button"
            className="button button--default button--grey-light"
            onClick={() => setView("initial")}
          >
            Back
          </button>
          {selectedJob && (
            <button
              type="button"
              className="button button--default button--primary"
              onClick={() =>
                setView(
                  participants && participants.length > 1
                    ? "confirm-participants"
                    : originalSource
                    ? "final"
                    : "select-list"
                )
              }
            >
              Next
            </button>
          )}
        </div>
      </Footer>
    </>
  );
};

export default ParticipantsList;

const TableScroll = styled.div`
  max-height: 500px;
  min-height: 200px;
  overflow: auto;
  margin: 0px 30px;
`;

const Footer = styled.div`
  padding-top: 30px;
  border-top: solid #eee 1px;
  div {
    button:first-of-type {
      margin-right: 10px;
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 20px 20px 20px;
  align-items: flex-end;

  p {
    margin: 0;
  }
`;

const ErrorDisplay = ({ text }) => (
  <ErrorWrap>
    <WarningIcon color="orange" />
    <span>{text}</span>
  </ErrorWrap>
);

const ErrorWrap = styled.div`
  display: flex;
  align-items: center;
  color: #ffa076;
  font-size: 10px;
  margin-left: 10px;

  span {
    margin-left: 5px;
  }
`;
