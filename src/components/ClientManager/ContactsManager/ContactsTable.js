import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import spacetime from "spacetime";
import { Link } from "react-router-dom";
import { ROUTES } from "routes";
import {
  ExtensionMenu,
  ExtensionMenuOption,
} from "sharedComponents/ExtensionMenu";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import MarketingEmailModal from "modals/MarketingEmailModal";
import CreateListModal from "modals/CreateListModal";

import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import Marquee from "sharedComponents/Marquee";

const ContactsTable = ({
  contacts,
  company,
  setContacts,
  loadMore,
  hasMore,
  openModal,
  closeModal,
  activeModal,
  setContactIndex,
  teamMembers,
  selectedContacts,
}) => {
  const store = useContext(GlobalContext);
  const [selectAll, setSelectAll] = useState(false);
  const [possibleOwners, setPossibleOwners] = useState({});
  const selectContact = (index) => {
    let newContacts = [...contacts];
    newContacts[index].selected = newContacts[index].selected ? false : true;
    setContacts(newContacts);
  };

  useEffect(() => {
    if (contacts) {
      let newContacts = [...contacts];
      newContacts = newContacts.map((contact) => {
        contact.selected = selectAll;
        return contact;
      });
      setContacts(newContacts);
    }
  }, [selectAll]);

  useEffect(() => {
    if (teamMembers) {
      let obj = {};
      teamMembers.map((member) => (obj[member.team_member_id] = member.name));
      setPossibleOwners(obj);
    }
  }, [teamMembers]);

  const clearSelected = () => {
    let newContacts = [...contacts];
    newContacts = newContacts.map((contact) => {
      contact.selected = false;
      return contact;
    });
    setSelectAll(false);
    setContacts(newContacts);
  };

  return (
    <>
      <div className={styles.container}>
        <div className="table-responsive">
          <InfiniteScroller
            fetchMore={loadMore}
            hasMore={hasMore}
            dataLength={contacts.length}
          >
            <table className="table table-borderless">
              <thead>
                <tr>
                  {(store.role?.role_permissions.owner ||
                    (store.role?.role_permissions.admin &&
                      store.role?.role_permissions.business) ||
                    store.role?.role_permissions.marketer) && (
                    <th scope="col" className={sharedStyles.tableItemCheckBox}>
                      <button
                        className={styles.professionalCheckbox}
                        style={{
                          background: selectAll ? "#60CCA7" : "none",
                        }}
                        onClick={() => setSelectAll(!selectAll)}
                      >
                        {selectAll && (
                          <span className={styles.professionalCheckboxActive} />
                        )}
                      </button>
                    </th>
                  )}
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Contact Name
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Number
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Company
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Contact Owner
                  </th>
                  <th scope="col" className={sharedStyles.tableDate}>
                    Created
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader} />
                </tr>
              </thead>
              <tbody>
                {contacts &&
                  contacts.map((contact, index) => {
                    return (
                      <tr key={`contact_${index}`} className="table-row-hover">
                        {(store.role?.role_permissions.owner ||
                          (store.role?.role_permissions.admin &&
                            store.role?.role_permissions.business) ||
                          store.role?.role_permissions.marketer) && (
                          <td className={sharedStyles.tableItem}>
                            <button
                              className={styles.professionalCheckbox}
                              style={{
                                background: contact.selected
                                  ? "#60CCA7"
                                  : "none",
                              }}
                              onClick={() => selectContact(index)}
                            >
                              {contact.selected && (
                                <span
                                  className={styles.professionalCheckboxActive}
                                />
                              )}
                            </button>
                          </td>
                        )}
                        <th scope="row" className={sharedStyles.tableItemFirst}>
                          <Link
                            className={styles.name}
                            to={ROUTES.ContactProfile.url(
                              company.mention_tag,
                              contact.id
                            )}
                          >
                            <Marquee
                              height="25"
                              width={{ s: 150, m: 200, l: 250, xl: 300 }}
                            >
                              {contact.name}
                            </Marquee>
                          </Link>
                        </th>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {contact.number}
                        </td>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          <Marquee
                            height="25"
                            width={{ s: 100, m: 150, l: 200, xl: 250 }}
                          >
                            {contact.company?.name}
                          </Marquee>
                        </td>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {possibleOwners[contact.contact_owner] || ""}
                        </td>
                        <td className={sharedStyles.tableItem}>
                          {spacetime(contact.created_at).format(
                            "{date} {month-short} {year}"
                          )}
                        </td>
                        <td className={sharedStyles.tableItemStatus}>
                          <ExtensionMenu>
                            <ExtensionMenuOption>
                              <Link
                                to={ROUTES.ContactProfile.url(
                                  company.mention_tag,
                                  contact.id
                                )}
                              >
                                View Contact
                              </Link>
                            </ExtensionMenuOption>
                            {(store.role?.role_permissions.owner ||
                              (store.role?.role_permissions.admin &&
                                store.role?.role_permissions.business)) && (
                              <ExtensionMenuOption
                                onClick={() => {
                                  setContactIndex(index);
                                  openModal("delete_contact");
                                }}
                              >
                                Delete Contact
                              </ExtensionMenuOption>
                            )}
                          </ExtensionMenu>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </InfiniteScroller>
        </div>
      </div>
      {activeModal === "create-email" && (
        <MarketingEmailModal
          hide={() => {
            closeModal();
            clearSelected();
          }}
          receivers={selectedContacts}
          source="contact"
        />
      )}
      {activeModal === "create_list_from_contacts" && (
        <CreateListModal
          hide={() => {
            closeModal();
            clearSelected();
          }}
          modalType="create_with_contacts"
          refreshList={() => {}}
          parentReceivers={contacts.filter((cont) => cont.selected)}
        />
      )}
      {activeModal === "add_contacts_to_list" && (
        <CreateListModal
          hide={() => {
            closeModal();
            clearSelected();
          }}
          modalType="add_contacts_to_list"
          refreshList={() => {}}
          parentReceivers={contacts.filter((cont) => cont.selected)}
        />
      )}
    </>
  );
};
export default ContactsTable;
