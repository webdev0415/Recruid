import React, { useState, useEffect } from "react";
import styled from "styled-components";
import notify from "notifications";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import SizzlingFlame from "assets/svg/icons/sizzling";
import { fetchTempJobActivities } from "helpersV2/tempPlus/job";
import { AWS_CDN_URL } from "constants/api";

const TempActivity = ({ store, jobId }) => {
  const [activities, setActivities] = useState(undefined);
  const [
    hasMore,
    // setHasMore
  ] = useState(false);

  useEffect(() => {
    if (store.session && store.company && jobId) {
      fetchTempJobActivities(store.session, store.company.id, jobId).then(
        (res) => {
          if (!res.err) {
            setActivities(res);
          } else {
            notify("danger", "Unable to fetch activities");
          }
        }
      );
    }
  }, [store.session, store.company, jobId]);
  const loadMoreActivities = () => {};
  if (activities && activities.length > 0) {
    return (
      <Container>
        <Title>Activity</Title>
        <InfiniteScroller
          fetchMore={loadMoreActivities}
          hasMore={hasMore}
          dataLength={activities?.length || 0}
          scrollableTarget={"activities-container"}
        >
          <ActivivtyContainer id="activities-container">
            {activities.map((act, index) => {
              if (
                act.activity_details.type === "shift_status_update" &&
                act.activity_details.new_status === "accepted"
              ) {
                return (
                  <ActivityRow key={`activity-item-${index}`}>
                    <span>
                      <img
                        src={`${AWS_CDN_URL}/icons/BriefcaseIcon.svg`}
                        alt="BriefcaseIcon"
                      />
                    </span>
                    <p>
                      {act.activity_details.applicant_name}{" "}
                      <strong>accepted a shift</strong>
                    </p>
                  </ActivityRow>
                );
              }
              if (
                act.activity_details.type === "shift_status_update" &&
                act.activity_details.new_status === "rejected"
              ) {
                return (
                  <ActivityRow key={`activity-item-${index}`}>
                    <span>
                      <img
                        src={`${AWS_CDN_URL}/icons/AlertIcon.svg`}
                        alt="AlertIcon"
                      />
                    </span>
                    <p>
                      {act.activity_details.applicant_name}{" "}
                      <strong>rejected a shift</strong>
                    </p>
                  </ActivityRow>
                );
              }
              if (act.activity_details.type === "sizzle_score_update") {
                return (
                  <ActivityRow key={`activity-item-${index}`}>
                    <span>
                      <img
                        src={`${AWS_CDN_URL}/icons/AlertIcon.svg`}
                        alt="AlertIcon"
                      />
                    </span>
                    <p>
                      {act.activity_details.professional_name}{" "}
                      <strong>
                        changed the job sizzle factor to{" "}
                        <FlamesContainer>
                          <SizzlingFlame active={true} />
                          <SizzlingFlame
                            active={act.activity_details.new_score > 1}
                          />
                          <SizzlingFlame
                            active={act.activity_details.new_score > 2}
                          />
                        </FlamesContainer>
                      </strong>
                    </p>
                  </ActivityRow>
                );
              }
              if (act.activity_details.type === "on_hold_update") {
                return (
                  <ActivityRow key={`activity-item-${index}`}>
                    <span>
                      <img
                        src={`${AWS_CDN_URL}/icons/AlertIcon.svg`}
                        alt="AlertIcon"
                      />
                    </span>
                    <p>
                      {act.activity_details.professional_name}{" "}
                      <strong>
                        {" "}
                        {act.activity_details.new_score
                          ? "set the job on hold"
                          : "change the job to no longer on hold"}
                      </strong>
                    </p>
                  </ActivityRow>
                );
              }
              return <></>;
            })}
          </ActivivtyContainer>
        </InfiniteScroller>
      </Container>
    );
  } else {
    return <></>;
  }
};

const Title = styled.h3`
  font-size: 18px;
  line-height: 22px;
  color: #1e1e1e;
  margin-bottom: 20px;
`;

const Container = styled.div`
  background: #ffffff;
  border: 1px solid rgba(196, 196, 196, 0.26);
  border-radius: 4px;
  padding: 20px;
  width: 450px;
`;

const ActivivtyContainer = styled.div`
  max-height: 450px;
  overflow: scroll;
`;

const ActivityRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;

  span {
  }

  p {
    font-size: 14px;
    line-height: 17px;
    color: #74767b;
    margin-left: 10px;

    strong {
      color: black;
    }
  }
`;

const FlamesContainer = styled.div`
  display: inline;
`;

// <ActivityRow>
//   <span>
//     <BriefcaseIcon />
//   </span>
//   <p>
//     John smith has <strong>accepted the job</strong>
//   </p>
// </ActivityRow>
// <ActivityRow>
//   <span>
//     <PageIcon />{" "}
//   </span>
//   <p>
//     There are <strong>3 new applicants</strong> to{" "}
//     <strong>Software Engineer at Netflix.</strong>
//   </p>
// </ActivityRow>
// <ActivityRow>
//   <span>
//     <TimesheetIcon />{" "}
//   </span>
//   <p>
//     There are <strong>3 new submitted timesheets.</strong>
//   </p>
// </ActivityRow>
// <ActivityRow>
//   <span>
//     <ClockIcon />{" "}
//   </span>
//   <p>
//     There is an <strong>scheduled interview</strong> for tomorrow
//     with Mario Gomez.
//   </p>
// </ActivityRow>
// <ActivityRow>
//   <span>
//     <AlertIcon />{" "}
//   </span>
//   <p>
//     Daniel Jhonson, <strong>has rejected the job offer.</strong>
//   </p>
// </ActivityRow>
// <ActivityRow>
//   <span>
//     <AlertIcon />{" "}
//   </span>
//   <p>
//     Next week shifts <strong>haven’t been published yet.</strong>
//   </p>
// </ActivityRow>

export default TempActivity;
