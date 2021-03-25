import React, { useState, useContext, Suspense } from "react";
import HistoryContext from "contexts/historyContext/HistoryContext";
import { ROUTES } from "routes";
import styled from "styled-components";

import {
  SectionTitleContainer,
  TabTitle,
  Subtitle,
  SectionContainer,
} from "components/Profiles/components/ProfileComponents";
import notify from "notifications";
import retryLazy from "hooks/retryLazy";
import { fetchRemoveCandidate } from "helpersV2/candidates";
import { AWS_CDN_URL } from "constants/api";
const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);

const CandidateAdvancedTab = ({
  tnProfile,
  setRedirect,
  store,
  tnProfileId,
}) => {
  const [modal, setModal] = useState(undefined);
  const historyStore = useContext(HistoryContext);

  const deleteCandidate = () => {
    fetchRemoveCandidate(store.session, store.company.id, tnProfileId).then(
      (res) => {
        if (!res.err) {
          notify("info", "Candidate succesfully deleted");
          if (historyStore.state[1]?.path) {
            setRedirect(historyStore.state[1].url);
          } else {
            setRedirect(ROUTES.TalentNetwork.url(store.company.mention_tag));
          }
          setModal(undefined);
        } else {
          notify("danger", "Unable to delete deal");
        }
      }
    );
  };

  return (
    <>
      {(store.role?.role_permissions.owner ||
        (store.role?.role_permissions.admin &&
          store.role?.role_permissions.recruiter)) && (
        <SectionContainer>
          {tnProfile.removal_requested && (
            <ErrorDisplay text="This candidate has requested their data to be removed from the platform" />
          )}
          <SectionTitleContainer style={{ marginBottom: 5 }}>
            <TabTitle>Delete Candidate</TabTitle>
          </SectionTitleContainer>
          <Subtitle style={{ marginBottom: 15 }}>
            Deleting a candidate will remove them from the platform
          </Subtitle>
          <button
            className="button button--default button--orange"
            onClick={() => setModal("delete-candidate-modal")}
          >
            Delete Candidate
          </button>
        </SectionContainer>
      )}
      {modal === "delete-candidate-modal" && tnProfile && (
        <Suspense fallback={<div />}>
          <ConfirmModalV2
            show={true}
            hide={() => setModal(undefined)}
            size={480}
            header="Delete Candidate"
            text={
              <>
                Are you sure you want to delete the candidate{" "}
                <strong>{tnProfile.name}</strong>?.
              </>
            }
            actionText="Delete"
            actionFunction={deleteCandidate}
          />
        </Suspense>
      )}
    </>
  );
};

const ErrorDisplay = ({ text }) => (
  <ErrorWrap>
    <img src={`${AWS_CDN_URL}/icons/ErrorCheckMark.svg`} alt="Error" />
    <span>{text}</span>
  </ErrorWrap>
);

const ErrorWrap = styled.div`
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  color: #f27881;

  span {
    margin-left: 10px;
  }
`;

export default CandidateAdvancedTab;
