import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import HistoryContext from "contexts/historyContext/HistoryContext";
import styled from "styled-components";
import renderHTML from "react-render-html";
import ReactDOMServer from "react-dom/server";
import { ROUTES } from "routes";

import FilterTag from "sharedComponents/filterV2/FilterTag";
import AddFilter from "sharedComponents/filterV2/AddFilter";
import SegmentMenu from "sharedComponents/filterV2/SegmentMenu";
import { SOURCE_FILTERS } from "sharedComponents/filterV2/filterObjects";
import { fetchSegmentsList } from "helpersV2/segments";

const sourceExchanger = {
  candidate: "ProfessionalTalentNetwork",
  deal: "Deal",
  client: "CompanyDetail",
  job: "JobPost",
  contact: "DealContact",
};

const FilterComponent = ({ source, returnFilters, hideSegments, v2theme }) => {
  const store = useContext(GlobalContext);
  const historyStore = useContext(HistoryContext);
  const [newFilter, setNewFilter] = useState(undefined);
  const [tags, setTags] = useState([]);
  const [availableSegments, setAvailableSegments] = useState(undefined);
  const [updateSegments, triggerUpdateSegments] = useState(undefined);
  const [activeSegment, setActiveSegment] = useState(undefined);
  const [ownerType, setOwnerType] = useState(undefined);
  const [selectedFolder, setSelectedFolder] = useState(undefined);
  const [originPages] = useState({
    candidate: ROUTES.CandidateProfile.path,
    client: ROUTES.ClientProfile.path,
    contact: ROUTES.ContactProfile.path,
    deal: ROUTES.DealProfile.path,
    job: ROUTES.JobDashboard.path,
    task: ROUTES.TasksManager.path,
    companyTask: ROUTES.CompanyTasksManager.path,
  });
  const [filterOptions, setFilterOptions] = useState(undefined);

  useEffect(() => {
    if (SOURCE_FILTERS[source]) {
      setFilterOptions(SOURCE_FILTERS[source](store));
    }
  }, [source, store.job_extra_fields]);

  const addNewFilter = (tag) => {
    setNewFilter(undefined);
    let tagsCopy = [...tags, tag];
    setTags(tagsCopy);
    storeFilters(tagsCopy);
  };

  const editFilter = (newFilter, index) => {
    let tagsCopy = [...tags];
    tagsCopy[index] = newFilter;
    setTags(tagsCopy);
    storeFilters(tagsCopy);
  };

  const deleteFilter = (index) => {
    let tagsCopy = [...tags];
    tagsCopy.splice(index, 1);
    setTags(tagsCopy);
    storeFilters(tagsCopy);
  };

  const storeFilters = (tagsCopy) => {
    let storedTags = [];
    tagsCopy.map((tag) =>
      storedTags.push({
        [tag.filter_prop]: tag.prop_value,
        display_text: ReactDOMServer.renderToStaticMarkup(tag.display_text),
      })
    );
    sessionStorage.setItem(`last_${source}_filter`, JSON.stringify(storedTags));
  };

  useEffect(() => {
    returnFilters(compileFilters(tags));
  }, [tags]);

  useEffect(() => {
    if (store.session && store.company) {
      fetchSegmentsList(
        store.session,
        store.company.id,
        store.session.id,
        sourceExchanger[source]
      ).then((res) => {
        if (!res.err) {
          setAvailableSegments(res);
          setAvailableSegments(res);
        } else {
          //
        }
      });
    }
  }, [store.session, store.company, updateSegments]);

  const convertTags = (data) => {
    let newTags = [];
    data &&
      data.map((piece) => {
        let propName = Object.keys(piece)[0];
        filterOptions.map((filter) =>
          filter.filter_prop === propName
            ? newTags.push({
                ...filter,
                prop_value: piece[propName],
                display_text: renderHTML(piece.display_text),
              })
            : null
        );
        return null;
      });
    return newTags;
  };

  useEffect(() => {
    if (activeSegment && filterOptions) {
      setTags(convertTags(activeSegment.data));
    }
  }, [activeSegment, filterOptions]);

  //get last filter used
  useEffect(() => {
    if (
      source &&
      historyStore.state[1] &&
      historyStore.state[1].path === originPages[source] &&
      filterOptions
    ) {
      let last_source_filter = JSON.parse(
        sessionStorage.getItem(`last_${source}_filter`)
      );
      if (last_source_filter) {
        setTags(convertTags(last_source_filter));
      }
    }
  }, [source, historyStore, filterOptions]);

  return (
    <STWrapper
      className={`${v2theme ? "v2theme" : ""} leo-flex leo-justify-between`}
    >
      <TagsContainer className="leo-flex">
        {tags &&
          tags.length > 0 &&
          tags.map((filterOption, index) => (
            <FilterTag
              key={`filter-tag-${index}`}
              index={index}
              filterOption={filterOption}
              setNewFilter={setNewFilter}
              saveFilter={editFilter}
              deleteFilter={deleteFilter}
              store={store}
            />
          ))}
        {newFilter && (
          <FilterTag
            newFilter={newFilter}
            setNewFilter={setNewFilter}
            saveFilter={addNewFilter}
            deleteFilter={() => setNewFilter(undefined)}
            index={tags?.length || 0}
            store={store}
          />
        )}
        <AddFilter
          source={source}
          setNewFilter={setNewFilter}
          setTags={setTags}
          store={store}
        />
        {!hideSegments && tags?.length > 0 && (
          <SegmentMenu
            type={!activeSegment ? "create" : "edit"}
            availableSegments={availableSegments}
            setActiveSegment={setActiveSegment}
            activeSegment={activeSegment}
            store={store}
            triggerUpdateSegments={() => triggerUpdateSegments(Math.random())}
            tags={tags}
            source={source}
            ownerType={ownerType}
            setOwnerType={setOwnerType}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
          />
        )}
      </TagsContainer>
      {!hideSegments && (
        <SegmentMenu
          type="select"
          availableSegments={availableSegments}
          setActiveSegment={setActiveSegment}
          activeSegment={activeSegment}
          store={store}
          triggerUpdateSegments={() => triggerUpdateSegments(Math.random())}
          tags={tags}
          source={source}
          ownerType={ownerType}
          setOwnerType={setOwnerType}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
        />
      )}
    </STWrapper>
  );
};

export default FilterComponent;

const compileFilters = (tags) => {
  let filtersObj = {};
  tags.map((tag) => {
    if (!tag.single_value) {
      if (filtersObj[tag.filter_prop]) {
        filtersObj[tag.filter_prop] = [
          ...filtersObj[tag.filter_prop],
          ...(Array.isArray(tag.prop_value)
            ? tag.prop_value
            : [tag.prop_value]),
        ];
      } else {
        filtersObj[tag.filter_prop] = Array.isArray(tag.prop_value)
          ? tag.prop_value
          : [tag.prop_value];
      }
    } else {
      filtersObj[tag.filter_prop] = tag.prop_value;
    }

    return null;
  });
  return filtersObj;
};

const STWrapper = styled.div`
  align-items: self-start;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  flex-direction: row;
  padding: 0 15px 10px;
  width: 100%;

  &.v2theme {
    box-shadow: none;
  }
`;

const TagsContainer = styled.div`
  flex-wrap: wrap;
`;
