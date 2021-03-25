import React, { useState, useEffect, Suspense } from "react";
import TempJobsTable from "components/TempManager/TempJobs/TempJobsTable";
import FilterV2 from "sharedComponents/filterV2";
import { ATSContainer } from "styles/PageContainers";
import { fetchTempJobs } from "helpersV2/tempPlus";
import { Link } from "react-router-dom";
import { ROUTES } from "routes";
// import { fetchJobs } from "helpersV2/jobs";

import notify from "notifications";
import Spinner from "sharedComponents/Spinner";
import ATSBanner from "sharedComponents/ATSBanner";
import { PermissionChecker } from "constants/permissionHelpers";
import styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";
import { EmptyJobs } from "assets/svg/EmptyImages";
const EmptyTab = React.lazy(() =>
  import("components/Profiles/components/EmptyTab")
);

const SLICE_LENGHT = 20;

const TempJobs = ({ store, permission, activeTab, tabsArr }) => {
  const [jobs, setJobs] = useState(undefined);
  const [hasMore, setHasMore] = useState(false);
  const controller = new AbortController();
  const signal = controller.signal;
  const [filters, setFilters] = useState({});
  const [activeModal, setActiveModal] = useState(undefined);
  const [jobType, setJobType] = useState("all");
  const [refreshJobs, setRefreshJobs] = useState(undefined);

  useEffect(() => {
    if (store.company && store.role && permission.view) {
      let filtersObj = {
        ...filters,
        slice: [0, SLICE_LENGHT],
        operator: "and",
        team_member_id: store.role.team_member.team_member_id,
      };
      if (jobType !== "all") {
        if (jobType === "priority") {
          filtersObj.priority_jobs = true;
        } else if (jobType === "assigned") {
          filtersObj.assigned_jobs = true;
        }
      }
      fetchTempJobs(store.session, store.company.id, filtersObj, signal).then(
        (jbs) => {
          if (!jbs.err) {
            setJobs(jbs);
            if (jbs.length === SLICE_LENGHT) {
              setHasMore(true);
            } else if (hasMore === true) {
              setHasMore(false);
            }
          } else if (!signal.aborted) {
            notify("danger", jbs);
          }
        }
      );
    }
    return () => controller.abort();
  }, [
    store.company,
    store.role,
    store.session,
    filters,
    permission,
    jobType,
    refreshJobs,
  ]);

  const fetchMore = () => {
    fetchTempJobs(
      store.session,
      store.company.id,
      {
        ...filters,
        slice: [jobs.length, SLICE_LENGHT],
        operator: "and",
        team_member_id: store.role.team_member.team_member_id,
        // jobType
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

  return (
    <>
      <ATSBanner
        name={store.company?.name}
        avatar={store.company?.avatar_url}
        page="Temp +"
        tabs={tabsArr}
        activeTab={activeTab}
        tabType="link"
        v2theme={true}
      >
        <PermissionChecker type="edit" valid={{ recruiter: true }}>
          <Link
            className="button button--default button--blue-dark"
            to={ROUTES.JobCreation.url(
              store.company?.mention_tag,
              "?temp_job=true"
            )}
          >
            Create New Job
          </Link>
        </PermissionChecker>
      </ATSBanner>
      <ATSContainer>
        {!jobs && <Spinner />}
        {jobs && (
          <FlexContainer>
            <FilterV2
              source="job"
              returnFilters={(newFilters) => setFilters(newFilters)}
              v2theme={true}
              hideSegments={true}
            />
            <SelectJobOptions
              value={jobType}
              onChange={(val) => setJobType(val)}
            />
          </FlexContainer>
        )}
        {jobs && jobs.length > 0 && (
          <>
            <TempJobsTable
              jobs={jobs}
              setJobs={setJobs}
              fetchMore={fetchMore}
              hasMore={hasMore}
              store={store}
              activeModal={activeModal}
              setActiveModal={setActiveModal}
              refreshJobs={() => setRefreshJobs(Math.random())}
            />
          </>
        )}
        {jobs && jobs.length === 0 && (
          <Suspense fallback={<div />}>
            <EmptyTab
              data={jobs}
              title={"Create a job"}
              copy={
                "Create a job to work on, then publish it to job boards or open it internally for private sourcing."
              }
              image={<EmptyJobs />}
            />
          </Suspense>
        )}
      </ATSContainer>
    </>
  );
};

const options = {
  all: "All job list",
  priority: "Priority jobs",
  assigned: "Assigned jobs",
};

const SelectJobOptions = ({ value, onChange }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle as={Selectbutton}>
        <span>{options[value]}</span>
        <span>
          <i className="fas fa-angle-down"></i>
        </span>
      </Dropdown.Toggle>

      <DropDownMenu>
        {Object.entries(options).map((option, index) => (
          <DropdownItem
            key={`job-option-${index}`}
            onClick={() => onChange(option[0])}
          >
            {option[1]}
          </DropdownItem>
        ))}
      </DropDownMenu>
    </Dropdown>
  );
};

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Selectbutton = styled.button`
  border: 1px solid rgba(196, 196, 196, 0.54);
  border-radius: 4px;
  display: flex;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #74767b;
  span {
    padding: 10px 15px;
  }
  span:not(:last-child) {
    border-right: 1px solid rgba(196, 196, 196, 0.54);
  }
`;

const DropDownMenu = styled(Dropdown.Menu)``;

const DropdownItem = styled(Dropdown.Item)`
  padding: 8px 15px;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #74767b;

  &:hover {
    background: rgba(196, 196, 196, 0.25);
  }
  &:active {
    color: #74767b;
  }
  a {
    text-decoration: none;
  }
`;

export default TempJobs;
