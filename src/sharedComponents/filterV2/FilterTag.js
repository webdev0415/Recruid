import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import FilterTyper from "sharedComponents/filterV2/FilterTyper";
import { FilterStyledContainer } from "sharedComponents/filterV2/StyledFilterComponents";
import { AWS_CDN_URL } from "constants/api";

const FilterTag = ({
  filterOption,
  setNewFilter,
  newFilter,
  saveFilter,
  deleteFilter,
  index,
  store,
}) => {
  const [showSelect, setShowSelect] = useState(undefined);
  const [option, setOption] = useState(undefined);
  const node = useRef();

  const handleClick = (e) => {
    if (!node?.current?.contains(e.target)) {
      setShowSelect(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    if (filterOption) {
      setOption({ ...filterOption });
    } else if (newFilter) {
      setOption({ ...newFilter });
      setShowSelect(true);
    }
  }, [filterOption, newFilter]);

  useEffect(() => {
    if (showSelect === false && newFilter) {
      setNewFilter(undefined);
    }
  }, [showSelect, newFilter]);

  return (
    <div className="leo-flex leo-align-end leo-relative" ref={node}>
      {option && (
        <>
          {index ? <AndSpan className="leo-flex-center">and</AndSpan> : null}
          <FilterBar
            option={option}
            setShowSelect={setShowSelect}
            deleteFilter={deleteFilter}
            index={index}
          />
          <FilterTyper
            option={option}
            setOption={setOption}
            saveFilter={(newOption, ix) => {
              saveFilter(newOption, ix);
              setShowSelect(false);
            }}
            index={index}
            store={store}
            showSelect={showSelect}
          />
        </>
      )}
    </div>
  );
};

export default FilterTag;

const FilterBar = ({ option, setShowSelect, deleteFilter, index }) => {
  return (
    <FilterStyledContainer>
      <button onClick={() => setShowSelect(true)}>
        <img src={option.icon} alt="icon" />
        {option.display_text}
      </button>
      <span className="cancelFilter" onClick={() => deleteFilter(index)}>
        <img src={`${AWS_CDN_URL}/icons/CancelIcon2.svg`} alt="Delete" />
      </span>
    </FilterStyledContainer>
  );
};

const AndSpan = styled.div`
  font-size: 14px;
  height: 35px;
  padding: 0 5px;
`;
