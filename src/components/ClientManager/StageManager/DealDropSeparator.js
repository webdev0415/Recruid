import React from "react";
import styled from "styled-components";
import { useDrop } from "react-dnd";

const DealDropSeparator = ({
  onDropDeal,
  emptyColumn,
  lastItem,
  selfDragging,
  overStage,
}) => {
  const [{ isOverCurrent, dealDroppable }, drop] = useDrop({
    accept: "deal",
    drop(item, monitor) {
      let dealDroppable = monitor.getItem();
      onDropDeal(dealDroppable);
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
      dealDroppable: monitor.getItem(),
    }),
  });
  return (
    <DealDropSeparatorST
      ref={drop}
      className={`${
        (emptyColumn || lastItem) && dealDroppable ? "fullHeight" : ""
      } ${overStage ? "overStage" : ""}`}
    >
      {!emptyColumn && !lastItem && !selfDragging && (
        <BasicBox className={isOverCurrent ? "over" : ""} />
      )}
      {emptyColumn && (
        <EmptyColumnBox
          className={`${isOverCurrent ? "over" : ""} ${
            dealDroppable && emptyColumn ? "dragging" : ""
          }`}
        />
      )}
      {lastItem && <LastBox className={isOverCurrent ? "over" : ""} />}
      {selfDragging && (
        <>
          <SelfBox className={isOverCurrent ? "over" : ""} />
        </>
      )}
    </DealDropSeparatorST>
  );
};

const DealDropSeparatorST = styled.div`
  padding: 5px 0px;
  width: 100%;
  transition: padding 200ms;

  &.overStage {
    padding: 10px 0px;
  }

  &.fullHeight {
    height: 100%;
  }

  div {
    border-radius: 4px;
    width: 100%;
  }
`;

const BasicBox = styled.div`
  height: 0px;
  transition: height 250ms;

  &.over {
    background: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    height: 100px;
    opacity: 0.5;
  }
`;

const EmptyColumnBox = styled.div`
  &.dragging {
    background: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    height: 100%;
    min-height: 100px;
    opacity: 0.5;
  }
  &.over {
    background: #f27881;
  }
`;
const LastBox = styled.div`
  &.over {
    background: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    height: 100%;
    opacity: 0.5;
  }
`;

const SelfBox = styled.div`
  height: 40px;
  transition: height 250ms;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  opacity: 0.5;

  &.over {
    height: 100px;
  }
`;

export default DealDropSeparator;
