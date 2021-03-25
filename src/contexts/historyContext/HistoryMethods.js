export const removeCurrentEntry = (historyStore) => {
  historyStore.dispatch({ type: "REMOVE_LAST" });
};
