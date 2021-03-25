import React, { useEffect, useState, useContext, Suspense } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
import styled from "styled-components";
import { ROUTES } from "routes";
import { ProfilePageContainer } from "styles/PageContainers";
import retryLazy from "hooks/retryLazy";
import {
  PermissionChecker,
  permissionChecker,
} from "constants/permissionHelpers";
import DealHeader from "components/Profiles/components/deal/DealHeader";
import ActionTyper from "sharedComponents/ActionCreator/ActionTyper";
import {
  BodyLeft,
  BodyRight,
  BodyContainer,
  ActionBackground,
} from "components/Profiles/components/ProfileComponents";

import {
  fetchDealProfile,
  fetchDealContacts,
  fetchDealNotes,
  fetchDealDocuments,
  // fetchDealPotentialCandidates,
  fetchDealCompany,
  updateDeal,
  fetchChangeDealCompany,
  fetchRemoveDealContact,
} from "helpers/crm/deals";
import { fetchAllCalls } from "helpersV2/calls";
import { fetchAllPipelines } from "helpers/crm/pipelines";
import { fetchGetAllTasks } from "helpersV2/tasks";
import { fetchAllMeetings } from "helpersV2/meetings";
import { uploadFile, deleteDocumentCall } from "helpersV2/CandidateProfile";
import { AWS_CDN_URL } from "constants/api";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { ATSContainer } from "styles/PageContainers";
import UploadingDocumentsIndicator from "sharedComponents/UploadingDocumentsIndicator";

const ProfileActivitiesTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/ProfileActivitiesTab"))
);
const DealOverviewTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/DealTabs/DealOverviewTab"))
);
const NotesTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/NotesTab"))
);
const DocumentsTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/DocumentsTab"))
);
// import EmailsTab from "components/Profiles/components/EmailsTab";
const CallsTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/CallsTab"))
);
const ContactsTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/ContactsTab"))
);
const TasksTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/TasksTab"))
);
const DealAdvancedTab = React.lazy(() =>
  retryLazy(() => import("components/DealProfile/DealAdvancedTab"))
);
// import DealsTab from "components/Profiles/components/DealsTab";
// import JobsTab from "components/Profiles/components/JobsTab";
// import PotentialCandidatesTab from "components/Profiles/components/PotentialCandidatesTab";

const MeetsTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/MeetsTab"))
);
const CreateContactModal = React.lazy(() =>
  retryLazy(() => import("modals/CreateContactModal"))
);
const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);
const FETCH_ARRAY_LENGTH = 20;

const possibleTabs = {
  overview: true,
  activity: true,
  contacts: true,
  documents: true,
  options: true,
};

const DealProfile = (props) => {
  const store = useContext(GlobalContext);
  const { profileId, tab } = useParams();
  const [deal, setDeal] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);
  const [dealBackUp, setDealBackUp] = useState(undefined);
  const [allPipelines, setAllPipelines] = useState(undefined);

  //CONTACTS
  const [contacts, setContacts] = useState(undefined);
  const [updateContacts, setUpdateContacts] = useState(Math.random());
  //CALLS
  const [calls, setCalls] = useState(undefined);
  //TASKS
  const [tasks, setTasks] = useState(undefined);
  //UI
  const [editSection, setEditSection] = useState(undefined);
  //INTERACTIONS
  const [interactions, setInteractions] = useState(undefined);
  //NOTES
  const [notes, setNotes] = useState(undefined);
  const [addNote, setAddNote] = useState(undefined);
  const [replyToNote, setReplyToNote] = useState(undefined);

  //DOCUMENTS
  const [documents, setDocuments] = useState(undefined);
  // const [hasMoreCandidates, setHasMoreCandidates] = useState(false);
  // const [potentialCandidates, setPotentialCandidates] = useState(undefined);

  const [innerModal, setInnerModal] = useState(undefined);
  // const [hasMoreDeals, setHasMoreDeals] = useState(false);

  const [dealCompany, setDealCompany] = useState(null);

  //all companies to select, fetched on the overview tab if edit company is selected only
  const [allCompanies, setAllCompanies] = useState(undefined);
  //ACTIONS
  const [actionType, setActionType] = useState("note");
  const [actionTotals, setActionTotals] = useState({});
  //MEETS
  const [meetings, setMeetings] = useState(undefined);

  const [notFound, setNotFound] = useState(false);
  const [dealStage, setDealStage] = useState(undefined);
  const [permission, setPermission] = useState({ view: false, edit: false });
  const [addingFiles, setAddingFiles] = useState(false);
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
        ROUTES.DealProfile.url(store.company.mention_tag, profileId, "overview")
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
      //FETCH DEAL PROFILE
      fetchDealProfile(store.session, store.company.id, profileId).then(
        (res) => {
          if (!res.err) {
            setDeal(res);
          } else {
            setNotFound(true);
            notify("danger", "Unable to fetch deal profile");
          }
        }
      );

      //FETCH DEAL POTENTIAL CANDIDATES
      // fetchDealPotentialCandidates(
      //   store.session,
      //   store.company.id,
      //    profileId,
      //   [0, FETCH_ARRAY_LENGTH]
      // ).then(res => {
      //   if (!res.err) {
      //     setPotentialCandidates(res);
      //     setHasMoreCandidates(res.length === FETCH_ARRAY_LENGTH);
      //   } else {
      //     setPotentialCandidates(false);
      //     notify("danger", "Unable to fetch potential candidates");
      //   }
      // });
      // FETCH COMPANY OF DEAL
      fetchDealCompany(store.session, store.company.id, profileId).then(
        (res) => {
          if (!res.err) {
            setDealCompany(res);
          } else {
            notify("danger", "ERROR");
          }
        }
      );
    }
  }, [profileId, store.session, store.company]);

  useEffect(() => {
    if (profileId && store.company && store.session) {
      fetchDealContacts(store.session, store.company.id, profileId).then(
        (res) => {
          if (!res.err) {
            setContacts(res);
          } else {
            setContacts(false);
            notify("danger", "Unable to fetch contacts");
          }
        }
      );
    }
  }, [profileId, store.company, store.session, updateContacts]);

  useEffect(() => {
    if (profileId && store.company && store.session) {
      fetchAllCalls(store.session, store.company.id, "deal", profileId).then(
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
        source: ["deal"],
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
      fetchDealNotes(store.session, store.company.id, profileId, [0, 10]).then(
        (res) => {
          if (!res.err) {
            setNotes(res);
          } else {
            setContacts(false);
            notify("danger", "Unable to fetch notes");
          }
        }
      );
    }
  }, [profileId, store.company, store.session]);

  useEffect(() => {
    if (profileId && store.session && store.company) {
      fetchAllMeetings(store.session, store.company.id, "deal", profileId).then(
        (res) => {
          if (!res.err) {
            setMeetings(res);
          } else {
            notify("danger", "Unable to fetch meetings");
          }
        }
      );
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

  //FETCH ALL THE PIPELINES
  useEffect(() => {
    if (store.session && store.company && store.role) {
      fetchAllPipelines(
        store.session,
        store.company.id,
        store.role.team_member.team_member_id
      ).then((res) => {
        if (!res.err) {
          setAllPipelines(res.filter((pipe) => !pipe.archived));
        } else {
          setAllPipelines(false);
          notify("danger", "Unable to fetch all pipelines");
        }
      });
    }
  }, [store.session, store.company, store.role]);

  useEffect(() => {
    if (deal && allPipelines) {
      allPipelines.map((pipe) =>
        pipe.stages.map((stage) =>
          stage.id === deal.pipeline_stage_id ? setDealStage(stage) : null
        )
      );
    }
  }, [deal, allPipelines]);

  const fetchMoreNotes = () => {
    fetchDealNotes(store.session, store.company.id, profileId, [
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

  const saveDeal = (dealProps) => {
    setEditSection(undefined);
    updateDeal(
      store.session,
      store.company.id,
      profileId,
      dealProps ? { ...deal, ...dealProps } : deal
    ).then((res) => {
      if (!res.err) {
        setDeal(dealProps ? { ...res, ...dealProps } : res);
        notify("info", "Deal succesfully saved");
      } else {
        setDeal({ ...dealBackUp });
        notify("danger", "Unable to save deal details");
      }
      setEditSection(undefined);
      setDealBackUp(undefined);
    });
  };

  const triggerEditSection = (section) => {
    setEditSection(section);
    setDealBackUp(deal);
  };

  const cancelEdit = () => {
    setEditSection(undefined);
    setDeal(dealBackUp);
    setDealBackUp(undefined);
  };

  const deleteContact = (index) => {
    let newDeal = { ...deal };
    let contacts = [...deal.contacts];
    let contact = { ...deal.contacts[index] };
    contact.delete = true;
    contacts[index] = contact;
    newDeal.contacts = contacts;
    setDeal(newDeal);
  };

  // const fetchMoreCandidates = () => {
  //   fetchDealPotentialCandidates(
  //     store.session,
  //     store.company.id,
  //      profileId,
  //     [potentialCandidates.length, FETCH_ARRAY_LENGTH]
  //   ).then(res => {
  //     if (!res.err) {
  //       setPotentialCandidates([...potentialCandidates, ...res]);
  //       setHasMoreCandidates(res.length === FETCH_ARRAY_LENGTH);
  //     } else {
  //       notify("danger", "Unable to fetch potential candidates");
  //     }
  //   });
  // };

  const saveNewDealCompany = (newCompanyId) => {
    if (!newCompanyId || newCompanyId === dealCompany?.id) {
      cancelEdit();
    } else {
      fetchChangeDealCompany(
        store.session,
        store.company.id,
        profileId,
        newCompanyId
      ).then((res) => {
        if (!res.err) {
          notify("info", "Company succesfully changed");
          fetchDealCompany(store.session, store.company.id, profileId).then(
            (res) => {
              setEditSection(undefined);
              if (!res.err) {
                setDealCompany(res);
              } else {
                notify("danger", "ERROR");
              }
            }
          );
        } else {
          notify("danger", res.error);
          setEditSection(undefined);
        }
      });
    }
  };

  const removeContact = (contact_id) => {
    fetchRemoveDealContact(
      store.session,
      store.company.id,
      contact_id,
      profileId
    ).then((res) => {
      if (!res.err) {
        //force update
        setUpdateContacts(Math.random());
        notify("info", "Successfully removed contact");
      } else {
        notify("danger", "Unable to remove contact");
      }
    });
  };

  //=================DOCUMENTS===================================
  useEffect(() => {
    if (deal && documents === undefined) {
      fetchDealDocuments(store.session, deal.id, store.company.id).then(
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
  }, [deal]);

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
        formData.append("deal_id", deal.id);
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
              let newDocuments = [...returnedObjects, ...documents];
              setDocuments(newDocuments);
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

  const redirectToJob = () => {
    setRedirect(
      ROUTES.JobDashboard.url(store.company.mention_tag, deal.job.slug)
    );
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
        pageTitle={`${deal ? deal.name : ""} - Deal Profile`}
        originName={deal?.name}
      >
        {redirect && redirect !== props.location.pathname && (
          <Redirect to={redirect} />
        )}
        <ATSWrapper activeTab={tab} routeObject={ROUTES.DealProfile}>
          <ProfilePageContainer
            onDrop={(e) => {
              e.preventDefault();
              addFilesToClient(e);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <>
              {deal && (
                <>
                  <DealHeader
                    company={dealCompany}
                    deal={deal}
                    setDeal={setDeal}
                    editSection={editSection}
                    triggerEditSection={triggerEditSection}
                    cancelEdit={cancelEdit}
                    saveDeal={saveDeal}
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
                              {!deal.job &&
                                deal.create_job &&
                                (store.role?.role_permissions.owner ||
                                  store.role?.role_permissions.admin ||
                                  store.role?.role_permissions.recruiter) && (
                                  <ActionButton
                                    onClick={() =>
                                      setInnerModal("create_requisition")
                                    }
                                  >
                                    Convert to Job
                                  </ActionButton>
                                )}
                              {deal.job &&
                                deal.create_job &&
                                (store.role?.role_permissions.owner ||
                                  store.role?.role_permissions.admin ||
                                  store.role?.role_permissions.recruiter) && (
                                  <JobLink
                                    to={ROUTES.JobDashboard.url(
                                      store.company.mention_tag,
                                      deal.job.slugified
                                    )}
                                  >
                                    <JobLinkSVG />
                                    View Job
                                  </JobLink>
                                )}
                            </ButtonContainer>
                            <Suspense fallback={<div />}>
                              <DealOverviewTab
                                company={dealCompany}
                                deal={deal}
                                setDeal={setDeal}
                                editSection={editSection}
                                triggerEditSection={triggerEditSection}
                                cancelEdit={cancelEdit}
                                saveDeal={saveDeal}
                                store={store}
                                deleteContact={deleteContact}
                                setInnerModal={setInnerModal}
                                contacts={contacts}
                                allCompanies={allCompanies}
                                setAllCompanies={setAllCompanies}
                                saveNewDealCompany={saveNewDealCompany}
                                selectedDealId={profileId}
                                setRedirect={setRedirect}
                                dealStage={dealStage}
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
                              source="deal"
                            />
                          </Suspense>
                        )}
                        {tab === "contacts" && (
                          <Suspense fallback={<div />}>
                            <ContactsTab
                              contacts={contacts}
                              store={store}
                              modalId={"deal-profile"}
                              removeContact={removeContact}
                              setInnerModal={setInnerModal}
                              setRedirect={setRedirect}
                              canEdit={permission.edit}
                            />
                          </Suspense>
                        )}
                        {tab === "documents" && (
                          <Suspense fallback={<div />}>
                            <DocumentsTab
                              documents={documents}
                              setDocuments={setDocuments}
                              deleteDocument={deleteDocument}
                              uploadFilesToProfile={uploadFilesToProfile}
                              canEdit={permission.edit}
                            />
                          </Suspense>
                        )}
                        {tab === "options" && (
                          <DealAdvancedTab
                            deal={deal}
                            setDeal={setDeal}
                            setRedirect={setRedirect}
                            store={store}
                            allPipelines={allPipelines}
                            setAllPipelines={setAllPipelines}
                            saveDeal={saveDeal}
                          />
                        )}
                        {/* { tab === "emails" && <EmailsTab />}
          { tab === "candidates" && (
            <PotentialCandidatesTab
              potentialCandidates={potentialCandidates}
              hasMoreCandidates={hasMoreCandidates}
              fetchMoreCandidates={fetchMoreCandidates}
            />
          )} */}
                      </BodyLeft>
                      <BodyRight>
                        <PermissionChecker
                          type="edit"
                          valid={{ business: true }}
                        >
                          <ActionTyper
                            store={store}
                            actionType={actionType}
                            setActionType={setActionType}
                            source={"deal"}
                            notesSource={"Deal"}
                            sourceId={profileId}
                            // call creator props
                            clientCompany={dealCompany?.company}
                            contacts={contacts}
                            pushNote={pushNote}
                            pushTask={pushTask}
                            pushCall={pushCall}
                            pushMeet={pushMeet}
                            replyToNote={replyToNote}
                            setReplyToNote={setReplyToNote}
                            canEdit={permission.edit}
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
                              sourceId={profileId}
                              source={"Deal"}
                              setReplyToNote={setReplyToNote}
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
                      {innerModal === "create_contact" && (
                        <Suspense fallback={<div />}>
                          <CreateContactModal
                            show={true}
                            hide={() => setInnerModal(undefined)}
                            setTriggerUpdate={() =>
                              setUpdateContacts(Math.random())
                            }
                            dealId={profileId}
                          />
                        </Suspense>
                      )}
                      {innerModal === "create_requisition" && dealCompany && (
                        <Suspense fallback={<div />}>
                          <ConfirmModalV2
                            id="create-requisition"
                            show={true}
                            hide={() => setInnerModal(undefined)}
                            header={
                              deal.job
                                ? "Job succesfully created"
                                : "Create Requisition"
                            }
                            text={
                              deal.job
                                ? "A job has been created from this deal, visit the job page to view and edit it."
                                : "Congratulations on signing off this deal, would you like to create a job requisition for this deal?"
                            }
                            actionText={deal.job ? "Visit" : "Create"}
                            actionFunction={
                              deal.job
                                ? redirectToJob
                                : () =>
                                    setRedirect(
                                      ROUTES.JobCreation.url(
                                        store.company.mention_tag,
                                        `?deal_id=${profileId}${
                                          dealCompany && dealCompany.company
                                            ? `&client_id=${dealCompany.company.client_id}`
                                            : ""
                                        }`
                                      )
                                    )
                            }
                          />
                        </Suspense>
                      )}
                    </BodyContainer>
                  </ATSContainer>
                </>
              )}
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
        </ATSWrapper>
      </InnerPage>
      {addingFiles && (
        <UploadingDocumentsIndicator
          text={`Uploading documents to ${deal?.title}. Please do not leave the profile while this is happening.`}
        />
      )}
    </>
  );
};

export default DealProfile;

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

const JobLink = styled(Link)`
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
