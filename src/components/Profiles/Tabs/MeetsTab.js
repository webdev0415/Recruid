import React from "react";
import spacetime from "spacetime";
import styled from "styled-components";
import AvatarIcon from "sharedComponents/AvatarIcon";
import {
  ActivityItem,
  ActivityDetails,
  ActivityDate,
} from "components/Profiles/components/ProfileComponents.js";
import {
  SelectsWrapper,
  SelectBox,
} from "sharedComponents/ActionCreator/SharedComponents";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const MeetsTab = ({ meetings }) => {
  return (
    <>
      {meetings &&
        meetings.map((meet, index) => (
          <MeetingActivity key={index} meet={meet} />
        ))}
    </>
  );
};

const MeetingActivity = ({ meet }) => {
  const parsedDate = spacetime(new Date(meet.start_time));
  return (
    <CustomActivityItem sty>
      <Header>
        <div className="leo-flex">
          <AvatarIcon
            name={meet.created_by_name}
            imgUrl={meet.created_by_avatar}
            size="50"
          />
          <ActivityDetails>
            <div className="content">
              {meet.title && <h5>{meet.title}</h5>}
              <p>{meet.description}</p>
            </div>
            <ActivityDate style={{ right: "10px" }} className="leo-absolute">
              {spacetime(new Date(meet.created_at)).format(
                "{time} {date} {month}, {year}"
              )}
            </ActivityDate>
          </ActivityDetails>
        </div>
      </Header>
      <SelectsWrapper style={{ marginBottom: 15, paddingBottom: 15 }}>
        <SelectBox>
          <label>Attendees</label>
          <span>{meet.attendees.length} Attendees</span>
        </SelectBox>
        <SelectBox>
          <label>Date</label>
          <span>{parsedDate.format("{numeric-uk}")}</span>
        </SelectBox>
        <SelectBox>
          <label>Time</label>
          <span>{parsedDate.format("{hour-24-pad}:{minute-pad}")}</span>
        </SelectBox>
        <SelectBox>
          <label>Duration</label>
          <span>{meet.duration / 60} minutes</span>
        </SelectBox>
      </SelectsWrapper>
      <ExtraContentWrapper>
        <CategoryWrapper>
          <span className="category-span">Organiser:</span>
          <span>{meet?.created_by_name}</span>
        </CategoryWrapper>
        <CategoryWrapper>
          <span className="category-span">Attendees:</span>
          {meet.attendees?.length > 0 &&
            meet.attendees.map((att, ix) => (
              <OverlayTrigger
                key={`top-${ix}`}
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-top`}>
                    <TooltipContainer>
                      <AvatarIcon
                        name={att.name}
                        imgUrl={att.avatar}
                        size={30}
                      />
                      <div className="text-container">
                        <span>{att.name}</span>
                        <span>{att.email}</span>
                      </div>
                    </TooltipContainer>
                  </Tooltip>
                }
              >
                <span className="category-name">
                  {`${att.name}${ix !== meet.attendees.length - 1 ? "," : ""}`}
                </span>
              </OverlayTrigger>
            ))}
        </CategoryWrapper>
      </ExtraContentWrapper>
    </CustomActivityItem>
  );
};

export default MeetsTab;

const CustomActivityItem = styled(ActivityItem)`
  display: block;
  padding: 15px;
`;

const Header = styled.div`
  position: relative;
  margin-bottom: 10px;
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const ExtraContentWrapper = styled.div`
  .content {
    border-top: 1px solid #eee;
    margin-top: 15px;
    padding-top: 15px;

    h5 {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 5px;
    }

    p {
      font-size: 12px;
      line-height: 20px;
      margin: 0;
      margin-bottom: 15px;
    }
  }
`;

const CategoryWrapper = styled.div`
  display: flex;
  font-size: 14px;
  // margin: 10px 0px;

  &:not(:last-child) {
    margin-bottom: 5px;
  }

  span {
    margin-right: 5px;
  }

  .category-span {
    color: #74767b;
  }

  .category-name {
    cursor: pointer;
  }
`;

const TooltipContainer = styled.div`
  display: flex;
  padding: 10px 5px;

  .text-container {
    margin-left: 15px;
  }
`;
