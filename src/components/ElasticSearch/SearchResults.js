import React, { useEffect } from "react";
import { ResultBlock } from "./ResultBlock";
import styled from "styled-components";
import { ATSContainer } from "styles/PageContainers";

export const SearchResults = ({ results, role }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);
  return (
    <ResultsWrapper>
      <ATSContainer>
        <ResultsGrid>
          {results?.map((result, index) => {
            const [resultSource, ...resultData] = result;
            if (
              result[0] === "emails" ||
              result[0] === "documents" ||
              role.role_permissions.owner ||
              role.role_permissions.admin ||
              role.role_permissions[permissionExchanger[resultSource]]
            ) {
              return (
                <ResultBlock
                  resultSource={resultSource}
                  result={resultData}
                  key={`result-block-#${index++}`}
                />
              );
            } else {
              return null;
            }
          })}
        </ResultsGrid>
      </ATSContainer>
    </ResultsWrapper>
  );
};

const permissionExchanger = {
  candidates: "recruiter",
  jobs: "recruiter",
  interviews: "recruiter",
  contacts: "business",
  clients: "business",
  deals: "business",
  meetings: "business",
};

const ResultsWrapper = styled.div`
  background: #2a3744;
  height: 100vh;
  overflow-y: auto;
  padding-top: 20px;
  max-height: calc(100vh - 100px);
`;

const ResultsGrid = styled.div`
  /* border: 1px solid red; */
  display: grid;
  grid-auto-rows: auto;
  grid-gap: 50px 75px;
  grid-template-columns: 1fr;
  justify-content: space-between;
  max-height: 80.5%;
  margin-top: 25px;
  overflow-y: auto;
  width: 100%;

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* & > * {
    border: 1px solid yellow;
  } */
`;
