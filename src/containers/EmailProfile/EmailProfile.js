import React, { useEffect, useState, useContext, Suspense } from "react";
import { Redirect, useParams } from "react-router-dom";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import GlobalContext from "contexts/globalContext/GlobalContext";
import MarketingEmailModal from "modals/MarketingEmailModal";
import notify from "notifications";
import styled from "styled-components";
import { ROUTES } from "routes";
import { fetchNetwork } from "helpersV2/candidates";
import { fetchContactList } from "helpers/crm/contacts";
import { fetchCompaniesList } from "helpers/crm/clientCompanies";
import { Base64 } from "js-base64";
import { variableReplacer } from "sharedComponents/TemplateEditor/variableReplacer";
import { buildHtmlBody } from "helpersV2/marketing/emails";
import {
  BodyLeft,
  BodyRight,
  BodyContainer,
  ActionBackground,
} from "components/Profiles/components/ProfileComponents";
import { ProfilePageContainer } from "styles/PageContainers";
import EmailHeader from "components/EmailProfile/EmailHeader";
import EmailPreview from "components/EmailProfile/EmailPreview";
import EmailFullView from "components/EmailProfile/EmailFullView";
import {
  fetchGetEmailProfile,
  fetchEditEmail,
  fetchArchiveToggle,
  getEmailInteractions,
} from "helpersV2/marketing/emails";
import { fetchDeleteEmail } from "helpersV2/marketing/emails";
import { fetchMarketingSettings } from "helpersV2/marketing/settings";
import { ATSContainer } from "styles/PageContainers";
import retryLazy from "hooks/retryLazy";

const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);
const EmailOverviewTab = React.lazy(() =>
  retryLazy(() => import("components/EmailProfile/EmailOverviewTab"))
);
const EmailRecipients = React.lazy(() =>
  retryLazy(() => import("components/EmailProfile/EmailRecipients"))
);

const possibleTabs = {
  overview: true,
  recipients: true,
  detail: true,
};

const EmailProfile = (props) => {
  const store = useContext(GlobalContext);
  const { profileId, tab } = useParams();
  const [email, setEmail] = useState(undefined);
  const [stats, setStats] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);
  const [activeModal, setActiveModal] = useState(undefined);
  const [candidates, setCandidates] = useState(undefined);
  const [contacts, setContacts] = useState(undefined);
  const [companies, setCompanies] = useState(undefined);
  const [receiverType, setReceiverType] = useState(undefined);
  const [refresh, setRefresh] = useState(undefined);
  const [marketingSettings, setMarketingSettings] = useState(undefined);
  const [emailInteractions, setEmailInteractions] = useState(undefined);

  useEffect(() => {
    if ((store.session, store.company)) {
      fetchMarketingSettings(store.session, store.company.id).then((res) => {
        if (!res.err) {
          setMarketingSettings(res);
        } else {
          // notify("danger", "Unable to fetch marketing settings");
        }
      });
    }
  }, [store.session, store.company]);

  // IF LOADING ROUTE CONTAINS A TAB, SET THE COMPONENT TO THE RIGHT ONE
  useEffect(() => {
    if (store.company && (!tab || !possibleTabs[tab])) {
      setRedirect(
        ROUTES.EmailProfile.url(
          store.company.mention_tag,
          profileId,
          "overview"
        )
      );
    }
  }, [tab, store.company]);

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
    }
  }, [redirect]);

  useEffect(() => {
    const { session, company } = store;
    if (session && company?.id && profileId) {
      fetchGetEmailProfile(session, company.id, profileId)
        .then((emailData) => {
          if (!!emailData && !emailData.err) {
            setStats(emailData.stats);
            setEmail(emailData.email);

            return getEmailInteractions(
              session,
              company.id,
              emailData.email.id
            ).then((emailInteractionsData) => {
              if (emailInteractionsData.error)
                return notify(
                  "danger",
                  "Could not get emails interactions. Please try again later."
                );
              // const interactions = emailInteractionsData.reduce()
              let interactions = {};

              for (let [key, value] of Object.entries(emailInteractionsData)) {
                interactions[key] = value.reduce(
                  (acc, currentVal) => {
                    let accumulator = { ...acc };
                    if (currentVal.event === "open") {
                      accumulator.opens++;
                      accumulator.lastOpen = new Date(
                        Math.max(
                          acc.lastOpen,
                          new Date(currentVal.triggered_at)
                        )
                      );

                      return accumulator;
                    }

                    accumulator.clicks++;
                    accumulator.lastClick = new Date(
                      Math.max(acc.lastClick, new Date(currentVal.triggered_at))
                    );

                    return accumulator;
                  },
                  {
                    opens: 0,
                    clicks: 0,
                    lastOpen: 0,
                    lastClick: 0,
                  }
                );
              }

              return setEmailInteractions(interactions);
            });
          }
          return notify(
            "danger",
            "Couldn't get Your email. Please, try again later"
          );
        })
        .catch((err) => notify("danger", err));
    }
  }, [store.session, store.company, profileId, refresh]);

  const removeEmail = () => {
    fetchDeleteEmail(store.session, store.company.id, [email.id]).then(
      (res) => {
        if (!res.err) {
          notify("info", "Email succesfully removed");
          setRedirect(
            ROUTES.MarketingEmails.url(store.company.mention_tag, "emails")
          );
        } else {
          notify("danger", res);
        }
      }
    );
  };
  const archiveEmail = () => {
    fetchArchiveToggle(
      store.session,
      store.company.id,
      [email.id],
      !email.archived
    ).then((res) => {
      if (!res.err) {
        notify(
          "info",
          `Email succesfully ${email.archived ? "unarchived" : "archived"}`
        );
        setRefresh(Math.random());
      } else {
        notify("danger", res);
      }
    });
  };

  useEffect(() => {
    if (
      store.session &&
      store.company &&
      email &&
      email.receivers.length > 0 &&
      store.role
    ) {
      let contact_ids = [];
      let company_ids = [];
      let candidate_ids = [];

      email.receivers.map((receiv) => {
        if (receiv.type === "Client") {
          contact_ids.push(receiv.id);
        }
        if (receiv.type === "ProfessionalTalentNetwork") {
          candidate_ids.push(receiv.id);
        }
        if (receiv.type === "Company") {
          company_ids.push(receiv.id);
        }
        return null;
      });
      if (contact_ids.length > 0) {
        setReceiverType("contact");
        fetchContactList(store.session, {
          slice: [0, contact_ids.length],
          company_id: store.company.id,
          operator: "and",
          id: contact_ids,
        }).then((res) => {
          if (!res.err) {
            setContacts(
              res.map((receive) => {
                return { ...receive, selected: true };
              })
            );
          } else {
            notify("danger", "Unable to fetch contacts");
          }
        });
      }
      if (candidate_ids.length > 0) {
        setReceiverType("candidate");
        fetchNetwork(store.session, store.company.id, {
          slice: [0, candidate_ids.length],
          operator: "and",
          id: candidate_ids,
          team_member_id: store.role.team_member.team_member_id,
        }).then((talentNetwork) => {
          if (!talentNetwork.err) {
            setCandidates(
              talentNetwork.results.map((receive) => {
                return { ...receive, selected: true };
              })
            );
          } else {
            notify("danger", talentNetwork);
          }
        });
      }
      if (company_ids.length > 0) {
        setReceiverType("client");
        fetchCompaniesList(store.session, {
          slice: [0, company_ids.length],
          company_id: store.company.id,
          operator: "and",
          id: company_ids,
        }).then((res) => {
          if (!res.err) {
            setCompanies(
              res.map((receive) => {
                return { ...receive, selected: true };
              })
            );
          } else {
            notify("danger", "Unable to fetch companies");
          }
        });
      }
    }
  }, [email, store.session, store.company, store.role]);

  const changeDraftCondition = () => {
    fetchEditEmail(store.session, store.company.id, email.id, {
      // ...email,
      body: Base64.encodeURI(
        buildHtmlBody(
          Base64.decode(email.body),
          marketingSettings?.marketing_logo || store.company.avatar_url,
          marketingSettings?.email_footer
        )
      ),
      is_draft: false,
    }).then((res) => {
      if (!res.err) {
        notify("info", "Email succesfully sent");
        setRefresh(Math.random());
        setActiveModal(undefined);
      } else {
        notify("danger", "Unable to send email");
      }
    });
  };

  return (
    <InnerPage pageTitle={`Email Profile`} originName={email?.name}>
      {redirect && redirect !== props.location.pathname && (
        <Redirect to={redirect} />
      )}
      <ATSWrapper activeTab={tab} routeObject={ROUTES.EmailProfile}>
        <ProfilePageContainer>
          <>
            {email && (
              <>
                <EmailHeader
                  stats={stats}
                  email={email}
                  removeEmail={removeEmail}
                  changeDraftCondition={changeDraftCondition}
                  setActiveModal={setActiveModal}
                  archiveEmail={archiveEmail}
                  store={store}
                />
                {tab !== "detail" ? (
                  <ATSContainer>
                    <BodyContainer>
                      <BodyLeft>
                        {tab === "overview" && (
                          <Suspense fallback={<div />}>
                            <EmailOverviewTab email={email} />
                          </Suspense>
                        )}
                        {tab === "recipients" && (
                          <Suspense fallback={<div />}>
                            <EmailRecipients
                              email={email}
                              store={store}
                              candidates={candidates}
                              contacts={contacts}
                              companies={companies}
                              emailInteractions={emailInteractions}
                            />
                          </Suspense>
                        )}
                      </BodyLeft>
                      <BodyRight>
                        {email && (
                          <EmailPreview
                            email={email}
                            marketingSettings={marketingSettings}
                            store={store}
                          />
                        )}
                      </BodyRight>
                      <ActionBackground>
                        <div></div>
                        <div className="grey-background"></div>
                      </ActionBackground>
                    </BodyContainer>
                  </ATSContainer>
                ) : (
                  <FullViewWrapper>
                    <EmailFullView
                      email={email}
                      decode={true}
                      emailBody={
                        email.is_draft
                          ? buildHtmlBody(
                              variableReplacer(Base64.decode(email.body)),
                              marketingSettings?.marketing_logo ||
                                store.company.avatar_url,
                              marketingSettings?.email_footer
                            )
                          : variableReplacer(Base64.decode(email.body))
                      }
                    />
                  </FullViewWrapper>
                )}
              </>
            )}
          </>
        </ProfilePageContainer>
      </ATSWrapper>
      {activeModal === "edit-email" && (
        <MarketingEmailModal
          hide={() => {
            setActiveModal(undefined);
          }}
          refreshEmail={() => setRefresh(Math.random())}
          receivers={companies || contacts || candidates}
          source={receiverType}
          editingEmail={email}
        />
      )}
      {activeModal === "confirm-send" && (
        <Suspense fallback={<div />}>
          <ConfirmModalV2
            show={true}
            hide={() => {
              setActiveModal(undefined);
            }}
            header="Send Email"
            text="Are you ready to send this email?"
            actionText="Send"
            actionFunction={() => changeDraftCondition()}
          />
        </Suspense>
      )}
    </InnerPage>
  );
};

const FullViewWrapper = styled.div`
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  background: #f6f6f6;
  min-height: calc(100vh - 201px);
`;

export default EmailProfile;
