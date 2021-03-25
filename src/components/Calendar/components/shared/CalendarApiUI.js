import React, {
  useState,
  useEffect,
  useRef,
  Fragment,
  useContext,
  Suspense,
} from "react";
import retryLazy from "hooks/retryLazy";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { CalendarContext } from "contexts/calendarContext/calendarProvider";
// Components
import { SettingsIco } from "components/Calendar/components/assets/SettingsIco";

// Helpers
import { API_ROOT_PATH } from "constants/api";

const IntegrationModal = React.lazy(() =>
  retryLazy(() =>
    import("components/Calendar/components/shared/IntegrationModal")
  )
);

const CalendarApiUI = () => {
  const { session, company } = useContext(GlobalContext);
  const { dispatch } = useContext(CalendarContext);
  const [gUser, setGUser] = useState({
    name: ``,
    email: ``,
    avatar: ``,
  });
  const [recursionFlag, setRecursionFlag] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [code, setCode] = useState("");

  let auth2 = useRef(null);

  async function setFirstVisit() {
    const endpoint = `${API_ROOT_PATH}/v1/interview_events/${session.id}/set_first_visit`;
    const parametrs = { method: `GET`, headers: session };
    try {
      return await fetch(endpoint, parametrs);
    } catch (err) {
      console.error(err);
    }
  }

  async function checkFirstVisit() {
    const endpoint = `${API_ROOT_PATH}/v1/interview_events/${session.id}/check_first_visit`;
    const parametrs = { method: `GET`, headers: session };
    try {
      const request = await fetch(endpoint, parametrs);
      const response = await request.json();
      if (response.first_visit) {
        openModal();
        setFirstVisit();
      }
      return;
    } catch (err) {
      console.error(err);
    }
  }

  // Load GoogleAPI
  function loadGoogleApi() {
    window.gapi.load("auth2", () => {
      auth2.current = window.gapi.auth2.init({
        apiKey: process.env.REACT_APP_G_API_KEY,
        clientId: process.env.REACT_APP_G_CLIEND_ID,
        // discoveryDocs: [
        //   "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
        //   "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        // ],
        scope: "openid profile https://www.googleapis.com/auth/calendar",
      });
    });
  }

  function signIn() {
    if (auth2.current)
      auth2.current
        .grantOfflineAccess({
          redirect_uri: "postmessage",
          approval_prompt: "force",
          include_granted_scopes: false,
          scope: "openid profile https://www.googleapis.com/auth/calendar",
        })
        .then((data) => setCode(data.code));
  }

  async function signOut() {
    const endpoint = `${API_ROOT_PATH}/v1/interview_events/${session.id}/${company.id}/delete_guser`;
    const params = { method: `DELETE`, headers: session };
    try {
      await fetch(endpoint, params);
      setGUser({ name: ``, email: ``, avatar: `` });
      dispatch({ type: "SET_G_TOKEN", payload: "" });
    } catch (err) {
      console.error(`${err}`);
    }
  }
  // Initial load: first we load GoogleAPI
  useEffect(() => {
    loadGoogleApi();
    // eslint-disable-next-line
  }, []);
  //  Initial load: then check if we have GUser for current professional in our DB
  useEffect(() => {
    (async function getGoogleUser() {
      const endpoint = `${API_ROOT_PATH}/v1/interview_events/${session.id}/${company.id}/get_guser`;
      const params = { method: `GET`, headers: session };
      try {
        const getData = await fetch(endpoint, params);
        const data = await getData.json();
        // If we don't have the user we break out of the flow
        const { message, name, email, avatar, access_token } = data;
        if (message === "GUser not present") {
          checkFirstVisit();
          return;
        }
        setGUser({ name, email, avatar });
        return access_token
          ? dispatch({ type: "SET_G_TOKEN", payload: access_token })
          : dispatch({ type: "SET_G_TOKEN", payload: "" });
      } catch (err) {
        console.error(`${err}`);
      }
    })();
    // eslint-disable-next-line
  }, [recursionFlag, company]);

  // Once we Signed In the user via Google we create a new GUser in our DB
  useEffect(() => {
    if (code.length) {
      // Asing for permission to get a cide wich will be send exchanged for access token in the future
      (async function createGoogleUser() {
        const endpoint = `${API_ROOT_PATH}/v1/interview_events/${session.id}/${company.id}/create_guser`;
        const params = {
          method: `POST`,
          headers: session,
          body: JSON.stringify({ code }),
        };
        try {
          if (!code.length)
            throw new Error(`Unable to get a code from Google server`);
          await fetch(endpoint, params);
          return setRecursionFlag((state) => !state);
        } catch (err) {
          console.error(`${err}`);
        }
      })();
    }
  }, [session, code, auth2]);

  const openModal = () => setActiveModal(true);
  const closeModal = () => setActiveModal(false);

  return (
    <Fragment>
      <button onClick={openModal}>
        <SettingsIco />
      </button>
      {activeModal && (
        <Suspense fallback={<div />}>
          <IntegrationModal
            show={activeModal}
            closeModal={closeModal}
            signIn={signIn}
            signOut={signOut}
            userName={gUser.name}
            userEmail={gUser.email}
            userAvatar={gUser.avatar}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default CalendarApiUI;

// const codeExchange = async code => {
//   const url = `https://www.googleapis.com/oauth2/v4/token`;
//   const headers = { "Content-Type": "application/json" };
//   const form = {
//     client_id:
//       "604253835665-v93p2gepj1dthp78mrjrmr7g54t4c37s.apps.googleusercontent.com",
//     client_secret: "lI4GCwcdlITKN6OAgJVurvrc",
//     code: code,
//     grant_type: "authorization_code",
//     redirect_uri: "http://localhost:3000"
//   };
//   try {
//     const request = await fetch(url, {
//       method: `POST`,
//       headers,
//       body: JSON.stringify(form)
//     });
//     const response = await request.json();
//   } catch (err) {
//     console.error(err);
//   }
// };

// async function updateGUser(token, expiry) {
//   const endpoint = `${API_ROOT_PATH}/v1/interview_events/${session.id}/${company.id}/update_guser`;
//   const body = { token: { data: token, expiry_date: expiry } };
//   const params = {
//     method: `PUT`,
//     headers: session,
//     body: JSON.stringify(body)
//   };
//   try {
//     await fetch(endpoint, params);
//     return;
//   } catch (err) {
//     console.error(`Failed to refresh the token`);
//   }
// }
