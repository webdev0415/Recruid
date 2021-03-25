import React from "react";

export const TimerSvg = ({ statusColor }) => (
  <svg width="10" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.682 7A4.682 4.682 0 11.318 7a4.682 4.682 0 019.364 0z"
      stroke={statusColor || "#2A3744"}
      strokeWidth=".636"
    />
    <path
      d="M3 1h4M5 7l2-2"
      stroke={statusColor || "#2A3744"}
      strokeWidth=".636"
      strokeLinecap="round"
    />
  </svg>
);

export const WarningIcon = ({ color }) => (
  <svg width="12" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.752 1.38a1 1 0 00-1.696 0L.184 9.189a1 1 0 00.849 1.53h9.742a1 1 0 00.849-1.53L6.752 1.381zm-.496 5.915l.067-3.468h-.845l.067 3.468h.711zm-.72 1.307a.52.52 0 00.363.138.52.52 0 00.362-.138.444.444 0 000-.67.515.515 0 00-.362-.14.515.515 0 00-.362.14.444.444 0 000 .67z"
      fill={
        color === "red" ? "#D24650" : color === "orange" ? "#FFA076" : color
      }
    />
  </svg>
);
