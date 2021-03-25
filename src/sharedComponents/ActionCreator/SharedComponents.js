import styled from "styled-components";

export const SelectsWrapper = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-between",
}))`
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 10px;
  padding-bottom: 10px;
`;

export const SelectBox = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex leo-relative leo-width-full",
}))`
  flex-direction: column;
  max-width: 110px;

  &:not(:last-child) {
    margin-right: 15px;
  }

  label {
    color: #74767b;
    font-size: 12px;
    line-height: 1;
    margin-bottom: 10px;
  }

  .button,
  input,
  select {
    background-color: transparent !important;
    border: 0;
    color: #1f1f1f;
    cursor: pointer;
    font-size: 14px;
    overflow: hidden !important;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .button {
    width: fit-content;
    box-shadow: none;
    font-weight: 400;
  }

  select {
    background-position: center right 0 !important;
    min-width: 110px;
    max-width: 130px;
  }
`;

export const TitleInput = styled.input`
  background-color: transparent !important;
  border: none;
  border-bottom: 1px solid #eeeeee;
  color: #1f1f1f;
  font-size: 14px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  width: 100%;
`;

export const FlexBox = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center",
}))``;

export const PriorityIndicator = styled.span`
  margin-right: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;

  &.High {
    background: #f27881;
  }
  &.Low {
    background: #f4d16e;
  }
  &.Medium {
    background: #ffa076;
  }
`;
