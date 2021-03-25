import React, { useState, useEffect } from "react";

import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";
import Spinner from "sharedComponents/Spinner";
import styled from "styled-components";
import notify from "notifications";
import { fetchPublishShiftsRange } from "helpersV2/tempPlus/shifts";
import AppButton from "styles/AppButton";

const PublishShiftsModal = ({
  hide,
  store,
  deleteShifts,
  shiftsRange,
  timeRange,
  refreshShifts,
}) => {
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);
  const [totals, setTotals] = useState({
    shifts: 0,
    hours: 0,
    labour: 0,
    ids: [],
  });

  const publishRange = () => {
    setLoading(true);
    fetchPublishShiftsRange(store.session, totals.ids)
      .then((res) => {
        if (!res.err) {
          notify("info", "Shifts succesfully publish");
          setPublished(true);
          refreshShifts();
          hide();
        } else {
          notify("danger", "Unable to publish shifts for this period");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let allActiveShifts = [];
    let ids = [];
    let hours = 0;
    let totalPay = 0;
    Object.values(shiftsRange).map((arr) => {
      allActiveShifts = [...allActiveShifts, ...arr];
      arr.map((shift) => {
        if (!shift.published) {
          ids.push(shift.id);
        }
        let hoursShift = shift.end_time.epoch - shift.start_time.epoch;
        if (shift.break && shift.break > 0) {
          hoursShift = hoursShift - shift.break * 60000;
        }
        hours = hours + hoursShift;
        if (shift.pay_interval === "daily") {
          totalPay += shift.pay_rate / 100;
        } else {
          totalPay +=
            (shift.pay_rate / 100) * (hoursShift / 3600000).toFixed(2);
        }
        return null;
      });
      return null;
    });
    deleteShifts.map((shift) => ids.push(shift.id));
    const totalShifts = allActiveShifts.length;
    setTotals({
      shifts: totalShifts,
      hours: (hours / 3600000).toFixed(2),
      labour: totalPay,
      ids,
    });
  }, [shiftsRange, deleteShifts]);

  return (
    <UniversalModal
      show={true}
      hide={hide}
      id="publish-shift-modal"
      width={330}
    >
      <ModalHeaderClassic title="Publish Schedule" closeModal={hide} />
      <STModalBody className="no-footer">
        {published && (
          <>
            <PublishedTitle>Schedule Published!</PublishedTitle>
            <NoteText>Here is the summary again</NoteText>
          </>
        )}
        <ShiftsInfoContainer>
          <div className="shifts-title">
            {months[timeRange.start.month()]} {timeRange.start.date()} -{" "}
            {months[timeRange.end.month()]} {timeRange.end.date()},{" "}
            {timeRange.end.year()}
          </div>
          <div className="grid">
            <span>Total Shifts:</span>
            <span>{totals.shifts}</span>
            <span>Total Hours:</span>
            <span>{totals.hours}</span>
            <span>Total Labour Cost:</span>
            <span>
              {store.company?.currency?.currency_name}
              {totals.labour}
            </span>
          </div>
        </ShiftsInfoContainer>
        {!published && (
          <>
            <AppButton them="dark-blue" onClick={() => publishRange()}>
              Publish Shifts
            </AppButton>
          </>
        )}
      </STModalBody>
      {loading && (
        <LoadContainer>
          <Spinner />
        </LoadContainer>
      )}
    </UniversalModal>
  );
};

export default PublishShiftsModal;

const STModalBody = styled(ModalBody)`
  padding: 30px !important;
  text-align: center;
`;

const LoadContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background: #eeeeee61;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoteText = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #74767b;
  margin-bottom: 10px;
`;

const PublishedTitle = styled.h2`
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  color: #35c3ae;
  margin-bottom: 20px;
`;

const ShiftsInfoContainer = styled.div`
  background: #efefef;
  border: 1px solid #efefef;
  border-radius: 4px;
  padding: 30px 15px 30px 25px;
  margin: 15px 30px 30px 25px;

  .shifts-title {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #2a3744;
  }
  .grid {
    display: grid;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    max-width: 210px;
    margin: auto;
    margin-top: 20px;

    span {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      color: #74767b;
      text-align: left;
      white-space: nowrap;
    }

    span:nth-child(even) {
      text-align: right;
    }
  }
`;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
