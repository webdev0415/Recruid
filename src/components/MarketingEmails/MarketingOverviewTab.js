import React, { useState, useEffect } from "react";
import styled from "styled-components";
import notify from "notifications";
import spacetime from "spacetime";
import { Link } from "react-router-dom";
import { ATSContainer } from "styles/PageContainers";
import { ROUTES } from "routes";
import { PermissionChecker } from "constants/permissionHelpers";
import {
  ExtensionMenu,
  ExtensionMenuOption,
} from "sharedComponents/ExtensionMenu";
import EmptyTab from "components/Profiles/components/EmptyTab";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import ConfirmModalV2 from "modals/ConfirmModalV2";
import MarketingEmailModal from "modals/MarketingEmailModal";
import { fetchMarketingAnalytics } from "helpersV2/marketing";
import {
  fetchGetEmails,
  fetchDeleteEmail,
  fetchEditEmail,
  fetchArchiveToggle,
  // getEmailsStats,
} from "helpersV2/marketing/emails";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { fetchNetwork } from "helpersV2/candidates";
import { fetchContactList } from "helpers/crm/contacts";
import { fetchCompaniesList } from "helpers/crm/clientCompanies";
import Spinner from "sharedComponents/Spinner";
import AnalyticsContainer from "components/MarketingEmails/components/AnalyticsContainer";
import { EmptyContacts } from "assets/svg/EmptyImages";
const FETCH_ARRAY_LENGTH = 10;
// const ENV =
//   process.env.REACT_APP_API === "https://api.recruitd.co.uk"
//     ? "live"
//     : "staging";
// const UPDATE_BOUNDARY = new Date(
//   "Tue Jun 09 2020 15:51:23 GMT+0100 (British Summer Time)"
// ); // DATE MAKS CHANGED CATEGORIES FOR MARKETING EMAILS (IN 10 YEARS IT'LL BE IN THE HISTORY CURRRICULUM)

const MarketingOverviewTab = ({
  store,
  setRedirect,
  setActiveModal,
  activeModal,
  permission,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [emails, setEmails] = useState(undefined);
  // const [stats, setStats] = useState({});
  const [hasMore, setHasMore] = useState(false);
  const [analytics, setAnalytics] = useState(undefined);
  const controller = new AbortController();
  const signal = controller.signal;
  const [emailIndex, setEmailIndex] = useState(undefined);
  const [refresh, setRefresh] = useState(Math.random());
  const [activeReceivers, setActiveReceivers] = useState(undefined);
  const [receiverType, setReceiverType] = useState(undefined);

  useEffect(() => {
    if (store.session && store.company && permission.view) {
      fetchMarketingAnalytics(store.session, store.company.id).then((res) => {
        if (!res.err) {
          setAnalytics(res);
        } else {
          notify("danger", res);
        }
      });
    }
  }, [store.session, store.company, permission]);

  useEffect(() => {
    //fetch emails
    if (store.company && permission.view) {
      fetchGetEmails(
        store.session,
        store.company.id,
        { archive: false }, // Filters shouls go here
        [0, FETCH_ARRAY_LENGTH],
        signal
      ).then((res) => {
        if (!res.err) {
          setEmails(res);
          setHasMore(res.length === FETCH_ARRAY_LENGTH);
          setLoaded(true);
        } else if (!signal.aborted) {
          setEmails(false);
          notify("danger", "Unable to fetch emails");
        }
      });
    }
    return () => controller.abort();
  }, [store.session, store.company, refresh, permission]);

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

  const loadMore = () => {
    fetchGetEmails(
      store.session,
      store.company.id,
      {}, // Filters shouls go here
      [emails.length, FETCH_ARRAY_LENGTH],
      signal
    ).then((res) => {
      if (!res.err) {
        setEmails([...emails, ...res]);
        setHasMore(res.length === FETCH_ARRAY_LENGTH);
      } else {
        notify("danger", "Unable to fetch emails");
      }
    });
  };

  const removeEmail = () => {
    fetchDeleteEmail(store.session, store.company.id, [
      emails[emailIndex].email.id,
    ]).then((res) => {
      if (!res.err) {
        notify("info", "Email succesfully removed");
        let newEmails = [...emails];
        newEmails.splice(emailIndex, 1);
        setEmails(newEmails);
        setActiveModal(undefined);
        setEmailIndex(undefined);
      } else {
        notify("danger", res);
      }
    });
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

  const archiveEmail = () => {
    fetchArchiveToggle(
      store.session,
      store.company.id,
      [emails[emailIndex].email.id],
      true
    ).then((res) => {
      if (!res.err) {
        notify("info", "Email succesfully archived");
        let newEmails = [...emails];
        newEmails.splice(emailIndex, 1);
        setEmails(newEmails);
        setActiveModal(undefined);
        setEmailIndex(undefined);
      } else {
        notify("danger", res);
      }
    });
  };

  return (
    <>
      <ATSContainer>
        {!loaded && <Spinner />}
        {loaded && (
          <>
            {analytics && <AnalyticsContainer analytics={analytics} />}
            {emails && emails.length > 0 && (
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
                          <th scope="col" className={sharedStyles.tableHeader}>
                            Email
                          </th>
                          <th scope="col" className={sharedStyles.tableHeader}>
                            Status
                          </th>
                          <th scope="col" className={sharedStyles.tableHeader}>
                            Open Rate
                          </th>
                          <th scope="col" className={sharedStyles.tableHeader}>
                            Click Rate
                          </th>
                          <th scope="col" className={sharedStyles.tableHeader}>
                            Recipients
                          </th>
                          <th scope="col" className={sharedStyles.tableHeader}>
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
                            // const emailSentAt = new Date(
                            //   email.email.created_at
                            // );
                            // const emailCategory =
                            //   emailSentAt.getTime() > UPDATE_BOUNDARY.getTime()
                            //     ? `${ENV}-email-${email.email.uuid}`
                            //     : `email-${email.email.id}`;
                            return (
                              <tr
                                key={`row-email-${index}`}
                                className="table-row-hover"
                              >
                                <td className={sharedStyles.tableItemFirst}>
                                  <STlink
                                    to={ROUTES.EmailProfile.url(
                                      store.company.mention_tag,
                                      email.email.id
                                    )}
                                  >
                                    {email.email.subject}
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
                                            (email?.stats?.unique_opens * 100) /
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
                                <td className={sharedStyles.tableItem}>
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
                                                setActiveModal("edit-email");
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
                                          Archive Email
                                        </ExtensionMenuOption>
                                        {(store.role?.role_permissions.owner ||
                                          (store.role?.role_permissions.admin &&
                                            store.role?.role_permissions
                                              .marketer)) && (
                                          <ExtensionMenuOption
                                            onClick={() => {
                                              setActiveModal("remove-email");
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
            {activeModal === "archive-email" && emailIndex !== undefined && (
              <ConfirmModalV2
                show={true}
                hide={() => {
                  setActiveModal(undefined);
                  setEmailIndex(undefined);
                }}
                header={`${
                  emails[emailIndex]?.email.archive ? "Unarchive" : "Archive"
                } Email`}
                text={`Are you sure you want to ${
                  emails[emailIndex]?.email.archive ? "unarchive" : "archive"
                } this email?`}
                actionText={
                  emails[emailIndex]?.email.archive ? "Unarchive" : "Archive"
                }
                actionFunction={() =>
                  archiveEmail(!emails[emailIndex].email.archive)
                }
                id="archive-email"
              />
            )}
          </>
        )}
      </ATSContainer>
    </>
  );
};

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

export default MarketingOverviewTab;
