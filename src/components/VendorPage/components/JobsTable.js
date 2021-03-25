import React, { useState, useEffect, lazy } from "react";
import Tooltip from "react-simple-tooltip";
import { Link } from "react-router-dom";
import styled from "styled-components";

import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import EmptyContainer from "sharedComponents/EmptyContainer";
import { AWS_CDN_URL } from "constants/api";
import { ROUTES } from "routes";

import vendorHelpers from "helpers/vendorPage/vendorPage.helpers";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import retryLazy from "hooks/retryLazy";

const PipelineView = lazy(() =>
  retryLazy(() =>
    import("components/ViewJobs/components/PipelineView/PipelineView")
  )
);

const bg = {
  hired: "#00cba7",
  open: "#004A6D",
  closed: "black",
};

const TableContainer = ({
  searchedJobs,
  company,
  vendor,
  vendorId,
  session,
  jobsSearchPending,
  pipelineViewEnabled,
  interviewStages,
}) => {
  return (
    <>
      {company &&
        vendor &&
        (!pipelineViewEnabled ? (
          <>
            {company && vendor && !jobsSearchPending ? (
              <ViewJobTable
                company={company}
                searchedJobs={searchedJobs}
                vendor={vendor}
                vendorId={vendorId}
                session={session}
              />
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </>
        ) : (
          <div className="leo-relative">
            <ATSContainer>
              <PipelineView
                interviewStages={interviewStages}
                displayTable={true}
                type="jobs"
                clientId={vendorId}
              />
            </ATSContainer>
          </div>
        ))}
    </>
  );
};

export default TableContainer;

const ViewJobTable = ({ searchedJobs, company, vendor, vendorId, session }) => {
  const [vendorJobs, setVendorJobs] = useState(undefined);
  const [hasPages, setHasPages] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [jobsSource, setJobsSource] = useState([]);

  useEffect(() => {
    vendorHelpers
      .fetchVendorJobs(company.id, vendorId, session, 1)
      .then((jobs) => {
        if (jobs !== "err") {
          setVendorJobs(vendorHelpers.sortByDate(jobs.list));
          if (jobs.list.length !== jobs.total) setHasPages(true);
        }
      })
      .then(() => setShowPreloader(false));
  }, [company, session, vendorId]);

  useEffect(() => {
    setJobsSource(!searchedJobs ? vendorJobs : searchedJobs);
  }, [searchedJobs, vendorJobs]);

  const getMoreJobs = () => {
    // const totalPages = Math.ceil(vendor.active_jobs / 30);
    let nextPage = vendorJobs.length / 30 + 1;
    vendorHelpers
      .fetchVendorJobs(company.id, vendorId, session, nextPage)
      .then((jobs) => {
        let prevJobs = [...vendorJobs];
        prevJobs = prevJobs.concat(jobs);
        setVendorJobs(prevJobs);
        if (prevJobs.length === vendor.active_jobs) {
          setHasPages(false);
        }
      });
  };

  return (
    <>
      <ATSContainer>
        {showPreloader ? (
          <Spinner />
        ) : vendorJobs && vendorJobs.length > 0 ? (
          <Container>
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Job Title
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      <Tooltip
                        content={
                          company.type === "Employer"
                            ? "Active Candidates"
                            : "Submitted Candidates"
                        }
                        placement="bottom"
                        fontSize="10px"
                        padding={10}
                        style={{
                          lineHeight: "16px",
                        }}
                      >
                        {company.type === "Employer"
                          ? "Cand (Active)"
                          : "Cand (Subm)"}
                      </Tooltip>
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Positions
                      {/* Cand (Total) */}
                    </th>
                    <th scope="col" className={sharedStyles.tableStatus}>
                      Status
                    </th>
                    <th scope="col" className={sharedStyles.tableDate}>
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!!jobsSource &&
                    jobsSource.map((job, index) => {
                      const available = job.available_positions
                        ? job.available_positions
                        : 0;
                      const filled = job.taken_positions
                        ? job.taken_positions
                        : 0;

                      return (
                        <tr key={`job_${index}`} className="table-row-hover">
                          <th
                            scope="row"
                            className={sharedStyles.tableItemFirst}
                          >
                            <Link
                              to={ROUTES.JobDashboard.url(
                                company.mention_tag,
                                job.slug
                              )}
                            >
                              {job.title}
                            </Link>
                          </th>
                          <td className={sharedStyles.tableItem}>
                            {job.candidates > 0 && <>{job.candidates}</>}
                            {job.applicant_count === 0 && "-"}
                          </td>
                          <td className={sharedStyles.tableItem}>
                            {available ? (
                              <>{filled + " / " + available}</>
                            ) : (
                              <>{filled + " / 1"}</>
                            )}
                          </td>
                          <td className={sharedStyles.tableItemStatus}>
                            <div className="leo-relative">
                              <ButtonMenu
                                style={{ backgroundColor: bg[job.job_status] }}
                              >
                                {job.job_status
                                  ? job.job_status[0].toUpperCase() +
                                    job.job_status.slice(
                                      1,
                                      job.job_status.length
                                    )
                                  : null}
                              </ButtonMenu>
                            </div>
                          </td>
                          <td className={sharedStyles.tableItem}>
                            {`created_at` in job &&
                              job.created_at.split("T")[0]}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {hasPages ? (
                <div
                  style={{
                    textAlign: "center",
                    width: "100%",
                    padding: "10px",
                  }}
                >
                  <button
                    className="button button--default button--blue-dark"
                    onClick={getMoreJobs}
                  >
                    Load More
                  </button>
                </div>
              ) : null}
            </div>
          </Container>
        ) : (
          <EmptyContainer
            buttonAction={() =>
              window.open(ROUTES.ViewJobs.url(company.mention_tag), "_self")
            }
            buttonText={"Add Jobs"}
            image={`${AWS_CDN_URL}/icons/empty-icons/empty-jobs.svg`}
            text={`No jobs added for ${vendor.name} yet`}
            title={"No Jobs"}
          />
        )}
      </ATSContainer>
    </>
  );
};

const ButtonMenu = styled.div`
  background: #fff;
  align-items: center;
  background-color: #a8abb1;
  border-radius: 13px;
  display: flex;
  font-size: 12px;
  font-weight: 500;
  height: 26px;
  justify-content: space-between;
  min-width: 160px;
  padding-left: 15px !important;
  padding-right: 10px !important;
  width: 100%;
`;

const Container = styled.div`
  background: #fff;
  border-radius: 0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  margin-left: -15px;
  margin-right: -15px;
  margin-top: 20px;
  overflow: hidden;

  @media screen and (min-width: 768px) {
    border-radius: 4px;
    margin: 0;
    margin-top: 0;
  }
`;
