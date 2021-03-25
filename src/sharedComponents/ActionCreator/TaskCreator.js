import React, { useState } from "react";
import notify from "notifications";
import spacetime from "spacetime";
import styled from "styled-components";
import {
  SelectsWrapper,
  TitleInput,
} from "sharedComponents/ActionCreator/SharedComponents";
import {
  DateSelect,
  TimeSelect,
  TaskTypeSelect,
  PrioritySelect,
  TeamMemberSelect,
} from "sharedComponents/ActionCreator/selectors";
import ActionCreatorFooter from "sharedComponents/ActionCreator/ActionCreatorFooter";
import { fetchCreateTask } from "helpersV2/tasks";

const TaskCreator = ({ setActionType, store, source, sourceId, pushTask }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [task_type, set_task_type] = useState("Call");
  const [priority, setPriority] = useState("High");
  const [team_member_id, set_team_member_id] = useState(
    store.role.team_member.team_member_id
  );
  const [selectedDate, setSelectedDate] = useState(spacetime.now());
  const [selectedTime, setSelectedTime] = useState(
    spacetime.now().format("{hour-24-pad}:{minute-pad}")
  );
  const [sendingRequest, setSendingRequest] = useState(false);

  const createTask = () => {
    if (title === "") {
      notify("danger", "Task needs a title");
      return;
    }
    setSendingRequest(true);
    let date = selectedDate.clone();
    let time = selectedTime.split(":");
    date = date.hour(Number(time[0])).minute(Number(time[1]));

    let sendBody = {
      title,
      body,
      task_type,
      priority,
      team_member_id,
      due_datetime: date.format("{iso-utc}"),
      company_id: store.company.id,
      professional_id: store.session.id,
      source,
      source_id: Number(sourceId),
    };
    fetchCreateTask(store.session, sendBody)
      .then((res) => {
        if (!res.err) {
          notify("info", "Task succesfully created");
          if (pushTask) {
            pushTask(res);
          }
          setTitle("");
          setBody("");
          set_task_type("Call");
          setPriority("High");
          set_team_member_id(store.role.team_member.team_member_id);
          setSelectedDate(spacetime.now());
          setSelectedTime(spacetime.now().format("{hour-24-pad}:{minute-pad}"));
        } else {
          notify("danger", res);
        }
      })
      .finally(() => setSendingRequest(false));
  };

  return (
    <div>
      <TaskContainer>
        <TitleInput
          placeholder="Enter your task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength="100"
        />
        <textarea
          className="form-control"
          rows="3"
          name="call-text-box"
          placeholder="Notes..."
          onChange={(e) => setBody(e.target.value)}
          value={body}
        />
        <CustomSelectsWrapper>
          <TaskTypeSelect
            type={task_type}
            setType={set_task_type}
            canEdit={true}
          />
          <PrioritySelect
            priority={priority}
            setPriority={setPriority}
            canEdit={true}
          />
          <TeamMemberSelect
            teamMembers={store.teamMembers}
            setMemberId={set_team_member_id}
            memberId={team_member_id}
            canEdit={true}
          />
          <DateSelect
            label="Due Date"
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            canEdit={true}
          />
          <TimeSelect
            label="Due Time"
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            canEdit={true}
          />
        </CustomSelectsWrapper>
      </TaskContainer>
      <ActionCreatorFooter
        setActionType={setActionType}
        actionName="Create"
        confirmAction={createTask}
        sendingRequest={sendingRequest}
      />
    </div>
  );
};

export default TaskCreator;

const TaskContainer = styled.div`
  background: #fafafa;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 15px;

  textarea {
    background-color: transparent;
    border: 0;
    font-size: 14px;
    margin: 0 !important;
    padding: 0;
    width: 100%;

    &:focus {
      background: transparent !important;
      border-color: transparent !important;
    }
  }
`;

const CustomSelectsWrapper = styled(SelectsWrapper)`
  margin-bottom: 0;
  border-bottom: none;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  width: max-content;
`;
