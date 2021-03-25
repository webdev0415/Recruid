import React, { useEffect, useState, Fragment } from "react";
import { Row } from "react-bootstrap";
import Select from "react-select";
import styled from "styled-components";
import notify from "notifications";

import ImportCard from "sharedComponents/rds/ImportCard";
import { StyledInput, StyledCol } from "./CreateContactModal";

import { fetchClientCompanyProfile } from "helpers/crm/clientCompanies";
import sharedHelpers from "helpers/sharedHelpers";
import InfoCard from "components/Profiles/components/InfoCard";
import TagsComponent from "sharedComponents/TagsComponent";

export default ({
  newContact,
  setNewContact,
  handleEmailKeyUp,
  contactPreviewData,
  importExistingContact,
  handleContactImport,
  handleImportCancel,
  allCompanies,
  clientCompanyId,
  store,
}) => {
  const [companyProfile, setCompanyProfile] = useState(undefined);
  const allCompaniesOptions = allCompanies
    ? allCompanies.map((company) => ({
        name: company.company_name,
        id: company.client_id,
      }))
    : undefined;

  const allTeamMembersOptions = store.teamMembers
    ? store.teamMembers
        .filter(
          (member) =>
            member.permission === "owner" || member.roles.includes("business")
        )
        .map((member) => ({
          name: member.name,
          id: member.team_member_id,
        }))
    : undefined;

  useEffect(() => {
    if (newContact.company?.value) {
      fetchClientCompanyProfile(
        store.session,
        store.company.id,
        newContact.company.value
      ).then((res) => {
        if (!res.err) {
          setCompanyProfile(res);
        } else {
          notify("danger", "Unable to fetch company profile");
        }
      });
    }
  }, [newContact.company, store]);

  const handleSelectChange = (stateName) => (option) =>
    setNewContact((contact) => ({ ...contact, [stateName]: option }));

  return (
    <Fragment>
      <p style={{ textAlign: "left" }}>
        {`To get started, enter the contact's email to automatically populate
        their information.`}
      </p>
      <Row>
        <StyledCol className="left-padding">
          <label className="form-label form-heading form-heading-small">
            Contact Email
          </label>
          <StyledInput
            className="form-control"
            type={`text`}
            value={newContact.email}
            onChange={(e) =>
              setNewContact({ ...newContact, email: e.target.value })
            }
            onKeyUp={() => handleEmailKeyUp(newContact.email)}
            onPaste={(e) => {
              let target = e.target;
              setTimeout(function () {
                handleEmailKeyUp(target.value);
              }, 0);
            }}
            placeholder={`Type in the contact email`}
          />
        </StyledCol>
        <StyledCol className="right-padding">
          <label className="form-label form-heading form-heading-small">
            Contact Number
          </label>
          <StyledInput
            className="form-control"
            type={`text`}
            value={newContact.phone}
            onChange={(e) =>
              setNewContact({ ...newContact, phone: e.target.value })
            }
            placeholder={`Type in the contact phone number`}
          />
        </StyledCol>
      </Row>
      {!!contactPreviewData && importExistingContact === undefined && (
        <ImportCard
          rdsPreviewData={contactPreviewData}
          handleDataImport={handleContactImport}
          handleImportCancel={handleImportCancel}
        />
      )}
      {importExistingContact !== undefined && (
        <>
          <Row>
            <StyledCol className="left-padding">
              <label className="form-label form-heading form-heading-small">
                Contact Name
              </label>
              <StyledInput
                className="form-control"
                type={`text`}
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                placeholder={`Type in the contact name`}
              />
            </StyledCol>
            <StyledCol className="right-padding">
              <label className="form-label form-heading form-heading-small">
                Contact Title
              </label>
              <StyledInput
                className="form-control"
                type={`text`}
                value={newContact.title}
                onChange={(e) =>
                  setNewContact({ ...newContact, title: e.target.value })
                }
                placeholder={`Type in the contact title`}
              />
            </StyledCol>
          </Row>
          <Row>
            {!clientCompanyId && (
              <StyledCol className="left-padding">
                <>
                  <label className="form-label form-heading form-heading-small">
                    Associated Company
                  </label>
                  <Select
                    name="pipeline_selector"
                    options={sharedHelpers.extractOptions(allCompaniesOptions)}
                    onChange={handleSelectChange("company")}
                    placeholder="Client"
                    value={
                      newContact.company?.value ? newContact.company : undefined
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
                          setNewContact({
                            ...newContact,
                            company: {
                              label: "",
                              value: null,
                            },
                          });
                          setCompanyProfile(undefined);
                        }}
                      />
                    </CardHolder>
                  )}
                </>
              </StyledCol>
            )}
            <StyledCol
              className={!clientCompanyId ? "right-padding" : "left-padding"}
            >
              <label className="form-label form-heading form-heading-small">
                Contact Owner
              </label>
              <Select
                name="pipeline_selector"
                options={sharedHelpers.extractOptions(allTeamMembersOptions)}
                onChange={handleSelectChange("contactOwner")}
                placeholder="Client"
                value={newContact.contactOwner}
              />
            </StyledCol>
            {clientCompanyId && (
              <StyledCol className="right-padding"></StyledCol>
            )}
          </Row>
          <Row>
            <StyledCol className="left-padding">
              <label className="form-label form-heading form-heading-small">
                Industries
              </label>
              <TagsComponent
                type="industries"
                returnTags={(categorizations_attributes) =>
                  setNewContact({ ...newContact, categorizations_attributes })
                }
              />
            </StyledCol>
            <StyledCol className="right-padding">
              <label className="form-label form-heading form-heading-small">
                Skills
              </label>
              <TagsComponent
                type="skills"
                returnTags={(competencies_attributes) =>
                  setNewContact({
                    ...newContact,
                    competencies_attributes,
                  })
                }
              />
            </StyledCol>
          </Row>
          <Row>
            <StyledCol className="left-padding">
              <label className="form-label form-heading form-heading-small">
                Locations
              </label>
              <TagsComponent
                type="locations"
                returnTags={(localizations_attributes) =>
                  setNewContact({ ...newContact, localizations_attributes })
                }
              />
            </StyledCol>
          </Row>
        </>
      )}
    </Fragment>
  );
};

const CardHolder = styled.div`
  margin-bottom: 30px;
  margin-top: -20px;
`;
