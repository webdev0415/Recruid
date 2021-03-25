import React, { useState, useEffect } from "react";
import styled from "styled-components";
import spacetime from "spacetime";
import {
  DateSelect,
  TimeSelect,
  TaskTypeSelect,
  PrioritySelect,
  TeamMemberSelect,
} from "sharedComponents/ActionCreator/selectors";
import { BodyContainer } from "components/Profiles/components/ProfileComponents";
import { SelectsWrapper } from "sharedComponents/ActionCreator/SharedComponents";
import CheckedButton from "sharedComponents/CheckedButton";
import notify from "notifications";
import {
  fetchEditTask,
  fetchDeleteTasks,
  fetchToggleTasks,
} from "helpersV2/tasks";
import ActionItemMenu from "sharedComponents/ActionItemMenu";
// import EmptyTab from "components/Profiles/components/EmptyTab";
import ConfirmModalV2 from "modals/ConfirmModalV2";

import {
  ActivityItem,
  ActivityDate,
} from "components/Profiles/components/ProfileComponents.js";
// import {AWS_CDN_URL} from "constants/api";

const TasksTab = ({ tasks, setTasks, store, canEdit }) => {
  const [taskToDelete, setTaskToDelete] = useState(undefined);

  const deleteTaskMethod = () => {
    fetchDeleteTasks(store.session, [tasks[taskToDelete].id]).then((res) => {
      if (!res.err) {
        notify("info", "Task succesfully deleted");
        let tasksCopy = [...tasks];
        tasksCopy.splice(taskToDelete, 1);
        setTasks(tasksCopy);
        setTaskToDelete(undefined);
      } else {
        notify("danger", "Unable to delete task");
      }
    });
  };

  return (
    <>
      {/*}<EmptyTab
      data={tasks}
      title={"This profile has no tasks."}
      copy={"Create a task for them or something!"}
      image={<img src={<EmptyActivity />}
      action={""}
    >*/}
      <CustomBodyContainer>
        {tasks &&
          tasks.map((task, index) => (
            <TaskItem
              key={`task-wrapper-${index}`}
              task={task}
              tasks={tasks}
              setTasks={setTasks}
              store={store}
              ix={index}
              canEdit={canEdit}
              setTaskToDelete={setTaskToDelete}
            />
          ))}
      </CustomBodyContainer>
      {taskToDelete !== undefined && (
        <>
          <ConfirmModalV2
            id="confirm-delete-task"
            show={true}
            hide={() => setTaskToDelete(undefined)}
            header="Delete this task"
            text="Are you sure you want to delete this task?"
            actionText="Delete"
            actionFunction={deleteTaskMethod}
          />
        </>
      )}
      {/*}</EmptyTab>*/}
    </>
  );
};

export default TasksTab;

const TaskItem = ({
  task,
  ix,
  tasks,
  setTasks,
  store,
  canEdit,
  setTaskToDelete,
}) => {
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState(undefined);
  const ogDate = spacetime(new Date(task.due_datetime));
  const [task_type, set_task_type] = useState(undefined);
  const [priority, setPriority] = useState(undefined);
  const [team_member_id, set_team_member_id] = useState(undefined);
  const [completed, setCompleted] = useState(undefined);
  const [editing, setEditing] = useState(false);
  const [taskTitle, setTaskTitle] = useState(undefined);
  const [taskBody, setTaskBody] = useState(undefined);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (
      task_type ||
      priority ||
      team_member_id ||
      completed !== undefined ||
      selectedDate ||
      selectedTime
    ) {
      let date;
      if (selectedDate || selectedTime) {
        date = selectedDate
          ? selectedDate.clone()
          : spacetime(new Date(task.due_datetime));
        if (selectedTime) {
          let time = selectedTime.split(":");
          date = date.hour(Number(time[0])).minute(Number(time[1]));
        }
      }
      let newTask = { company_id: task.company_id };
      if (task_type) {
        newTask.task_type = task_type;
      }
      if (priority) {
        newTask.priority = priority;
      }
      if (completed) {
        newTask.completed = completed;
      }
      if (date) {
        newTask.due_datetime = date.format("{iso-utc}");
      }
      if (team_member_id) {
        newTask.team_member_id = team_member_id;
      }
      fetchEditTask(store.session, task.id, newTask).then((res) => {
        if (!res.err) {
          setSelectedDate(undefined);
          setSelectedTime(undefined);
          set_team_member_id(undefined);
          setCompleted(undefined);
          setPriority(undefined);
          set_task_type(undefined);
          notify("info", "Task succesfully edited");
          let tasksCopy = [...tasks];
          tasksCopy[ix] = { ...res };
          setTasks(tasksCopy);
        } else {
          notify("danger", res);
        }
      });
    }
  }, [
    task_type,
    priority,
    team_member_id,
    completed,
    selectedDate,
    selectedTime,
  ]);

  const toggleCompleted = () => {
    let tasksCopy = [...tasks];
    const bool = !task.completed;
    tasksCopy[ix].completed = bool;
    setTasks(tasksCopy);
    fetchToggleTasks(store.session, [task.id], bool).then((res) => {
      if (!res.err) {
        notify("info", "Status succesfully changed");
      } else {
        let tasksCopy = [...tasks];
        tasksCopy[ix].completed = !bool;
        setTasks(tasksCopy);
        notify("danger", "Unable to set status");
      }
    });
  };

  useEffect(() => {
    if (editing) {
      setTaskBody(task.body);
      setTaskTitle(task.title);
    } else {
      setTaskBody(undefined);
      setTaskTitle(undefined);
    }
  }, [editing]);

  const saveEdit = () => {
    let newTask = { company_id: task.company_id };
    if (taskTitle && taskTitle !== task.title) {
      newTask.title = taskTitle;
    }
    if (taskBody && taskBody !== task.body) {
      newTask.body = taskBody;
    }
    if (newTask.title || newTask.body) {
      fetchEditTask(store.session, task.id, newTask).then((res) => {
        if (!res.err) {
          setEditing(false);
          notify("info", "Task succesfully edited");
          let tasksCopy = [...tasks];
          tasksCopy[ix] = { ...res };
          setTasks(tasksCopy);
        } else {
          notify("danger", res);
        }
      });
    } else {
      setEditing(false);
    }
  };

  return (
    <TaskWrapper
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
    >
      <CustomActivityItem>
        <CallTop>
          <CheckedButton
            checked={completed !== undefined ? completed : task.completed}
            onClick={canEdit ? toggleCompleted : () => {}}
          />
          <div className="text-container">
            {!editing ? (
              <h5>{task.title}</h5>
            ) : (
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            )}
          </div>
          <ActivityDate className="date-container">
            {spacetime(new Date(task.created_at)).format(
              "{time} {date} {month}, {year}"
            )}
          </ActivityDate>
        </CallTop>
        <CallMiddle>
          {!editing ? (
            <p>{task.body}</p>
          ) : (
            <textarea
              value={taskBody}
              onChange={(e) => setTaskBody(e.target.value)}
              resize="none"
            />
          )}
        </CallMiddle>
        <CallBottom>
          <SelectsWrapper style={{ border: 0, margin: 0, padding: 0 }}>
            <TaskTypeSelect
              type={task.task_type || task_type}
              setType={set_task_type}
              canEdit={canEdit}
            />
            <PrioritySelect
              priority={task.priority || priority}
              setPriority={setPriority}
              canEdit={canEdit}
            />
            <TeamMemberSelect
              teamMembers={store.teamMembers}
              setMemberId={set_team_member_id}
              memberId={
                team_member_id ||
                task.assigned_to?.team_member_id ||
                task.team_member_id
              }
              canEdit={canEdit}
            />
            <DateSelect
              selectedDate={selectedDate || ogDate || spacetime.now()}
              setSelectedDate={setSelectedDate}
              canEdit={canEdit}
            />
            <TimeSelect
              selectedTime={
                selectedTime
                  ? selectedTime
                  : ogDate
                  ? ogDate.format("{hour-24-pad}:{minute-pad}")
                  : "00:00"
              }
              setSelectedTime={setSelectedTime}
              canEdit={canEdit}
            />
          </SelectsWrapper>
        </CallBottom>
      </CustomActivityItem>
      {canEdit && over && (
        <ActionItemMenu
          deleteAction={() => setTaskToDelete(ix)}
          editing={editing}
          setEditing={setEditing}
          saveEdit={saveEdit}
          cancelEdit={() => setEditing(false)}
        />
      )}
    </TaskWrapper>
  );
};

const CustomBodyContainer = styled(BodyContainer)`
  display: block;
  max-width: 550px;
`;

const CustomActivityItem = styled(ActivityItem)`
  flex-direction: column;
  padding: 15px;
  margin-bottom: 5px;
`;

const TaskWrapper = styled.div`
  // align-items: center;
  // display: flex;
  // justify-content: space-between;
  margin-bottom: 15px;

  &:hover {
    .delete-button {
      opacity: 1;
    }
  }

  .delete-button {
    align-items: center;
    background: white;
    border-radius: 50%;
    height: 50px;
    display: flex;
    justify-content: center;
    opacity: 0;
    transition: all ease-in-out 0.25s;
    width: 50px;

    &:hover {
      svg {
        opacity: 1;
      }
    }
    svg {
      opacity: 0.5;
      transition: all ease-in-out 0.25s;

      path {
        fill: #74767b;
      }
    }
  }
`;

const CallTop = styled.div`
  // border-bottom: solid #eeeeee 1px;
  display: flex;
  position: relative;
  // margin-bottom: 15px;
  padding-bottom: 15px;

  h5 {
    font-size: 14px;
    font-weight: 500;
  }

  p {
    font-size: 14px;
    line-height: 22px;
    white-space: pre-wrap;
  }

  .text-container {
    margin-left: 10px;

    h5 {
      max-width: 245px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 250px;
    }

    p {
      max-width: 400px;
      overflow-wrap: break-word;
    }

    input {
      border: none;
      border-bottom: solid #eee 1px;
      margin-bottom: 5px;
    }
  }

  .date-container {
    position: absolute;
    right: 0;
    top: 0;
  }
`;

const CallMiddle = styled.div`
  border-bottom: solid #eeeeee 1px;
  display: flex;
  position: relative;
  margin-bottom: 15px;
  padding-bottom: 15px;

  p {
    font-size: 14px;
    line-height: 22px;
    white-space: pre-wrap;
  }

  textarea {
    border: solid #eee 1px;
    width: 100%;
    border-radius: 5px;
    padding: 10px;
    resize: none;
  }
`;

const CallBottom = styled.div`
  // width: 350px;
`;
