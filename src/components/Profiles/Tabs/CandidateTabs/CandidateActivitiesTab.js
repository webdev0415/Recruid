import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ActivitiesTab, {
  ActivityItems,
} from "components/Profiles/Tabs/ActivitiesTab";
import { fetchActivity } from "helpersV2/CandidateProfile";
import notify from "notifications";
import { statusNames } from "constants/stageOptions";

import {
  TabTitle,
  SectionTitleContainer,
  SectionContainer,
} from "components/Profiles/components/ProfileComponents";

const CandidatesActivitiesTab = ({
  interactions,
  setInteractions,
  store,
  hasMoreInteractions,
  tnProfileId,
  queryParams,
  setTotalInteractions,
}) => {
  //fetch interactions on tab view, don't load them if they already exist
  useEffect(() => {
    if (tnProfileId && interactions === undefined) {
      fetchActivity(
        store.company.id,
        tnProfileId,
        store.session,
        1,
        queryParams.job_id
      ).then((activities) => {
        if (activities !== "err" && activities.interactions) {
          setInteractions(activities.interactions);
          setTotalInteractions(activities.total);
        } else {
          notify("danger", "Unable to fetch interactions");
          setInteractions(false);
        }
      });
    }
  }, [tnProfileId]);

  const fetchMoreInteractions = () => {
    const nextPage = Math.ceil(interactions.length / 30 + 1);
    fetchActivity(store.company.id, tnProfileId, store.session, nextPage).then(
      (activities) => {
        let nextInteractions = [...interactions];
        nextInteractions = nextInteractions.concat(activities.interactions);
        setInteractions(nextInteractions);
      }
    );
  };

  return (
    <ActivitiesTab
      interactions={interactions}
      fetchMoreInteractions={fetchMoreInteractions}
      hasMoreInteractions={hasMoreInteractions}
    >
      <>
        <SectionContainer>
          <SectionTitleContainer>
            <TabTitle>Activity</TabTitle>
          </SectionTitleContainer>
          {interactions &&
            interactions.map((interaction, index) => {
              return (
                <ActivityItems
                  key={`interaction_${index}`}
                  interaction={interaction}
                >
                  {interaction?.body?.type === "marketing_email" && (
                    <span>
                      {interaction.body?.event}ed email -{" "}
                      <Link
                        to={`/${store?.company.mention_tag}/marketing/${interaction.body.email_id}/overview`}
                      >
                        {interaction.body?.email_subject}
                      </Link>
                    </span>
                  )}

                  {(interaction.body?.type === "careers_application" ||
                    statusNames[interaction.candidate_status]) &&
                    ` ${
                      interaction.body?.type === "careers_application"
                        ? "applied to job via careers site -"
                        : statusNames[interaction.candidate_status]
                        ? `set the candidate to the status ${
                            statusNames[interaction.candidate_status]
                          } for the job -`
                        : ""
                    } `}
                  {interaction.subject !== "accept_tn" &&
                    interaction.subject !== "invite_tn" &&
                    !!interaction.subject && (
                      <span>{interaction.job_title}</span>
                    )}
                  {(interaction.body?.type === "careers_application" ||
                    statusNames[interaction.candidate_status]) && (
                    <span>{interaction.job_title}</span>
                  )}

                  {interaction.subject === "applied" &&
                    interaction.status === "accept" &&
                    interaction.body && (
                      <span>
                        {interaction.body?.require_sponsorship
                          ? "and requires Sponsorship"
                          : "and does not require Sponsorship"}
                      </span>
                    )}

                  {interaction.subject === "rejected" && (
                    <>
                      <span>
                        - {rejectionMap[interaction.body?.rejection_reason]}
                      </span>
                      {interaction.body?.feedback !== "" && (
                        <div>{interaction.body?.feedback}</div>
                      )}
                    </>
                  )}
                  {interaction.status === "declined" && (
                    <>
                      <span>
                        - {withdrawalMap[interaction.body?.withdrawal_reason]}
                      </span>
                      {interaction.body?.feedback !== "" && (
                        <div>{interaction.body?.feedback}</div>
                      )}
                    </>
                  )}
                  {interaction.body === "blacklist set to true" && (
                    <span>blacklisted the candidate</span>
                  )}
                  {interaction.body === "blacklist set to false" && (
                    <span>
                      removed the blacklisted status from the candidate
                    </span>
                  )}
                  {interaction?.body?.type === "rating_update" && (
                    <span>
                      changed candidate rating to{" "}
                      <strong>{interaction.body.rating} stars</strong>
                    </span>
                  )}
                </ActivityItems>
              );
            })}
        </SectionContainer>
      </>
    </ActivitiesTab>
  );
};

const rejectionMap = {
  1: "Did not fit company culture",
  2: "Did not meet desired qualifications",
  3: "Did not meet minimum qualifications",
  4: "Did not meet screening requirements",
  5: "Incomplete Application",
  6: "Ineligible to work in location",
  7: "Misrepresented qualifications",
  8: "More qualified candidate selected",
  9: "No show for interview",
  10: "Other",
  11: "Unresponsive",
};

const withdrawalMap = {
  1: "Took another job",
  2: "Compensation",
  3: "Personal reasons",
  4: "Commute",
  5: "Cultural fit",
  6: "Lack of recruiter follow-up",
  7: "Confusing job description",
  8: "Will stay in current company",
  9: "Not interested in the first place.",
};

export default CandidatesActivitiesTab;
