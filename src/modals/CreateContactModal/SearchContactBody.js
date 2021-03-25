import React from "react";
import { StyledInput } from "./CreateContactModal";
import styled from "styled-components";

import InfoCard from "components/Profiles/components/InfoCard";

export default ({
  handleSearchInputChange,
  handleModalViewChange,
  searchResult,
  onContactSelect,
  parentActiveId,
  hideSearch,
}) => (
  <>
    <SearchArea>
      <div>
        {!hideSearch && (
          <StyledInput
            type="search"
            className="form-control"
            onChange={handleSearchInputChange}
            placeholder="Type to search for a contact"
            style={{ maxWidth: "300px", width: "300px" }}
          />
        )}
      </div>
      <button
        className="button button--default button--blue-dark"
        onClick={handleModalViewChange("create")}
      >
        Create New
      </button>
    </SearchArea>
    {searchResult && searchResult.length > 0 && (
      <ResultArea>
        {searchResult.map((contact, index) => {
          if (!contact.delete) {
            return (
              <div
                key={`info-card-${index}`}
                style={{ cursor: "pointer", marginBottom: 10 }}
              >
                <InfoCard
                  light
                  header={contact.name}
                  subText={contact.title}
                  email={contact.email}
                  phone={contact.phone}
                  avatar={contact.avatar_url}
                  onContactSelect={onContactSelect}
                  id={contact.id}
                  parentActive={
                    parentActiveId === contact.id
                      ? true
                      : parentActiveId
                      ? false
                      : undefined
                  }
                />
              </div>
            );
          } else {
            return null;
          }
        })}
      </ResultArea>
    )}
  </>
);

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
