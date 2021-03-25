import React, { useState, useEffect } from "react";
import styled from "styled-components";
import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
  ModalFooter,
} from "modals/UniversalModal/UniversalModal";
import spacetime from "spacetime";
import notify from "notifications";
import { ROUTES } from "routes";

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
import { fetchTeamMembers } from "helpersV2/company";
import { fetchEditTask, fetchCreateTask } from "helpersV2/tasks";

const TaskModal = ({
  show,
  hide,
  selectedTask,
  store,
  triggerRefresh,
  replaceTask,
  companiesMembers,
  setCompaniesMembers,
  mentionTags,
  match,
}) => {
  const [task, setTask] = useState({
    title: "",
    body: "",
    task_type: "Call",
    priority: "High",
    team_member_id: undefined,
    company_id: undefined,
  });
  const [selectedDate, setSelectedDate] = useState(spacetime.now());
  const [selectedTime, setSelectedTime] = useState(
    spacetime.now().format("{hour-24-pad}:{minute-pad}")
  );

  useEffect(() => {
    if (selectedTask) {
      setTask(selectedTask);
      setSelectedDate(
        spacetime(
          selectedTask.due_datetime
            ? new Date(selectedTask.due_datetime)
            : spacetime.now()
        )
      );
      setSelectedTime(
        spacetime(new Date(selectedTask.due_datetime)).format(
          "{hour-24-pad}:{minute-pad}"
        )
      );
    }
  }, [selectedTask]);

  useEffect(() => {
    if (task.company_id && !companiesMembers[task.company_id]) {
      fetchTeamMembers(store.session, task.company_id).then((res) => {
        if (!res.err) {
          setCompaniesMembers({
            ...companiesMembers,
            [task.company_id]: res,
          });
        }
      });
    }
     
  }, [task.company_id]);

  useEffect(() => {
    //choose a company to associate the task with
    if (match.params.companyMentionTag && store.company) {
      setTask((taskCopy) => {
        return { ...taskCopy, company_id: store.company.id };
      });
    } else if (store.allMyCompanies.length === 1) {
      setTask((taskCopy) => {
        return { ...taskCopy, company_id: store.allMyCompanies[0].id };
      });
    } else if (store.allMyCompanies.length > 0 && store.company) {
      setTask((taskCopy) => {
        return { ...taskCopy, company_id: store.company.id };
      });
    } else if (store.allMyCompanies.length > 0) {
      setTask((taskCopy) => {
        return { ...taskCopy, company_id: store.allMyCompanies[0].id };
      });
    }
  }, [store.company, match.params.companyMentionTag, store.allMyCompanies]);

  useEffect(() => {
    if (store.role) {
      setTask((taskCopy) => {
        return {
          ...taskCopy,
          team_member_id: store.role.team_member.team_member_id,
        };
      });
    }
  }, [store.role]);

  const editTask = () => {
    let taskCopy = { ...task };
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
    if (date) {
      taskCopy.due_datetime = date.format("{iso-utc}");
    }
    fetchEditTask(store.session, task.id, taskCopy).then((res) => {
      if (!res.err) {
        notify("info", "Task succesfully edited");
        if (replaceTask) {
          replaceTask(res);
        }
        hide();
      } else {
        notify("danger", res);
      }
    });
  };

  const createTask = () => {
    if (task.title === "") {
      notify("danger", "Task must have a title");
      return;
    }
    let date = selectedDate.clone();
    let time = selectedTime.split(":");
    date = date.hour(Number(time[0])).minute(Number(time[1]));

    let sendBody = {
      ...task,
      due_datetime: date.format("{iso-utc}"),
      professional_id: store.session.id,
    };
    //choose a team member or return
    if (
      task.team_member_id &&
      task.company_id &&
      companiesMembers[task.company_id]
    ) {
      let memberMatch;
      companiesMembers[task.company_id].map((member) =>
        member.professional_id === store.session.id
          ? (memberMatch = member.team_member_id)
          : null
      );
      if (memberMatch) {
        sendBody.team_member_id = task.team_member_id || memberMatch;
      } else {
        return notify("danger", "Please select a team member");
      }
    } else {
      return notify("danger", "Please select a team member");
    }
    fetchCreateTask(store.session, sendBody).then((res) => {
      if (!res.err) {
        notify("info", "Task succesfully created");
        if (triggerRefresh) {
          triggerRefresh();
        }
        hide();
      } else {
        notify("danger", res);
      }
    });
  };

  return (
    <UniversalModal
      show={show}
      hide={hide}
      id={"task-modal"}
      width={600}
      name={task.source?.name || store.user.name}
      userAvatar={task.source?.avatar || store.user.avatar_url}
      subTitle={""}
      link={
        task.source
          ? ROUTES.ClientManager.url(
              mentionTags[task.company_id],
              crmTabs[(task.source.type, task.source.id)]
            )
          : undefined
      }
      withHeader={true}
    >
      <ModalHeaderClassic
        title={selectedTask ? "Edit Task" : "Create Task"}
        closeModal={hide}
      />
      <ModalBody>
        <div style={{ padding: "30px" }}>
          {!match.params.companyMentionTag &&
            !selectedTask &&
            store.allMyCompanies &&
            store.allMyCompanies.length > 1 && (
              <select
                className="form-control"
                onChange={(e) =>
                  setTask({ ...task, company_id: Number(e.target.value) })
                }
                placeholder="Company"
                value={task.company_id}
                style={{ marginBottom: "20px" }}
              >
                {store.allMyCompanies.map((company, index) => (
                  <option value={company.id} key={`company-option-${index}`}>
                    {company.name}
                  </option>
                ))}
              </select>
            )}
          <TaskContainer>
            <TitleInput
              placeholder="Enter your task..."
              value={task.title || ""}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
            />
            <textarea
              className="form-control"
              rows="3"
              name="call-text-box"
              placeholder="Notes..."
              onChange={(e) => setTask({ ...task, body: e.target.value })}
              value={task.body || ""}
            />
            <CustomSelectsWrapper>
              <TaskTypeSelect
                type={task.task_type}
                setType={(task_type) => setTask({ ...task, task_type })}
                canEdit={true}
              />
              <PrioritySelect
                priority={task.priority}
                setPriority={(priority) => setTask({ ...task, priority })}
                canEdit={true}
              />
              {task.company_id && companiesMembers[task.company_id] && (
                <TeamMemberSelect
                  teamMembers={companiesMembers[task.company_id]}
                  setMemberId={(team_member_id) =>
                    setTask({ ...task, team_member_id })
                  }
                  memberId={task.team_member_id}
                  canEdit={true}
                />
              )}
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
        </div>
      </ModalBody>
      <ModalFooter hide={hide}>
        <button
          style={{ width: "auto" }}
          type="button"
          className="button button--default button--blue-dark button--full"
          onClick={() => {
            if (selectedTask) {
              editTask();
            } else {
              createTask();
            }
          }}
        >
          Confirm
        </button>
      </ModalFooter>
    </UniversalModal>
  );
};

export default TaskModal;

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
`;

const crmTabs = {
  deal: "deals",
  contact: "contacts",
  client: "companies",
};
