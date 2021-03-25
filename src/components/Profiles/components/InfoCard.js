import React, { useState, useEffect } from "react";
import styled from "styled-components";

import AvatarIcon from "sharedComponents/AvatarIcon";
import { AWS_CDN_URL } from "constants/api";

const InfoCard = ({
  header,
  subText,
  email,
  phone,
  light,
  avatar,
  editing,
  remove,
  removeId,
  deleteCard,
  setRedirectToProfile,
  type,
  company,
  id,
  onContactSelect,
  parentActive,
  removeButton,
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleContainerClick = (contactId) => () => {
    if (parentActive === undefined) {
      setIsActive(!isActive);
    }
    onContactSelect(contactId);
    return;
  };

  useEffect(() => {
    if (parentActive) {
      setIsActive(true);
    } else if (parentActive === false && isActive === true) {
      setIsActive(false);
    }
  }, [parentActive]);

  return (
    <CardWrapper className="leo-flex-center">
      <CardContainer
        className={`
          ${
            light ? "light" : ""
          } leo-flex-center-between leo-relative leo-width-full`}
        onClick={
          onContactSelect ? handleContainerClick(id) : setRedirectToProfile
        }
        style={setRedirectToProfile && { cursor: "pointer" }}
        borderColor={isActive ? "#2a3744" : "#eee"}
      >
        <div className="leo-flex-center">
          <div style={{ marginRight: 15 }}>
            <AvatarIcon name={header} imgUrl={avatar} size={40} />
          </div>
          <div>
            <h5>
              {header} {phone ? `- (${phone})` : ""}
            </h5>
            {type === "contact" && subText ? (
              <p>
                {subText} {company && <>at {company}</>}
              </p>
            ) : (
              <p>{subText}</p>
            )}
            {(email || phone) && <span>{email ? email : phone}</span>}
          </div>
        </div>
        {remove ? (
          ""
        ) : !editing ? (
          <AvatarIcon name={header} imgUrl={avatar} size={30} />
        ) : (
          <CancelButton onClick={deleteCard} className="leo-flex-center-center">
            <span></span>
          </CancelButton>
        )}
        {removeButton && (
          <RemoveButton onClick={removeButton}>
            <img src={`${AWS_CDN_URL}/icons/CancelIcon2.svg`} alt="" />
          </RemoveButton>
        )}
      </CardContainer>
      {remove && (
        <CancelButton
          onClick={() => remove(removeId)}
          className="remove leo-flex-center-center"
        >
          <span></span>
        </CancelButton>
      )}
    </CardWrapper>
  );
};

export default InfoCard;

const CardWrapper = styled.div`
  margin-bottom: 10px;

  &:hover {
    .remove {
      opacity: 1;
    }
  }
`;

const CardContainer = styled.div`
  background: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.05);
  padding: 15px 20px 15px 15px;

  &.light {
    border: 1px solid ${({ borderColor }) => borderColor};
    box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.02);
    font-weight: 400 !important;
  }

  h5 {
    font-size: 14px;
    font-weight: 500 !important;
    line-height: 1;
    margin-bottom: 0;
  }

  p {
    font-size: 12px;
    color: #74767b;
    line-height: 1;
    margin-bottom: 0;
    margin-top: 8px;
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
    margin-top: 8px;
  }
`;

const CancelButton = styled.button`
  background-color: #ff3159;
  border-radius: 50%;
  height: 30px;
  min-width: 30px;
  width: 30px;

  span {
    background: white;
    height: 2px;
    margin: 0;
    width: 10px;
  }

  &.remove {
    margin-left: 15px;
    opacity: 0;
    transform: 0.25s ease-in-out opacity;
  }
`;

const RemoveButton = styled.div`
  cursor: pointer;
  position: absolute;
  right: 5px;
  top: -2px;
`;
