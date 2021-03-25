import React from "react";
import styled from "styled-components";

export const DetailsTabContainer = styled.div`
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

export const Title = styled.h5`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
`;

export const SubTitle = styled.p`
  font-size: 14px;
  line-height: 17px;
  color: #53585f;
`;

export const HeaderWrapper = styled.div`
  border-bottom: solid #eeeeee 1px;
  padding-bottom: 30px;
  margin-bottom: 30px;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 0;

  button:last-child {
    margin-left: 10px;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;

  div {
    display: flex;
    flex-direction: column;
  }
`;

export const StyledInput = styled.input`
  background: #eeeeee;
  border: none;
  border-radius: 2px;
  font-size: 14px;
  padding: 10px 15px;
  width: 317px;
`;

export const InfoText = styled.p`
  font-size: 14px;
  line-height: 17px;
  color: #1e1e1e;
  margin-bottom: 5px;
`;

export const ContentWrapper = styled.div`
  border-bottom: solid #eee 1px;
  margin-bottom: 20px;
`;

export const ExpandButton = ({ expand, setExpand }) => (
  <ExpandButtonST
    onClick={() => {
      setExpand(!expand);
    }}
  >
    {!expand ? (
      <i className="fas fa-angle-down"></i>
    ) : (
      <i className="fas fa-angle-up"></i>
    )}
  </ExpandButtonST>
);

const ExpandButtonST = styled.button`
  color: #eee;
  position: absolute;
  right: 0;
  top: 0;
  font-size: 40px;
`;
