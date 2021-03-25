import React, { useState, useEffect } from "react";

let timeout = null;

// useEffect(() => {
//   if (jobsInput.length >= 2 && readyForSearch) {
//     setReadyForSearch(false);
//     setTimeout(() => setReadyForSearch(true), 350);
//     setSearch(jobsInput);
//   } else if (jobsInput.length < 3 && search !== "") {
//     setSearch("");
//   }
//    
// }, [jobsInput, readyForSearch]);

const SimpleDelayedInput = ({
  value,
  onChange,
  placeholder,
  className,
  style,
  onClick,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [updateValue, setUpdateValue] = useState(false);

  useEffect(() => {
    if (searchValue !== value) {
      timeout = setTimeout(() => setUpdateValue(true), 500);
    }
    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    if (updateValue) {
      if (searchValue.length > 2) {
        onChange(searchValue);
      } else if (value !== "") {
        onChange("");
      }
      setUpdateValue(false);
    }
  }, [updateValue]);

  return (
    <input
      className={className}
      style={style}
      placeholder={placeholder || "Search..."}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onClick={(e) => (onClick ? onClick(e) : {})}
    />
  );
};

export default SimpleDelayedInput;
