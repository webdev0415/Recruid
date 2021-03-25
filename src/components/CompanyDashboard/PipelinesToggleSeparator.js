import React from "react";
import styled from "styled-components";

// import sharedStyles from "assets/stylesheets/scss/collated/filter.module.scss";

const PipelinesToggleSeparator = ({
  pipelineJobsMode,
  setPipelineJobsMode,
}) => {
  return (
    <>
      <Menu>
        <ul className="leo-flex">
          <li>
            <button
              className={`option ${
                pipelineJobsMode === "internal" ? "active" : ""
              }`}
              onClick={() => setPipelineJobsMode("internal")}
            >
              Company Pipeline
            </button>
          </li>
          <li>
            <button
              className={`option ${
                pipelineJobsMode === "clients" ? "active" : ""
              }`}
              onClick={() => setPipelineJobsMode("clients")}
            >
              Client Pipelines
            </button>
          </li>
        </ul>
      </Menu>
    </>
  );
};

export default PipelinesToggleSeparator;

// const PipelineOptionsWrapper = styled.div``;

const Menu = styled.div`
  margin-bottom: 20px;

  ul {
    border-bottom: 1px solid #d8d8d8;
  }

  li {
    margin-right: 30px;

    &:last-child {
      margin-right: 0;
    }

    button {
      border-bottom: 2px solid transparent;
      color: #74767b !important;
      font-size: 15px;
      font-weight: 500;
      margin-bottom: -1px;

      &.active {
        border-bottom: 2px solid #1e1e1e;
        color: #1e1e1e !important;
        padding-bottom: 10px;
      }

      &:hover {
        color: #1e1e1e !important;
      }

      &.post {
        margin-left: 10px;
      }
    }
  }
`;
