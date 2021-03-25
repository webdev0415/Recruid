import React, { useContext } from "react";
import { Link } from "react-router-dom";
import HistoryContext from "contexts/historyContext/HistoryContext";
import styled from "styled-components";

const BreadCrumb = () => {
  const historyStore = useContext(HistoryContext);
  return (
    <>
      {historyStore.state.length > 1 && (
        <BreadCrumbContainer className="leo-flex-center">
          <Link
            to={historyStore.state[1]?.pathname + historyStore.state[1]?.search}
          >
            {historyStore.state[1]?.origin_name}
          </Link>
          <i className="fas fa-caret-right"></i>
          <span>{historyStore.state[0]?.origin_name}</span>
        </BreadCrumbContainer>
      )}
    </>
  );
};

export default BreadCrumb;

const BreadCrumbContainer = styled.div`
  border-bottom: 1px solid #eee;
  color: #74767b;
  font-size: 12px;
  line-height: 1;
  margin-bottom: 20px;
  padding-bottom: 20px;

  i {
    margin: 0px 8px;
  }

  a {
    color: #74767b;
  }
`;
