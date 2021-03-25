import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchContactList } from "helpers/crm/contacts";
import notify from "notifications";
import { STContainer, STTable } from "modals/ViewProfilesListsModal/components";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { ROUTES } from "routes";
import spacetime from "spacetime";
import Spinner from "sharedComponents/Spinner";

const SLICE_LENGTH = 20;

const ContactsTable = ({
  store,
  elasticIds,
  contacts,
  setContacts,
  hasMore,
  setHasMore,
  loaded,
  setLoaded,
}) => {
  useEffect(() => {
    //fetch contacts
    if (store.company) {
      fetchContactList(store.session, {
        slice: [0, SLICE_LENGTH],
        company_id: store.company.id,
        operator: "and",
        id: elasticIds,
      }).then((res) => {
        if (!res.err) {
          setContacts(res);
          setHasMore(res.length === SLICE_LENGTH);
          setLoaded(true);
        } else {
          setContacts(false);
          notify("danger", "Unable to fetch contacts");
        }
      });
    }
  }, [elasticIds, store.company]);

  const loadMore = () => {
    fetchContactList(store.session, {
      slice: [contacts.length, SLICE_LENGTH],
      company_id: store.company.id,
      operator: "and",
      id: elasticIds,
    }).then((res) => {
      if (!res.err) {
        setContacts([...contacts, ...res]);
        setHasMore(res.length === SLICE_LENGTH);
      } else {
        notify("danger", "Unable to fetch contacts");
      }
    });
  };
  return (
    <>
      {!loaded ? (
        <Spinner />
      ) : (
        <InfiniteScroller
          fetchMore={loadMore}
          hasMore={hasMore}
          dataLength={contacts?.length || 0}
          scrollableTarget={"modal-container-scroll"}
        >
          <STContainer id="modal-container-scroll">
            <STTable className="table  ">
              <thead>
                <tr>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Contact Name
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Number
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Company
                  </th>
                  <th scope="col" className={sharedStyles.tableDate}>
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts &&
                  contacts.map((contact, index) => {
                    return (
                      <tr key={`contact_${index}`} className="table-row-hover">
                        <th scope="row" className={sharedStyles.tableItemFirst}>
                          <Link
                            className={styles.name}
                            to={ROUTES.ContactProfile.url(
                              store.company.mention_tag,
                              contact.id
                            )}
                          >
                            {contact.name}
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
                          {contact.company?.name}
                        </td>
                        <td className={sharedStyles.tableItem}>
                          {spacetime(new Date(contact.created_at)).format(
                            "{date} {month-short} {year}"
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </STTable>
          </STContainer>
        </InfiniteScroller>
      )}
    </>
  );
};

export default ContactsTable;
