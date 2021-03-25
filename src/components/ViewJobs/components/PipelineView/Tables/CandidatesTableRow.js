import React from "react";
import { ROUTES } from "routes";
import { Link } from "react-router-dom";

import { TableSC } from "../PipelineComponents";

import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { statusNames } from "constants/stageOptions";
import styled from "styled-components";

const ButtonOpen = styled(Link)`
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

const { TableRow } = TableSC;

const CandidateTableRow = ({ applicant, company, singleJob }) => {
  return (
    <TableRow>
      <td className={sharedStyles.tableItemFirst}>
        <Link
          to={ROUTES.CandidateProfile.url(
            company.mention_tag,
            applicant.professional_id,
            "overview",
            `?&job_id=${singleJob.id}${
              singleJob && singleJob.company?.id !== company.id
                ? `&client_id=${singleJob.company.id}`
                : ""
            }`
          )}
        >
          {applicant.name}
        </Link>
      </td>
      <td className={sharedStyles.tableItemStatus}>
        {statusNames[applicant.status] || applicant.status}
      </td>
      <td className={sharedStyles.tableItemStatus}>
        {(applicant.added_by_company || applicant.added_by) &&
          (applicant.added_by_company !== company.name ? (
            <>{applicant.added_by_company}</>
          ) : applicant.added_by ? (
            <>{applicant.added_by}</>
          ) : (
            ""
          ))}
      </td>
      <td className={sharedStyles.tableItem}>{applicant.last_update}</td>
      <td className={sharedStyles.tableItem} style={{ textAlign: "right" }}>
        <FlexContainer>
          <ButtonOpen
            to={ROUTES.CandidateProfile.url(
              company.mention_tag,
              applicant.professional_id
            )}
          >
            View Applicant
          </ButtonOpen>
        </FlexContainer>
      </td>
    </TableRow>
  );
};
export default CandidateTableRow;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
`;
