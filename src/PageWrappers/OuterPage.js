import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import HistoryContext from "contexts/historyContext/HistoryContext";
import { Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import { checkLastCompany } from "contexts/globalContext/GlobalMethods";
import { ROUTES } from "routes";

const OuterPage = (props) => {
  const store = useContext(GlobalContext);
  const historyStore = useContext(HistoryContext);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    document.body.classList.add("outer");
    return () => document.body.classList.remove("outer");
  }, []);

  //THIS useEffect REDIRECT THE USER TO CHANGE HIS PASSWORD IF IT IS A TEMPORARY PASSWORD
  useEffect(() => {
    if (store.user && store.user.temp_password) {
      setRedirect(ROUTES.NewPassword.url());
    }
  }, [store.user]);

  useEffect(() => {
    if (store.session && store.allMyCompanies && store.user) {
      if (store.allMyCompanies.length === 0) {
        setRedirect(ROUTES.MyCompanies.url());
      } else if (store.allMyCompanies.length === 1) {
        if (
          store.allMyCompanies[0].trial !== "upgraded" &&
          (store.allMyCompanies[0].invited_by_agency ||
            store.allMyCompanies[0].invited_by_employer)
        ) {
          if (store.allMyCompanies[0].invited_by_agency_id) {
            setRedirect(
              ROUTES.VendorPage.url(
                store.allMyCompanies[0].mention_tag,
                store.allMyCompanies[0].invited_by_agency_id
              )
            );
          } else {
            setRedirect(
              ROUTES.Vendors.url(store.allMyCompanies[0].mention_tag)
            );
          }
        } else {
          setRedirect(
            ROUTES.CompanyDashboard.url(store.allMyCompanies[0].mention_tag)
          );
        }
      } else {
        let lastCompanyId = checkLastCompany();
        let companyMatch;
        let allInvited = true;
        store.allMyCompanies.map((comp) => {
          if (comp.id === lastCompanyId) {
            companyMatch = comp.mention_tag;
          }
          if (
            (comp.invited_by_agency !== true ||
              comp.invited_by_employer ||
              comp.trial === "upgraded") &&
            allInvited === true
          ) {
            allInvited = false;
          }
          return null;
        });
        if (allInvited) {
          setRedirect(ROUTES.Vendors.url(store.allMyCompanies[0].mention_tag));
          return;
        }
        setRedirect(
          ROUTES.CompanyDashboard.url(
            companyMatch || store.allMyCompanies[0].mention_tag
          )
        );
      }
    }
  }, [store.session, store.allMyCompanies, store.user]);

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
      {redirect && <Redirect to={redirect} />}
      {props.children}
    </>
  );
};

export default withRouter(OuterPage);
