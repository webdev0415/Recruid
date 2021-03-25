import React, { useState, useEffect } from "react";
import styled from "styled-components";
import notify from "notifications";
import spacetime from "spacetime";
import { ATSContainer } from "styles/PageContainers";
import { Link } from "react-router-dom";
import { ROUTES } from "routes";
import {
  ExtensionMenu,
  ExtensionMenuOption,
} from "sharedComponents/ExtensionMenu";
import Checkbox from "sharedComponents/Checkbox";
import SearchInput from "sharedComponents/SearchInput";
import SelectDropdown from "sharedComponents/SelectDropdown";
import EmptyTab from "components/Profiles/components/EmptyTab";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import ConfirmModalV2 from "modals/ConfirmModalV2";
import MarketingEmailModal from "modals/MarketingEmailModal";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { PermissionChecker } from "constants/permissionHelpers";
import {
  fetchGetEmails,
  fetchDeleteEmail,
  fetchEditEmail,
  fetchArchiveToggle,
  // getEmailsStats,
} from "helpersV2/marketing/emails";
import { fetchNetwork } from "helpersV2/candidates";
import { fetchContactList } from "helpers/crm/contacts";
import { fetchCompaniesList } from "helpers/crm/clientCompanies";
import { dateOptions } from "constants/filtersOptions";
import Spinner from "sharedComponents/Spinner";
import MarketingEmailsActionBar from "components/MarketingEmails/ActionBar/MarketingEmailsActionBar";
import { EmptyContacts } from "assets/svg/EmptyImages";
const emailOptions = [
  { prop: "all", name: "All Emails" },
  { prop: "draft", name: "Draft" },
  { prop: "sent", name: "Sent" },
];

const FETCH_ARRAY_LENGTH = 10;
// const ENV =
//   process.env.REACT_APP_API === "https://api.recruitd.co.uk"
//     ? "live"
//     : "staging";
// const UPDATE_BOUNDARY = new Date(
//   "Tue Jun 09 2020 15:51:23 GMT+0100 (British Summer Time)"
// ); // DATE MAKS CHANGED CATEGORIES FOR MARKETING EMAILS (IN 10 YEARS IT'LL BE IN THE HISTORY CURRRICULUM)

const MarketingEmailsTab = ({
  store,
  setRedirect,
  activeModal,
  setActiveModal,
  permission,
}) => {
  const [emails, setEmails] = useState(undefined);
  // const [stats, setStats] = useState({});
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState("");
  const [dateBoundary, setDateBoundary] = useState(
    dateOptions[dateOptions.length - 1]
  );
  const [member, setMember] = useState("All Users");
  const [status, setStatus] = useState(emailOptions[0]);
  const [loaded, setLoaded] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const [emailIndex, setEmailIndex] = useState(undefined);
  const [deleting, setDeleting] = useState(false);
  const controller = new AbortController();
  const signal = controller.signal;
  const [refresh, setRefresh] = useState(Math.random());
  const [activeReceivers, setActiveReceivers] = useState(undefined);
  const [receiverType, setReceiverType] = useState(undefined);
  const [archiveState, setArchiveState] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //fetch emails
    if (store.company && permission.view) {
      setLoading(true);
      fetchGetEmails(
        store.session,
        store.company.id,
        {
          member: member?.team_member_id,
          sent_at: dateBoundary.prop,
          is_draft: status.prop,
          search: search?.length > 0 ? search : undefined,
          archive: archiveState,
        },
        [0, FETCH_ARRAY_LENGTH],
        signal
      ).then((res) => {
        setLoading(false);
        if (!res.err) {
          setEmails(res);
          if (res.length === FETCH_ARRAY_LENGTH) {
            loadMore(res);
          }
          setLoaded(true);
          setSelectedTotal(0);
          setSelectAll(false);
        } else if (!signal.aborted) {
          setEmails(false);
          notify("danger", "Unable to fetch emails");
        }
      });
    }
    return () => controller.abort();
  }, [store.session, store.company, refresh, archiveState, permission, search]);

  // GET EMAILS STATS
  // useEffect(() => {
  //   if (emails?.length) {
  //     (async (company, session, emails) => {
  //       const sliceStart = emails.length - FETCH_ARRAY_LENGTH;
  //       const fetchedSlice = emails.slice(sliceStart, emails.length);
  //       const emailsCategories = fetchedSlice
  //         .filter((obj) => !obj.email.is_draft)
  //         .map((email) => {
  //           const sentAtBoundary = new Date(email.email.updated_at);
  //           if (sentAtBoundary.getTime() < UPDATE_BOUNDARY.getTime()) {
  //             return `email-${email.email.id}`;
  //           }
  //           return `${ENV}-email-${email.email.uuid}`;
  //         });
  //       const stats = await getEmailsStats(
  //         company.id,
  //         session,
  //         emailsCategories
  //       );
  //       if (!stats || stats.err) return notify("danger", stats.data);
  //       return setStats((prevStats) => ({ ...prevStats, ...stats }));
  //     })(store.company, store.session, emails);
  //   }
  // }, [emails, store.company, store.session]);

  const loadMore = (response) => {
    fetchGetEmails(
      store.session,
      store.company.id,
      {
        member: member?.team_member_id,
        sent_at: dateBoundary.prop,
        is_draft: status.prop,
        search: search?.length > 0 ? search : undefined,
        archive: archiveState,
      },
      [response?.length || emails?.length, FETCH_ARRAY_LENGTH],
      signal
    ).then((res) => {
      if (!res.err) {
        setEmails([...(response ? response : emails), ...res]);
        setHasMore(res.length === FETCH_ARRAY_LENGTH);
      } else if (!signal.aborted) {
        notify("danger", "Unable to fetch emails");
      }
    });
  };

  useEffect(() => {
    if (emails) {
      let newEmails = [...emails];
      newEmails = newEmails.map((email) => {
        return { ...email, selected: selectAll };
      });
      setSelectedTotal(selectAll ? emails.length : 0);
      setEmails(newEmails);
    }
  }, [selectAll]);

  const selectEmail = (index) => {
    let newEmails = [...emails];
    newEmails[index].selected = newEmails[index].selected ? false : true;
    setSelectedTotal(
      newEmails[index].selected ? selectedTotal + 1 : selectedTotal - 1
    );
    setEmails(newEmails);
  };

  const removeEmail = () => {
    setDeleting(true);
    fetchDeleteEmail(store.session, store.company.id, [
      emails[emailIndex].email.id,
    ]).then((res) => {
      if (!res.err) {
        notify("info", "Email succesfully removed");
        let newEmails = [...emails];
        newEmails.splice(emailIndex, 1);
        setEmails(newEmails);
        setDeleting(false);
        setActiveModal(undefined);
        setEmailIndex(undefined);
      } else {
        notify("danger", res);
      }
    });
  };

  const deleteMultiple = () => {
    setDeleting(true);
    fetchDeleteEmail(
      store.session,
      store.company.id,
      emails.filter((email) => email.selected).map((email) => email.email.id)
    ).then((res) => {
      if (!res.err) {
        notify("info", "Emails succesfully removed");
        setRefresh(Math.random());
        setSelectAll(false);
        setSelectedTotal(0);
        setDeleting(false);
        setActiveModal(undefined);
      } else {
        notify("danger", res);
      }
    });
  };

  const archiveEmail = (bool) => {
    setDeleting(true);
    fetchArchiveToggle(
      store.session,
      store.company.id,
      [emails[emailIndex].email.id],
      bool
    ).then((res) => {
      if (!res.err) {
        notify("info", "Email succesfully archived");
        let newEmails = [...emails];
        newEmails.splice(emailIndex, 1);
        setEmails(newEmails);
        setDeleting(false);
        setActiveModal(undefined);
        setEmailIndex(undefined);
      } else {
        notify("danger", res);
      }
    });
  };

  const archiveMultiple = (bool) => {
    setDeleting(true);
    fetchArchiveToggle(
      store.session,
      store.company.id,
      emails.filter((email) => email.selected).map((email) => email.email.id),
      bool
    ).then((res) => {
      if (!res.err) {
        notify("info", "Emails succesfully archived");
        setRefresh(Math.random());
        setSelectAll(false);
        setSelectedTotal(0);
        setDeleting(false);
        setActiveModal(undefined);
      } else {
        notify("danger", res);
      }
    });
  };

  const handleFilterChange = (setFunc) => (option) => {
    setFunc(option);
    return setRefresh(Math.random());
  };

  const sendDraftEmail = (email) => {
    fetchEditEmail(store.session, store.company.id, email.id, {
      // ...email,
      is_draft: false,
    }).then((res) => {
      if (!res.err) {
        notify("info", "Email succesfully sent");
        setRefresh(Math.random());
      } else {
        notify("danger", "Unable to send email");
      }
    });
  };

  useEffect(() => {
    if (
      activeModal === "edit-email" &&
      emailIndex !== undefined &&
      emails[emailIndex] &&
      emails[emailIndex].email.receivers?.length > 0 &&
      store.session &&
      store.company &&
      store.role
    ) {
      let contact_ids = [];
      let company_ids = [];
      let candidate_ids = [];

      emails[emailIndex].email.receivers.map((receiv) => {
        if (receiv.type === "Client") {
          contact_ids.push(receiv.id);
        }
        if (receiv.type === "ProfessionalTalentNetwork") {
          candidate_ids.push(receiv.id);
        }
        if (receiv.type === "Company") {
          company_ids.push(receiv.id);
        }
        return null;
      });
      if (contact_ids.length > 0) {
        setReceiverType("contact");
        fetchContactList(store.session, {
          slice: [0, contact_ids.length],
          company_id: store.company.id,
          operator: "and",
          id: contact_ids,
        }).then((res) => {
          if (!res.err) {
            setActiveReceivers(
              res.map((receive) => {
                return { ...receive, selected: true };
              })
            );
          } else {
            notify("danger", "Unable to fetch contacts");
          }
        });
      }
      if (candidate_ids.length > 0) {
        setReceiverType("candidate");
        fetchNetwork(store.session, store.company.id, {
          slice: [0, candidate_ids.length],
          operator: "and",
          id: candidate_ids,
          team_member_id: store.role.team_member.team_member_id,
        }).then((talentNetwork) => {
          if (!talentNetwork.err) {
            setActiveReceivers(
              talentNetwork.results.map((receive) => {
                return { ...receive, selected: true };
              })
            );
          } else {
            notify("danger", talentNetwork);
          }
        });
      }
      if (company_ids.length > 0) {
        setReceiverType("client");
        fetchCompaniesList(store.session, {
          slice: [0, company_ids.length],
          company_id: store.company.id,
          operator: "and",
          id: company_ids,
        }).then((res) => {
          if (!res.err) {
            setActiveReceivers(
              res.map((receive) => {
                return { ...receive, selected: true };
              })
            );
          } else {
            notify("danger", "Unable to fetch companies");
          }
        });
      }
    }
  }, [emailIndex, store.session, store.company, activeModal, store.role]);

  return (
    <>
      <MarketingEmailsActionBar
        selectedTotal={selectedTotal}
        store={store}
        openModal={setActiveModal}
        activeModal={activeModal}
        archiveState={archiveState}
      />
      <ATSContainer>
        {!loaded && <Spinner />}
        {loaded && (
          <>
            <FilterContainer className="leo-flex-center-between">
              <div className="search-container">
                <SearchInput
                  value={search}
                  onChange={(val) => setSearch(val)}
                  placeholder="Search Emails..."
                />
              </div>
              <div className="filters-container leo-flex-center-between">
                <SelectDropdown
                  name={status.name || "Select a filter"}
                  options={emailOptions}
                  onSelect={handleFilterChange(setStatus)}
                />
                <div className="separate">
                  <SelectDropdown
                    name={member?.name || "All Members"}
                    options={store.teamMembers}
                    onSelect={handleFilterChange(setMember)}
                  />
                </div>
                <div className="separate">
                  <SelectDropdown
                    name={dateBoundary.name || "Select a filter"}
                    options={dateOptions}
                    onSelect={handleFilterChange(setDateBoundary)}
                  />
                </div>
              </div>
            </FilterContainer>
            <Menu>
              <ul className="leo-flex">
                <li>
                  <button
                    className={`option ${!archiveState ? "active" : ""}`}
                    onClick={() => setArchiveState(false)}
                  >
                    Emails
                  </button>
                </li>
                <li>
                  <button
                    className={`option ${archiveState ? "active" : ""}`}
                    onClick={() => setArchiveState(true)}
                  >
                    Archived Emails
                  </button>
                </li>
              </ul>
            </Menu>
            {emails && emails.length > 0 && (
              <>
                {loading ? (
                  <Spinner />
                ) : (
                  <InfiniteScroller
                    fetchMore={loadMore}
                    hasMore={hasMore}
                    dataLength={emails.length}
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
                                Email
                              </th>
                              <th
                                scope="col"
                                className={sharedStyles.tableHeader}
                              >
                                Status
                              </th>
                              <th
                                scope="col"
                                className={sharedStyles.tableHeader}
                              >
                                Open Rate
                              </th>
                              <th
                                scope="col"
                                className={sharedStyles.tableHeader}
                              >
                                Click Rate
                              </th>
                              <th
                                scope="col"
                                className={sharedStyles.tableHeader}
                              >
                                Recipients
                              </th>
                              <th
                                scope="col"
                                className={sharedStyles.tableHeader}
                              >
                                Sent
                              </th>
                              <th
                                scope="col"
                                className={sharedStyles.tableHeader}
                              ></th>
                            </tr>
                          </thead>
                          <tbody>
                            {emails &&
                              emails.map((email, index) => {
                                return (
                                  <tr
                                    key={`email-row-${index}`}
                                    className="table-row-hover"
                                  >
                                    <PermissionChecker
                                      valid={{ marketer: true }}
                                      type="edit"
                                    >
                                      <td className={sharedStyles.tableItem}>
                                        <Checkbox
                                          active={email.selected}
                                          onClick={() => selectEmail(index)}
                                        />
                                      </td>
                                    </PermissionChecker>
                                    <td className={sharedStyles.tableItemFirst}>
                                      <STlink
                                        to={ROUTES.EmailProfile.url(
                                          store.company.mention_tag,
                                          email.email.id
                                        )}
                                      >
                                        {email.email.subject}{" "}
                                      </STlink>
                                    </td>
                                    <td className={sharedStyles.tableItem}>
                                      {email.email.is_draft ? (
                                        <DraftButton className="label-draft">
                                          Draft
                                        </DraftButton>
                                      ) : (
                                        <DraftButton>Sent</DraftButton>
                                      )}
                                    </td>
                                    <td className={sharedStyles.tableItem}>
                                      {!email.email.is_draft && (
                                        <>
                                          {email?.stats?.unique_opens &&
                                          email?.email.receivers?.length
                                            ? Math.floor(
                                                (email?.stats?.unique_opens *
                                                  100) /
                                                  email?.email.receivers?.length
                                              )
                                            : 0}
                                          %
                                        </>
                                      )}
                                    </td>
                                    <td className={sharedStyles.tableItem}>
                                      {!email.email.is_draft && (
                                        <>
                                          {email?.stats?.unique_clicks &&
                                          email?.email.receivers?.length
                                            ? Math.floor(
                                                (email?.stats?.unique_clicks *
                                                  100) /
                                                  email?.email.receivers?.length
                                              )
                                            : 0}
                                          %
                                        </>
                                      )}
                                    </td>
                                    <td className={sharedStyles.tableItem}>
                                      {!email.email.is_draft && (
                                        <>{email?.email.receivers?.length}</>
                                      )}
                                    </td>
                                    <td className={sharedStyles.tableItem}>
                                      {email.email.is_draft
                                        ? ""
                                        : `${spacetime(
                                            email.email.updated_at
                                          ).format(
                                            "{date} {month-short}, {year}"
                                          )}`}
                                    </td>
                                    <td
                                      className={sharedStyles.tableItemStatus}
                                    >
                                      <ExtensionMenu>
                                        <ExtensionMenuOption
                                          onClick={() => {
                                            setRedirect(
                                              ROUTES.EmailProfile.url(
                                                store.company.mention_tag,
                                                email.email.id
                                              )
                                            );
                                          }}
                                        >
                                          View Email
                                        </ExtensionMenuOption>
                                        <PermissionChecker
                                          valid={{ marketer: true }}
                                          type="edit"
                                        >
                                          <>
                                            {email.email.is_draft && (
                                              <>
                                                <ExtensionMenuOption
                                                  onClick={() => {
                                                    setEmailIndex(index);
                                                    setActiveModal(
                                                      "edit-email"
                                                    );
                                                  }}
                                                >
                                                  Edit Email
                                                </ExtensionMenuOption>
                                                <ExtensionMenuOption
                                                  onClick={() => {
                                                    sendDraftEmail(email.email);
                                                  }}
                                                >
                                                  Send Email
                                                </ExtensionMenuOption>
                                              </>
                                            )}
                                            <ExtensionMenuOption
                                              onClick={() => {
                                                setActiveModal("archive-email");
                                                setEmailIndex(index);
                                              }}
                                            >
                                              {archiveState
                                                ? "Unarchive Email"
                                                : "Archive Email"}
                                            </ExtensionMenuOption>
                                            {(store.role?.role_permissions
                                              .owner ||
                                              (store.role?.role_permissions
                                                .admin &&
                                                store.role?.role_permissions
                                                  .marketer)) && (
                                              <ExtensionMenuOption
                                                onClick={() => {
                                                  setActiveModal(
                                                    "remove-email"
                                                  );
                                                  setEmailIndex(index);
                                                }}
                                              >
                                                Delete Email
                                              </ExtensionMenuOption>
                                            )}
                                          </>
                                        </PermissionChecker>
                                      </ExtensionMenu>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </InfiniteScroller>
                )}
              </>
            )}
            {emails && emails.length === 0 && (
              <div style={{ marginTop: 20 }}>
                <EmptyTab
                  data={emails}
                  title={"You have no emails!"}
                  copy={"Why not create one?"}
                  image={<EmptyContacts />}
                />
              </div>
            )}
          </>
        )}
      </ATSContainer>
      {activeModal === "create-email" && (
        <MarketingEmailModal
          hide={() => {
            setActiveModal(undefined);
          }}
          refreshList={() => setRefresh(Math.random())}
        />
      )}
      {activeModal === "edit-email" && emailIndex !== undefined && (
        <MarketingEmailModal
          hide={() => {
            setActiveModal(undefined);
            setEmailIndex(undefined);
            setActiveReceivers(undefined);
          }}
          refreshEmail={() => setRefresh(Math.random())}
          receivers={activeReceivers}
          source={receiverType}
          editingEmail={emails[emailIndex].email}
        />
      )}
      {activeModal === "remove-email" && emailIndex !== undefined && (
        <ConfirmModalV2
          show={true}
          hide={() => {
            setActiveModal(undefined);
            setEmailIndex(undefined);
          }}
          header={"Remove Email"}
          text={"Are you sure you want to remove this email?"}
          actionText="Remove"
          actionFunction={removeEmail}
          id="remove-email"
        />
      )}
      {activeModal === "delete-multiple" && (
        <ConfirmModalV2
          show={true}
          hide={() => {
            setActiveModal(undefined);
            setDeleting(false);
          }}
          loading={deleting}
          header={!deleting ? "Remove Emails" : "Removing Emails"}
          text={"Are you sure you want to remove these emails"}
          actionText="Remove"
          actionFunction={deleteMultiple}
          id="remove-multiple"
        />
      )}
      {activeModal === "archive-email" && emailIndex !== undefined && (
        <ConfirmModalV2
          show={true}
          hide={() => {
            setActiveModal(undefined);
            setEmailIndex(undefined);
          }}
          header={`${archiveState ? "Unarchive" : "Archive"} Email`}
          text={`Are you sure you want to ${
            archiveState ? "unarchive" : "archive"
          } this email?`}
          actionText={archiveState ? "Unarchive" : "Archive"}
          actionFunction={() => archiveEmail(!archiveState)}
          id="archive-email"
        />
      )}
      {activeModal === "archive-multiple" && (
        <ConfirmModalV2
          show={true}
          hide={() => {
            setActiveModal(undefined);
            setDeleting(false);
          }}
          loading={deleting}
          header={!deleting ? "Archive Emails" : "archiving Emails"}
          text={`Are you sure you want to ${
            archiveState ? "unarchive" : "archive"
          } these emails`}
          actionText={archiveState ? "Unarchive" : "Archive"}
          actionFunction={() => archiveMultiple(!archiveState)}
          id="archive-multiple"
        />
      )}
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
  .filters-container {
    .separate {
      margin-left: 30px;
    }
  }
`;

const STlink = styled(Link)`
  color: black;
  text-decoration: none;

  &:hover {
    color: black;
    text-decoration: none;
  }
`;

const DraftButton = styled.div`
  background: #35c3ae;
  border-radius: 15px;
  color: white;
  display: inline;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;

  &.label-draft {
    background: #74767b;
  }
`;

const Menu = styled.div`
  margin-bottom: 20px;

  ul {
    border-bottom: 1px solid #d8d8d8;
  }

  li {
    margin-right: 30px;

    &:last-child {
      margin-right: 0;
    }

    button {
      border-bottom: 2px solid transparent;
      color: #74767b !important;
      font-size: 15px;
      font-weight: 500;
      margin-bottom: -1px;

      &.active {
        border-bottom: 2px solid #1e1e1e;
        color: #1e1e1e !important;
        padding-bottom: 10px;
      }

      &:hover {
        color: #1e1e1e !important;
      }

      &.post {
        margin-left: 10px;
      }
    }
  }
`;

export default MarketingEmailsTab;
