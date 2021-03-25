import styled from "styled-components";
import { Link } from "react-router-dom";
import { ModalBody } from "modals/UniversalModal/UniversalModal";
export const STModalBody = styled(ModalBody)`
  padding: 30px !important;
`;

export const STContainer = styled.div`
  border: 1px solid #eee;
  border-radius: 4px;
  max-height: 500px;
  overflow: auto;
  // margin-bottom: 50px;
`;

export const STTable = styled.table`
  span {
    display: inline !important;
  }
`;

export const TableDiv = styled.div`
overflow: unset !important;
`

export const SLink = styled(Link)`
  color: inherit;

  &:hover {
    text-decoration: none;
  }
`;

export const OverflowCell = styled(Link)`
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
