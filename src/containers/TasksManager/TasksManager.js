import React, { useState, useContext, useEffect, Suspense } from "react";
import { Redirect } from "react-router-dom";
import InnerPage from "PageWrappers/InnerPage";
import FalseATSWrapper from "PageWrappers/FalseATSWrapper";
import ATSWrapper from "PageWrappers/ATSWrapper";
import { InnerPageContainer } from "styles/PageContainers";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { permissionChecker } from "constants/permissionHelpers";
// import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import notify from "notifications";

import TasksBanner from "components/TasksManager/TasksBanner";
import TasksTable from "components/TasksManager/TasksTable";
import TasksActionBar from "components/TasksManager/TasksActionBar";
import FilterV2 from "sharedComponents/filterV2";
import {
  fetchGetAllTasks,
  fetchDeleteTasks,
  fetchToggleTasks,
} from "helpersV2/tasks";
import { ROUTES } from "routes";
import { ATSContainer } from "styles/PageContainers";
import retryLazy from "hooks/retryLazy";
const CheckoutModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/CheckoutModal/CheckoutModalV2"))
);
const TaskModal = React.lazy(() => retryLazy(() => import("modals/TaskModal")));
const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);
const UpgradeContainer = React.lazy(() =>
  retryLazy(() => import("sharedComponents/UpgradeContainer"))
);
const possibleTabs = {
  complete: true,
  incomplete: true,
};

const ATSDifferentiator = (props) => {
  return (
    <>
      {props.match.params.companyMentionTag ? (
        <InATS {...props} />
      ) : (
        <OutATS {...props} />
      )}
    </>
  );
};

const InATS = (props) => {
  const store = useContext(GlobalContext);
  const [redirect, setRedirect] = useState(undefined);

  // IF LOADING ROUTE CONTAINS A TAB, SET THE COMPONENT TO THE RIGHT ONE
  useEffect(() => {
    if (
      store.company &&
      (!props.match.params.tab || !possibleTabs[props.match.params.tab])
    ) {
      setRedirect(
        ROUTES.CompanyTasksManager.url(store.company.mention_tag, "incomplete")
      );
    }
  }, [props.match.params.tab]);

  useEffect(() => {
    if (store.role && !permissionChecker(store.role?.role_permissions).view) {
      setRedirect(ROUTES.CompanyDashboard.url(store.company.mention_tag));
    }
  }, [store.role]);

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
    }
  }, [redirect]);

  return (
    <InnerPage
      pageTitle={`${store.company ? store.company.name : ""} - Tasks`}
      originName={store.company ? `${store.company.name} - Tasks` : undefined}
    >
      {redirect && redirect !== props.location.pathname && (
        <Redirect to={redirect} />
      )}
      <ATSWrapper activeTab="company-tasks">
        <InnerPageContainer>{props.children}</InnerPageContainer>
      </ATSWrapper>
    </InnerPage>
  );
};
const OutATS = (props) => {
  const store = useContext(GlobalContext);
  return (
    <InnerPage
      pageTitle={`${store.user ? store.user.name : ""} - Tasks`}
      originName={store.user ? `${store.user.name} - Tasks` : undefined}
    >
      <FalseATSWrapper activeTab="tasks">
        <InnerPageContainer>{props.children}</InnerPageContainer>
      </FalseATSWrapper>
    </InnerPage>
  );
};

const TasksManager = (props) => {
  const store = useContext(GlobalContext);
  const [tasks, setTasks] = useState(undefined);
  const [activeModal, setActiveModal] = useState(undefined);
  const [selectedTask, setSelectedTask] = useState(undefined);
  const [selectedTaskIx, setSelectedTaskIx] = useState(undefined);
  // const [searchTerm, setSearchTerm] = useState("");
  const [refresh, triggerRefresh] = useState(Math.random());
  const [filters, setFilters] = useState({});
  const [companiesMembers, setCompaniesMembers] = useState({});
  const [mentionTags, setMentionTags] = useState({});
  const [text, setText] = useState("");
  const [permission, setPermission] = useState({ view: false, edit: false });
  const [selectedTotal, setSelectedTotal] = useState(0);
  useEffect(() => {
    if (!props.match.params.companyMentionTag) {
      setPermission({ view: true, edit: true });
    } else if (store.role) {
      setPermission(permissionChecker(store.role?.role_permissions));
    }
  }, [store.role, props.match.params.companyMentionTag]);

  useEffect(() => {
    if (
      store.session &&
      ((props.match.params.companyMentionTag && store.company) ||
        props.match.params.username)
    ) {
      let filtersCopy = {
        ...filters,
        // owner_id: store.session.id,
        text: text !== "" ? text : undefined,
        completed: props.match.params.complete === "completed" ? true : false,
      };
      if (props.match.params.companyMentionTag && store.company) {
        filtersCopy.company_id = [store.company.id];
      } else {
        filtersCopy.assigned_to = store.session.id;
        if (filters.company_id?.length === 0) {
          filtersCopy.company_id = undefined;
        }
      }
      if (filters.task_type?.length === 0) filtersCopy.task_type = undefined;
      if (filters.priority?.length === 0) filtersCopy.priority = undefined;
      if (filters.team_member_id?.length === 0)
        filtersCopy.team_member_id = undefined;
      fetchGetAllTasks(store.session, filtersCopy).then((res) => {
        if (!res.err) {
          setTasks(res);
        } else {
          notify("danger", "Unable to fetch tasks");
        }
      });
    }
  }, [
    store.session,
    filters,
    refresh,
    props.match.params,
    store.company,
    text,
  ]);

  useEffect(() => {
    if (store.allMyCompanies) {
      let obj = {};
      store.allMyCompanies.map(
        (company) => (obj[company.id] = company.mention_tag)
      );
      setMentionTags(obj);
    }
  }, [store.allMyCompanies]);

  useEffect(() => {
    if (store.teamMembers && store.company) {
      setCompaniesMembers((members) => {
        return {
          ...members,
          [store.company.id]: store.teamMembers,
        };
      });
    }
    //
  }, [store.teamMembers, store.company]);

  const deleteTaskMethod = () => {
    fetchDeleteTasks(store.session, [selectedTask.id]).then((res) => {
      if (!res.err) {
        notify("info", "Task succesfully deleted");
        let tasksCopy = [...tasks];
        tasksCopy.splice(selectedTaskIx, 1);
        setTasks(tasksCopy);
        setSelectedTask(undefined);
        setSelectedTaskIx(undefined);
        setActiveModal(undefined);
      } else {
        notify("danger", "Unable to delete task");
      }
    });
  };

  const deleteMultipleTasks = () => {
    fetchDeleteTasks(
      store.session,
      tasks.filter((task) => task.selected).map((task) => task.id)
    ).then((res) => {
      if (!res.err) {
        notify("info", "Task succesfully deleted");
        let unselected = tasks.filter((task) => !task.selected);
        setTasks([...unselected]);
        setSelectedTask(undefined);
        setActiveModal(undefined);
      } else {
        notify("danger", "Unable to delete task");
      }
    });
  };

  const toggleCompleted = (task, index) => {
    let tasksCopy = [...tasks];
    const bool = !tasksCopy[index].completed;
    tasksCopy[index].completed = bool;
    setTasks(tasksCopy);
    fetchToggleTasks(store.session, [task.id], bool).then((res) => {
      if (!res.err) {
        notify("info", "Status succesfully changed");
      } else {
        let tasksCopy = [...tasks];
        tasksCopy[index].completed = !bool;
        setTasks(tasksCopy);
        notify("danger", "Unable to set status");
      }
    });
  };

  const setMultipleStatus = (bool) => {
    let tasksCopy = [...tasks];
    let ids = [];
    tasksCopy.map((task) => {
      if (task.selected) {
        ids.push(task.id);
      }
      return null;
    });
    fetchToggleTasks(store.session, ids, bool).then((res) => {
      if (!res.err) {
        notify("info", "Status succesfully changed");
        tasksCopy = tasksCopy.map((task) => {
          if (task.selected) {
            return { ...task, selected: false, completed: bool };
          } else {
            return { ...task };
          }
        });

        setTasks(tasksCopy);
      } else {
        notify("danger", "Unable to set status");
      }
    });
  };

  const replaceTask = (newTask) => {
    let tasksCopy = [...tasks];
    tasksCopy[selectedTaskIx] = newTask;
    setTasks(tasksCopy);
    setSelectedTaskIx(undefined);
  };

  const openModal = (option) => setActiveModal(option);
  const closeModal = () => setActiveModal(undefined);

  const openUpgradeModal = (modalId) => setActiveModal(modalId);

  const changeFilters = (newFilters) => {
    if (
      Object.values(filters).length === 0 &&
      Object.values(newFilters).length === 0
    ) {
      return;
    }
    setFilters(newFilters);
  };

  return (
    <ATSDifferentiator {...props}>
      {props.match.params.companyMentionTag &&
        store.company?.trial === "expired" &&
        store.role?.team_member.role === "owner" && (
          <Suspense fallback={<div />}>
            <UpgradeContainer
              upgradeFunction={() => openUpgradeModal("UpgradeModal")}
            />
          </Suspense>
        )}
      <TasksActionBar
        selectedTotal={selectedTotal}
        store={store}
        openModal={openModal}
        activeModal={activeModal}
        setMultipleStatus={setMultipleStatus}
      />
      {(!props.match.params.companyMentionTag ||
        store.company?.trial !== "expired") && (
        <>
          <TasksBanner
            openModal={openModal}
            searchTerm={text}
            setSearchTerm={(newText) => setText(newText)}
            activeTab={props.match.params.complete}
            match={props.match}
            permission={permission}
          />
          <ATSContainer>
            <FilterV2
              hideSegments={true}
              source={
                !props.match.params.companyMentionTag &&
                store.allMyCompanies?.length > 0
                  ? "task"
                  : "companyTask"
              }
              returnFilters={(newFilters) => changeFilters(newFilters)}
              cleanSlate={true}
            />
            <TasksTable
              tasks={tasks}
              setTasks={setTasks}
              setSelectedTask={setSelectedTask}
              setSelectedTaskIx={setSelectedTaskIx}
              openModal={openModal}
              toggleCompleted={toggleCompleted}
              setMultipleStatus={setMultipleStatus}
              store={store}
              mentionTags={mentionTags}
              activeTab={props.match.params.complete}
              match={props.match}
              permission={permission}
              selectedTotal={selectedTotal}
              setSelectedTotal={setSelectedTotal}
            />
          </ATSContainer>
        </>
      )}
      {activeModal === "edit-task" && selectedTask && (
        <Suspense fallback={<div />}>
          <TaskModal
            show={true}
            hide={closeModal}
            selectedTask={selectedTask}
            store={store}
            triggerRefresh={() => triggerRefresh(Math.random())}
            replaceTask={(newTask) => replaceTask(newTask)}
            companiesMembers={companiesMembers}
            setCompaniesMembers={setCompaniesMembers}
            mentionTags={mentionTags}
            match={props.match}
          />
        </Suspense>
      )}
      {activeModal === "create-task" && (
        <Suspense fallback={<div />}>
          <TaskModal
            show={true}
            hide={closeModal}
            store={store}
            triggerRefresh={() => triggerRefresh(Math.random())}
            companiesMembers={companiesMembers}
            setCompaniesMembers={setCompaniesMembers}
            mentionTags={mentionTags}
            match={props.match}
          />
        </Suspense>
      )}
      {activeModal === "delete-task" && selectedTask && (
        <Suspense fallback={<div />}>
          <ConfirmModalV2
            id="confirm-delete-task"
            show={true}
            hide={() => {
              setActiveModal(undefined);
              setSelectedTask(undefined);
            }}
            header="Delete this task"
            text="Are you sure you want to delete this task?"
            actionText="Delete"
            actionFunction={deleteTaskMethod}
          />
        </Suspense>
      )}
      {activeModal === "delete-multiple-tasks" && (
        <Suspense fallback={<div />}>
          <ConfirmModalV2
            id="confirm-delete-task"
            show={true}
            hide={() => {
              setActiveModal(undefined);
              setSelectedTask(undefined);
            }}
            header="Delete tasks"
            text="Are you sure you want to delete these tasks?"
            actionText="Delete"
            actionFunction={deleteMultipleTasks}
          />
        </Suspense>
      )}
      {activeModal === "UpgradeModal" && (
        <Suspense fallback={<div />}>
          <CheckoutModalV2 closeModal={closeModal} />
        </Suspense>
      )}
      {activeModal === "UpgradeModal" && (
        <CheckoutModalV2 closeModal={closeModal} />
      )}
    </ATSDifferentiator>
  );
};

export default TasksManager;
