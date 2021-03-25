import React, { useState, useEffect, useContext } from "react";
// import notify from "notifications";
import { useDrop } from "react-dnd";
import NumberFormat from "react-number-format";
import styled from "styled-components";

import GlobalContext from "contexts/globalContext/GlobalContext";
// import { fetchMoreDealsByStage } from "helpers/crm/pipelines";

import DealDropSeparator from "components/ClientManager/StageManager/DealDropSeparator";
// import InfiniteScroller from "sharedComponents/InfiniteScroller";
import StageCell from "components/ClientManager/StageManager/StageCell";

// const SLICE_LENGHT = 10;

const StageColumn = ({
  stage,
  index,
  pipelineData,
  onDropDeal,
  company,
  permission,
}) => {
  const store = useContext(GlobalContext);
  const [{ isOver, dealDroppable }, drop] = useDrop({
    accept: "deal",
    collect: (monitor) => ({
      dealDroppable: monitor.getItem(),
      isOver: monitor.isOver(),
    }),
  });

  // const loadMoreDeals = () => {
  //   fetchMoreDealsByStage(store.session, store.company.id, stage.id, {
  //     ...filters,
  //     slice: [stage.deals.length, SLICE_LENGHT],
  //     operator: "and",
  //     search: search?.length > 0 ? [search] : undefined,
  //   }).then((res) => {
  //     if (!res.err) {
  //       let pipelineCopy = [...pipelineData];
  //       let dealsCopy = [...pipelineCopy[index].deals];
  //       dealsCopy = [...dealsCopy, ...res];
  //       pipelineCopy[index].deals = dealsCopy;
  //       setPipelineData(pipelineCopy);
  //     } else {
  //       notify("danger", "Unable to fetch more deals");
  //     }
  //   });
  // };

  return (
    <ColumnWrapper ref={drop}>
      <ColumnHeader
        className={`${dealDroppable ? "no-margin" : ""} leo-relative`}
      >
        <div className="flex-wrapper title leo-flex-center-between">
          <p>{stage.name}</p>
          <span className="leo-flex-center-center">{stage.total_deals}</span>
        </div>
        <DealsValue>
          Total Value:{" "}
          <NumberFormat
            value={stage.total_value || 0}
            displayType={"text"}
            thousandSeparator={true}
            prefix={company.currency?.currency_name}
            renderText={(value) => <>{value}</>}
          />
        </DealsValue>
        <StageIndicator num={index + 1} total={pipelineData?.length} />
      </ColumnHeader>
      <ColBody onDropDeal={() => onDropDeal(dealDroppable, 0, index, 0)}>
        {stage.deals.length === 0 && (
          <DealDropSeparator
            onDropDeal={(dealDroppable) =>
              onDropDeal(dealDroppable, 0, index, 0)
            }
            emptyColumn={true}
          />
        )}
        {stage.deals.map((deal, ix) => (
          <StageCell
            stage={stage}
            index={ix}
            deal={deal}
            key={`${deal}-${ix}`}
            onDropDeal={onDropDeal}
            stageIndex={index}
            overStage={isOver}
            company={company}
            permission={permission}
            store={store}
          />
        ))}
        {dealDroppable &&
          (dealDroppable.sourceStageIndex !== index ||
            (dealDroppable.sourceStageIndex === index &&
              dealDroppable.dealIndex !== stage.deals.length - 1)) &&
          stage.deals?.length > 0 && (
            <DealDropSeparator
              onDropDeal={(dealDroppable) =>
                onDropDeal(
                  dealDroppable,
                  stage.deals.length,
                  index,
                  stage.deals.length
                )
              }
              lastItem={true}
            />
          )}
      </ColBody>
    </ColumnWrapper>
  );
};

const StageIndicator = ({ num, total }) => {
  const [Rows, setRows] = useState({ Render: () => null });
  useEffect(() => {
    if (num || num === 0) {
      let arr = [];
      for (let i = 0; i < total; i++) {
        arr.push(
          <div
            key={`stage-indicator-${i}`}
            className={num > i ? "active" : ""}
          ></div>
        );
      }
      setRows({ Render: () => <>{arr}</> });
    }
  }, [num, total]);

  return (
    <StageIndicatorST className="leo-flex">
      <Rows.Render />
    </StageIndicatorST>
  );
};

const ColumnWrapper = styled.div`
  flex: 0 0 auto;
  margin-right: 10px;
  width: 250px;
`;

const ColumnHeader = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
  height: 80px;
  /* margin-bottom: 10px; */
  padding: 15px;

  &.delete {
    background: #ff3159;
    color: #fff;

    svg {
      path {
        fill: #fff;
      }
    }
  }

  .flex-wrapper {
    margin-bottom: 10px;

    &.title {
      margin-bottom: 5px;
    }

    p {
      font-size: 15px;
      font-weight: 500;
      /* line-height: 1; */
      margin-bottom: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 220px;
    }

    span {
      background-color: #74767b;
      border-radius: 2px;
      color: #fff;
      font-size: 10px;
      font-weight: 500;
      height: 18px;
      margin-left: 8px;
      padding: 0 6px;

      &.filtered {
        background: #0a2444;
      }
    }
  }
`;

const ColBody = ({ onDropDeal, children }) => {
  const [{ isOverCurrent }, drop] = useDrop({
    accept: "deal",
    drop(item, monitor) {
      let dealDroppable = monitor.getItem();
      if (isOverCurrent) {
        onDropDeal(dealDroppable);
      }
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
      dealDroppable: monitor.getItem(),
    }),
  });
  return <ColumnBody ref={drop}>{children}</ColumnBody>;
};

const ColumnBody = styled.div`
  /* min-height: 1000px; */
  height: calc(100vh - 460px);
  overflow: auto;
`;

const StageIndicatorST = styled.div`
  div {
    background: #d8d8d8;
    height: 2px;
    max-width: 30px;
    width: 100%;

    &:not(:last-of-type) {
      margin-right: 2px;
    }

    &.active {
      background: #00cba7;
    }
  }
`;

const DealsValue = styled.span`
  color: grey;
  font-size: 13px;
  line-height: 1.2;
  margin-bottom: 10px;
`;

export default StageColumn;
