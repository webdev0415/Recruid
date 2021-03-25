import styled from "styled-components";
import { COLORS } from "constants/style";

export const SectionTitle = styled.h4`
  font-size: 24px;
  font-weight: 500;
  grid-column: span 2;
  margin-bottom: 30px;
  margin-top: 60px;
`;

export const Label = styled.label`
  font-size: 12px;
  color: ${COLORS.dark_4};
  margin-bottom: 7px;
  line-height: 15px;

  &.large-margin {
    margin-bottom: 20px;
  }
`;

export const DepContainer = styled.div`
  max-width: ${(props) => (props.size === "small" ? "531px" : "initial")};
  margin-bottom: 30px;
  margin-right: 30px;
`;

export const SuggestionText = styled.div`
  font-size: 14px;
  color: ${COLORS.dark_4};
  line-height: 17px;
  p {
    margin-bottom: 10px;
  }
`;

export const SalaryInput = styled.input`
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  padding: 5px;
  max-width: 130px;
`;
export const SalaryLabel = styled.label`
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 17px;
  font-weight: 500;
`;

export const JobSelect = styled.select`
  background: #ffffff;
  border: 1px solid #c4c4c4;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 7px 15px;
  padding-right: 30px;
  font-size: 14px;
  min-width: 100px;
`;

export const CheckBoxesGrid = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.gridColumns === 2 ? "1fr 1fr" : "1fr 1fr 1fr"};
  grid-gap: 10px;
  width: min-content;
`;
