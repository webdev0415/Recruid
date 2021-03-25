import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
import ToggleV3 from "sharedComponents/ToggleV3";
import {
  Title,
  SubTitle,
  ButtonsWrapper,
  ContentWrapper,
} from "components/TeamView/Customisation/sharedComponents";
import { fetchUpdateJobExtraFields } from "helpersV2/company";
import { ExpandButton } from "components/TeamView/Customisation/sharedComponents";
import AppButton from "styles/AppButton";
import Checkbox from "sharedComponents/Checkbox";

const JobExtraFields = () => {
  const store = useContext(GlobalContext);
  const [expand, setExpand] = useState(false);
  const [over, setOver] = useState(false);
  const [extraValues, setExtraValues] = useState({
    advertised_required: false,
    advertised_visible: false,
    budgeted_required: false,
    budgeted_visible: false,
    business_area_required: false,
    business_area_visible: false,
    department_required: false,
    department_visible: false,
    hire_type_required: false,
    hire_type_visible: false,
    po_reference_required: false,
    po_reference_visible: false,
    working_hours_required: false,
    working_hours_visible: false,
    work_pattern_required: false,
    work_pattern_visible: false,
  });

  useEffect(() => {
    if (store.job_extra_fields) {
      setExtraValues({
        ...store.job_extra_fields,
        id: undefined,
        company_id: undefined,
      });
    }
  }, [store.job_extra_fields]);

  const callUpdateExtraValues = () => {
    fetchUpdateJobExtraFields(
      store.session,
      store.job_extra_fields?.id,
      extraValues
    ).then((res) => {
      if (!res.err) {
        notify("info", "Extra fields succesfully updated");
        store.dispatch({
          type: "UPDATE_JOB_EXTRA_FIELDS",
          payload: res,
        });
      } else {
        notify("danger", res);
      }
    });
  };

  return (
    <>
      <div
        className="row"
        onMouseEnter={() => setOver(true)}
        onMouseLeave={() => setOver(false)}
      >
        <div className="col-md-12">
          <ContentWrapper>
            <Header>
              <div>
                <Title>Job Creation</Title>
                <SubTitle>
                  Select the extra fields you would like to have in your job
                  creation process.
                </SubTitle>
              </div>
              <ExpandButton expand={expand} setExpand={setExpand} />
            </Header>
            {expand && (
              <Body>
                <CheckContainers>
                  <GridTitle>Field</GridTitle>
                  <GridTitle style={{ paddingRight: "10px" }}>Active</GridTitle>
                  <GridTitle>Required</GridTitle>
                  {Object.entries(titleExchanger).map((field, index) => (
                    <>
                      <span className="option-title">{field[1]}</span>
                      <div
                        style={{ marginRight: "10px", marginVottom: "10px" }}
                      >
                        <ToggleV3
                          name={`toggle-val-${index}`}
                          toggle={() => {
                            let newValue = !extraValues[`${field[0]}_visible`];
                            let newFields = {
                              ...extraValues,
                              [`${field[0]}_visible`]: newValue,
                            };
                            if (!newValue) {
                              newFields[`${field[0]}_required`] = false;
                            }
                            setExtraValues(newFields);
                          }}
                          checked={extraValues[`${field[0]}_visible`]}
                        />
                      </div>
                      <div
                        style={{ marginRight: "10px", marginVottom: "10px" }}
                      >
                        <Checkbox
                          active={extraValues[`${field[0]}_required`]}
                          onClick={() =>
                            setExtraValues({
                              ...extraValues,
                              [`${field[0]}_required`]: !extraValues[
                                `${field[0]}_required`
                              ],
                            })
                          }
                          style={{ margin: "auto" }}
                          size="large"
                          disabled={!extraValues[`${field[0]}_visible`]}
                        />
                      </div>
                    </>
                  ))}
                </CheckContainers>
                {over && (
                  <ButtonsWrapper>
                    <AppButton
                      theme="grey"
                      size="small"
                      onClick={() => setExtraValues(store.job_extra_fields)}
                    >
                      Cancel
                    </AppButton>
                    <AppButton
                      theme="primary"
                      size="small"
                      onClick={() => callUpdateExtraValues()}
                    >
                      Save
                    </AppButton>
                  </ButtonsWrapper>
                )}
              </Body>
            )}
          </ContentWrapper>
        </div>
      </div>
    </>
  );
};

export default JobExtraFields;

const titleExchanger = {
  advertised: "Advertised",
  budgeted: "Budgeted/Non Budgeted",
  business_area: "Business Area",
  department: "Department",
  hire_type: "Hire Type",
  po_reference: "PO. Reference",
  working_hours: "Working Hours",
  work_pattern: "Work Pattern",
};

const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  position: relative;
  width: 100%;
`;

const Body = styled.div`
  position: relative;
  margin-bottom: 40px;
`;

const CheckContainers = styled.div`
  width: 500px;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  padding: 15px 20px;
  display: grid;
  grid-template-columns: 1fr auto auto;

  .option-title {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #74767b;
    margin-right: 10px;
    margin-bottom: 15px;
  }
`;

const GridTitle = styled.span`
  color: #999;
  border-bottom: solid 1px #eee;
  padding-bottom: 5px;
  margin-bottom: 10px;
`;
