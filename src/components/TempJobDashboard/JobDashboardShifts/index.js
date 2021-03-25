import React, { useState, useEffect, Suspense } from "react";
import styled from "styled-components";
import spacetime from "spacetime";
import ATSBanner from "sharedComponents/ATSBanner";
import { InnerPageContainer, ATSContainer } from "styles/PageContainers";
import notify from "notifications";
// import Spinner from "sharedComponents/Spinner"

import {
  fetchRangeShifts,
  fetchPublishedAnalytics,
} from "helpersV2/tempPlus/shifts";
import AppButton from "styles/AppButton";
import PublishShiftsModal from "modals/PublishShiftsModal";
import WeekSelector from "components/TempJobDashboard/JobDashboardShifts/WeekSelector";
import ShiftsBoard from "components/TempJobDashboard/JobDashboardShifts/ShiftsBoard";
import {
  AnalyticsBox,
  MainNumber,
  Title,
} from "components/TempManager/TempAnalytics/components";
import Spinner from "sharedComponents/Spinner";
import retryLazy from "hooks/retryLazy";

const ShareJobSocialModal = React.lazy(() =>
  retryLazy(() => import("modals/ShareJobSocialModal"))
);

const JobDashboardShifts = ({ jobData, store, jobId, setJobData }) => {
  const [timeRange, setTimeRange] = useState({
    start: spacetime().startOf("week"),
    end: spacetime().endOf("week"),
  });
  const [shiftsRange, setShiftsRange] = useState(undefined);
  const [activeModal, setActiveModal] = useState(undefined);
  const [longestDay, setLongestDay] = useState(0);
  const [deleteShifts, setDeleteShifts] = useState([]);
  const [activeMiniModal, setActiveMiniModal] = useState(undefined);
  const [refresh, refreshShifts] = useState(Math.random());
  const [needsPublish, setNeedsPublish] = useState(false);
  const [publishedAnalytics, setPublishedAnalytics] = useState(undefined);

  useEffect(() => {
    if (store.session && jobId) {
      fetchRangeShifts(store.session, jobId, {
        start: new Date(timeRange.start.epoch),
        end: new Date(timeRange.end.epoch),
        job_id: jobId,
      }).then((res) => {
        if (!res.err) {
          formatShifts(res);
        } else {
          notify("danger", "Unable to get shifts for this period");
          setShiftsRange(false);
        }
      });
    }
  }, [jobId, store.session, timeRange, refresh]);

  useEffect(() => {
    if (store.session && jobId) {
      fetchPublishedAnalytics(store.session, jobId, {
        start: new Date(timeRange.start.epoch),
        end: new Date(timeRange.end.epoch),
        job_id: jobId,
      }).then((res) => {
        if (!res.err) {
          setPublishedAnalytics(res);
        } else {
          notify("danger", "Unable to published shifts analytics");
          setPublishedAnalytics(false);
        }
      });
    }
  }, [jobId, store.session, timeRange, refresh]);

  useEffect(() => {
    if (shiftsRange) {
      setLongestDay(findLongest(shiftsRange));
    }
  }, [shiftsRange]);

  const formatShifts = (shifts) => {
    let days = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      0: [],
    };
    let shiftsToDelete = [];
    shifts.map((shift) => {
      const weekDay = spacetime(shift.start_time).day();
      if (!shift.soft_delete) {
        days[weekDay].push({
          ...shift,
          start_time: spacetime(new Date(shift.start_time)),
          end_time: spacetime(new Date(shift.end_time)),
        });
      } else {
        shiftsToDelete.push(shift);
      }
      return null;
    });
    setDeleteShifts(shiftsToDelete);
    setShiftsRange(days);
  };

  const findLongest = (range) => {
    let long = 0;
    Object.values(range).map((val) =>
      val.length > long ? (long = val.length) : undefined
    );
    return long;
  };

  useEffect(() => {
    if (shiftsRange) {
      let allActiveShifts = [];
      Object.values(shiftsRange).map((arr) => {
        allActiveShifts = [...allActiveShifts, ...arr];
        return null;
      });
      let needs = false;
      let i = -1;
      while (needs === false && i < allActiveShifts.length) {
        i++;
        if (!allActiveShifts[i]?.published) {
          needs = true;
        }
      }
      setNeedsPublish(needs);
    }
  }, [shiftsRange]);

  return (
    <>
      <InnerPageContainer background="white">
        <ATSBanner
          name={store.company?.name}
          avatar={store.company?.avatar_url}
          page={jobData?.title}
          clientButton={
            jobData?.company?.id !== store.company?.id
              ? jobData?.company.name
              : undefined
          }
          v2theme={true}
          job={jobData}
          setJob={setJobData}
          setActiveModal={setActiveModal}
        >
          {needsPublish ? (
            <AppButton
              them="dark-blue"
              onClick={() => setActiveModal("publish-shifts")}
            >
              Publish Shifts
            </AppButton>
          ) : (
            <AppButton
              them="dark-blue"
              onClick={() => setActiveMiniModal("create-shift")}
            >
              Create Shift
            </AppButton>
          )}
        </ATSBanner>
        <ATSContainer>
          <FlexContainer>
            {publishedAnalytics && (
              <AnalyticsContainer>
                <STAnalyticsBox
                  style={{ borderColor: "#c4c4c4", padding: "10px" }}
                >
                  <CandidatesTotal>
                    <span>Published shifts this week</span>
                    <p>{publishedAnalytics.total}</p>
                  </CandidatesTotal>
                </STAnalyticsBox>
                <STAnalyticsBox color="green" span={1}>
                  <div>
                    <Title color="green"> Accepted Shifts</Title>
                    <MainNumber color="green">
                      {publishedAnalytics.accepted}
                      <span>/{publishedAnalytics.total}</span>
                    </MainNumber>
                  </div>
                </STAnalyticsBox>
                <STAnalyticsBox color="yellow" span={1}>
                  <div>
                    <Title color="yellow">To be approved</Title>
                    <MainNumber color="yellow">
                      {publishedAnalytics.pending}
                      <span>/{publishedAnalytics.total}</span>
                    </MainNumber>
                  </div>
                </STAnalyticsBox>
                <STAnalyticsBox color="red" span={1}>
                  <div>
                    <Title color="red">Rejected shifts</Title>
                    <MainNumber color="red">
                      {publishedAnalytics.rejected}
                      <span>/{publishedAnalytics.total}</span>
                    </MainNumber>
                  </div>
                </STAnalyticsBox>
                <STAnalyticsBox color="red" span={1}>
                  <div>
                    <Title color="red">Cancelled shifts</Title>
                    <MainNumber color="red">
                      {publishedAnalytics.cancelled}
                      <span>/{publishedAnalytics.total}</span>
                    </MainNumber>
                  </div>
                </STAnalyticsBox>
              </AnalyticsContainer>
            )}

            <MainContainer>
              {shiftsRange && (
                <>
                  <MenuContainer className={activeMiniModal ? "blurred" : ""}>
                    <WeekSelector
                      timeRange={timeRange}
                      setTimeRange={setTimeRange}
                    />
                  </MenuContainer>
                  <ShiftsBoard
                    timeRange={timeRange}
                    shiftsRange={shiftsRange}
                    setShiftsRange={setShiftsRange}
                    store={store}
                    jobId={jobId}
                    longestDay={longestDay}
                    setDeleteShifts={setDeleteShifts}
                    activeMiniModal={activeMiniModal}
                    setActiveMiniModal={setActiveMiniModal}
                    jobData={jobData}
                  />
                </>
              )}
              {!shiftsRange && <Spinner />}
            </MainContainer>
          </FlexContainer>
        </ATSContainer>
      </InnerPageContainer>
      {activeModal === "publish-shifts" && (
        <PublishShiftsModal
          hide={() => setActiveModal(undefined)}
          jobId={jobId}
          store={store}
          deleteShifts={deleteShifts}
          shiftsRange={shiftsRange}
          timeRange={timeRange}
          refreshShifts={() => refreshShifts(Math.random())}
        />
      )}
      {activeModal === "share-job-social" && (
        <Suspense fallback={<div />}>
          <ShareJobSocialModal
            job={jobData}
            company={store.company}
            hide={() => {
              setActiveModal(undefined);
            }}
          />
        </Suspense>
      )}
    </>
  );
};

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 15px;
  justify-content: center;
  border-top: 1px solid #c4c4c4;
  border-right: 1px solid #c4c4c4;
  border-left: 1px solid #c4c4c4;
  border-radius: 4px 4px 0px 0px;
  &.blurred {
    filter: blur(2px);
  }
`;

const MainContainer = styled.div`
  position: relative;
  width: 100%;
  min-width: 900px;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const AnalyticsContainer = styled.div`
  width: 200px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
`;

const STAnalyticsBox = styled(AnalyticsBox)`
  margin-bottom: 10px;
`;

const CandidatesTotal = styled.div`
  text-align: center;
  width: 100%;

  p {
    font-weight: 500;
    font-size: 36px;
    line-height: 44px;
    color: #2a3744;
    margin-bottom: 0px;
  }
  span {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    color: #74767b;
    margin-bottom: 10px;
  }
`;

export default JobDashboardShifts;
