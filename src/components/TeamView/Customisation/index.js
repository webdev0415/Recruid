import React from "react";
import InterviewStages from "components/TeamView/InterviewStages/InterviewStages";
import CustomSources from "components/TeamView/CustomSources/CustomSources";
import CustomCurrency from "components/TeamView/CustomCurrency";
import ApprovalProcess from "components/TeamView/ApprovalProcess";
import JobExtraFields from "components/TeamView/JobExtraFields";
import ApplicationQuestions from "components/TeamView/ApplicationQuestions";
import {
  DetailsTabContainer,
  Title,
  SubTitle,
  HeaderWrapper,
} from "components/TeamView/Customisation/sharedComponents";

const Customisation = () => {
  return (
    <DetailsTabContainer>
      <HeaderWrapper>
        <Title>Customisation</Title>
        <SubTitle>
          Here you can customise certain elements of the platform to better
          match your internal process.
        </SubTitle>
      </HeaderWrapper>
      <JobExtraFields />
      <ApprovalProcess />
      <ApplicationQuestions />
      <InterviewStages />
      <CustomSources />
      <CustomCurrency />
    </DetailsTabContainer>
  );
};

export default Customisation;
