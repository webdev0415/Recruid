import React, { useContext, useEffect } from "react";
import { withRouter } from "react-router";
import Unauthorized from "components/Unauthorized.js";

import GlobalContext from "contexts/globalContext/GlobalContext";
import HistoryContext from "contexts/historyContext/HistoryContext";
import { checkLastCompany } from "contexts/globalContext/GlobalMethods";

const FalseATSWrapper = ({ activeTab, children, match }) => {
  const store = useContext(GlobalContext);
  const historyStore = useContext(HistoryContext);

  useEffect(() => {
    if (!store.company && store.allMyCompanies?.length > 0) {
      let lastCompanyId = checkLastCompany();
      let companyMatch;
      store.allMyCompanies.map((comp) =>
        comp.id === lastCompanyId ? (companyMatch = comp) : null
      );
      if (companyMatch) {
        store.dispatch({ type: "UPDATE_COMPANY", payload: companyMatch });
      } else {
        store.dispatch({
          type: "UPDATE_COMPANY",
          payload: store.allMyCompanies[0],
        });
      }
    }
  }, [store.company, store.allMyCompanies]);

  useEffect(() => {
    historyStore.dispatch({
      type: "UPDATE_ACTIVE_TAB",
      payload: activeTab,
    });
  }, [activeTab]);

  return (
    <>
      {store.session && store.session.username === match.params.username ? (
        <>{store.company ? children : null} </>
      ) : (
        <Unauthorized />
      )}
    </>
  );
};

export default withRouter(FalseATSWrapper);
