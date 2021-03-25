import React, { useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import ATSBanner from "sharedComponents/ATSBanner";
import styles from "components/ClientManager/ClientManagerBanner/style/ClientManagerBanner.module.scss";
import { ROUTES } from "routes";
import SimpleDelayedInput from "sharedComponents/SimpleDelayedInput";

const TasksBanner = ({
  openModal,
  searchTerm,
  setSearchTerm,
  activeTab,
  match,
  permission,
}) => {
  const store = useContext(GlobalContext);

  return (
    <>
      <ATSBanner
        name={
          match.params.companyMentionTag ? store.company.name : store.user?.name
        }
        avatar={
          match.params.companyMentionTag
            ? store.company.avatar_url
            : store.user?.avatar_url
        }
        page="Tasks"
        tabs={store.session ? tabsArr : undefined}
        activeTab={activeTab}
        tabType="link"
      >
        <div
          className={`${styles.inputContainer} leo-relative`}
          style={{ marginRight: "10px" }}
        >
          <SimpleDelayedInput
            className={styles.form}
            placeholder={`Search Tasks...`}
            onChange={(val) => setSearchTerm(val)}
            value={searchTerm}
          />
          <li className="fas fa-search search" />
        </div>
        {permission.edit && (
          <button
            className="button button--default button--blue-dark"
            onClick={() => openModal("create-task")}
          >
            Create Task
          </button>
        )}
      </ATSBanner>
    </>
  );
};

let tabsArr = [
  {
    name: "incomplete",
    title: "Incomplete",
    url: (routerProps) =>
      routerProps.match.params.companyMentionTag
        ? ROUTES.CompanyTasksManager.url(
            routerProps.match.params.companyMentionTag,
            "incomplete"
          )
        : ROUTES.TasksManager.url(
            routerProps.match.params.username,
            "incomplete"
          ),
  },
  {
    name: "completed",
    title: "Completed",
    url: (routerProps) =>
      routerProps.match.params.companyMentionTag
        ? ROUTES.CompanyTasksManager.url(
            routerProps.match.params.companyMentionTag,
            "completed"
          )
        : ROUTES.TasksManager.url(
            routerProps.match.params.username,
            "completed"
          ),
  },
];

export default TasksBanner;
