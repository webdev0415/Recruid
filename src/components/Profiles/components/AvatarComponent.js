import React, { useState } from "react";
import styled from "styled-components";
import AvatarIcon from "sharedComponents/AvatarIcon";
import FileUpload from "sharedComponents/FileUpload";
import notify from "notifications";
import { AWS_CDN_URL } from "constants/api";

const AVATAR_SIZE = 40;

const AvatarComponent = ({ name, avatar, updateAvatar }) => {
  const [overContainer, setOverContainer] = useState(undefined);

  const handleTooLarge = (file, maxSize) => {
    const maxSizeInMBs = maxSize / (1024 * 1024);
    notify(
      "danger",
      `${file.name} is larger than the maximum of ${maxSizeInMBs} MB`
    );
  };

  const handleFileInputChange = (e) => {
    let image = e.target.files[0];
    let imageBase64 = "";
    let imageName = "";
    let fileReader = new FileReader();

    fileReader.addEventListener("load", (fileReaderEvent) => {
      imageName = image.name;
      imageBase64 = fileReaderEvent.target.result;

      updateAvatar({
        avatar: imageBase64,
        avatar_name: imageName,
        avatar_data: imageBase64,
      });
    });
    fileReader.readAsDataURL(image);
  };

  return (
    <>
      <Wrapper>
        <Container
          onMouseEnter={() => setOverContainer(true)}
          onMouseLeave={() => setOverContainer(false)}
        >
          <AvatarIcon name={name} imgUrl={avatar} size={AVATAR_SIZE} />
          <HoverOverlay
            className={`${
              overContainer ? "over" : ""
            } leo-flex-center-center leo-absolute leo-pointer`}
          >
            <img src={`${AWS_CDN_URL}/icons/EditPen.svg`} alt="Edit" />
          </HoverOverlay>
          {overContainer && (
            <DropDownContainer>
              <ul>
                <li>
                  <label htmlFor="settings-avatar__button">Upload Image</label>
                </li>
                <li>
                  <button onClick={() => updateAvatar()}>Remove Image</button>
                </li>
              </ul>
            </DropDownContainer>
          )}
        </Container>
      </Wrapper>
      <FileUpload
        id="settings-avatar__button"
        className="settings-avatar__input"
        onChange={handleFileInputChange}
        onTooLarge={handleTooLarge}
        name="avatar"
        style={{ display: "none" }}
      />
    </>
  );
};

const Wrapper = styled.div`
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;
  position: relative;
`;

const Container = styled.div`
  position: absolute;
  width: 40px;
  height: 60px;
`;

const HoverOverlay = styled.div`
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;
  border-radius: 50%;
  background: #0000001a;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 200ms;

  &.over {
    opacity: 1;
  }
`;

const DropDownContainer = styled.div`
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 10px;
  position: absolute;
  top: 40px;
  width: 150px;
  text-align: center;
  z-index: 1;
  left: -5px;

  &::before {
    content: "";
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid white;
    top: -10px;
    left: 15px;
    position: absolute;
  }
  li {
    padding: 5px;
  }
  label {
    cursor: pointer;
  }
`;

export default AvatarComponent;
