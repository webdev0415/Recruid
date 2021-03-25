import React from "react";
import styled from "styled-components";

const ActionItemMenu = ({
  deleteAction,
  editing,
  setEditing,
  saveEdit,
  cancelEdit,
}) => {
  return (
    <div>
      {!editing && (
        <>
          <STButton onClick={() => setEditing(true)}>
            <i className="fas fa-pen"></i>
          </STButton>
          <STButton onClick={() => deleteAction()}>
            <i className="fas fa-trash-alt"></i>
          </STButton>
        </>
      )}
      {editing && (
        <>
          <STButton onClick={() => saveEdit()}>
            <i className="fas fa-check"></i>
          </STButton>
          <STButton onClick={() => cancelEdit()}>
            <i className="fas fa-times"></i>
          </STButton>
        </>
      )}
    </div>
  );
};

export default ActionItemMenu;

const STButton = styled.button`
  background: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.05);
  padding: 0;
  width: 25px;
  height: 25px;
  font-size: 12px;
  color: #8e8e8e;
  margin-right: 5px;

  &:hover {
    color: #4d4a4a;
  }
`;
