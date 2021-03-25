import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import styled from "styled-components";
import {
  generateSkillCompetencies,
  generateIndustryCategories,
  generateLocalizations,
  generateDepartmentCategories,
  generateBusinessAreaCategories,
} from "sharedComponents/TagsComponent/methods/tags";
import notify from "notifications";

import {
  StyledLabel,
  InputContainer,
} from "sharedComponents/TagsComponent/StyledInputs";

import AddTag from "sharedComponents/TagsComponent/AddTag";
import Tags from "sharedComponents/TagsComponent/Tags";

const TagsContainer = styled.div`
  flex-wrap: wrap;
`;

const useTags = (parentTags, setParentTags) => {
  const [tags, setTags] = useState([]);
  return parentTags && setParentTags
    ? { tags: parentTags, setTags: setParentTags }
    : { tags, setTags };
};

const TagsComponent = ({
  label,
  type,
  originalTags,
  returnTags,
  parentTags,
  setParentTags,
  returnHasTags,
}) => {
  const store = useContext(GlobalContext);
  const [addTag, setAddTag] = useState(false);
  const { tags, setTags } = useTags(parentTags, setParentTags);
  const [clickedAdd, triggerAddition] = useState(undefined);
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    if (originalTags && originalTags.length > 0) {
      setTags(originalTags);
    }
  }, [originalTags]);

  useEffect(() => {
    if (returnHasTags) {
      returnHasTags(tags.filter((tag) => !tag._destroy).length > 0);
    }
  }, [tags]);

  useEffect(() => {
    if (store.company && !initial) {
      if (type === "skills") {
        returnTags(
          generateSkillCompetencies(tags, originalTags, store.company.id)
        );
        return;
      } else if (type === "industries") {
        returnTags(
          generateIndustryCategories(tags, originalTags, store.company.id)
        );
      } else if (type === "locations") {
        returnTags(generateLocalizations(tags, originalTags, store.company.id));
      } else if (type === "departments") {
        returnTags(
          generateDepartmentCategories(tags, originalTags, store.company.id)
        );
      } else if (type === "business_areas") {
        returnTags(
          generateBusinessAreaCategories(tags, originalTags, store.company.id)
        );
      }
    }
  }, [tags, store.company, originalTags]);

  useEffect(() => {
    if (initial) {
      setInitial(false);
    }
  }, [tags, store.company, originalTags]);

  const onAddition = (value) => {
    let indexMatch = tags.findIndex(
      (tag) => tag.name.toLowerCase() === value.name.toLowerCase()
    );
    //if tag already included
    if (indexMatch >= 0) {
      //if tag was destroyed previously remove and add again
      if (tags[indexMatch]._destroy) {
        let tagsCopy = [...tags];
        tagsCopy.splice(indexMatch, 1);
        setTags([...tagsCopy, value]);
        //els if tag already included and not destroyed notify
      } else {
        notify("danger", "Tag already included");
      }
    } else {
      setTags([...tags, value]);
    }
    setAddTag(false);
  };

  useEffect(() => {
    if (!addTag && clickedAdd) {
      triggerAddition(undefined);
    }
  }, [addTag]);

  return (
    <InputContainer>
      {label && <StyledLabel>{label}</StyledLabel>}
      <TagsContainer className="leo-flex-center">
        <AddTag onSelect={onAddition} type={type} options={store[type]} />
        {tags && tags.length > 0 && (
          <Tags tags={tags} setTags={setTags} options={store[type]} />
        )}
      </TagsContainer>
    </InputContainer>
  );
};

export default TagsComponent;
