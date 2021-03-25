import React from "react";

import {
  TabTitle,
  DetailContainer,
  Content,
  Subtitle,
  SectionTitleContainer,
  SectionContainer,
} from "components/Profiles/components/ProfileComponents";

const EmailOverviewTab = ({ email }) => {
  return (
    <>
      <SectionContainer>
        <SectionTitleContainer>
          <TabTitle>Details</TabTitle>
        </SectionTitleContainer>
        <DetailContainer>
          <Subtitle>Subject</Subtitle>
          <Content>{email.subject}</Content>
        </DetailContainer>
        {/*}<DetailContainer>
          <Subtitle>Preview Text</Subtitle>
          <Content>{"Someone please tell me what do we show here"}</Content>
        </DetailContainer>*/}
        <DetailContainer>
          <Subtitle>Sent by</Subtitle>
          <Content>{email.sent_by_name}</Content>
        </DetailContainer>
        <DetailContainer>
          <Subtitle>From name</Subtitle>
          <Content>{email.from_name}</Content>
        </DetailContainer>
        <DetailContainer>
          <Subtitle>From Email</Subtitle>
          <Content>{email.from_email}</Content>
        </DetailContainer>
      </SectionContainer>
    </>
  );
};

export default EmailOverviewTab;
