import React, { useEffect, useState, useContext, Suspense } from "react";
import styled from "styled-components";
import { Redirect, useParams, Link } from "react-router-dom";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import notify from "notifications";
import {
  PermissionChecker,
  permissionChecker,
} from "constants/permissionHelpers";
import retryLazy from "hooks/retryLazy";

import { ProfilePageContainer } from "styles/PageContainers";
import GlobalContext from "contexts/globalContext/GlobalContext";
import ContactHeader from "components/Profiles/components/contact/ContactHeader";
import ActionTyper from "sharedComponents/ActionCreator/ActionTyper";

import { ROUTES } from "routes";
import {
  BodyLeft,
  BodyRight,
  BodyContainer,
  ActionBackground,
} from "components/Profiles/components/ProfileComponents";

import {
  fetchContactProfile,
  editContactProfile,
  getDealsForContact,
  fetchContactNotes,
  // fetchContactJobs,
  fetchChangeContactCompany,
  fetchRemoveContactDeal,
  convertContactToCandidate,
} from "helpers/crm/contacts";
import { fetchAllCalls } from "helpersV2/calls";
import { fetchGetAllTasks } from "helpersV2/tasks";
import { fetchAllMeetings } from "helpersV2/meetings";
import { AWS_CDN_URL } from "constants/api";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { EMAIL_REGEX } from "constants/regex";
import { ATSContainer } from "styles/PageContainers";
const ContactOverviewTab = React.lazy(() =>
  retryLazy(() =>
    import("components/Profiles/Tabs/ContactTabs/ContactOverviewTab")
  )
);
const ProfileActivitiesTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/ProfileActivitiesTab"))
);
const CallsTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/CallsTab"))
);
const DealsTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/DealsTab"))
);
const TasksTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/TasksTab"))
);
const ContactEmailsTab = React.lazy(() =>
  retryLazy(() => import("components/ContactProfile/ContactEmailsTab"))
);
// import EmailsTab from "components/Profiles/components/EmailsTab";
// import JobsTab from "components/Profiles/components/JobsTab";
const NotesTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/NotesTab"))
);

const MeetsTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/MeetsTab"))
);

const CreateDealModal = React.lazy(() =>
  retryLazy(() => import("modals/CreateDealModal"))
);
const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);
const FETCH_ARRAY_LENGTH = 20;

const possibleTabs = {
  overview: true,
  activity: true,
  deals: true,
  emails: true,
};

const ContactProfile = (props) => {
  const store = useContext(GlobalContext);
  const { profileId, tab } = useParams();
  const [editSection, setEditSection] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);
  const [activeModal, setActiveModal] = useState(undefined);
  const [contact, setContact] = useState(undefined);
  const [contactBackUp, setContactBackUp] = useState(undefined);
  const [interactions, setInteractions] = useState(undefined);
  const [notes, setNotes] = useState(undefined);
  const [addNote, setAddNote] = useState(undefined);
  const [replyToNote, setReplyToNote] = useState(undefined);
  //DEALS
  const [deals, setDeals] = useState(undefined);
  const [dealsTab, setDealsTab] = useState("active");
  const [archivedDeals, setArchivedDeals] = useState(true);
  const [updateDeals, setUpdateDeals] = useState(Math.random());
  const [calls, setCalls] = useState(undefined);
  const [tasks, setTasks] = useState(undefined);

  const [updateProfile, triggerUpdateProfile] = useState(undefined);
  //all companies to select, fetched on the overview tab if edit company is selected only
  const [allCompanies, setAllCompanies] = useState(undefined);

  // const [jobs, setJobs] = useState(undefined);
  // const [jobsStage, setJobsStage] = useState("Applied");

  //
  // const [hasMoreInteractions, setHasMoreInteractions] = useState(false);
  // const [hasMoreNotes, setHasMoreNotes] = useState(false);
  // const [hasMoreJobs, setHasMoreJobs] = useState(false);

  const [innerModal, setInnerModal] = useState(undefined);
  // const [hasMoreContacts, setHasMoreContacts] = useState(false);
  // const [hasMoreDeals, setHasMoreDeals] = useState(false);
  //ACTIONS
  const [actionType, setActionType] = useState("note");
  const [actionTotals, setActionTotals] = useState({});
  //MEETS
  const [meetings, setMeetings] = useState(undefined);

  const [notFound, setNotFound] = useState(false);
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
  // IF LOADING ROUTE CONTAINS A TAB, SET THE COMPONENT TO THE RIGHT ONE
  useEffect(() => {
    if (store.company && (!tab || !possibleTabs[tab])) {
      setRedirect(
        ROUTES.ContactProfile.url(
          store.company.mention_tag,
          profileId,
          "overview"
        )
      );
    }
  }, [tab, store.company]);

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
    }
  }, [redirect]);

  useEffect(() => {
    if (profileId && store.company && store.session) {
      //FETCH CONTACT PROFILE
      fetchContactProfile(store.session, profileId, store.company.id).then(
        (res) => {
          if (!res.err) {
            setContact(res);
          } else {
            setNotFound(true);
            notify("danger", "Unable to fetch contact profile");
          }
        }
      );
    }
  }, [profileId, updateProfile, store.company, store.session]);

  // //FETCH CONTACT JOBS
  // useEffect(() => {
  //   if ( profileId) {
  //     fetchContactJobs(
  //       store.session,
  //       store.company.id,
  //        profileId,
  //       jobsStage,
  //       [0, FETCH_ARRAY_LENGTH]
  //     ).then(res => {
  //       if (!res.err) {
  //         setJobs(res);
  //         setHasMoreJobs(res.length === FETCH_ARRAY_LENGTH);
  //       } else {
  //         // setJobs(false)
  //         notify("danger", "Unable to fetch jobs");
  //       }
  //     });
  //   }
  //
  // }, [ profileId, jobsStage]);

  useEffect(() => {
    if (profileId && store.company && store.session) {
      getDealsForContact(store.session, profileId, store.company.id).then(
        (res) => {
          if (!res.err) {
            setDeals(res);
          } else {
            setDeals(false);
            notify("danger", "Unable to fetch deals");
          }
        }
      );
    }
  }, [profileId, updateDeals, store.session, store.company]);

  useEffect(() => {
    if (profileId && store.company && store.session) {
      getDealsForContact(store.session, profileId, store.company.id, true).then(
        (res) => {
          if (!res.err) {
            setArchivedDeals(res);
          } else {
            setArchivedDeals(false);
            notify("danger", "Unable to fetch deals");
          }
        }
      );
    }
  }, [profileId, store.session, store.company]);

  useEffect(() => {
    if (
      deals &&
      deals.length === 0 &&
      archivedDeals &&
      archivedDeals.length > 0
    ) {
      setDealsTab("archived");
    }
  }, [deals, archivedDeals]);

  useEffect(() => {
    if (profileId && store.company && store.session) {
      fetchAllCalls(store.session, store.company.id, "contact", profileId).then(
        (res) => {
          if (!res.err) {
            setCalls(res);
          } else {
            notify("danger", "Unable to fetch calls");
          }
        }
      );
    }
  }, [profileId, store.session, store.company]);

  useEffect(() => {
    if (profileId && store.session) {
      fetchGetAllTasks(store.session, {
        source: ["contact"],
        source_id: Number(profileId),
      }).then((res) => {
        if (!res.err) {
          setTasks(res);
        } else {
          notify("danger", "Unable to fetch tasks");
        }
      });
    }
  }, [profileId, store.session]);

  useEffect(() => {
    if (profileId && store.company && store.session) {
      fetchContactNotes(store.session, store.company.id, profileId).then(
        (res) => {
          if (!res.err) {
            setNotes(res);
          } else {
            setDeals(false);
            notify("danger", "Unable to fetch notes");
          }
        }
      );
    }
  }, [profileId, store.session, store.company]);

  useEffect(() => {
    if (profileId && store.session && store.company) {
      fetchAllMeetings(
        store.session,
        store.company.id,
        "contact",
        profileId
      ).then((res) => {
        if (!res.err) {
          setMeetings(res);
        } else {
          notify("danger", "Unable to fetch meetings");
        }
      });
    }
  }, [profileId, store.session, store.company]);

  useEffect(() => {
    if (notes || tasks || calls || meetings) {
      setActionTotals({
        note: notes?.length,
        task: tasks?.length,
        call: calls?.length,
        meet: meetings?.length,
      });
    }
  }, [notes, calls, tasks, meetings]);

  const fetchMoreNotes = () => {
    fetchContactNotes(store.session, store.company.id, profileId, [
      notes.length,
      FETCH_ARRAY_LENGTH,
    ]).then((res) => {
      if (!res.err) {
        setNotes([...notes, ...res]);
      } else {
        notify("danger", "Unable to fetch notes");
      }
    });
  };

  const saveContact = (newContact) => {
    let copyContact = newContact ? { ...newContact } : { ...contact };
    delete copyContact.avatar;
    if (
      !copyContact.email ||
      copyContact.email === "" ||
      EMAIL_REGEX.test(copyContact.email) === false
    ) {
      return notify("danger", "Contact must have a valid email");
    }
    editContactProfile(
      store.session,
      profileId,
      copyContact,
      store.company.id
    ).then((res) => {
      if (!res.err) {
        setContact({ ...res, company: contact.company });
        notify("info", "Contact succesfully saved");
      } else {
        notify("danger", "Unable to save contact details");
      }
      setEditSection(undefined);
      setContactBackUp(undefined);
    });
  };

  const removeDeal = (deal_id) => {
    fetchRemoveContactDeal(
      store.session,
      store.company.id,
      profileId,
      deal_id
    ).then((res) => {
      if (!res.err) {
        //force update
        setUpdateDeals(Math.random());
        notify("info", "Successfully removed deal");
      } else {
        notify("danger", "Unable to remove deal");
      }
    });
  };

  const triggerEditSection = (section) => {
    setEditSection(section);
    setContactBackUp(contact);
  };

  const cancelEdit = () => {
    setEditSection(undefined);
    setContact(contactBackUp);
    setContactBackUp(undefined);
  };

  // const fetchMoreJobs = () => {
  //   fetchContactJobs(
  //     store.session,
  //     store.company.id,
  //      profileId,
  //     jobsStage,
  //     [jobs.length, FETCH_ARRAY_LENGTH]
  //   ).then(res => {
  //     if (!res.err) {
  //       setJobs([...jobs, ...res]);
  //       setHasMoreJobs(res.length === FETCH_ARRAY_LENGTH);
  //     } else {
  //       notify("danger", "Unable to fetch jobs");
  //     }
  //   });
  // };

  const saveNewContactCompany = (newCompanyId) => {
    if (!newCompanyId || newCompanyId === contact.company?.id) {
      cancelEdit();
    } else {
      fetchChangeContactCompany(
        store.session,
        store.company.id,
        profileId,
        newCompanyId
      )
        .then((res) => {
          if (!res.err) {
            notify("info", "Company succesfully changed");
            triggerUpdateProfile(Math.random());
          } else {
            notify("danger", res.error);
          }
        })
        .finally(() => {
          setEditSection(undefined);
        });
    }
  };

  const pushNote = (note) => {
    if (notes) {
      setNotes([note, ...notes]);
    } else {
      setNotes([note]);
    }
  };
  const pushTask = (task) => {
    if (tasks) {
      setTasks([task, ...tasks]);
    } else {
      setTasks([task]);
    }
  };
  const pushCall = (call) => {
    if (calls) {
      setCalls([call, ...calls]);
    } else {
      setCalls([call]);
    }
  };

  const pushMeet = (meet) => {
    if (meetings) {
      setMeetings([meet, ...meetings]);
    } else {
      setMeetings([meet]);
    }
  };

  const createCandidate = () => {
    convertContactToCandidate(store.session, {
      contact_id: contact.id,
      // custom_source_id: 1,
      // location: "London, UK",
      consent: true,
      owner_id: contact.owner_id,
    }).then((res) => {
      if (!res.err) {
        setContact({
          ...contact,
          candidate_id: res.id,
          professional_id: res.professional_id,
        });
        notify("info", "Candidate succesfully created");
      } else {
        notify("danger", res);
      }
    });
  };

  return (
    <InnerPage
      pageTitle={`${contact ? contact.name : ""} - Contact Profile`}
      originName={contact?.name}
    >
      {redirect && redirect !== props.location.pathname && (
        <Redirect to={redirect} />
      )}
      <ATSWrapper activeTab={tab} routeObject={ROUTES.ContactProfile}>
        <ProfilePageContainer>
          <>
            {contact ? (
              <>
                <ContactHeader
                  contact={contact}
                  setContact={setContact}
                  editSection={editSection}
                  triggerEditSection={triggerEditSection}
                  cancelEdit={cancelEdit}
                  saveContact={saveContact}
                  actionType={actionType}
                  setActionType={setActionType}
                  actionTotals={actionTotals}
                  store={store}
                  permission={permission}
                />
                <ATSContainer>
                  <BodyContainer>
                    <BodyLeft>
                      {tab === "overview" && (
                        <div className="leo-relative">
                          <ButtonContainer>
                            {!contact.candidate_id ? (
                              <ActionButton
                                onClick={() =>
                                  setActiveModal("create_candidate")
                                }
                              >
                                Convert to Candidate
                              </ActionButton>
                            ) : (
                              <CandidateLink
                                to={ROUTES.CandidateProfile.url(
                                  store.company.mention_tag,
                                  contact.professional_id
                                )}
                              >
                                <LinkSVG />
                                View Candidate Profile
                              </CandidateLink>
                            )}
                          </ButtonContainer>
                          <Suspense fallback={<div />}>
                            <ContactOverviewTab
                              contact={contact}
                              editSection={editSection}
                              triggerEditSection={triggerEditSection}
                              cancelEdit={cancelEdit}
                              setContact={setContact}
                              store={store}
                              setEditSection={setEditSection}
                              saveContact={saveContact}
                              setInnerModal={setInnerModal}
                              setRedirect={setRedirect}
                              deals={deals}
                              allCompanies={allCompanies}
                              setAllCompanies={setAllCompanies}
                              saveNewContactCompany={saveNewContactCompany}
                              selectedContactId={profileId}
                            />
                          </Suspense>
                        </div>
                      )}
                      {tab === "activity" && (
                        <Suspense fallback={<div />}>
                          <ProfileActivitiesTab
                            interactions={interactions}
                            setInteractions={setInteractions}
                            store={store}
                            sourceId={profileId}
                            source="contact"
                          />
                        </Suspense>
                      )}
                      {tab === "deals" && (
                        <Suspense fallback={<div />}>
                          <DealsTab
                            deals={deals}
                            archivedDeals={archivedDeals}
                            dealsTab={dealsTab}
                            setDealsTab={setDealsTab}
                            modalId={"contact-profile"}
                            removeDeal={removeDeal}
                            setInnerModal={setInnerModal}
                            store={store}
                            setRedirect={setRedirect}
                            permission={permission}
                          />
                        </Suspense>
                      )}
                      {tab === "emails" && contact && (
                        <Suspense fallback={<div />}>
                          <ContactEmailsTab contact={contact} />
                        </Suspense>
                      )}
                    </BodyLeft>
                    <BodyRight>
                      <PermissionChecker type="edit" valid={{ business: true }}>
                        <ActionTyper
                          store={store}
                          actionType={actionType}
                          setActionType={setActionType}
                          source={"contact"}
                          notesSource={"DealContact"}
                          sourceId={profileId}
                          // call creator props
                          clientCompany={contact?.company}
                          contacts={[contact]}
                          pushNote={pushNote}
                          pushTask={pushTask}
                          pushCall={pushCall}
                          pushMeet={pushMeet}
                          replyToNote={replyToNote}
                          setReplyToNote={setReplyToNote}
                        />
                      </PermissionChecker>
                      {actionType === "call" && (
                        <Suspense fallback={<div />}>
                          <CallsTab
                            calls={calls}
                            setCalls={setCalls}
                            store={store}
                            contacts={[contact]}
                            canEdit={permission.edit}
                          />
                        </Suspense>
                      )}
                      {actionType === "task" && (
                        <Suspense fallback={<div />}>
                          <TasksTab
                            tasks={tasks}
                            setTasks={setTasks}
                            store={store}
                            canEdit={permission.edit}
                          />
                        </Suspense>
                      )}
                      {actionType === "note" && (
                        <Suspense fallback={<div />}>
                          <NotesTab
                            notes={notes}
                            setNotes={setNotes}
                            hasMoreNotes={
                              notes &&
                              notes.length !== 0 &&
                              notes.length % FETCH_ARRAY_LENGTH === 0
                                ? true
                                : false
                            }
                            fetchMoreNotes={fetchMoreNotes}
                            addNote={addNote}
                            setAddNote={setAddNote}
                            source={"DealContact"}
                            sourceId={profileId}
                            setReplyToNote={setReplyToNote}
                            canEdit={permission.edit}
                          />
                        </Suspense>
                      )}
                      {(actionType === "meet" || actionType === "meet-log") && (
                        <Suspense fallback={<div />}>
                          <MeetsTab meetings={meetings} />
                        </Suspense>
                      )}
                    </BodyRight>
                    <ActionBackground>
                      <div></div>
                      <div className="grey-background"></div>
                    </ActionBackground>
                    {innerModal === "create_deal" && (
                      <Suspense fallback={<div />}>
                        <CreateDealModal
                          show={true}
                          hide={() => setInnerModal(undefined)}
                          setTriggerUpdate={() => setUpdateDeals(Math.random())}
                          contactId={profileId}
                          initialView="search"
                          clientCompanyId={contact.company?.client_id}
                        />
                      </Suspense>
                    )}
                  </BodyContainer>
                </ATSContainer>
              </>
            ) : null}
          </>
        </ProfilePageContainer>
        {notFound && (
          <div style={{ marginTop: "50px" }}>
            <div className={sharedStyles.emptyContainer}>
              <div className={sharedStyles.empty}>
                <img src={`${AWS_CDN_URL}/icons/empty-icons/empty-team.svg`} alt="not found illustration" />
                <h2>404 Not Found</h2>
                <p>
                  Were sorry the page your looking for cannot be found, click
                  below to head back to the dashboard.
                </p>
              </div>
            </div>
          </div>
        )}
        {activeModal === "create_candidate" && (
          <Suspense fallback={<div />}>
            <ConfirmModalV2
              id="create-candidat"
              show={true}
              hide={() => setActiveModal(undefined)}
              header={
                contact.candidate_id
                  ? "Candidate succesfully created"
                  : "Create Candidate"
              }
              text={
                contact.candidate_id
                  ? "A candidate has been created from this contact, visit the candidate page to view and edit it."
                  : "Would you like us to create a candidate from this contact?"
              }
              actionText={contact.candidate_id ? "Visit" : "Create"}
              actionFunction={
                contact.candidate_id
                  ? () =>
                      setRedirect(
                        ROUTES.CandidateProfile.url(
                          store.company.mention_tag,
                          contact.professional_id
                        )
                      )
                  : () => createCandidate()
              }
            />
          </Suspense>
        )}
      </ATSWrapper>
    </InnerPage>
  );
};

const ButtonContainer = styled.div`
  position: absolute;
  right: 60px;
  top: 0;
`;

const ActionButton = styled.button`
  background: #1f3653;
  border-radius: 3px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  padding: 3px 10px;
`;

const CandidateLink = styled(Link)`
  background: #eeeeee;
  border-radius: 3px;
  color: #1e1e1e;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 6px;

  &:hover {
    text-decoration: none;
  }

  svg {
    margin-right: 5px;
    position: relative;
    top: -1px;

    .icon {
      fill: #74767b;
    }
  }
`;

const LinkSVG = () => (
  <svg
    data-test-id="cf-ui-icon"
    className="Icon__Icon___38Epv Icon__Icon--small___1yGZK Icon__Icon--muted___3egnD css-1qkvt8e"
    height="18"
    width="18"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none"></path>
    <path
      className="icon"
      d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
    ></path>
  </svg>
);

export default ContactProfile;
