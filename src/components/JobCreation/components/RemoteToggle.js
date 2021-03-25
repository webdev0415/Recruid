import React from "react";
import styled from "styled-components";

const RemoteToggle = ({ checked, onToggle }) => {
  return (
    <Wrapper onClick={() => onToggle(!checked)} className="leo-relative">
      <span
        className={`${
          checked ? "on-remote" : "off-remote"
        } leo-flex-center-center`}
      >
        {checked ? "On" : "Off"}
      </span>
    </Wrapper>
  );
};

export default RemoteToggle;

const Wrapper = styled.button`
  background: #ffffff;
  border: 1px solid #c4c4c4;
  border-radius: 16px;
  display: block;
  height: 32px;
  width: 69px;

  span {
    border-radius: 16px;
    font-size: 10px;
    height: 22px;
    position: absolute;
    top: 4px;
    transition: all 500ms;
    width: 35px;

    &.off-remote {
      background: #f9f9f9;
      left: 5px;
    }

    &.on-remote {
      background: #35c3ae;
      color: #fff;
      right: 5px;
    }
  }
`;
