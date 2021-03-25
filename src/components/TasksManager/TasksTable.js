import React, { useState, useEffect } from "react";
import { ROUTES } from "routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import spacetime from "spacetime";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  ExtensionMenu,
  ExtensionMenuOption,
} from "sharedComponents/ExtensionMenu";
import CheckedButton from "sharedComponents/CheckedButton";
import { PriorityIndicator } from "sharedComponents/ActionCreator/SharedComponents";
import AvatarIcon from "sharedComponents/AvatarIcon";
// import { fetchCreateTask } from "helpersV2/tasks";

import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";

import EmptyTab from "components/Profiles/components/EmptyTab";
import Marquee from "sharedComponents/Marquee";
import { EmptyActivity } from "assets/svg/EmptyImages";
const TasksTable = ({
  tasks,
  setTasks,
  openModal,
  setSelectedTask,
  setSelectedTaskIx,
  toggleCompleted,
  store,
  mentionTags,
  activeTab,
  selectedTotal,
  setSelectedTotal,
  permission,
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const [showBodyIndex, setShowBodyIndex] = useState(undefined);

  const selectTask = (index) => {
    let newTasks = [...tasks];
    newTasks[index].selected = newTasks[index].selected ? false : true;

    setTasks(newTasks);
  };

  useEffect(() => {
    if (tasks) {
      let newTasks = [...tasks];
      newTasks = newTasks.map((task) => {
        task.selected = selectAll;
        return task;
      });
      setTasks(newTasks);
    }
  }, [selectAll]);

  useEffect(() => {
    if (tasks) {
      setSelectedTotal(tasks.filter((task) => task.selected).length);
    }
  }, [tasks]);

  return (
    <EmptyTab
      data={tasks}
      title={"Create a task"}
      copy={
        "Create tasks, then assign them to team members, companies, contacts and deals."
      }
      image={<EmptyActivity />}
      action={""}
      marginTop={30}
    >
      <div className={styles.container}>
        <div className="table-responsive">
          <table className="table table-borderless">
            <thead>
              <tr>
                {permission.edit && (
                  <th scope="col" className={sharedStyles.tableItemCheckBox}>
                    <button
                      className={styles.professionalCheckbox}
                      style={{
                        background:
                          selectedTotal === tasks?.length ? "#60CCA7" : "none",
                      }}
                      onClick={() => setSelectAll(!selectAll)}
                    >
                      {selectedTotal === tasks?.length && (
                        <span className={styles.professionalCheckboxActive} />
                      )}
                    </button>
                  </th>
                )}
                <th scope="col" className={sharedStyles.tableHeader}>
                  Status
                </th>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Task
                </th>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Type
                </th>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Priority
                </th>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Associated
                </th>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Due
                </th>
                {permission.edit && (
                  <th scope="col" className={sharedStyles.tableHeader} />
                )}
              </tr>
            </thead>
            <tbody>
              {tasks &&
                tasks.map((task, index) => {
                  return (
                    <React.Fragment key={`task-item-${index}`}>
                      <tr key={`company_${index}`} className="table-row-hover">
                        {permission.edit && (
                          <td className={sharedStyles.tableItem}>
                            <button
                              className={styles.professionalCheckbox}
                              style={{
                                background: task.selected ? "#60CCA7" : "none",
                              }}
                              onClick={() => selectTask(index)}
                            >
                              {task.selected && (
                                <span
                                  className={styles.professionalCheckboxActive}
                                />
                              )}
                            </button>
                          </td>
                        )}
                        <td
                          className={sharedStyles.tableItem}
                          style={{ width: 64 }}
                        >
                          <CheckedButton
                            checked={task.completed}
                            onClick={
                              permission.edit
                                ? () => toggleCompleted(task, index)
                                : () => {}
                            }
                          />
                        </td>
                        <th scope="row" className={sharedStyles.tableItemFirst}>
                          <button
                            className={styles.name + " leo-flex"}
                            style={{
                              alignItems: "center",
                              textDecoration: "none",
                            }}
                            onClick={() => {
                              if (task.body?.length > 0) {
                                setShowBodyIndex(
                                  showBodyIndex === index ? undefined : index
                                );
                              }
                            }}
                          >
                            {task.assigned_to && (
                              <OverlayTrigger
                                key={`top-1`}
                                placement={"top"}
                                overlay={
                                  <Tooltip id={`tooltip-top`}>
                                    <span>{task.assigned_to.name}</span>
                                  </Tooltip>
                                }
                              >
                                <AvatarIcon
                                  name={task.assigned_to.name}
                                  imgUrl={task.assigned_to.avatar}
                                  size={25}
                                  style={{
                                    marginRight: "10px",
                                  }}
                                />
                              </OverlayTrigger>
                            )}
                            <Marquee
                              height="25"
                              width={{
                                s: 100,
                                m: 150,
                                l: 200,
                                xl: 250,
                              }}
                            >
                              {task.title}
                            </Marquee>
                          </button>
                        </th>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {task.task_type}
                        </td>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="d-flex align-items-center">
                            <PriorityIndicator className={task.priority} />
                            {task.priority}
                          </div>
                        </td>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {task.source && (
                            <div className="d-flex align-items-center">
                              <AvatarIcon
                                name={task.source.name}
                                imgUrl={task.source.avatar}
                                size={25}
                                style={{
                                  marginRight: "10px",
                                }}
                              />
                              {task.company_id ? (
                                <>
                                  <OverflowCell
                                    to={
                                      task.source.type === "candidate"
                                        ? ROUTES.CandidateProfile.url(
                                            mentionTags[task.company_id],
                                            task.source.professional_id
                                          )
                                        : task.source.type === "client"
                                        ? ROUTES.ClientProfile.url(
                                            mentionTags[task.company_id],
                                            task.source.id
                                          )
                                        : task.source.type === "contact"
                                        ? ROUTES.ContactProfile.url(
                                            mentionTags[task.company_id],
                                            task.source.id
                                          )
                                        : task.source.type === "deal"
                                        ? ROUTES.DealProfile.url(
                                            mentionTags[task.company_id],
                                            task.source.id
                                          )
                                        : ROUTES.ClientManager.url(
                                            mentionTags[task.company_id],
                                            crmTabs[task.source.type]
                                          )
                                    }
                                    style={{ color: "#1e1e1e" }}
                                  >
                                    {task.source.name}
                                  </OverflowCell>
                                </>
                              ) : (
                                <>{task.source.name}</>
                              )}
                            </div>
                          )}
                        </td>

                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {spacetime(new Date(task.due_datetime)).format(
                            "{date} {month-short}, {year} {hour-24-pad}:{minute-pad}"
                          )}
                          {activeTab !== "completed" &&
                            spacetime.now().isAfter(task.due_datetime) && (
                              <Due>
                                <DueDot />
                                Overdue
                              </Due>
                            )}
                        </td>
                        {permission.edit && (
                          <td className={sharedStyles.tableItemStatus}>
                            <ExtensionMenu>
                              <ExtensionMenuOption
                                onClick={() => {
                                  setSelectedTask(task);
                                  setSelectedTaskIx(index);
                                  openModal("edit-task");
                                }}
                              >
                                Edit Task
                              </ExtensionMenuOption>
                              <ExtensionMenuOption
                                onClick={() => toggleCompleted(task, index)}
                              >
                                {task.completed
                                  ? "Set Incomplete"
                                  : "Set Completed"}
                              </ExtensionMenuOption>
                              {(task.owner.professional_id === store.user?.id ||
                                store.role?.role_permissions.owner ||
                                store.role?.role_permissions.admin) && (
                                <ExtensionMenuOption
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setSelectedTaskIx(index);
                                    openModal("delete-task");
                                  }}
                                >
                                  Delete Task
                                </ExtensionMenuOption>
                              )}
                            </ExtensionMenu>
                          </td>
                        )}
                      </tr>
                      {showBodyIndex === index && (
                        <tr>
                          <td
                            colSpan="12"
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            {task.body}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </EmptyTab>
  );
};
export default TasksTable;

const crmTabs = {
  deal: "deals",
  contact: "contacts",
  client: "companies",
};

const Due = styled.div`
  align-items: center;
  color: #f27881;
  display: inline-flex;
  font-size: 12px;
  line-height: 1;
  margin-left: 10px;
  position: relative;
  top: -2px;
`;

const DueDot = styled.div`
  background: #f27881;
  border-radius: 50%;
  font-weight: 500;
  height: 5px;
  margin-right: 5px;
  width: 5px;
`;

const OverflowCell = styled(Link)`
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
