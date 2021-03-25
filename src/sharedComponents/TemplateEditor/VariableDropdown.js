import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import { COLORS } from "constants/style";
import {
  CANDIDATE_VARIABLES,
  JOB_VARIABLES,
  CLIENT_VARIABLES,
  CONTACT_VARIABLES,
  PROTO_VARIABLES,
  job_protoype,
} from "sharedComponents/TemplateEditor/PossibleVariables";
import { fetchJobs } from "helpersV2/jobs";
import useDropdown from "hooks/useDropdown";
// { ...PROTO_VARIABLES.job_link, ...job_protoype },
const SelectDropdown = ({ selected, onSelect, source, type, store }) => {
  const { node, showSelect, setShowSelect } = useDropdown();
  const [search, setSearch] = useState("");
  const [validOptions, setValidOptions] = useState(undefined);
  const [options, setOptions] = useState(undefined);
  const [jobs, setJobs] = useState(undefined);

  useEffect(() => {
    if (store.company && store.role) {
      fetchJobs(store.session, store.company.id, {
        slice: [0, 1],
        operator: "and",
        team_member_id: store.role.team_member.team_member_id,
      }).then((jbs) => {
        if (!jbs.err) {
          setJobs(jbs);
        }
      });
    }
  }, [store.company, store.role, store.session, search]);

  useEffect(() => {
    let jobOptions = [
      { source_title: "Jobs", separator: true },
      ...JOB_VARIABLES,
    ];
    if (store.company.career_portal) {
      jobOptions.push({ ...PROTO_VARIABLES.job_link, ...job_protoype });
    }
    if (source) {
      if (source === "candidate") {
        setValidOptions([
          { source_title: "Candidates", separator: true },
          ...CANDIDATE_VARIABLES,
          ...(jobs?.length > 0 ? jobOptions : []),
        ]);
      } else if (source === "contact") {
        setValidOptions([
          { source_title: "Contacts", separator: true },
          ...CONTACT_VARIABLES,
          ...(jobs?.length > 0 ? jobOptions : []),
        ]);
      } else if (source === "client") {
        setValidOptions([
          { source_title: "Clients", separator: true },
          ...CLIENT_VARIABLES,
          ...(jobs?.length > 0 ? jobOptions : []),
        ]);
      }
    } else {
      setValidOptions([
        { source_title: "Candidates", separator: true },
        ...CANDIDATE_VARIABLES,
        ...(jobs?.length > 0 ? jobOptions : []),
        // { source_title: "Clients", separator: true },
        // ...CLIENT_VARIABLES,
        { source_title: "Contacts", separator: true },
        ...CONTACT_VARIABLES,
      ]);
    }
  }, [type, source, jobs]);

  useEffect(() => {
    if (validOptions) {
      setOptions(validOptions);
    }
  }, [validOptions]);

  useEffect(() => {
    if (search === "" && validOptions) {
      setOptions(validOptions);
    } else if (validOptions) {
      setOptions(
        validOptions.filter((option) => {
          if (option.separator) {
            return true;
          } else {
            return option.prop_title
              .toLowerCase()
              .includes(search.toLowerCase());
          }
        })
      );
    }
  }, [search, validOptions]);

  return (
    <Wrapper ref={node}>
      <SelectButton
        onClick={() => setShowSelect(!showSelect)}
        className="leo-flex-center-between"
      >
        <>
          {selected?.prop_title || (
            <span className="placeholder">
              Select an object to personalise....
            </span>
          )}
          <span>
            <i className="fas fa-angle-down"></i>
          </span>
        </>
      </SelectButton>
      {showSelect && validOptions && (
        <Menu>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
          {options &&
            options.map((option, index) => (
              <Fragment key={`filter-${option.source_title}-${index}`}>
                {option.separator ? (
                  <>
                    <Separator>{option.source_title}</Separator>
                  </>
                ) : (
                  <SelectOption
                    name={option.prop_title}
                    explanation={option.explanation}
                    onClick={() => {
                      onSelect(option);
                      setShowSelect(false);
                    }}
                  />
                )}
              </Fragment>
            ))}
        </Menu>
      )}
    </Wrapper>
  );
};

export default SelectDropdown;

const SelectOption = ({ name, onClick, explanation }) => (
  <MenuOption onClick={onClick}>
    {name} {explanation && <span>{explanation}</span>}
  </MenuOption>
);

const Wrapper = styled.div`
  position: relative;
`;

const Menu = styled.div`
  background-color: ${COLORS.white};
  border: 0;
  border-radius: 0.25rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 5px rgba(0, 0, 0, 0.2);
  left: auto;
  margin: 0;
  max-height: 250px;
  min-width: 10rem;
  overflow: hidden;
  overflow-y: hidden;
  overflow-y: auto;
  padding: 8px 0;
  position: absolute;
  right: 0;
  z-index: 1;
  width: 100%;
  top: 120%;
`;

const MenuOption = styled.button`
  color: #2a3744;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 14px 5px;
  text-align: left;
  width: 100%;

  &:hover {
    background-color: #f6f6f6;
  }

  &.active {
    background: #f6f6f6;
    color: #fff;

    &:hover {
      background-color: #f6f6f6;
    }
  }

  span {
    color: #74767b;
    font-size: 10px;
  }
`;

const SelectButton = styled.button`
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  // font-weight: 500;
  font-size: 14px;
  height: 40px;
  padding: 0 15px;
  width: 100%;

  .placeholder {
    color: #74767b;
  }
`;

const Separator = styled.div`
  color: ${COLORS.dark_4};
  text-transform: uppercase;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.5px;
  padding: 5px 14px 5px;
  text-transform: uppercase;
`;

const SearchInput = styled.input`
  border: none;
  border-bottom: solid #eee 1px;
  font-size: 14px;
  padding: 0 15px;
  padding-bottom: 15px;
  padding-top: 7px;
  // margin: 10px 0px 10px 0px;
  // padding: 0px 10px 0px 10px;
  width: 100%;
`;
