import React, { useEffect, useState, useContext, Suspense } from "react";
import { Redirect } from "react-router-dom";
import notify from "notifications";
import { DndProvider } from "react-dnd";
import { ROUTES } from "routes";
import HTML5Backend from "react-dnd-html5-backend";
import styled from "styled-components";
import retryLazy from "hooks/retryLazy";

import GlobalContext from "contexts/globalContext/GlobalContext";

import { changeDealStage } from "helpers/crm/deals";
import {
  createNewPipeline,
  editExistingPipeline,
  fetchPipelineWithDeals,
} from "helpers/crm/pipelines";
import EmptyTab from "components/Profiles/components/EmptyTab";
import StageColumn from "components/ClientManager/StageManager/StageColumn";
import FilterV2 from "sharedComponents/filterV2";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import { EmptyPipeline } from "assets/svg/EmptyImages";
const CreateDealModal = React.lazy(() =>
  retryLazy(() => import("modals/CreateDealModal"))
);
const PipelinesModal = React.lazy(() =>
  retryLazy(() => import("modals/PipelinesModal"))
);

// const SLICE_LENGHT = 20;
const StageManager = ({
  location,
  allPipelines,
  getAllPipelines,
  parentModal,
  pipeline,
  setPipeline,
  search,
  permission,
}) => {
  const store = useContext(GlobalContext);
  const [activeModal, setActiveModal] = useState(undefined);
  const [triggerUpdate, setTriggerUpdate] = useState(undefined);
  const [pipelineData, setPipelineData] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);
  // const [pipelineDataBackUp, setPipelineDataBackUp] = useState(undefined);
  const controller = new AbortController();
  const signal = controller.signal;
  const [loaded, setLoaded] = useState(false);

  //create job
  // const [requisitionDeal, setRequsitionDeal] = useState(undefined);
  // const [dealCompany, setDealCompany] = useState(undefined);
  // const [createdJob, setCreatedJob] = useState(undefined);

  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (pipeline && permission.view && store.role) {
      setLoaded(false);
      fetchPipelineWithDeals(
        store.session,
        store.company.id,
        pipeline.id,
        {
          ...filters,
          // slice: [0, SLICE_LENGHT],
          operator: "and",
          search: search?.length > 0 ? [search] : undefined,
          team_member_id: store.role.team_member.team_member_id,
        },
        signal
      ).then((res) => {
        if (!res.err) {
          setPipelineData(res);
          setLoaded(true);
        } else if (!signal.aborted) {
          notify("danger", "Unable to fetch pipeline data");
        }
      });
    }
    return () => controller.abort();
  }, [filters, pipeline, triggerUpdate, search, permission, store.role]);

  useEffect(() => {
    if (allPipelines) {
      if (allPipelines.length === 0) {
        setLoaded(true);
      }
      let filteredAllPipelines = allPipelines.filter((pipe) => !pipe.archived);
      setRedirect(undefined);
      let params = new URLSearchParams(location.search);
      let ppId = Number(params.get("pipeline"));
      let pp;
      filteredAllPipelines.map((pipe) =>
        pipe.id === ppId ? (pp = pipe) : null
      );
      if (pp) {
        setPipeline(pp);
      } else if (filteredAllPipelines?.length > 0) {
        setRedirect(
          ROUTES.ClientManager.url(
            store.company.mention_tag,
            "deals",
            `?pipeline=${filteredAllPipelines[0].id}`
          )
        );
        setPipeline(filteredAllPipelines[0]);
      }
    }
  }, [allPipelines, location]);

  useEffect(() => {
    if (parentModal) {
      openModal(parentModal);
    }
  }, [parentModal]);

  const onDropDeal = (
    dealDroppable,
    destinationIndex,
    destinationStageIndex,
    newIndexProp
  ) => {
    let pipelineDataCopy = [...pipelineData];
    if (dealDroppable.sourceStageIndex === destinationStageIndex) {
      updateBoardForChangePosition(
        dealDroppable,
        destinationIndex,
        destinationStageIndex,
        newIndexProp,
        pipelineData,
        setPipelineData
      );
    } else {
      updateBoardForChangeStage(
        dealDroppable,
        destinationIndex,
        destinationStageIndex,
        newIndexProp,
        pipelineData,
        setPipelineData
      );
    }
    changeDealStage(
      store.session,
      store.company.id,
      dealDroppable.sourceStageIndex !== destinationStageIndex
        ? pipelineData[destinationStageIndex].id
        : undefined,
      dealDroppable.deal_id,
      newIndexProp
    ).then((res) => {
      if (!res.err) {
        notify("info", "Deal succesfully moved");
      } else {
        notify("danger", "Unable to move deal at the moment");
        setPipelineData(pipelineDataCopy);
      }
    });
  };

  const savePipeline = (postBody) => {
    createNewPipeline(store.session, store.company.id, postBody).then((res) => {
      if (!res.err) {
        closeModal();
        getAllPipelines().then((response) => {
          if (!response.err) {
            setRedirect(
              ROUTES.ClientManager.url(
                store.company.mention_tag,
                "deals",
                `?pipeline=${res.id}`
              )
            );
          }
        });
        notify("info", "Pipeline was created");
      } else {
        notify("danger", res.errors || res.error || "Unable to save pipeline");
      }
    });
  };
  const editPipeline = (postBody) => {
    editExistingPipeline(
      store.session,
      store.company.id,
      postBody.id,
      postBody
    ).then((res) => {
      if (!res.err) {
        closeModal();
        setTriggerUpdate(Math.random());
        getAllPipelines();
        notify("info", "Pipeline was modified");
      } else {
        notify("danger", "Unable to save pipeline");
      }
    });
  };

  const changeFilters = (newFilters) => {
    if (
      Object.values(filters).length === 0 &&
      Object.values(newFilters).length === 0
    ) {
      return;
    }
    setFilters(newFilters);
  };

  const openModal = (option) => setActiveModal(option);
  const closeModal = () => setActiveModal(undefined);

  return (
    <>
      <ATSContainer>
        <FilterV2
          source="deal"
          returnFilters={(newFilters) => changeFilters(newFilters)}
        />
      </ATSContainer>
      {!loaded && <Spinner />}
      {loaded && allPipelines && allPipelines.length > 0 && (
        <>
          <DndProvider backend={HTML5Backend}>
            <ManagerWrapper
              className={
                (pipelineData?.length < 5 ? "container container-ats" : "") +
                " leo-flex"
              }
            >
              {pipelineData &&
                pipelineData.map((stage, ix) => (
                  <StageColumn
                    stage={stage}
                    index={ix}
                    key={`stage-${ix}`}
                    pipeline={pipeline}
                    pipelineData={pipelineData}
                    setPipelineData={setPipelineData}
                    onDropDeal={onDropDeal}
                    company={store.company}
                    filters={filters}
                    search={search}
                    permission={permission}
                  />
                ))}
            </ManagerWrapper>
          </DndProvider>
        </>
      )}
      {loaded && allPipelines && allPipelines.length === 0 && (
        <div style={{ marginTop: 20 }}>
          <EmptyTab
            data={allPipelines}
            title={"Let’s get this pipeline started"}
            copy={
              "Build a client pipeline to add deals and move your leads through stages."
            }
            image={<EmptyPipeline />}
            action={
              store.role?.role_permissions.owner ||
              (store.role?.role_permissions.admin &&
                store.role?.role_permissions.business)
                ? () => openModal("pipeline_settings")
                : undefined
            }
            actionText={"Create Your First Pipeline"}
          />
        </div>
      )}
      {activeModal === "pipeline_settings" && (
        <Suspense fallback={<div />}>
          <PipelinesModal
            hide={closeModal}
            show={true}
            allPipelines={allPipelines}
            getAllPipelines={getAllPipelines}
            savePipeline={savePipeline}
            editPipeline={editPipeline}
          />
        </Suspense>
      )}
      {activeModal === "create_deal" && (
        <Suspense fallback={<div />}>
          <CreateDealModal
            show={true}
            hide={closeModal}
            parentPipelines={allPipelines}
            setTriggerUpdate={setTriggerUpdate}
          />
        </Suspense>
      )}
      {redirect && redirect !== `${location.pathname}${location.search}` && (
        <Redirect to={redirect} />
      )}
    </>
  );
};
export default StageManager;

const updateBoardForChangePosition = (
  dealDroppable,
  destinationIndex,
  destinationStageIndex,
  newIndexProp,
  pipelineData,
  setPipelineData
) => {
  let pipelineDataCopy = [...pipelineData];
  let stageObject = { ...pipelineDataCopy[dealDroppable.sourceStageIndex] };
  let sourceDeals = [...stageObject.deals];
  let selectedDeal = {
    ...pipelineDataCopy[dealDroppable.sourceStageIndex].deals[
      dealDroppable.sourceIndex
    ],
  };
  let movingUpDown =
    destinationIndex < dealDroppable.sourceIndex ? "up" : "down";
  let firstSlice;
  let middleSlice;
  let finalSlice;

  if (movingUpDown === "up") {
    //cut the slices based on the indexes
    firstSlice = sourceDeals.slice(0, destinationIndex);
    finalSlice = sourceDeals.slice(
      dealDroppable.sourceIndex + 1,
      sourceDeals.length
    );
    middleSlice = sourceDeals.slice(
      destinationIndex,
      dealDroppable.sourceIndex
    );
    //change the index prop in the dealDroppable and the middle slice
    selectedDeal.index = newIndexProp;
    middleSlice = middleSlice.map((deal) => {
      return { ...deal, index: deal.index + 1 };
    });
    //recreate the newly organised array
    stageObject.deals = [
      ...firstSlice,
      selectedDeal,
      ...middleSlice,
      ...finalSlice,
    ];
    pipelineDataCopy[dealDroppable.sourceStageIndex] = stageObject;
  } else {
    //cut the slices based on the indexes
    firstSlice = sourceDeals.slice(0, dealDroppable.sourceIndex);
    finalSlice = sourceDeals.slice(destinationIndex, sourceDeals.length);
    middleSlice = sourceDeals.slice(
      dealDroppable.sourceIndex + 1,
      destinationIndex
    );
    //change the index prop in the dealDroppable and the middle slice
    selectedDeal.index = newIndexProp - 1;
    middleSlice = middleSlice.map((deal) => {
      return { ...deal, index: deal.index - 1 };
    });
    //recreate the newly organised array
    stageObject.deals = [
      ...firstSlice,
      ...middleSlice,
      selectedDeal,
      ...finalSlice,
    ];
    pipelineDataCopy[dealDroppable.sourceStageIndex] = stageObject;
  }
  setPipelineData(pipelineDataCopy);
};

const updateBoardForChangeStage = (
  dealDroppable,
  destinationIndex,
  destinationStageIndex,
  newIndexProp,
  pipelineData,
  setPipelineData
) => {
  let pipelineDataCopy = [...pipelineData];
  let sourceStageObject = {
    ...pipelineDataCopy[dealDroppable.sourceStageIndex],
  };
  let destinationStageObject = { ...pipelineDataCopy[destinationStageIndex] };
  let sourceDeals = [...sourceStageObject.deals];
  let destinationDeals = [...destinationStageObject.deals];
  let selectedDeal = {
    ...pipelineDataCopy[dealDroppable.sourceStageIndex].deals[
      dealDroppable.sourceIndex
    ],
  };
  let sourceFirstSlice;
  let sourceLastSlice;
  let destinationFirstSlice;
  let destinationLastSlice;

  sourceFirstSlice = sourceDeals.slice(0, dealDroppable.sourceIndex);
  sourceLastSlice = sourceDeals.slice(
    dealDroppable.sourceIndex + 1,
    sourceDeals.length
  );
  destinationFirstSlice = destinationDeals.slice(0, destinationIndex);
  destinationLastSlice = destinationDeals.slice(
    destinationIndex,
    destinationDeals.length
  );
  sourceFirstSlice = sourceFirstSlice.map((deal) => {
    return { ...deal, index: deal.index - 1 };
  });
  destinationLastSlice = destinationLastSlice.map((deal) => {
    return { ...deal, index: deal.index + 1 };
  });
  selectedDeal.index = newIndexProp;
  sourceStageObject.deals = [...sourceFirstSlice, ...sourceLastSlice];
  destinationStageObject.deals = [
    ...destinationFirstSlice,
    selectedDeal,
    ...destinationLastSlice,
  ];
  //VALUES AND STAGE COUNTS
  sourceStageObject.total_deals--;
  sourceStageObject.total_value =
    sourceStageObject.total_value - Number(selectedDeal.value);

  destinationStageObject.total_deals++;
  destinationStageObject.total_value =
    destinationStageObject.total_value + Number(selectedDeal.value);
  //=======================

  pipelineDataCopy[destinationStageIndex] = destinationStageObject;
  pipelineDataCopy[dealDroppable.sourceStageIndex] = sourceStageObject;
  setPipelineData(pipelineDataCopy);
};

const ManagerWrapper = styled.div`
  flex-wrap: nowrap;
  overflow-x: auto;
  margin-top: 20px;
  padding-left: 15px;
  width: 100%;
  min-height: calc(100vh - 380px);

  .infinite-scroll-component {
    overflow: auto !important;
  }
`;
