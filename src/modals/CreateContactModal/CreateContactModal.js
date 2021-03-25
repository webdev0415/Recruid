import React, { useState, useEffect, useContext, useRef } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
import UniversalModal, {
  ModalFooter,
  ModalBody,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";

import CreateContactBody from "./CreateContactBody";
import SearchContactBody from "./SearchContactBody";

import Col from "react-bootstrap/Col";

import styled from "styled-components";
import { createNewContact } from "helpers/crm/contacts";
import {
  fetchAllCompanies,
  assignContactsToClient,
} from "helpers/crm/clientCompanies";
import { fetchAllContacts } from "helpers/crm/contacts";
import { assignContactsToDeal } from "helpers/crm/deals";

import {
  getPersonsPreviewData,
  getPersonsImportData,
} from "helpers/rds/rds.helpers";
import { AWS_CDN_URL } from "constants/api";
import Spinner from "sharedComponents/Spinner";

const CreateContactModal = ({
  show,
  hide,
  setTriggerUpdate,
  dealId,
  clientCompanyId,
}) => {
  const store = useContext(GlobalContext);
  const [allCompanies, setAllCompanies] = useState(undefined);
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

  const [importExistingContact, setImportExistingContact] = useState(undefined);
  const [contactPreviewData, setContactPreviewData] = useState(null);
  const [rdsLoading, setRdsLoading] = useState(false);
  const requestTimeout = useRef(null);

  const [searchValue] = useState("");
  const [filterSearch, setFilterSearch] = useState(undefined);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [pending, setPending] = useState(false);

  const createContact = () => {
    if (!newContact.email) {
      alert("Please add an email.");
      return;
    }
    // if (!newContact.phone) {
    //   alert("Please add a phone number.");
    //   return;
    // }
    if (!newContact.name) {
      alert("Please fill in the name of the contact.");
      return;
    }
    setPending(true);
    // create a new contact
    createNewContact(store.session, {
      agency_id: store.company.id,
      deal_contact: {
        name: newContact.name,
        email: newContact.email,
        number: newContact.phone,
        title: newContact.title,
        owner_id: newContact.contactOwner?.value,
        company_id: clientCompanyId || newContact.company?.value,
        deal_id: dealId,
        competencies_attributes: newContact.competencies_attributes,
        categorizations_attributes: newContact.categorizations_attributes,
        localizations_attributes: newContact.localizations_attributes,
      },
    }).then((res) => {
      if (!res.err) {
        setTriggerUpdate(Math.random());
        notify("info", "New contact created");
        hide();
      } else {
        setPending(false);
        if (res.errors) {
          notify("warning", res.errors);
        } else {
          notify(
            "danger",
            res.error || res.customError || "Unable to create contact"
          );
        }
      }
    });
  };

  // SET INITIAL VIEW TYPE FOR THE MODAL
  useEffect(() => {
    const nextView = !!dealId || !!clientCompanyId ? "search" : "create";
    setModalView(nextView);
  }, [dealId, clientCompanyId]);

  // REQUEST TO GET SEARCH RESULTS
  useEffect(() => {
    clearTimeout(requestTimeout.current);

    if (!searchValue.length) {
      (async (searchValue, session) => {
        let contactsFilter = {};
        if (clientCompanyId) contactsFilter.clientId = clientCompanyId;
        if (dealId) contactsFilter.dealId = dealId;

        let reqBody = {
          company_id: store.company.id,
          slice: [0, 20],
        };
        const nextSearchResult = await fetchAllContacts(
          session,
          reqBody,
          contactsFilter
        );
        if (!nextSearchResult.err) {
          return setSearchResult(nextSearchResult);
        }
        return notify("danger", "Error while getting the list of contacts");
      })(searchValue, store.session);
    } else if (searchValue.length >= 2) {
      requestTimeout.current = setTimeout(async () => {}, 350);
    }
  }, [searchValue, store]);

  //search input
  useEffect(() => {
    if (
      searchResult &&
      filterSearch !== undefined &&
      (filterSearch === "" || filterSearch.length >= 2)
    ) {
      let reqBody = {
        company_id: store.company.id,
        get_all: true,
        search_term: filterSearch !== "" ? filterSearch : undefined,
      };
      fetchAllContacts(store.session, reqBody, {}).then((res) => {
        if (!res.err) {
          if (res.length > 0) {
            let filteredCands = res.filter(
              (client) =>
                client.company?.origin_client_id !== Number(clientCompanyId)
            );
            return setSearchResult(filteredCands);
          } else {
            return setSearchResult(res);
          }
        }
        return notify("danger", "Error while getting the list of contacts");
      });
    }
  }, [filterSearch]);

  //RESET THE STATUS IF THE PIPELINE IS CHANGED TO AVOID CONFLICTS
  useEffect(() => {
    if (newContact.pipelineIndex) {
      setNewContact({ ...newContact, deal_status: undefined });
    }
  }, [newContact.pipelineIndex]);

  //SET THE OWNER TO BE THE CURRENT USER FOR DEFAULT
  useEffect(() => {
    if (store.user && store.teamMembers) {
      store.teamMembers.map((member) => {
        if (member.professional_id === store.user.id) {
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
  }, [store.user, store.teamMembers]);

  //FETCH ALL COMPANIES AND SET THEM
  useEffect(() => {
    if (!allCompanies && !clientCompanyId) {
      fetchAllCompanies(store.session, {
        company_id: store.company.id,
        get_all: true,
      }).then((res) => {
        if (!res.err) {
          setAllCompanies(res);
        } else {
          notify("danger", "Unable to fetch companies");
        }
      });
    }
  }, [allCompanies, clientCompanyId, store.session, store.company]);

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

  const onContactSelect = (id) => {
    return setSelectedContacts((contactsIds) => {
      if (!contactsIds.includes(id)) {
        return contactsIds.concat(id);
      }
      return contactsIds.filter((contactId) => contactId !== id);
    });
  };

  const assignContacts = async () => {
    const { session, company } = store;
    let response;
    setPending(true);
    if (dealId) {
      response = await assignContactsToDeal(
        session,
        company.id,
        dealId,
        selectedContacts
      );
    } else if (clientCompanyId) {
      response = await assignContactsToClient(
        session,
        company.id,
        clientCompanyId,
        selectedContacts
      );
    } else {
      setPending(false);
      return false;
    }
    if (!response.err) {
      notify("info", "You successfully assigned contacts");
      setTimeout(() => setTriggerUpdate(Math.random()), 350);
      return hide();
    }
    return notify("danger", "Faled to assign contacts");
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
        title={modalView === "create" ? "Create Contact" : "Add Contact"}
        closeModal={hide}
      />
      <STModalBody>
        <div className="body-wrapper">
          {modalView === "create" ? (
            <CreateContactBody
              newContact={newContact}
              setNewContact={setNewContact}
              handleEmailKeyUp={handleEmailKeyUp}
              contactPreviewData={contactPreviewData}
              importExistingContact={importExistingContact}
              handleContactImport={handleContactImport}
              handleImportCancel={handleImportCancel}
              allCompanies={allCompanies}
              clientCompanyId={clientCompanyId}
              store={store}
            />
          ) : (
            <SearchContactBody
              handleSearchInputChange={(e) => setFilterSearch(e.target.value)}
              handleModalViewChange={handleModalViewChange}
              onContactSelect={onContactSelect}
              searchResult={searchResult}
            />
          )}
        </div>
      </STModalBody>
      <ModalFooter hide={hide}>
        {modalView === "create" ? (
          <>
            {importExistingContact !== undefined && (
              <button
                id="forward"
                className="button button--default button--blue-dark"
                onClick={createContact}
                disabled={pending}
              >
                Create
              </button>
            )}
          </>
        ) : (
          <button
            id="forward"
            className="button button--default button--blue-dark"
            onClick={assignContacts}
            disabled={pending}
          >
            Save
          </button>
        )}
      </ModalFooter>
    </UniversalModal>
  );
};

export default CreateContactModal;

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
