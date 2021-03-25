import React, { useState, useEffect } from "react";
import styled from "styled-components";

export default ({ title, children, index, gatherClientStages }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (index === 0) {
      setActive(true);
    }
  }, [index]);

  useEffect(() => {
    if (active) {
      gatherClientStages();
    }
  }, [active, gatherClientStages]);
  return (
    <>
      <Wrapper
        onClick={() => setActive(!active)}
        className="leo-flex-center-between leo-pointer"
      >
        <h3>{title}</h3>
        <svg width="14" height="9" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M.5 1.833L7 8.5l6.5-6.667L12.2.5 7 5.833 1.8.5z"
            fill="#D1D1D6"
            fill-role="evenodd"
          />
        </svg>
      </Wrapper>
      {active && children}
    </>
  );
};

const Wrapper = styled.div`
  padding: 10px 20px;

  h3 {
    font-weight: 500;
  }
`;
