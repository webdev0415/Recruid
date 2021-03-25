import React from "react";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";
const AvatarDiv = styled.div`
  background: #eeeeee;
  border-radius: ${(props) => (props.shape === "square" ? "4px" : "50%")};
  height: ${(props) => props.size}px;
  min-height: ${(props) => props.size}px;
  min-width: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
`;

const AvatarImgDiv = styled(AvatarDiv)`
  background-image: url(${(props) => props.imgUrl});
  background-size: cover;
  background-position: center;
`;

const AvatarNameDiv = styled(AvatarDiv)`
  color: #74767b;
  font-size: ${(props) =>
    props.size >= 200
      ? "62px"
      : props.size >= 100
      ? "40px"
      : props.size >= 50
      ? "20px"
      : props.size >= 30
      ? "13px"
      : props.size <= 20
      ? "10px"
      : "12px"};
  font-weight: 500;
  justify-content: center;
  object-fit: cover;
  text-transform: uppercase;
`;

const AvatarName = ({ name, size, shape, style }) => {
  const index = name.indexOf(" "),
    firstName = name.substr(0, index),
    lastName = name.substr(index + 1),
    initials = firstName.charAt(0) + lastName.charAt(0);

  return (
    <AvatarNameDiv
      shape={shape}
      size={size}
      style={style}
      className="leo-flex-center"
    >
      {initials}
    </AvatarNameDiv>
  );
};

const AvatarImg = ({ imgUrl, size, shape, style }) => (
  <AvatarImgDiv shape={shape} size={size} imgUrl={imgUrl} style={style} />
);

const MissingAvatar = ({ size, shape, style }) => (
  <AvatarImgDiv
    shape={shape}
    size={size}
    imgUrl={`${AWS_CDN_URL}/illustrations/MissingAvatar.png`}
    style={style}
  />
);

const AvatarIcon = ({ name, imgUrl, size, shape, style }) => {
  let pxSize =
    typeof size === "number"
      ? size
      : size === "extraSmall"
      ? 30
      : size === "small"
      ? 40
      : size === "medium"
      ? 50
      : size === "large"
      ? 100
      : size === "extraLarge"
      ? 200
      : 40;
  return imgUrl && imgUrl !== undefined && imgUrl !== null ? (
    <AvatarImg imgUrl={imgUrl} size={pxSize} shape={shape} style={style} />
  ) : name && name !== undefined && name !== null ? (
    <AvatarName name={name} size={pxSize} shape={shape} style={style} />
  ) : (
    <MissingAvatar size={pxSize} shape={shape} style={style} />
  );
};

export default AvatarIcon;
