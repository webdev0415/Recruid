import React, { useState, useEffect } from "react";
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
import { fetchSingleCall } from "helpersV2/calls";
import { fetchSingleMeeting } from "helpersV2/meetings";
import { fetchSingleTask } from "helpersV2/tasks";
import notify from "notifications";
import Spinner from "sharedComponents/Spinner";

const EXTRA_INFO = {
  created_call: true,
  updated_call: true,
  created_meeting: true,
  created_task: true,
  completed_task: true,
};

export const RegularActivity = ({ interaction, children, store }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [interactionData, setInteractionData] = useState(undefined);

  useEffect(() => {
    if (
      showDropdown &&
      !interactionData &&
      EXTRA_INFO[interaction.action_performed]
    ) {
      if (
        interaction.action_performed === "created_call" ||
        interaction.action_performed === "updated_call"
      ) {
        fetchSingleCall(store.session, interaction.extra_info.call_id).then(
          (res) => {
            if (!res.err) {
              setInteractionData(res);
            } else {
              notify("danger", "Unable to fetch call");
            }
          }
        );
      } else if (interaction.action_performed === "created_meeting") {
        fetchSingleMeeting(
          store.session,
          interaction.extra_info?.meeting_id
        ).then((res) => {
          if (!res.err) {
            setInteractionData(res);
          } else {
            notify("danger", "Unable to fetch call");
          }
        });
      } else if (
        interaction.action_performed === "created_task" ||
        interaction.action_performed === "completed_task"
      ) {
        fetchSingleTask(store.session, interaction.extra_info?.task_id).then(
          (res) => {
            if (!res.err) {
              setInteractionData(res);
            } else {
              notify("danger", "Unable to fetch task");
            }
          }
        );
      }
    }
  }, [showDropdown, interactionData, interaction]);

  return (
    <CustomActivityItem>
      <div className="leo-flex-center-between">
        <div className="leo-flex">
          <AvatarIcon
            name={
              interaction.action_performed !== "completed_task"
                ? interaction.created_by
                : interaction.extra_info.assigned_to.name
            }
            imgUrl={
              interaction.action_performed !== "completed_task"
                ? interaction.avatar
                : interaction.extra_info.assigned_to.avatar
            }
            size="50"
          />
          <ActivityDetails>
            {children}
            <ActivityDate>
              {spacetime(new Date(interaction.created_at)).format(
                "{time} {date} {month}, {year}"
              )}
            </ActivityDate>
          </ActivityDetails>
        </div>
        {EXTRA_INFO[interaction.action_performed] && (
          <ChevronButton onClick={() => setShowDropdown(!showDropdown)}>
            <svg width="8" height="5" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.414 0h5.172a1 1 0 01.707 1.707L4.707 4.293a1 1 0 01-1.414 0L.707 1.707A1 1 0 011.414 0z"
                fill="#9A9CA1"
                fill-role="evenodd"
              />
            </svg>
          </ChevronButton>
        )}
      </div>
      {showDropdown && (
        <ExtraContentWrapper>
          <>
            {(interaction.action_performed === "created_call" ||
              interaction.action_performed === "updated_call") && (
              <>
                {interactionData ? (
                  <CallActivity
                    interaction={interaction}
                    call={interactionData}
                  />
                ) : (
                  <Spinner />
                )}
              </>
            )}
            {interaction.action_performed === "created_meeting" && (
              <>
                {interactionData ? (
                  <MeetingActivity
                    interaction={interaction}
                    meet={interactionData}
                  />
                ) : (
                  <Spinner />
                )}
              </>
            )}
            {(interaction.action_performed === "created_task" ||
              interaction.action_performed === "completed_task") && (
              <>
                {interactionData ? (
                  <TaskActivity
                    interaction={interaction}
                    task={interactionData}
                  />
                ) : (
                  <Spinner />
                )}
              </>
            )}
          </>
        </ExtraContentWrapper>
      )}
    </CustomActivityItem>
  );
};

const CallActivity = ({ call }) => {
  const parsedDate = spacetime(new Date(call.date_actioned));

  return (
    <>
      <div className="content">
        <p>{call.description}</p>
      </div>
      <SelectsWrapper style={{ border: 0, marginBottom: 0, paddingBottom: 0 }}>
        <SelectBox>
          <label>Contacted</label>
          <span>{call.contacted.name}</span>
        </SelectBox>
        <SelectBox>
          <label>Outcome</label>
          <span>{call.outcome}</span>
        </SelectBox>
        <SelectBox>
          <label>Date</label>
          <span>{parsedDate.format("{numeric-uk}")}</span>
        </SelectBox>
        <SelectBox>
          <label>Time</label>
          <span>{parsedDate.format("{hour-24-pad}:{minute-pad}")}</span>
        </SelectBox>
      </SelectsWrapper>
    </>
  );
};
const MeetingActivity = ({ interaction, meet }) => {
  const parsedDate = spacetime(new Date(meet.start_time));
  return (
    <>
      <div className="content">
        {meet.title && <h5>{meet.title}</h5>}
        <p>{meet.description}</p>
      </div>
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
        <CategoryWrapper className="leo-flex">
          <span className="category-span">Organiser:</span>
          <span>{interaction?.created_by}</span>
        </CategoryWrapper>
        <CategoryWrapper className="leo-flex">
          <span className="category-span">Attendees:</span>
          {meet.attendees?.length > 0 &&
            meet.attendees.map((att, ix) => (
              <OverlayTrigger
                key={`top-${ix}`}
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-top`}>
                    <TooltipContainer className="leo-flex">
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
    </>
  );
};

const TaskActivity = ({ task }) => {
  const parsedDate = spacetime(new Date(task.due_datetime));

  return (
    <>
      <div className="content">
        <h5>{task.title}</h5>
        {task.body && <p>{task.body}</p>}
      </div>
      <SelectsWrapper style={{ border: 0, marginBottom: 0, paddingBottom: 0 }}>
        <SelectBox>
          <label>Type</label>
          <span>{task.task_type}</span>
        </SelectBox>
        <SelectBox>
          <label>Priority</label>
          <span>{task.priority}</span>
        </SelectBox>
        <SelectBox>
          <label>Assigned To</label>
          <span style={{ width: "max-content" }}>{task.assigned_to.name}</span>
        </SelectBox>
        <SelectBox>
          <label>Date</label>
          <span>{parsedDate.format("{numeric-uk}")}</span>
        </SelectBox>
        <SelectBox>
          <label>Time</label>
          <span>{parsedDate.format("{hour-24-pad}:{minute-pad}")}</span>
        </SelectBox>
      </SelectsWrapper>
    </>
  );
};

const CustomActivityItem = styled(ActivityItem)`
  display: block;
  padding: 15px;
`;

const ChevronButton = styled.button`
  margin-left: 50px;
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
  padding: 10px 5px;

  .text-container {
    margin-left: 15px;
  }
`;
