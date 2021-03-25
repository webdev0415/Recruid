// import React from "react";
import styled from "styled-components";

export const StyledInput = styled.input`
  background: white;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  box-shadow: none;
  color: inherit;
  font-size: 15px;
  height: 40px;
  padding-left: 15px;

  &:focus {
    background: rgba(0, 203, 167, 0.03);
    border-color: #00cba7 !important;
    box-shadow: none !important;
    color: #495057;
    outline: 0;
  }

  &:disabled {
    background: #f2f3f5;
    color: #74767b;
  }
`;

export const StyledLabel = styled.label`
  color: #74767b;
  font-size: 12px;
  margin-bottom: 10px;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
