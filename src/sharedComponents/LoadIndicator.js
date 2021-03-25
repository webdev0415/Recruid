import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AppButton from "styles/AppButton";
import Spinner from "sharedComponents/Spinner";
const LoadIndicator = ({
  displayText,
  displayed,
  total,
  fetchMore,
  loading,
}) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    let val = Math.round((displayed / total) * 100);
    setPercentage(val > 100 ? 100 : val < 0 ? 0 : val);
  }, [total, displayed]);

  return (
    <Wrapper className="leo-flex-center-center">
      {loading && <Spinner />}
      <div className="display-text">
        SHOWING {displayed} of {total} Candidates
      </div>
      <Container className="leo-flex-center">
        <BaseBar>
          <CompletedBar percentage={percentage} />
        </BaseBar>
      </Container>
      {displayed < total && (
        <AppButton onClick={() => fetchMore()}>
          Load More {displayText}
        </AppButton>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 50px;
  padding-bottom: 82px;
  flex-direction: column;

  .display-text {
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0.05em;
    color: #2a3744;
  }
`;

const Container = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
`;

const BaseBar = styled.div`
  width: 320px;
  position: relative;
  height: 5px;
  background: #c4c4c4;
  border-radius: 5px;
`;

const CompletedBar = styled.div`
  background: #2a3744;
  border-radius: 5px;
  width: ${(props) => props.percentage}%;
  position: absolute;
  height: 5px;
`;

export default LoadIndicator;
