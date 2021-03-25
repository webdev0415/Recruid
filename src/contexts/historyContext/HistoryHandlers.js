const HistoryHandlers = {
  PUSH_HISTORY: (history, action) => {
    return {
      ...history,
      state: [action.payload, ...history.state.slice(0, 50)],
    };
  },
  UPDATE_HISTORY: (history, action) => {
    return { ...history, state: [...action.payload.slice(0, 50)] };
  },
  REMOVE_LAST: (history) => {
    return { ...history, state: [...history.state.slice(1, 50)] };
  },
  UPDATE_CURRENT: (history, action) => {
    return { ...history, current: action.payload };
  },
  UPDATE_ACTIVE_TAB: (history, action) => {
    return { ...history, active_tab: action.payload };
  },
};
export default HistoryHandlers;
