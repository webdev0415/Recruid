import React, { useState, useContext, useEffect } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";
import { Base64 } from "js-base64";
import Spinner from "sharedComponents/Spinner";

import styled from "styled-components";
import {
  fetchCreateEmail,
  fetchEditEmail,
  buildHtmlBody,
  sendTestEmail,
} from "helpersV2/marketing/emails";
import { fetchMarketingSettings } from "helpersV2/marketing/settings";
import { getEmailDocuments } from "helpersV2/marketing/documents";
import { variableReplacer } from "sharedComponents/TemplateEditor/variableReplacer";

import EditEmail from "modals/MarketingEmailModal/EditEmail";
import ParticipantsList from "modals/MarketingEmailModal/ParticipantsList";
import ReviewStage from "modals/MarketingEmailModal/ReviewStage";
import EmailFullView from "components/EmailProfile/EmailFullView";
import JobSelection from "modals/MarketingEmailModal/JobSelection";
import ListSelection from "modals/MarketingEmailModal/ListSelection";
import { AWS_CDN_URL } from "constants/api";

const MODELS = {
  Client: "contact",
  ProfessionalTalentNetwork: "candidate",
};

let emptyBodyReg = /^<p[^>]*>(\s|&nbsp;|<\/?\s?br\s?\/?>)*<\/?p>$/;

let saveInterval = null;

const EmailModal = ({
  hide,
  receivers,
  source,
  editingEmail,
  refreshEmail,
  refreshList,
}) => {
  const store = useContext(GlobalContext);
  const [email, setEmail] = useState({
    subject: "",
    owner: "",
    body: editingEmail ? Base64.decode(editingEmail.body) : "",
    from_name: "",
    from_email: "",
  });
  const [emailBackup, setEmailBackup] = useState(undefined);
  const [view, setView] = useState("initial");
  const [template] = useState(undefined);
  const [participants, setParticipants] = useState([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [editSection, setEditSection] = useState(undefined);
  const [emailVariables, setEmailVariables] = useState(undefined);
  const [activeTemplate, setActiveTemplate] = useState(undefined);
  const [preview, setPreview] = useState(false);
  const [selectedJob, setSelectedJob] = useState(undefined);
  const [jobs, setJobs] = useState(undefined);
  const [filesToAdd, setFilesToAdd] = useState([]);
  const [marketingSettings, setMarketingSettings] = useState(undefined);
  const [emailSource, setEmailSource] = useState(undefined);

  const [
    triggerSave,
    // setTriggerSave
  ] = useState(undefined);
  const [autoSaving, setAutoSaving] = useState(false);
  const [emailId, setEmailId] = useState(undefined);
  const [hasJobLink, setHasJobLink] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  // useEffect(() => {
  //   saveInterval = setInterval(function () {
  //     setTriggerSave(Math.random());
  //   }, 15000);
  //   return () => clearInterval(saveInterval);
  //
  // }, []);

  useEffect(() => {
    if (triggerSave) {
      createEmail(true, true);
    }
  }, [triggerSave]);

  useEffect(() => {
    if ((store.session, store.company)) {
      fetchMarketingSettings(store.session, store.company.id).then((res) => {
        if (!res.err) {
          setMarketingSettings(res);
        } else {
          // notify("danger", "Unable to fetch marketing settings");
        }
      });
    }
  }, [store.session, store.company]);

  useEffect(() => {
    if (receivers) {
      setParticipants([...receivers]);
    }
  }, [receivers]);

  useEffect(() => {
    if (editingEmail) {
      setEmail({ ...editingEmail, body: Base64.decode(editingEmail.body) });
      setEmailId(editingEmail.id);
      if (editingEmail.attachments?.length > 0) {
        getEmailDocuments(
          store.company.id,
          store.session,
          store.user.id,
          [0, editingEmail.attachments.length],
          undefined,
          {
            id: editingEmail.attachments,
          }
        ).then((docs) => {
          if (docs !== "err" && !docs.err && !docs.message) {
            setFilesToAdd();
            if (filesToAdd?.length > 0) {
              setFilesToAdd([...filesToAdd, ...docs?.requested_documents]);
            } else {
              setFilesToAdd(docs?.requested_documents);
            }
          } else {
            setFilesToAdd(
              editingEmail.attachments.map((id) => {
                return { id };
              })
            );
            notify("danger", "Unable to fetch attachements");
          }
        });
      }
    }
  }, [editingEmail]);

  useEffect(() => {
    if (activeTemplate && store.session && store.company) {
      setEmail({
        ...email,
        subject: activeTemplate.subject,
        // from_name: activeTemplate.from_name,
        // from_email: activeTemplate.from_email,
      });
      if (activeTemplate.documents?.length > 0) {
        getEmailDocuments(
          store.company.id,
          store.session,
          store.user.id,
          [0, activeTemplate.documents.length],
          undefined,
          {
            id: activeTemplate.documents.map((doc) => doc.id),
          }
        ).then((docs) => {
          if (docs !== "err" && !docs.err && !docs.message) {
            if (filesToAdd?.length > 0) {
              setFilesToAdd([...filesToAdd, ...docs?.requested_documents]);
            } else {
              setFilesToAdd(docs?.requested_documents);
            }
          } else {
            notify("danger", "Unable to fetch attachements");
          }
        });
      }
    }
  }, [activeTemplate, store.session, store.company]);

  useEffect(() => {
    if (!template && store.teamMembers) {
      store.teamMembers.map((member) => {
        if (member.professional_id === store.session.id) {
          setEmail((email) => {
            return {
              ...email,
              from_name: member.name,
              from_email: member.email,
            };
          });
        }
        return null;
      });
    }
  }, [template, store.teamMembers, store.session]);

  const createEmail = (isDraft, autoSave) => {
    if (!autoSave) {
      clearInterval(saveInterval);
    }
    if (!email.subject) {
      return !autoSave ? notify("danger", "Email must have a subject") : null;
    }
    if (emptyBodyReg.test(email.body)) {
      return !autoSave ? notify("danger", "Email body has no content") : null;
    }
    if (autoSave) {
      setAutoSaving(true);
    }
    let body = {
      from_name: email.from_name,
      from_email: email.from_email,
      sent_by_name: store.user.name,
      sent_by_email: store.user.email,
      subject: email.subject,
      body: Base64.encodeURI(
        isDraft
          ? email.body
          : buildHtmlBody(
              email.body,
              marketingSettings?.marketing_logo || store.company.avatar_url,
              marketingSettings?.email_footer
            )
      ),
      company_id: store.company.id,
      created_by_id: store.session.id,
      sent_by_id: store.session.id,
      from_id: store.session.id,
      is_draft: isDraft,
      personalization: emailVariables,
      job_id: selectedJob?.id,
      attachments: filesToAdd.map((file) => file.id),
    };
    if (emailSource === "candidate") {
      body.receivers = participants
        .filter((part) => part.selected)
        .map((candidate) => {
          return {
            email: candidate.email,
            id: candidate.ptn_id || candidate.id,
            type: "ProfessionalTalentNetwork",
          };
        });
    } else if (emailSource === "contact") {
      body.receivers = participants
        .filter((part) => part.selected)
        .map((contact) => {
          return { email: contact.email, id: contact.id, type: "Client" };
        });
    } else if (emailSource === "client") {
      body.receivers = participants
        .filter((part) => part.selected)
        .map((client) => {
          return { email: client.email, id: client.id, type: "Company" };
        });
    }
    if (editingEmail || emailId) {
      fetchEditEmail(
        store.session,
        store.company.id,
        editingEmail?.id || emailId,
        body
      ).then((res) => {
        if (!res.err) {
          if (isDraft) {
            if (!autoSave) notify("info", "Email succesfully saved");
          } else {
            if (!autoSave) notify("info", "Email succesfully sent");
          }
          if (!autoSave) {
            if (refreshEmail) {
              refreshEmail();
            }

            hide();
          }
        } else {
          if (!autoSave) notify("danger", "Unable to send email");
        }
        setTimeout(function () {
          setAutoSaving(false);
        }, 1000);
      });
    } else {
      fetchCreateEmail(store.session, store.company.id, body).then((res) => {
        if (!res.err) {
          if (!autoSave) notify("info", "Email succesfully created");
          if (autoSave) {
            setEmailId(res.id);
          }
          if (!autoSave) {
            hide();
            if (refreshList) {
              refreshList();
            }
          }
        } else {
          if (!autoSave) notify("danger", "Unable to create email");
        }
        setTimeout(function () {
          setAutoSaving(false);
        }, 1000);
      });
    }
  };

  const moveToConfirmParticipants = () => {
    if (!email.subject) {
      return notify("danger", "Email must have a subject");
    }
    if (emptyBodyReg.test(email.body)) {
      return notify("danger", "Email body has no content");
    }
    let jobVariable = false;
    const sourceExchanger = {
      candidate: "ProfessionalTalentNetwork",
      client: "Company",
      contact: "Clients",
    };
    if (emailVariables && emailVariables.length > 0) {
      let matches = {};
      emailVariables.map((variable) => {
        if (variable.model === "JobPost") {
          jobVariable = true;
        }
        if (variable.model !== sourceExchanger[emailSource]) {
          matches[variable.model] = true;
        }
        return null;
      });
      if (matches.ProfessionalTalentNetwork) {
        return notify(
          "danger",
          "You have variables assigned to a different source, Candidate. Change them before continuing"
        );
      }
      if (matches.Company) {
        return notify(
          "danger",
          "You have variables assigned to a different source, Company. Change them before continuing"
        );
      }
      if (matches.Clients) {
        return notify(
          "danger",
          "You have variables assigned to a different source, Contact. Change them before continuing"
        );
      }
    }

    if (jobVariable) {
      setView("select-job");
    } else {
      if (selectedJob) {
        setSelectedJob(undefined);
      }
      if (receivers && receivers.length === 1) {
        setView("final");
      } else {
        if (source) {
          setView("confirm-participants");
        } else if (participants.filter((part) => part.selected).length === 0) {
          setView("select-list");
        } else {
          setView("confirm-participants");
        }
      }
    }
  };

  const selectParticipant = (index) => {
    let newParticipants = [...participants];
    newParticipants[index].selected = newParticipants[index].selected
      ? false
      : true;
    setParticipants(newParticipants);
  };

  const triggerEditSection = (section) => {
    setEditSection(section);
    setEmailBackup({ ...email });
  };

  const cancelEdit = () => {
    setEditSection(undefined);
    setEmail(emailBackup);
    setEmailBackup(undefined);
  };

  const setEmailFromTemplate = () => {};

  useEffect(() => {
    if (source) {
      setEmailSource(source);
    }
  }, [source]);

  useEffect(() => {
    if (!source) {
      if (emailVariables?.length > 0) {
        let src;
        emailVariables.map((variable) => {
          if (MODELS[variable.model]) {
            src = MODELS[variable.model];
          }
          return null;
        });
        setEmailSource(src);
      } else if (
        emailSource &&
        participants.filter((part) => part.selected).length === 0
      ) {
        setEmailSource(undefined);
      }
    }
  }, [emailVariables]);

  useEffect(() => {
    let filtered = participants.filter((part) => part.selected).length;
    if (filtered !== totalParticipants) {
      setTotalParticipants(filtered);
    }
  }, [participants]);

  const handleSendingTestEmail = async () => {
    if (!emailId) {
      createEmail(true, true);
      return;
    }
    const { session, company, user } = store;
    const testResponse = await sendTestEmail(
      session,
      company.id,
      emailId,
      user.email
    );
    if (testResponse.error) {
      notify("danger", testResponse.message);
      return;
    }

    notify("info", "Test email has been successfully sent.");
    setSendingTestEmail(false);
    return;
  };

  useEffect(() => {
    if (emailVariables) {
      let hasLink;
      emailVariables.map((varObj) => {
        if (varObj.model === "JobPost" && varObj.key === "slugified") {
          hasLink = true;
        }
        return null;
      });

      if (hasLink && !hasJobLink) {
        setHasJobLink(hasLink);
      } else if (!hasLink && hasJobLink) {
        setHasJobLink(hasLink);
      }
    }
  }, [emailVariables]);

  useEffect(() => {
    if (sendingTestEmail) {
      handleSendingTestEmail();
    }
  }, [sendingTestEmail, emailId]);
  return (
    <>
      <UniversalModal show={true} hide={hide} id="email-modal" width={960}>
        <ModalHeaderClassic
          title={
            view === "initial"
              ? "Create Marketing Email"
              : view === "confirm-participants"
              ? "Confirm Participants"
              : view === "select-list"
              ? "Add List"
              : "Review"
          }
          closeModal={hide}
        />
        {autoSaving && <SavingIndicator />}
        <STModalBody className="no-footer">
          {view === "initial" && (
            <EditEmail
              email={email}
              setEmail={setEmail}
              editSection={editSection}
              setEditSection={setEditSection}
              triggerEditSection={triggerEditSection}
              cancelEdit={cancelEdit}
              setView={setView}
              hide={hide}
              moveToConfirmParticipants={moveToConfirmParticipants}
              setEmailFromTemplate={setEmailFromTemplate}
              setEmailVariables={setEmailVariables}
              activeTemplate={activeTemplate}
              setActiveTemplate={setActiveTemplate}
              source={emailSource}
              filesToAdd={filesToAdd}
              setFilesToAdd={setFilesToAdd}
              participants={totalParticipants}
              createEmail={createEmail}
            />
          )}
          {view === "select-job" && (
            <JobSelection
              selectedJob={selectedJob}
              setSelectedJob={setSelectedJob}
              setView={setView}
              store={store}
              jobs={jobs}
              setJobs={setJobs}
              participants={participants}
              originalSource={source}
              hasJobLink={hasJobLink}
            />
          )}
          {view === "confirm-participants" && (
            <ParticipantsList
              participants={participants}
              selectParticipant={selectParticipant}
              setView={setView}
              source={emailSource}
              selectedJob={selectedJob}
            />
          )}
          {view === "select-list" && (
            <ListSelection
              store={store}
              source={emailSource}
              setEmailSource={setEmailSource}
              setView={setView}
              selectedJob={selectedJob}
              participants={participants}
              setParticipants={setParticipants}
            />
          )}
          {view === "final" && (
            <ReviewStage
              email={email}
              setEmail={setEmail}
              editSection={editSection}
              setEditSection={setEditSection}
              triggerEditSection={triggerEditSection}
              cancelEdit={cancelEdit}
              participants={participants}
              setView={setView}
              createEmail={createEmail}
              setPreview={setPreview}
              selectedJob={selectedJob}
              filesToAdd={filesToAdd}
              source={emailSource}
              handleSendingTestEmail={setSendingTestEmail}
              hasJobLink={hasJobLink}
            />
          )}
        </STModalBody>
      </UniversalModal>
      {preview && (
        <PreviewContainer>
          <CloseButton onClick={() => setPreview(false)} />
          <EmailFullView
            email={email}
            emailBody={buildHtmlBody(
              variableReplacer(email.body),
              marketingSettings?.marketing_logo || store.company.avatar_url,
              marketingSettings?.email_footer
            )}
          />
        </PreviewContainer>
      )}
    </>
  );
};

export default EmailModal;

const STModalBody = styled(ModalBody)`
  padding: 30px 0px !important;
  text-align: center;
`;

const PreviewContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: 10000;
  background: white;
  top: 0;
  left: 0;
  background: #f6f6f6;
  display: flex;
  align-items: center;
`;

const CloseButton = ({ onClick }) => (
  <STCloseButton onClick={onClick}>
    <img src={`${AWS_CDN_URL}/icons/CloseModal2.svg`} alt="Close" />
  </STCloseButton>
);

const SavingIndicator = () => (
  <SaveInd>
    <Spinner size="sm" inline />
    <span>Saving draft...</span>
  </SaveInd>
);

const SaveInd = styled.div`
  align-items: flex-end;
  color: #8d8d8d;
  display: flex;
  left: 10px;
  position: absolute;
  top: 10px;

  span {
    font-size: 10px;
    margin-left: 5px;
  }
`;

const STCloseButton = styled.button`
  position: absolute;
  right: 20px;
  top: 20px;
`;
