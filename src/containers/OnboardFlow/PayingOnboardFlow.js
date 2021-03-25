import React, { useContext, useState } from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { Elements, StripeProvider } from "react-stripe-elements";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { getSession } from "contexts/globalContext/GlobalMethods";

import {
  Clock,
  Cloud,
  Logo,
  LogoContainer,
  Onboard,
  PageContainer,
  PageLeft,
  PageLeftFooter,
  PageLeftHeader,
  PageLeftList,
  Plan,
  PlanDetails,
  PagePlan,
  PageRight,
  PageRightContainer,
  PageRightHeader,
  Tick,
  Wifi,
} from "./OnboardComponents";
import OuterPage from "PageWrappers/OuterPage";
import CreateForm from "components/CompanyTrial/NewCreateForm";

import "./fonts/fonts.css";

const PayingOnboardFlow = () => {
  const store = useContext(GlobalContext);
  const location = useLocation();
  const queryParams = queryString.parse(location?.search);
  const [logginIn, setLoggingIn] = useState(false);
  const [page, setPage] = useState(0);
  const [
    plan,
    // setPlan
  ] = useState(queryParams?.plan);
  const [
    planPeriod,
    // setPlanPeriod
  ] = useState(queryParams?.planPeriod);

  const handleLoginRequest = (login) => {
    if (logginIn === false) {
      setLoggingIn(true);
      getSession(store.dispatch, login).then(() => setLoggingIn(false));
    }
  };

  return (
    <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
      <OuterPage>
        <PageContainer>
          <PageLeft>
            <LogoContainer>
              <Logo />
            </LogoContainer>
            <PageLeftHeader>
              <h3>
                Leo connects the dots in your recruitment process, so you can
                focus on the hiring.
              </h3>
            </PageLeftHeader>
            <PageLeftList>
              <ul>
                <li>
                  <Wifi /> Manage your recruitment remotely
                </li>
                <li>
                  <Tick /> All features included
                </li>
                <li>
                  <Onboard /> Onboard your recruiters, clients, hiring managers
                  and agencies
                </li>
                <li>
                  <Clock /> 24/7 customer support
                </li>
                <li>
                  <Cloud /> No software to install
                </li>
              </ul>
            </PageLeftList>
            <PageLeftFooter>
              <p>
                Want to talk instead?{" "}
                <a href="https://www.hirewithleo.com">Let’s schedule a call</a>
              </p>
            </PageLeftFooter>
          </PageLeft>
          <PageRight>
            <PageRightContainer>
              <PageRightHeader>
                <h2>Start using Leo</h2>
                <PagePlan>
                  <h4>Your Plan</h4>
                  <Plan>
                    <svg
                      width="12"
                      height="12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g fill="none" fill-role="evenodd">
                        <circle fill="#77EBBE" cx="6" cy="6" r="6" />
                        <circle fill="#FFF" cx="6" cy="6" r="3" />
                      </g>
                    </svg>
                    <PlanDetails>
                      {plan === "team5" ? (
                        <>
                          <strong>Teams up to 5</strong> - £
                          {planPeriod === "yearly"
                            ? "328 per month"
                            : "400 per month"}
                          <span>Billed {planPeriod}</span>
                        </>
                      ) : plan === "team10" ? (
                        <>
                          <strong>Teams of 5 - 10</strong> - £
                          {planPeriod === "yearly"
                            ? "656 per month"
                            : "800 per month"}
                          <span>Billed {planPeriod}</span>
                        </>
                      ) : plan === "team25" ? (
                        <>
                          <strong>Teams of 10 - 25</strong> - £
                          {planPeriod === "yearly"
                            ? "1,230 per month"
                            : "1,500 per month"}
                          <span>Billed {planPeriod}</span>
                        </>
                      ) : plan === "team50" ? (
                        <>
                          <strong>Teams of 25 - 50</strong> - £
                          {planPeriod === "yearly"
                            ? "2,460 per month"
                            : "3,000 per month"}
                          <span>Billed {planPeriod}</span>
                        </>
                      ) : (
                        <>
                          <strong>Single User</strong> - £
                          {planPeriod === "yearly"
                            ? "80 per month"
                            : "100 per month"}
                          <span>Billed {planPeriod}</span>
                        </>
                      )}
                    </PlanDetails>
                  </Plan>
                </PagePlan>
                {page === 1 ? (
                  <p style={{ marginBottom: 40 }}>
                    Tell us about the company you’re recruiting for:
                  </p>
                ) : page === 2 ? (
                  <p style={{ marginBottom: 30 }}>
                    Enter your payment details to complete your order:
                  </p>
                ) : (
                  ""
                )}
              </PageRightHeader>
              <Elements>
                <CreateForm
                  handleLoginRequest={handleLoginRequest}
                  page={page}
                  setPage={setPage}
                  store={store}
                  plan={plan}
                  planPeriod={planPeriod}
                />
              </Elements>
            </PageRightContainer>
          </PageRight>
        </PageContainer>
      </OuterPage>
    </StripeProvider>
  );
};

export default PayingOnboardFlow;
