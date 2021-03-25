import HistoryHandlers from "contexts/historyContext/HistoryHandlers";

const HistoryReducer = (state, action) => {
  if (HistoryHandlers.hasOwnProperty(action.type)) {
    return HistoryHandlers[action.type](state, action);
  } else {
    return state;
  }
};

export default HistoryReducer;
