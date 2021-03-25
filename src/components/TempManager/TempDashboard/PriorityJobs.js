import React, { useState, useEffect } from "react";
import { ROUTES } from "routes";
import { Link } from "react-router-dom";
import Marquee from "sharedComponents/Marquee";
import styled from "styled-components";
// import { fetchJobs } from "helpersV2/jobs";
import { fetchTempJobs } from "helpersV2/tempPlus";
import notify from "notifications";
import { Table, TableRow, TableCell, TableHeader } from "styles/Table";
import AvatarIcon from "sharedComponents/AvatarIcon";
import JobCompletionBar from "components/TempManager/JobCompletionBar";
import spacetime from "spacetime";

const PriorityJobs = ({ store, permission }) => {
  const [jobs, setJobs] = useState(undefined);
  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    if (store.company && store.role && permission.view) {
      fetchTempJobs(
        store.session,
        store.company.id,
        {
          slice: [0, 5],
          operator: "and",
          team_member_id: store.role.team_member.team_member_id,
          priority_jobs: true,
        },
        signal
      ).then((jbs) => {
        if (!jbs.err) {
          setJobs(jbs);
        } else if (!signal.aborted) {
          notify("danger", jbs);
        }
      });
    }
    return () => controller.abort();
     
  }, [store.company, store.role, store.session, permission]);

  return (
    <>
      {jobs && jobs.length > 0 && (
        <>
          <TitleContainer>
            <Title>Priority Jobs</Title>
          </TitleContainer>
          <TableContainer>
            <Table>
              <thead>
                <TableRow>
                  <TableHeader />
                  <TableHeader />
                  <TableHeader>Candidates</TableHeader>
                  <TableHeader>Fill Status</TableHeader>
                  <TableHeader>Start date</TableHeader>
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
                              m: 150,
                              l: 200,
                              xl: 250,
                            }}
                          >
                            {job.company?.name}
                          </Marquee>
                        </div>
                      </TableCell>
                      <TableCell>
                        <UnstyledLink
                          to={ROUTES.TempJobDashboard.url(
                            store.company.mention_tag,
                            job.title_slug
                          )}
                        >
                          <Marquee
                            height="25"
                            width={{
                              s: 150,
                              m: 200,
                              l: 250,
                              xl: 300,
                            }}
                          >
                            {job.title}
                          </Marquee>
                        </UnstyledLink>
                      </TableCell>
                      <TableCell>
                        <CandidatesTotal className="d-flex">
                          <i className="fas fa-user-friends"></i>
                          <span> {job.temp_plus.employees}</span>
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
                        {job.temp_plus.contract_start_date
                          ? spacetime(job.temp_plus.contract_start_date).format(
                              "{date} {month}, {year}"
                            )
                          : ""}
                      </TableCell>
                    </TableRow>
                  ))}
              </tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default PriorityJobs;

const CandidatesTotal = styled.div`
  span {
    margin-left: 5px;
  }
  i {
    color: #c4c4c4;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 50px;
`;

const Title = styled.h3`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
`;

const UnstyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  display: flex;

  &:hover {
    color: inherit;
    text-decoration: none;
  }
`;

const TableContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
`;
