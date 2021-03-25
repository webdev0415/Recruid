import React, { useContext, useState } from "react";

import GlobalContext from "contexts/globalContext/GlobalContext";
import { getSession } from "contexts/globalContext/GlobalMethods";
import { AWS_CDN_URL } from "constants/api";
import {
  LogoContainer,
  PageContainer,
  PageLeft,
  PageLeftFooter,
  PageLeftHeader,
  PageLeftList,
  PageRight,
  PageRightContainer,
  PageRightHeader,
} from "./OnboardComponents";
import OuterPage from "PageWrappers/OuterPage";
import TrialForm from "components/CompanyTrial/NewTrialForm";

import "./fonts/fonts.css";

const TrialOnboardFlow = (props) => {
  const store = useContext(GlobalContext);
  return (
    <OuterPage>
      <TrialPage {...props} store={store} />
    </OuterPage>
  );
};

const TrialPage = (props) => {
  const [logginIn, setLoggingIn] = useState(false);
  const [page, setPage] = useState(0);

  const handleLoginRequest = (login) => {
    if (logginIn === false) {
      setLoggingIn(true);
      getSession(props.store.dispatch, login).then(() => setLoggingIn(false));
    }
  };

  return (
    <PageContainer>
      <PageLeft>
        <LogoContainer>
          <img src={`${AWS_CDN_URL}/icons/Logo.svg`} alt="Logo" />
        </LogoContainer>
        <PageLeftHeader>
          <h3>Try Leo’s all-in-one recruiting software free for 14 days.</h3>
          <p>
            Want to see more info instead?{" "}
            <a href="https://www.hirewithleo.com/trial">Go here</a>
          </p>
        </PageLeftHeader>
        <PageLeftList>
          <ul>
            <li>
              <img src={`${AWS_CDN_URL}/icons/Wifi.svg`} alt="Wifi" /> Manage
              your recruitment remotely
            </li>
            <li>
              <img src={`${AWS_CDN_URL}/icons/Timer.svg`} alt="Timer" />
              Unlimited trial, with all features included
            </li>
            <li>
              <img src={`${AWS_CDN_URL}/icons/Onboard.svg`} alt="Onboard" />{" "}
              Onboard as many recruiters, clients, hiring managers and agencies
              as you like
            </li>
            <li>
              <img src={`${AWS_CDN_URL}/icons/Card.svg`} alt="Card" /> No credit
              card required, no software to install
            </li>
          </ul>
        </PageLeftList>
        <PageLeftFooter>
          <p>
            Prefer a guided demo?{" "}
            <a href="https://www.hirewithleo.com">Let’s schedule a call</a>
          </p>
        </PageLeftFooter>
      </PageLeft>
      <PageRight>
        <PageRightContainer>
          <PageRightHeader>
            <h2>
              {page === 0
                ? "Start Your Free Trial"
                : page === 1
                ? "One last step"
                : "Trial Onboarding"}
            </h2>
            {page === 1 ? (
              <p>
                To start your free trial, tell us about the company you’re
                hiring for:
              </p>
            ) : (
              ""
            )}
          </PageRightHeader>
          <TrialForm
            handleLoginRequest={handleLoginRequest}
            page={page}
            setPage={setPage}
          />
        </PageRightContainer>
      </PageRight>
    </PageContainer>
  );
};

export default TrialOnboardFlow;
