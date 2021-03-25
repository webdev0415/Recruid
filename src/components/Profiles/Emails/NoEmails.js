import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 800px;
  padding: 40px 0 0;
`;

const H2 = styled.h2`
  color: #1f1f1f;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const P = styled.p`
  color: #1f1f1f;
  font-size: 14px;
  font-weight: 400;
`;

export default function ConnectGmail() {
  return (
    <Wrapper>
      <H2>This candidate has no emails</H2>
      <P>When you communicate with the candidate the emails will show here.</P>
    </Wrapper>
  );
}
