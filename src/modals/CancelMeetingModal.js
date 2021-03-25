import React, { useContext } from "react";
import { CalendarContext } from "contexts/calendarContext/calendarProvider";
import ConfirmModalV2 from "modals/ConfirmModalV2";
import notify from "notifications";

import { fetchCancelInterview } from "helpersV2/interviews";

const CancelMeetingModal = ({ event, hide, session, afterFinish }) => {
  const { state, dispatch } = useContext(CalendarContext);
  const submitCancelInterview = () => {
    fetchCancelInterview(session, event.id).then((res) => {
      if (!res.err) {
        dispatch({ type: "SET_FORCE_UPDATE", payload: !state.forceUpdate });
        if (afterFinish) {
          afterFinish();
        }
        notify("info", "Interview event cancelled");
        hide();
      } else {
        alert("Unable to set the interview event");
      }
    });
  };

  return (
    <ConfirmModalV2
      show={true}
      hide={hide}
      header="Cancel Meeting"
      text={`Are you sure you want to cancel ${
        `${event.name}` || "this meeting"
      }.`}
      actionText="Delete"
      actionFunction={submitCancelInterview}
    />
  );
};

export default CancelMeetingModal;
