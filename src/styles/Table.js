import React from "react";
import styled from "styled-components";
import BootstrapTable from "react-bootstrap/Table";
import { COLORS } from "constants/style";
export const Table = (props) => (
  <STTable {...props} borderless responsive>
    {props.children}
  </STTable>
);

const STTable = styled(BootstrapTable)``;

export const TableRow = styled.tr`
  &.header-row {
    border-top: 1px solid #dfe7ef;
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid #dfe7ef;
  }
`;

export const TableHeader = styled.th`
  border-bottom: 1px solid #dfe7ef !important;
  border-top: none;
  font-weight: 500;
  font-size: 12px !important;
  color: ${COLORS.dark_4};
  text-align: ${(props) => (props.center ? "center" : "initial")};
  // width: max-content;
  display: table-cell;
  vertical-align: middle !important;
`;

export const TableCell = styled.td`
  border-bottom: 1px solid #dfe7ef !important;
  font-weight: ${(props) => (props.bold ? 500 : "initial")};
  font-size: 14px !important;
  color: ${COLORS.dark_1};
  text-align: ${(props) => (props.center ? "center" : "initial")};
  // width: max-content;
  display: table-cell;
  vertical-align: middle !important;
`;
