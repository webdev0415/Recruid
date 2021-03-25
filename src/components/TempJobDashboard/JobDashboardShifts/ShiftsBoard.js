import React, { useState, useEffect } from "react";
import styled from "styled-components";
import notify from "notifications";

import ShiftCell from "components/TempJobDashboard/JobDashboardShifts/ShiftCell";
import AddShiftCell from "components/TempJobDashboard/JobDashboardShifts/AddShiftCell";
import ShiftEditModal from "components/TempJobDashboard/JobDashboardShifts/ShiftEditModal";
import ShiftDeleteModal from "components/TempJobDashboard/JobDashboardShifts/ShiftDeleteModal";
import ShiftCancelModal from "components/TempJobDashboard/JobDashboardShifts/ShiftCancelModal";
import {
  fetchDeleteShift,
  fetchCreateShift,
  fetchEditShift,
} from "helpersV2/tempPlus/shifts";
import spacetime from "spacetime";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { scrollbarOptions } from "constants/style";

const ShiftsBoard = ({
  timeRange,
  shiftsRange,
  setShiftsRange,
  store,
  jobId,
  longestDay,
  setDeleteShifts,
  activeMiniModal,
  setActiveMiniModal,
  jobData,
}) => {
  const [activeDate, setActiveDate] = useState(undefined);
  const [activeShift, setActiveShift] = useState(undefined);
  const todayDate = spacetime().startOf("day");

  const deleteShift = () => {
    fetchDeleteShift(store.session, activeShift.id).then((res) => {
      if (!res.err) {
        notify("info", "Shift succesfully deleted");
        let weekDay = activeShift.start_time.day();
        let shiftsRangeCopy = { ...shiftsRange };
        let shiftIndex;
        shiftsRangeCopy[weekDay].map((shf, ix) => {
          if (shf.id === activeShift.id) {
            shiftIndex = ix;
          }
          return null;
        });
        if (shiftIndex !== undefined) {
          shiftsRangeCopy[weekDay].splice(shiftIndex, 1);
          setShiftsRange(shiftsRangeCopy);
        }
        setDeleteShifts((deleteShifts) => [
          ...deleteShifts,
          { ...activeShift, soft_delete: true },
        ]);
        setActiveShift(undefined);
        setActiveDate(undefined);
        setActiveMiniModal(undefined);
      } else {
        notify("danger", "Unable to delete this shift");
      }
    });
  };

  const createShift = (body) => {
    fetchCreateShift(store.session, body).then((res) => {
      if (!res.err) {
        notify("info", "shift succesfully created");
        let spaceStart = spacetime(res.start_time);
        let spaceEnd = spacetime(res.end_time);
        //if date is not within this week range return
        if (
          spaceStart.epoch >= timeRange.start.epoch &&
          spaceEnd.epoch <= timeRange.end.epoch
        ) {
          let weekDay = spacetime(res.start_time).day();
          let shiftsRangeCopy = { ...shiftsRange };
          shiftsRangeCopy[weekDay].push({
            ...res,
            start_time: spacetime(new Date(res.start_time)),
            end_time: spacetime(new Date(res.end_time)),
          });
          setShiftsRange(shiftsRangeCopy);
        }
        setActiveDate(undefined);
        setActiveShift(undefined);
        setActiveMiniModal(undefined);
      } else {
        notify("danger", "Unable to create shift");
      }
    });
  };

  const updateShift = (body) => {
    fetchEditShift(store.session, activeShift.id, body).then((res) => {
      if (!res.err) {
        //replace shift position
        notify("info", "shift succesfully updated");
        let spaceStart = spacetime(res.start_time);
        let spaceEnd = spacetime(res.end_time);
        //if date is not within this week range return
        if (
          spaceStart.epoch >= timeRange.start.epoch &&
          spaceEnd.epoch <= timeRange.end.epoch
        ) {
          let weekDay = spaceStart.day();
          let prevWeekDay = activeShift.start_time.day();
          let shiftsRangeCopy = { ...shiftsRange };
          if (weekDay === prevWeekDay) {
            let shiftIndex;
            shiftsRangeCopy[weekDay].map((shf, ix) => {
              if (shf.id === activeShift.id) {
                shiftIndex = ix;
              }
              return null;
            });
            if (shiftIndex !== undefined) {
              shiftsRangeCopy[weekDay].splice(shiftIndex, 1);
              shiftsRangeCopy[weekDay].push({
                ...res,
                start_time: spacetime(new Date(res.start_time)),
                end_time: spacetime(new Date(res.end_time)),
              });
              setShiftsRange(shiftsRangeCopy);
            }
          } else {
            let prevIndex;
            shiftsRangeCopy[prevWeekDay].map((shf, ix) => {
              if (shf.id === activeShift.id) {
                prevIndex = ix;
              }
              return null;
            });
            if (prevIndex !== undefined) {
              shiftsRangeCopy[prevWeekDay].splice(prevIndex, 1);
              shiftsRangeCopy[weekDay].push({
                ...res,
                start_time: spacetime(new Date(res.start_time)),
                end_time: spacetime(new Date(res.end_time)),
              });
              setShiftsRange(shiftsRangeCopy);
            }
          }
        }
        setActiveDate(undefined);
        setActiveShift(undefined);
        setActiveMiniModal(undefined);
      } else {
        notify("danger", "Unable to update shift");
      }
    });
  };

  const cancelShift = () => {
    let body = {
      ...activeShift,
      start_time: new Date(activeShift.start_time.epoch),
      end_time: new Date(activeShift.end_time.epoch),
      // rate: integer (shift rate in cents so $1 = 100),
      job_post_id: jobId,
      applicant_id: activeShift.applicant_id,
      team_member_id: store.role.team_member.team_member_id,
      status: "cancelled",
      // notes: string
      // break: breakValue === "" ? 0 : breakValue,
    };
    updateShift(body);
  };

  return (
    <>
      <Container className={activeMiniModal ? "blurred" : ""}>
        <WeekDays timeRange={timeRange} />
        <ShiftsBox>
          <OverlayScrollbarsComponent
            style={{ maxHeight: "500px" }}
            options={scrollbarOptions}
          >
            <ShifstContainer>
              {shiftsRange &&
                [1, 2, 3, 4, 5, 6, 0].map((day, index) => (
                  <ColumnComponent
                    key={`day-column-${index}`}
                    day={shiftsRange[day]}
                    setActiveMiniModal={setActiveMiniModal}
                    store={store}
                    jobId={jobId}
                    index={index}
                    setActiveDate={setActiveDate}
                    longestDay={longestDay}
                    currentDay={timeRange.start.add(index, "day")}
                    setActiveShift={setActiveShift}
                    todayDate={todayDate}
                  />
                ))}
            </ShifstContainer>
          </OverlayScrollbarsComponent>
        </ShiftsBox>
      </Container>
      {(((activeMiniModal === "edit-shift" ||
        activeMiniModal === "assign-candidate") &&
        activeShift) ||
        activeMiniModal === "create-shift") &&
        activeDate && (
          <ShiftEditModal
            type={activeMiniModal}
            closeModal={() => {
              setActiveMiniModal(undefined);
              setActiveDate(undefined);
            }}
            activeDate={activeDate}
            setActiveDate={setActiveDate}
            activeShift={activeShift}
            setActiveShift={setActiveShift}
            updateShift={updateShift}
            createShift={createShift}
            store={store}
            jobId={jobId}
            jobData={jobData}
          />
        )}
      {activeMiniModal === "delete-shift" && (
        <ShiftDeleteModal
          closeModal={() => setActiveMiniModal(undefined)}
          deleteShift={deleteShift}
        />
      )}
      {activeMiniModal === "cancel-shift" && (
        <ShiftCancelModal
          closeModal={() => setActiveMiniModal(undefined)}
          cancelShift={cancelShift}
        />
      )}
    </>
  );
};

const WeekDays = ({ timeRange }) => {
  const [days, setDays] = useState(undefined);

  useEffect(() => {
    if (timeRange) {
      let arr = [];
      for (let i = 0; i < 7; i++) {
        arr.push(timeRange.start.add(i, "day").date());
      }
      setDays(arr);
    }
  }, [timeRange]);
  return (
    <WeekDaysWrapper>
      {days &&
        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
          <DayContainer key={`weekday-${index}`}>
            <span className="day-num">{days[index]}</span>
            <span>{day}</span>
          </DayContainer>
        ))}
    </WeekDaysWrapper>
  );
};

const ColumnComponent = ({
  day,
  setActiveMiniModal,
  store,
  jobId,
  index,
  setActiveDate,
  longestDay,
  currentDay,
  setActiveShift,
  todayDate,
}) => {
  const [emptyCells, setEmptyCells] = useState(
    Array.apply(null, Array(4)).map(() => null)
  );
  const [allowEditPrev, setAllowEditPrev] = useState(true);

  useEffect(() => {
    if (currentDay.epoch < todayDate.epoch) {
      setAllowEditPrev(false);
    } else {
      setAllowEditPrev(true);
    }
  }, [currentDay, todayDate]);

  useEffect(() => {
    if (longestDay < 4) {
      let val = 4 - day.length;
      setEmptyCells(
        Array.apply(null, Array(val > 0 ? val : 0)).map(() => null)
      );
    } else {
      let val = longestDay - day.length;
      setEmptyCells(
        Array.apply(null, Array(val > 0 ? val : 0)).map(() => null)
      );
    }
  }, [longestDay, day.length]);

  return (
    <Column key={`day-column-${index}`}>
      {day.map((shift, ix) => (
        <ShiftCell
          key={`shift-cell-${ix}`}
          setActiveMiniModal={setActiveMiniModal}
          store={store}
          jobId={jobId}
          className={`${ix === 0 ? "no-top-border" : ""} ${
            index === 6 ? "no-right-border" : ""
          }`}
          shift={shift}
          setActiveShift={setActiveShift}
          setActiveDate={setActiveDate}
          allowEditPrev={allowEditPrev}
        />
      ))}
      <AddShiftCell
        setActiveMiniModal={setActiveMiniModal}
        day={day}
        setActiveDate={setActiveDate}
        className={`${day.length === 0 ? "no-top-border" : ""} ${
          index === 6 ? "no-right-border" : ""
        }`}
        currentDay={currentDay}
      />
      {emptyCells.map((cell, idx) => (
        <EmptyCell
          key={`empty-cell-${idx}`}
          className={`${index === 6 ? "no-right-border" : ""}`}
        />
      ))}
    </Column>
  );
};

const Container = styled.div`
  width: 100%;
  // margin-left: 10px;

  &.blurred {
    filter: blur(2px);
  }
`;

const ShifstContainer = styled.div`
  position: relative;
  display: flex;
  align-items: start;
  justify-content: space-evenly;
  // height: 500px;
  // min-height: 500px;
  // max-height: 500px;
  // overflow: scroll;
  // border: solid #c4c4c4 1px;
  // border-radius: 0px 0px 4px 4px;
`;

const ShiftsBox = styled.div`
  border: solid #c4c4c4 1px;
  border-radius: 0px 0px 4px 4px;
`;

const Column = styled.div`
  width: 100%;
  height: 100%;
`;

const WeekDaysWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: solid #c4c4c4 1px;
`;

const DayContainer = styled.div`
  display: flex;
  padding: 7px 5px 3px 10px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-right: solid #c4c4c4 1px;

  &:first-child {
    border-left: solid #c4c4c4 1px;
  }

  span {
    font-weight: 500;
    font-size: 10px;
    line-height: 12px;
    color: rgba(116, 118, 123, 0.75);
  }

  span.day-num {
    color: #2a3744;
  }
`;

const EmptyCell = styled.div`
  height: 100px;
  max-height: 100px;
  border-top: solid #c4c4c4 1px;
  border-right: solid #c4c4c4 1px;

  &.no-right-border {
    border-right: none;
  }
`;

export default ShiftsBoard;
