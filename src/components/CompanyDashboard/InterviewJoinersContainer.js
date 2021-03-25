import React, { useState, Suspense, useEffect } from "react";
import notify from "notifications";
import styled from "styled-components";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { upcomingInterviews } from "helpers/interviewCalendarHelpers";
import { newJoiners } from "components/CompanyDashboard/helpers/dashboardHelpers";
import retryLazy from "hooks/retryLazy";
const Starters = React.lazy(() =>
  retryLazy(() => import("components/CompanyDashboard/DashboardStarters"))
);
const Interviews = React.lazy(() =>
  retryLazy(() => import("components/CompanyDashboard/DashboardInterviews"))
);

const InterviewJoinersContainer = ({ store, match }) => {
  const [joiners, setJoiners] = useState(undefined);
  const [interviews, setInterviews] = useState(undefined);
  const [tabModeTwo, setTabModeTwo] = useState("interviews");
  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    if (
      store.role &&
      store.company &&
      store.session &&
      store.company.mention_tag === match.params.companyMentionTag
    ) {
      if (
        store.role.role_permissions.admin ||
        store.role.role_permissions.owner ||
        store.role.role_permissions.recruiter ||
        store.role.role_permissions.hiring_manager
      ) {
        upcomingInterviews(
          store.company.id,
          store.session,
          store.role.team_member.team_member_id,
          signal
        ).then((events) => {
          if (events) {
            setInterviews(events.upcoming_interviews);
          } else if (events === "err" && !signal.aborted) {
            notify("danger", "Unable to fetch upcoming interviews");
          }
        });
        newJoiners(
          store.company.id,
          store.session,
          store.role.team_member.team_member_id,
          signal
        ).then((jn) => {
          if (jn !== "err" && !signal.aborted) {
            setJoiners(jn);
          }
        });
      }
    }
    return () => controller.abort();
  }, [store.company, store.session, store.role]);

  useEffect(() => {
    if (
      interviews?.length === 0 &&
      joiners?.length > 0 &&
      tabModeTwo === "interviews"
    ) {
      setTabModeTwo("starters");
    }
  }, [interviews, joiners]);

  return (
    <>
      {(interviews?.length > 0 || joiners?.length > 0) && (
        <div className={sharedStyles.row} id="main-row">
          <div className="col-md-12">
            <FeedContainer
              style={{
                marginBottom: 20,
                marginTop: 20,
              }}
            >
              <FeedMenu>
                <ul className="leo-flex">
                  {interviews?.length > 0 && (
                    <li>
                      <button
                        className={tabModeTwo === "interviews" ? "active" : ""}
                        data-toggle="tab"
                        onClick={() => setTabModeTwo("interviews")}
                      >
                        Upcoming Interviews
                      </button>
                    </li>
                  )}
                  {joiners?.length > 0 && (
                    <li>
                      <button
                        className={tabModeTwo === "starters" ? "active" : ""}
                        data-toggle="tab"
                        onClick={() => setTabModeTwo("starters")}
                      >
                        Upcoming Starters
                      </button>
                    </li>
                  )}
                </ul>
              </FeedMenu>
              <div
                style={{
                  marginTop: "20px",
                }}
              >
                {tabModeTwo === "interviews" && interviews && (
                  <Suspense fallback={<div />}>
                    <Interviews
                      company={store.company}
                      data={interviews}
                      mentionTag={store.company?.mention_tag}
                    />
                  </Suspense>
                )}
                {tabModeTwo === "starters" && joiners && (
                  <Suspense fallback={<div />}>
                    <Starters
                      data={joiners}
                      mentionTag={store.company?.mention_tag}
                    />
                  </Suspense>
                )}
              </div>
            </FeedContainer>
          </div>
        </div>
      )}
    </>
  );
};

const FeedContainer = styled.div`
  &.activities-container {
    width: 100vw;
    & > div:first-of-type {
      padding: 0 calc((100vw - 1140px) / 2);
    }
  }
`;

const FeedMenu = styled.div`
  ul {
    border-bottom: 1px solid #d8d8d8;
  }

  li {
    margin-right: 30px;

    &:last-child {
      margin-right: 0;
    }

    button {
      border-bottom: 2px solid transparent;
      color: #74767b !important;
      font-size: 15px;
      font-weight: 500;
      margin-bottom: -1px;

      &.active {
        border-bottom: 2px solid #1e1e1e;
        color: #1e1e1e !important;
        padding-bottom: 10px;
      }

      &:hover {
        color: #1e1e1e !important;
      }

      &.post {
        margin-left: 10px;
      }
    }
  }
`;

export default InterviewJoinersContainer;
