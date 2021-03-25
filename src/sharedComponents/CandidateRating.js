import React, { useState } from "react";
import notify from "notifications";
import helpers from "helpersV2/CandidateProfile";
const CandidateRating = ({ rating, candidate_id, store, changeNewRating }) => {
  const [newRating, setNewRating] = useState(false);
  const [hovering, setHovering] = useState(false);

  const changeCandidateRating = () => {
    helpers
      .editTalentNetworkProfile(candidate_id, store.company.id, store.session, {
        rating: newRating,
        company_id: store.company.id,
      })
      .then((response) => {
        if (response && response.professional) {
          notify("info", "Candidate rating changed");
          if (changeNewRating) {
            changeNewRating(newRating);
          }
        } else {
          notify("danger", "Unable to change rating at this moment");
        }
      });
  };

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="leo-flex-center"
    >
      {[1, 2, 3, 4, 5].map((rate, index) => (
        <div
          onClick={() => changeCandidateRating()}
          onMouseEnter={() => setNewRating(rate)}
          key={`candidate-rating-${index}`}
          className="leo-flex-center-center"
        >
          <Star
            active={
              (!hovering && rating >= rate) || (hovering && newRating >= rate)
            }
          />
        </div>
      ))}
    </div>
  );
};

export default CandidateRating;

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
