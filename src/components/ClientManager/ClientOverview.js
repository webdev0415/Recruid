import React, { useContext, useState, useEffect, Suspense } from "react";
import notify from "notifications";
import retryLazy from "hooks/retryLazy";
import GlobalContext from "contexts/globalContext/GlobalContext";
import styled from "styled-components";
import { InnerPageContainer } from "styles/PageContainers";

import { FrappeChart } from "components/Analytics/shared/FrappeChart.js";
import PercentageChart from "components/ClientManager/ClientOverview/PercentageChart";
import NumberFormat from "react-number-format";
import {
  CellContainer,
  CellHeader,
  CellBody,
  NumericStat,
  OverviewContainer,
  ValueNum,
} from "components/ClientManager/ClientOverview/components";
import { FiltersDropdown } from "sharedComponents/FiltersDropdown";
// import { permissionChecker, PermissionChecker } from "constants/permissionHelpers";
import {
  fetchPipelineForecast,
  fetchCRMProductivity,
  fetchCRMPerformance,
  fetchPipelinesAnalytics,
} from "helpersV2/vendors/clients";
import { dateOptions } from "constants/filtersOptions";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";

const ViewProfilesListsModal = React.lazy(() =>
  retryLazy(() => import("modals/ViewProfilesListsModal"))
);

// note, meeting, call, task, cvs
const sourceExchanger = {
  new_contacts: "contact",
  assigned_contacts: "contact",
  contacts_worked: "contact",
  new_deals: "deal",
  deals_won: "deal",
  deals_lost: "deal",
  new_placements: "candidate",
  notes: "note",
  meetings: "meeting",
  calls: "call",
  tasks_created: "task",
  tasks_completed: "completed_task",
  applicants: "candidate",
};

const ClientOverview = ({ allPipelines, permission }) => {
  const store = useContext(GlobalContext);
  const [pipelinesAnalytics, setPipelinesAnalytics] = useState(undefined);
  const [dateBoundary, setDateBoundary] = useState(dateOptions[7]);
  const [selectedMember, setSelectedMember] = useState({ name: "All Team" });

  const [productivity, setProductivity] = useState(undefined);
  const [perform, setPerformance] = useState(undefined);
  const [forecast, setForecast] = useState(undefined);
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState(undefined);
  const [activeInfo, setActiveInfo] = useState(undefined);
  const [filteredPipelines, setFilteredPipelines] = useState(undefined);

  useEffect(() => {
    if (allPipelines) {
      setFilteredPipelines(allPipelines.filter((pipe) => !pipe.archived));
    }
  }, [allPipelines]);

  useEffect(() => {
    if (store.company && store.session && permission.view) {
      fetchPipelinesAnalytics(
        store.session,
        store.company.id,
        dateBoundary.prop,
        selectedMember?.team_member_id
      ).then((res) => {
        if (!res.err) {
          setPipelinesAnalytics(res);
        } else {
          notify("danger", res);
        }
      });
    }
  }, [store.company, store.session, dateBoundary, selectedMember, permission]);

  useEffect(() => {
    if (pipelinesAnalytics && productivity && perform && filteredPipelines) {
      if (filteredPipelines.length > 0 && forecast) {
        setLoaded(true);
      } else if (filteredPipelines.length === 0) {
        setLoaded(true);
      }
    }
  }, [pipelinesAnalytics, forecast, productivity, perform, filteredPipelines]);

  useEffect(() => {
    if (
      store.role &&
      !(
        store.role.role_permissions.admin &&
        store.role.role_permissions.business
      ) &&
      !store.role.role_permissions.owner
    ) {
      setSelectedMember(store.role.team_member);
    }
  }, [store.role]);

  return (
    <>
      <InnerPageContainer>
        <ATSContainer>
          {!loaded && <Spinner />}
          <OverviewContainer>
            <ForecastCell
              allPipelines={filteredPipelines}
              store={store}
              forecast={forecast}
              setForecast={setForecast}
              loaded={loaded}
            />
            <ProductivityCell
              store={store}
              productivity={productivity}
              setProductivity={setProductivity}
              loaded={loaded}
              setModal={setModal}
              setActiveInfo={setActiveInfo}
            />
            <PerformanceCell
              store={store}
              perform={perform}
              setPerformance={setPerformance}
              loaded={loaded}
              setModal={setModal}
              setActiveInfo={setActiveInfo}
            />
            {loaded && pipelinesAnalytics && allPipelines.length > 0 && (
              <div
                className="leo-flex"
                style={{
                  justifyContent: "flex-end",
                  gridColumn: "span 2",
                }}
              >
                <FiltersDropdown
                  name={dateBoundary.name || "Select a filter"}
                  options={dateOptions}
                  onSelect={(option) => setDateBoundary(option)}
                />
                {(store.role.role_permissions.owner ||
                  (store.role.role_permissions.admin &&
                    store.role.role_permissions.business)) && (
                  <FiltersDropdown
                    name={selectedMember?.name || "All Team"}
                    options={
                      store.teamMembers
                        ? [{ name: "All Team" }, ...store.teamMembers]
                        : []
                    }
                    onSelect={(option) => setSelectedMember(option)}
                  />
                )}
              </div>
            )}
            {loaded &&
              pipelinesAnalytics &&
              Object.entries(pipelinesAnalytics).map((pipeline, i) => {
                return (
                  <CellContainer key={`pipeline-data-${i}`}>
                    <CellHeader title={pipeline[0]}></CellHeader>
                    <CellBody>
                      <FrappeChart
                        type="bar"
                        data={pipeline[1]}
                        height={300}
                        index={i}
                      />
                    </CellBody>
                  </CellContainer>
                );
              })}
          </OverviewContainer>
        </ATSContainer>
        {modal === "view-profiles" && activeInfo && (
          <Suspense fallback={<div />}>
            <ViewProfilesListsModal
              source={sourceExchanger[activeInfo[0]]}
              elasticIds={activeInfo[1].elastic_ids}
              title={performanceNames[activeInfo[0]]}
              hide={() => {
                setModal(undefined);
                setActiveInfo(undefined);
              }}
              store={store}
            />
          </Suspense>
        )}
      </InnerPageContainer>
    </>
  );
};

export default ClientOverview;

export const ForecastCell = ({
  allPipelines,
  store,
  forecast,
  setForecast,
  loaded,
}) => {
  const [selectedPipeline, setSelectedPipeline] = useState(undefined);
  const [dateBoundary, setDateBoundary] = useState(dateOptions[7]);
  const [total, setTotal] = useState(undefined);
  const [selectedMember, setSelectedMember] = useState(undefined);
  const [memberOptions, setMemberOptions] = useState(undefined);

  useEffect(() => {
    if (allPipelines) {
      setSelectedPipeline(allPipelines[0]);
    }
  }, [allPipelines]);

  useEffect(() => {
    if (store.role && store.user) {
      if (store.role.role_permissions.owner) {
        setSelectedMember({ name: "All Team" });
      }
      // else if (store.role.role_permissions.manager) {
      // setSelectedMember({ name: "My Team" });
      // }
      else {
        setSelectedMember({ ...store.role.team_member, name: store.user.name });
      }
    }
  }, [store.role, store.user]);

  useEffect(() => {
    if (store.role && store.teamMembers) {
      if (
        store.role.role_permissions.owner ||
        (store.role.role_permissions.admin &&
          store.role.role_permissions.business)
      ) {
        setMemberOptions([
          { name: "All Team" },
          ...store.teamMembers.filter((member) =>
            member.roles.includes("business")
          ),
        ]);
      } else if (store.role.role_permissions.manager) {
        setMemberOptions(
          store.teamMembers.filter(
            (member) =>
              member.roles.includes("business") &&
              (store.role.team_member.assigned_members.indexOf(
                member.team_member_id
              ) !== -1 ||
                member.team_member_id === store.role.team_member.team_member_id)
          )
        );
      }
    }
  }, [store.role, store.teamMembers]);

  useEffect(() => {
    if (store.company && store.session && selectedPipeline && selectedMember) {
      fetchPipelineForecast(
        store.session,
        store.company.id,
        selectedPipeline.id,
        dateBoundary.prop,
        selectedMember?.team_member_id
      ).then((res) => {
        if (!res.err) {
          setForecast(res);
        } else {
          notify("danger", res);
        }
      });
    }
  }, [
    store.company,
    store.session,
    selectedPipeline,
    selectedMember,
    dateBoundary,
  ]);

  useEffect(() => {
    if (forecast) {
      setTotal(forecast.dataset.reduce((acc, curr) => (acc += curr), 0));
    }
  }, [forecast]);

  return (
    <>
      {loaded && selectedPipeline && (
        <CellContainer columns={2}>
          <CellHeader title="Forecast">
            <div className="leo-flex">
              <FiltersDropdown
                name={selectedPipeline?.name || "Select a pipeline"}
                options={allPipelines}
                onSelect={(option) => setSelectedPipeline(option)}
              />
              <FiltersDropdown
                name={dateBoundary.name || "Select a filter"}
                options={dateOptions}
                onSelect={(option) => setDateBoundary(option)}
              />
              {memberOptions && (
                <FiltersDropdown
                  name={selectedMember?.name || "All Team"}
                  options={memberOptions || []}
                  onSelect={(option) => setSelectedMember(option)}
                />
              )}
            </div>
          </CellHeader>
          <CellBody padding="large">
            {forecast && total > 0 && (
              <>
                <NumberFormat
                  value={total}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={store.company.currency?.currency_name}
                  renderText={(value) => (
                    <ValueNum size="medium">{value}</ValueNum>
                  )}
                />
                <div style={{ marginTop: "25px" }}>
                  <PercentageChart
                    forecast={forecast}
                    total={total}
                    company={store.company}
                  />
                </div>
              </>
            )}
            {forecast && total === 0 && (
              <EmptyParagraph className="leo-flex">
                There is no forecast for your selected filters.
              </EmptyParagraph>
            )}
          </CellBody>
        </CellContainer>
      )}
    </>
  );
};

const productivityNames = {
  notes: "Notes",
  emails: "Emails Sent",
  meetings: "Meetings Booked",
  calls: "Calls",
  tasks_created: "Tasks Created",
  tasks_completed: "Tasks Completed",
  applicants: "CVs Sent",
};

export const ProductivityCell = ({
  store,
  productivity,
  setProductivity,
  loaded,
  setModal,
  setActiveInfo,
}) => {
  const [dateBoundary, setDateBoundary] = useState(dateOptions[7]);
  const [selectedMember, setSelectedMember] = useState(undefined);
  const [memberOptions, setMemberOptions] = useState(undefined);

  useEffect(() => {
    if (store.company && store.session && selectedMember) {
      fetchCRMProductivity(
        store.session,
        store.company.id,
        dateBoundary.prop,
        selectedMember?.team_member_id
      ).then((res) => {
        if (!res.err) {
          setProductivity(res);
        } else {
          notify("danger", res);
        }
      });
    }
  }, [store.company, store.session, dateBoundary, selectedMember]);

  useEffect(() => {
    if (store.role && store.user) {
      if (store.role.role_permissions.owner) {
        setSelectedMember({ name: "All Team" });
      }
      // else if (store.role.role_permissions.manager) {
      // setSelectedMember({ name: "My Team" });
      // }
      else {
        setSelectedMember({ ...store.role.team_member, name: store.user.name });
      }
    }
  }, [store.role, store.user]);

  useEffect(() => {
    if (store.role && store.teamMembers) {
      if (
        store.role.role_permissions.owner ||
        (store.role.role_permissions.admin &&
          store.role.role_permissions.business)
      ) {
        setMemberOptions([
          { name: "All Team" },
          ...store.teamMembers.filter((member) =>
            member.roles.includes("business")
          ),
        ]);
      } else if (store.role.role_permissions.manager) {
        setMemberOptions(
          store.teamMembers.filter(
            (member) =>
              member.roles.includes("business") &&
              (store.role.team_member.assigned_members.indexOf(
                member.team_member_id
              ) !== -1 ||
                member.team_member_id === store.role.team_member.team_member_id)
          )
        );
      }
    }
  }, [store.role, store.teamMembers]);

  return (
    <>
      {loaded && (
        <CellContainer columns={2}>
          <CellHeader title="Productivity">
            <div className="leo-flex">
              <FiltersDropdown
                name={dateBoundary.name || "Select a filter"}
                options={dateOptions}
                onSelect={(option) => setDateBoundary(option)}
              />
              {memberOptions && (
                <FiltersDropdown
                  name={selectedMember?.name || "All Team"}
                  options={memberOptions || []}
                  onSelect={(option) => setSelectedMember(option)}
                />
              )}
            </div>
          </CellHeader>
          <CellBody
            padding="large"
            className="leo-flex leo-align-baseline leo-justify-between"
          >
            {productivity &&
              Object.entries(productivity).map((nameProps, index) => (
                <React.Fragment key={`Productivity-prop-${index}`}>
                  {nameProps[1].total > 0 ? (
                    <button
                      onClick={() => {
                        setModal("view-profiles");
                        setActiveInfo(nameProps);
                      }}
                    >
                      <NumericStat
                        totalValue={nameProps[1].total}
                        title={productivityNames[nameProps[0]]}
                        changePercentage={nameProps[1].diff_per}
                        changeOverPeriod={nameProps[1].diff_int}
                        increase={nameProps[1].diff_int > 0}
                        currency={store.company.currency?.currency_name}
                      />
                    </button>
                  ) : (
                    <NumericStat
                      totalValue={nameProps[1].total}
                      title={productivityNames[nameProps[0]]}
                      changePercentage={nameProps[1].diff_per}
                      changeOverPeriod={nameProps[1].diff_int}
                      increase={nameProps[1].diff_int > 0}
                      currency={store.company.currency?.currency_name}
                    />
                  )}
                </React.Fragment>
              ))}
          </CellBody>
        </CellContainer>
      )}
    </>
  );
};

const performanceNames = {
  new_contacts: "New Contacts",
  assigned_contacts: "Contacts Assigned",
  contacts_worked: "Contacts Worked",
  new_deals: "New Deals",
  deals_won: "Deals Closed Won",
  deals_lost: "Deals Closed Lost",
  new_placements: "Placements",
  notes: "Notes",
  meetings: "Meetings Booked",
  calls: "Calls",
  tasks_created: "Tasks Created",
  tasks_completed: "Tasks Completed",
  applicants: "Candidates",
  total_income_earned: "Total Income",
};

export const PerformanceCell = ({
  store,
  perform,
  setPerformance,
  loaded,
  setModal,
  setActiveInfo,
}) => {
  const [dateBoundary, setDateBoundary] = useState(dateOptions[7]);
  const [selectedMember, setSelectedMember] = useState(undefined);
  const [memberOptions, setMemberOptions] = useState(undefined);
  useEffect(() => {
    if (store.company && store.session && selectedMember) {
      fetchCRMPerformance(
        store.session,
        store.company.id,
        dateBoundary.prop,
        selectedMember?.team_member_id
      ).then((res) => {
        if (!res.err) {
          setPerformance(res);
        } else {
          notify("danger", res);
        }
      });
    }
  }, [store.company, store.session, dateBoundary, selectedMember]);

  useEffect(() => {
    if (store.role && store.user) {
      if (store.role.role_permissions.owner) {
        setSelectedMember({ name: "All Team" });
      }
      // else if (store.role.role_permissions.manager) {
      // setSelectedMember({ name: "My Team" });
      // }
      else {
        setSelectedMember({ ...store.role.team_member, name: store.user.name });
      }
    }
  }, [store.role, store.user]);

  useEffect(() => {
    if (store.role && store.teamMembers) {
      if (
        store.role.role_permissions.owner ||
        (store.role.role_permissions.admin &&
          store.role.role_permissions.business)
      ) {
        setMemberOptions([
          { name: "All Team" },
          ...store.teamMembers.filter((member) =>
            member.roles.includes("business")
          ),
        ]);
      } else if (store.role.role_permissions.manager) {
        setMemberOptions(
          store.teamMembers.filter(
            (member) =>
              member.roles.includes("business") &&
              (store.role.team_member.assigned_members.indexOf(
                member.team_member_id
              ) !== -1 ||
                member.team_member_id === store.role.team_member.team_member_id)
          )
        );
      }
    }
  }, [store.role, store.teamMembers]);

  return (
    <>
      {loaded && (
        <CellContainer columns={2}>
          <CellHeader title="Performance">
            <div className="leo-flex">
              <FiltersDropdown
                name={dateBoundary.name || "Select a filter"}
                options={dateOptions}
                onSelect={(option) => setDateBoundary(option)}
              />
              {memberOptions && (
                <FiltersDropdown
                  name={selectedMember?.name || "All Team"}
                  options={memberOptions || []}
                  onSelect={(option) => setSelectedMember(option)}
                />
              )}
            </div>
          </CellHeader>
          <CellBody
            padding="large"
            className="leo-flex leo-align-baseline leo-justify-between"
          >
            {perform &&
              Object.entries(perform).map((nameProps, index) => (
                <React.Fragment key={`stat-performance-${index}`}>
                  {nameProps[1].total > 0 ? (
                    <button
                      onClick={() => {
                        setModal("view-profiles");
                        setActiveInfo(nameProps);
                      }}
                    >
                      <NumericStat
                        totalValue={nameProps[1].total}
                        title={performanceNames[nameProps[0]]}
                        changePercentage={nameProps[1].diff_per}
                        changeOverPeriod={nameProps[1].diff_int}
                        increase={nameProps[1].diff_int > 0}
                        currency={store.company.currency?.currency_name}
                      />
                    </button>
                  ) : (
                    <NumericStat
                      totalValue={nameProps[1].total}
                      title={performanceNames[nameProps[0]]}
                      changePercentage={nameProps[1].diff_per}
                      changeOverPeriod={nameProps[1].diff_int}
                      increase={nameProps[1].diff_int > 0}
                      currency={store.company.currency?.currency_name}
                    />
                  )}
                </React.Fragment>
              ))}
          </CellBody>
        </CellContainer>
      )}
    </>
  );
};

const EmptyParagraph = styled.p`
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  min-height: 166px;
  text-align: center;
`;
