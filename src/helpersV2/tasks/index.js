import { API_ROOT_PATH } from "constants/api.js";

export const fetchCreateTask = async (session, task) => {
  const url = `${API_ROOT_PATH}/v2/tasks`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify(task)
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to create task");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchGetAllTasks = async (session, filters) => {
  const url = `${API_ROOT_PATH}/v2/tasks/list`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({ filters })
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch tasks");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchGetIncompleteTasks = async (session, professionalId) => {
  const url = `${API_ROOT_PATH}/v2/tasks/count/incompleted?assigned_to=${professionalId}`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch tasks total");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchEditTask = async (session, taskId, task) => {
  const url = `${API_ROOT_PATH}/v2/tasks/${taskId}/edit`;

  let error;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: session,
      body: JSON.stringify(task)
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to update task");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
export const fetchDeleteTasks = async (session, task_ids) => {
  const url = `${API_ROOT_PATH}/v2/tasks`;

  let error;
  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: session,
      body: JSON.stringify({ task_ids })
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to delete tasks");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchToggleTasks = async (session, task_ids, completed) => {
  const url = `${API_ROOT_PATH}/v2/tasks/completed`;

  let error;
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: session,
      body: JSON.stringify({
        completed,
        task_ids
      })
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to change tasks");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};

export const fetchSingleTask = async (session, taskId) => {
  const url = `${API_ROOT_PATH}/v2/tasks/${taskId}/single_task`;

  let error;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: session
    });
    let res = await response.json();
    if (!response.ok || res.error || res.errors) {
      error = res;
      throw new Error("Unable to fetch task");
    }
    return res;
  } catch (err) {
    return { err: true, ...error, customError: err };
  }
};
