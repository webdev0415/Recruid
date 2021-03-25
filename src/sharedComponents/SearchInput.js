import React, { useState, useEffect } from "react";
import styled from "styled-components";

let timeout = null;

const SearchInput = ({ value, onChange, placeholder, className, style }) => {
  const [searchValue, setSearchValue] = useState("");
  const [updateValue, setUpdateValue] = useState(false);

  useEffect(() => {
    if (searchValue !== value) {
      timeout = setTimeout(() => setUpdateValue(true), 500);
    }
    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    if (updateValue) {
      onChange(searchValue);
      setUpdateValue(false);
    }
  }, [updateValue]);

  return (
    <STSearchInput
      className={`${className || ""} leo-flex-center leo-relative`}
      style={style}
    >
      <SVGContainer>
        <svg
          width="14"
          height="15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.759 13.094l-2.906-2.905a6.04 6.04 0 10-1.165 1.165l2.906 2.905a.821.821 0 001.165 0 .824.824 0 000-1.165zm-7.72-2.162a4.364 4.364 0 01-3.105-1.286A4.364 4.364 0 011.647 6.54c0-1.174.457-2.277 1.287-3.106A4.363 4.363 0 016.04 2.147c1.173 0 2.276.457 3.106 1.287a4.363 4.363 0 011.286 3.106 4.358 4.358 0 01-1.287 3.106 4.357 4.357 0 01-3.106 1.287z"
            fill="#798999"
          />
        </svg>
      </SVGContainer>
      <input
        placeholder={placeholder || "Search..."}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </STSearchInput>
  );
};

const SVGContainer = styled.div`
  width: 14px;
  height: 15px;

  svg {
    vertical-align: unset;
  }
`;

const STSearchInput = styled.div`
  max-width: 335px;
  width: 100%;
  padding: 2px 10px;
  height: 40px;
  border-radius: 4px;
  border: 0px;
  background-color: #f6f6f6;

  input {
    font-size: 13px;
    background: none;
    border: none;
    margin-left: 10px;
    width: 100%;
  }
`;

export default SearchInput;
