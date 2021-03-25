import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";

let timeout = null;

export const SearchBar = ({ company, search, setSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  const [updateValue, setUpdateValue] = useState(false);

  useEffect(() => {
    if (searchValue !== search) {
      timeout = setTimeout(() => setUpdateValue(true), 500);
    }
    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    if (updateValue) {
      if (searchValue.length > 2) {
        setSearch(searchValue);
      } else if (search !== "") {
        setSearch("");
      }
      setUpdateValue(false);
    }
  }, [updateValue]);

  return (
    <SearchBarWrapper className="leo-flex-center">
      <LogoContainer>
        <Link to={company ? `/${company.mention_tag}/dashboard` : `/companies`}>
          <img src={`${AWS_CDN_URL}/icons/BrandLogo.svg`} alt="Leo" />
        </Link>
      </LogoContainer>
      <img src={`${AWS_CDN_URL}/icons/SearchBarMagnifier.svg`} alt="" />
      <Search
        type="search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={`Search...`}
        autoFocus
      />
    </SearchBarWrapper>
  );
};

const LogoContainer = styled.div`
  margin-right: 15px;

  svg,
  img {
    height: auto;
    margin: 0;
    width: 46px;
  }
`;

const SearchBarWrapper = styled.div`
  svg,
  img {
    margin-right: 10px;
  }
`;

const Search = styled.input`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 14px;
  padding: 0;
  width: 350px;
`;
