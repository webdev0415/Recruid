import React, { useState, useEffect, useContext, useRef } from "react";
import Col from "react-bootstrap/Col";
import notify from "notifications";
import styled from "styled-components";

import CreateDealBody from "./CreateDealBody";
import SearchDealBody from "./SearchDealBody";
import InitialDealBody from "./InitialDealBody";

import GlobalContext from "contexts/globalContext/GlobalContext";
import UniversalModal, {
  ModalFooter,
  ModalBody,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";
import { createNewDeal, getAllDeals } from "helpers/crm/deals";
import {
  fetchAllCompanies,
  fetchClientCompanyProfile,
  assignDealsToClient,
} from "helpers/crm/clientCompanies";
import {
  assignDealsToContact,
  fetchContactProfile,
} from "helpers/crm/contacts";
import { fetchCompanyContacts } from "helpers/crm/clientCompanies";
import { fetchAllPipelines } from "helpers/crm/pipelines";
import { AWS_CDN_URL } from "constants/api";

const CreateDealModal = ({
  show,
  hide,
  parentPipelines,
  setTriggerUpdate,
  clientCompanyId,
  contactId,
  initialView,
}) => {
  const store = useContext(GlobalContext);
  const [allCompanies, setAllCompanies] = useState(undefined);
  const [companyContacts, setCompanyContacts] = useState(undefined);
  // const [associatedContacts, setAssociatedContacts] = useState(undefined);
  const [companyProfile, setCompanyProfile] = useState(undefined);
  const [contactProfile, setContactProfile] = useState(undefined);
  const [allPipelines, setAllPipelines] = useState(undefined);
  const [newDeal, setNewDeal] = useState({
    name: "",
    deal_status: undefined,
    deal_value: "",
    close_date: new Date(Date.now() + 604800000),
    create_date: new Date(Date.now()),
    pipelineIndex: undefined,
    contactIndex: undefined,
    dealOwnerIndex: undefined,
    selectedCompany: {
      label: "",
      value: null,
    },
    selectedContact: {
      label: "",
      value: null,
    },
    create_job: undefined,
    vacancies: 0,
    conversion_stage: undefined,
  });

  const [modalView, setModalView] = useState(undefined);

  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [pending, setPending] = useState(false);

  const requestTimeout = useRef(null);

  useEffect(() => {
    if (store.session && store.company && !parentPipelines && store.role) {
      getAllPipelines();
    } else if (parentPipelines) {
      setAllPipelines(parentPipelines);
    }
  }, [store.session, store.company, parentPipelines, store.role]);

  const getAllPipelines = () => {
    fetchAllPipelines(
      store.session,
      store.company.id,
      store.role.team_member.team_member_id
    ).then((res) => {
      if (!res.err) {
        setAllPipelines(res);
      } else {
        setAllPipelines(false);
        notify("danger", "Unable to fetch all pipelines");
      }
    });
  };

  const allCompaniesOptions = allCompanies
    ? allCompanies.map((company) => ({
        name: company.company_name,
        id: company.client_id,
      }))
    : undefined;

  const createDeal = () => {
    if (!newDeal.name) {
      notify("danger", "Please fill in the name of the deal.");
      return;
    }
    if (newDeal.pipelineIndex === undefined) {
      notify("danger", "Please select a pipeline.");
      return;
    }
    if (!newDeal.deal_status) {
      notify("danger", "Please select a deal status.");
      return;
    }
    setPending(true);
    let postBody = {
      name: newDeal.name,
      value: newDeal.deal_value,
      // currency_id: newDeal.deal_currency,
      close_date: newDeal.close_date,
      create_date: newDeal.create_date,
      pipeline_stage_id: newDeal.deal_status.id,
      deal_company_id: clientCompanyId || newDeal.selectedCompany?.value,
      // deal_contact_ids:
      //   associatedContacts?.length > 0
      //     ? associatedContacts.map(cont => cont.source_id)
      //     : undefined,
      deal_contact_id: contactId || newDeal.selectedContact?.value,
      owner:
        newDeal.dealOwnerIndex !== undefined
          ? store.teamMembers[newDeal.dealOwnerIndex].team_member_id
          : undefined,
      create_job: newDeal.create_job,
      vacancies: newDeal.vacancies || undefined,
      conversion_stage: newDeal.conversion_stage?.id || undefined,
    };
    //create a new deal
    createNewDeal(store.session, store.company.id, postBody).then((res) => {
      if (!res.err) {
        setTriggerUpdate(Math.random());
        notify("info", "Deal created");
        hide();
      } else {
        setPending(false);
        notify("danger", "Error creating deal");
      }
    });
  };

  // SET INITIAL VIEW TYPE FOR THE MODAL
  useEffect(() => {
    setModalView(initialView || "initial");
  }, [initialView]);

  useEffect(() => {
    if (modalView === "initial" && newDeal.create_job === false) {
      setModalView("create");
    }
  }, [modalView, newDeal.create_job]);

  useEffect(() => {
    clearTimeout(requestTimeout.current);

    if (!searchValue.length) {
      (async (searchValue, session) => {
        const nextSearchResult = await getAllDeals(
          session,
          store.company.id,
          clientCompanyId,
          contactId
        );
        if (!nextSearchResult.err) {
          if (nextSearchResult?.length === 0) setModalView("create");
          return setSearchResult(nextSearchResult);
        }
        return notify("danger", "Error while getting the list of contacts");
      })(searchValue, store.session);
    } else if (searchValue.length >= 2) {
      requestTimeout.current = setTimeout(async () => {}, 350);
    }
  }, [searchValue, store]);

  useEffect(() => {
    if (newDeal.pipelineIndex) {
      setNewDeal({ ...newDeal, deal_status: undefined });
    }
  }, [newDeal.pipelineIndex]);

  useEffect(() => {
    if (!contactId && (clientCompanyId || newDeal.selectedCompany?.value)) {
      fetchCompanyContacts(
        store.session,
        clientCompanyId || newDeal.selectedCompany.value,
        store.company.id
      ).then((res) => {
        if (!res.err) {
          setCompanyContacts(res);
        } else {
          notify("danger", "Unable to fetch contacts");
        }
      });
    }
  }, [
    clientCompanyId,
    newDeal.selectedCompany,
    contactId,
    store.company,
    store.session,
  ]);

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
  }, [allCompanies, clientCompanyId, store.company, store.session]);

  useEffect(() => {
    if (newDeal.selectedCompany?.value) {
      fetchClientCompanyProfile(
        store.session,
        store.company.id,
        newDeal.selectedCompany.value
      ).then((res) => {
        if (!res.err) {
          setCompanyProfile(res);
        } else {
          notify("danger", "Unable to fetch company profile");
        }
      });
    }
  }, [newDeal.selectedCompany, store]);

  const handleSearchInputChange = (event) => setSearchValue(event.target.value);

  const onDealSelect = (id) => {
    return setSelectedDeals((dealsIds) => {
      if (!dealsIds.includes(id)) {
        return dealsIds.concat(id);
      }
      return dealsIds.filter((dealId) => dealId !== id);
    });
  };

  const assignDeals = async () => {
    const { session, company } = store;
    let response;
    setPending(true);
    if (contactId) {
      response = await assignDealsToContact(
        session,
        company.id,
        contactId,
        selectedDeals
      );
    } else if (clientCompanyId) {
      response = await assignDealsToClient(
        session,
        company.id,
        clientCompanyId,
        selectedDeals
      );
    } else {
      setPending(false);
      return false;
    }
    if (!response.err) {
      notify("info", "You successfully assigned deals");
      setTimeout(() => setTriggerUpdate(Math.random()), 350);
      return hide();
    }
    return notify("danger", "Faled to assign deals");
  };

  useEffect(() => {
    if (newDeal.selectedContact?.value) {
      fetchContactProfile(
        store.session,
        newDeal.selectedContact.value,
        store.company.id
      ).then((res) => {
        if (!res.err) {
          setContactProfile(res);
        } else {
          notify("danger", "Unable to fetch company profile");
        }
      });
    }
  }, [newDeal.selectedContact, store]);

  return (
    <UniversalModal
      show={show}
      hide={hide}
      id={"create-deal-modal"}
      width={modalView === "search" ? 240 : 960}
    >
      <ModalHeaderClassic
        title={modalView === "search" ? "Add Deal" : "Create Deal"}
        closeModal={hide}
      />
      <STModalBody>
        <div className="body-wrapper">
          {modalView === "initial" && (
            <InitialDealBody
              setNewDeal={setNewDeal}
              newDeal={newDeal}
              allPipelines={allPipelines}
            />
          )}
          {modalView === "create" && (
            <CreateDealBody
              setNewDeal={setNewDeal}
              newDeal={newDeal}
              allPipelines={allPipelines}
              clientCompanyId={clientCompanyId}
              allCompaniesOptions={allCompaniesOptions}
              companyProfile={companyProfile}
              setCompanyProfile={setCompanyProfile}
              contactId={contactId}
              companyContacts={companyContacts}
              setCompanyContacts={setCompanyContacts}
              store={store}
              // associatedContacts={associatedContacts}
              // setAssociatedContacts={setAssociatedContacts}
              contactProfile={contactProfile}
              setContactProfile={setContactProfile}
            />
          )}
          {modalView === "search" && (
            <SearchDealBody
              handleSearchInputChange={handleSearchInputChange}
              handleModalViewChange={setModalView}
              searchResult={searchResult}
              onDealSelect={onDealSelect}
              company={store.company}
            />
          )}
        </div>
      </STModalBody>
      <ModalFooter hide={hide}>
        {modalView === "initial" && (
          <button
            id="forward"
            className="button button--default button--blue-dark"
            onClick={() => {
              if (newDeal.create_job === undefined) {
                notify(
                  "danger",
                  "Please select if this deal will convert to a job or not."
                );
                return;
              }
              setModalView("create");
            }}
          >
            Next
          </button>
        )}
        {modalView === "create" && (
          <button
            id="forward"
            className="button button--default button--blue-dark"
            onClick={createDeal}
            disabled={pending}
          >
            Create
          </button>
        )}
        {modalView === "search" && (
          <button
            id="forward"
            className="button button--default button--blue-dark"
            onClick={assignDeals}
            disabled={pending}
          >
            Save
          </button>
        )}
      </ModalFooter>
    </UniversalModal>
  );
};

export default CreateDealModal;

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

export const StyledCol = styled(Col)`
  text-align: left;

  &.left-padding {
    padding-right: 40px;
  }
  &.right-padding {
    padding-left: 40px;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }
`;

export const StyledInput = styled.input`
  margin-bottom: 20px !important;
`;
export const StyledSelect = styled.select`
  margin-bottom: 20px !important;
`;
