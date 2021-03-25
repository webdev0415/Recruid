import React from "react";
import styled from "styled-components";
import CompletedCheckmark from "components/JobCreation/components/CompletedCheckmark";

const JobInput = ({
  value,
  setValue,
  validation,
  placeholder,
  readOnly,
  disabled,
}) => {
  return (
    <Wrapper className="leo-flex-center-between">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${disabled ? "disabled-input" : ""}`}
      />
      {validation && <CompletedCheckmark />}
    </Wrapper>
  );
};

export default JobInput;

const Wrapper = styled.div`
  padding-bottom: 5px;
  border-bottom: solid #c4c4c4 1px;
  max-width: 530px;
`;

const Input = styled.input`
  border: none;
  background: none;
  font-size: 14px;
  width: 100%;
  margin-right: 5px;

  &.disabled-input {
    color: #b0bdca;
  }
`;
