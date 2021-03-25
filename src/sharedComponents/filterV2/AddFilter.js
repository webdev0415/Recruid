import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MenuContainer } from "sharedComponents/filterV2/StyledFilterComponents";
import { SOURCE_FILTERS } from "sharedComponents/filterV2/filterObjects";
import useDropdown from "hooks/useDropdown";

const AddFilter = ({ source, setNewFilter, setTags, store }) => {
  const { node, showSelect, setShowSelect } = useDropdown();
  const [filterOptions, setFilterOptions] = useState(undefined);

  useEffect(() => {
    if (SOURCE_FILTERS[source]) {
      setFilterOptions(SOURCE_FILTERS[source](store));
    }
  }, [source, store.job_extra_fields]);

  return (
    <AddFilterContainer ref={node}>
      <AddButton
        className="leo-flex-center"
        onClick={() => setShowSelect(!showSelect)}
      >
        <svg
          width="10"
          height="10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-role="evenodd"
            clipRule="evenodd"
            d="M6 0H4v4H0v2h4v4h2V6h4V4H6V0z"
            fill="#2A3744"
          />
        </svg>
        Add Filter
      </AddButton>
      {showSelect && filterOptions && (
        <MenuContainer>
          <ul>
            {filterOptions.map((option, index) => (
              <li key={`filter-option-${index}`}>
                <button
                  onClick={() => {
                    if (!option.single_value) {
                      setNewFilter(option);
                    } else {
                      setTags((tags) => [...tags, option]);
                    }
                    setShowSelect(false);
                  }}
                >
                  <div className="image-container">
                    <img src={option.icon} alt="icon" />
                  </div>
                  {option.filter_title}
                </button>
              </li>
            ))}
          </ul>
        </MenuContainer>
      )}
    </AddFilterContainer>
  );
};

const AddButton = styled.button`
  font-size: 14px;
  font-weight: 500;
  height: 35px;
  margin-top: 10px;
  // padding: 7px 15px;
  // width: fit-content;

  svg {
    margin-right: 5px;
  }
`;

const AddFilterContainer = styled.div`
  position: relative;
  // margin-bottom: 10px;

  &:not(:first-child) {
    margin-left: 15px;
  }
`;

export default AddFilter;
