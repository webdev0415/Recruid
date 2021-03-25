import React, { Fragment, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Select from "react-select";
import { StyledInput, StyledSelect, StyledCol } from "./CreateDealModal";
import { StyledDatePicker } from "components/Profiles/components/ProfileComponents.js";
import sharedHelpers from "helpers/sharedHelpers";
import InfoCard from "components/Profiles/components/InfoCard";
// import SearchAndSelect from "sharedComponents/ActionCreator/SearchAndSelect";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";

export default ({
  setNewDeal,
  newDeal,
  allPipelines,
  clientCompanyId,
  allCompaniesOptions,
  companyProfile,
  setCompanyProfile,
  contactId,
  store,
  companyContacts,
  setCompanyContacts,
  contactProfile,
  setContactProfile,
  // setAssociatedContacts,
  // associatedContacts
}) => {
  useEffect(() => {
    if (store.role && store.teamMembers) {
      store.teamMembers.map((member, index) => {
        if (member.team_member_id === store.role.team_member.team_member_id) {
          setNewDeal({
            ...newDeal,
            dealOwnerIndex: index,
          });
        }
        return null;
      });
    }
  }, [store.role, store.teamMembers]);
  // const [contactables, setContactables] = useState({});
  const handleSelectChange = (stateName) => (option) =>
    setNewDeal((deal) => ({ ...deal, [stateName]: option }));

  // useEffect(() => {
  //   if (companyContacts) {
  //     let provisional = {};
  //     if (companyContacts && companyContacts.length > 0) {
  //       provisional.contacts = [];
  //       companyContacts.map(cont =>
  //         provisional.contacts.push({
  //           name: cont.name,
  //           email: cont.email,
  //           source: "contact",
  //           source_id: cont.id,
  //           selected: companyContacts.length === 1 ? true : false
  //         })
  //       );
  //     }
  //     setContactables(provisional);
  //   }
  //
  // }, [companyContacts]);

  // useEffect(() => {
  //   let assCont = contactables?.contacts?.filter(
  //     cont => cont.selected === true
  //   );
  //   setAssociatedContacts(assCont);
  // }, [contactables, setAssociatedContacts]);

  return (
    <Fragment>
      <Row>
        <StyledCol className="left-padding">
          <label className="form-label form-heading form-heading-small">
            Deal Name
          </label>
          <StyledInput
            className="form-control"
            type={`text`}
            value={newDeal.name}
            onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
            placeholder={`Type in the deal name`}
          />
        </StyledCol>
        <StyledCol className="right-padding">
          <label className="form-label form-heading form-heading-small">
            Deal Value
          </label>
          <div className="leo-flex">
            <CurrencyIcon>{store.company.currency?.currency_name}</CurrencyIcon>
            <StyledInput
              style={{ borderRadius: "0px 6px 6px 0px" }}
              className="form-control"
              type={`text`}
              value={newDeal.deal_value}
              onChange={(e) =>
                setNewDeal({ ...newDeal, deal_value: e.target.value })
              }
              placeholder={`Type in the deal value`}
            />
          </div>
        </StyledCol>
      </Row>
      {(!newDeal.create_job ||
        (newDeal.pipelineIndex === undefined &&
          newDeal.deal_status === undefined)) && (
        <Row>
          <StyledCol className="left-padding">
            <label className="form-label form-heading form-heading-small">
              Pipeline
            </label>
            <StyledSelect
              name="pipeline"
              className="form-control form-control-select"
              value={
                newDeal.pipelineIndex !== undefined ? newDeal.pipelineIndex : ""
              }
              onChange={(e) =>
                setNewDeal({
                  ...newDeal,
                  pipelineIndex: e.target.value,
                })
              }
            >
              <option value="" disabled hidden>
                Please select a pipeline
              </option>
              {allPipelines &&
                allPipelines.length > 0 &&
                allPipelines.map((pipeline, index) => (
                  <React.Fragment key={`pipeline-${index}`}>
                    {!pipeline.archived && (
                      <option value={index}>{pipeline.name}</option>
                    )}
                  </React.Fragment>
                ))}
            </StyledSelect>
          </StyledCol>
          <StyledCol className="right-padding">
            <label className="form-label form-heading form-heading-small">
              Deal Stage
            </label>
            <StyledSelect
              name="deal"
              className="form-control form-control-select"
              value={newDeal.deal_status ? newDeal.deal_status.id : ""}
              onChange={(e) =>
                setNewDeal({
                  ...newDeal,
                  deal_status: allPipelines[
                    newDeal.pipelineIndex
                  ].stages.filter(
                    (stage) => stage.id === Number(e.target.value)
                  )[0],
                })
              }
            >
              <option value="" disabled hidden>
                Please select a status
              </option>
              {allPipelines &&
                allPipelines[newDeal.pipelineIndex] &&
                allPipelines[newDeal.pipelineIndex].stages &&
                allPipelines[newDeal.pipelineIndex].stages.length > 0 &&
                allPipelines[newDeal.pipelineIndex].stages.map(
                  (stage, index) => (
                    <option key={`stage-${index}`} value={stage.id}>
                      {stage.name}
                    </option>
                  )
                )}
            </StyledSelect>
          </StyledCol>
        </Row>
      )}
      <Row>
        <StyledCol className="left-padding">
          <label className="form-label form-heading form-heading-small">
            Close date
          </label>
          <div className="leo-flex" style={{ marginBottom: "30px" }}>
            <CalendarIcon>
              <img src={`${AWS_CDN_URL}/icons/DateIcon.svg`} alt="Date" />
            </CalendarIcon>
            <StyledDatePicker
              selected={newDeal.close_date}
              onChange={(close_date) => setNewDeal({ ...newDeal, close_date })}
              className="form-control"
            />
          </div>
        </StyledCol>
        <StyledCol className="right-padding">
          <label className="form-label form-heading form-heading-small">
            Create Date
          </label>
          <div className="leo-flex">
            <CalendarIcon>
              <img src={`${AWS_CDN_URL}/icons/DateIcon.svg`} alt="Date" />
            </CalendarIcon>
            <StyledDatePicker
              selected={newDeal.create_date}
              onChange={(create_date) =>
                setNewDeal({ ...newDeal, create_date })
              }
              className="form-control"
            />
          </div>
        </StyledCol>
      </Row>
      <Row>
        {!clientCompanyId ? (
          <StyledCol className="left-padding">
            <>
              <label className="form-label form-heading form-heading-small">
                Associated Company
              </label>
              <Select
                name="pipeline_selector"
                options={sharedHelpers.extractOptions(allCompaniesOptions)}
                onChange={handleSelectChange("selectedCompany")}
                placeholder="Associated Company"
                value={
                  newDeal.selectedCompany?.value
                    ? newDeal.selectedCompany
                    : undefined
                }
              />
              {companyProfile && (
                <CardHolder>
                  <InfoCard
                    light
                    header={companyProfile.name}
                    subText={companyProfile.domain}
                    avatar={companyProfile.avatar}
                    removeButton={() => {
                      setNewDeal({
                        ...newDeal,
                        selectedCompany: {
                          label: "",
                          value: null,
                        },
                        selectedContact: {
                          label: "",
                          value: null,
                        },
                      });
                      setCompanyProfile(undefined);
                      setContactProfile(undefined);
                      setCompanyContacts(undefined);
                    }}
                  />
                </CardHolder>
              )}
            </>
          </StyledCol>
        ) : (
          <StyledCol className="left-padding">
            {!contactId && (
              <>
                <label className="form-label form-heading form-heading-small">
                  Associated Contact
                </label>
                {/*<div className="leo-relative" ref={node}>
                  <button
                    className="button button--default button--blue-dark"
                    onClick={() => setShowDropdown(!showDrowdown)}
                  >
                    Add contact
                  </button>
                  {showDrowdown && (
                    <SearchAndSelect
                      store={store}
                      contactables={contactables}
                      setContactables={setContactables}
                      totalSelected={associatedContacts?.length || 0}
                      types={{ contacts: true }}
                    />
                  )}
                </div>*/}
                <Select
                  name="pipeline_selector"
                  options={sharedHelpers.extractOptions(companyContacts)}
                  onChange={handleSelectChange("selectedContact")}
                  placeholder="Associated Contact"
                  value={
                    newDeal.selectedContact?.value
                      ? newDeal.selectedContact
                      : undefined
                  }
                />
                {contactProfile && (
                  <CardHolder>
                    <InfoCard
                      light
                      header={contactProfile.name}
                      subText={contactProfile.title}
                      avatar={contactProfile.avatar}
                      removeButton={() => {
                        setNewDeal({
                          ...newDeal,
                          selectedContact: {
                            label: "",
                            value: null,
                          },
                        });
                        setContactProfile(undefined);
                      }}
                    />
                  </CardHolder>
                )}
              </>
            )}
          </StyledCol>
        )}
        {!clientCompanyId ? (
          <StyledCol className="right-padding">
            {!contactId && (
              <>
                <label className="form-label form-heading form-heading-small">
                  Associated Contact
                </label>
                {/*}<div className="leo-relative" ref={node}>
                  <button
                    className="button button--default button--blue-dark"
                    onClick={() => setShowDropdown(!showDrowdown)}
                  >
                    Add contact
                  </button>
                  {showDrowdown && (
                    <SearchAndSelect
                      store={store}
                      contactables={contactables}
                      setContactables={setContactables}
                      totalSelected={associatedContacts?.length || 0}
                      types={{ contacts: true }}
                    />
                  )}
                </div>*/}
                <Select
                  name="pipeline_selector"
                  options={sharedHelpers.extractOptions(companyContacts)}
                  onChange={handleSelectChange("selectedContact")}
                  placeholder="Associated Contact"
                  value={
                    newDeal.selectedContact?.value
                      ? newDeal.selectedContact
                      : undefined
                  }
                />
                {contactProfile && (
                  <CardHolder>
                    <InfoCard
                      light
                      header={contactProfile.name}
                      subText={contactProfile.title}
                      avatar={contactProfile.avatar}
                      removeButton={() => {
                        setNewDeal({
                          ...newDeal,
                          selectedContact: {
                            label: "",
                            value: null,
                          },
                        });
                        setContactProfile(undefined);
                      }}
                    />
                  </CardHolder>
                )}
              </>
            )}
          </StyledCol>
        ) : (
          <StyledCol className="right-padding">
            <label className="form-label form-heading form-heading-small">
              Deal Owner
            </label>
            <StyledSelect
              name="deal owner"
              className="form-control form-control-select"
              value={
                newDeal.dealOwnerIndex !== undefined
                  ? newDeal.dealOwnerIndex
                  : ""
              }
              onChange={(e) => {
                setNewDeal({
                  ...newDeal,
                  dealOwnerIndex: e.target.value,
                });
              }}
            >
              <option value="" disabled hidden>
                Please select a team member
              </option>
              {store.teamMembers.map((member, index) => (
                <>
                  {(member.permission === "owner" ||
                    member.roles.includes("business")) && (
                    <option key={`member-${index}`} value={index}>
                      {member.name}
                    </option>
                  )}
                </>
              ))}
            </StyledSelect>
          </StyledCol>
        )}
      </Row>
      {!clientCompanyId && (
        <Row>
          <StyledCol className="left-padding">
            <label className="form-label form-heading form-heading-small">
              Deal Owner
            </label>
            <StyledSelect
              name="deal owner"
              className="form-control form-control-select"
              value={
                newDeal.dealOwnerIndex !== undefined
                  ? newDeal.dealOwnerIndex
                  : ""
              }
              defaultMenuIsOpen
              onChange={(e) => {
                setNewDeal({
                  ...newDeal,
                  dealOwnerIndex: e.target.value,
                });
              }}
            >
              <option value="" disabled hidden>
                Please select a team member
              </option>
              {store.teamMembers.map((member, index) => (
                <>
                  {(member.permission === "owner" ||
                    member.roles.includes("business")) && (
                    <option key={`member-${index}`} value={index}>
                      {member.name}
                    </option>
                  )}
                </>
              ))}
            </StyledSelect>
          </StyledCol>
          <StyledCol className="right-padding"></StyledCol>
        </Row>
      )}
    </Fragment>
  );
};

const CardHolder = styled.div`
  margin-bottom: 30px;
  margin-top: -20px;
`;

const CalendarIcon = styled.span`
  background: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px 0px 0px 6px;
  width: 40px;
  height: 40px;
  padding: 12px;
`;

const CurrencyIcon = styled.span`
  background: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px 0px 0px 6px;
  width: 40px;
  height: 40px;
  padding: 12px;
`;
