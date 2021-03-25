import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  Fragment,
} from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import ConnectGmail from "./ConnectGmail";
import OutlookEmails from "./Outlook/Emails";
import { useMsal } from "hooks/useMsal";
import EmailsList from "./EmailsList";
import NewEmail from "./NewEmail";
import {
  authInit,
  createGmailUser,
  getGmailUser,
  listEmails,
  updateIncludeSignature,
} from "./emailMethods";

import {
  TabTitle,
  SectionTitleContainer,
  SectionContainer,
} from "components/Profiles/components/ProfileComponents";
import Spinner from "sharedComponents/Spinner";

import notify from "notifications";

function EmailTab({ tnProfile, session, companyId, activeTab }) {
  const store = useContext(GlobalContext);
  const auth2 = useRef(null);
  const [emails, setEmails] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [gmailUser, setGmailUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [modalActive, setModalActive] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [shouldThreadUpdate, setShouldThreadUpdate] = useState(null);
  // OUTLOOK
  const { msalLoggedIn, getMsalToken, handleMsalLogin } = useMsal(store);
  const [triggerUpdate, setTriggerUpdate] = useState(-1);

  const grantAccess = () => {
    if (auth2.current) {
      auth2.current
        .grantOfflineAccess({
          redirect_uri: "postmessage",
          approval_prompt: "force",
          scope:
            "openid profile https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly",
          include_granted_scopes: false,
        })
        .then((data) => {
          const cb = async () =>
            await getGmailUser(session, companyId, setGmailUser, setLoading);
          if (!!data.code && cb)
            createGmailUser(session, data.code, companyId, cb);
          else
            notify("danger", "Failed to get the code from googleAuth server.");
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    const cb = () => getGmailUser(session, companyId, setGmailUser, setLoading);
    authInit(window.gapi, auth2, cb);
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (activeTab === "Emails New" && gmailUser) {
      setModalActive(true);
    }
  }, [activeTab, gmailUser]);

  useEffect(() => {
    setLoading(true);
    listEmails(
      tnProfile.ptn_id,
      companyId,
      session,
      undefined,
      tnProfile.tn_email || tnProfile.email,
      tnProfile.ptn_id,
      "TalentNetworkProfile"
    )
      .then((data) => {
        setEmails(data);
        setLoading(false);
      })
      .catch((err) => {
        notify("danger", err);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [tnProfile, forceUpdate]);

  useEffect(() => {
    if (triggerUpdate !== -1) {
      getGmailUser(session, companyId, setGmailUser, null);
    }
  }, [triggerUpdate, session, companyId]);

  const handleThreadUdpdate = () =>
    setShouldThreadUpdate((state) => {
      if (state === null) return true;
      return !state;
    });

  const openModal = (data = null) => {
    setModalActive(true);
    setModalData(data);
    return;
  };

  const closeModal = () => setModalActive(false);

  const sendEmailCallback = () => {
    setForceUpdate((state) => !state);
    setModalActive(false);
    handleThreadUdpdate();
  };

  const handleIncludeSignatureUpdate = (session, gmailUserId) => async () => {
    const response = await updateIncludeSignature(session, gmailUserId);
    if (response.success) {
      setTriggerUpdate(Math.random());
      return;
    }
    notify(
      "danger",
      "Could not update your signature settings. Please, try again later."
    );
  };

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      {!gmailUser && !msalLoggedIn && (
        <ConnectGmail
          grantAccess={grantAccess}
          handleMsalLogin={handleMsalLogin}
          store={store}
        />
      )}
      {!!gmailUser && (
        <>
          <SectionContainer>
            <SectionTitleContainer>
              <TabTitle>Emails</TabTitle>
            </SectionTitleContainer>
            <EmailsList
              emails={emails}
              gmailUser={gmailUser}
              grantAccess={grantAccess}
              openModal={openModal}
              session={session}
              shouldThreadUpdate={shouldThreadUpdate}
              role={store.role}
              receiver_id={tnProfile.ptn_id}
              setGmailUser={setGmailUser}
            />
          </SectionContainer>
          {modalActive && (
            <NewEmail
              tnProfile={tnProfile}
              receiverId={tnProfile.ptn_id}
              receiverType="ProfessionalTalentNetwork"
              gmailUser={gmailUser}
              companyId={companyId}
              closeModal={closeModal}
              session={session}
              modalData={modalData}
              sendEmailCallback={sendEmailCallback}
              handleIncludeSignatureUpdate={handleIncludeSignatureUpdate}
            />
          )}
        </>
      )}
      {!!msalLoggedIn && (
        <OutlookEmails tnProfile={tnProfile} getMsalToken={getMsalToken} />
      )}
    </Fragment>
  );
}

export default EmailTab;
