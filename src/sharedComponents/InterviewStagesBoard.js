import React, { useEffect } from "react";
import { DndProvider, useDrop, useDrag } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import styled from "styled-components";

import {
  ButtonsContainer,
  StyledInput,
} from "components/TeamView/Customisation/sharedComponents";

const staticNames = {
  interview_stage_zero: false,
  interview_stage_one: false,
  interview_stage_two: false,
  interview_stage_three: false,
  interview_stage_four: false,
};

const InterviewStagesBoard = ({
  interviewStages,
  setInterviewStages,
  companyId,
}) => {
  useEffect(() => {
    if (
      interviewStages &&
      interviewStages.filter((stage) => !stage.destroy).length < 5 &&
      interviewStages[interviewStages.length - 1] &&
      interviewStages[interviewStages.length - 1]?.name !== ""
    ) {
      let listCopy = [...interviewStages];
      listCopy.push({
        index: listCopy[listCopy.length - 1].index + 1,
        company_id: companyId,
        name: "",
        static_name: findEmptyStage(),
        is_active: true,
      });
      setInterviewStages(listCopy);
    }
  }, [interviewStages]);

  const findEmptyStage = () => {
    let namesMatch = { ...staticNames };
    interviewStages
      .filter((stage) => !stage.destroy)
      .map((stage) => (namesMatch[stage.static_name] = true));
    let entries = Object.entries(namesMatch);
    entries = entries.filter((pair) => !pair[1]);
    if (entries.length > 0) {
      return entries[0][0];
    } else {
      return null;
    }
  };

  const removeStage = (index) => {
    let listCopy = [...interviewStages];
    let stageCopy = { ...listCopy[index] };

    let firstSlice;
    let secondSlice;

    firstSlice = listCopy.slice(0, index);
    secondSlice = listCopy.slice(index + 1, listCopy.length);
    secondSlice = secondSlice.map((stage) => {
      return {
        ...stage,
        index: stage.index - 1,
      };
    });
    if (stageCopy.id) {
      stageCopy.destroy = true;
      stageCopy.index = -1;
      setInterviewStages([...firstSlice, stageCopy, ...secondSlice]);
    } else {
      setInterviewStages([...firstSlice, ...secondSlice]);
    }
  };

  const changeStageIndex = (stageDroppable, newIndex) => {
    if (!stageDroppable) return;
    if (
      stageDroppable.sourceIndex === newIndex ||
      stageDroppable.sourceIndex + 1 === newIndex
    )
      return;
    let newStages = [...interviewStages];
    let stageCopy = { ...newStages[stageDroppable.sourceIndex] };

    let movingUpDown = newIndex < stageDroppable.sourceIndex ? "up" : "down";

    let firstSlice;
    let middleSlice;
    let finalSlice;

    if (movingUpDown === "up") {
      firstSlice = newStages.slice(0, newIndex);
      finalSlice = newStages.slice(
        stageDroppable.sourceIndex + 1,
        newStages.length
      );
      middleSlice = newStages.slice(newIndex, stageDroppable.sourceIndex);
      stageCopy.index = newIndex;
      middleSlice = middleSlice.map((stage) => {
        return {
          ...stage,
          index: stage.index + 1,
        };
      });
      newStages = [...firstSlice, stageCopy, ...middleSlice, ...finalSlice];
    } else {
      firstSlice = newStages.slice(0, stageDroppable.sourceIndex);
      finalSlice = newStages.slice(newIndex, newStages.length);
      middleSlice = newStages.slice(stageDroppable.sourceIndex + 1, newIndex);

      stageCopy.index = newIndex - 1;

      middleSlice = middleSlice.map((stage) => {
        return {
          ...stage,
          index: stage.index - 1,
        };
      });
      newStages = [...firstSlice, ...middleSlice, stageCopy, ...finalSlice];
    }
    setInterviewStages(newStages);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <StagesSelector
        interviewStages={interviewStages}
        setInterviewStages={setInterviewStages}
        changeStageIndex={changeStageIndex}
        removeStage={removeStage}
      />
    </DndProvider>
  );
};

const StagesSelector = ({
  interviewStages,
  setInterviewStages,
  changeStageIndex,
  removeStage,
}) => {
  return (
    <StagesWrapper>
      <div>
        {interviewStages.map((stage, index) => {
          if (!stage.destroy) {
            return (
              <React.Fragment key={`interview-stage-${index}`}>
                <StageDropSeparator
                  changeStageIndex={changeStageIndex}
                  newIndex={index}
                />
                <InterviewStageBar
                  stage={stage}
                  index={index}
                  interviewStages={interviewStages}
                  setInterviewStages={setInterviewStages}
                  removeStage={removeStage}
                />
              </React.Fragment>
            );
          } else {
            return null;
          }
        })}
        <StageDropSeparator
          changeStageIndex={changeStageIndex}
          newIndex={interviewStages.length - 1}
        />
      </div>
    </StagesWrapper>
  );
};

const InterviewStageBar = ({
  stage,
  index,
  interviewStages,
  setInterviewStages,
  removeStage,
}) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: "stage",
      sourceIndex: index,
      stage: stage,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      stageDroppable: monitor.getItem(),
    }),
  });
  return (
    <StageRow
      className={`${isDragging ? "dragging" : ""} leo-flex-center-between`}
      ref={drag}
    >
      <StyledInput
        value={stage.name}
        placeholder={
          index !== interviewStages.length - 1
            ? "Add a stage name"
            : "Add a stage"
        }
        pattern="[0-9a-zA-Z_.-]*"
        onChange={(e) => {
          let text = e.target.value.replace(/[^a-z0-9\s]/gi, "");
          if (text.length > 50) return;
          let listCopy = [...interviewStages];
          let stageCopy = { ...listCopy[index] };
          stageCopy.name = text;
          listCopy[index] = stageCopy;
          setInterviewStages(listCopy);
        }}
      />

      <ButtonsContainer>
        {interviewStages.filter((stage) => !stage.destroy).length > 2 && (
          <>
            <InterviewStageButton style={{ marginRight: "100px" }}>
              <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.642 7.451l-2.333-2.333a.66.66 0 00-.933.933l1.207 1.207H8.577V2.253l1.207 1.206a.66.66 0 00.933-.933L8.384.193a.66.66 0 00-.933 0L5.118 2.526a.66.66 0 00.933.933l1.207-1.206v5.005H2.253l1.206-1.206a.66.66 0 10-.933-.934L.193 7.451a.66.66 0 000 .933l2.333 2.333a.66.66 0 10.933-.933L2.253 8.577h5.005v5.006l-1.206-1.207a.66.66 0 00-.934.933l2.333 2.333a.66.66 0 00.933 0l2.333-2.333a.66.66 0 00-.933-.933l-1.207 1.207V8.577h5.005l-1.206 1.207a.66.66 0 00.933.933l2.333-2.333a.66.66 0 000-.933z"
                  fill="#74767B"
                  fill-role="nonzero"
                />
              </svg>
            </InterviewStageButton>
            <button
              className="button button--default button--orange"
              onClick={() => removeStage(index)}
            >
              Remove
            </button>
          </>
        )}
      </ButtonsContainer>
    </StageRow>
  );
};

const StageDropSeparator = ({ changeStageIndex, newIndex }) => {
  const [{ isOverCurrent, stageDroppable }, drop] = useDrop({
    accept: "stage",
    drop(item, monitor) {
      let stageDroppable = monitor.getItem();
      changeStageIndex(stageDroppable, newIndex);
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
      stageDroppable: monitor.getItem(),
    }),
  });
  return (
    <StageDropSeparatorST
      ref={drop}
      className={`${
        isOverCurrent &&
        stageDroppable?.sourceIndex !== newIndex &&
        stageDroppable?.sourceIndex + 1 !== newIndex
          ? "over"
          : ""
      } ${stageDroppable ? "dragging" : ""}`}
    >
      {stageDroppable?.sourceIndex !== newIndex &&
        stageDroppable?.sourceIndex + 1 !== newIndex && (
          <div className={isOverCurrent ? "over" : ""}></div>
        )}
    </StageDropSeparatorST>
  );
};

export default InterviewStagesBoard;

const StagesWrapper = styled.div`
  border-radius: 4px;
  border: solid #eeeeee 1px;
  height: max-content;
  position: relative;
  width: 100%;
`;

const StageRow = styled.div`
  background: #ffffff;
  padding: 15px;

  &:not(:last-child) {
    border-bottom: solid #eeeeee 1px;
  }

  &.dragging {
    opacity: 0;
  }
`;

const InterviewStageButton = styled.button`
  background: none;
  height: 20px;
  width: 20px;

  &.arrow {
    background: #eeeeee;
    border-radius: 2px;
    margin: 1px 0px;
  }
`;

const StageDropSeparatorST = styled.div`
  background: #fff;
  padding: 0px 0px;
  /* transition: all 300ms; */
  width: 100%;

  &.dragging {
    padding: 5px;
  }

  &.over {
    padding: 20px 10px;
  }

  div {
    border-radius: 4px;
    height: 5px;
    width: 100%;
  }

  .over {
    background: #eeeeee;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    height: 40px;
    opacity: 0.5;
  }
`;
