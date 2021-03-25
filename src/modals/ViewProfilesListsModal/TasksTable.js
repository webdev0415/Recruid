import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { PriorityIndicator } from "sharedComponents/ActionCreator/SharedComponents";
import notify from "notifications";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { ROUTES } from "routes";
import AvatarIcon from "sharedComponents/AvatarIcon";
import spacetime from "spacetime";
import {
  STContainer,
  STTable,
  OverflowCell,
  TableDiv,
} from "modals/ViewProfilesListsModal/components";
import { fetchGetAllTasks } from "helpersV2/tasks";
import Spinner from "sharedComponents/Spinner";

const TasksTable = ({
  store,
  elasticIds,
  tasks,
  setTasks,
  loaded,
  setLoaded,
  completed,
}) => {
  const [showBodyIndex, setShowBodyIndex] = useState(undefined);

  useEffect(() => {
    if (store.session && store.company) {
      fetchGetAllTasks(store.session, {
        completed,
        company_id: [store.company.id],
        ids: elasticIds,
      }).then((res) => {
        if (!res.err) {
          setTasks(res);
          setLoaded(true);
        } else {
          notify("danger", "Unable to fetch tasks");
        }
      });
    }
  }, [store.session, store.company, completed, elasticIds]);

  return (
    <>
      {!loaded ? (
        <Spinner />
      ) : (
        <STContainer id="modal-container-scroll">
          <TableDiv className="table-responsive">
            <STTable className="table  ">
              <thead>
                <tr>
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
                </tr>
              </thead>
              <tbody>
                {tasks &&
                  tasks.map((task, index) => {
                    return (
                      <React.Fragment key={`task-item-${index}`}>
                        <tr
                          key={`company_${index}`}
                          className="table-row-hover"
                        >
                          <th
                            scope="row"
                            className={sharedStyles.tableItemFirst}
                          >
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
                              {task.title}
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
                                              store.company.id,
                                              task.source.professional_id
                                            )
                                          : task.source.type === "client"
                                          ? ROUTES.ClientProfile.url(
                                              store.company.id,
                                              task.source.id
                                            )
                                          : task.source.type === "contact"
                                          ? ROUTES.ContactProfile.url(
                                              store.company.id,
                                              task.source.id
                                            )
                                          : task.source.type === "deal"
                                          ? ROUTES.DealProfile.url(
                                              store.company.id,
                                              task.source.id
                                            )
                                          : ROUTES.ClientManager.url(
                                              store.company.id
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
                          </td>
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
            </STTable>
          </TableDiv>
        </STContainer>
      )}
    </>
  );
};

export default TasksTable;
