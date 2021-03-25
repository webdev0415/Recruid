import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Tooltip from "react-simple-tooltip";
import styled from "styled-components";
import { ROUTES } from "routes";
import GlobalContext from "contexts/globalContext/GlobalContext";
import CellMenuJob from "../CellMenuJob";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import { permissionChecker } from "constants/permissionHelpers";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import notify from "notifications";
import Marquee from "sharedComponents/Marquee";
import StatusSelect from "sharedComponents/StatusSelect";
import { JobStatusOptions } from "constants/statusOptions";
import JobHold from "sharedComponents/JobHold";
import SizzlingComponent from "sharedComponents/SizzlingComponent";
import ReviewRowComponent from "components/ViewJobs/components/ViewJobTable/ReviewRowComponent";

const ViewJobTable = (props) => {
  const store = useContext(GlobalContext);

  const editJobHold = (holdState, index) => {
    let newJobs = [...props.jobs];
    newJobs[index] = { ...newJobs[index], on_hold: holdState };
    props.setJobs(newJobs);
  };

  const editJobSizzlingFactor = (sizzle_score, index) => {
    let newJobs = [...props.jobs];
    newJobs[index] = { ...newJobs[index], sizzle_score };
    props.setJobs(newJobs);
  };

  return (
    <InfiniteScroller
      fetchMore={props.fetchMore}
      hasMore={props.hasMore}
      dataLength={props.jobs?.length || 0}
    >
      <Container>
        <div className="table-responsive">
          <table className="table table-borderless">
            <thead>
              <tr>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Job Title
                </th>
                <th scope="col" className={sharedStyles.tableHeader}></th>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Type
                </th>
                {props.company.type === "Agency" && (
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Client
                  </th>
                )}
                <th scope="col" className={sharedStyles.tableCandidates}>
                  <Tooltip
                    content={"Active Candidates"}
                    placement="bottom"
                    fontSize="10px"
                    padding={10}
                    style={{
                      lineHeight: "16px",
                    }}
                  >
                    Candidates
                  </Tooltip>
                </th>
                <th scope="col" className={sharedStyles.tableStatus}>
                  Status
                </th>
                <th scope="col" className={sharedStyles.tableDate}>
                  Created
                </th>
                <th scope="col" className={sharedStyles.tableButtons} />
              </tr>
            </thead>
            <tbody>
              {!!props.jobs &&
                props.jobs.map((job, index) => {
                  if (!job) return null;
                  // let available;
                  if (
                    !!job &&
                    typeof job.available_positions !== `undefined` &&
                    typeof job.available_positions !== `object`
                  ) {
                    // available = job.available_positions;
                  }
                  // available = 0;
                  // const filled = job.taken_positions ? job.taken_positions : 0;
                  return (
                    <tr key={`job_${index}`} className="table-row-hover">
                      <th
                        scope="row"
                        className={sharedStyles.tableItemFirst}
                        style={{ overflow: "unset" }}
                        colSpan={
                          job.approval?.id && approvalStatuses[job.job_status]
                            ? 2
                            : 1
                        }
                      >
                        <STLink
                          to={ROUTES.JobDashboard.url(
                            props.company.mention_tag,
                            job.title_slug
                          )}
                        >
                          <Marquee
                            height="25"
                            width={{
                              s: 100,
                              m: 120,
                              l: 140,
                              xl: 150,
                            }}
                          >
                            {job.title}
                          </Marquee>{" "}
                        </STLink>
                        {job.approval?.id &&
                          approvalStatuses[job.job_status] && (
                            <ReviewRowComponent job={job} store={store} />
                          )}
                      </th>
                      {(!job.approval?.id ||
                        !approvalStatuses[job.job_status]) && (
                        <td className={sharedStyles.tableItem}>
                          <FlexContainer>
                            {job.is_draft ? (
                              <DraftButton>Draft</DraftButton>
                            ) : (
                              <>
                                <JobHold
                                  onHold={job.on_hold}
                                  job_id={job.id}
                                  job={job}
                                  store={store}
                                  changeHoldState={(newHoldState) =>
                                    editJobHold(newHoldState, index)
                                  }
                                  style={{ marginRight: "14px" }}
                                />
                                <SizzlingComponent
                                  hotness={job.sizzle_score}
                                  job_id={job.id}
                                  job={job}
                                  store={store}
                                  changeNewSizzlingFactor={(sizzle_score) =>
                                    editJobSizzlingFactor(sizzle_score, index)
                                  }
                                />
                              </>
                            )}
                          </FlexContainer>
                        </td>
                      )}
                      <td className={sharedStyles.tableItem}>
                        <JobTypeLabel className={job.job_type}>
                          {jobTypeExchanger[job.job_type]}
                        </JobTypeLabel>
                      </td>
                      {props.company.type === "Agency" && (
                        <td className={sharedStyles.tableItem}>
                          {job.company.id !== props.company.id && (
                            <Tooltip
                              content={job.company.name}
                              placement="bottom"
                              fontSize="12px"
                              padding={10}
                              style={{
                                display: "inline-flex",
                                lineHeight: "16px",
                              }}
                            >
                              <ClientButton>{job.company.name}</ClientButton>
                            </Tooltip>
                          )}
                        </td>
                      )}
                      <td className={sharedStyles.tableItem}>
                        <Link
                          to={ROUTES.JobDashboard.url(
                            props.company.mention_tag,
                            job.title_slug,
                            "applicants"
                          )}
                          style={{ color: "inherit" }}
                        >
                          {job.applicant_count > 0 && (
                            <>{job.applicant_count}</>
                          )}
                          {job.applicant_count === 0 && "-"}
                        </Link>
                      </td>
                      <td className={sharedStyles.tableItemStatus}>
                        <StatusSelect
                          selectedStatus={job.job_status}
                          statusOptions={JobStatusOptions}
                          onStatusSelect={(status) => {
                            props.updateJobStatus(status, job.id);
                          }}
                          disabled={
                            !permissionChecker(store.role?.role_permissions, {
                              recruiter: true,
                            }).edit ||
                            ((job.job_status === "awaiting for review" ||
                              job.job_status === "declined") &&
                              !store.role.role_permissions.owner &&
                              !store.role.role_permissions.admin)
                          }
                        />
                      </td>
                      <td className={sharedStyles.tableItem}>
                        {job.created_at}
                      </td>
                      <td className={sharedStyles.tableButtons}>
                        <CellMenuJob
                          mentionTag={props.company.mention_tag}
                          job={job}
                          editJob={() => props.editJob(job, index)}
                          deleteJob={() => props.deleteJob(job, index)}
                          setActiveJob={props.setActiveJob}
                          setActiveModal={props.openModal}
                          publishDraft={() =>
                            props
                              .publishDraft(props.company.id, job.id)
                              .then((response) => {
                                if (response !== "err") {
                                  props.updateJobStatus("open", job.id);
                                  notify(
                                    "info",
                                    "Successfully Published Draft Job!"
                                  );
                                }
                              })
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Container>
    </InfiniteScroller>
  );
};

export default ViewJobTable;

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

const STLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const jobTypeExchanger = {
  permanent: "Perm",
  temp: "Temp",
  contract: "Contr",
};

const JobTypeLabel = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.025em;
  color: #74767b;
  &.contract {
    color: #74767b;
  }
  &.temp {
    color: #0892c1;
  }
  &.permanent {
    color: #1c4a6a;
  }
`;

const Container = styled.div`
  background: #fff;
  border-radius: 0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  margin-left: -15px;
  margin-right: -15px;
  margin-top: 20px;

  @media screen and (min-width: 768px) {
    border-radius: 4px;
    margin: 0;
    margin-top: 20px;
  }
`;

const approvalStatuses = {
  "awaiting for review": true,
  declined: true,
  approved: true,
};
