import React, { useEffect, useState, useContext, Suspense } from "react";
import styled from "styled-components";
import { Redirect, useParams, useLocation, Link } from "react-router-dom";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { ROUTES } from "routes";
// import notify from "notifications";
import { sortProfExperience } from "helpersV2/tnProfile";
import {
  PermissionChecker,
  permissionChecker,
} from "constants/permissionHelpers";
import { ProfilePageContainer } from "styles/PageContainers";
import CandidateHeader from "components/Profiles/components/candidate/CandidateHeader";
import ActionTyper from "sharedComponents/ActionCreator/ActionTyper";
import { uploadFile } from "helpersV2/CandidateProfile";
import helpers from "helpersV2/CandidateProfile";
import {
  // fetchResumes,
  convertCandidateToContact,
} from "helpersV2/CandidateProfile";
import { flattenLocations } from "sharedComponents/TagsComponent/methods/tags";
import { fetchAllCalls } from "helpersV2/calls";
import { fetchGetAllTasks } from "helpersV2/tasks";
import { fetchAllMeetings } from "helpersV2/meetings";
import notify from "notifications";
import { AWS_CDN_URL } from "constants/api";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import UploadingDocumentsIndicator from "sharedComponents/UploadingDocumentsIndicator";

import {
  ActionBackground,
  BodyLeft,
  BodyRight,
  BodyContainer,
  CandidateWrapper,
} from "components/Profiles/components/ProfileComponents";
import { EMAIL_REGEX } from "constants/regex";
import retryLazy from "hooks/retryLazy";
const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);

const CandidatesActivitiesTab = React.lazy(() =>
  retryLazy(() =>
    import("components/Profiles/Tabs/CandidateTabs/CandidateActivitiesTab")
  )
);
const CandidateOverviewTab = React.lazy(() =>
  retryLazy(() =>
    import("components/Profiles/Tabs/CandidateTabs/CandidateOverviewTab.js")
  )
);
const CandidateNotesTab = React.lazy(() =>
  retryLazy(() =>
    import("components/Profiles/Tabs/CandidateTabs/CandidateNotesTab")
  )
);
const CandidateExperienceTab = React.lazy(() =>
  retryLazy(() =>
    import("components/Profiles/Tabs/CandidateTabs/CandidateExperienceTab")
  )
);
const CandidateDocumentsTab = React.lazy(() =>
  retryLazy(() =>
    import("components/Profiles/Tabs/CandidateTabs/CandidateDocumentsTab")
  )
);
// const CandidateResumesTab = React.lazy(() =>
//   retryLazy(() =>
//     import("components/Profiles/Tabs/CandidateTabs/CandidateResumesTab")
//   )
// );
const CandidateJobsTab = React.lazy(() =>
  retryLazy(() =>
    import("components/Profiles/Tabs/CandidateTabs/CandidateJobsTab")
  )
);
const CandidateInterviewsTab = React.lazy(() =>
  retryLazy(() =>
    import("components/Profiles/Tabs/CandidateTabs/CandidateInterviewsTab")
  )
);

const CandidateAdvancedOptions = React.lazy(() =>
  retryLazy(() =>
    import("components/Profiles/Tabs/CandidateTabs/CandidateAdvancedOptions")
  )
);

const EmailTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Emails/EmailTab"))
);
const TasksTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/TasksTab"))
);
const CallsTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/CallsTab"))
);
const MeetsTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/Tabs/MeetsTab"))
);
const possibleTabs = {
  overview: true,
  activity: true,
  emails: true,
  experience: true,
  documents: true,
  // resumes: true,
  jobs: true,
  interviews: true,
  options: true,
};

const CandidateProfile = (props) => {
  const store = useContext(GlobalContext);
  const { tnProfileId, tab } = useParams();
  const location = useLocation();
  const [redirect, setRedirect] = useState(undefined);
  const [activeModal, setActiveModal] = useState(undefined);
  //BASE PROFILE
  const [tnProfile, setProfile] = useState(undefined);
  const [tnProfileBackUp, setTNProfileBackUp] = useState(undefined);
  const [originalLocations, setOriginalLocations] = useState(undefined);
  //RESUMES
  // const [resumes, setResumes] = useState(undefined);
  //DOCUMENTS
  const [documents, setDocuments] = useState(undefined);
  //INTERACTIONS
  const [interactions, setInteractions] = useState(undefined);
  const [totalInteractions, setTotalInteractions] = useState(undefined);
  //UI
  const [editSection, setEditSection] = useState(undefined);
  //JOBS
  const [jobs, setJobs] = useState(undefined);
  const [allClientStages, setAllClientStages] = useState({});

  //INTERVIEWS
  const [interviews, setInterviews] = useState(undefined);

  //NOTES
  const [notes, setNotes] = useState(undefined);
  const [replyToNote, setReplyToNote] = useState(undefined);
  //EXPERIENCE
  const [currentExperienceIx, setCurrentExperienceIx] = useState(undefined);
  const [experiences, setExperiences] = useState(undefined);
  //ACTIONS
  const [actionType, setActionType] = useState("note");
  const [actionTotals, setActionTotals] = useState({});
  //TASKS
  const [tasks, setTasks] = useState(undefined);
  //CALLS
  const [calls, setCalls] = useState(undefined);
  //MEETS
  const [meetings, setMeetings] = useState(undefined);
  // URL QUERY PARAMS
  const [queryParams, setQueryParams] = useState({});

  const [notFound, setNotFound] = useState(false);

  const [permission, setPermission] = useState({ view: false, edit: false });

  const [refresh, setRefresh] = useState(Math.random());
  const [addingFiles, setAddingFiles] = useState(false);

  useEffect(() => {
    if (store.role) {
      setPermission(
        permissionChecker(store.role?.role_permissions, {
          recruiter: true,
          hiring_manager: true,
        })
      );
    }
  }, [store.role]);

  // IF LOADING ROUTE CONTAINS A TAB, SET THE COMPONENT TO THE RIGHT ONE
  useEffect(() => {
    if (store.company && (!tab || !possibleTabs[tab])) {
      setRedirect(
        ROUTES.CandidateProfile.url(
          store.company.mention_tag,
          tnProfileId,
          "overview"
        )
      );
    }
  }, [tab, store.company]);

  //GRAB QUERY STRING PARAMS AND REMOVE THEM FROM THE URL
  useEffect(() => {
    if (store.company) {
      let query = new URLSearchParams(location.search);
      let client_id = query.get("client_id");
      let job_id = query.get("job_id");
      let applicant_id = query.get("applicant_id");
      setQueryParams({ client_id, applicant_id, job_id });
      if (location.search && location.search !== "") {
        // setRedirect(
        //   ROUTES.CandidateProfile.url(
        //     store.company.mention_tag,
        //     tnProfileId,
        //     "overview",
        //     ""
        //   )
        // );
      }
    }
  }, [store.company]);

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
    }
  }, [redirect]);

  useEffect(() => {
    if (tnProfileId && store.session && store.company) {
      helpers
        .fetchTalentNetworkProfile(
          tnProfileId,
          store.company.id,
          store.session,
          { id: queryParams.job_id }
        )
        .then((user) => {
          if (
            user !== "err" &&
            user.message !== "TN Profile no longer exists"
          ) {
            setProfile(user.tn_profile);
          } else {
            setNotFound(true);
            notify("danger", "Profile doesn't exist");
          }
        });
    }
  }, [tnProfileId, store.session, store.company, refresh]);

  useEffect(() => {
    if (tnProfile && !originalLocations) {
      setOriginalLocations(flattenLocations(tnProfile.localizations));
    }
  }, [tnProfile, originalLocations]);

  // useEffect(() => {
  //   if (tnProfile && !originalLocations) {
  //     setOriginalLocations(flattenLocations(tnProfile.localizations));
  //   }
  // }, [tnProfile, originalLocations]);

  // useEffect(() => {
  //   if (tnProfile && resumes === undefined) {
  //     fetchResumes(tnProfile.ptn_id, store.session).then((res) => {
  //       if (res !== "err" && !res.message) {
  //         setResumes(res);
  //       } else if (!res.message) {
  //         notify("danger", "Unable to fetch resumes");
  //         setResumes(false);
  //       } else {
  //         setResumes([]);
  //       }
  //     });
  //   }
  //
  // }, [tnProfile]);

  useEffect(() => {
    if (tnProfile) {
      const exp = sortProfExperience(tnProfile.experiences);
      const ix = exp.findIndex((exp) => {
        if (
          exp.start_year === exp.end_year &&
          exp.start_month === exp.end_month
        ) {
          return true;
        } else if (!exp.end_year) {
          return true;
        } else return false;
      });
      setExperiences(exp);
      setCurrentExperienceIx(ix);
    }
  }, [tnProfile]);

  useEffect(() => {
    if (tnProfile && calls === undefined) {
      fetchAllCalls(
        store.session,
        store.company.id,
        "candidate",
        tnProfile.ptn_id
      ).then((res) => {
        if (!res.err) {
          setCalls(res);
        } else {
          notify("danger", "Unable to fetch calls");
        }
      });
    }
  }, [tnProfile, store.company, store.session]);

  useEffect(() => {
    if (tnProfile && tasks === undefined) {
      fetchGetAllTasks(store.session, {
        source: ["candidate"],
        source_id: tnProfile.ptn_id,
      }).then((res) => {
        if (!res.err) {
          setTasks(res);
        } else {
          notify("danger", "Unable to fetch tasks");
        }
      });
    }
  }, [tnProfile, store.session]);

  useEffect(() => {
    if (tnProfile && meetings === undefined) {
      fetchAllMeetings(
        store.session,
        store.company.id,
        "candidate",
        tnProfile.ptn_id
      ).then((res) => {
        if (!res.err) {
          setMeetings(res);
        } else {
          notify("danger", "Unable to fetch meetings");
        }
      });
    }
  }, [tnProfile, store.session, store.company]);

  const editTalentNetworkProfile = () => {
    if (
      !tnProfile.tn_email ||
      tnProfile.tn_email === "" ||
      EMAIL_REGEX.test(tnProfile.tn_email) === false
    ) {
      return notify("danger", "Candidate must have a valid email");
    }
    const payload = {
      name: tnProfile.name,
      description: tnProfile.tn_description,
      tn_email: tnProfile.tn_email,
      phone: tnProfile.telephone,
      competencies_attributes: tnProfile.competencies_attributes,
      categorizations_attributes: tnProfile.categorizations_attributes,
      custom_source_id: tnProfile.custom_source_id || undefined,
      localizations_attributes: tnProfile.localizations_attributes,
      years_experience: tnProfile.years_experience,
      age: tnProfile.age,
      job_title: tnProfile.job_title,
      sex: tnProfile.sex,
      work_interest: tnProfile.work_interest,
      workplace_interest: tnProfile.workplace_interest,
      salary: tnProfile.salary,
      day_rate: tnProfile.day_rate,
      // hour_rate: tnProfile.hour_rate,
      salary_expectation: tnProfile.salary_expectation,
      immediate_start: tnProfile.immediate_start,
      travel_willingness: tnProfile.travel_willingness,
      contracted_until: tnProfile.contracted_until,
      hour_rate: tnProfile.hour_rate,
      owner_id: tnProfile.owner_id,
      company_id: store.company.id,
      // temp_plus: tnProfile.work_interest.indexOf("temp") !== -1,
    };

    helpers
      .editTalentNetworkProfile(
        tnProfileId,
        store.company.id,
        store.session,
        payload
      )
      .then((response) => {
        if (response && response.professional) {
          notify("info", "Profile succesfully updated");
          setEditSection(undefined);
          let profile = { ...tnProfile };
          profile.skills = response.professional.skills || profile.skills || [];
          profile.industries =
            response.professional.industries || profile.industries || [];
          profile.localizations = response.professional.locations;
          setOriginalLocations(response.professional.locations || []);
          profile.competencies_attributes = undefined;
          profile.categorizations_attributes = undefined;
          profile.localizations_attributes = undefined;
          if (profile.custom_source_id) {
            let sourceIx = store.sources.findIndex(
              (source) => Number(profile.custom_source_id) === source.id
            );
            profile.custom_source = store.sources[sourceIx];
          }
          setProfile(profile);
        } else {
          notify("danger", "Unable to update profile");
        }
      });
  };

  const triggerEditSection = (section) => {
    setEditSection(section);
    setTNProfileBackUp(tnProfile);
  };

  const cancelEdit = () => {
    setEditSection(undefined);
    setProfile(tnProfileBackUp);
    setTNProfileBackUp(undefined);
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

  const createContact = () => {
    convertCandidateToContact(store.session, store.company.id, {
      // company_id: store.company.id,
      ptn_id: tnProfile.ptn_id,
      title: tnProfile.job_title,
      owner_id: tnProfile.owner_id,
    }).then((res) => {
      if (!res.err) {
        setProfile({ ...tnProfile, deal_contact_id: res.id });
        notify("info", "Contact succesfully created");
      } else {
        notify("danger", res);
      }
    });
  };

  const addFilesToCandidate = (ev) => {
    if (
      !store.role.role_permissions.owner &&
      !store.role.role_permissions.recruiter
    ) {
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
        formData.append("ptn_id", tnProfile.ptn_id);
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
      setAddingFiles(false);
      console.error("Oops, no files.");
    }
  };

  return (
    <>
      <InnerPage
        pageTitle={`${tnProfile ? tnProfile.name : ""} - Candidate Profile`}
        originName={tnProfile?.name}
      >
        {redirect && redirect !== props.location.pathname && (
          <Redirect to={redirect} />
        )}
        <ATSWrapper activeTab={tab} routeObject={ROUTES.CandidateProfile}>
          <ProfilePageContainer
            onDrop={(e) => {
              e.preventDefault();
              addFilesToCandidate(e);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {tnProfile && (
              <>
                {/* <ProfileBanner store={store} /> */}
                <CandidateHeader
                  tnProfile={tnProfile}
                  editSection={editSection}
                  setProfile={setProfile}
                  triggerEditSection={triggerEditSection}
                  cancelEdit={cancelEdit}
                  editTalentNetworkProfile={editTalentNetworkProfile}
                  activeTab={tab}
                  experiences={experiences}
                  currentExperienceIx={currentExperienceIx}
                  actionType={actionType}
                  setActionType={setActionType}
                  actionTotals={actionTotals}
                  store={store}
                  permission={permission}
                  tnProfileId={tnProfileId}
                />
                <CandidateWrapper className="container container-ats">
                  <BodyContainer>
                    <BodyLeft>
                      {tab === "overview" && (
                        <div className="leo-relative">
                          {store.company.type === "Agency" && (
                            <ButtonContainer>
                              {!tnProfile.deal_contact_id ? (
                                <PermissionChecker
                                  type="edit"
                                  valid={{ recruiter: true }}
                                >
                                  <ActionButton
                                    onClick={() =>
                                      setActiveModal("create_contact")
                                    }
                                  >
                                    Convert to Contact
                                  </ActionButton>
                                </PermissionChecker>
                              ) : (
                                <ContactLink
                                  to={ROUTES.ContactProfile.url(
                                    store.company.mention_tag,
                                    tnProfile.deal_contact_id
                                  )}
                                >
                                  <LinkSVG />
                                  View Contact Profile
                                </ContactLink>
                              )}
                            </ButtonContainer>
                          )}
                          <Suspense fallback={<div />}>
                            <CandidateOverviewTab
                              tnProfile={tnProfile}
                              editSection={editSection}
                              triggerEditSection={triggerEditSection}
                              cancelEdit={cancelEdit}
                              setProfile={setProfile}
                              editTalentNetworkProfile={
                                editTalentNetworkProfile
                              }
                              store={store}
                              setEditSection={setEditSection}
                              // resumes={resumes}
                              originalLocations={originalLocations}
                              refreshProfile={() => setRefresh(Math.random())}
                            />
                          </Suspense>
                        </div>
                      )}
                      {tab === "activity" && (
                        <Suspense fallback={<div />}>
                          <CandidatesActivitiesTab
                            interactions={interactions}
                            setInteractions={setInteractions}
                            store={store}
                            tnProfileId={tnProfileId}
                            hasMoreInteractions={
                              interactions?.length === totalInteractions
                            }
                            queryParams={queryParams}
                            setTotalInteractions={setTotalInteractions}
                          />
                        </Suspense>
                      )}
                      {tab === "experience" && (
                        <Suspense fallback={<div />}>
                          <CandidateExperienceTab
                            experiences={experiences}
                            setExperiences={setExperiences}
                            store={store}
                            tnProfileId={tnProfileId}
                            refreshProfile={() => setRefresh(Math.random())}
                          />
                        </Suspense>
                      )}
                      {tab === "documents" && (
                        <Suspense fallback={<div />}>
                          <CandidateDocumentsTab
                            documents={documents}
                            setDocuments={setDocuments}
                            uploadFilesToProfile={uploadFilesToProfile}
                            store={store}
                            tnProfile={tnProfile}
                            permission={permission}
                          />
                        </Suspense>
                      )}
                      {/*tab === "resumes" && (
                        <Suspense fallback={<div />}>
                          <CandidateResumesTab
                            resumes={resumes}
                            setResumes={setResumes}
                            tnProfile={tnProfile}
                            store={store}
                          />
                        </Suspense>
                      )*/}
                      {tab === "emails" && (
                        <Suspense fallback={<div />}>
                          <EmailTab
                            tnProfile={tnProfile}
                            companyId={store.company.id}
                            activeTab={tab}
                            session={store.session}
                          />
                        </Suspense>
                      )}
                      {tab === "jobs" && (
                        <Suspense fallback={<div />}>
                          <CandidateJobsTab
                            jobs={jobs}
                            setJobs={setJobs}
                            store={store}
                            tnProfileId={tnProfileId}
                            tnProfile={tnProfile}
                            allClientStages={allClientStages}
                            setAllClientStages={setAllClientStages}
                            permission={permission}
                            activeModal={activeModal}
                            setActiveModal={setActiveModal}
                          />
                        </Suspense>
                      )}
                      {tab === "interviews" && (
                        <Suspense fallback={<div />}>
                          <CandidateInterviewsTab
                            store={store}
                            tnProfileId={tnProfileId}
                            interviews={interviews}
                            setInterviews={setInterviews}
                            canEdit={permission.edit}
                            tnProfile={tnProfile}
                          />
                        </Suspense>
                      )}
                      {tab === "options" && (
                        <Suspense fallback={<div />}>
                          <CandidateAdvancedOptions
                            store={store}
                            tnProfileId={tnProfileId}
                            tnProfile={tnProfile}
                            setRedirect={setRedirect}
                          />
                        </Suspense>
                      )}
                    </BodyLeft>
                    <BodyRight>
                      <PermissionChecker
                        type="edit"
                        valid={{ recruiter: true, hiring_manager: true }}
                      >
                        {actionType !== "email" && (
                          <ActionTyper
                            actionType={actionType}
                            setActionType={setActionType}
                            source={"candidate"}
                            notesSource={"ProfessionalTalentNetwork"}
                            sourceId={tnProfile.ptn_id}
                            store={store}
                            //candidate profile
                            tnProfileId={tnProfileId}
                            professionalId={tnProfileId}
                            tnId={tnProfile.ptn_id}
                            //job props
                            queryParams={queryParams}
                            profileName={tnProfile.name}
                            //callcreator props
                            candidates={[tnProfile]}
                            pushNote={pushNote}
                            pushTask={pushTask}
                            pushCall={pushCall}
                            pushMeet={pushMeet}
                            replyToNote={replyToNote}
                            setReplyToNote={setReplyToNote}
                          />
                        )}
                      </PermissionChecker>
                      {actionType === "note" && (
                        <Suspense fallback={<div />}>
                          <CandidateNotesTab
                            notes={notes}
                            setNotes={setNotes}
                            tnProfileId={tnProfileId}
                            tnProfile={tnProfile}
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
                            candidates={[tnProfile]}
                            // contacts={contacts}
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
                  </BodyContainer>
                </CandidateWrapper>
              </>
            )}
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
          {activeModal === "create_contact" && (
            <Suspense fallback={<div />}>
              <ConfirmModalV2
                id="create-contact"
                show={true}
                hide={() => setActiveModal(undefined)}
                header={
                  tnProfile.deal_contact_id
                    ? "Contact succesfully created"
                    : "Create Contact"
                }
                text={
                  tnProfile.deal_contact_id
                    ? "A contact has been created from this candidate, visit the contact page to view and edit it."
                    : "Would you like us to create a contact from this candidate?"
                }
                actionText={tnProfile.deal_contact_id ? "Visit" : "Create"}
                actionFunction={
                  tnProfile.deal_contact_id
                    ? () =>
                        setRedirect(
                          ROUTES.ContactProfile.url(
                            store.company.mention_tag,
                            tnProfile.deal_contact_id
                          )
                        )
                    : () => createContact()
                }
              />
            </Suspense>
          )}
        </ATSWrapper>
      </InnerPage>
      {addingFiles && (
        <UploadingDocumentsIndicator
          text={`Uploading documents to ${tnProfile?.name}. Please do not leave the profile while this is happening.`}
        />
      )}
    </>
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

const ContactLink = styled(Link)`
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

export default CandidateProfile;
