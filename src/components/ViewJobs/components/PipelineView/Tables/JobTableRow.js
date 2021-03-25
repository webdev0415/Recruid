import React, { Fragment, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { TableSC } from "../PipelineComponents";
import { ROUTES } from "routes";
// import CellMenuJob from "components/ViewJobs/components/CellMenuJob";
import { JobStatusOptions } from "constants/statusOptions";

import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";

const { TableRow } = TableSC;

const ButtonOpen = styled.button`
  background-color: #2a3744;
  border-radius: 13px;
  color: #fff !important;
  display: inline-block;
  font-size: 12px !important;
  font-weight: 500;
  padding: 2px 10px !important;

  &:hover {
    text-decoration: none;
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
  margin-left: 15px;
  padding: 4px 8px;
  text-align: center;
  text-transform: uppercase;
`;

export const JobTableRow = ({
  company,
  data,
  PipelineView,
  session,
  toggleDisplayPipeline,
  activeRow,
  parentFilterOption,
  teamMembers,
  interviewStages,
}) => {
  const [displayPipeline, setDisplayPipeline] = useState(false);
  const [redirect, setRedirect] = useState(undefined);

  useEffect(() => {
    setDisplayPipeline(Number(activeRow) === data.id);
  }, [activeRow, data]);

  return (
    <Fragment>
      <TableRow
        onClick={(e) => toggleDisplayPipeline(e, data.applicant_count)}
        className={`job-table-row`}
        e
        id={data.id}
      >
        <td className={sharedStyles.tableItemFirst}>
          {data.title}
          {data.company.id !== company.id && (
            <ClientButton>{data.company.name}</ClientButton>
          )}
        </td>
        <td className={sharedStyles.tableItem}>
          {data.applicant_count_latest_stage === 0
            ? "-"
            : data.applicant_count_latest_stage}
        </td>
        <td className={sharedStyles.tableItem}>
          {data.applicant_count === 0 ? "-" : data.applicant_count}
        </td>
        <td className={sharedStyles.tableItem}>
          {JobStatusOptions[data.job_status]?.title}
        </td>
        {/*<td
          className={sharedStyles.tableItemStatus}
          style={{ width: 120 }}
        ></td>*/}
        {/*<td className={sharedStyles.tableItem}>{data.created_at}</td>*/}
        <td className={sharedStyles.tableItem} style={{ textAlign: "right" }}>
          {redirect && <Redirect to={redirect} />}
          <FlexContainer>
            <ButtonOpen
              onClick={() =>
                setRedirect(
                  ROUTES.JobDashboard.url(company.mention_tag, data.title_slug)
                )
              }
            >
              Go To Job
            </ButtonOpen>
          </FlexContainer>
        </td>
      </TableRow>
      {!!displayPipeline && (
        <TableRow className="pipeline-overview-row">
          <td className="pipeline-overview" colSpan={4}>
            <PipelineView
              company={company}
              data={data}
              displayTable={true}
              session={session}
              type="candidates"
              parentFilterOption={parentFilterOption}
              teamMembers={teamMembers}
              interviewStages={interviewStages}
            />
          </td>
        </TableRow>
      )}
    </Fragment>
  );
};

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
`;
