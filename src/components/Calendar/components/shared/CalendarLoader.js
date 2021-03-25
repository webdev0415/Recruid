import React from "react";
import styled from "styled-components";
import Spinner from "sharedComponents/Spinner";

const CalendarLoaderWtapper = styled.div`
  background: #fff;
  width: 100%;
  height: 100vh;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const CalendarLoader = () => (
  <CalendarLoaderWtapper className="leo-flex">
    <Spinner inline style={{ position: "static", transform: "none" }} />
  </CalendarLoaderWtapper>
);
