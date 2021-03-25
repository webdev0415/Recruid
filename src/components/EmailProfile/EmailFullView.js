import React from "react";
import styled from "styled-components";
import { ATSContainer } from "styles/PageContainers";
import spacetime from "spacetime";
import { AWS_CDN_URL } from "constants/api";

const EmailFullView = ({ emailBody, email }) => {
  return (
    <Container className="leo-flex leo-align-start leo-justify-around">
      <EmailProvider email={email} parsedBody={emailBody} />
      <EmailMobile email={email} parsedBody={emailBody} />
    </Container>
  );
};

const EmailProvider = ({ email, parsedBody }) => (
  <ProviderContainer>
    <ProviderRow className="leo-flex-center">{email.subject}</ProviderRow>
    <ProviderRow className="grey-color leo-flex-center-between">
      <span>{`From: ${email.from_name} <${email.from_email}>`}</span>
      <span>
        {spacetime(email?.created_at).format(
          "{date} {month-short}, {year} {hour-24-pad}:{minute-pad}"
        )}
      </span>
    </ProviderRow>
    <BodyRow dangerouslySetInnerHTML={{ __html: parsedBody }} />
  </ProviderContainer>
);

const EmailMobile = ({ parsedBody }) => (
  <div className="leo-relative">
    <MobileContainer dangerouslySetInnerHTML={{ __html: parsedBody }} />
    <img src={`${AWS_CDN_URL}/illustrations/iphone-bg.png`} alt="" />
  </div>
);

const Container = styled(ATSContainer)`
  width: 100%;
  /* background: #f6f6f6; */

  .variable {
    background: #dfe9f4;
    display: inline-block;
    border-radius: 4px;
    padding: 2px 5px;
    width: max-content;
  }
`;

const ProviderContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.05);
  height: 600px;
  max-width: 720px;
  overflow-y: auto;
  width: 100%;
`;

const ProviderRow = styled.div`
  border-bottom: solid 1px #eeeeee;
  font-weight: 500;
  font-size: 12px;
  height: 34px;
  padding: 0 15px;

  &.grey-color {
    color: #74767b;
    font-weight: 400;
  }
`;

const BodyRow = styled.div`
  background: #fff;
  margin: 0 auto;
  max-width: 600px;
  padding: 20px 10px;
`;
const MobileContainer = styled.div`
  background: #f9f9f9;
  height: 430px;
  left: 21px;
  overflow-y: auto;
  padding: 20px 10px;
  position: absolute;
  top: 64px;
  width: 241px;

  p {
    font-size: 12px;
    line-height: 18px;
  }
`;

export default EmailFullView;
