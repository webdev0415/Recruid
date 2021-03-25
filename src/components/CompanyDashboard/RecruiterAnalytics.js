import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ROUTES } from "routes";
import { dashboardStats } from "components/CompanyDashboard/helpers/dashboardHelpers";
import notify from "notifications";

const RecruiterAnalytics = ({ store, match }) => {
  const [analytics, setAnalytics] = useState(undefined);
  const [stats, setStats] = useState(undefined);

  useEffect(() => {
    if (analytics) {
      setStats([
        {
          statNum: analytics.open_positions,
          statTitle: "Open Positions",
          url: ROUTES.ViewJobs.url(store.company.mention_tag),
        },
        {
          statNum: analytics.active_candidates,
          statTitle: "Active Candidates",
          url: ROUTES.TalentNetwork.url(store.company.mention_tag),
        },
        {
          statNum: analytics.average_time_to_fill || 0,
          statTitle: "Avg Time to Fill (Days)",
          url: ROUTES.Analytics.url(store.company.mention_tag),
        },
        {
          statNum: analytics.average_time_to_hire || 0,
          statTitle: "Avg Time to Hire (Days)",
          url: ROUTES.Analytics.url(store.company.mention_tag),
        },
      ]);
    }
  }, [analytics, store.company]);

  useEffect(() => {
    if (
      store.role &&
      (store.role.role_permissions.admin ||
        store.role.role_permissions.owner ||
        store.role.role_permissions.recruiter ||
        store.role.role_permissions.hiring_manager) &&
      store.company &&
      store.session &&
      store.company.mention_tag === match.params.companyMentionTag
    ) {
      dashboardStats(
        store.company.id,
        store.session,
        store.role.team_member.team_member_id
      ).then((st) => {
        if (st !== "err") {
          setAnalytics(st);
        } else {
          notify("danger", "Unable to fetch recruitment analytics");
        }
      });
    }
  }, [store.company, store.session, store.role]);

  return (
    <>
      {analytics && stats && (
        <Stats>
          {stats.map((box, i) => (
            <StatContainer key={i}>
              <span>{box.statNum}</span> {box.statTitle}
            </StatContainer>
          ))}
        </Stats>
      )}
    </>
  );
};

const Stats = styled.div`
  align-items: center;
  background: #fff;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  display: grid;
  // grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  margin-bottom: 20px;
  padding: 10px 0;

  @media screen and (min-width: 902px) {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: none;
    padding: 30px 15px;
  }
`;

const StatContainer = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-center",
}))`
  color: #74767b;
  font-size: 14px;
  font-weight: 500;

  &:not(:last-of-type) {
    border-bottom: 1px solid rgba(225, 225, 225, 0.5);
  }

  @media screen and (min-width: 902px) {
    &:not(:last-of-type) {
      border-bottom: 0;
      border-right: 1px solid rgba(225, 225, 225, 0.5);
    }
  }

  span {
    color: #1f1f1f;
    font-size: 28px;
    margin: 10px 0;
    margin-right: 20px;

    @media screen and (min-width: 902px) {
      margin: 0;
      margin-right: 20px;
    }
  }
`;

export default RecruiterAnalytics;
