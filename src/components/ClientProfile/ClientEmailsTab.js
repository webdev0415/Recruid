import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  Fragment,
} from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import ConnectGmail from "components/Profiles/Emails/ConnectGmail";
import OutlookEmails from "components/Profiles/Emails/Outlook/Emails";
import { useMsal } from "hooks/useMsal";
import EmailsList from "components/Profiles/Emails/EmailsList";
import NewEmail from "components/Profiles/Emails/NewEmail";
import {
  authInit,
  createGmailUser,
  getGmailUser,
  listEmails,
  updateIncludeSignature,
} from "components/Profiles/Emails/emailMethods";

import {
  TabTitle,
  SectionTitleContainer,
  SectionContainer,
} from "components/Profiles/components/ProfileComponents";

import notify from "notifications";
import Spinner from "sharedComponents/Spinner";

const EmailTab = ({ profileCompany }) => {
  const store = useContext(GlobalContext);
  const auth2 = useRef(null);
  // const { current: loading } = useRef();
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
          scope: "openid profile email https://mail.google.com/",
          include_granted_scopes: false,
        })
        .then((data) => {
          const cb = async () =>
            await getGmailUser(
              store.session,
              store.company.id,
              setGmailUser,
              setLoading
            );
          if (!!data.code && cb)
            createGmailUser(store.session, data.code, store.company.id, cb);
          else
            notify("danger", "Failed to get the code from googleAuth server.");
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    const cb = () =>
      getGmailUser(store.session, store.company.id, setGmailUser, setLoading);
    authInit(window.gapi, auth2, cb);
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setLoading(true);
    listEmails(
      undefined,
      store.company.id,
      store.session,
      undefined,
      profileCompany.email,
      profileCompany.id,
      "Company"
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
  }, [profileCompany, forceUpdate]);

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

  useEffect(() => {
    if (triggerUpdate !== -1) {
      getGmailUser(store.session, store.company.id, setGmailUser, null);
    }
  }, [triggerUpdate, store.session, store.company.id]);

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
              session={store.session}
              shouldThreadUpdate={shouldThreadUpdate}
              role={store.role}
              receiver_id={profileCompany?.id}
              setGmailUser={setGmailUser}
            />
          </SectionContainer>
          {modalActive && (
            <NewEmail
              otherReceiver={profileCompany?.email}
              receiverId={profileCompany?.id}
              receiverType="Company"
              gmailUser={gmailUser}
              companyId={store.company.id}
              closeModal={closeModal}
              session={store.session}
              modalData={modalData}
              sendEmailCallback={sendEmailCallback}
              handleIncludeSignatureUpdate={handleIncludeSignatureUpdate}
            />
          )}
        </>
      )}
      {!!msalLoggedIn && (
        <OutlookEmails
          otherReceiver={profileCompany?.email}
          receiverId={profileCompany?.id}
          receiverType="Company"
          getMsalToken={getMsalToken}
        />
      )}
    </Fragment>
  );
};

export default EmailTab;
