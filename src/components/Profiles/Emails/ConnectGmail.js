import React from "react";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 800px;
  padding: 40px 0 0;
`;

const H2 = styled.h2`
  color: #1f1f1f;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const P = styled.p`
  color: #1f1f1f;
  font-size: 14px;
  font-weight: 400;
`;

const ButtonsBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Button = styled.button`
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  padding: 15px 20px;

  svg,
  img {
    margin-right: 15px;
  }

  span {
    color: #1f1f1f;
    font-size: 14px;
    font-weight: 600;
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const OutlookIcoWrapper = styled.div`
  margin-right: 10px;
  width: 25px;

  img {
    width: 100%;
  }
`;

const OutlookButton = styled(Button)`
  padding: 11px 20px;
`;

export default function ConnectGmail({ grantAccess, handleMsalLogin }) {
  return (
    <Wrapper>
      <H2>Connect your mailbox</H2>
      <P>
        To communicate with your candidates through Leo you need to connect a
        mailbox.
      </P>
      <ButtonsBlock>
        <Button onClick={grantAccess}>
          <img src={`${AWS_CDN_URL}/icons/gmail-ico.svg`} alt="Gmail Icon" />
          <span>Connect Google Mail</span>
        </Button>
        <OutlookButton onClick={handleMsalLogin}>
          <OutlookIcoWrapper>
            <img
              src={`${AWS_CDN_URL}/icons/outlook_ico.svg`}
              alt="Outlook Icon"
            />
          </OutlookIcoWrapper>
          <span>Connect Outlook</span>
        </OutlookButton>
      </ButtonsBlock>
    </Wrapper>
  );
}
