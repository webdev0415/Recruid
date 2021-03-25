import React, { useState, useEffect, useContext, Suspense } from "react";
import { Redirect } from "react-router-dom";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { permissionChecker } from "constants/permissionHelpers";
// import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import notify from "notifications";
import { ROUTES } from "routes";

import ClientManagerBanner from "components/ClientManager/ClientManagerBanner";
import { fetchAllPipelines } from "helpers/crm/pipelines";
import retryLazy from "hooks/retryLazy";

const ClientOverview = React.lazy(() =>
  retryLazy(() => import("components/ClientManager/ClientOverview"))
);
const StageManager = React.lazy(() =>
  retryLazy(() => import("components/ClientManager/StageManager"))
);
const ContactsManager = React.lazy(() =>
  retryLazy(() => import("components/ClientManager/ContactsManager"))
);
const CompaniesManager = React.lazy(() =>
  retryLazy(() => import("components/ClientManager/CompaniesManager"))
);

const possibleTabs = {
  deals: "Deals",
  contacts: "Contacts",
  companies: "Companies",
  overview: "Overview",
};

const ClientManager = (props) => {
  const store = useContext(GlobalContext);
  const [activeModal, setActiveModal] = useState(undefined);
  const [allPipelines, setAllPipelines] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);
  const [search, setSearch] = useState("");
  const [pipeline, setPipeline] = useState(undefined);
  const [permission, setPermission] = useState({ view: false, edit: false });
  useEffect(() => {
    if (store.role) {
      setPermission(
        permissionChecker(store.role?.role_permissions, {
          business: true,
        })
      );
    }
  }, [store.role]);

  // IF LOADING ROUTE CONTAINS A TAB, SET THE COMPONENT TO THE RIGHT ONE
  useEffect(() => {
    if (
      store.company &&
      (!props.match.params.tab || !possibleTabs[props.match.params.tab])
    ) {
      setRedirect(ROUTES.ClientManager.url(store.company.mention_tag, "deals"));
    }
     
  }, [props.match.params.tab, store.company]);

  useEffect(() => {
    if (store.company && store.company.type === "Employer") {
      setRedirect(ROUTES.Vendors.url(store.company.mention_tag, "active"));
    }
  }, [store.company]);

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
    }
  }, [redirect]);

  useEffect(() => {
    if (activeModal) {
      setActiveModal(undefined);
    }
  }, [activeModal]);

  //FETCH ALL THE PIPELINES
  useEffect(() => {
    if (store.session && store.company && permission.view) {
      getAllPipelines();
    }
     
  }, [store.session, store.company, permission]);

  const getAllPipelines = async () => {
    return fetchAllPipelines(
      store.session,
      store.company.id,
      store.role.team_member?.team_member_id
    ).then((res) => {
      if (!res.err) {
        setAllPipelines(res);
        return res;
      } else {
        setAllPipelines(false);
        notify("danger", "Unable to fetch all pipelines");
        return res;
      }
    });
  };

  const openModal = (option) => setActiveModal(option);

  return (
    <InnerPage
      pageTitle={`${store.company ? store.company.name : ""} - Clients`}
      originName={`${possibleTabs[props.match.params.tab]} - CRM`}
    >
      {redirect && redirect !== props.location.pathname && (
        <Redirect to={redirect} />
      )}
      <ATSWrapper activeTab="clients" routeObject={ROUTES.ClientManager}>
        <>
          <ClientManagerBanner
            viewMode={props.match.params.tab}
            openModal={openModal}
            allPipelines={allPipelines}
            search={search}
            setSearch={setSearch}
            pipeline={pipeline}
            location={props.location}
          />

          {props.match.params.tab === "overview" && (
            <Suspense fallback={<div />}>
              <ClientOverview
                allPipelines={allPipelines}
                permission={permission}
              />
            </Suspense>
          )}
          {props.match.params.tab === "deals" && (
            <Suspense fallback={<div />}>
              <StageManager
                parentModal={activeModal}
                {...props}
                allPipelines={allPipelines}
                getAllPipelines={getAllPipelines}
                search={search}
                pipeline={pipeline}
                setPipeline={setPipeline}
                permission={permission}
              />
            </Suspense>
          )}
          {props.match.params.tab === "contacts" && (
            <Suspense fallback={<div />}>
              <ContactsManager
                parentModal={activeModal}
                {...props}
                search={search}
              />
            </Suspense>
          )}
          {props.match.params.tab === "companies" && (
            <Suspense fallback={<div />}>
              <CompaniesManager
                parentModal={activeModal}
                {...props}
                search={search}
                permission={permission}
              />
            </Suspense>
          )}
        </>
      </ATSWrapper>
    </InnerPage>
  );
};

export default ClientManager;
