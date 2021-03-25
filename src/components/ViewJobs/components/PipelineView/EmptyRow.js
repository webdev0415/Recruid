import React from "react";
import { TableSC } from "./PipelineComponents";

const { TableRow } = TableSC;

export const EmptyRow = ({children}) => (
  <TableRow>
    <td colSpan={5} style={{ padding: "20px 0", textAlign: "center" }}>
      {children}
    </td>
  </TableRow>
);
