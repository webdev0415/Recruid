import React, { useState, useEffect, useContext, useRef } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Select from "react-select";
import TagsComponent from "sharedComponents/TagsComponent";

import UniversalModal, {
  ModalFooter,
  ModalBody,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";

import modalStyles from "assets/stylesheets/scss/collated/modals.module.scss";
import styled from "styled-components";
import InfoCard from "components/Profiles/components/InfoCard";
import { fetchCreateCompany } from "helpers/crm/clientCompanies";
import { fetchAllContacts, fetchContactProfile } from "helpers/crm/contacts";
// import SearchAndSelect from "sharedComponents/ActionCreator/SearchAndSelect";
import Collaborators from "components/Collaborators";

import { getCompanyRdsData } from "helpers/rds/rds.helpers";
import sharedHelpers from "helpers/sharedHelpers";
import { AWS_CDN_URL } from "constants/api";
import Spinner from "sharedComponents/Spinner";

const staticColl = [];

const CreateClientCompanyModal = ({ show, hide, setTriggerUpdate }) => {
  const store = useContext(GlobalContext);
  const [allContacts, setAllContacts] = useState(undefined);
  const [existingCompany, setExistingCompany] = useState(undefined);
  const [
    shouldImportExistingCompany,
    setShouldImportExistingCompany,
  ] = useState(undefined);
  const [newCompany, setNewCompany] = useState({
    name: "",
    domain: "",
    industry: undefined,
    size: undefined,
    locality: undefined,
    profiles: undefined,
    collaborators: undefined,
    companyOwner: {
      label: "",
      value: null,
    },
    contact: {
      label: "",
      value: null,
    },
  });
  const [rdsLoading, setRdsLoading] = useState(false);
  const requestTimeout = useRef(null);
  // const [allTeamMemberOptions, setAllTeamMemberOptions] = useState(undefined);
  const [contactProfile, setContactProfile] = useState(undefined);
  const [pending, setPending] = useState(false);
  // const [contactables, setContactables] = useState({});
  // const [associatedContacts, setAssociatedContacts] = useState(undefined);

  // useEffect(() => {
  //   if (allContacts) {
  //     let provisional = {};
  //     if (allContacts && allContacts.length > 0) {
  //       provisional.contacts = [];
  //       allContacts.map(cont =>
  //         provisional.contacts.push({
  //           name: cont.name,
  //           email: cont.email,
  //           source: "contact",
  //           source_id: cont.id,
  //           selected: allContacts.length === 1 ? true : false
  //         })
  //       );
  //     }
  //     setContactables(provisional);
  //   }
  //
  // }, [allContacts]);

  // useEffect(() => {
  //   let assCont = contactables?.contacts?.filter(
  //     cont => cont.selected === true
  //   );
  //   setAssociatedContacts(assCont);
  // }, [contactables]);

  // useEffect(() => {
  //   if (store.teamMembers) {
  //     setAllTeamMemberOptions(
  //       store.teamMembers
  //         .filter(
  //           (member) =>
  //             member.permission === "owner" || member.roles.includes("business")
  //         )
  //         .map((member) => ({
  //           name: member.name,
  //           id: member.team_member_id,
  //         }))
  //     );
  //   }
  // }, [store.teamMembers]);

  const createCompany = () => {
    if (!newCompany.name) {
      alert("Please fill in the name of the company.");
      return;
    }
    setPending(true);
    //create a new contact
    fetchCreateCompany(store.session, store.company.id, {
      agency_id: store.company.id,
      name: newCompany.name,
      offline: true,
      domain: newCompany.domain,
      // contact_ids:
      //   associatedContacts?.length > 0
      //     ? associatedContacts.map(cont => cont.source_id)
      //     : undefined,
      contact_id: newCompany.contact?.value,
      owner_id: newCompany.companyOwner?.value,
      // industry: newCompany?.industry ?? null,
      size: newCompany?.size ?? null,
      profiles: newCompany?.profiles ?? null,
      // locality: newCompany?.locality ?? null,
      competencies_attributes: newCompany.competencies_attributes || null,
      categorizations_attributes: newCompany.categorizations_attributes || null,
      localizations_attributes: newCompany.localizations_attributes || null,
      client_layer: {},
      collaborators: newCompany.collaborators
        ? newCompany.collaborators.create
        : undefined,
    }).then((res) => {
      if (!res.err) {
        if (res.message) {
          notify("warning", res.message);
          return hide();
        }
        notify("info", "Company successfully created");
        setTriggerUpdate(Math.random());
        hide();
      } else {
        setPending(false);
        notify("danger", "Unable to create company");
      }
    });
    setTriggerUpdate(Math.random());
    hide();
  };

  //SET THE OWNER TO BE THE CURRENT USER FOR DEFAULT
  useEffect(() => {
    if (store.role && store.teamMembers) {
      store.teamMembers.map((member) => {
        if (member.team_member_id === store.role.team_member.team_member_id) {
          setNewCompany({
            ...newCompany,
            companyOwner: {
              label: member.name,
              value: member.team_member_id,
            },
          });
        }
        return null;
      });
    }
  }, [store.role, store.teamMembers]);

  //FETCH ALL COMPANIES AND SET THEM
  useEffect(() => {
    if (!allContacts) {
      fetchAllContacts(store.session, {
        get_all: true,
        company_id: store.company.id,
      }).then((res) => {
        if (!res.err) {
          setAllContacts(res);
        } else {
          notify("danger", "Unable to fetch contacts");
        }
      });
    }
  }, [allContacts, store.company, store.session]);

  //CHECK IF COMPANY ALREADY EXISTS
  // useEffect(() => {
  //   if (newCompany.domain.length > 4) {
  //     searchExistingCompanies(
  //       store.session,
  //       store.company.id,
  //       newCompany.domain
  //     ).then(res => {
  //       if (!res.err) {
  //         setExistingCompany(res);
  //       }
  //     });
  //     setExistingCompany(mockCompany);
  //   } else {
  //     setExistingCompany(undefined);
  //   }
  //
  // }, [newCompany.domain]);

  // const importContact = () => {
  //   //import contact from existing company data
  //   importCompanyFromDatabase(
  //     store.session,
  //     store.company.id,
  //     existingCompany
  //   ).then(res => {
  //     if (!res.err) {
  //       notify("info", "Company successfully imported");
  //       setTriggerUpdate();
  //       hide();
  //     } else {
  //       notify("danger", "Unable to import company from database");
  //     }
  //   });
  // };

  const handleDelayedDomainReq = (domain) => async () => {
    if (domain.length < 4) return false;
    setRdsLoading(true);
    const rdsData = await getCompanyRdsData(domain);
    if (!rdsData.error) {
      setRdsLoading(false);
      return setExistingCompany((company) => ({
        ...company,
        name: rdsData?.name,
        domain: rdsData?.domain,
        industry: rdsData?.industry,
        size: rdsData?.size_range,
        locality: rdsData?.locality,
        linkedin_url: rdsData?.linkedin_url,
      }));
    }
    handleImportCancel();
    setRdsLoading(false);
    return importExistingCompany(false);
  };

  const handleDomainKeyUp = (domain) => {
    if (domain.length < 4) return false;
    clearTimeout(requestTimeout.current);
    requestTimeout.current = setTimeout(handleDelayedDomainReq(domain), 1500);
  };

  const importExistingCompany = (companyData) => () => {
    setNewCompany((company) => ({
      ...company,
      name: companyData?.name,
      domain: companyData?.domain,
      industry: companyData?.industry,
      size: companyData?.size,
      locality: companyData?.locality,
      profiles: {
        network: "linkedin",
        url: companyData?.linkedin_url,
      },
    }));
    setExistingCompany(null);
    return setShouldImportExistingCompany(companyData ? true : false);
  };

  const handleImportCancel = () => setShouldImportExistingCompany(false);

  const handleSelectChange = (stateName) => (option) =>
    setNewCompany((company) => ({ ...company, [stateName]: option }));

  useEffect(() => {
    if (newCompany.contact?.value) {
      fetchContactProfile(
        store.session,
        newCompany.contact.value,
        store.company.id
      ).then((res) => {
        if (!res.err) {
          setContactProfile(res);
        } else {
          notify("danger", "Unable to fetch contact profile");
        }
      });
    }
  }, [newCompany.contact, store]);

  return (
    <UniversalModal
      show={show}
      hide={hide}
      id={"create-client-company"}
      width={960}
    >
      {rdsLoading && (
        <StyledLoader>
          <Spinner />
        </StyledLoader>
      )}
      <ModalHeaderClassic title="Create Company" closeModal={hide} />
      <STModalBody>
        <div className="body-wrapper">
          <p style={{ textAlign: "left" }}>
            To get started, type in a company URL to automatically populate the
            company information.
          </p>
          <Row>
            <StyledCol className="left-padding">
              <label className="form-label form-heading form-heading-small">
                Company Domain
              </label>
              <StyledInput
                className="form-control"
                type={`text`}
                value={newCompany.domain}
                onKeyUp={() => handleDomainKeyUp(newCompany.domain)}
                onPaste={(e) => {
                  let target = e.target;
                  setTimeout(function () {
                    handleDomainKeyUp(target.value);
                  }, 0);
                }}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, domain: e.target.value })
                }
                placeholder={`Type in the contact domain`}
              />
            </StyledCol>
            <StyledCol className="right-padding">
              <label className="form-label form-heading form-heading-small">
                Company Name
              </label>
              <StyledInput
                className="form-control"
                type={`text`}
                value={newCompany.name}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, name: e.target.value })
                }
                style={{ textTransform: "capitalize" }}
                placeholder={`Type in the company name.`}
              />
            </StyledCol>
          </Row>
          {existingCompany && shouldImportExistingCompany === undefined && (
            <ExistingContainer>
              <p>
                {`We've found the following company in our database, would you
                like to import it?`}
              </p>
              <InfoCard
                light
                header={existingCompany.name}
                subText={existingCompany.domain}
                avatar={existingCompany.avatar_url}
                editing={false}
                deleteCard={() => {}}
              />
              <div
                className={modalStyles.modalFooter}
                style={{ justifyContent: "start" }}
              >
                <button
                  id="back"
                  className="button button--default button--grey-light"
                  onClick={handleImportCancel}
                >
                  Create New
                </button>
                <button
                  id="forward"
                  className="button button--default button--blue-dark"
                  onClick={importExistingCompany(existingCompany)}
                >
                  Import
                </button>
              </div>
            </ExistingContainer>
          )}
          {shouldImportExistingCompany !== undefined && (
            <>
              <Row>
                <StyledCol className="left-padding">
                  {allContacts && (
                    <>
                      <label className="form-label form-heading form-heading-small">
                        Associated Contact
                      </label>
                      <Select
                        name="pipeline_selector"
                        options={sharedHelpers.extractOptions(allContacts)}
                        onChange={handleSelectChange("contact")}
                        placeholder="Contact"
                        value={
                          newCompany.contact?.value
                            ? newCompany.contact
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
                              setNewCompany({
                                ...newCompany,
                                contact: {
                                  label: "",
                                  value: null,
                                },
                              });
                              setContactProfile(undefined);
                            }}
                          />
                        </CardHolder>
                      )}
                      {/*}<div  ref={node}>
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
                    </>
                  )}
                </StyledCol>
                <StyledCol className="right-padding">
                  <label className="form-label form-heading form-heading-small">
                    Client Collaborators
                  </label>
                  <Collaborators
                    collaborators={staticColl}
                    edit={true}
                    store={store}
                    setNewCollaborators={(collaborators) =>
                      setNewCompany({ ...newCompany, collaborators })
                    }
                  />

                  {/*}<Select
                  name="pipeline_selector"
                  options={sharedHelpers.extractOptions(allTeamMemberOptions)}
                  onChange={handleSelectChange("companyOwner")}
                  placeholder="Contact"
                  value={newCompany.companyOwner}
                />*/}
                </StyledCol>
              </Row>
              <Row>
                <StyledCol className="left-padding">
                  <label className="form-label form-heading form-heading-small">
                    Industries
                  </label>
                  <TagsComponent
                    type="industries"
                    originalTags={newCompany.industries || undefined}
                    returnTags={(categorizations_attributes) =>
                      setNewCompany({
                        ...newCompany,
                        categorizations_attributes,
                      })
                    }
                  />
                </StyledCol>
                <StyledCol className="right-padding">
                  <label className="form-label form-heading form-heading-small">
                    Skills Hiring for
                  </label>
                  <TagsComponent
                    type="skills"
                    originalTags={newCompany.skills || undefined}
                    returnTags={(competencies_attributes) =>
                      setNewCompany({
                        ...newCompany,
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
                    originalTags={newCompany.locations || undefined}
                    returnTags={(localizations_attributes) =>
                      setNewCompany({
                        ...newCompany,
                        localizations_attributes,
                      })
                    }
                  />
                </StyledCol>
              </Row>
            </>
          )}
        </div>
      </STModalBody>
      <ModalFooter hide={hide}>
        {(existingCompany || shouldImportExistingCompany !== undefined) && (
          <button
            id="forward"
            className="button button--default button--blue-dark"
            onClick={createCompany}
            disabled={pending}
          >
            Create
          </button>
        )}
      </ModalFooter>
    </UniversalModal>
  );
};

export default CreateClientCompanyModal;

const STModalBody = styled(ModalBody)`
  .body-wrapper {
    padding: 50px 80px;
    text-align: center;

    .Select {
      .Select-control {
        background: url(${AWS_CDN_URL}/icons/icon-chevron-small.svg) center
          right 15px no-repeat #fff !important;
        border: 0 !important;
        box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.05),
          inset 0 0 0 1px rgba(0, 0, 0, 0.1);
      }

      .Select-value-label {
        font-size: 14px;
      }

      .Select-input > input {
        padding: 10px 0;
      }

      .Select-arrow {
        display: none;
      }

      .Select-menu-outer {
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.15);
        box-shadow: 0 0 8px 3px rgba(0, 0, 0, 0.03);
        font-size: 14px !important;
      }

      .Select-option {
        &:hover,
        &.is-focused {
          // composes: global(background-border-color);
          background: #eee;
        }
      }

      .Select-option.is-selected {
        background: transparent;

        &:hover,
        &.is-focused {
          // composes: global(background-border-color);
          background: #eee;
        }
      }

      &.is-focused {
        .Select-control {
          // box-shadow: none !important;
          box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.05),
            inset 0 0 0 1px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
`;

const StyledInput = styled.input`
  margin-bottom: 20px !important;
`;

const StyledCol = styled(Col)`
  text-align: left;

  &.left-padding {
    padding-right: 40px;
  }
  &.right-padding {
    padding-left: 40px;
  }
`;

const ExistingContainer = styled.div`
  text-align: left;
  width: 60%;
`;

const StyledLoader = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease-in-out;
`;

const CardHolder = styled.div`
  margin-bottom: 30px;
  margin-top: -20px;
`;
