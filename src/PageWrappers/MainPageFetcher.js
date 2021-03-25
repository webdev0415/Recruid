import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router";
import { ROUTES } from "routes";
// import { Redirect } from "react-router-dom";
import GlobalContext from "contexts/globalContext/GlobalContext";
import HistoryContext from "contexts/historyContext/HistoryContext";
import AuthHeader from "components/AuthHeader";
import ATSNavBar from "components/ATSNavBar";
import IntercomComponent from "components/IntercomComponent";
import SentryComponent from "components/SentryComponent";

import {
  getAllMyCompanies,
  getUser,
  checkAndCreateSession,
  getTeamMembers,
  getRole,
  getSkills,
  getIndustries,
  getBusinessAreas,
  getDepartments,
  // getLocations,
  // getCurrencies,
  logOut,
  getInterviewStages,
  getCompanySources,
  getPricingPlan,
  getApprovalProcess,
  getJobExtraFields,
} from "contexts/globalContext/GlobalMethods";
import { connectWebSocket } from "websocket/index";
import {
  connectSkills,
  connectIndustries,
  connectDepartments,
  connectBusinessAreas,
} from "websocket/attributes";
// import { connectConversation } from "websocket/messagesLegacy";

const MainPageFetcher = (props) => {
  const store = useContext(GlobalContext);
  const historyStore = useContext(HistoryContext);
  const [navBarExceptions] = useState({
    [ROUTES.NewPassword?.url()]: true,
  });
  const [showATSNavBar] = useState({
    [ROUTES.CompanyDashboard?.path]: true,
    [ROUTES.TalentNetwork?.path]: true,
    [ROUTES.ViewJobs?.path]: true,
    [ROUTES.Vendors?.path]: true,
    [ROUTES.Calendar?.path]: true,
    [ROUTES.Analytics?.path]: true,
    [ROUTES.TeamView?.path]: true,
    [ROUTES.ClientManager?.path]: true,
    [ROUTES.CompanyTasksManager?.path]: true,
    [ROUTES.CandidateProfile?.path]: true,
    [ROUTES.JobDashboard?.path]: true,
    [ROUTES.TempJobDashboard?.path]: true,
    [ROUTES.VendorPage?.path]: true,
    [ROUTES.DealProfile?.path]: true,
    [ROUTES.ClientProfile?.path]: true,
    [ROUTES.ContactProfile?.path]: true,
    [ROUTES.TasksManager?.path]: true,
    [ROUTES.ProfessionalProfileSettings?.path]: true,
    [ROUTES.Settings?.path]: true,
    [ROUTES.MarketingEmails?.path]: true,
    [ROUTES.EmailProfile?.path]: true,
    [ROUTES.TempManager?.path]: true,
    [ROUTES.JobCreation?.path]: true,
    [ROUTES.JobEdit?.path]: true,
    [ROUTES.TimesheetManager?.path]: true,
  });

  // const [redirect, setRedirect] = useState(false);

  // CHECK IF SESSION IS STORED IN LOCALSTORAGE OR COOKIES
  useEffect(() => {
    if (
      !store.session &&
      props.location.pathname !== ROUTES.ProfessionalLogoff.url()
    ) {
      checkAndCreateSession(store.dispatch);
    }
  }, [store.dispatch, store.session]);

  //initiate websocket channel connection
  useEffect(() => {
    if (store.session) {
      connectWebSocket(store.session);
    }
  }, [store.session]);

  //connect attributes
  useEffect(() => {
    if (store.company && store.session) {
      getSkills(store.dispatch, store.session, store.company.id);
      connectSkills(store);
      getIndustries(store.dispatch, store.session, store.company.id);
      connectIndustries(store);
      getDepartments(store.dispatch, store.session, store.company.id);
      connectDepartments(store);
      getBusinessAreas(store.dispatch, store.session, store.company.id);
      connectBusinessAreas(store);
    }
  }, [store.company, store.session]);

  // ONCE STORE HAS SESSION, GET USER AND ALLMYCOMPANIES
  useEffect(() => {
    if (store.session) {
      getUser(store.dispatch, store.session).then((res) => {
        if (res.err) {
          logOut(store.dispatch, store.session);
        }
      });
      getAllMyCompanies(store.dispatch, store.session).then((res) => {
        if (res.err) {
          logOut(store.dispatch, store.session);
        }
      });
    }
  }, [store.session, store.dispatch]);

  // ONCE COMPANY IS SET, FETCH TEAM_MEMBERS AND PERMISSIONS
  useEffect(() => {
    if (store.company && store.session && store.allMyCompanies.length > 1) {
      getCompanySources(store.dispatch, store.session, store.company.id);
      getTeamMembers(store.dispatch, store.session, store.company.id);
      getRole(store.dispatch, store.session, store.company.id);
      getInterviewStages(store.dispatch, store.session, store.company.id);
      getPricingPlan(store.company.id, store.session, store.dispatch);
      getApprovalProcess(store.company.id, store.session, store.dispatch);
      getJobExtraFields(store.company.id, store.session, store.dispatch);
    }
  }, [store.company, store.session, store.dispatch, store.allMyCompanies]);

  useEffect(() => {
    if (store.allMyCompanies?.length === 1) {
      getCompanySources(
        store.dispatch,
        store.session,
        store.allMyCompanies[0].id
      );
      getTeamMembers(store.dispatch, store.session, store.allMyCompanies[0].id);
      getRole(store.dispatch, store.session, store.allMyCompanies[0].id);
      getInterviewStages(
        store.dispatch,
        store.session,
        store.allMyCompanies[0].id
      );
      getPricingPlan(store.allMyCompanies[0].id, store.session, store.dispatch);
      getApprovalProcess(
        store.allMyCompanies[0].id,
        store.session,
        store.dispatch
      );
      getJobExtraFields(
        store.allMyCompanies[0].id,
        store.session,
        store.dispatch
      );
    }
  }, [store.allMyCompanies]);

  return (
    <>
      {store.session &&
        store.user &&
        store.allMyCompanies &&
        !navBarExceptions[props.location.pathname] && <AuthHeader />}
      {historyStore.current &&
        showATSNavBar[historyStore.current?.match.path] && <ATSNavBar />}
      {props.children}
      <IntercomComponent store={store} />
      <SentryComponent store={store} />
    </>
  );
};
export default withRouter(MainPageFetcher);
