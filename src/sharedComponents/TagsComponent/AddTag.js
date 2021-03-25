import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TagLocationInput from "sharedComponents/TagsComponent/TagLocationInput";
import useDropdown from "hooks/useDropdown";
import SearchDropbox from "sharedComponents/SearchDropbox";

const TYPE_TITLES = {
  skills: "Add Skill",
  industries: "Add Industry",
  locations: "Add Location",
  business_areas: "Add Business area",
  departments: "Add Department",
};

const AddTag = ({ type, onSelect, options }) => {
  const { node, showSelect, setShowSelect } = useDropdown();
  const [containerClasses, setContainerClasses] = useState({
    bottom: "",
    top: "",
    left: "",
    right: "",
  });

  const handleScroll = () => {
    let bounds = node.current.getBoundingClientRect();
    let searchBox = document.getElementById("search-box-container");
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    setContainerClasses({
      bottom:
        bounds.y - ((searchBox?.offsetHeight || 0) + 10) < 0
          ? "bottom-box"
          : "",
      top:
        bounds.bottom + ((searchBox?.offsetHeight || 0) + 10) > viewportHeight
          ? "top-box"
          : "",
      left:
        bounds.right + ((searchBox?.offsetWidth || 0) + 10) > viewportWidth
          ? "left-box"
          : "",
      right:
        bounds.x - ((searchBox?.offsetWidth || 0) + 10) < 0 ? "right-box" : "",
    });
  };

  useEffect(() => {
    if (showSelect) {
      handleScroll();
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [showSelect]);

  return (
    <AddTagContainer ref={node}>
      {type && (
        <AddButton
          onClick={(e) => {
            e.preventDefault();
            setShowSelect(true);
          }}
        >
          {TYPE_TITLES[type] || "Add"}
        </AddButton>
      )}
      {showSelect && (
        <DropDownContainer
          className={Object.values(containerClasses).join(" ")}
        >
          {type === "locations" ? (
            <TagLocationInput
              onSelect={(val) => {
                onSelect(val);
                setShowSelect(false);
              }}
              type={type}
            />
          ) : (
            <SearchDropbox
              list={options}
              onSelect={(val) => {
                onSelect(val);
                setShowSelect(false);
              }}
              allowCreation={true}
            />
          )}
        </DropDownContainer>
      )}
    </AddTagContainer>
  );
};

const AddSTButton = styled.button`
  background: #f9f9f9;
  // border: 1px solid #e1e1e1;
  border-radius: 4px;
  color: #1e1e1e;
  font-size: 12px;
  font-weight: 500;
  padding: 7px 10px;
  width: fit-content;

  svg {
    margin-right: 8px;
  }
`;

const AddTagContainer = styled.div`
  position: relative;
  margin-right: 10px;
  margin-bottom: 10px;
`;

const DropDownContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: 45px;

  &.bottom-box {
    top: 45px;
  }
  &.left-box {
    right: 0px;
    left: auto;
  }
  &.right-box {
    left: 0px;
    right: auto;
  }
  &.top-box {
    top: -220px;
  }
`;

export const AddButton = ({ children, style, onClick }) => {
  return (
    <AddSTButton style={style} onClick={onClick}>
      <AddSvg />
      {children}
    </AddSTButton>
  );
};

const AddSvg = () => (
  <svg width="17" height="17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.5 17a8.5 8.5 0 100-17 8.5 8.5 0 000 17zm-.694-4.337a.694.694 0 101.388 0v-3.47h3.47a.694.694 0 000-1.387h-3.47v-3.47a.694.694 0 10-1.388 0v3.47H4.337a.694.694 0 100 1.388h3.47v3.469z"
      fill="#2A3744"
    />
  </svg>
);
export default AddTag;
