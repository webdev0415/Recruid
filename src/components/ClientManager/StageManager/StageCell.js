import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "routes";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useDrag } from "react-dnd";
import spacetime from "spacetime";
import NumberFormat from "react-number-format";
import styled from "styled-components";

import AvatarIcon from "sharedComponents/AvatarIcon";
import DealDropSeparator from "components/ClientManager/StageManager/DealDropSeparator";

const StageCell = ({
  stageIndex,
  index,
  deal,
  onDropDeal,
  overStage,
  company,
  permission,
  store,
}) => {
  const [{ dealDroppable, isDragging }, drag] = useDrag({
    item: {
      type: "deal",
      deal_id: deal.id,
      sourceIndex: index,
      dealIndex: deal.index,
      sourceStageIndex: stageIndex,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      dealDroppable: monitor.getItem(),
    }),
  });
  const date = new spacetime(new Date(deal.close_date));
  const [addedToDeal, setAddedToDeal] = useState(false);

  useEffect(() => {
    if (deal && store.role) {
      setAddedToDeal(
        store.role.role_permissions.owner ||
          store.role.role_permissions.admin ||
          deal.owner?.id === store.role.team_member.team_member_id ||
          deal.team_member_ids?.indexOf(
            store.role?.team_member.team_member_id
          ) !== -1
      );
    }
  }, [deal, store.role]);

  return (
    <>
      {addedToDeal && (
        <>
          {!isDragging &&
          dealDroppable &&
          (dealDroppable.sourceStageIndex !== stageIndex ||
            dealDroppable.dealIndex !== deal.index) ? (
            <DealDropSeparator
              onDropDeal={(dealDroppable) =>
                onDropDeal(dealDroppable, index, stageIndex, deal.index)
              }
              overStage={overStage}
            />
          ) : isDragging ? (
            <DealDropSeparator
              onDropDeal={() => {}}
              overStage={overStage}
              selfDragging={true}
            />
          ) : (
            <div style={{ height: "10px" }}></div>
          )}
        </>
      )}
      <StageCellST
        ref={permission.edit ? drag : null}
        className={`${isDragging ? "dragging" : ""} ${
          !addedToDeal ? "no-show" : ""
        } leo-relative`}
      >
        <StageCellName
          to={ROUTES.DealProfile.url(company.mention_tag, deal.id)}
        >
          {deal.name} {deal.company && `- ${deal.company.name}`}
        </StageCellName>
        <StageCellValue>
          Deal Value:{" "}
          <NumberFormat
            value={Math.floor(deal.value)}
            displayType={"text"}
            thousandSeparator={true}
            prefix={company.currency?.currency_name}
            renderText={(value) => <>{value}</>}
          />
        </StageCellValue>
        {/*!overStage && !isDragging && (
          <>
            <StageCellUpdate>
              Close date: {spacetime(date).format("{date} {month}, {year}")}
            </StageCellUpdate>
            {deal.participants && (
              <IconsWrapper className="leo-flex">
                {deal.participants.map((participant, index) => (
                  <div
                    className="icon-holder"
                    key={`participant-${index}-${deal.name}`}
                  >
                    <AvatarIcon
                      name={participant.name}
                      imgUrl={participant.avatar_url}
                      size={30}
                    />
                  </div>
                ))}
              </IconsWrapper>
            )}
          </>
        )*/}
        <StageCellUpdate>
          Close date: {spacetime(date).format("{date} {month}, {year}")}
        </StageCellUpdate>
        <IconsWrapper className="leo-flex">
          {deal.company && (
            <OverlayTrigger
              key={`top-0`}
              placement={"top"}
              overlay={
                <Tooltip id={`tooltip-top`}>
                  <strong>{deal.company.name}</strong>
                </Tooltip>
              }
            >
              <div
                className="icon-holder"
                key={`participant-${index}-${deal.name}`}
              >
                <AvatarIcon
                  name={deal.company.name}
                  imgUrl={deal.company.avatar}
                  size={30}
                />
              </div>
            </OverlayTrigger>
          )}
          {deal.contacts &&
            deal.contacts.map((participant, index) => (
              <OverlayTrigger
                key={`top-${index}`}
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-top`}>
                    <strong>{participant.name}</strong>
                  </Tooltip>
                }
              >
                <div
                  className="icon-holder"
                  key={`participant-${index}-${deal.name}`}
                >
                  <AvatarIcon
                    name={participant.name}
                    imgUrl={participant.avatar}
                    size={30}
                  />
                </div>
              </OverlayTrigger>
            ))}
        </IconsWrapper>
      </StageCellST>
    </>
  );
};

export default StageCell;

const StageCellST = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  cursor: grab;
  padding: 12px 15px 15px;

  &.no-show {
    display: none !important;
  }

  &.dragging {
    opacity: 0;
    height: 0px;
    overflow: hidden;
  }

  &.rejected {
    background: #f8f8f8;

    .av-cont {
      background: #f8f8f8 !important;
    }
  }

  p {
    line-height: 1;
  }

  span {
    color: #74767b;
    font-size: 13px;
  }
`;

const StageCellName = styled(Link)`
  color: #000000;
  display: block;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 3px;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 220px;
`;

const StageCellValue = styled.p`
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const StageCellUpdate = styled.p`
  color: #74767b;
  font-size: 12px;
  margin: 0;
`;

const IconsWrapper = styled.div`
  margin-top: 10px;
  padding-left: 15px;

  .icon-holder {
    background: white;
    margin-left: -15px;
    padding: 4px;
    border-radius: 50%;
  }
`;
