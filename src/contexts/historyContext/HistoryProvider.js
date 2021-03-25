import React, { useReducer } from "react";
import HISTORY_STATE from "contexts/historyContext/HistoryState";
import HistoryReducer from "contexts/historyContext/HistoryReducer";
import HistoryContext from "contexts/historyContext/HistoryContext";

const HistoryProvider = (props) => {
  const [state, dispatch] = useReducer(HistoryReducer, HISTORY_STATE);

  return (
    <HistoryContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
