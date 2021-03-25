import React, { useState, useEffect } from "react";
// PACKAGES
import spacetime from "spacetime";
import notify from "notifications";
// COMPONENTS
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import Checkbox from "sharedComponents/Checkbox";
// FUNCTIONS
import { getReceiversLists } from "helpersV2/marketing/receivers";
// STYLES
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import Spinner from "sharedComponents/Spinner";

const SelectExistingList = ({ store, modalType, setList, activeList }) => {
  const [isPending, setIsPending] = useState(false);
  const [receiversLists, setReceiversLists] = useState([]);

  useEffect(() => {
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
  }, [store.company, store.session]);

  return (
    <>
      {isPending ? (
        <Spinner />
      ) : (
        <>
          {receiversLists?.length ? (
            <>
              <InfiniteScroller
                fetchMore={() => {}}
                hasMore={false}
                dataLength={receiversLists.length}
              >
                <div className={styles.container}>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className={sharedStyles.tableItemCheckBox}
                          />
                          <>
                            <th
                              scope="col"
                              className={sharedStyles.tableHeader}
                            >
                              List Name
                            </th>
                            <th
                              scope="col"
                              className={sharedStyles.tableHeader}
                            >
                              Users
                            </th>
                            <th
                              scope="col"
                              className={sharedStyles.tableHeader}
                            >
                              Created At
                            </th>
                          </>
                        </tr>
                      </thead>
                      <tbody>
                        {receiversLists.map((list, idx) => {
                          if (
                            modalType === "add_contacts_to_list" &&
                            list.receiver_type === "ProfessionalTalentNetwork"
                          ) {
                            return null;
                          }
                          if (
                            modalType === "add_candidates_to_list" &&
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
                                  active={activeList.id === list.id}
                                  onClick={() => setList(list)}
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
              </InfiniteScroller>
            </>
          ) : (
            <div />
          )}
        </>
      )}
    </>
  );
};

export default SelectExistingList;
