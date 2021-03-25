import React, { useState } from "react";
import styled from "styled-components";
import notify from "notifications";
// import helpers from "helpersV2/CandidateProfile";
import SizzlingFlame from "assets/svg/icons/sizzling";
import { fetchEditJob } from "helpersV2/jobs";
const SizzlingComponent = ({
  hotness,
  job_id,
  job,
  store,
  changeNewSizzlingFactor,
}) => {
  const [newSizzling, setNewSizzling] = useState(false);
  const [hovering, setHovering] = useState(false);

  const changeJobSizzling = () => {
    let body = {
      job_post: {
        sizzle_score: newSizzling,
      },
      // job_owner: job.selected_vendor || store.company.id,
      // agency_ids: job.selected_vendor ? store.company.id : undefined,
    };
    fetchEditJob(store.session, job.company.id, job_id, body).then((res) => {
      if (!res.err) {
        notify("info", "Job succesfully updated");
        changeNewSizzlingFactor(newSizzling);
      } else {
        notify("danger", "Unable to update job at the moment");
      }
    });
  };
  return (
    <div
      className="leo-flex-center"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {[1, 2, 3].map((hot, index) => (
        <SingleContainer
          onClick={() => changeJobSizzling()}
          onMouseEnter={() => setNewSizzling(hot)}
          key={`job-hotness-${index}`}
          className="leo-flex-center-center"
        >
          <SizzlingFlame
            active={
              (!hovering && hotness >= hot) || (hovering && newSizzling >= hot)
            }
          />
        </SingleContainer>
      ))}
    </div>
  );
};

export default SizzlingComponent;

const SingleContainer = styled.div`
  margin: 0px 2px;
`;
export const Star = ({ active }) => (
  <svg
    width="17"
    height="16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="filled-star"
  >
    <path
      d="M8.5 0l2.248 5.406 5.836.467-4.446 3.809 1.358 5.695L8.5 12.325l-4.996 3.052 1.358-5.695L.416 5.873l5.836-.467L8.5 0z"
      fill={active ? "#B88910" : "#C4C4C4"}
    />
  </svg>
);
