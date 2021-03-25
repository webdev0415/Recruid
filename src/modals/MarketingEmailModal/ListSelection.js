import React, { useState, useEffect } from "react";
// PACKAGES
import spacetime from "spacetime";
import notify from "notifications";
import styled from "styled-components";
// COMPONENTS
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import Checkbox from "sharedComponents/Checkbox";
// FUNCTIONS
import { getReceiversLists } from "helpersV2/marketing/receivers";
// STYLES
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";

import { fetchNetwork } from "helpersV2/candidates";
import { fetchContactList } from "helpers/crm/contacts";
import Spinner from "sharedComponents/Spinner";

const ListSelection = ({
  store,
  source,
  setEmailSource,
  setView,
  selectedJob,
  participants,
  setParticipants,
}) => {
  const [isPending, setIsPending] = useState(false);
  const [receiversLists, setReceiversLists] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [selectedReceiverType, setSelectedReceiverType] = useState(undefined);

  useEffect(() => {
    if (!receiversLists) {
      const abortController = new AbortController();
      const { signal } = abortController;
      if ((store.company.id, store.session))
        (async (companyId, session, signal) => {
          setIsPending(true);
          const receiversListsData = await getReceiversLists(
            companyId,
            store.session,
            signal
          );
          if (receiversListsData.error) {
            setIsPending(false);
            return notify("danger", receiversListsData.message);
          }
          setReceiversLists(receiversListsData);
          return setIsPending(false);
        })(store.company.id, store.session, signal);
    }
  }, [store.company, store.session, receiversLists]);

  const selectList = (idx) => {
    const newLists = [...receiversLists];
    //eslint-disable-next-line
    newLists[idx].selected = !Boolean(newLists[idx].selected);
    if (
      !source &&
      newLists[idx].receiver_type === "ProfessionalTalentNetwork" &&
      selectedReceiverType !== "ProfessionalTalentNetwork"
    ) {
      setSelectedReceiverType("ProfessionalTalentNetwork");
    }
    if (
      !source &&
      newLists[idx].receiver_type === "Contact" &&
      selectedReceiverType !== "Contact"
    ) {
      setSelectedReceiverType("Contact");
    }
    setReceiversLists(newLists);
  };

  useEffect(() => {
    if (!source && selectedReceiverType) {
      const newLists = [...receiversLists];
      setReceiversLists(
        newLists.map((list) => {
          if (!list.selected || list.receiver_type === selectedReceiverType) {
            return list;
          } else {
            return { ...list, selected: false };
          }
        })
      );
    }
  }, [source, selectedReceiverType]);

  const addReceivers = () => {
    if (receiversLists && receiversLists.length > 0 && loading === false) {
      setLoading(true);
      let selectedLists = receiversLists.filter((list) => list.selected);
      let addedReceivers = [];
      let receiversIds = [
        ...participants.map((part) => part.ptn_id || part.id),
      ];
      selectedLists.map((list) => {
        list.list.map((receiver) => {
          if (receiversIds.indexOf(receiver.id) === -1) {
            addedReceivers.push(receiver.id);
            receiversIds.push(receiver.id);
          }
          return null;
        });
        return null;
      });
      if (addedReceivers.length > 0) {
        if (
          source === "candidate" ||
          selectedReceiverType === "ProfessionalTalentNetwork"
        ) {
          if (!source) {
            setEmailSource("candidate");
          }
          fetchNewCandidates(addedReceivers);
        } else if (source === "contact" || selectedReceiverType === "Contact") {
          if (!source) {
            setEmailSource("contact");
          }
          fetchNewContacts(addedReceivers);
        }
      } else {
        setLoading(false);
        setView("confirm-participants");
      }
    }
  };

  const fetchNewContacts = (addedReceivers) => {
    fetchContactList(store.session, {
      slice: [0, addedReceivers.length],
      company_id: store.company.id,
      operator: "and",
      id: addedReceivers,
    }).then((res) => {
      if (!res.err) {
        setParticipants([
          ...participants,
          ...res.map((cont) => {
            return { ...cont, selected: true };
          }),
        ]);
        setLoading(false);
        setView("confirm-participants");
      } else {
        notify("danger", "Unable to fetch contacts");
      }
    });
  };

  const fetchNewCandidates = (addedReceivers) => {
    fetchNetwork(store.session, store.company.id, {
      slice: [0, addedReceivers.length],
      operator: "and",
      id: addedReceivers,
      team_member_id: store.role.team_member.team_member_id,
    }).then((talentNetwork) => {
      if (!talentNetwork.err) {
        setParticipants([
          ...participants,
          ...talentNetwork.results.map((cand) => {
            return { ...cand, selected: true };
          }),
        ]);
        setLoading(false);
        setView("confirm-participants");
      } else {
        notify("danger", talentNetwork);
      }
    });
  };

  return (
    <>
      {isPending || loading ? (
        <Spinner style={{ minHeight: "200px" }} />
      ) : (
        <>
          {receiversLists?.length ? (
            <>
              {!source && <p>Candidate Lists</p>}
              {(!source || source === "candidate") && (
                <ListsTable
                  receiversLists={receiversLists}
                  source="candidate"
                  selectList={selectList}
                />
              )}
              {!source && <p>Contacts Lists</p>}
              {(!source || source === "contact") && (
                <ListsTable
                  receiversLists={receiversLists}
                  source="contact"
                  selectList={selectList}
                />
              )}
            </>
          ) : (
            <div />
          )}
        </>
      )}
      <Footer>
        <div>
          <button
            type="button"
            className="button button--default button--grey-light"
            onClick={() => {
              if (selectedJob) {
                setView("select-job");
              } else {
                setView("initial");
              }
            }}
          >
            Back
          </button>
          <button
            type="button"
            className="button button--default button--primary"
            onClick={() => addReceivers()}
          >
            Add
          </button>
        </div>
      </Footer>
    </>
  );
};

const ListsTable = ({ receiversLists, source, selectList }) => (
  <InfiniteScroller
    fetchMore={() => {}}
    hasMore={false}
    dataLength={receiversLists.length}
    scrollableTarget={"modal-container-scroll"}
  >
    <TableScroll id="modal-container-scroll">
      <div className={styles.container}>
        <div className="table-responsive">
          <table className="table table-borderless">
            <thead>
              <tr>
                <th scope="col" className={sharedStyles.tableItemCheckBox} />
                <>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    List Name
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Users
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Created At
                  </th>
                </>
              </tr>
            </thead>
            <tbody>
              {receiversLists.map((list, idx) => {
                if (
                  source === "contact" &&
                  list.receiver_type === "ProfessionalTalentNetwork"
                ) {
                  return null;
                }
                if (
                  source === "candidate" &&
                  list.receiver_type === "Contact"
                ) {
                  return null;
                }
                return (
                  <tr
                    key={`receivers-list-row-#${idx + 1}`}
                    className="table-row-hover"
                  >
                    <td className={sharedStyles.tableItem}>
                      <Checkbox
                        active={list.selected}
                        onClick={() => selectList(idx)}
                      />
                    </td>
                    <td className={sharedStyles.tableItemFirst}>
                      <>{list.name}</>
                    </td>
                    <td className={sharedStyles.tableItem}>
                      {list.list.length}
                    </td>
                    <td className={sharedStyles.tableItem}>
                      {spacetime(list.created_at).format(
                        "{date} {month-short}, {year}"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </TableScroll>
  </InfiniteScroller>
);

const TableScroll = styled.div`
  max-height: 500px;
  min-height: 200px;
  overflow: auto;
  margin: 0px 30px;
`;

const Footer = styled.div`
  padding-top: 30px;
  border-top: solid #eee 1px;

  div {
    button:first-of-type {
      margin-right: 10px;
    }
  }
`;

export default ListSelection;
