import React, { useReducer } from "react";
import GLOBAL_STATE from "contexts/globalContext/GlobalState";
import GlobalReducer from "contexts/globalContext/GlobalReducer";
import GlobalContext from "contexts/globalContext/GlobalContext";

const GlobalProvider = props => {
  const [state, dispatch] = useReducer(GlobalReducer, GLOBAL_STATE);

  return (
    <GlobalContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
