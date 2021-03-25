import React, { useEffect } from "react";
import notify from "notifications";
import { Link } from "react-router-dom";
import EmptyTab from "components/Profiles/components/EmptyTab";
// import ActivitiesTab from "components/Profiles/Tabs/ActivitiesTab";

import { fetchCompanyActivity } from "helpers/crm/clientCompanies";
import { fetchContactActivity } from "helpers/crm/contacts";
import { fetchDealActivity } from "helpers/crm/deals";
import { RegularActivity } from "components/Profiles/components/activities";
import { EmptyActivity } from "assets/svg/EmptyImages";
// const FETCH_ARRAY_LENGTH = 20;

// sources client, candidate, deal

const ProfileActivitiesTab = ({
  interactions,
  setInteractions,
  store,
  source,
  sourceId,
}) => {
  // fetch interactions on tab view, don't load them if they already exist
  useEffect(() => {
    if (sourceId && source) {
      if (source === "client") {
        fetchCompanyActivity(store.session, sourceId, store.company.id).then(
          (res) => {
            if (!res.err) {
              setInteractions(res);
            } else {
              setInteractions(false);
              notify("danger", "Unable to fetch activity");
            }
          }
        );
      } else if (source === "deal") {
        fetchDealActivity(store.session, sourceId, store.company.id).then(
          (res) => {
            if (!res.err) {
              setInteractions(res);
            } else {
              setInteractions(false);
              notify("danger", "Unable to fetch activity");
            }
          }
        );
      } else if (source === "contact") {
        fetchContactActivity(store.session, sourceId, store.company.id).then(
          (res) => {
            if (!res.err) {
              setInteractions(res);
            } else {
              setInteractions(false);
              notify("danger", "Unable to fetch activity");
            }
          }
        );
      }
    }
  }, [source, sourceId]);

  // const fetchMoreInteractions = () => {
  //   fetchCompanyActivity(
  //     store.session,
  //     store.company.id,
  //     selectedCompanyId,
  //     // jobsStage,
  //     [(interactions.length, FETCH_ARRAY_LENGTH)]
  //   ).then(res => {
  //     if (!res.err) {
  //       setInteractions([...interactions, ...res]);
  //     } else {
  //       notify("danger", "Unable to fetch activity");
  //     }
  //   });
  // };

  return (
    <EmptyTab
      data={interactions}
      title={`This ${source} has no activities.`}
      copy={"Go message them or something!"}
      image={<EmptyActivity />}
      action={""}
    >
      {interactions &&
        interactions.map((interaction, index) => {
          return (
            <React.Fragment key={index}>
              <RegularActivity
                interaction={interaction}
                store={store}
                source={source}
                sourceId={sourceId}
              >
                <p>
                  {(interaction.action_performed === "marketing_email_open" ||
                    interaction.action_performed === "marketing_email_click") &&
                    !!interaction.extra_info && (
                      <>
                        {interaction?.extra_info && (
                          <>
                            <strong>{interaction.source_name}</strong>{" "}
                            {interaction?.extra_info.event}ed email -{" "}
                            <Link
                              to={`/${store?.company.mention_tag}/marketing/${interaction.extra_info.email_id}/overview`}
                            >
                              {interaction.extra_info?.email_subject}
                            </Link>
                          </>
                        )}
                      </>
                    )}
                  <strong>
                    {interaction.action_performed !== "completed_task"
                      ? interaction.created_by
                      : interaction.extra_info.assigned_to.name}
                  </strong>
                  {GENERAL_INTERACTIONS[interaction.action_performed]
                    ? GENERAL_INTERACTIONS[interaction.action_performed](
                        interaction
                      )
                    : source === "client" &&
                      COMPANY_INTERACTIONS[interaction.action_performed]
                    ? COMPANY_INTERACTIONS[interaction.action_performed](
                        interaction
                      )
                    : source === "deal" &&
                      DEAL_INTERACTIONS[interaction.action_performed]
                    ? DEAL_INTERACTIONS[interaction.action_performed](
                        interaction
                      )
                    : source === "contact" &&
                      CONTACT_INTERACTIONS[interaction.action_performed]
                    ? CONTACT_INTERACTIONS[interaction.action_performed](
                        interaction
                      )
                    : null}
                </p>
              </RegularActivity>
            </React.Fragment>
          );
        })}
    </EmptyTab>
  );
};

const GENERAL_INTERACTIONS = {
  added_to_contact: (interaction) => (
    <>
      {" "}
      added a contact - <strong>{interaction.extra_info.contact_name}</strong>
    </>
  ),
  added_to_deal: (interaction) => (
    <>
      {" "}
      added a deal - <strong>{interaction.extra_info.deal_name}</strong>
    </>
  ),
  added_note: () => <> added a note</>,
  created_call: () => <> added a call</>,
  updated_call: () => <> updated a call</>,
  created_meeting: () => <> created a meeting</>,
  completed_task: () => <> completed a task</>,
  created_task: (interaction) => (
    <>
      {" "}
      created a task for{" "}
      <strong>{interaction.extra_info.assigned_to.name}</strong>
    </>
  ),
};

const COMPANY_INTERACTIONS = {
  created: () => <> created the company</>,
  updated: () => <> updated the company</>,
  created_job_by_agency: (interaction) => (
    <>
      {" "}
      added a job - <strong>{interaction.extra_info.job_title}</strong>
    </>
  ),
};

const CONTACT_INTERACTIONS = {
  created: () => <> created the contact</>,
  updated: () => <> updated the contact</>,
  added_to_client: (interaction) => (
    <>
      {" "}
      added a client - <strong>{interaction.extra_info.client_name}</strong>
    </>
  ),
};

const DEAL_INTERACTIONS = {
  created: () => <> created the deal</>,
  updated: () => <> updated the deal</>,
  added_to_client: (interaction) => (
    <>
      {" "}
      added a company - <strong>{interaction.extra_info.client_name}</strong>
    </>
  ),
};

export default ProfileActivitiesTab;
