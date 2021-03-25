import React, { useState, useContext, useEffect, Suspense } from "react";
import { Redirect } from "react-router-dom";
import InnerPage from "PageWrappers/InnerPage";
import { InnerPageContainer } from "styles/PageContainers";
import { ROUTES } from "routes";

import ATSBanner from "sharedComponents/ATSBanner";
import CompanyRow from "components/MyCompanies/components/CompanyRow/CompanyRow";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { ATSContainer } from "styles/PageContainers";
import retryLazy from "hooks/retryLazy";

const DevCreateCompanyModal = React.lazy(() =>
  retryLazy(() => import("modals/DevCreateCompanyModal"))
);

const MyCompanies = () => {
  const store = useContext(GlobalContext);
  const [redirect, setRedirect] = useState(undefined);
  const [activeModal, setActiveModal] = useState(undefined);

  useEffect(() => {
    if (
      store.allMyCompanies &&
      store.allMyCompanies.length === 1 &&
      store.allMyCompanies[0].mention_tag
    ) {
      setRedirect(`${store.allMyCompanies[0].mention_tag}/dashboard`);
    }
  }, [store.allMyCompanies]);

  useEffect(() => {
    if (store.user && store.user.temp_password) {
      setRedirect(ROUTES.NewPassword.url());
    }
  }, [store.user]);

  return (
    <InnerPage pageTitle="My Companies" originName="Companies">
      <InnerPageContainer>
        {redirect && <Redirect to={redirect} />}
        <ATSBanner
          page="Companies"
          name={store.user?.name}
          avatar={store.user?.avatar_url}
        >
          {store.user && store.user.id === 5067 && (
            <button onClick={() => setActiveModal("createCompany")}>
              CREATE COMPANY
            </button>
          )}
        </ATSBanner>
        <ATSContainer>
          <div className="row">
            {store.allMyCompanies &&
              store.allMyCompanies.map((company, index) => (
                <CompanyRow key={`company_${index}`} company={company} />
              ))}
          </div>
        </ATSContainer>
        {activeModal === "createCompany" && (
          <Suspense fallback={<div />}>
            <DevCreateCompanyModal hide={() => setActiveModal(undefined)} />
          </Suspense>
        )}
      </InnerPageContainer>
    </InnerPage>
  );
};

export default MyCompanies;
