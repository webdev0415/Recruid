import React, { useState, useEffect, useRef, Suspense } from "react";
import styled from "styled-components";
import { pie } from "sharedComponents/filterV2/icons/index";
import SelectMenu from "sharedComponents/filterV2/SegmentMenu/SelectMenu";
import retryLazy from "hooks/retryLazy";

const EditSaveModal = React.lazy(() =>
  retryLazy(() => import("sharedComponents/filterV2/SegmentMenu/EditSaveModal"))
);

const SegmentMenu = ({
  type,
  availableSegments,
  activeSegment,
  setActiveSegment,
  store,
  triggerUpdateSegments,
  tags,
  source,
  ownerType,
  setOwnerType,
  selectedFolder,
  setSelectedFolder,
}) => {
  const [segments, setSegments] = useState(undefined);
  const [showSelect, setShowSelect] = useState(false);
  const node = useRef();

  useEffect(() => {
    if (availableSegments) {
      setSegments({ ...availableSegments });
    }
  }, [availableSegments]);

  const handleClick = (e) => {
    if (!node.current.contains(e.target) && type === "select") {
      setShowSelect(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div ref={node} className="leo-relative">
      <SegmentButton
        onClick={() => setShowSelect(!showSelect)}
        className="leo-flex-center"
      >
        <div className="image-container">
          <img src={pie} alt="icon" />
        </div>
        {type === "create"
          ? "Create Segment"
          : type === "edit"
          ? "Save Segment"
          : "Segments"}
      </SegmentButton>
      {showSelect && type !== "select" && (
        <Suspense fallback={<div />}>
          <EditSaveModal
            type={type}
            segments={segments}
            setSegments={setSegments}
            setActiveSegment={setActiveSegment}
            activeSegment={activeSegment}
            setShowSelect={setShowSelect}
            store={store}
            triggerUpdateSegments={triggerUpdateSegments}
            tags={tags}
            source={source}
            setOwnerType={setOwnerType}
            ownerType={ownerType}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
          />
        </Suspense>
      )}
      {showSelect && type === "select" && (
        <SelectMenu
          segments={segments}
          setSegments={setSegments}
          setActiveSegment={setActiveSegment}
          setShowSelect={setShowSelect}
          store={store}
          triggerUpdateSegments={triggerUpdateSegments}
          source={source}
          setSelectedFolder={setSelectedFolder}
          setOwnerType={setOwnerType}
        />
      )}
    </div>
  );
};

export default SegmentMenu;

const SegmentButton = styled.button`
  font-size: 14px;
  font-weight: 500;
  height: 35px;
  margin-left: 15px;
  margin-top: 10px;

  .image-container {
    align-items: center;
    display: flex;
    height: 12px;
    justify-content: center;
    margin-right: 5px;
    width: 12px;
  }

  img {
    margin-right: 5px;
  }
`;
