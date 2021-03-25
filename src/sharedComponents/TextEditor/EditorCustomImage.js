import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import EditImageModal from "sharedComponents/TextEditor/EditImageModal";
import { Entity } from "draft-js";
import { AWS_CDN_URL } from "constants/api";

const EditorCustomImage = (props) => {
  const [innerModal, setInnerModal] = useState(undefined);
  const { url, alt } = Entity.get(props.entityKey).getData();
  const [updateStyle, setUpdateStyle] = useState(undefined);
  const [customStyle, setCustomStyle] = useState(undefined);
  const [ogProps, setOgProps] = useState(undefined);
  const node = useRef();

  useEffect(() => {
    let dataProps = Entity.get(props.entityKey).getData();
    setCustomStyle({
      size: dataProps.size || "leo-full-size",
      alignment: dataProps.alignment || "leo-image-center",
      custom: dataProps.custom || undefined,
    });
    setOgProps(dataProps);
  }, [updateStyle]);

  return (
    <>
      <ImageContainer className={customStyle?.alignment}>
        <STImage
          src={url}
          alt={alt}
          className={customStyle?.size}
          style={customStyle?.custom}
          ref={node}
        />
        <div className="menu-container leo-flex-center-end leo-absolute">
          <button onClick={() => setInnerModal("change-entity")}>
            <img src={`${AWS_CDN_URL}/icons/PenSvg.svg`} alt="Edit" />
          </button>
          <button
            onClick={() =>
              props.setImageToDelete({
                ...props,
              })
            }
          >
            <img src={`${AWS_CDN_URL}/icons/BinSvg.svg`} alt="Delete" />
          </button>
        </div>
      </ImageContainer>
      {innerModal === "change-entity" && (
        <EditImageModal
          hide={() => setInnerModal(undefined)}
          ogProps={ogProps}
          setImageProps={(newProps) => {
            props.setNewImageProps({ ...props, newProps });
            setTimeout(function () {
              setUpdateStyle(Math.random());
            }, 10);
          }}
          nodeImage={node}
        />
      )}
    </>
  );
};

const ImageContainer = styled.div`
  position: relative;
  width: max-content;
  margin: auto;
  overflow: hidden;
  border: solid white 1px;
  transition: all 300ms;

  &.leo-image-center {
    margin: auto;
  }
  &.leo-image-left {
    margin-left: 0px;
  }
  &.leo-image-right {
    margin-right: 0px;
  }
  &.leo-image-float-right {
    float: right;
    margin-left: 10px;
  }
  &.leo-image-float-left {
    float: left;
    margin-right: 10px;
  }

  &:hover {
    border: solid #c4c4c4 1px;
    border-radius: 20px;

    .menu-container {
      bottom: 0;
    }
  }

  .menu-container {
    bottom: -40px;
    left: 0;
    width: 100%;
    padding: 5px;
    padding-right: 15px;
    background: white;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.66);
    transition: all 300ms;

    button {
      margin-left: 10px;
    }
  }
`;

const STImage = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 500px;
  width: auto;
  object-fit: contain;

  &.leo-full-size {
    max-width: 500px;
  }
  &.leo-med-size {
    width: 250px;
  }
  &.leo-small-size {
    width: 100px;
  }
`;

export default EditorCustomImage;
