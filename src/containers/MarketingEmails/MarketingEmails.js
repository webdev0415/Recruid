import React, { useState, useEffect, useContext, Suspense } from "react";
import { Redirect, useParams } from "react-router-dom";
import { PermissionChecker } from "constants/permissionHelpers";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { ROUTES } from "routes";
import ATSBanner from "sharedComponents/ATSBanner";
import { InnerPageContainer } from "styles/PageContainers";
import { permissionChecker } from "constants/permissionHelpers";
import retryLazy from "hooks/retryLazy";

const MarketingEmailsTab = React.lazy(() =>
  retryLazy(() => import("components/MarketingEmails/MarketingEmailsTab"))
);
const MarketingCareersPortalTab = React.lazy(() =>
  retryLazy(() =>
    import("components/MarketingEmails/MarketingCareersPortalTab")
  )
);
const MarketingDocumentsTab = React.lazy(() =>
  retryLazy(() => import("components/MarketingEmails/MarketingDocumentsTab"))
);
const MarketingSettingsTab = React.lazy(() =>
  retryLazy(() => import("components/MarketingEmails/MarketingSettingsTab"))
);
const MarketingOverviewTab = React.lazy(() =>
  retryLazy(() => import("components/MarketingEmails/MarketingOverviewTab"))
);
const TemplatesTab = React.lazy(() =>
  retryLazy(() => import("components/MarketingEmails/TemplatesTab"))
);
const MarketingReceiversTab = React.lazy(() =>
  retryLazy(() => import("components/MarketingEmails/MarketingReceiversTab"))
);

const possibleTabs = {
  overview: "Overview",
  emails: "Emails",
  templates: "Templates",
  lists: "Lists",
  settings: "Settings",
  documents: "Documents",
  careers: "Careers Portal",
};

const ClientManager = (props) => {
  const store = useContext(GlobalContext);
  const { tab } = useParams();
  const [redirect, setRedirect] = useState(undefined);
  const [activeModal, setActiveModal] = useState(undefined);
  const [tabs, setTabs] = useState([]);
  const [permission, setPermission] = useState({ view: false, edit: false });
  useEffect(() => {
    if (store.role) {
      setPermission(
        permissionChecker(store.role?.role_permissions, {
          marketer: true,
        })
      );
      setTabs([
        {
          name: "overview",
          title: "Overview",
          url: (routerProps) =>
            ROUTES.MarketingEmails.url(
              routerProps.match.params.companyMentionTag,
              "overview"
            ),
        },
        {
          name: "emails",
          title: "Emails",
          url: (routerProps) =>
            ROUTES.MarketingEmails.url(
              routerProps.match.params.companyMentionTag,
              "emails"
            ),
        },
        {
          name: "templates",
          title: "Templates",
          url: (routerProps) =>
            ROUTES.MarketingEmails.url(
              routerProps.match.params.companyMentionTag,
              "templates"
            ),
        },
        {
          name: "lists",
          title: "Lists",
          url: (routerProps) =>
            ROUTES.MarketingEmails.url(
              routerProps.match.params.companyMentionTag,
              "lists"
            ),
        },
        {
          name: "documents",
          title: "Documents",
          url: (routerProps) =>
            ROUTES.MarketingEmails.url(
              routerProps.match.params.companyMentionTag,
              "documents"
            ),
        },
        ...(store.role?.role_permissions.owner ||
        (store.role?.role_permissions.admin &&
          store.role?.role_permissions.marketer)
          ? [
              {
                name: "careers",
                title: "Careers Portal",
                url: (routerProps) =>
                  ROUTES.MarketingEmails.url(
                    routerProps.match.params.companyMentionTag,
                    "careers"
                  ),
              },
              {
                name: "settings",
                title: "Settings",
                url: (routerProps) =>
                  ROUTES.MarketingEmails.url(
                    routerProps.match.params.companyMentionTag,
                    "settings"
                  ),
              },
            ]
          : []),
      ]);
    }
  }, [store.role]);

  // IF LOADING ROUTE CONTAINS A TAB, SET THE COMPONENT TO THE RIGHT ONE
  useEffect(() => {
    if (store.company && (!tab || !possibleTabs[tab])) {
      setRedirect(ROUTES.MarketingEmails.url(store.company.mention_tag));
    }
     
  }, [tab, store.company]);

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
    }
  }, [redirect]);

  return (
    <InnerPage
      pageTitle={`${store.company ? store.company.name : ""} - Marketing`}
      originName={`${possibleTabs[tab]} - Marketing`}
    >
      {redirect && redirect !== props.location.pathname && (
        <Redirect to={redirect} />
      )}
      <ATSWrapper activeTab="marketing" routeObject={ROUTES.MarketingEmails}>
        <InnerPageContainer>
          <ATSBanner
            name={store.company?.name}
            avatar={store.company?.avatar_url}
            page="Marketing"
            activeTab={tab}
            tabType="link"
            tabs={tabs}
          >
            <PermissionChecker type="edit" valid={{ marketer: true }}>
              {tab === "emails" && (
                <button
                  className="button button--default button--blue-dark"
                  onClick={() => setActiveModal("create-email")}
                >
                  Create Email
                </button>
              )}
              {tab === "templates" && (
                <button
                  className="button button--default button--blue-dark"
                  onClick={() => setActiveModal("create-template")}
                >
                  Create Template
                </button>
              )}
              {tab === "documents" && (
                <label
                  htmlFor="documents"
                  className="button button--default button--blue-dark"
                >
                  Add Document
                </label>
              )}
              {tab === "lists" && (
                <button
                  className="button button--default button--blue-dark"
                  onClick={() => setActiveModal("create_list_modal")}
                >
                  Create List
                </button>
              )}
            </PermissionChecker>
          </ATSBanner>
          {tab === "overview" && (
            <Suspense fallback={<div />}>
              <MarketingOverviewTab
                store={store}
                activeModal={activeModal}
                setActiveModal={setActiveModal}
                setRedirect={setRedirect}
                permission={permission}
              />
            </Suspense>
          )}
          {tab === "emails" && (
            <Suspense fallback={<div />}>
              <MarketingEmailsTab
                store={store}
                activeModal={activeModal}
                setActiveModal={setActiveModal}
                setRedirect={setRedirect}
                permission={permission}
              />
            </Suspense>
          )}
          {tab === "templates" && (
            <Suspense fallback={<div />}>
              <TemplatesTab
                store={store}
                activeModal={activeModal}
                setActiveModal={setActiveModal}
                permission={permission}
              />
            </Suspense>
          )}
          {tab === "settings" &&
            (store.role?.role_permissions.owner ||
              (store.role?.role_permissions.admin &&
                store.role?.role_permissions.marketer)) && (
              <Suspense fallback={<div />}>
                <MarketingSettingsTab
                  store={store}
                  activeModal={activeModal}
                  setActiveModal={setActiveModal}
                  permission={permission}
                />
              </Suspense>
            )}
          {tab === "documents" && (
            <Suspense fallback={<div />}>
              <MarketingDocumentsTab
                store={store}
                activeModal={activeModal}
                setActiveModal={setActiveModal}
                setRedirect={setRedirect}
                permission={permission}
              />
            </Suspense>
          )}
          {tab === "careers" &&
            (store.role?.role_permissions.owner ||
              (store.role?.role_permissions.admin &&
                store.role?.role_permissions.marketer)) && (
              <Suspense fallback={<div />}>
                <MarketingCareersPortalTab
                  store={store}
                  activeModal={activeModal}
                  setActiveModal={setActiveModal}
                  permission={permission}
                />
              </Suspense>
            )}
          {tab === "lists" && (
            <Suspense fallback={<div />}>
              <MarketingReceiversTab
                store={store}
                activeModal={activeModal}
                setActiveModal={setActiveModal}
                permission={permission}
              />
            </Suspense>
          )}
        </InnerPageContainer>
      </ATSWrapper>
    </InnerPage>
  );
};

export default ClientManager;
