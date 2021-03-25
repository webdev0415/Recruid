import React, { useState, useContext, useEffect } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { listEmailFromDb } from "helpersV2/outlook";
import NewEmail from "./NewEmail";
import EmailsList from "./EmailList";

const OutlookEmails = ({
  tnProfile,
  otherReceiver,
  receiverId,
  receiverType,
  getMsalToken
}) => {
  const store = useContext(GlobalContext);
  const [emails, setEmails] = useState(null);
  const [showNewEmail, setShowNewEmail] = useState(false);
  const [newEmailData, setNewEmailData] = useState(false);
  const [triggerEmailsUpdate, setTriggerEmailsUpdate] = useState(Math.random());

  useEffect(() => {
    (async () => {
      const listMailResponse = await listEmailFromDb(
        store.user.id,
        store.company.id,
        tnProfile?.tn_email || otherReceiver
      );
      setEmails(
        () =>
          listMailResponse?.map((email) => ({
            conversation_id: email.conversation_id,
            message_id: email.message_id,
            email_body: email.email_body,
            from: email.from,
            to: email.to,
            subject: email.subject,
            sent_at: email.sent_at,
            preview: email.preview,
          })) ?? null
      );
    })();
  }, [
    triggerEmailsUpdate,
    store.user,
    store.company,
    tnProfile,
    otherReceiver,
  ]);

  return (
    <div>
      <EmailsList
        setNewEmailData={setNewEmailData}
        emails={emails}
        session={store.session}
        openModal={() => setShowNewEmail(true)}
        getMsalToken={getMsalToken}
        role={store.role}
      />
      {showNewEmail && (
        <NewEmail
          getMsalToken={getMsalToken}
          closeModal={() => setShowNewEmail(false)}
          previewData={newEmailData}
          setPreviewData={setNewEmailData}
          setTriggerEmailsUpdate={setTriggerEmailsUpdate}
          emailReceiver={tnProfile?.tn_email || otherReceiver}
          receiverId={receiverId}
          receiverType={receiverType}
        />
      )}
    </div>
  );
};

export default OutlookEmails;
