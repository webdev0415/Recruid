import { useState, useEffect } from "react";
import * as msal from "@azure/msal-browser";
import {
  msalConfig,
  handleSsoSilent,
  handleLogin,
  getMsalLoginHint,
  updateMsalLoginHint,
  getSilentToken,
} from "helpersV2/outlook";

export const useMsal = (store) => {
  const [msalInst, setMsalInst] = useState(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const [userAccount, setUserAccount] = useState(undefined);
  const [accessToken, setAccessToken] = useState(undefined);
  const [tokenExpiresOn, setTokenExpiresOn] = useState(undefined);

  useEffect(() => {
    let newMsalInst;
    if (!msalInst) {
      newMsalInst = new msal.PublicClientApplication(msalConfig);
      setMsalInst(newMsalInst);
    } else {
      newMsalInst = msalInst;
    }

    (async () => {
      const loginHintResp = await getMsalLoginHint(store.session);
      const loginHint = loginHintResp.msal_login_hint;
      const username = loginHintResp.msal_username;

      if (!loginHint) return null;

      const loggedInAccount = await newMsalInst.getAccountByHomeId(loginHint);

      if (loggedInAccount?.homeAccountId) {
        setIsLoggedIn(true);
        setUserAccount(loggedInAccount);
        return;
      }

      if (loginHint) {
        const loginRes = await handleSsoSilent(newMsalInst, username);

        if (loginRes.error && loginRes.message === "action required") {
          return setIsLoggedIn(false);
        }

        if (loginRes.accessToken) {
          setIsLoggedIn(true);
          setUserAccount(loginRes.account);
          setAccessToken(loginRes.accessToken);
          setTokenExpiresOn(loginRes.expiresOn);
          updateMsalLoginHint(
            loginRes.account?.homeAccountId,
            loginRes.account?.username,
            store.session
          );
        }
      }

      if (!loggedInAccount) {
        return setIsLoggedIn(false);
      }
    })();
  }, [store.session, msalInst]);

  const handleMsalLogin = async () => {
    const loginRes = await handleLogin(msalInst);

    if (loginRes.accessToken) {
      setIsLoggedIn(true);
      setUserAccount(loginRes.account);
      setAccessToken(loginRes.accessToken);
      setTokenExpiresOn(loginRes.expiresOn);
      updateMsalLoginHint(
        loginRes.account.homeAccountId,
        loginRes.account.username,
        store.session
      );
    }
  };

  const handleGetSilentToken = async () => {
    const tokenRes = await getSilentToken(msalInst, userAccount);

    if (tokenRes && tokenRes.accessToken) {
      setIsLoggedIn(true);
      setUserAccount(tokenRes.account);
      setAccessToken(tokenRes.accessToken);
      setTokenExpiresOn(tokenRes.expiresOn);
      updateMsalLoginHint(
        tokenRes.account.homeAccountId,
        tokenRes.account.username,
        store.session
      );

      return tokenRes.accessToken;
    }
  };

  const handleMsalLogout = () => {
    msalInst.logout({ account: userAccount });
    setIsLoggedIn(false);
    setUserAccount(undefined);
    setAccessToken(undefined);
    setTokenExpiresOn(undefined);
  };

  const getMsalToken = async () => {
    if (!!accessToken && tokenExpiresOn.getTime() < Date.now()) {
      return accessToken;
    }

    return await handleGetSilentToken();
  };

  return {
    msalInst,
    msalLoggedIn: isLoggedIn,
    msalUserAccount: userAccount,
    handelMsalToken: handleGetSilentToken,
    getMsalToken,
    handleMsalLogin,
    handleMsalLogout,
  };
};
