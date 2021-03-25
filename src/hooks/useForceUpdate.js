import { useState } from "react";

const useForceUpdate = (
  getterKey = "shouldUpdate",
  setterKey = "triggerUpdate"
) => {
  const [forceUpdate, setForceUpdate] = useState(-1);

  const triggerUpdate = () => setForceUpdate(Math.random() * 100);

  return { [getterKey]: forceUpdate, [setterKey]: () => triggerUpdate() };
};

export default useForceUpdate;
