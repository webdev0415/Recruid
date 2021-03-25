import React, { useContext, useEffect } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { logOut } from "contexts/globalContext/GlobalMethods";
import InnerPage from "PageWrappers/InnerPage";

const ProfessionalLogoff = () => {
  const store = useContext(GlobalContext);

  useEffect(() => {
    if (store.session) {
      logOut(store.dispatch, store.session);
    }
     
  }, []);
  return <InnerPage />;
};

export default ProfessionalLogoff;
