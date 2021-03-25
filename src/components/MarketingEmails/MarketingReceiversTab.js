import React, { useState, useEffect } from "react";
// PACKAGES
import spacetime from "spacetime";
import notify from "notifications";
import styled from "styled-components";
// COMPONENTS
import { ATSContainer } from "styles/PageContainers";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import SearchInput from "sharedComponents/SearchInput";
// import SelectDropdown from "sharedComponents/SelectDropdown";
import Checkbox from "sharedComponents/Checkbox";
import {
  ExtensionMenu,
  ExtensionMenuOption,
} from "sharedComponents/ExtensionMenu";
// FUNCTIONS
import {
  getReceiversLists,
  deleteReceiversList,
} from "helpersV2/marketing/receivers";
import { dateOptions } from "constants/filtersOptions";
import { PermissionChecker } from "constants/permissionHelpers";
// STYLES
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";

import CreateListModal from "modals/CreateListModal";
import ConfirmModalV2 from "modals/ConfirmModalV2";
import EmptyTab from "components/Profiles/components/EmptyTab";
import MarketingEmailModal from "modals/MarketingEmailModal";
import { fetchNetwork } from "helpersV2/candidates";
import { fetchContactList } from "helpers/crm/contacts";
import Spinner from "sharedComponents/Spinner";
import MarketingReceiversActionBar from "components/MarketingEmails/ActionBar/MarketingReceiversActionBar";
import { EmptyContacts } from "assets/svg/EmptyImages";
const sourceExchanger = {
  ProfessionalTalentNetwork: "candidate",
  Contact: "contact",
};

export const MarketingReceiversTab = ({
  store,
  activeModal,
  setActiveModal,
  permission,
}) => {
  const [isPending, setIsPending] = useState(false);
  const [receiversLists, setReceiversLists] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTotal, setSelectedTotal] = useState(0);
  // FILTERS
  const [search, setSearch] = useState("");
  const [
    member,
    // setMember
  ] = useState(undefined);
  const [
    dateBoundary,
    // setDateBoundary
  ] = useState(dateOptions[dateOptions.length - 1]);
  const [activeList, setActiveList] = useState(undefined);
  const [activeSource, setActiveSource] = useState(undefined);
  const [refresh, setRefresh] = useState(undefined);
  const [activeReceivers, setActiveReceivers] = useState(undefined);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    if (store.company.id && store.session && permission.view)
      (async (companyId, session, signal) => {
        setIsPending(true);
        const receiversListsData = await getReceiversLists(
          companyId,
          store.session,
          signal,
          { search }
        );
        if (receiversListsData.error) {
          setIsPending(false);
          return notify("danger", receiversListsData.message);
        }
        setReceiversLists(receiversListsData);
        return setIsPending(false);
      })(store.company.id, store.session, signal);
  }, [
    store.company,
    store.session,
    refresh,
    search,
    dateBoundary,
    member,
    permission,
  ]);

  useEffect(() => {
    setReceiversLists((lists) =>
      lists.map((list) => ({ ...list, selected: selectAll }))
    );
    setSelectedTotal(selectAll ? receiversLists.length : 0);
  }, [selectAll]);

  const selectList = (idx) => () => {
    const newLists = [...receiversLists];
    //eslint-disable-next-line
    newLists[idx].selected = !Boolean(newLists[idx].selected);
    setReceiversLists(newLists);
    setSelectedTotal(
      newLists[idx].selected ? selectedTotal + 1 : selectedTotal - 1
    );
  };

  // const handleSelectChange = (setFunc) => (option) => setFunc(option);

  const getReceiversType = (listType) => {
    switch (listType) {
      case "ProfessionalTalentNetwork":
        return "Candidates";
      case "Contact":
        return "Contacts";
      case "Client":
        return "Clients";
      default:
        return "";
    }
  };

  const removeList = () => {
    deleteReceiversList(store.company.id, store.session, [activeList.id]).then(
      (res) => {
        if (!res.err) {
          notify("info", "List succesfully removed");
          let newLists = [...receiversLists];
          newLists.splice(activeList.array_index, 1);
          setReceiversLists(newLists);
          setActiveModal(undefined);
          setActiveList(undefined);
        } else {
          notify("danger", "Unable to delete list");
        }
      }
    );
  };

  const deleteMultiple = () => {
    deleteReceiversList(store.company.id, store.session, [
      receiversLists.filter((list) => list.selected).map((list) => list.id),
    ]).then((res) => {
      if (!res.err) {
        notify("info", "Lists succesfully removed");
        let newLists = [...receiversLists];
        newLists = newLists.filter((list) => !list.selected);
        setReceiversLists(newLists);
        setSelectedTotal(0);
        setActiveModal(undefined);
        setActiveList(undefined);
      } else {
        notify("danger", "Unable to delete lists");
      }
    });
  };

  const clearSelected = () => {
    // let newContacts = [...contacts];
    // newContacts = newContacts.map((contact) => {
    //   contact.selected = false;
    //   return contact;
    // });
    // setSelectAll(false);
    // setContacts(newContacts);
  };

  const prepareEmailReceivers = (singleList) => {
    let receiverIds = [];
    let receiverType;
    if (singleList) {
      setActiveSource(sourceExchanger[singleList.receiver_type]);
      receiverType = singleList.receiver_type;
      singleList.list.map((rec) =>
        receiverIds.indexOf(rec.id) === -1 ? receiverIds.push(rec.id) : null
      );
    } else {
      let selectedLists = receiversLists.filter((list) => list.selected);
      let i = 0;
      let error = false;
      while (i <= selectedLists.length - 1 && error === false) {
        if (receiverType === undefined) {
          receiverType = selectedLists[i].receiver_type;
          setActiveSource(sourceExchanger[selectedLists[i].receiver_type]);
        } else if (selectedLists[i].receiver_type !== receiverType) {
          error = true;
        }
        if (error !== true) {
          selectedLists[i].list.map((rec) =>
            receiverIds.indexOf(rec.id) === -1 ? receiverIds.push(rec.id) : null
          );
        }
        i++;
      }
      if (error) {
        return notify(
          "danger",
          "You have selected lists with different receiver types"
        );
      }
    }
    setActiveModal("create-email");
    if (receiverType === "ProfessionalTalentNetwork") {
      fetchNetwork(store.session, store.company.id, {
        slice: [0, receiverIds.length],
        operator: "and",
        id: receiverIds,
        team_member_id: store.role.team_member.team_member_id,
      }).then((talentNetwork) => {
        if (!talentNetwork.err) {
          setActiveReceivers(
            talentNetwork.results.map((cand) => {
              return { ...cand, selected: true };
            })
          );
        } else {
          notify("danger", talentNetwork);
        }
      });
    } else if (receiverType === "Contact") {
      fetchContactList(store.session, {
        slice: [0, receiverIds.length],
        company_id: store.company.id,
        operator: "and",
        id: receiverIds,
      }).then((res) => {
        if (!res.err) {
          setActiveReceivers(
            res.map((cont) => {
              return { ...cont, selected: true };
            })
          );
        } else {
          notify("danger", "Unable to fetch contacts");
        }
      });
    }
  };

  return (
    <>
      <MarketingReceiversActionBar
        selectedTotal={selectedTotal}
        store={store}
        openModal={setActiveModal}
        activeModal={activeModal}
        prepareEmailReceivers={prepareEmailReceivers}
      />
      <ATSContainer>
        <FilterContainer className="leo-flex-center-between">
          <div className="search-container">
            <SearchInput
              value={search}
              onChange={(val) => setSearch(val)}
              placeholder="Search..."
            />
          </div>
          {/* <div className="filters-container">
            <div className="separate">
              <SelectDropdown
                name={member?.name || "All Members"}
                options={store.teamMembers}
                onSelect={handleSelectChange(setMember)}
              />
            </div>
            <div className="separate">
              <SelectDropdown
                name={dateBoundary.name || "Select a filter"}
                options={dateOptions}
                onSelect={handleSelectChange(setDateBoundary)}
              />
            </div>
          </div> */}
        </FilterContainer>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            {receiversLists?.length ? (
              <>
                <InfiniteScroller
                  fetchMore={() => {}}
                  hasMore={() => {}}
                  dataLength={receiversLists.length}
                >
                  <div className={styles.container}>
                    <div className="table-responsive">
                      <table className="table table-borderless">
                        <thead>
                          <tr>
                            <PermissionChecker
                              valid={{ marketer: true }}
                              type="edit"
                            >
                              <th
                                scope="col"
                                className={sharedStyles.tableItemCheckBox}
                              >
                                <Checkbox
                                  active={selectAll}
                                  onClick={() => setSelectAll(!selectAll)}
                                />
                              </th>
                            </PermissionChecker>
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
                              List Type
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
                            <PermissionChecker
                              valid={{ marketer: true }}
                              type="edit"
                            >
                              <th
                                scope="col"
                                className={sharedStyles.tableHeader}
                              />
                            </PermissionChecker>
                          </tr>
                        </thead>
                        <tbody>
                          {receiversLists.map((list, idx) => (
                            <tr
                              key={`receivers-list-row-#${idx + 1}`}
                              className="table-row-hover"
                            >
                              <PermissionChecker
                                valid={{ marketer: true }}
                                type="edit"
                              >
                                <td className={sharedStyles.tableItem}>
                                  <Checkbox
                                    active={list.selected}
                                    onClick={selectList(idx)}
                                  />
                                </td>
                              </PermissionChecker>
                              <td className={sharedStyles.tableItemFirst}>
                                {list.list.length > 0 ? (
                                  <button
                                    onClick={() => {
                                      setActiveList(list);
                                      setActiveModal("view_list");
                                    }}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {list.name}
                                  </button>
                                ) : (
                                  <>{list.name}</>
                                )}
                              </td>
                              <td className={sharedStyles.tableItem}>
                                {getReceiversType(list.receiver_type)}
                              </td>
                              <td className={sharedStyles.tableItem}>
                                {list.list.length}
                              </td>
                              <td className={sharedStyles.tableItem}>
                                {spacetime(list.created_at).format(
                                  "{date} {month-short}, {year}"
                                )}
                              </td>
                              <PermissionChecker
                                valid={{ marketer: true }}
                                type="edit"
                              >
                                <td className={sharedStyles.tableItemStatus}>
                                  <ExtensionMenu>
                                    {list.list.length > 0 && (
                                      <ExtensionMenuOption
                                        onClick={() => {
                                          setActiveList(list);
                                          prepareEmailReceivers(list);
                                        }}
                                      >
                                        Send Email
                                      </ExtensionMenuOption>
                                    )}
                                    <ExtensionMenuOption
                                      onClick={() => {
                                        setActiveList(list);
                                        setActiveModal("add_users_modal");
                                      }}
                                    >
                                      Add {getReceiversType(list.receiver_type)}
                                    </ExtensionMenuOption>
                                    <ExtensionMenuOption
                                      onClick={() => {
                                        setActiveList(list);
                                        setActiveModal("edit_list");
                                      }}
                                    >
                                      Edit List
                                    </ExtensionMenuOption>
                                    {(store.role?.role_permissions.owner ||
                                      (store.role?.role_permissions.admin &&
                                        store.role?.role_permissions
                                          .marketer)) && (
                                      <ExtensionMenuOption
                                        onClick={() => {
                                          setActiveList({
                                            ...list,
                                            array_index: idx,
                                          });
                                          setActiveModal("remove-list");
                                        }}
                                      >
                                        Delete List
                                      </ExtensionMenuOption>
                                    )}
                                  </ExtensionMenu>
                                </td>
                              </PermissionChecker>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </InfiniteScroller>
                {receiversLists && receiversLists.length === 0 && (
                  <div style={{ marginTop: 20 }}>
                    <EmptyTab
                      data={receiversLists}
                      title={"You have no lists!"}
                      copy={"Why not create one?"}
                      image={<EmptyContacts />}
                      action={
                        permission.edit
                          ? () => setActiveModal("create_list_modal")
                          : undefined
                      }
                      actionText={"Create List"}
                    />
                  </div>
                )}
              </>
            ) : (
              <div />
            )}
          </>
        )}
        {activeModal === "create_list_modal" && (
          <CreateListModal
            hide={() => setActiveModal(undefined)}
            modalType="create"
            refreshList={() => setRefresh(Math.random())}
          />
        )}
        {activeModal === "create-email" && activeSource && (
          <MarketingEmailModal
            hide={() => {
              setActiveModal(undefined);
              setActiveList(undefined);
              setActiveSource(undefined);
              setActiveReceivers(undefined);
              clearSelected();
            }}
            receivers={activeReceivers}
            source={activeSource}
          />
        )}
        {activeModal === "add_users_modal" && activeList && (
          <CreateListModal
            hide={() => {
              setActiveModal(undefined);
              setActiveList(undefined);
            }}
            modalType="add_users"
            refreshList={() => setRefresh(Math.random())}
            originalReceivers={[...activeList.list]}
            editingList={activeList}
          />
        )}
        {activeModal === "edit_list" && activeList && (
          <CreateListModal
            hide={() => {
              setActiveModal(undefined);
              setActiveList(undefined);
            }}
            modalType="edit_list"
            refreshList={() => setRefresh(Math.random())}
            originalReceivers={[...activeList.list]}
            editingList={activeList}
          />
        )}
        {activeModal === "view_list" && activeList && (
          <CreateListModal
            hide={() => {
              setActiveModal(undefined);
              setActiveList(undefined);
            }}
            modalType="view_list"
            refreshList={() => setRefresh(Math.random())}
            originalReceivers={[...activeList.list]}
            editingList={activeList}
          />
        )}
        {activeModal === "remove-list" && activeList !== undefined && (
          <ConfirmModalV2
            show={true}
            hide={() => {
              setActiveModal(undefined);
              setActiveList(undefined);
            }}
            header={"Remove List"}
            text={"Are you sure you want to remove this list?"}
            actionText="Remove"
            actionFunction={removeList}
            id="remove-list"
          />
        )}
        {activeModal === "delete-multiple" && (
          <ConfirmModalV2
            show={true}
            hide={() => {
              setActiveModal(undefined);
            }}
            header="Remove Lists"
            text={"Are you sure you want to remove these lists?"}
            actionText="Remove"
            actionFunction={deleteMultiple}
            id="remove-multiple"
          />
        )}
      </ATSContainer>
    </>
  );
};

const FilterContainer = styled.div`
  margin-bottom: 12px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  padding: 10px 15px;

  .search-container {
    width: 200px;
  }
`;

export default MarketingReceiversTab;
