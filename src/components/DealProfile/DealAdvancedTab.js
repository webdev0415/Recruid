import React, { useEffect, useState, useContext, Suspense } from "react";
import HistoryContext from "contexts/historyContext/HistoryContext";
import styled from "styled-components";
import { ROUTES } from "routes";

import {
  SectionTitleContainer,
  TabTitle,
  Subtitle,
  SectionContainer,
} from "components/Profiles/components/ProfileComponents";
import notify from "notifications";
import { fetchDeleteDeal, fetchMoveDealToPipeline } from "helpers/crm/deals";
import retryLazy from "hooks/retryLazy";
const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);
const MoveDealPipelineModal = React.lazy(() =>
  retryLazy(() => import("modals/MoveDealPipelineModal"))
);

const DealAdvancedTab = ({
  deal,
  setRedirect,
  store,
  allPipelines,
  setDeal,
  saveDeal,
}) => {
  const [modal, setModal] = useState(undefined);
  const historyStore = useContext(HistoryContext);
  const [selectedPipeline, setSelectedPipeline] = useState(undefined);
  const [selectedStage, setSelectedStage] = useState(undefined);
  const [newRequistion, setNewRequisition] = useState(undefined);
  const [vacancies, setVacancies] = useState(undefined);

  useEffect(() => {
    if (deal) {
      setNewRequisition(deal.create_job);
      setVacancies(deal.vacancies);
    }
  }, [deal]);

  useEffect(() => {
    if (deal && allPipelines) {
      allPipelines.map((pipe, index) =>
        pipe.id === deal.pipeline?.id ? setSelectedPipeline(index) : null
      );
    }
  }, [deal, allPipelines]);

  const deleteDeal = () => {
    fetchDeleteDeal(store.session, store.company.id, deal.id).then((res) => {
      if (!res.err) {
        notify("info", "Deal succesfully deleted");
        if (historyStore.state[1]?.path === ROUTES.ClientManager.path) {
          setRedirect(historyStore.state[1].url + historyStore.state[1].search);
        } else {
          setRedirect(
            ROUTES.ClientManager.url(store.company.mention_tag, "deals")
          );
        }
        setModal(undefined);
      } else {
        notify("danger", "Unable to delete deal");
      }
    });
  };

  const checkPipeline = () => {
    if (selectedPipeline === undefined) {
      return notify("danger", "You must select a pipeline first");
    }
    if (!allPipelines[selectedPipeline]) {
      return notify("danger", "We cannot find this pipeline");
    }
    if (deal.pipeline?.id === allPipelines[selectedPipeline]?.id) {
      return notify("danger", "Deal already is in this pipeline");
    }
    setModal("move-deal-modal");
  };

  const moveDealToPipeline = () => {
    fetchMoveDealToPipeline(store.session, store.company, {
      deal_id: deal.id,
      pipeline_stage_id:
        allPipelines[selectedPipeline].stages[selectedStage].id,
    }).then((res) => {
      if (!res.err) {
        setDeal({ ...deal, pipeline: allPipelines[selectedPipeline] });
        setModal(undefined);
        notify("info", "Deal succesfully moved");
      } else {
        notify("danger", "Unable to move deal");
      }
    });
  };

  return (
    <>
      <SectionContainer>
        <SectionTitleContainer style={{ marginBottom: 5 }}>
          <TabTitle>Move Deal</TabTitle>
        </SectionTitleContainer>
        <Subtitle style={{ marginBottom: 15 }}>
          You can move a deal to another pipeline.
        </Subtitle>
        <SelectWrapper className="leo-flex-center">
          <select
            name="pipeline"
            className="form-control form-control-select"
            value={selectedPipeline === undefined ? "" : selectedPipeline}
            onChange={(e) => setSelectedPipeline(e.target.value)}
          >
            <option value="" disabled hidden>
              Please select a pipeline
            </option>
            {deal.pipeline?.archived && (
              <option value="" disabled hidden>
                {deal.pipeline?.name}
              </option>
            )}
            {allPipelines &&
              allPipelines.map((pipeline, index) => (
                <React.Fragment key={`pipeline-${index}`}>
                  {!pipeline.archived && (
                    <option value={index}>{pipeline.name}</option>
                  )}
                </React.Fragment>
              ))}
          </select>
          <button
            className="button button--default button--blue-dark"
            onClick={() => checkPipeline()}
          >
            Move Deal
          </button>
        </SelectWrapper>
      </SectionContainer>
      {!deal.job && (
        <SectionContainer>
          <SectionTitleContainer style={{ marginBottom: 5 }}>
            <TabTitle>Deal requisition</TabTitle>
          </SectionTitleContainer>
          <Subtitle style={{ marginBottom: 15 }}>
            Is this deal a job requisition?
          </Subtitle>
          <SelectWrapper>
            <select
              name="requisition"
              className="form-control form-control-select"
              value={newRequistion || false}
              onChange={(e) =>
                setNewRequisition(e.target.value === "true" ? true : false)
              }
            >
              <option value="" disabled hidden>
                Please select an option
              </option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </SelectWrapper>
          {newRequistion && (
            <>
              <Subtitle style={{ marginBottom: 15 }}>Vacancies</Subtitle>
              <input
                style={{ maxWidth: "250px" }}
                className="form-control"
                value={vacancies || 0}
                type="number"
                onChange={(e) => setVacancies(e.target.value)}
              />
            </>
          )}
          {newRequistion !== deal.create_job ||
          (deal.create_job && deal.vacancies !== vacancies) ? (
            <button
              className="button button--default button--blue-dark"
              onClick={() =>
                saveDeal({
                  create_job: newRequistion,
                  vacancies: vacancies,
                })
              }
            >
              Confirm
            </button>
          ) : null}
        </SectionContainer>
      )}
      {(store.role?.role_permissions.owner ||
        (store.role?.role_permissions.admin &&
          store.role?.role_permissions.business)) && (
        <SectionContainer>
          <SectionTitleContainer style={{ marginBottom: 5 }}>
            <TabTitle>Delete Deal</TabTitle>
          </SectionTitleContainer>
          <Subtitle style={{ marginBottom: 15 }}>
            Deleting a deal will remove it from the platform
          </Subtitle>
          <button
            className="button button--default button--orange"
            onClick={() => setModal("delete-deal-modal")}
          >
            Delete Deal
          </button>
        </SectionContainer>
      )}
      {modal === "delete-deal-modal" && deal && (
        <Suspense fallback={<div />}>
          <ConfirmModalV2
            show={true}
            hide={() => setModal(undefined)}
            size={480}
            header="Delete Deal"
            text={
              <>
                Are you sure you want to delete deal{" "}
                <strong>{deal.name}</strong>?.
              </>
            }
            actionText="Delete"
            actionFunction={deleteDeal}
          />
        </Suspense>
      )}
      {modal === "move-deal-modal" && deal && allPipelines[selectedPipeline] && (
        <Suspense fallback={<div />}>
          <MoveDealPipelineModal
            hide={() => setModal(undefined)}
            moveDealToPipeline={moveDealToPipeline}
            deal={deal}
            selectedPipeline={allPipelines[selectedPipeline]}
            selectedStage={selectedStage}
            setSelectedStage={setSelectedStage}
          />
        </Suspense>
      )}
    </>
  );
};

export default DealAdvancedTab;

const SelectWrapper = styled.div`
  margin-bottom: 20px;
  text-align: left;

  p {
    font-size: 13px;
  }

  button {
    margin-left: 10px;
  }

  select {
    margin-bottom: 0px !important;
    max-width: 250px;
  }
`;
