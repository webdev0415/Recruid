import React, { useState, useEffect, Suspense } from "react";
import notify from "notifications";
import {
  ForecastCell,
  PerformanceCell,
  ProductivityCell,
} from "components/ClientManager/ClientOverview";
import retryLazy from "hooks/retryLazy";
import { fetchAllPipelines } from "helpers/crm/pipelines";
import Spinner from "sharedComponents/Spinner";
import { OverviewContainer } from "components/ClientManager/ClientOverview/components";
const ViewProfilesListsModal = React.lazy(() =>
  retryLazy(() => import("modals/ViewProfilesListsModal"))
);

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
};

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

const BusinessAnalytics = ({ store }) => {
  const [productivity, setProductivity] = useState(undefined);
  const [perform, setPerformance] = useState(undefined);
  const [forecast, setForecast] = useState(undefined);
  const [modal, setModal] = useState(undefined);
  const [activeInfo, setActiveInfo] = useState(undefined);
  const [loaded, setLoaded] = useState(false);
  const [filteredPipelines, setFilteredPipelines] = useState(undefined);

  useEffect(() => {
    if (productivity && perform && filteredPipelines) {
      if (filteredPipelines.length > 0 && forecast) {
        setLoaded(true);
      } else if (filteredPipelines.length === 0) {
        setLoaded(true);
      }
    }
  }, [forecast, productivity, perform, filteredPipelines]);

  //FETCH ALL THE PIPELINES
  useEffect(() => {
    if (
      store.session &&
      store.company &&
      store.role &&
      (store.role.role_permissions.admin ||
        store.role.role_permissions.owner ||
        store.role.role_permissions.business)
    ) {
      getAllPipelines();
    }
     
  }, [store.session, store.company, store.role]);

  const getAllPipelines = async () => {
    return fetchAllPipelines(
      store.session,
      store.company.id,
      store.role.team_member?.team_member_id
    ).then((res) => {
      if (!res.err) {
        setFilteredPipelines(res.filter((pipe) => !pipe.archived));
        return res;
      } else {
        setFilteredPipelines(false);
        notify("danger", "Unable to fetch all pipelines");
        return res;
      }
    });
  };

  return (
    <>
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
      </OverviewContainer>
    </>
  );
};

export default BusinessAnalytics;
