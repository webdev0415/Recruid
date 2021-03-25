import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";

import { jobAnalytics, professionalsAtStagePerJob } from "../helpers";
import notify from "notifications";
import { ROUTES } from "routes";
import GlobalContext from "contexts/globalContext/GlobalContext";
import AvatarIcon from "sharedComponents/AvatarIcon";
import Bar from "../shared/Bar";
import Doughnut from "../shared/Doughnut";
import EmptyTab from "components/Profiles/components/EmptyTab";
import FilterSelector from "../FilterSelector";
import StageSelector from "../shared/StageSelector";
import StatCell from "sharedComponents/StatCell";
import { CAREERS_PORTAL_URL } from "constants/api";
import {
  StatContainer,
  StatContainerSingle,
  StatContainerDouble,
} from "../shared/components";
import JobsSelect from "components/Analytics/JobStats/JobsSelect";

import emptyStyles from "assets/stylesheets/scss/collated/shared.module.scss";

import sharedStyles from "../style/shared.module.scss";
import analyticsStyles from "assets/stylesheets/scss/collated/analytics.module.scss";
import { fetchJobs } from "helpersV2/jobs";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import { EmptyJobs } from "assets/svg/EmptyImages";

const JobContainer = styled.div`
  padding: 0 !important;

  @media (min-width: 1024px) {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
`;

// const JobDescription = styled.div`
//   -webkit-line-clamp: 1;
//   display: -webkit-box;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// `;
const SLICE_LENGHT = 20;

const JobStatsHook = (props) => {
  const store = useContext(GlobalContext);
  const [jobs, setJobs] = useState(undefined);
  const [selectedJob, setSelectedJob] = useState(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState("");
  const controller = new AbortController();
  const signal = controller.signal;
  const [analytics, setAnalytics] = useState(undefined);
  const [dateBoundary, setDateBoundary] = useState("this month");
  const [selectedStagePerJob, setSelectedStagePerJob] = useState("applied");
  const [professionalsAtStage, setProfessionalsAtStage] = useState(0);
  const [sourceDisplay, setSourceDisplay] = useState("%");
  useEffect(() => {
    if (store.company && store.role && !props.jobId) {
      fetchJobs(
        store.session,
        store.company.id,
        {
          slice: [0, SLICE_LENGHT],
          operator: "and",
          team_member_id: store.role.team_member.team_member_id,
          search: search?.length > 0 ? [search] : undefined,
        },
        signal
      ).then((jbs) => {
        if (!jbs.err) {
          setJobs(jbs);
          if (!selectedJob && jbs.length > 0) {
            setSelectedJob(jbs[0]);
          }
          if (jbs.length === SLICE_LENGHT) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
        } else if (!signal.aborted) {
          notify("danger", jbs);
        }
      });
    }
    return () => controller.abort();
  }, [store.company, store.role, store.session, props.jobId, search]);

  const fetchMore = () => {
    fetchJobs(
      store.session,
      store.company.id,
      {
        slice: [jobs.length, SLICE_LENGHT],
        operator: "and",
        team_member_id: store.role.team_member.team_member_id,
        search: search?.length > 0 ? [search] : undefined,
      },
      signal
    ).then((jbs) => {
      if (!jbs.err) {
        setJobs([...jobs, ...jbs]);
        if (jbs.length === SLICE_LENGHT) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else if (!signal.aborted) {
        notify("danger", jbs);
      }
    });
  };

  useEffect(() => {
    if (
      store.company &&
      store.session &&
      ((selectedJob && !props.jobId) || (props.jobId && !selectedJob))
    ) {
      jobAnalytics(
        store.company.id,
        selectedJob?.id || props.jobId?.id,
        dateBoundary,
        store.session
      ).then((jobAnalytics) => {
        if (jobAnalytics !== "err") {
          setAnalytics(jobAnalytics);
          if (!selectedJob && props.jobId) {
            setSelectedJob(props.jobId);
          }
        } else {
          notify("danger", "Unable to fetch analytics");
        }
      });
    }
  }, [selectedJob, props.jobId, dateBoundary, store.session, store.company]);

  useEffect(() => {
    if (
      store.company &&
      store.session &&
      ((selectedJob && !props.jobId) || (props.jobId && !selectedJob))
    ) {
      professionalsAtStagePerJob(
        store.company.id,
        selectedJob?.id || props.jobId?.id,
        selectedStagePerJob,
        dateBoundary,
        store.session
      ).then((count) => {
        setProfessionalsAtStage(count.job_professionals_at_stage);
      });
    }
  }, [
    selectedJob,
    props.jobId,
    dateBoundary,
    selectedStagePerJob,
    store.session,
    store.company,
  ]);

  if (selectedJob && analytics) {
    return (
      <ATSContainer>
        <div
          className="leo-flex"
          style={{
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          {!props.jobId ? (
            <>
              <JobsSelect
                jobs={jobs}
                selectedJob={selectedJob}
                onSelect={(option) => setSelectedJob(option)}
                search={search}
                setSearch={setSearch}
                store={store}
                hasMore={hasMore}
                fetchMore={fetchMore}
              />
            </>
          ) : (
            <div />
          )}
          <FilterSelector
            dateBoundary={dateBoundary}
            setDateBoundary={(bound) => setDateBoundary(bound)}
            boundaryMap={{
              today: "Today",
              "7": "Last 7 Days",
              "14": "Last 14 Days",
              "30": "Last 30 Days",
              "90": "Last 90 Days",
              "this week": "This Week",
              "this month": "This Month",
              "this quarter": "This Quarter",
              "this year": "This Year",
            }}
          />
        </div>
        <StatContainer>
          <StatContainerSingle>
            {JobInformation(selectedJob, store.company)}
          </StatContainerSingle>
          <StatContainerDouble className="leo-relative">
            <div className={analyticsStyles.vsIcon}>
              <span>VS</span>
            </div>
            <StatCell
              value={
                analytics.vacancies_vs_hires?.["vacancies"]
                  ? analytics.vacancies_vs_hires["vacancies"]
                  : "0"
              }
              metric={"Vacancies"}
            />
            <StatCell
              value={
                analytics.vacancies_vs_hires["hires"]
                  ? analytics.vacancies_vs_hires["hires"]
                  : "0"
              }
              metric={"Hires"}
            />
          </StatContainerDouble>
          <StatContainerDouble>
            {store.company &&
            store.company.type === "Agency" &&
            props.jobId &&
            store.company.id !== props.jobId.job_owner_company_id ? (
              <StatCell
                value={
                  store.company?.type === "Employer"
                    ? analytics?.total_applicants_count
                        ?.current_submitted_candidates
                    : analytics?.total_applicants_count?.submitted_by_agency
                }
                increase={
                  analytics.total_applicants_count &&
                  analytics.total_applicants_count.percentage_change_submitted
                }
                metric={"Total Submitted Candidates"}
              />
            ) : (
              <StatCell
                value={
                  analytics.total_applicants_count.current_total_applicants &&
                  analytics.total_applicants_count.current_total_applicants
                }
                increase={
                  analytics.total_applicants_count &&
                  analytics.total_applicants_count.percentage_change
                }
                metric={"Total Candidates"}
              />
            )}
            <StatCell
              value={analytics.average_time_at_stage.current_time_period.toFixed(
                2
              )}
              metric={"Average Time At Stage (Days)"}
              increase={
                analytics.average_time_at_stage.percentage_time_at_stage_change
              }
            />
          </StatContainerDouble>

          <StatContainerSingle>
            <StatCell
              value={professionalsAtStage}
              metric={"Professionals At Stage"}
            >
              <StageSelector
                styles={sharedStyles}
                stage={selectedStagePerJob}
                selectStage={(st) => setSelectedStagePerJob(st)}
              />
            </StatCell>
          </StatContainerSingle>
          <StatContainerSingle>
            <Bar barData={analytics.average_conversion_at_stage_for_job} />
          </StatContainerSingle>
          <StatContainerSingle>
            <Doughnut
              data={analytics.job_source_mix}
              sourceDisplay={sourceDisplay}
              setSourceDisplay={(src) => setSourceDisplay(src)}
            />
          </StatContainerSingle>
        </StatContainer>
      </ATSContainer>
    );
  } else if (jobs && jobs.length === 0) {
    return (
      <div
        className={emptyStyles.emptyContainer}
        style={{
          minHeight: "calc(100vh - 310px)",
        }}
      >
        <EmptyTab
          data={jobs}
          title={"Create a job"}
          copy={
            "Create a job to work on, then publish it to job boards or open it internally for private sourcing."
          }
          image={<EmptyJobs />}
          action={() => {
            window.open(
              ROUTES.ViewJobs.url(store.company.mention_tag),
              "_self"
            );
          }}
          actionText={"View Create Your First Job"}
        />
      </div>
    );
  } else return <Spinner />;
};

function JobInformation(job, company) {
  const jobCompany = job.company;
  let job_salary = `${job.min_rate || ""}${
    job.min_rate && job.max_rate ? "-" : ""
  }${job.max_rate || ""}${
    job.min_rate && job.max_rate
      ? "/" + IntervalExchange[job.salary_interval]
      : ""
  }`;

  return (
    <JobContainer className={analyticsStyles.statsContainer}>
      <div
        className="leo-flex"
        style={{
          justifyContent: "space-between",
          borderBottom: "1px solid rgb(154, 156, 161, 0.3)",
          padding: "20px",
        }}
      >
        <div className="leo-flex">
          {jobCompany.id !== company.id && (
            <div
              style={{
                marginRight: "15px",
              }}
            >
              <AvatarIcon
                name={jobCompany.name}
                imgUrl={jobCompany.avatar_url}
                size={50}
              />
            </div>
          )}
          <div
            className="leo-flex leo-justify-center"
            style={{
              flexDirection: "column",
            }}
          >
            <div style={{ fontWeight: "500", marginBottom: "2px" }}>
              {job.title}
            </div>
            <div style={{ fontSize: "12px", lineHeight: "normal" }}>
              {jobCompany.id !== company.id ? (
                <>{jobCompany.name}</>
              ) : (
                <>
                  {job.salary_status === "display" && job_salary}
                  {job.salary_status === "hidden" && "Hidden"}
                  {job.salary_status === "negotiable" && "Negotiable"}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="leo-flex-center">
          {job.job_post_type === "public" && !job.is_draft && (
            <a
              href={`${CAREERS_PORTAL_URL}/${company.mention_tag}/${job.title_slug}`}
              rel="noopener noreferrer"
              target="_blank"
              className="button button--default button--blue-dark"
            >
              View Job
            </a>
          )}
        </div>
      </div>
      <div style={{ padding: "20px" }}></div>
    </JobContainer>
  );
}

const IntervalExchange = {
  hourly: "Hour",
  daily: "Day",
  yearly: "Year",
};

export default JobStatsHook;
