import React, { useEffect } from "react";
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

export const FrappeChart = ({ type, data, height, width, index }) => {
  useEffect(() => {
    //eslint-disable-next-line
    const chart = new Chart(`#${type}-${index}`, {
      data,
      type,
      height,
      width,
    });
  });

  return (
    <div
      style={{ height: `${height}px`, width: "100%" }}
      id={`${type}-${index}`}
    />
  );
};
