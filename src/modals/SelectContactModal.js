import React, { useState, useEffect, useContext, useRef } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
import UniversalModal, {
  ModalFooter,
  ModalHeaderClassic,
  ModalBody,
} from "modals/UniversalModal/UniversalModal";

import CreateContactBody from "modals/CreateContactModal/CreateContactBody";
import SearchContactBody from "modals/CreateContactModal/SearchContactBody";

import Col from "react-bootstrap/Col";
import styled from "styled-components";
import { createNewContact } from "helpers/crm/contacts";
import { fetchCompanyContacts } from "helpers/crm/clientCompanies";

import {
  getPersonsPreviewData,
  getPersonsImportData,
} from "helpers/rds/rds.helpers";
import { AWS_CDN_URL } from "constants/api";
import Spinner from "sharedComponents/Spinner";

const SelectContactModal = ({
  show,
  hide,
  clientCompanyId,
  setEmailContact,
}) => {
  const store = useContext(GlobalContext);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    company: {
      label: "",
      value: null,
    },
    contactOwner: {
      label: "",
      value: null,
    },
  });
  const [modalView, setModalView] = useState("search");
  const [contacts, setContacts] = useState(undefined);
  const [importExistingContact, setImportExistingContact] = useState(undefined);
  const [contactPreviewData, setContactPreviewData] = useState(null);
  const [rdsLoading, setRdsLoading] = useState(false);
  const requestTimeout = useRef(null);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedContact, setSelectedContact] = useState();

  const createContact = () => {
    if (!newContact.email) {
      alert("Please add an email.");
      return;
    }
    if (!newContact.name) {
      alert("Please fill in the name of the contact.");
      return;
    }
    // create a new contact
    createNewContact(store.session, {
      agency_id: store.company.id,
      deal_contact: {
        name: newContact.name,
        email: newContact.email,
        number: newContact.phone,
        title: newContact.title,
        owner_id: newContact.contactOwner?.value,
        company_id: clientCompanyId,
      },
    }).then((res) => {
      if (!res.err) {
        notify("info", "New contact created");
        setEmailContact(res);
        hide();
      } else {
        notify("danger", "Unable to create contact");
      }
    });
  };

  useEffect(() => {
    if (clientCompanyId && store.company && store.session) {
      fetchCompanyContacts(
        store.session,
        clientCompanyId,
        store.company.id
      ).then((res) => {
        if (!res.err) {
          setContacts(res);
        } else {
          notify("danger", "Unable to fetch contacts");
        }
      });
    }
  }, [clientCompanyId, store.company, store.session]);

  useEffect(() => {
    if (contacts) {
      if (contacts.length > 0) {
        setSearchResult(contacts);
      } else {
        setModalView("create");
      }
    }
  }, [contacts]);

  //RESET THE STATUS IF THE PIPELINE IS CHANGED TO AVOID CONFLICTS
  useEffect(() => {
    if (newContact.pipelineIndex) {
      setNewContact({ ...newContact, deal_status: undefined });
    }
  }, [newContact.pipelineIndex]);

  //SET THE OWNER TO BE THE CURRENT USER FOR DEFAULT
  useEffect(() => {
    if (store.role && store.teamMembers) {
      store.teamMembers.map((member) => {
        if (member.team_member_id === store.role.team_member.team_member_id) {
          setNewContact({
            ...newContact,
            contactOwner: {
              label: member.name,
              value: member.team_member_id,
            },
          });
        }
        return null;
      });
    }
  }, [store.role, store.teamMembers]);

  const handleDelayedEmailReq = (email) => async () => {
    setRdsLoading(true);
    const previewData = await getPersonsPreviewData(email);
    if (!previewData.error) {
      setRdsLoading(false);
      return setContactPreviewData(previewData);
    }
    setRdsLoading(false);
    return setImportExistingContact(false);
  };

  const handleEmailKeyUp = (emailInput) => {
    if (emailInput.length < 4 || !emailInput.includes("@")) return false;
    clearTimeout(requestTimeout.current);
    requestTimeout.current = setTimeout(
      handleDelayedEmailReq(emailInput),
      1500
    );
  };

  const handleContactImport = (id) => async () => {
    const importData = await getPersonsImportData(id);
    if (!importData.error) {
      setNewContact((contact) => ({
        ...contact,
        name: importData.name || "",
        title: importData.experience?.[0]?.title,
      }));
      return setImportExistingContact(true);
    }
  };

  const handleImportCancel = () => setImportExistingContact(false);

  const handleModalViewChange = (modalView) => () => setModalView(modalView);

  // const inviteClientCompany = (newContactId) => {
  //   if (selectedContact === undefined && newContactId === undefined) {
  //     notify("danger", "Please select a contact");
  //     return;
  //   }
  //   inviteClientToPlatform(
  //     store.session,
  //     store.company.id,
  //     clientCompanyId,
  //     selectedContact || newContactId
  //   ).then((res) => {
  //     if (!res.err) {
  //       notify("info", "Company invited to platform");
  //       hide();
  //     } else {
  //       notify("danger", res);
  //     }
  //   });
  // };

  const checkAddContact = () => {
    if (selectedContact) {
      let match;
      contacts.map((cont) =>
        cont.id === selectedContact ? (match = cont) : null
      );
      setEmailContact(match);
      hide();
    } else {
      notify("danger", "You must select a contact first");
    }
  };

  return (
    <UniversalModal
      show={show}
      hide={hide}
      id={"create-contact-modal"}
      width={modalView === "create" ? 960 : 240}
    >
      {rdsLoading && (
        <StyledLoader>
          <Spinner />
        </StyledLoader>
      )}
      <ModalHeaderClassic
        title={
          modalView === "create"
            ? "Create Contact to Email"
            : "Select Contact to Email"
        }
        closeModal={hide}
      />
      <STModalBody>
        {modalView === "create" ? (
          <CreateContactBody
            newContact={newContact}
            setNewContact={setNewContact}
            handleEmailKeyUp={handleEmailKeyUp}
            contactPreviewData={contactPreviewData}
            importExistingContact={importExistingContact}
            handleContactImport={handleContactImport}
            handleImportCancel={handleImportCancel}
            clientCompanyId={clientCompanyId}
            store={store}
          />
        ) : (
          <>
            <SearchContactBody
              handleSearchInputChange={() => {}}
              handleModalViewChange={handleModalViewChange}
              onContactSelect={(id) => setSelectedContact(id)}
              searchResult={searchResult}
              parentActiveId={selectedContact}
              hideSearch={true}
            />
          </>
        )}
      </STModalBody>
      <ModalFooter hide={hide}>
        {(selectedContact || newContact.email) && (
          <>
            {modalView === "create" ? (
              <>
                {importExistingContact !== undefined && (
                  <button
                    id="forward"
                    className="button button--default button--blue-dark"
                    onClick={createContact}
                  >
                    Create and select
                  </button>
                )}
              </>
            ) : (
              <button
                id="forward"
                className="button button--default button--blue-dark"
                onClick={() => checkAddContact()}
              >
                Select
              </button>
            )}
          </>
        )}
      </ModalFooter>
    </UniversalModal>
  );
};

export default SelectContactModal;

const STModalBody = styled(ModalBody)`
  padding: 50px 80px !important;
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
`;

export const StyledInput = styled.input`
  margin-bottom: 20px !important;
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

export const StyledCol = styled(Col)`
  text-align: left;

  &.left-padding {
    padding-right: 40px;
  }
  &.right-padding {
    padding-left: 40px;
  }
`;
export const StyledSelect = styled.select`
  margin-bottom: 20px !important;
`;
