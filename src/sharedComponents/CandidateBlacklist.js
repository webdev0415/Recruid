import React from "react";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import { fetchToggleBlackList } from "helpersV2/candidates";
import notify from "notifications";
import { AWS_CDN_URL } from "constants/api";

const CandidateBlacklist = ({
  blacklisted,
  candidate_id,
  store,
  changeBlacklistedState,
  show,
  style,
}) => {
  const toggleBlackListCall = () => {
    fetchToggleBlackList(store.session, store.company.id, candidate_id).then(
      (res) => {
        if (!res.err) {
          notify("info", "Blacklist status succesfully changed");
          if (changeBlacklistedState) {
            changeBlacklistedState(!blacklisted);
          }
        } else {
          notify("danger", "Unable to change blacklist status at this moment");
        }
      }
    );
  };

  return (
    <ButtonContainer
      className={`${!show && !blacklisted ? "hidden" : ""} ${
        blacklisted ? "full-view" : ""
      } ${show && !blacklisted ? "hover-main" : ""}`}
      style={style}
      data-tip={blacklisted ? "Blacklisted Candidate" : "Blacklist Candidate"}
      onClick={() => toggleBlackListCall()}
    >
      <img src={`${AWS_CDN_URL}/icons/Blacklist.svg`} alt="Blacklisted" />
      <ReactTooltip
        effect="solid"
        backgroundColor="#2A3744"
        data-delay-show="500"
      />
    </ButtonContainer>
  );
};

export default CandidateBlacklist;

const ButtonContainer = styled.button`
  opacity: 0.2;
  display: inline;

  &.hidden {
    opacity: 0;
  }

  &.hover-main:hover {
    opacity: 1;
  }

  &.full-view {
    opacity: 1;
  }
`;

export const CancelSvg = () => (
  <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke="#53585F" strokeWidth="2" />
    <path fill="#53585F" d="M2 3.414L3.414 2l10.607 10.606-1.415 1.415z" />
  </svg>
);
