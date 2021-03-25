import React, { Fragment, useState, useEffect } from "react";
import Tooltip from "react-simple-tooltip";

import { JobTableRow } from "./JobTableRow";
import CandidateTableRow from "./CandidatesTableRow";
import { TableSC } from "../PipelineComponents";
import { EmptyRow } from "../EmptyRow";
import { AWS_CDN_URL } from "constants/api";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";

const { THead, TableWrapper } = TableSC;

const Table = ({
  type,
  client,
  data,
  company,
  session,
  PipelineView,
  nextDataSlice,
  prevDataSlice,
  disableNextFetch,
  filteredDataSlice,
  singleJob,
  totalResults,
  parentFilterOption,
  teamMembers,
  interviewStages,
}) => {
  const [applicants, setApplicants] = useState([]);
  const [activeRow, setActiveRow] = useState(-1);
  const sliceStep = 10;

  const cleanUp = () => {
    const rows = document.getElementsByClassName("job-table-row");
    for (let row of rows) {
      row.classList.remove("inactive-row");
    }
    setActiveRow(-1);
  };

  useEffect(() => {
    if (type === "candidates") {
      setApplicants([...data]);
    } else {
      return () => {
        cleanUp();
      };
    }
  }, [data, type]);

  const toggleDisplayPipeline = (e, applicantCount) => {
    const { target } = e;
    if (
      !applicantCount ||
      target.id === "job-cell-menu" ||
      target.tagName === "svg" ||
      target.tagName === "path"
    )
      return false;
    const jobRows = document.getElementsByClassName("job-table-row");
    const node = e.target.classList.contains("job-table-row")
      ? target
      : target.parentNode;

    setActiveRow((state) => {
      let newState = state === node.id ? -1 : node.id;
      if (newState === -1)
        for (let row of jobRows) {
          row.classList.remove("inactive-row");
        }
      else
        for (let row of jobRows) {
          if (row.id === newState) {
            row.classList.remove("inactive-row");
            continue;
          }
          row.classList.add("inactive-row");
        }
      return newState;
    });
  };

  return (
    <Fragment>
      <div className="table-responsive">
        <TableWrapper
          className={`${type === "candidates" && "candidates"} ${
            client && "client"
          } table`}
        >
          <THead>
            <tr>
              <th className={sharedStyles.tableHeader}>
                {type === "jobs" ? "Job Title " : "Candidate "}
                {filteredDataSlice
                  ? `(${filteredDataSlice[0] + data.length} of ${totalResults})`
                  : data.length
                  ? `(${data.length} of ${totalResults})`
                  : ``}
              </th>
              <th className={sharedStyles.tableHeader}>
                <Tooltip
                  content={
                    type === "jobs" ? "Candidates at this stage" : "Status"
                  }
                  placement="bottom"
                  fontSize="10px"
                  padding={10}
                  style={{
                    lineHeight: "16px",
                  }}
                >
                  {type === "jobs" ? "Cand (At Stage)" : "Status"}
                </Tooltip>
              </th>
              {type === "jobs" && (
                <th className={sharedStyles.tableHeader}>
                  <Tooltip
                    content={"Total amount of candidates"}
                    placement="bottom"
                    fontSize="10px"
                    padding={10}
                    style={{
                      lineHeight: "16px",
                    }}
                  >
                    Total (Active)
                  </Tooltip>
                </th>
              )}
              {type === "jobs" && (
                <th className={sharedStyles.tableHeader}>Status</th>
              )}
              {type === "candidates" && (
                <th className={sharedStyles.tableHeader}>Source</th>
              )}
              {type === "candidates" && (
                <th className={sharedStyles.tableHeader}>Last Update</th>
              )}
              <th className={sharedStyles.tableButtons}>
                <>
                  <button
                    className={
                      !filteredDataSlice || filteredDataSlice[0] < sliceStep
                        ? "disabled"
                        : ""
                    }
                    onClick={() => prevDataSlice(sliceStep)}
                  >
                    <img
                      src={`${AWS_CDN_URL}/icons/PrevIcon.svg`}
                      alt="PrevIcon"
                    />
                  </button>
                  <button
                    className={disableNextFetch ? "disabled" : ""}
                    onClick={() => nextDataSlice(sliceStep)}
                  >
                    <img
                      src={`${AWS_CDN_URL}/icons/NextIcon.svg`}
                      alt="NextIcon"
                    />
                  </button>
                </>
              </th>
            </tr>
          </THead>
          <tbody>
            {type === "jobs" ? (
              !!data && !!data.length ? (
                data.map((job, idx) => (
                  <JobTableRow
                    key={`table-row-#${idx + 1}`}
                    company={company}
                    data={job}
                    PipelineView={PipelineView}
                    session={session}
                    toggleDisplayPipeline={toggleDisplayPipeline}
                    activeRow={activeRow}
                    parentFilterOption={parentFilterOption}
                    teamMembers={teamMembers}
                    interviewStages={interviewStages}
                  />
                ))
              ) : (
                <EmptyRow>You have no jobs at this stage</EmptyRow>
              )
            ) : applicants.length ? (
              applicants.map((applicant, idx) => (
                <>
                  <CandidateTableRow
                    key={`table-row-#${idx + 1}`}
                    applicant={applicant}
                    index={idx}
                    company={company}
                    singleJob={singleJob}
                  />
                </>
              ))
            ) : (
              <EmptyRow>You have no applicants at this stage</EmptyRow>
            )}
          </tbody>
        </TableWrapper>
      </div>
    </Fragment>
  );
};

export default Table;
