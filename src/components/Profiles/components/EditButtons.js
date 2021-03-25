import React from "react";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";

export const StyledButton = styled.button`
  &:not(:last-child) {
    margin-right: 15px;
  }
`;

const EditButtons = ({
  editing,
  onClickEdit,
  onClickCancel,
  onClickSave,
  onClickAdd,
  addButton,
  style,
  className,
}) => (
  <div style={style} className={`${className || ""} leo-flex`}>
    {addButton && !editing && (
      <StyledButton onClick={onClickAdd}>
        <img src={`${AWS_CDN_URL}/icons/AddIcon.svg`} alt="Add" />
      </StyledButton>
    )}
    {!editing ? (
      <StyledButton onClick={onClickEdit}>
        <img src={`${AWS_CDN_URL}/icons/EditPen.svg`} alt="Edit" />
      </StyledButton>
    ) : (
      <>
        <StyledButton onClick={onClickCancel}>
          <img src={`${AWS_CDN_URL}/icons/CancelIcon.svg`} alt="" />
        </StyledButton>
        <StyledButton onClick={onClickSave}>
          <img src={`${AWS_CDN_URL}/icons/SaveIcon.svg`} alt="" />
        </StyledButton>
      </>
    )}
  </div>
);

export default EditButtons;
