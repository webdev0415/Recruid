import React, { useState, useEffect, useContext, Suspense } from "react";
import { Redirect } from "react-router-dom";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
import { permissionChecker } from "constants/permissionHelpers";
// import notify from "notifications";
import { ROUTES } from "routes";
// import styled from "styled-components";
// import { COLORS } from "constants/style";
import { InnerPageContainer } from "styles/PageContainers";
import { dateOptions } from "constants/filtersOptions";
import { fetchTempAnalytics } from "helpersV2/tempPlus";
const TempDashboard = React.lazy(() =>
  import("components/TempManager/TempDashboard")
);
const TempJobs = React.lazy(() => import("components/TempManager/TempJobs"));

const TempCandidates = React.lazy(() =>
  import("components/TempManager/TempCandidates")
);
const TempSchedule = React.lazy(() =>
  import("components/TempManager/TempSchedule")
);
const TempAnalytics = React.lazy(() =>
  import("components/TempManager/TempAnalytics")
);
const TempSettings = React.lazy(() =>
  import("components/TempManager/TempSettings")
);
const TimesheetManager = React.lazy(() =>
  import("containers/TimesheetManager")
);

const possibleTabs = {
  dashboard: "Dashboard",
  jobs: "Jobs",
  candidates: "Candidates",
  analytics: "Overview",
  settings: "Settings",
};

const TempManager = (props) => {
  const store = useContext(GlobalContext);
  const [redirect, setRedirect] = useState(undefined);
  const [dashboardAnalytics, setDashboardAnalytics] = useState(undefined);

  // const [activeModal, setActiveModal] = useState(undefined);
  const [permission, setPermission] = useState({ view: false, edit: false });
  useEffect(() => {
    if (store.role) {
      setPermission(
        permissionChecker(store.role?.role_permissions, {
          recruiter: true,
        })
      );
    }
  }, [store.role]);

  useEffect(() => {
    if (store.session && store.company) {
      fetchTempAnalytics(store.session, {
        company_id: store.company.id,
        date_filter: dateOptions[10].prop,
      }).then((res) => {
        if (!res.err) {
          setDashboardAnalytics({ ...res });
        } else {
          notify("danger", "Unable to get analytics");
        }
      });
    }
  }, [store.session, store.company]);

  return (
    <>
      <InnerPage
        pageTitle={`${store.company ? store.company.name : ""} - Temp +`}
        originName={`${possibleTabs[props.match.params.tab]} - Temp +`}
      >
        <InnerPageContainer background="white">
          {redirect && redirect !== props.location.pathname && (
            <Redirect to={redirect} />
          )}
          <ATSWrapper activeTab="temp" routeObject={ROUTES.TempManager}>
            {props.match.params.tab === "dashboard" && (
              <Suspense fallback={<div />}>
                <TempDashboard
                  store={store}
                  permission={permission}
                  setRedirect={setRedirect}
                  dashboardAnalytics={dashboardAnalytics}
                  activeTab={props.match.params.tab}
                  tabsArr={tabsArr}
                />
              </Suspense>
            )}
            {props.match.params.tab === "jobs" && (
              <Suspense fallback={<div />}>
                <TempJobs
                  store={store}
                  permission={permission}
                  setRedirect={setRedirect}
                  activeTab={props.match.params.tab}
                  tabsArr={tabsArr}
                />
              </Suspense>
            )}
            {props.match.params.tab === "candidates" && (
              <Suspense fallback={<div />}>
                <TempCandidates
                  store={store}
                  permission={permission}
                  setRedirect={setRedirect}
                  activeTab={props.match.params.tab}
                  tabsArr={tabsArr}
                />
              </Suspense>
            )}
            {props.match.params.tab === "schedule" && (
              <Suspense fallback={<div />}>
                <TempSchedule
                  store={store}
                  permission={permission}
                  setRedirect={setRedirect}
                  activeTab={props.match.params.tab}
                  tabsArr={tabsArr}
                />
              </Suspense>
            )}
            {props.match.params.tab === "analytics" && (
              <Suspense fallback={<div />}>
                <TempAnalytics
                  store={store}
                  permission={permission}
                  setRedirect={setRedirect}
                  activeTab={props.match.params.tab}
                  tabsArr={tabsArr}
                />
              </Suspense>
            )}{" "}
            {props.match.params.tab === "timesheet" && (
              <Suspense fallback={<div />}>
                <TimesheetManager
                />
              </Suspense>
            )}
            
          </ATSWrapper>
        </InnerPageContainer>
      </InnerPage>
    </>
  );
};

const tabsArr = [
  {
    name: "dashboard",
    title: "Dashboard",
    url: (routerProps) =>
      ROUTES.TempManager.url(
        routerProps.match.params.companyMentionTag,
        "dashboard"
      ),
  },
  {
    name: "jobs",
    title: "Jobs",
    url: (routerProps) =>
      ROUTES.TempManager.url(
        routerProps.match.params.companyMentionTag,
        "jobs"
      ),
  },
  {
    name: "candidates",
    title: "Candidates",
    url: (routerProps) =>
      ROUTES.TempManager.url(
        routerProps.match.params.companyMentionTag,
        "candidates"
      ),
  },
  // {
  //   name: "schedule",
  //   title: "Schedule",
  //   url: (routerProps) =>
  //     ROUTES.TempManager.url(
  //       routerProps.match.params.companyMentionTag,
  //       "schedule"
  //     ),
  // },
  {
    name: "analytics",
    title: "Analytics",
    url: (routerProps) =>
      ROUTES.TempManager.url(
        routerProps.match.params.companyMentionTag,
        "analytics"
      ),
  },
  {
    name: "timesheet",
    title: "Timesheet",
    url: (routerProps) =>
      ROUTES.TimesheetManager.url(
        routerProps.match.params.companyMentionTag
      ),
  },
  // {
  //   name: "settings",
  //   title: "Settings",
  //   url: (routerProps) =>
  //     ROUTES.TempManager.url(
  //       routerProps.match.params.companyMentionTag,
  //       "settings"
  //     ),
  // },
];

export default TempManager;
