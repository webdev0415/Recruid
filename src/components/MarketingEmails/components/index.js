import styled from "styled-components";
import { COLORS } from "constants/style";

export const StatusIndicator = styled.span`
  background: ${COLORS.secondary_4};
  border-radius: 20px;
  color: ${COLORS.white};
  display: inline;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  padding: 5px 12px;
`;
