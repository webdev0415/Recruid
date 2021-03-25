import React from "react";
import styled from "styled-components";
import { ActivityContainer, ActivityCell } from "./JobDashboardComponents";

import activityStyles from "assets/stylesheets/scss/collated/profileTabs.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import SizzlingFlame from "assets/svg/icons/sizzling";
import { activityMap } from "../helpers/jobDashboardHelpers";
import { AWS_CDN_URL } from "constants/api";

const LatestActivity = ({ timeline, totalTimeline, loadMoreActivities }) => {
  return (
    <ActivityContainer className={sharedStyles.tableContainer}>
      <div style={{ borderBottom: "1px solid #eee", padding: "10px 25px" }}>
        <h5
          style={{
            color: "#9A9CA1",
            fontSize: "10px",
            fontWeight: "500",
            letterSpacing: "1.67px",
            textTransform: "uppercase",
          }}
        >
          Activity
        </h5>
      </div>
      {timeline &&
        timeline.length > 0 &&
        timeline.map((int, index) => {
          return (
            <ActivityItem key={`interaction_${index}`} interaction={int} />
          );
        })}
      {timeline.length !== totalTimeline && (
        <div className="text-center" style={{ margin: "20px" }}>
          <button
            className="button button--default button--primary"
            onClick={loadMoreActivities}
          >
            Load more activities
          </button>
        </div>
      )}
    </ActivityContainer>
  );
};

export default LatestActivity;

function ActivityItem({ interaction }) {
  const date = new Date(interaction.created_at);
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateString = date.toLocaleDateString("en-GB");
  return (
    <ActivityCell className={activityStyles.activityContainer}>
      <div className={`${activityStyles.activityDetails} leo-flex-center`}>
        <div style={{ width: "30px", height: "30px", marginRight: "10px" }}>
          <img src={`${AWS_CDN_URL}/icons/LatestActivityIcon.svg`} alt="" />
        </div>
        <div>
          <span>{interaction.sender.name}</span>
          {` - `}
          {formatInteractionDescription(interaction)}
          <span>{interaction.recipient.name}</span>
        </div>
      </div>
      <div className={activityStyles.activityDate}>
        {time} {dateString}
      </div>
    </ActivityCell>
  );
}

function formatInteractionDescription(interaction) {
  if (interaction.status && interaction.status !== "cancelled") {
    return activityMap[interaction.candidate_status];
  } else if (interaction.candidate_status) {
    switch (interaction.candidate_status) {
      case "pending":
        return "Pending";
      case "applied":
        return "Applied";
      case "interview_requested":
        return "Requested Interview";
      case "interview_scheduled":
        return "Scheduled Interview";
      case "interview_conducted":
        return "Conducted Interview";
      case "offer_requested":
        return "Requested Offer";
      case "offer_accepted":
        return "Offer Accepted";
      case "cancelled":
        return "Cancelled Appllication";
      default:
        return;
    }
  } else {
    if (interaction.body.type === "sizzle_score_update") {
      return (
        <>
          {`updated the job sizzle factor to `}{" "}
          <FlamesContainer>
            <SizzlingFlame active={true} />
            <SizzlingFlame active={interaction.body.new_score > 1} />
            <SizzlingFlame active={interaction.body.new_score > 2} />
          </FlamesContainer>
        </>
      );
    } else if (interaction.body.type === "on_hold_update") {
      return (
        <>
          changed the job to{" "}
          <strong>
            {interaction.body.new_score ? "on hold" : "no longer on hold"}
          </strong>
          .
        </>
      );
    }
  }
}

const FlamesContainer = styled.div`
  display: inline;

  svg {
    display: inline !important;
    margin-right: 2px !important;
  }
`;
