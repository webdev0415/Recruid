import React, { useState, useEffect } from "react";

import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
  ModalFooter,
} from "modals/UniversalModal/UniversalModal";
import styled from "styled-components";
import AppButton from "styles/AppButton";
import AvatarIcon from "sharedComponents/AvatarIcon";
import Checkbox from "sharedComponents/Checkbox";
import { AWS_CDN_URL } from "constants/api";

const ConfirmInviteBlacklistedModal = ({
  hide,
  actionFunction,
  blacklistedCandidates,
  deselectBlackListed,
  localDeselect,
}) => {
  const [cands, setCands] = useState(undefined);

  useEffect(() => {
    if (!cands && blacklistedCandidates && blacklistedCandidates.length > 0) {
      setCands(blacklistedCandidates);
    }
  }, [cands, blacklistedCandidates]);

  const deselectCand = (index) => {
    let candsCopy = [...cands];
    candsCopy[index] = {
      ...candsCopy[index],
      selected: candsCopy[index].selected ? false : true,
    };
    setCands(candsCopy);
  };
  return (
    <UniversalModal
      show={true}
      hide={hide}
      id="invite-blacklisted-candidates"
      width={330}
    >
      <ModalHeaderClassic title="Add to job" closeModal={hide} />
      <STModalBody>
        <p>
          You are trying to add blacklisted candidate
          {cands?.length > 1 ? "s" : ""} to a job, if you proceed the candidate
          {cands?.length > 1 ? "s" : ""} will no longer be blacklisted
        </p>
        {cands && cands.length > 0 && (
          <CandidateContainer>
            <CandidateUL>
              {cands.map((cand, index) => (
                <li key={`candidate-blacklisted-${index}`}>
                  <Checkbox
                    active={cand.selected}
                    onClick={() => {
                      deselectBlackListed(cand);
                      if (localDeselect) {
                        deselectCand(index);
                      }
                    }}
                    style={{ marginRight: "10px" }}
                  />
                  <AvatarIcon
                    name={cand.name}
                    imgUrl={cand.avatar_url}
                    size={30}
                  />
                  <div className="name-container">
                    <span className="candidate-name">
                      {cand.name}{" "}
                      {cand.blacklisted && (
                        <img
                          src={`${AWS_CDN_URL}/icons/CancelSvg.svg`}
                          alt=""
                        />
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </CandidateUL>
          </CandidateContainer>
        )}
      </STModalBody>
      <ModalFooter hide={hide} cancelText="Cancel">
        <AppButton theme="dark-blue" onClick={() => actionFunction()}>
          Add to Job
        </AppButton>
      </ModalFooter>
    </UniversalModal>
  );
};

export default ConfirmInviteBlacklistedModal;

const STModalBody = styled(ModalBody)`
  // padding: 30px !important;
  text-align: center;
  p {
    padding: 30px;
    margin-bottom: 0px !important;
  }
`;

const CandidateUL = styled.ul`
  li {
    display: flex;
    align-items: center;
    // cursor: pointer;
    position: relative;
    padding: 12px 30px;

    :hover {
      background: rgba(196, 196, 196, 0.25);
    }

    .name-container {
      margin-left: 10px;

      .candidate-title {
        font-size: 12px;
        line-height: 14px;
        color: #74767b;
        display: flex;
        align-items: center;
        margin-top: 3px;

        svg,
        img {
          margin-right: 5px;
        }
      }
      .candidate-name {
        font-size: 14px;
        line-height: 16px;
        display: flex;
        align-items: center;

        svg,
        img {
          margin-left: 10px;
        }
      }
    }
  }
`;

const CandidateContainer = styled.div`
  max-height: 250px;
  overflow: scroll;
`;
