import React, { useState, useEffect } from "react";
import styled from "styled-components";
import JobCheckbox from "components/JobCreation/components/JobCheckbox";

import {
  Content,
  Subtitle,
} from "components/Profiles/components/ProfileComponents";

const WorkInterestv2 = ({ tnProfile, setProfile, editing, company }) => {
  const [jobTypes, setJobTypes] = useState({
    contract: false,
    permanent: false,
    temp: false,
  });
  const [initial, setInitial] = useState(true);
  const [workplaces, setWorkplaces] = useState({
    remote: false,
    flexible: false,
    office: false,
  });

  useEffect(() => {
    if (tnProfile && initial) {
      setJobTypes({
        contract:
          tnProfile.work_interest &&
          tnProfile.work_interest?.indexOf("contract") !== -1,
        permanent:
          tnProfile.work_interest &&
          tnProfile.work_interest?.indexOf("permanent") !== -1,
        temp:
          tnProfile.work_interest &&
          tnProfile.work_interest?.indexOf("temporary") !== -1,
      });
      setWorkplaces({
        remote:
          tnProfile.workplace_interest &&
          tnProfile.workplace_interest?.indexOf("remote") !== -1,
        flexible:
          tnProfile.workplace_interest &&
          tnProfile.workplace_interest?.indexOf("flexible") !== -1,
        office:
          tnProfile.workplace_interest &&
          tnProfile.workplace_interest?.indexOf("office") !== -1,
      });
    }
    setInitial(false);
  }, [tnProfile, initial]);

  useEffect(() => {
    if (!initial) {
      setProfile({
        ...tnProfile,
        work_interest: [
          ...(jobTypes.permanent ? ["permanent"] : []),
          ...(jobTypes.contract ? ["contract"] : []),
          ...(jobTypes.temp ? ["temporary"] : []),
        ],
      });
    }
  }, [jobTypes, initial]);

  useEffect(() => {
    if (!initial) {
      setProfile({
        ...tnProfile,
        workplace_interest: [
          ...(workplaces.remote ? ["remote"] : []),
          ...(workplaces.flexible ? ["flexible"] : []),
          ...(workplaces.office ? ["office"] : []),
        ],
      });
    }
  }, [workplaces, initial]);

  return (
    <Wrapper>
      <CustomSubtitle>Job Expectations</CustomSubtitle>
      <Subtitle>Workplace preference</Subtitle>
      <CheckBoxesGrid>
        <JobCheckbox
          checked={workplaces.remote}
          labelText="Remote"
          onClick={() => {
            setWorkplaces({
              ...workplaces,
              remote: !workplaces.remote,
            });
          }}
          readOnly={!editing}
        />
        <JobCheckbox
          checked={workplaces.flexible}
          labelText="Flexible"
          onClick={() => {
            setWorkplaces({
              ...workplaces,
              flexible: !workplaces.flexible,
            });
          }}
          readOnly={!editing}
        />
        <JobCheckbox
          checked={workplaces.office}
          labelText="In Office"
          onClick={() => {
            setWorkplaces({
              ...workplaces,
              office: !workplaces.office,
            });
          }}
          readOnly={!editing}
        />
      </CheckBoxesGrid>
      <Subtitle>Job Type</Subtitle>
      <CheckBoxesGrid>
        <JobCheckbox
          checked={jobTypes.permanent}
          labelText="Permanent"
          onClick={() => {
            setJobTypes({
              ...jobTypes,
              permanent: !jobTypes.permanent,
            });
          }}
          readOnly={!editing}
        />
        <JobCheckbox
          checked={jobTypes.contract}
          labelText="Contract"
          onClick={() => {
            setJobTypes({
              ...jobTypes,
              contract: !jobTypes.contract,
            });
          }}
          readOnly={!editing}
        />
        <JobCheckbox
          checked={jobTypes.temp}
          labelText="Temporary"
          onClick={() => {
            setJobTypes({
              ...jobTypes,
              temp: !jobTypes.temp,
            });
          }}
          readOnly={!editing}
        />
      </CheckBoxesGrid>
      <CheckBoxesGrid className="separator">
        {jobTypes.permanent && (
          <div>
            <Subtitle>Yearly Salary</Subtitle>
            {!editing ? (
              <>
                {tnProfile.salary_expectation ? (
                  <Content>
                    {company.currency?.currency_name}
                    {tnProfile.salary_expectation}
                  </Content>
                ) : (
                  <Content>{" - "}</Content>
                )}
              </>
            ) : (
              <RatesContainer>
                <div className="leo-flex">
                  <CurrencyIcon>{company.currency?.currency_name}</CurrencyIcon>
                  <input
                    type="number"
                    className="form-control"
                    style={{
                      borderRadius: "0 4px 4px 0",
                      width: "calc(100% - 40px)",
                    }}
                    value={tnProfile.salary_expectation}
                    onChange={(e) =>
                      setProfile({
                        ...tnProfile,
                        salary_expectation: e.target.value,
                      })
                    }
                  />
                </div>
              </RatesContainer>
            )}
          </div>
        )}
        {(jobTypes.contract || jobTypes.temp) && (
          <div>
            <Subtitle>Daily Rate</Subtitle>
            {!editing ? (
              <>
                {tnProfile.day_rate ? (
                  <Content>
                    {company.currency?.currency_name}
                    {tnProfile.day_rate}
                  </Content>
                ) : (
                  <Content>{" - "}</Content>
                )}
              </>
            ) : (
              <RatesContainer>
                <div className="flex">
                  <CurrencyIcon>{company.currency?.currency_name}</CurrencyIcon>
                  <input
                    type="number"
                    className="form-control"
                    style={{
                      borderRadius: "0 4px 4px 0",
                      width: "calc(100% - 40px)",
                    }}
                    value={tnProfile.day_rate}
                    onChange={(e) =>
                      setProfile({ ...tnProfile, day_rate: e.target.value })
                    }
                  />
                </div>
              </RatesContainer>
            )}
          </div>
        )}
        {jobTypes.temp && (
          <div>
            <Subtitle>Hourly Rate</Subtitle>
            {!editing ? (
              <>
                {tnProfile.hour_rate ? (
                  <Content>
                    {company.currency?.currency_name}
                    {tnProfile.hour_rate}
                  </Content>
                ) : (
                  <Content>{" - "}</Content>
                )}
              </>
            ) : (
              <RatesContainer>
                <div className="flex">
                  <CurrencyIcon>{company.currency?.currency_name}</CurrencyIcon>
                  <input
                    type="number"
                    className="form-control"
                    style={{
                      borderRadius: "0 4px 4px 0",
                      width: "calc(100% - 40px)",
                    }}
                    value={tnProfile.hour_rate}
                    onChange={(e) =>
                      setProfile({ ...tnProfile, hour_rate: e.target.value })
                    }
                  />
                </div>
              </RatesContainer>
            )}
          </div>
        )}
      </CheckBoxesGrid>
    </Wrapper>
  );
};

const CheckboxContainer = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex",
}))`
  align-items: baseline;
  margin-bottom: 10px;
  input {
    margin-right: 10px;
  }
`;

const RatesContainer = styled(CheckboxContainer)`
  display: block;
`;

const CurrencyIcon = styled.span.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-center",
}))`
  background: #eeeeee;
  border-radius: 6px 0px 0px 6px;
  width: 40px;
  height: 40px;
  padding: 12px;
`;

const CustomSubtitle = styled(Subtitle)`
  color: #74767b;
  font-size: 12px;
  margin-bottom: 10px;
  position: absolute;
  top: -16px;
  background: white;
  padding: 5px 10px;
  right: 0;
  margin-right: 20px;
`;
const Wrapper = styled.div`
  border: solid 1px #c4c4c4;
  padding: 10px;
  border-radius: 4px;
  position: relative;
  padding-top: 20px;
`;

const CheckBoxesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  width: min-content;
  width: 100%;
  margin-bottom: 10px;

  &.separator {
    margin-top: 10px;
    border-top: solid #eee 1px;
    padding-top: 10px;
    margin-bottom: 16px;
  }
`;

export default WorkInterestv2;
