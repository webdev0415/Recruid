import React from "react";

export const MultiselectSvg = ({ selected = true }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{marginRight: "10px"}}
  >
    <rect
      x="0.5"
      y="0.5"
      width="14"
      height="14"
      rx="7"
      fill="white"
      stroke="#74767B"
    />
    {selected && (
      <rect x="3" y="3" width="9" height="9" rx="4.5" fill="#2A3744" />
    )}
  </svg>
);
