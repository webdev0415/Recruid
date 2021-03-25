import React, { Fragment, useState } from "react";
import { Redirect } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
// Components
import TagsComponent from "sharedComponents/TagsComponent";
import VendorContacts from "./VendorContacts";
import UniversalModal, {
  ModalHeaderClassic,
  ModalBody,
  ModalFooter,
} from "modals/UniversalModal/UniversalModal";
import { ROUTES } from "routes";
// Constants
import { API_ROOT_PATH } from "constants/api";

const ModalContent = styled.div`
  margin: 0px auto;
  max-width: 800px;
  min-height: 450px;
  padding-top: 50px;
  padding-bottom: 20px;
`;

const TabContainer = styled.div`
  border-bottom: 1px solid #eee;
  box-shadow: none !important;
  display: flex;
  justify-content: center;
  margin: 0 !important;
  /* padding-top: 10px; */
  position: absolute;
  width: 100%;

  li {
    margin-right: 30px;

    &:last-child {
      margin: 0;
    }
  }
`;

const EditVendorProfile = ({
  vendor,
  session,
  closeModal,
  vendorId,
  company,
  handleHardDelete,
  companyTag,
  archiveCompany,
  fetchVendorData,
}) => {
  const hasProperty = (obj, prop) => {
    if (obj.hasOwnProperty(prop)) {
      return obj[prop];
    } else return ``;
  };
  const initialContact = {
    name: "",
    email: "",
    title: "",
    phone: "",
  };
  const [viewMode, setViewMode] = useState(`initial`);
  const [name, setName] = useState(hasProperty(vendor, `name`));
  const [mainEmail, setMainEmail] = useState(hasProperty(vendor, `email`));
  const mentionTag = hasProperty(vendor, `mention_tag`);
  const [mainPhone, setMainPhone] = useState(hasProperty(vendor, `main_phone`));
  const [tagsData, setTagsData] = useState({
    competencies_attributes: [],
    categorizations_attributes: [],
    localizations_attributes: vendor.localizations_attributes || [],
  });
  const [contacts, setContacts] = useState(
    hasProperty(vendor, `client_contacts`)
  );
  const [newContact, setNewContact] = useState(initialContact);
  const [deleteCompany, setDeleteCompany] = useState(false);
  const [redirectToClients, setRedirectToClients] = useState(false);

  const handleProfileEdit = async () => {
    const {
      competencies_attributes,
      categorizations_attributes,
      localizations_attributes,
    } = tagsData;
    const requestBody = {
      name,
      competencies_attributes,
      categorizations_attributes,
      localizations_attributes,
      main_email: mainEmail,
      mention_tag: mentionTag,
      main_phone: mainPhone,
      client_contacts_attributes: contacts,
      company_id: company.id,
    };
    const url = `${API_ROOT_PATH}/v1/vendors/update_vendor/${vendorId}`;
    const params = {
      method: `PUT`,
      headers: session,
      body: JSON.stringify(requestBody),
    };
    try {
      const postData = await fetch(url, params);
      return await postData.json();
    } catch (err) {
      console.error(`Error saving prfile changes: ${err}`);
    } finally {
      let subject = company.type === `Employer` ? `vendors` : `clients`;
      fetchVendorData(subject, company, vendorId, session);
      closeModal();
    }
  };

  function deleteCallBack() {
    setRedirectToClients(true);
    closeModal();
  }

  const companyType = company.type === "Employer" ? "Agency" : "Client";

  return (
    <UniversalModal
      show={true}
      hide={closeModal}
      id={"EditVendorProfile"}
      width={960}
    >
      <ModalHeaderClassic
        title={`Edit ${company.type === "Employer" ? "Agency" : "Client"}`}
        closeModal={closeModal}
      />
      <ModalBody>
        <TabContainer>
          <ul className="nav nav-pills nav-fill">
            <li
              className={`nav-item nav-link ${
                viewMode === "initial" && "active"
              }`}
            >
              <button onClick={() => setViewMode(`initial`)}>Profile</button>
            </li>
            <li
              className={`nav-item nav-link ${
                viewMode === "contacts" && "active"
              }`}
            >
              <button onClick={() => setViewMode(`contacts`)}>Contacts</button>
            </li>
          </ul>
        </TabContainer>
        <ModalContent
          paddingstyle={{ overflowY: `scroll`, maxHeight: `500px` }}
        >
          {viewMode === "initial" && (
            <Fragment>
              <Row>
                <Col sm={6}>
                  <label className="form-label form-heading form-heading-small">
                    {companyType} Name
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    placeholder="eg. Acme or Acme Design"
                    onChange={(event) => setName(event.target.value)}
                    value={name}
                    required
                  />
                </Col>
                <Col sm={6}>
                  <label className="form-label form-heading form-heading-small">
                    Locations
                  </label>
                  <TagsComponent
                    type="locations"
                    originalTags={vendor.localizations_attributes}
                    returnTags={(localizations_attributes) =>
                      setTagsData({
                        ...tagsData,
                        localizations_attributes,
                      })
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <label className="form-label form-heading form-heading-small">
                    {companyType} Industries
                  </label>
                  <TagsComponent
                    type="industries"
                    originalTags={vendor.categorizations_attributes}
                    returnTags={(categorizations_attributes) =>
                      setTagsData({
                        ...tagsData,
                        categorizations_attributes,
                      })
                    }
                  />
                </Col>
                <Col sm={6}>
                  <label className="form-label form-heading form-heading-small">
                    Skills they hire for
                  </label>
                  <TagsComponent
                    type="skills"
                    originalTags={vendor.competencies_attributes}
                    returnTags={(competencies_attributes) =>
                      setTagsData({ ...tagsData, competencies_attributes })
                    }
                  />
                </Col>
              </Row>
              <Row>
                {deleteCompany ? (
                  <>
                    <Col md={6}>
                      <label className="form-label form-heading form-heading-small">
                        Are you sure? This will remove all their data.
                        {!vendor.archived &&
                          "You can archive instead and keep their data."}
                      </label>
                      <button
                        style={{ marginRight: `10px` }}
                        className={`button button--default button--blue-dark`}
                        onClick={() => handleHardDelete(deleteCallBack)}
                      >
                        Confirm Delete
                      </button>
                      {!vendor.archived && (
                        <button
                          className={`button button--default button--grey`}
                          onClick={archiveCompany}
                        >
                          Archive{" "}
                          {company.type === "Employer" ? "Agency" : "Client"}{" "}
                        </button>
                      )}
                    </Col>
                  </>
                ) : (
                  <Col md={6}>
                    <label className="form-label form-heading form-heading-small">
                      Remove {company.type === "Employer" ? "Agency" : "Client"}{" "}
                      and all their data.
                    </label>
                    <button
                      onClick={() => setDeleteCompany(true)}
                      className={`button button--default button--grey-light`}
                    >
                      Delete {company.type === "Employer" ? "Agency" : "Client"}
                    </button>
                  </Col>
                )}
                {redirectToClients && (
                  <Redirect to={ROUTES.Vendors.url(companyTag)} />
                )}
              </Row>
            </Fragment>
          )}
          {viewMode === `contacts` && (
            <VendorContacts
              contacts={contacts}
              setContacts={setContacts}
              newContact={newContact}
              setNewContact={setNewContact}
              initialContact={initialContact}
              setMainEmail={setMainEmail}
              setMainPhone={setMainPhone}
              mainEmail={mainEmail}
              mainPhone={mainPhone}
            />
          )}
        </ModalContent>
      </ModalBody>
      <ModalFooter hide={closeModal}>
        <button
          className={`button button--default button--blue-dark`}
          onClick={handleProfileEdit}
        >
          Save
        </button>
      </ModalFooter>
    </UniversalModal>
  );
};

export default EditVendorProfile;
