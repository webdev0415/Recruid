import { useState, useEffect, useRef } from "react";

const useDropdown = (closeCallback, closeDelay = 0) => {
  const node = useRef();
  const [showSelect, setShowSelect] = useState(false);

  const handleClick = (e) => {
    if (!node?.current?.contains(e.target)) {
      if (closeCallback) {
        closeCallback();
      }
      return setTimeout(() => setShowSelect(false), closeDelay);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
     
  }, []);
  return { node, showSelect, setShowSelect };
};

export default useDropdown;
