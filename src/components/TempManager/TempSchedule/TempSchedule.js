import React, { useState } from "react";
import styled from "styled-components";
import { ATSContainer } from "styles/PageContainers";
import SourceTypeSelect from "components/TempManager/TempSchedule/components/SourceTypeSelect";

const TempSchedule = () => {
  const [sourceType, setSourceType] = useState("jobs");
  return (
    <ATSContainer>
      <ScheduleContainer>
        <ScheduleHeaderRow>
          <HeaderSelectBox>
            <SourceTypeSelect
              sourceType={sourceType}
              setSourceType={setSourceType}
            />
          </HeaderSelectBox>
          <HeaderDateBox></HeaderDateBox>
        </ScheduleHeaderRow>
      </ScheduleContainer>
    </ATSContainer>
  );
};

export default TempSchedule;

const ScheduleContainer = styled.div`
  border: 1px solid #eeeeee;
  border-radius: 4px;
`;

const ScheduleHeaderRow = styled.div`
  display: flex;
`;

const HeaderSelectBox = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #eeeeee;
`;

const HeaderDateBox = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
