import React from "react";
import styled from "styled-components";

const Tags = ({ tags, setTags }) => {
  //
  const removeAll = () => {
    let newTags = [...tags];
    newTags = newTags.map((tag) => {
      return { ...tag, _destroy: true };
    });
    setTags(newTags);
  };

  return (
    <>
      {tags &&
        tags.map((tag, index) => (
          <React.Fragment key={`tag-${index}`}>
            {!tag._destroy && (
              <TagBox
                key={`tag-${index}`}
                tag={tag}
                tags={tags}
                setTags={setTags}
                index={index}
              />
            )}
          </React.Fragment>
        ))}
      {tags && tags.filter((tag) => !tag._destroy).length > 0 && (
        <TagStyledButton onClick={removeAll}>Remove All</TagStyledButton>
      )}
    </>
  );
};

const TagBox = ({ tag, index, setTags, tags }) => {
  //
  const deleteTag = () => {
    let newTags = [...tags];
    let tag = { ...newTags[index], _destroy: true };
    newTags[index] = tag;
    setTags(newTags);
  };

  return (
    <TagStyledContainer className="leo-flex-center">
      <span>{tag.name}</span>
      <button className="cancelFilter" onClick={deleteTag}>
        <CancelFilterIcon />
      </button>
    </TagStyledContainer>
  );
};

const TagStyledButton = styled.button`
  background: #2a3744;
  border: 0;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 5px 20px;
  position: relative;
  transition: 0.25s ease-in-out background-color;

  &:hover {
    background: #2a3744;
  }
`;

const TagStyledContainer = styled.div`
  background: #ffffff;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 7px 10px;
  transition: 0.25s ease-in-out background-color;

  .cancelFilter {
    margin-left: 10px;
  }
`;

export const CancelFilterIcon = () => (
  <svg width="9" height="9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-role="evenodd"
      clipRule="evenodd"
      d="M.137.137a.466.466 0 000 .66l3.49 3.49L.332 7.584a.466.466 0 10.66.66l3.296-3.297L7.391 8.05a.466.466 0 10.66-.66L4.947 4.287 8.245.99a.466.466 0 10-.66-.66L4.288 3.629.797.137a.466.466 0 00-.66 0z"
      fill="#F27881"
    />
  </svg>
);

export default Tags;
