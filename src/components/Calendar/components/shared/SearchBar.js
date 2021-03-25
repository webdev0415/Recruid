import React from "react";
import styled from "styled-components";

const Input = styled.input`
  border: none;
  border-bottom: 1px solid #eee;
  outline: none;
  padding: 10px 15px;
  width: 100%;
`;

const Search = styled.div`
  position: fixed;
  overflow: hidden;
  width: 100%;
`;

export const SearchBar = ({ eventHandler, searchState, placeholder }) => (
  <Search>
    <Input
      className="form-input"
      type="search"
      onChange={eventHandler}
      value={searchState}
      placeholder={placeholder}
    />
  </Search>
);
