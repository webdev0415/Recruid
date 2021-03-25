import React, { useEffect, useState } from "react";
import { StyledInput } from "modals/CreateContactModal/CreateContactModal";
import styled from "styled-components";

import DealInfoCard from "components/Profiles/components/deal/DealInfoCard";

export default ({
  handleModalViewChange,
  searchResult,
  onDealSelect,
  company,
}) => {
  const [filteredDeals, setFilteredDeals] = useState(undefined);
  const [searchValue, setSearchValue] = useState(undefined);

  useEffect(() => {
    if (searchResult) {
      setFilteredDeals(searchResult);
    }
  }, [searchResult]);

  useEffect(() => {
    if (searchValue && searchResult.length > 0) {
      setFilteredDeals(
        searchResult.filter((deal) => {
          if (searchValue === "") return true;
          let lowerName = deal.name.toLowerCase();
          if (lowerName.includes(searchValue)) {
            return true;
          } else {
            return false;
          }
        })
      );
    }
     
  }, [searchValue]);

  return (
    <>
      <SearchArea>
        <div>
          <StyledInput
            type="search"
            className="form-control"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Type to search for a deal"
            style={{ maxWidth: "300px", width: "300px" }}
          />
        </div>
        <button
          className="button button--default button--blue-dark"
          onClick={() => handleModalViewChange("initial")}
        >
          Create New
        </button>
      </SearchArea>
      <ResultArea>
        {filteredDeals &&
          filteredDeals.map((deal, index) => {
            if (!deal.delete) {
              return (
                <div
                  key={`info-card-${index}`}
                  style={{ cursor: "pointer", marginBottom: 10 }}
                >
                  <DealInfoCard
                    light
                    deal={deal}
                    onDealSelect={onDealSelect}
                    company={company}
                  />
                </div>
              );
            } else {
              return null;
            }
          })}
      </ResultArea>
    </>
  );
};

const SearchArea = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  input {
    margin-bottom: 0 !important;
    max-width: 250px;
  }
`;

const ResultArea = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  height: 100%;
  max-height: 420px;
  overflow-y: auto;
  padding: 10px;
  text-align: left;
`;
