import React, { useState, Suspense } from "react";
import { ROUTES } from "routes";
import { Link } from "react-router-dom";
import Marquee from "sharedComponents/Marquee";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import { Table, TableHeader, TableRow, TableCell } from "styles/Table";
import styled from "styled-components";
import AvatarIcon from "sharedComponents/AvatarIcon";
import JobCompletionBar from "components/TempManager/JobCompletionBar";
import spacetime from "spacetime";
import { deleteJob } from "components/ViewJobs/helpers/viewJobsHelpers";
import notify from "notifications";
import retryLazy from "hooks/retryLazy";
import JobHold from "sharedComponents/JobHold";
import SizzlingComponent from "sharedComponents/SizzlingComponent";
import CellMenuJob from "components/ViewJobs/components/CellMenuJob";
import DuplicateJobModal from "modals/DuplicateJobModal";
import ReviewRowComponent from "components/ViewJobs/components/ViewJobTable/ReviewRowComponent";

const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);

const ShareJobSocialModal = React.lazy(() =>
  retryLazy(() => import("modals/ShareJobSocialModal"))
);

const TempJobsTable = ({
  store,
  fetchMore,
  hasMore,
  jobs,
  setJobs,
  activeModal,
  setActiveModal,
  refreshJobs,
}) => {
  const [activeJobIx, setActiveJobIx] = useState(undefined);
  const [activeJob, setActiveJob] = useState(undefined);

  const deleteJobCall = () => {
    deleteJob(store.company.id, jobs[activeJobIx].id, store.session).then(
      (response) => {
        if (response !== "err") {
          setActiveModal(undefined);
        } else {
          notify("danger", "Unable to delete job");
        }
      }
    );
  };

  const editJobHold = (holdState, index) => {
    let newJobs = [...jobs];
    newJobs[index] = { ...newJobs[index], on_hold: holdState };
    setJobs(newJobs);
  };

  const editJobSizzlingFactor = (sizzle_score, index) => {
    let newJobs = [...jobs];
    newJobs[index] = { ...newJobs[index], sizzle_score };
    setJobs(newJobs);
  };

  return (
    <>
      <InfiniteScroller
        fetchMore={fetchMore}
        hasMore={hasMore}
        dataLength={jobs?.length || 0}
      >
        <Table>
          <thead>
            <TableRow>
              <TableHeader />
              <TableHeader />
              <TableHeader />
              <TableHeader>Candidates</TableHeader>
              <TableHeader>Fill Status</TableHeader>
              <TableHeader>Start Date</TableHeader>
              <TableHeader />
            </TableRow>
          </thead>
          <tbody>
            {jobs &&
              jobs.map((job, index) => (
                <TableRow key={`job-row-${index}`}>
                  <TableCell>
                    <div className="d-flex">
                      <AvatarIcon
                        name={job.company?.name || job.title}
                        imgUrl={job.company?.avatar_url}
                        size={25}
                        style={{
                          marginRight: "10px",
                        }}
                      />
                      <Marquee
                        height="25"
                        width={{
                          s: 100,
                          m: 120,
                          l: 140,
                          xl: 150,
                        }}
                      >
                        {job.company?.name}
                      </Marquee>
                    </div>
                  </TableCell>
                  <TableCell
                    colSpan={
                      job.approval?.id && approvalStatuses[job.job_status]
                        ? 2
                        : 1
                    }
                  >
                    <UnstyledLink
                      to={ROUTES.TempJobDashboard.url(
                        store.company.mention_tag,
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
                      </Marquee>
                    </UnstyledLink>
                    {job.approval?.id && approvalStatuses[job.job_status] && (
                      <ReviewRowComponent job={job} store={store} />
                    )}
                  </TableCell>
                  {(!job.approval?.id || !approvalStatuses[job.job_status]) && (
                    <TableCell>
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
                    </TableCell>
                  )}
                  <TableCell>
                    <CandidatesTotal className="d-flex">
                      <i className="fas fa-user-friends"></i>
                      <span> {job.applicant_count}</span>
                    </CandidatesTotal>
                  </TableCell>
                  <TableCell>
                    <JobCompletionBar
                      total={job.temp_plus.total_shifts}
                      confirmed={job.temp_plus.confirmed_shifts}
                      unconfirmed={job.temp_plus.pending_shifts}
                      to_fill={job.temp_plus.unfilled_shifts}
                    />
                  </TableCell>
                  <TableCell>
                    {job.contract_start_date
                      ? spacetime(job.contract_start_date).format(
                          "{date} {month-short}, {year}"
                        )
                      : ""}
                  </TableCell>
                  <TableCell>
                    <CellMenuJob
                      mentionTag={store.company.mention_tag}
                      job={job}
                      deleteJob={() => {
                        setActiveJobIx(index);
                        setActiveModal("delete-job");
                      }}
                      setActiveJob={setActiveJob}
                      setActiveModal={setActiveModal}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </tbody>
        </Table>
      </InfiniteScroller>
      {activeModal === "delete-job" && (
        <Suspense fallback={<div />}>
          <ConfirmModalV2
            show={true}
            hide={() => {
              setActiveJobIx(undefined);
              setActiveModal(undefined);
            }}
            header="Delete Job"
            text="Are you sure you want to delete this job?"
            actionText="Delete"
            actionFunction={() => deleteJobCall()}
          />
        </Suspense>
      )}
      {activeJob && activeModal === "duplicate-job" && (
        <DuplicateJobModal
          jobId={activeJob.id}
          hide={() => {
            setActiveJob(undefined);
            setActiveModal(undefined);
          }}
          store={store}
          refreshJobs={refreshJobs}
        />
      )}
      {activeModal === "share-job-social" && activeJob && (
        <Suspense fallback={<div />}>
          <ShareJobSocialModal
            job={activeJob}
            company={store.company}
            hide={() => {
              setActiveJob(undefined);
              setActiveModal(undefined);
            }}
          />
        </Suspense>
      )}
    </>
  );
};

const UnstyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  display: flex;

  &:hover {
    color: inherit;
    text-decoration: none;
  }
`;

const CandidatesTotal = styled.div`
  span {
    margin-left: 5px;
  }
  i {
    color: #c4c4c4;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
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

const approvalStatuses = {
  "awaiting for review": true,
  declined: true,
  approved: true,
};

export default TempJobsTable;
