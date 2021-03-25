import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  Fragment,
} from "react";
// import * as msal from "@azure/msal-browser";
import { useMsal } from "hooks/useMsal";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { grantAccess } from "helpers/gapi/globalMethods";
import {
  authInit,
  getGmailUser,
  deleteGmailUser,
  createGmailUser,
} from "components/Profiles/Emails/emailMethods";
import {
  getGoogleCalendarUser,
  deleteGoogleCalendarUser,
  createGoogleCalendarUser,
} from "helpers/gapi/calendar/methods";
// import GcalIco from "components/Profiles/Emails/assets/gcal-ico";
import styled from "styled-components";
import { ATSContainer } from "styles/PageContainers";
import InboxScanBox from "sharedComponents/InboxScanBox";
import { AWS_CDN_URL } from "constants/api";

export default function UserTab({ company, session }) {
  const store = useContext(GlobalContext);
  // GOOGLE
  const [gmailUser, setGmailUser] = useState(undefined);
  const [googleCalendarUser, setGoogleCalendarUser] = useState(null);
  // OUTLOOK
  const {
    msalInst,
    msalLoggedIn,
    msalUserAccount,
    handleMsalLogin,
    handleMsalLogout,
  } = useMsal(store);

  const auth2 = useRef({});

  useEffect(() => {
    (async function () {
      let requests = [
        () => authInit(window.gapi, auth2, null),
        () => getGmailUser(session, company.id, setGmailUser, null),
        () => getGoogleCalendarUser(session, company, setGoogleCalendarUser),
      ];
      for await (let req of requests) {
        req();
      }
    })();
    // eslint-disable-next-line
  }, []);

  const gmailCallback = () => setGmailUser(null);

  const disconnectGmail = () =>
    deleteGmailUser(company, session, gmailCallback);

  const connectGmailApi = async () => {
    if (auth2.current) {
      const createGmailUserCallback = () =>
        getGmailUser(session, company.id, setGmailUser, null);
      const offlineAccessCallback = async (code) => {
        await createGmailUser(
          session,
          code,
          company.id,
          createGmailUserCallback
        );
      };
      grantAccess(auth2, offlineAccessCallback, "email");
    } else return null;
  };

  const googleCalendarCallback = () => setGoogleCalendarUser(null);

  const disconnectGoogleCalendar = () =>
    deleteGoogleCalendarUser(session, company, googleCalendarCallback);

  const connectGoogleCalendarApi = () => {
    if (auth2.current) {
      const createCalendarUserCallback = () =>
        getGoogleCalendarUser(session, company, setGoogleCalendarUser);
      const offlineAccessCallback = (code) =>
        createGoogleCalendarUser(
          session,
          company,
          code,
          createCalendarUserCallback
        );
      grantAccess(auth2, offlineAccessCallback, "calendar");
    } else return null;
  };

  return (
    <ATSContainer>
      <SubHeading>Connect your Email</SubHeading>
      <EmailContainer>
        {gmailUser === null && !msalUserAccount && (
          <Fragment>
            <Button onClick={connectGmailApi}>
              <img src={`${AWS_CDN_URL}/icons/GmailIco.svg`} alt="Gmail Icon" />
              <span>Sign in with Google</span>
            </Button>
          </Fragment>
        )}
        {!!gmailUser && (
          <Fragment>
            <GoogleWrapper>
              <GoogleProfile>
                <GoogleProfileDetails>
                  <p>{gmailUser.name}</p>
                  <span>{gmailUser.email}</span>
                </GoogleProfileDetails>
              </GoogleProfile>
              <button
                className="button button--default button--white button--google"
                onClick={disconnectGmail}
              >
                Disconnect
              </button>
            </GoogleWrapper>
          </Fragment>
        )}
        {gmailUser === null && !msalLoggedIn && (
          <Fragment>
            <OutlookButton
              onClick={handleMsalLogin}
              disabled={!msalInst}
              className={!msalInst && "disabled"}
              style={gmailUser ? { marginLeft: "10px" } : {}}
            >
              {/* <OutlookIcoWrapper> */}
              <img
                src={`${AWS_CDN_URL}/icons/outlook_ico.svg`}
                alt="Outlook Icon"
                width="18px"
              />
              {/* </OutlookIcoWrapper> */}
              <span>Sign in with Outlook</span>
            </OutlookButton>
          </Fragment>
        )}
        {!!msalUserAccount && (
          <Fragment>
            <GoogleWrapper>
              <GoogleProfile>
                <GoogleProfileDetails>
                  <p>{msalUserAccount?.name}</p>
                  <span>{msalUserAccount?.username}</span>
                </GoogleProfileDetails>
              </GoogleProfile>
              <button
                className="button button--default button--white button--google"
                onClick={handleMsalLogout}
              >
                Disconnect
              </button>
            </GoogleWrapper>
          </Fragment>
        )}
      </EmailContainer>
      {!!gmailUser && !gmailUser?.emails_imported && (
        <InboxScanBox gmailUser={gmailUser} setGmailUser={setGmailUser} />
      )}
      <SubHeading>Connect your Calendar</SubHeading>
      {!googleCalendarUser ? (
        <Button onClick={connectGoogleCalendarApi}>
          <img src={`${AWS_CDN_URL}/icons/GmailIco.svg`} alt="Gmail Icon" />
          <span>Sign in with Google</span>
        </Button>
      ) : (
        <Fragment>
          <GoogleWrapper>
            <GoogleProfile>
              <GoogleProfileDetails>
                <p>{googleCalendarUser.name}</p>
                <span>{googleCalendarUser.email}</span>
              </GoogleProfileDetails>
            </GoogleProfile>
            <button
              className="button button--default button--white "
              onClick={disconnectGoogleCalendar}
            >
              Disconnect
            </button>
          </GoogleWrapper>
        </Fragment>
      )}
    </ATSContainer>
  );
}

// const Heading = styled.h2`
//   margin: 20px 0;
//   font-size: 22px;
//   font-weight: 600;
//   color: #1e1e1e;
// `;

const SubHeading = styled.h2`
  margin: 10px 0;
  font-size: 15px;
  font-weight: 500;
  color: #1e1e1e;
`;

const EmailContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  align-items: center;
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  display: flex;
  font-family: "Roboto";
  font-weight: 500;
  height: 40px;
  justify-content: center;
  margin-bottom: 20px;
  padding: 11px;

  &.disabled {
    opacity: 0.6;
  }

  svg,
  img {
    margin-right: 10px;
  }

  span {
    color: #757575;
    font-size: 14px;
    // font-weight: 600;
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const GoogleWrapper = styled.div`
  min-width: 350px;
  max-width: 450px;
  margin-bottom: 20px;
  align-items: center;
  background: #fafafa;
  border: 1px solid rgba(193, 195, 200, 0.5);
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
`;

const GoogleProfile = styled.div`
  align-items: center;
  display: flex;
  margin-right: 5px;
`;

const GoogleProfileDetails = styled.div`
  p {
    font-size: 14px;
    font-weight: 500;
    margin: 0;
  }

  span {
    color: #74767b;
    font-size: 13px;
    max-width: 285px;
    word-wrap: anywhere;
  }
`;

// const OutlookIcoWrapper = styled.div`
//   margin-right: 10px;
//   width: 25px;

//   img {
//     width: 100%;
//   }
// `;

const OutlookButton = styled(Button)`
  // padding: 11px 20px;
`;

// const SubSubHeading = styled(SubHeading)`
//   font-size: 14px;
// `;
