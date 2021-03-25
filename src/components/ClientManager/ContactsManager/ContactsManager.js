import React, { useEffect, useState, useContext, Suspense } from "react";
import notify from "notifications";
import retryLazy from "hooks/retryLazy";
// import styled from "styled-components";
import { permissionChecker } from "constants/permissionHelpers";
import GlobalContext from "contexts/globalContext/GlobalContext";
import {
  fetchContactList,
  fetchDeleteContacts,
  fetchChangeContactsOwner,
} from "helpers/crm/contacts";
// import ContactsFilter from "containers/ATS/ClientManager/ContactsManager/ContactsFilter.js";
import ContactsTable from "components/ClientManager/ContactsManager/ContactsTable.js";
import EmptyTab from "components/Profiles/components/EmptyTab";
import FilterV2 from "sharedComponents/filterV2";
import { InnerPageContainer } from "styles/PageContainers";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import ContactsActionBar from "components/ClientManager/ContactsManager/ContactsActionBar";
import { EmptyContacts } from "assets/svg/EmptyImages";
const CreateContactModal = React.lazy(() =>
  retryLazy(() => import("modals/CreateContactModal"))
);
const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);

const FETCH_ARRAY_LENGTH = 20;

const ContactsManager = ({ parentModal, elastic_ids, search }) => {
  const store = useContext(GlobalContext);
  const [activeModal, setActiveModal] = useState(undefined);
  const [triggerUpdate, setTriggerUpdate] = useState(undefined);
  const [contacts, setContacts] = useState(undefined);
  const [selectedContacts, setSelectedContacts] = useState(undefined);
  const [selectedOwner, setSelectedOwner] = useState(undefined);
  const [filters, setFilters] = useState({});
  const [hasMore, setHasMore] = useState(false);
  const [contactIndex, setContactIndex] = useState(undefined);
  const controller = new AbortController();
  const signal = controller.signal;
  const [loaded, setLoaded] = useState(false);
  const [permission, setPermission] = useState({ view: false, edit: false });
  useEffect(() => {
    if (store.role) {
      setPermission(
        permissionChecker(store.role?.role_permissions, {
          business: true,
        })
      );
    }
  }, [store.role]);

  useEffect(() => {
    //fetch contacts
    if (store.company && permission.view) {
      fetchContactList(
        store.session,
        {
          ...filters,
          slice: [0, FETCH_ARRAY_LENGTH],
          company_id: store.company.id,
          operator: "and",
          id: elastic_ids,
          search: search?.length > 0 ? [search] : undefined,
        },
        signal
      ).then((res) => {
        if (!res.err) {
          setContacts(res);
          setHasMore(res.length === FETCH_ARRAY_LENGTH);
          setLoaded(true);
        } else if (!signal.aborted) {
          setContacts(false);
          notify("danger", "Unable to fetch contacts");
        }
      });
    }
    return () => controller.abort();
  }, [filters, triggerUpdate, elastic_ids, store.company, search, permission]);

  const loadMore = () => {
    fetchContactList(store.session, {
      ...filters,
      slice: [contacts.length, FETCH_ARRAY_LENGTH],
      company_id: store.company.id,
      operator: "and",
      id: elastic_ids,
      search: search?.length > 0 ? [search] : undefined,
    }).then((res) => {
      if (!res.err) {
        setContacts([...contacts, ...res]);
        setHasMore(res.length === FETCH_ARRAY_LENGTH);
      } else {
        notify("danger", "Unable to fetch contacts");
      }
    });
  };

  useEffect(() => {
    if (contacts) {
      let newContacts = contacts.filter((contact) => contact.selected);
      setSelectedContacts(newContacts);
    } else {
      setSelectedContacts(undefined);
    }
  }, [contacts]);

  const deleteContact = () => {
    //fetch call to delete contact
    fetchDeleteContacts(store.session, store.company.id, [
      contacts[contactIndex].id,
    ]).then((res) => {
      if (!res.err) {
        let newContacts = [...contacts];
        newContacts.splice(contactIndex, 1);
        setContacts(newContacts);
        closeModal();
        notify("info", "Contact successfully deleted");
      } else {
        notify("danger", "Unable to delete contact");
      }
    });
  };

  useEffect(() => {
    if (parentModal) {
      openModal(parentModal);
    }
  }, [parentModal]);

  const deleteContactsArr = () => {
    const idsArr = [];
    selectedContacts.map((contact) => idsArr.push(contact.id));
    fetchDeleteContacts(store.session, store.company.id, idsArr).then((res) => {
      if (!res.err) {
        //force update
        setTriggerUpdate(Math.random());
        closeModal();
        setSelectedContacts(undefined);
        notify("info", "Contacts successfully deleted");
      } else {
        notify("danger", "Unable to delete contacts");
      }
    });
  };

  const changeContactsOwner = () => {
    const idsArr = [];
    selectedContacts.map((contact) => idsArr.push(contact.id));
    fetchChangeContactsOwner(
      store.session,
      store.company.id,
      selectedOwner.id,
      idsArr
    ).then((res) => {
      if (!res.err) {
        //force update
        closeModal();
        setSelectedContacts(undefined);
        notify("info", "Successfully changed owner");
      } else {
        notify("danger", "Unable to change contacts owner");
      }
    });
  };

  const changeFilters = (newFilters) => {
    if (
      Object.values(filters).length === 0 &&
      Object.values(newFilters).length === 0
    ) {
      return;
    }
    setFilters(newFilters);
  };

  const openModal = (option) => setActiveModal(option);
  const closeModal = () => setActiveModal(undefined);

  return (
    <InnerPageContainer>
      <ATSContainer>
        <FilterV2
          source="contact"
          returnFilters={(newFilters) => changeFilters(newFilters)}
        />
        {!loaded && <Spinner />}
        {loaded && (
          <>
            {contacts && contacts.length > 0 && (
              <>
                <ContactsTable
                  contacts={contacts}
                  setContacts={setContacts}
                  hasMore={hasMore}
                  openModal={openModal}
                  setContactIndex={setContactIndex}
                  loadMore={loadMore}
                  company={store.company}
                  teamMembers={store.teamMembers}
                  closeModal={closeModal}
                  activeModal={activeModal}
                  selectedContacts={selectedContacts}
                />
              </>
            )}
            {contacts && contacts.length === 0 && (
              <div style={{ marginTop: 20 }}>
                <EmptyTab
                  data={contacts}
                  title={"Add your contacts"}
                  copy={
                    "Add contacts, connect them to deals and companies, and nurture them through your deal pipeline."
                  }
                  image={<EmptyContacts />}
                  action={
                    permission.edit
                      ? () => openModal("create_contact")
                      : undefined
                  }
                  actionText={"Add Your First Contact"}
                />
              </div>
            )}
          </>
        )}
        {activeModal === "create_contact" && (
          <Suspense fallback={<div />}>
            <CreateContactModal
              show={true}
              hide={closeModal}
              setTriggerUpdate={setTriggerUpdate}
            />
          </Suspense>
        )}
        {activeModal === "delete_contact" && contactIndex !== undefined && (
          <Suspense fallback={<div />}>
            <ConfirmModalV2
              show={true}
              hide={() => {
                closeModal();
                setContactIndex(undefined);
              }}
              header="Delete Contact"
              text={`Are you sure you want to delete ${
                contacts[contactIndex]?.name || "this contact"
              } from your contacts`}
              actionText="Delete"
              actionFunction={deleteContact}
            />
          </Suspense>
        )}
        {activeModal === "delete_contacts_arr" && (
          <Suspense fallback={<div />}>
            <ConfirmModalV2
              show={true}
              hide={() => {
                closeModal();
              }}
              header="Delete Contacts"
              text={`Are you sure you want to delete these contacts`}
              actionText="Delete"
              actionFunction={deleteContactsArr}
            />
          </Suspense>
        )}
        {activeModal === "change_owner_confirm" && selectedOwner && (
          <Suspense fallback={<div />}>
            <ConfirmModalV2
              show={true}
              hide={() => {
                closeModal();
                setSelectedOwner(undefined);
              }}
              header="Change Owner"
              text={`Are you sure you want to change these contacts owner to ${selectedOwner.name}`}
              actionText="Change"
              actionFunction={changeContactsOwner}
            />
          </Suspense>
        )}
      </ATSContainer>
      <ContactsActionBar
        selectedTotal={selectedContacts?.length}
        store={store}
        openModal={openModal}
        activeModal={activeModal}
      />
    </InnerPageContainer>
  );
};
export default ContactsManager;
