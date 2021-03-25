import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { COLORS } from "constants/style";

const SearchDropbox = ({
  displayProp,
  list,
  placeholder,
  onSelect,
  allowCreation,
  getInputProps,
  getSuggestionItemProps,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [listOptions, setListOptions] = useState(undefined);

  useEffect(() => {
    if (list) {
      if (searchValue === "") {
        setListOptions([...list]);
      } else {
        setListOptions([
          ...list.filter((option) =>
            option[displayProp || "name"]
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          ),
        ]);
      }
    }
  }, [list, searchValue, displayProp]);

  const upperCaseValue = (value) => {
    let formattedName = value.split(" ");
    formattedName = formattedName.map((word) => {
      return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;
    });
    formattedName = formattedName.join(" ");
    onSelect({ name: formattedName });
    return;
  };

  const onlyUppercase = (value) => {
    let formattedName = value.split(" ");
    formattedName = formattedName.map((word) => {
      return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;
    });
    return formattedName.join(" ");
  };

  return (
    <SearchBox id="search-box-container">
      <InputContainer className="leo-flex-center-start leo-relative">
        <SearchInput
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={placeholder}
          autoFocus
          onKeyPress={(e) => {
            if (allowCreation && e.key === "Enter" && e.target.value !== "") {
              upperCaseValue(e.target.value);
            }
          }}
          {...(getInputProps ? getInputProps() : {})}
        />
        <SearchSvg />
      </InputContainer>
      <List>
        {listOptions &&
          listOptions.length > 0 &&
          listOptions.map((option, index) => (
            <ListItem
              onClick={() => {
                onSelect(option);
              }}
              {...(getSuggestionItemProps
                ? getSuggestionItemProps(option)
                : {})}
              key={`select-option-${index}`}
            >
              {option[displayProp || "name"]}
            </ListItem>
          ))}
        {listOptions &&
          listOptions.length === 0 &&
          (!allowCreation || searchValue === "") && (
            <NoMatch>No matching results</NoMatch>
          )}
        {(!listOptions || (listOptions && listOptions.length === 0)) &&
          allowCreation &&
          searchValue !== "" && (
            <ListItem onClick={() => upperCaseValue(searchValue)}>
              <AddSvg />
              {onlyUppercase(searchValue)}
            </ListItem>
          )}
      </List>
    </SearchBox>
  );
};

export default SearchDropbox;

//DO NOT CHANGE HEIGHT AND WIDTH WITHOUT CHANGING SCROLL HANDLERS TO POSITION THE BOX INSIDE THE CLIENT VIEWPORT
const SearchBox = styled.div`
  width: 340px;
  height: 210px;
  box-shadow: 0px 1px 6px rgba(116, 118, 123, 0.17);
  background: ${COLORS.white};
  border: 1px solid #c4c4c4;
  border-radius: 4px;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  width: 91%;
  padding-left: 10px;
`;

const InputContainer = styled.div`
  background: ${COLORS.white};
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  padding: 5px 0px;
  margin: 10px 15px;

  svg {
    position: absolute;
    right: 10px;
  }
`;

const List = styled.ul`
  max-height: 152px;
  overflow: auto;
`;

const ListItem = styled.li`
  padding: 8px 24px;
  font-size: 12px;
  color: #1e1e1e;
  cursor: pointer;
  &:hover {
    background: rgba(196, 196, 196, 0.25);
  }

  svg {
    margin-right: 10px;
  }
`;

const NoMatch = styled.li`
  padding: 8px 24px;
  font-size: 12px;
  color: #1e1e1e;
`;

const SearchSvg = () => (
  <svg width="15" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.607 12.594l-3.084-2.905a5.788 5.788 0 001.301-3.649c0-3.336-2.87-6.04-6.412-6.04C2.871 0 0 2.704 0 6.04s2.87 6.04 6.412 6.04a6.645 6.645 0 003.874-1.226l3.084 2.905a.9.9 0 00.619.241.9.9 0 00.618-.241.79.79 0 000-1.165zm-8.195-2.162a4.782 4.782 0 01-3.297-1.286c-.881-.83-1.366-1.933-1.366-3.106 0-1.174.485-2.277 1.366-3.106a4.78 4.78 0 013.297-1.287A4.78 4.78 0 019.71 2.934c.88.83 1.365 1.932 1.365 3.106 0 .894-.281 1.747-.805 2.47a4.654 4.654 0 01-1.237 1.164 4.828 4.828 0 01-2.62.758z"
      fill="#798999"
    />
  </svg>
);

const AddSvg = () => (
  <svg width="17" height="17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-role="evenodd"
      clipRule="evenodd"
      d="M8.5 17a8.5 8.5 0 100-17 8.5 8.5 0 000 17zm-.694-4.337a.694.694 0 101.388 0v-3.47h3.47a.694.694 0 000-1.387h-3.47v-3.47a.694.694 0 10-1.388 0v3.47H4.337a.694.694 0 100 1.388h3.47v3.469z"
      fill="#2A3744"
    />
  </svg>
);
