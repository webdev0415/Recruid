import React, { useEffect, useState, useContext, lazy, Suspense } from "react";
import { Redirect, useParams } from "react-router-dom";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
import { ROUTES } from "routes";
import styled from "styled-components";

import { ProfilePageContainer } from "styles/PageContainers";
import CompanyHeader from "components/Profiles/components/company/CompanyHeader";
import ActionTyper from "sharedComponents/ActionCreator/ActionTyper";
import {
  fetchClientCompanyProfile,
  editClientCompanyProfile,
  fetchCompanyDeals,
  fetchCompanyNotes,
  // fetchCompanyJobs,
  fetchCompanyContacts,
  fetchCompanyDocuments,
  fetchRemoveContactCompany,
  fetchRemoveDealCompany,
} from "helpers/crm/clientCompanies";
import { fetchInterviewStages } from "helpersV2/interviews";
import { fetchAllCalls } from "helpersV2/calls";
import { fetchGetAllTasks } from "helpersV2/tasks";
import { fetchAllMeetings } from "helpersV2/meetings";
import {
  BodyLeft,
  BodyRight,
  BodyContainer,
  ActionBackground,
} from "components/Profiles/components/ProfileComponents";
import { AWS_CDN_URL } from "constants/api";
import {
  PermissionChecker,
  permissionChecker,
} from "constants/permissionHelpers";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import retryLazy from "hooks/retryLazy";
import {
  flattenSkills,
  flattenIndustries,
  flattenLocations,
} from "sharedComponents/TagsComponent/methods/tags";
import { uploadFile, deleteDocumentCall } from "helpersV2/CandidateProfile";
import UploadingDocumentsIndicator from "sharedComponents/UploadingDocumentsIndicator";
import TalentNetworkActionBar from "components/TalentNetwork/components/TalentNetworkActionBar";
const CompanyOverviewTab = lazy(() =>
  retryLazy(() =>
    import("components/Profiles/Tabs/CompanyTabs/CompanyOverviewTab")
  )
);
const ProfileActivitiesTab = lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/ProfileActivitiesTab"))
);

const CompanyAnalyticsTab = lazy(() =>
  retryLazy(() =>
    import("components/Profiles/Tabs/CompanyTabs/CompanyAnalyticsTab")
  )
);
const CompanyCandidatesTab = lazy(() =>
  retryLazy(() =>
    import("components/Profiles/Tabs/CompanyTabs/CompanyCandidatesTab")
  )
);
const NotesTab = lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/NotesTab"))
);
const CallsTab = lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/CallsTab"))
);
// import EmailsTab from "components/Profiles/components/EmailsTab";
const ContactsTab = lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/ContactsTab"))
);
const DealsTab = lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/DealsTab"))
);
const TasksTab = lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/TasksTab"))
);
const MeetsTab = lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/MeetsTab"))
);
const ClientEmailsTab = lazy(() =>
  retryLazy(() => import("components/ClientProfile/ClientEmailsTab"))
);
const JobsTab = lazy(() =>
  retryLazy(() => import("components/Profiles/components/JobsTab"))
);
const CreateContactModal = React.lazy(() =>
  retryLazy(() => import("modals/CreateContactModal"))
);
const InviteClientModal = React.lazy(() =>
  retryLazy(() => import("modals/InviteClientModal"))
);
const CreateDealModal = React.lazy(() =>
  retryLazy(() => import("modals/CreateDealModal"))
);
const DocumentsTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/DocumentsTab"))
);
// let date = new Date(Date.now);
const FETCH_ARRAY_LENGTH = 20;

const possibleTabs = {
  overview: true,
  activity: true,
  contacts: true,
  deals: true,
  documents: true,
  jobs: true,
  analytics: true,
  candidates: true,
  emails: true,
};

const CompanyProfile = (props) => {
  const store = useContext(GlobalContext);
  const { profileId, tab } = useParams();
  const [editSection, setEditSection] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);
  const [profileCompany, setProfileCompany] = useState(undefined);
  const [companyBackUp, setCompanyBackUp] = useState(undefined);
  const [interactions, setInteractions] = useState(undefined);
  const [notes, setNotes] = useState(undefined);
  const [replyToNote, setReplyToNote] = useState(undefined);
  const [addNote, setAddNote] = useState(undefined);
  //DEALS
  const [deals, setDeals] = useState(undefined);
  const [dealsTab, setDealsTab] = useState("active");
  const [archivedDeals, setArchivedDeals] = useState(true);
  const [updateDeals, setUpdateDeals] = useState(Math.random());
  // const [jobs, setJobs] = useState(undefined);
  const [calls, setCalls] = useState(undefined);
  //CONTACTS
  const [contacts, setContacts] = useState(undefined);
  const [updateContacts, setUpdateContacts] = useState(Math.random());
  const [tasks, setTasks] = useState(undefined);
  // const [jobsStage, setJobsStage] = useState('applied');
  const [clientsInterviewStages, setClientsInterviewStages] = useState(null);
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
  const [refresh, setRefresh] = useState(Math.random());
  const [refreshContacts, setRefreshContacts] = useState(Math.random());
  const [notFound, setNotFound] = useState(false);
  const [permission, setPermission] = useState({ view: false, edit: false });
  const [originalLocations, setOriginalLocations] = useState(undefined);
  const [originalSkills, setOriginalSkills] = useState(undefined);
  const [originalIndustries, setOriginalIndustries] = useState(undefined);

  const [addingFiles, setAddingFiles] = useState(false);
  const [documents, setDocuments] = useState(undefined);
  const [activeModal, setActiveModal] = useState(undefined);
  const [selectedTotal, setSelectedTotal] = useState(0);
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
        ROUTES.ClientProfile.url(
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
      // setProfileCompany(mockprofileCompany);
      //FETCH COMPANY PROFILE
      fetchClientCompanyProfile(
        store.session,
        store.company.id,
        profileId
      ).then((res) => {
        if (!res.err) {
          setProfileCompany(res);
        } else {
          setNotFound(true);
          notify("danger", "Unable to fetch company profile");
        }
      });
    }
  }, [profileId, store.company, store.session, refresh]);

  useEffect(() => {
    if (profileId && store.session) {
      (async (session, selectedCompanyId) => {
        const interviewStagesData = await fetchInterviewStages(
          session,
          selectedCompanyId
        );
        if (
          interviewStagesData?.err ||
          interviewStagesData?.error ||
          interviewStagesData?.errors
        ) {
          return notify("Unable to get clients interview stages");
        }
        return setClientsInterviewStages(interviewStagesData);
      })(store.session, profileId);
    }
  }, [store.session, profileId]);

  useEffect(() => {
    if (profileId && store.company && store.session) {
      fetchCompanyContacts(store.session, profileId, store.company.id).then(
        (res) => {
          if (!res.err) {
            setContacts(res);
          } else {
            notify("danger", "Unable to fetch contacts");
          }
        }
      );
    }
  }, [
    profileId,
    store.company,
    store.session,
    updateContacts,
    refreshContacts,
  ]);

  useEffect(() => {
    if (profileId && store.company && store.session) {
      fetchCompanyDeals(store.session, store.company.id, profileId).then(
        (res) => {
          if (!res.err) {
            setDeals(res);
          } else {
            notify("danger", "Unable to fetch deals");
          }
        }
      );
    }
  }, [profileId, store.session, store.company, updateDeals]);

  useEffect(() => {
    if (profileId && store.company && store.session) {
      fetchCompanyDeals(store.session, store.company.id, profileId, true).then(
        (res) => {
          if (!res.err) {
            setArchivedDeals(res);
          } else {
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
      fetchAllCalls(store.session, store.company.id, "client", profileId).then(
        (res) => {
          if (!res.err) {
            setCalls(res);
          } else {
            notify("danger", "Unable to fetch calls");
          }
        }
      );
    }
  }, [profileId, store.company, store.session]);

  useEffect(() => {
    if (profileId && store.session) {
      fetchGetAllTasks(store.session, {
        source: ["client"],
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
      fetchCompanyNotes(store.session, store.company.id, profileId).then(
        (res) => {
          if (!res.err) {
            setNotes(res);
          } else {
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
        "client",
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

  useEffect(() => {
    if (profileCompany && profileCompany.localizations && !originalLocations) {
      setOriginalLocations(flattenLocations(profileCompany.localizations));
      setOriginalSkills(flattenSkills(profileCompany.competencies));
      setOriginalIndustries(flattenIndustries(profileCompany.categorizations));
    }
  }, [profileCompany, originalLocations]);

  const fetchMoreNotes = () => {
    fetchCompanyNotes(store.session, store.company.id, profileId, [
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

  const saveProfileCompany = (newCompany) => {
    let companyCopy = newCompany ? { ...newCompany } : { ...profileCompany };
    if (!newCompany) {
      companyCopy.client_layer = { avatar: profileCompany.avatar };
    }
    delete companyCopy.avatar;

    editClientCompanyProfile(
      store.session,
      store.company.id,
      profileId,
      companyCopy
    ).then((res) => {
      if (!res.err) {
        setProfileCompany({
          ...res,
          owner_id: companyCopy.owner_id,
          localizations: res.localizations,
        });
        setOriginalLocations(flattenLocations(res.localizations || []));
        setOriginalSkills(flattenSkills(res.competencies || []));
        setOriginalIndustries(flattenIndustries(res.categorizations || []));
        notify("info", "Company succesfully saved");
      } else {
        notify("danger", "Unable to save company");
        setProfileCompany(companyBackUp);
      }
      setEditSection(undefined);
      setCompanyBackUp(undefined);
    });
  };
  const removeContact = (contact_id) => {
    fetchRemoveContactCompany(store.session, contact_id, profileId).then(
      (res) => {
        if (!res.err) {
          //force update
          setUpdateContacts(Math.random());
          notify("info", "Successfully removed contact");
        } else {
          notify("danger", "Unable to remove contact");
        }
      }
    );
  };

  const removeDeal = (deal_id) => {
    fetchRemoveDealCompany(store.session, store.company.id, deal_id).then(
      (res) => {
        if (!res.err) {
          //force update
          setUpdateDeals(Math.random());
          notify("info", "Successfully removed deal");
        } else {
          notify("danger", "Unable to remove deal");
        }
      }
    );
  };

  const triggerEditSection = (section) => {
    setEditSection(section);
    setCompanyBackUp(profileCompany);
  };

  const cancelEdit = () => {
    setEditSection(undefined);
    setProfileCompany(companyBackUp);
    setCompanyBackUp(undefined);
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

  const sendToOverview = () => {
    if (!hideRight[tab]) return;
    setRedirect(ROUTES.ClientProfile.url(store.company.mention_tag, profileId));
  };

  const deleteDocument = (docId, index) => {
    deleteDocumentCall(docId, store.session).then((res) => {
      if (res.status !== 405) {
        let newDocuments = [...documents];
        newDocuments.splice(index, 1);
        setDocuments(newDocuments);
      } else {
        alert("Could not delete this file");
      }
    });
  };

  //=================DOCUMENTS===================================
  useEffect(() => {
    if (profileId && documents === undefined && store.company) {
      fetchCompanyDocuments(store.session, profileId, store.company.id).then(
        (docs) => {
          if (docs !== "err" && !docs.message) {
            setDocuments(docs);
          } else {
            notify("danger", "Unable to fetch documents");
            setDocuments(false);
          }
        }
      );
    }
  }, [profileId, store.company]);

  const uploadFilesToProfile = (e) => {
    let files = e.target.files;
    let filesArr = [];

    let rawArr = Object.values(files);
    rawArr.map((file) =>
      file.size > 5000000
        ? alert(
            "Could not add " +
              file.name +
              ", File size too large, please upload file less than 5MB"
          )
        : filesArr.push(file)
    );
    uploadFiles(filesArr);
  };

  const uploadFiles = (filesArr) => {
    if (filesArr.length > 0) {
      let uploadedFiles = 0;
      let returnedObjects = [];

      const recursiveFileUpload = (index, filesLeft) => {
        if (filesLeft === 0 || index === filesArr.length) {
          return;
        }
        filesLeft--;
        index++;
        let file = filesArr[index];

        let formData = new FormData();
        formData.append("document", file);
        formData.append("title", file?.name);
        formData.append("client_id", profileId);
        formData.append("agency_id", store.company.id);
        let currentSession = { ...store.session };
        delete currentSession["Content-Type"];

        uploadFile(currentSession, formData)
          .then((res) => {
            if (res.status === "ok") {
              returnedObjects.push(res.document);
            } else {
              alert("Something went wrong uploading this file");
            }

            uploadedFiles += 1;
            if (
              uploadedFiles === filesArr.length ||
              uploadedFiles > filesArr.length
            ) {
              if (documents) {
                let newDocuments = [...returnedObjects, ...documents];
                setDocuments(newDocuments);
              }
              setAddingFiles(false);
              return;
            } else {
              recursiveFileUpload(index, filesLeft);
            }
          })
          .catch(() => recursiveFileUpload(index, filesLeft));
      };
      setAddingFiles(true);
      recursiveFileUpload(-1, filesArr.length);
    } else {
      console.error("Oops, no files.");
    }
  };

  const addFilesToClient = (ev) => {
    if (!permission.edit) {
      return notify(
        "danger",
        "You do not have permission to add files, ask your manager to update your roles in order to do so."
      );
    }
    let files = [];
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === "file") {
          let file = ev.dataTransfer.items[i].getAsFile();
          file.size > 5000000
            ? alert(
                "Could not add " +
                  file.name +
                  ", File size too large, please upload file less than 5MB"
              )
            : filesAccepted.indexOf(file.type) === -1
            ? alert(
                "Could not add " +
                  file.name +
                  ", This file type is not accepted"
              )
            : files.push(file);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        let file = ev.dataTransfer.files[i];
        file.size > 5000000
          ? alert(
              "Could not add " +
                file.name +
                ", File size too large, please upload file less than 5MB"
            )
          : filesAccepted.indexOf(file.type) === -1
          ? alert(
              "Could not add " + file.name + ", This file type is not accepted"
            )
          : files.push(ev.dataTransfer.files[i]);
      }
    }
    uploadFiles(files);
  };

  return (
    <>
      <InnerPage
        pageTitle={`${
          profileCompany ? profileCompany.name : ""
        } - Client Profile`}
        originName={profileCompany?.name}
      >
        {redirect && redirect !== props.location.pathname && (
          <Redirect to={redirect} />
        )}
        <ATSWrapper activeTab={tab} routeObject={ROUTES.ClientProfile}>
          <ProfilePageContainer
            className={`${
              withGreyBackground[tab] !== undefined ? "grey-container" : ""
            }`}
            onDrop={(e) => {
              e.preventDefault();
              addFilesToClient(e);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <>
              {profileCompany ? (
                <>
                  <CompanyHeader
                    profileCompany={profileCompany}
                    setProfileCompany={setProfileCompany}
                    editSection={editSection}
                    triggerEditSection={triggerEditSection}
                    cancelEdit={cancelEdit}
                    saveProfileCompany={saveProfileCompany}
                    setInnerModal={setInnerModal}
                    actionType={actionType}
                    setActionType={setActionType}
                    actionTotals={actionTotals}
                    sendToOverview={sendToOverview}
                    greyBg={hideRight[tab]}
                    store={store}
                    permission={permission}
                  />
                  <ATSContainer>
                    <BodyContainer className={hideRight[tab] && "full"}>
                      <BodyLeft className={hideRight[tab] && "full"}>
                        {tab === "overview" && (
                          <div className="leo-relative">
                            <ButtonContainer>
                              {profileCompany.invited ? (
                                <JobButton
                                  onClick={() => setInnerModal("invite_client")}
                                >
                                  <JobLinkSVG />
                                  Company Invited
                                </JobButton>
                              ) : (
                                <>
                                  {((store.role?.role_permissions.admin &&
                                    store.role?.role_permissions.business) ||
                                    store.role?.role_permissions.owner) && (
                                    <ActionButton
                                      onClick={() =>
                                        setInnerModal("invite_client")
                                      }
                                    >
                                      Invite Company to Leo
                                    </ActionButton>
                                  )}
                                </>
                              )}
                            </ButtonContainer>
                            <Suspense fallback={<div />}>
                              <CompanyOverviewTab
                                profileCompany={profileCompany}
                                setProfileCompany={setProfileCompany}
                                saveProfileCompany={saveProfileCompany}
                                editSection={editSection}
                                triggerEditSection={triggerEditSection}
                                cancelEdit={cancelEdit}
                                store={store}
                                setInnerModal={setInnerModal}
                                setRedirect={setRedirect}
                                contacts={contacts}
                                deals={deals}
                                selectedCompanyId={profileId}
                                originalLocations={originalLocations}
                                refreshProfile={() => setRefresh(Math.random())}
                                originalSkills={originalSkills}
                                originalIndustries={originalIndustries}
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
                              source="client"
                              sourceId={profileId}
                            />
                          </Suspense>
                        )}
                        {tab === "emails" && profileCompany && (
                          <ClientEmailsTab
                            profileCompany={{ profileCompany, id: profileId }}
                          />
                        )}
                        {tab === "contacts" && (
                          <Suspense fallback={<div />}>
                            <ContactsTab
                              contacts={contacts}
                              setInnerModal={setInnerModal}
                              modalId={"company-profile"}
                              removeContact={removeContact}
                              setRedirect={setRedirect}
                              store={store}
                              canEdit={permission.edit}
                            />
                          </Suspense>
                        )}
                        {tab === "deals" && (
                          <Suspense fallback={<div />}>
                            <DealsTab
                              deals={deals}
                              archivedDeals={archivedDeals}
                              dealsTab={dealsTab}
                              removeDeal={removeDeal}
                              setDealsTab={setDealsTab}
                              setInnerModal={setInnerModal}
                              modalId={"company-profile"}
                              setRedirect={setRedirect}
                              store={store}
                              permission={permission}
                            />
                          </Suspense>
                        )}
                        {tab === "documents" && (
                          <Suspense fallback={<div />}>
                            <DocumentsTab
                              documents={documents}
                              deleteDocument={deleteDocument}
                              uploadFilesToProfile={uploadFilesToProfile}
                              canEdit={permission.edit}
                            />
                          </Suspense>
                        )}
                      </BodyLeft>
                      {!hideRight[tab] && (
                        <>
                          <BodyRight>
                            <PermissionChecker
                              type="edit"
                              valid={{ business: true }}
                            >
                              <ActionTyper
                                store={store}
                                actionType={actionType}
                                setActionType={setActionType}
                                source={"client"}
                                notesSource={"Employer"}
                                sourceId={profileId}
                                //call creator props
                                clientCompany={profileCompany}
                                contacts={contacts}
                                pushNote={pushNote}
                                pushTask={pushTask}
                                pushCall={pushCall}
                                pushMeet={pushMeet}
                                replyToNote={replyToNote}
                                setReplyToNote={setReplyToNote}
                              />
                            </PermissionChecker>
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
                            {actionType === "call" && (
                              <Suspense fallback={<div />}>
                                <CallsTab
                                  calls={calls}
                                  setCalls={setCalls}
                                  store={store}
                                  contacts={contacts}
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
                                  source={"Employer"}
                                  sourceId={profileId}
                                  setReplyToNote={setReplyToNote}
                                  canEdit={permission.edit}
                                />
                              </Suspense>
                            )}
                            {(actionType === "meet" ||
                              actionType === "meet-log") && (
                              <Suspense fallback={<div />}>
                                <MeetsTab meetings={meetings} />
                              </Suspense>
                            )}
                          </BodyRight>
                          <ActionBackground>
                            <div></div>
                            <div className="grey-background"></div>
                          </ActionBackground>
                        </>
                      )}

                      {innerModal === "create_contact" && (
                        <Suspense fallback={<div />}>
                          <CreateContactModal
                            show={true}
                            hide={() => setInnerModal(undefined)}
                            setTriggerUpdate={() =>
                              setUpdateContacts(Math.random())
                            }
                            clientCompanyId={profileId}
                          />
                        </Suspense>
                      )}
                      {innerModal === "invite_client" && (
                        <Suspense fallback={<div />}>
                          <InviteClientModal
                            show={true}
                            hide={() => setInnerModal(undefined)}
                            setTriggerUpdate={() => {
                              setRefresh(Math.random());
                              setRefreshContacts(Math.random());
                            }}
                            clientCompanyId={profileId}
                            clientCompany={profileCompany}
                            contacts={contacts}
                          />
                        </Suspense>
                      )}
                      {innerModal === "create_deal" && (
                        <Suspense fallback={<div />}>
                          <CreateDealModal
                            show={true}
                            hide={() => setInnerModal(undefined)}
                            setTriggerUpdate={() =>
                              setUpdateDeals(Math.random())
                            }
                            clientCompanyId={profileId}
                            initialView="search"
                          />
                        </Suspense>
                      )}
                    </BodyContainer>
                    {tab === "jobs" && (
                      <Suspense fallback={<Spinner />}>
                        <JobsTab
                          clientCompanyId={profileId}
                          interviewStages={clientsInterviewStages}
                          setInnerModal={setInnerModal}
                          store={store}
                        />
                      </Suspense>
                    )}
                    {tab === "analytics" && (
                      <Suspense fallback={<div />}>
                        <CompanyAnalyticsTab
                          store={store}
                          selectedCompanyId={profileId}
                        />
                      </Suspense>
                    )}
                    {tab === "candidates" && (
                      <Suspense fallback={<div />}>
                        <CompanyCandidatesTab
                          vendorId={profileId}
                          selectedTotal={selectedTotal}
                          setSelectedTotal={setSelectedTotal}
                          activeModal={activeModal}
                          setActiveModal={setActiveModal}
                        />
                      </Suspense>
                    )}
                  </ATSContainer>
                  <TalentNetworkActionBar
                    selectedTotal={selectedTotal}
                    store={store}
                    openModal={setActiveModal}
                    activeModal={activeModal}
                  />
                </>
              ) : null}
            </>
          </ProfilePageContainer>
          {notFound && (
            <div style={{ marginTop: "50px" }}>
              <div className={sharedStyles.emptyContainer}>
                <div className={sharedStyles.empty}>
                  <img
                    src={`${AWS_CDN_URL}/icons/empty-icons/empty-team.svg`}
                    alt="not found illustration"
                  />
                  <h2>404 Not Found</h2>
                  <p>
                    Were sorry the page your looking for cannot be found, click
                    below to head back to the dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}
        </ATSWrapper>
      </InnerPage>
      {addingFiles && (
        <UploadingDocumentsIndicator
          text={`Uploading documents to ${profileCompany?.name}. Please do not leave the profile while this is happening.`}
        />
      )}
    </>
  );
};

const hideRight = {
  jobs: true,
  analytics: true,
  candidates: true,
};

const withGreyBackground = { jobs: true, analytics: true };

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

const JobButton = styled.button`
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

const JobLinkSVG = () => (
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

let filesAccepted = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  ".doc",
  ".pdf",
  "application/pdf",
  ".docx",
  "application/octet-stream",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default CompanyProfile;
