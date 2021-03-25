import React from "react";
import styled from "styled-components";

const Text = styled.span`
  color: #1e1e1e;
  font-size: 15px;
  padding: 30px;
  text-align: center;
`;

export const ConfirmAvailability = () => (
  <Text>The interview request has been sent to the candidate.</Text>
);

export default ConfirmAvailability;
