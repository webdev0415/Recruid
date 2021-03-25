import React, { useContext, useState, useEffect } from "react";
import { withRouter } from "react-router";
import { ROUTES } from "routes";
import notify from "notifications";

import GlobalContext from "contexts/globalContext/GlobalContext";
import HistoryContext from "contexts/historyContext/HistoryContext";
import { ReactTitle } from "react-meta-tags";
import { Redirect } from "react-router-dom";
import { logOut, checkLastCompany } from "contexts/globalContext/GlobalMethods";
import { getTasksTotal } from "contexts/globalContext/GlobalMethods";
import EmailScanNotification from "sharedComponents/EmailScanNotication";

let timeout;

const InnerPage = (props) => {
  const store = useContext(GlobalContext);
  const historyStore = useContext(HistoryContext);
  const [redirect, setRedirect] = useState(false);
  const [checkSession, setCheckSession] = useState(false);

  //WAIT 500MS TO CHECK FOR A SESSION TO REDIRECT TO SIGNIN IN CASE THE SESSION IS NOT VALID
  //THIS IS NEEDED TO GIVE TIME FOR THE STORE TO UPDATE SESSION AS THE PAGE LOADES
  useEffect(() => {
    timeout = setTimeout(() => {
      setCheckSession(true);
    }, 500);
    return () => clearTimeout(timeout);
  }, [store.session]);

  //REDIRECT TO SIGN IN IF THE SESSION DOES NOT EXIST OR IS NOT VALID, IF NOT VALID, DELETE THE SESSION FROM THE STORE
  useEffect(() => {
    if (checkSession) {
      if (!store.session || !store.session["access-token"]) {
        setRedirect(ROUTES.ProfessionalSignin.url());
      } else if (new Date(store.session.expiry * 1000) - Date.now() < 0) {
        notify("danger", "Your session has expired. Please log in again");
        logOut(store.dispatch, store.session);
        // setRedirect(ROUTES.ProfessionalSignin.url());
      }
    }
  }, [checkSession, store.session, store.dispatch]);

  //THIS useEffect REDIRECT THE USER TO CHANGE HIS PASSWORD IF IT IS A TEMPORARY PASSWORD
  useEffect(() => {
    if (
      store.user &&
      store.user.temp_password &&
      props.location.pathname !== ROUTES.NewPassword.url()
    ) {
      setRedirect(ROUTES.NewPassword.url());
    }
  }, [store.user]);

  //THIS useEffect CHANGES THE COMPANY IN THE CONTEXT STORE BASED ON THE URL PARAM companyMentionTag
  useEffect(() => {
    if (props.match.params.companyMentionTag && store.allMyCompanies) {
      //IF THE MENTION TAG ALREADY MATCHES THE CURRENT COMPANY DON'T ACTIONS
      if (
        store.company &&
        props.match.params.companyMentionTag === store.company.mention_tag
      )
        return;
      //FIND THE COMPANY IN THE COMPANIES ARRAY
      let companyMatch;
      store.allMyCompanies.map((company) => {
        if (company.mention_tag === props.match.params.companyMentionTag) {
          companyMatch = company;
        }
        return null;
      });
      //IF THERE IS NO COMPANY WITH THAT MENTION TAG IN THE USER ARRAY OF COMPANIES REDIRECT TO
      if (!companyMatch) {
        setRedirect(ROUTES.MyCompanies.url());
      } else {
        //IF THERE IS NO COMPANY IN THE STORE, STORE
        //IF THERE IS A COMPANY AND IT DOESN'T MATCH THE MENTION TAG PARAM, REPLACE IT
        if (!store.company) {
          store.dispatch({ type: "UPDATE_COMPANY", payload: companyMatch });
        } else if (store.company.id !== companyMatch.id) {
          store.dispatch({ type: "UPDATE_COMPANY", payload: companyMatch });
        }
      }
    }
    // else if (!props.match.params.companyMentionTag && store.company) {
    //   store.dispatch({ type: "DELETE_COMPANY" });
    // }
  }, [props.match.params.companyMentionTag, store.allMyCompanies]);

  //THIS useEffect REDIRECTS FROM THE BASE URL TO THE LAST USED COMPANY DASHBOARD OR FIRST COMPANY DASHBOARD
  useEffect(() => {
    //IF BASE URL AND COMPANIES ARRAY
    if (props.match.url === "/" && store.allMyCompanies) {
      //IF THE USER HAS NO COMPANIES REDIRECT TO
      if (!store.allMyCompanies.length) {
        setRedirect(ROUTES.MyCompanies.url());
        //IF THERE IS ONLY ONE COMPANY REDIRECT TO COMPANY DASHBOARD
      } else if (store.allMyCompanies.length === 1) {
        setRedirect(
          ROUTES.CompanyDashboard.url(store.allMyCompanies[0].mention_tag)
        );
      } else {
        //IF MORE THAN ONE COMPANY CHECK LOCAL STORAGE FOR LAST COMPANY VISITED
        let lastCompanyId = checkLastCompany();
        let companyMatch;
        store.allMyCompanies.map((comp) =>
          comp.id === lastCompanyId ? (companyMatch = comp.mention_tag) : null
        );
        //IF LAST COMPANY VISITED EXISTS AND MATCHES A COMPANY IN THE USER COMPANIES ARRAY
        setRedirect(
          ROUTES.CompanyDashboard.url(
            companyMatch || store.allMyCompanies[0].mention_tag
          )
        );
      }
    }
  }, [props.match, store.allMyCompanies]);

  //TOTAL TASKS
  useEffect(() => {
    if (store.session) {
      getTasksTotal(store.dispatch, store.session);
    }
  }, [store.session, store.dispatch]);

  // update history state
  useEffect(() => {
    if (props.match.path) {
      if (
        historyStore.state.length > 0 &&
        props.match.path === historyStore.state[0].path
      ) {
        let historyCopy = [...historyStore.state];
        historyCopy[0] = {
          ...props.match,
          ...props.location,
          origin_name: props.originName,
        };
        historyStore.dispatch({
          type: "UPDATE_HISTORY",
          payload: historyCopy,
        });
      } else {
        historyStore.dispatch({
          type: "PUSH_HISTORY",
          payload: {
            ...props.match,
            ...props.location,
            origin_name: props.originName,
          },
        });
      }
      historyStore.dispatch({
        type: "UPDATE_CURRENT",
        payload: {
          match: props.match,
          location: props.location,
        },
      });
    }
  }, [props.match, props.originName]);

  return (
    <>
      <ReactTitle title={`${props.pageTitle || ""} | Leo`} />
      {redirect && <Redirect to={redirect} />}
      {props.children}
      {store.emailsScanPending && <EmailScanNotification />}
    </>
  );
};

export default withRouter(InnerPage);
