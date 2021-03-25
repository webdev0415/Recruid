import React, { useState, useEffect, useContext } from "react";
import Pipeline from "./Pipeline";
import Table from "./Tables/Table";
import { PipelineWrapper } from "./PipelineComponents";
import GlobalContext from "contexts/globalContext/GlobalContext";
import {
  getTotalJobsAtStage,
  filterJobsByStage,
  getTotalCandidatesAtStage,
  filterCandidatesByStage,
} from "../../helpers/pipelineHelpers";
import notify from "notifications";
import Spinner from "sharedComponents/Spinner";
import { uppercaseStageTitles } from "constants/stageOptions";

// If @type = 'candidates' => @data that's passed has to be a job post you get an applicants for
const PipelineView = ({
  displayTable = false,
  data = null,
  client = null,
  crm = null,
  type,
  parentFilterOption = "to_fill",
  refreshJobs = null,
  clientId,
  interviewStages,
}) => {
  const store = useContext(GlobalContext);
  const [pipelineData, setPipelineData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [filteredDataSlice, setFilteredDataSlice] = useState(null);
  const [filterOption, setFilterOption] = useState(
    type === "jobs" ? "to_fill" : parentFilterOption || "applied"
  );
  const [disableNextFetch, setDisableNextFetch] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (type === "jobs" && store.role) {
      getTotalJobsAtStage(
        store.company.id,
        store.session,
        clientId,
        store.role.team_member.team_member_id
      ).then((data) => {
        if (data) {
          setPipelineData(data);
          let orderedKeys = Object.keys(uppercaseStageTitles);
          let withCandidates;
          let index = 0;
          while (index < orderedKeys.length && !withCandidates) {
            if (data[orderedKeys[index]] > 0) {
              withCandidates = orderedKeys[index];
            }
            index++;
          }
          if (withCandidates) {
            setFilterOption(withCandidates);
          }
        }
      });
    } else if (type === "candidates" && !!store.session) {
      getTotalCandidatesAtStage(
        store.company.id,
        data.id,
        store.session,
        store.role.team_member.team_member_id
      ).then((data) => {
        setPipelineData(data);
      });
    }
  }, [store.company, store.session, type, data, clientId, store.role]);

  useEffect(() => {
    if (refreshJobs) {
      (async function (filterOption) {
        setDataLoading(true);
        const filteredJobs = await filterJobsByStage(
          store.session,
          store.company.id,
          filterOption,
          [0, 10],
          true,
          clientId,
          store.role?.team_member.team_member_id
        );
        if (filteredJobs.results.length >= 10) {
          const upcomingJobs = await filterJobsByStage(
            store.session,
            store.company.id,
            filterOption,
            [filteredJobs.results.length, 10],
            false,
            clientId,
            store.role?.team_member.team_member_id
          );
          if (upcomingJobs?.length) setDisableNextFetch(false);
          else setDisableNextFetch(true);
        } else setDisableNextFetch(true);
        if (!filteredJobs.results)
          notify("danger", "Failed to get list of jobs from the server");
        else {
          setTableData(filteredJobs.results);
          setTotalResults(filteredJobs.total_results);
          setDataLoading(false);
        }
      })(filterOption);
    }
     
  }, [refreshJobs, clientId]);

  useEffect(() => {
    if (parentFilterOption) {
      setFilterOption(parentFilterOption);
    } else {
      if (type === "jobs") {
        setFilterOption("to_fill");
      } else {
        setFilterOption("applied");
      }
    }
  }, [parentFilterOption, type]);
  // Effect for initial FilterByStage request
  useEffect(() => {
    if (!!filterOption.length && !!store.session && store.role) {
      setFilteredDataSlice(null);
      if (type === "jobs") {
        (async function (filterOption) {
          setDataLoading(true);
          const filteredJobs = await filterJobsByStage(
            store.session,
            store.company.id,
            filterOption,
            [0, 10],
            true,
            clientId,
            store.role?.team_member.team_member_id
          );
          if (filteredJobs?.results?.length >= 10) {
            const upcomingJobs = await filterJobsByStage(
              store.session,
              store.company.id,
              filterOption,
              [filteredJobs.results.length, 10],
              false,
              clientId,
              store.role?.team_member.team_member_id
            );
            if (upcomingJobs?.length) setDisableNextFetch(false);
            else setDisableNextFetch(true);
          } else setDisableNextFetch(true);
          if (!filteredJobs?.results)
            notify("danger", "Failed to get list of jobs from the server");
          else {
            setTableData(filteredJobs.results);
            setTotalResults(filteredJobs.total_results);
            setDataLoading(false);
          }
        })(filterOption);
      } else if (type === "candidates" && !!data) {
        (async function (filterOption, data) {
          setDataLoading(true);
          const filteredCandidates = await filterCandidatesByStage(
            store.company.id,
            data.id,
            store.session,
            [0, 10],
            filterOption,
            store.role.team_member.team_member_id,
            true
          );
          if (filteredCandidates?.results?.length >= 10) {
            const upcomingCandidates = await filterCandidatesByStage(
              store.company.id,
              data.id,
              store.session,
              [filteredCandidates.length, 10],
              filterOption,
              store.role.team_member.team_member_id
            );
            if (upcomingCandidates.length) setDisableNextFetch(false);
            else setDisableNextFetch(true);
          } else setDisableNextFetch(true);
          if (!filteredCandidates || !filteredCandidates.results)
            notify(
              "danger",
              "Failed to get list of candidates from the server"
            );
          else {
            setTableData(filteredCandidates.results);
            setTotalResults(filteredCandidates.total_results);
            setDataLoading(false);
          }
        })(filterOption, data);
      }
    }
  }, [
    filterOption,
    store.company,
    store.session,
    data,
    type,
    clientId,
    store.role,
  ]);

  // Effect for paginating FilteredByStage data
  useEffect(() => {
    if (!!filteredDataSlice && !!store.session) {
      if (type === "jobs") {
        (async function (filterOption, filteredDataSlice) {
          setDataLoading(true);
          const nextPage = await filterJobsByStage(
            store.session,
            store.company.id,
            filterOption,
            filteredDataSlice,
            false,
            clientId,
            store.role?.team_member.team_member_id
          );
          if (nextPage?.length >= filteredDataSlice[1]) {
            const upcomingPage = await filterJobsByStage(
              store.session,
              store.company.id,
              filterOption,
              [filteredDataSlice[0] + nextPage.length, filteredDataSlice[1]],
              false,
              clientId,
              store.role?.team_member.team_member_id
            );
            if (upcomingPage?.length) setDisableNextFetch(false);
            else setDisableNextFetch(true);
          } else setDisableNextFetch(true);
          setTableData(nextPage);
          setDataLoading(false);
        })(filterOption, filteredDataSlice);
      } else if (type === "candidates" && !!data) {
        (async function (data, filteredDataSlice, filterOption) {
          setDataLoading(true);
          const nextPage = await filterCandidatesByStage(
            store.company.id,
            data.id,
            store.session,
            filteredDataSlice,
            filterOption,
            store.role.team_member.team_member_id
          );
          if (nextPage.length >= filteredDataSlice[1]) {
            const upcomingPage = await filterCandidatesByStage(
              store.company.id,
              data.id,
              store.session,
              [filteredDataSlice[0] + nextPage.length, filteredDataSlice[1]],
              filterOption,
              store.role.team_member.team_member_id
            );
            if (upcomingPage.length) setDisableNextFetch(false);
            else setDisableNextFetch(true);
          } else setDisableNextFetch(true);
          setTableData(nextPage);
          setDataLoading(false);
        })(data, filteredDataSlice, filterOption);
      }
    }
    // eslint-disable-next-line
  }, [filteredDataSlice, clientId]);

  const nextDataSlice = (step) => {
    if (disableNextFetch) return false;
    if (filteredDataSlice)
      return setFilteredDataSlice((state) => [
        state[0] + tableData.length,
        step,
      ]);
    return setFilteredDataSlice([tableData.length, step]);
  };

  const prevDataSlice = (step) => {
    if (!filteredDataSlice || filteredDataSlice[0] < step) return false;
    return setFilteredDataSlice((state) => [state[0] - step, step]);
  };

  return (
    <PipelineWrapper
      className={`${type === "candidates" && "candidates"} ${
        client && "client"
      } ${crm && "crm"}`}
    >
      {pipelineData && displayTable && tableData && !dataLoading ? (
        <>
          <Pipeline
            data={pipelineData}
            filterOption={filterOption}
            setFilterOption={setFilterOption}
            type={type}
            client={client}
            interviewStages={interviewStages}
            crm={crm}
          />
          <Table
            type={type}
            client={client}
            crm={crm}
            company={store.company}
            session={store.session}
            PipelineView={PipelineView}
            data={tableData}
            nextDataSlice={nextDataSlice}
            prevDataSlice={prevDataSlice}
            disableNextFetch={disableNextFetch}
            filteredDataSlice={filteredDataSlice}
            totalResults={totalResults}
            singleJob={data}
            parentFilterOption={filterOption}
            teamMembers={store.teamMembers}
            interviewStages={interviewStages}
          />
        </>
      ) : (
        <Spinner />
      )}
    </PipelineWrapper>
  );
};

export default PipelineView;
