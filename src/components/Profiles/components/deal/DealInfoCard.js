import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";
import spacetime from "spacetime";
import styled from "styled-components";

import AvatarIcon from "sharedComponents/AvatarIcon";

const DealInfoCard = ({
  deal,
  editing,
  deleteCard,
  setRedirectToProfile,
  onDealSelect,
  remove,
  removeId,
  light,
  company,
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleContainerClick = () => {
    if (onDealSelect) {
      setIsActive(!isActive);
      onDealSelect(deal.id);
    } else if (setRedirectToProfile) {
      setRedirectToProfile();
    }
  };

  return (
    <CardWrapper className="leo-flex-center">
      <CardContainer
        onClick={handleContainerClick}
        style={{ cursor: "pointer" }}
        className={`${light ? "light" : ""} leo-flex-center-between`}
        borderColor={isActive ? "#2a3744" : "#eee"}
      >
        <div style={{ width: "100%" }}>
          <h5>{deal.name}</h5>
          {deal.value && (
            <p className="subtext">
              Deal Value:{" "}
              <NumberFormat
                value={deal.value}
                displayType={"text"}
                thousandSeparator={true}
                prefix={company.currency?.currency_name}
                renderText={(value) => <>{value}</>}
              />
            </p>
          )}
          <span>
            Close Date:{" "}
            {spacetime(new Date(deal.close_date)).format(
              "{date} {month}, {year}"
            )}
          </span>
          <StageIndicator
            active={deal.pipeline?.current_stage}
            total={deal.pipeline?.count}
          />
        </div>
        {!editing ? (
          <>
            {deal.company && (
              <AvatarIcon
                name={deal.company?.name}
                imgUrl={deal.company?.avatar}
                size={30}
              />
            )}
          </>
        ) : (
          <CancelButton onClick={deleteCard} className="leo-flex-center-center">
            <span></span>
          </CancelButton>
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

const StageIndicator = ({ active, total }) => {
  const [Rows, setRows] = useState({ Render: () => null });
  useEffect(() => {
    if (active || active === 0) {
      let arr = [];
      for (let i = 0; i < total; i++) {
        arr.push(
          <div
            key={`stage-indicator-${i}`}
            className={active > i ? "active" : ""}
          ></div>
        );
      }
      setRows({ Render: () => <>{arr}</> });
    }
  }, [active, total]);

  return (
    <StageIndicatorST className="leo-flex">
      <Rows.Render />
    </StageIndicatorST>
  );
};

export default DealInfoCard;

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
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
  width: 100%;

  &:hover {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  }

  &.light {
    border: 1px solid ${({ borderColor }) => borderColor};
    box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.02);
    font-weight: 400 !important;

    &:hover {
      box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.05);
    }
  }

  h5 {
    font-size: 14px;
    font-weight: 500 !important;
    line-height: 1;
    margin-bottom: 8px;
  }

  .subtext {
    font-size: 12px;
    line-height: 1;
    margin-bottom: 8px;
  }

  span {
    color: #74767b;
    font-size: 12px;
    line-height: 1;
    margin-bottom: 5px;
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

const StageIndicatorST = styled.div`
  margin-top: 10px;

  div {
    height: 2px;
    background: #d8d8d8;
    margin-right: 2px;
    max-width: 30px;
    width: 100%;

    &.active {
      background: #00caa5;
    }
  }
`;
