import React, { useState, useEffect } from "react";
import styled from "styled-components";
import notify from "notifications";
import spacetime from "spacetime";
import { fetchNetwork } from "helpersV2/candidates";
import { fetchContactList } from "helpers/crm/contacts";
import { ROUTES } from "routes";
import { Link } from "react-router-dom";
// import { fetchCompaniesList } from "helpers/crm/clientCompanies";

import sharedStyles from "assets/stylesheets/scss/collated/filter.module.scss";
import styles from "components/ViewJobs/JobDashboard/AddCandidates/style/addCandidates.module.scss";
import FilterV2 from "sharedComponents/filterV2";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import Checkbox from "sharedComponents/Checkbox";
import AvatarIcon from "sharedComponents/AvatarIcon";
import Spinner from "sharedComponents/Spinner";
const SLICE_LENGTH = 20;

const ProfilesList = ({
  list,
  setList,
  store,
  originalReceivers,
  modalType,
  parentReceivers,
}) => {
  const [participants, setParticipants] = useState(undefined);
  const [initialPageLoad, setInitialPageLoad] = useState(true);
  const controller = new AbortController();
  const signal = controller.signal;
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [ogIds, setOgIds] = useState(undefined);

  useEffect(() => {
    if (
      store.company &&
      store.role &&
      list.receiver_type === "ProfessionalTalentNetwork"
    ) {
      fetchNetwork(
        store.session,
        store.company.id,
        {
          ...filters,
          slice: [
            0,
            modalType === "edit_list" || modalType === "view_list"
              ? originalReceivers.length
              : modalType === "create_with_candidates" ||
                modalType === "add_candidates_to_list"
              ? parentReceivers.length
              : SLICE_LENGTH,
          ],
          operator: "and",
          search: search?.length > 0 ? [search] : undefined,
          id:
            modalType === "edit_list" || modalType === "view_list"
              ? originalReceivers.map((rec) => rec.id)
              : modalType === "create_with_candidates"
              ? parentReceivers.map((cand) => cand.ptn_id)
              : undefined,
          team_member_id: store.role.team_member.team_member_id,
        },
        signal
      ).then((talentNetwork) => {
        if (!talentNetwork.err) {
          setParticipants(talentNetwork.results);

          if (
            modalType !== "edit_list" &&
            modalType !== "view_list" &&
            modalType !== "create_with_candidates" &&
            modalType !== "add_candidates_to_list" &&
            talentNetwork.results.length !== talentNetwork.total
          ) {
            setHasMore(true);
          } else {
            setHasMore(false);
          }
          setInitialPageLoad(false);
        } else if (!signal.aborted) {
          notify("danger", talentNetwork);
        }
      });
    }
    return () => controller.abort();
  }, [
    store.company,
    store.role,
    store.session,
    filters,
    search,
    originalReceivers,
  ]);

  const loadMoreCandidates = () => {
    fetchNetwork(
      store.session,
      store.company.id,
      {
        ...filters,
        slice: [participants.length, SLICE_LENGTH],
        operator: "and",
        search: search?.length > 0 ? [search] : undefined,
        team_member_id: store.role.team_member.team_member_id,
      },
      signal
    ).then((talentNetwork) => {
      if (!talentNetwork.err) {
        let arr = [...participants, ...talentNetwork.results];
        setParticipants(arr);
        if (arr.length !== talentNetwork.total) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
        setInitialPageLoad(false);
      } else if (!signal.aborted) {
        notify("danger", talentNetwork);
      }
    });
  };

  useEffect(() => {
    //fetch contacts
    if (store.company && list.receiver_type === "Contact") {
      fetchContactList(
        store.session,
        {
          ...filters,
          slice: [
            0,
            modalType === "edit_list" || modalType === "view_list"
              ? originalReceivers.length
              : modalType === "create_with_contacts"
              ? parentReceivers.length
              : SLICE_LENGTH,
          ],
          company_id: store.company.id,
          operator: "and",
          search: search?.length > 0 ? [search] : undefined,
          id:
            modalType === "edit_list" || modalType === "view_list"
              ? originalReceivers.map((rec) => rec.id)
              : modalType === "create_with_contacts" ||
                modalType === "add_contacts_to_list"
              ? parentReceivers.map((cont) => cont.id)
              : undefined,
        },
        signal
      ).then((res) => {
        if (!res.err) {
          setParticipants(res);
          if (
            modalType !== "edit_list" &&
            modalType !== "view_list" &&
            modalType !== "create_with_contacts" &&
            modalType !== "add_contacts_to_list"
          ) {
            setHasMore(res.length === SLICE_LENGTH);
          }

          setInitialPageLoad(false);
        } else if (!signal.aborted) {
          setParticipants(false);
          notify("danger", "Unable to fetch contacts");
        }
      });
    }
    return () => controller.abort();
  }, [filters, store.company, search, search, originalReceivers]);

  const loadMoreContacts = () => {
    fetchContactList(store.session, {
      ...filters,
      slice: [participants.length, SLICE_LENGTH],
      company_id: store.company.id,
      operator: "and",
      search: search?.length > 0 ? [search] : undefined,
    }).then((res) => {
      if (!res.err) {
        setParticipants([...participants, ...res]);
        setHasMore(res.length === SLICE_LENGTH);
      } else {
        notify("danger", "Unable to fetch contacts");
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

  useEffect(() => {
    if (participants && participants.length > 0) {
      let filtered = [];
      participants.map((part) => {
        if (part.selected) {
          filtered.push(
            list.receiver_type === "ProfessionalTalentNetwork"
              ? { id: part.ptn_id, email: part.email }
              : { id: part.id, email: part.email }
          );
        }
        return null;
      });

      setList({ ...list, list: filtered });
    }
  }, [participants]);

  useEffect(() => {
    if (originalReceivers && originalReceivers.length > 0) {
      setOgIds(originalReceivers.map((rec) => rec.id));
    }
  }, [originalReceivers]);

  return (
    <div>
      {initialPageLoad ? (
        <Spinner />
      ) : (
        <>
          {list.receiver_type === "ProfessionalTalentNetwork" && (
            <>
              {modalType === "view_list" ? (
                <CandidatesViewList
                  candidates={participants}
                  setCandidates={setParticipants}
                  loadMore={loadMoreCandidates}
                  hasMore={hasMore}
                  store={store}
                />
              ) : (
                <CandidatesList
                  candidates={participants}
                  setCandidates={setParticipants}
                  loadMore={loadMoreCandidates}
                  hasMore={hasMore}
                  changeFilters={changeFilters}
                  search={search}
                  setSearch={setSearch}
                  ogIds={ogIds}
                  modalType={modalType}
                />
              )}
            </>
          )}
          {list.receiver_type === "Contact" && (
            <>
              {modalType === "view_list" ? (
                <ContactsViewList
                  contacts={participants}
                  setContacts={setParticipants}
                  loadMore={loadMoreContacts}
                  hasMore={hasMore}
                  store={store}
                />
              ) : (
                <ContactsList
                  contacts={participants}
                  setContacts={setParticipants}
                  loadMore={loadMoreContacts}
                  hasMore={hasMore}
                  changeFilters={changeFilters}
                  search={search}
                  setSearch={setSearch}
                  ogIds={ogIds}
                  modalType={modalType}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilesList;

const CandidatesList = ({
  candidates,
  setCandidates,
  changeFilters,
  search,
  setSearch,
  loadMore,
  hasMore,
  ogIds,
  modalType,
}) => {
  const [selectAll, setSelectAll] = useState(undefined);
  useEffect(() => {
    if (candidates) {
      if (selectAll === undefined) {
        if (
          modalType === "edit_list" ||
          modalType === "create_with_candidates" ||
          modalType === "add_candidates_to_list"
        ) {
          setSelectAll(true);
        } else {
          setSelectAll(false);
        }
      } else {
        let newNetwork = [...candidates];
        newNetwork = newNetwork.map((candidate) => {
          return { ...candidate, selected: selectAll };
        });
        setCandidates(newNetwork);
      }
    }
  }, [selectAll]);

  const selectCandidate = (index) => {
    let newNetwork = [...candidates];
    newNetwork[index].selected = newNetwork[index].selected ? false : true;
    setCandidates(newNetwork);
  };
  return (
    <>
      <div
        className={sharedStyles.container}
        style={{
          borderBottom: "1px solid #eee",
          borderRadius: "0",
          boxShadow: "none",
          background: "#eee",
        }}
      >
        <div
          className="leo-flex"
          style={{
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <FilterV2
            source="candidate"
            returnFilters={(newFilters) => changeFilters(newFilters)}
            cleanSlate={true}
          />
          <div className={styles.inputContainer}>
            <div>
              <input
                className={styles.searchNetwork}
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  boxShadow: "0 1px 2px 0 rgba(0,0,0,0.1)",
                  background: "white",
                  marginLeft: "10px",
                }}
              />

              <li className="fas fa-search search" />
            </div>
          </div>
        </div>
      </div>
      <InfiniteScroller
        fetchMore={loadMore}
        hasMore={hasMore}
        dataLength={candidates?.length || 0}
        scrollableTarget={"modal-container-scroll"}
      >
        <STContainer id="modal-container-scroll">
          <div className="table-responsive">
            <table className="table table-borderless">
              <thead>
                <tr>
                  <th scope="col" className={sharedStyles.tableItemCheckBox}>
                    <Checkbox
                      active={selectAll}
                      onClick={() => setSelectAll(!selectAll)}
                    />
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Candidate Name
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Current Job Title
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Current Company
                  </th>
                  <th scope="col" className={sharedStyles.tableDate}>
                    Date Added
                  </th>
                </tr>
              </thead>
              <tbody>
                {candidates &&
                  candidates.map((professional, index) => {
                    if (
                      modalType === "add_users" &&
                      ogIds &&
                      ogIds.length > 0 &&
                      ogIds.indexOf(professional.ptn_id) !== -1
                    ) {
                      return null;
                    }
                    return (
                      <tr key={`professional_${index}`}>
                        <td className={sharedStyles.tableItem}>
                          <Checkbox
                            active={professional.selected}
                            onClick={() => selectCandidate(index)}
                          />
                        </td>
                        <th scope="row" className={sharedStyles.tableItemFirst}>
                          <span className={styles.name}>
                            {professional.name}
                          </span>
                        </th>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {professional.current_job === "null" ? (
                            ""
                          ) : (
                            <>{professional.current_job}</>
                          )}
                        </td>
                        <td className={sharedStyles.tableItem}>
                          <div>{professional.current_company}</div>
                        </td>
                        <td className={sharedStyles.tableItem}>
                          {professional.created_at}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </STContainer>
      </InfiniteScroller>
    </>
  );
};

const ContactsList = ({
  contacts,
  setContacts,
  loadMore,
  hasMore,
  changeFilters,
  search,
  setSearch,
  ogIds,
  modalType,
}) => {
  const [selectAll, setSelectAll] = useState(undefined);
  useEffect(() => {
    if (contacts) {
      if (selectAll === undefined) {
        if (
          modalType === "edit_list" ||
          modalType === "create_with_contacts" ||
          modalType === "add_contacts_to_list"
        ) {
          setSelectAll(true);
        } else {
          setSelectAll(false);
        }
      } else {
        let newContacts = [...contacts];
        newContacts = newContacts.map((cont) => {
          return { ...cont, selected: selectAll };
        });
        setContacts(newContacts);
      }
    }
  }, [selectAll]);

  const selectContact = (index) => {
    let newContacts = [...contacts];
    newContacts[index].selected = newContacts[index].selected ? false : true;
    setContacts(newContacts);
  };
  return (
    <>
      <div
        className={sharedStyles.container}
        style={{
          borderBottom: "1px solid #eee",
          borderRadius: "0",
          boxShadow: "none",
          background: "#eee",
        }}
      >
        <div
          className="leo-flex"
          style={{
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <FilterV2
            source="contact"
            returnFilters={(newFilters) => changeFilters(newFilters)}
          />
          <div className={styles.inputContainer}>
            <div>
              <input
                className={styles.searchNetwork}
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  boxShadow: "0 1px 2px 0 rgba(0,0,0,0.1)",
                  background: "white",
                  marginLeft: "10px",
                }}
              />

              <li className="fas fa-search search" />
            </div>
          </div>
        </div>
      </div>
      <InfiniteScroller
        fetchMore={loadMore}
        hasMore={hasMore}
        dataLength={contacts.length}
        scrollableTarget={"modal-container-scroll"}
      >
        <STContainer id="modal-container-scroll">
          <table className="table table-borderless">
            <thead>
              <tr>
                <th scope="col" className={sharedStyles.tableItemCheckBox}>
                  <Checkbox
                    active={selectAll}
                    onClick={() => setSelectAll(!selectAll)}
                  />
                </th>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Contact Name 1
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
                  if (
                    modalType === "add_users" &&
                    ogIds &&
                    ogIds.length > 0 &&
                    ogIds.indexOf(contact.id) !== -1
                  ) {
                    return null;
                  }
                  return (
                    <tr key={`contact_${index}`} className="table-row-hover">
                      <td className={sharedStyles.tableItem}>
                        <Checkbox
                          active={contact.selected}
                          onClick={() => selectContact(index)}
                        />
                      </td>
                      <th scope="row" className={sharedStyles.tableItemFirst}>
                        {contact.name}
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
                        {spacetime(contact.created_at).format(
                          "{date} {month-short} {year}"
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </STContainer>
      </InfiniteScroller>
    </>
  );
};

const CandidatesViewList = ({ candidates, loadMore, hasMore, store }) => (
  <InfiniteScroller
    fetchMore={loadMore}
    hasMore={hasMore}
    dataLength={candidates?.length || 0}
    scrollableTarget={"modal-container-scroll"}
  >
    <STContainer id="modal-container-scroll">
      <div className="table-responsive">
        <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col" className={sharedStyles.tableHeader}>
                Candidate Name
              </th>
              <th scope="col" className={sharedStyles.tableHeader}>
                Current Job Title
              </th>
              <th scope="col" className={sharedStyles.tableHeader}>
                Current Company
              </th>
              <th scope="col" className={sharedStyles.tableDate}>
                Date Added
              </th>
            </tr>
          </thead>
          <tbody>
            {candidates &&
              candidates.map((professional, index) => {
                return (
                  <tr key={`professional_${index}`}>
                    <th scope="row" className={sharedStyles.tableItemFirst}>
                      <RecipientDetails>
                        <AvatarIcon
                          name={professional.name}
                          imgUrl={professional.avatar}
                          size={30}
                        />
                        <STLink
                          to={ROUTES.CandidateProfile.url(
                            store.company.mention_tag,
                            professional.professional_id
                          )}
                        >
                          {professional.name}{" "}
                          <EmailSpan>{professional.email}</EmailSpan>
                        </STLink>
                      </RecipientDetails>
                    </th>
                    <td
                      className={sharedStyles.tableItem}
                      style={{ overflow: "hidden" }}
                    >
                      {professional.current_job === "null" ? (
                        ""
                      ) : (
                        <>{professional.current_job}</>
                      )}
                    </td>
                    <td className={sharedStyles.tableItem}>
                      <div>{professional.current_company}</div>
                    </td>
                    <td className={sharedStyles.tableItem}>
                      {professional.created_at}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </STContainer>
  </InfiniteScroller>
);
const ContactsViewList = ({ contacts, loadMore, hasMore, store }) => (
  <InfiniteScroller
    fetchMore={loadMore}
    hasMore={hasMore}
    dataLength={contacts.length}
    scrollableTarget={"modal-container-scroll"}
  >
    <STContainer id="modal-container-scroll">
      <table className="table table-borderless">
        <thead>
          <tr>
            <th scope="col" className={sharedStyles.tableHeader}>
              Contact Name 2
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
                    <RecipientDetails>
                      <AvatarIcon
                        name={contact.name}
                        imgUrl={contact.avatar}
                        size={30}
                      />
                      <STLink
                        to={ROUTES.ContactProfile.url(
                          store.company.mention_tag,
                          contact.id
                        )}
                      >
                        {contact.name} <EmailSpan>{contact.email}</EmailSpan>
                      </STLink>
                    </RecipientDetails>
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
                    {spacetime(contact.created_at).format(
                      "{date} {month-short} {year}"
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </STContainer>
  </InfiniteScroller>
);

export const STContainer = styled.div`
  max-height: 500px;
  overflow: auto;
`;

const RecipientDetails = styled.div`
  align-items: center;
  display: flex;
`;

const EmailSpan = styled.span`
  color: #74767b;
  display: inline;
  font-weight: 400;
  margin-left: 5px;
`;
const STLink = styled(Link)`
  color: #1e1e1e;
  font-weight: 500;
  margin-left: 10px;
`;
