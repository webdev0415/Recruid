import React, { useState } from "react";
// import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import notify from "notifications";
import HandHold from "assets/svg/icons/handHold";
import { fetchEditJob } from "helpersV2/jobs";

const JobHold = ({ onHold, job_id, store, changeHoldState, style, job }) => {
  const [hovering, setHovering] = useState(false);
  const toggleHoldCall = () => {
    let body = {
      job_post: {
        on_hold: !job.on_hold,
      },
      // job_owner: job.selected_vendor || store.company.id,
      // agency_ids: job.selected_vendor ? store.company.id : undefined,
    };
    fetchEditJob(store.session, job.company.id, job_id, body).then((res) => {
      if (!res.err) {
        notify("info", "Job succesfully updated");
        changeHoldState(!job.on_hold);
      } else {
        notify("danger", "Unable to update job at the moment");
      }
    });
  };

  return (
    <button
      style={style}
      data-tip={!onHold ? "Set job on hold" : "Job on hold"}
      onClick={() => toggleHoldCall()}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <HandHold onHold={onHold || hovering} />
      <ReactTooltip
        effect="solid"
        backgroundColor="#2A3744"
        data-delay-show="500"
      />
    </button>
  );
};

export default JobHold;
