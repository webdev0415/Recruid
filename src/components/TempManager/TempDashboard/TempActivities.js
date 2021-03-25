import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "routes";
import styled from "styled-components";
import notify from "notifications";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import { fetchTempActivities } from "helpersV2/tempPlus";
import { AWS_CDN_URL } from "constants/api";

const TempActivity = ({ store }) => {
  const [activities, setActivities] = useState(undefined);
  const [
    hasMore,
    // setHasMore
  ] = useState(true);

  useEffect(() => {
    if (store.session && store.company) {
      fetchTempActivities(store.session, store.company.id).then((res) => {
        if (!res.err) {
          setActivities(res);
        } else {
          notify("danger", "Unable to fetch activities");
        }
      });
    }
  }, [store.session, store.company]);

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
                      <strong>accepted a shift</strong> in job{" "}
                      <strong>
                        <STLink
                          to={ROUTES.TempJobDashboard.url(
                            store.company.mention_tag,
                            act.job.slug
                          )}
                        >
                          {act.job.title}
                        </STLink>
                      </strong>
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
                      <strong>rejected a shift</strong> in job{" "}
                      <strong>
                        <STLink
                          to={ROUTES.TempJobDashboard.url(
                            store.company.mention_tag,
                            act.job.slug
                          )}
                        >
                          {act.job.title}
                        </STLink>
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
  width: 400px;
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

const STLink = styled(Link)`
  text-decoration: none;
  color: black;
  &:hover {
    text-decoration: none;
    color: black;
  }
`;

export default TempActivity;
