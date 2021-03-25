import { fetchSession, fetchUser, fetchSignOut } from "helpersV2/user";
import {
  fetchAllMyCompanies,
  fetchCompanyData,
  fetchTeamMembers,
  fetchRole,
  fetchCompanyApprovalProcess,
  fetchCompanyJobExtraFields,
} from "helpersV2/company";
import { fetchCompanySources } from "helpersV2/sources";
import {
  fetchSkills,
  fetchIndustries,
  fetchLocations,
  fetchDepartments,
  fetchBusinessAreas,
} from "helpersV2/global";
import {
  fetchInterviewStages,
  fetchUpdateInterviewStages,
} from "helpersV2/interviews";
import notify from "notifications";
import { ENV_SESSION_NAME } from "constants/api";
import { getCurrentPlan } from "helpersV2/pricing";
import { fetchGetIncompleteTasks } from "helpersV2/tasks";

export const checkAndCreateSession = (dispatch) => {
  let localStorageSession = JSON.parse(localStorage.getItem(ENV_SESSION_NAME));
  let cookiesSession = findCookies();
  if (localStorageSession) {
    dispatch({ type: "UPDATE_SESSION", payload: localStorageSession });
  } else if (cookiesSession) {
    dispatch({ type: "UPDATE_SESSION", payload: cookiesSession });
  }
  return localStorageSession || cookiesSession ? true : false;
};

const findCookies = () => {
  let cookiesArr = document.cookie.split(";");
  let cookiesObj = {};
  cookiesArr.map((cookieStr) => {
    let arr = cookieStr.split("=");
    cookiesObj[arr[0].trim()] = arr[1];
    return null;
  });
  if (cookiesObj[ENV_SESSION_NAME]) {
    return JSON.parse(cookiesObj[ENV_SESSION_NAME]);
  } else {
    return null;
  }
};

export const checkLastCompany = () => {
  let localStorageCompany = JSON.parse(localStorage.getItem("lastCompanyId"));
  return localStorageCompany;
};

export const getUser = async (dispatch, session) => {
  return fetchUser(session, session.username).then((user) => {
    if (!user.err) {
      dispatch({ type: "UPDATE_USER", payload: user });
    } else {
      notify("danger", user);
    }
    return user;
  });
};

export const getAllMyCompanies = (dispatch, session) => {
  return fetchAllMyCompanies(session).then((companies) => {
    if (!companies.err && companies.length > 0) {
      dispatch({ type: "UPDATE_ALLMYCOMPANIES", payload: companies });
    } else if (!companies.err && companies.length === 0) {
      dispatch({ type: "UPDATE_ALLMYCOMPANIES", payload: companies });
      notify("warning", "No companies added to this profile");
    } else if (companies.err) {
      notify("danger", companies);
    }
    return companies;
  });
};

export const getCompany = async (dispatch, session, companyMentionTag) => {
  return fetchCompanyData(session, companyMentionTag).then((company) => {
    if (!company.err) {
      dispatch({ type: "UPDATE_COMPANY", payload: company });
    } else {
      notify("danger", company);
    }
    return company;
  });
};

export const updateCompany = async (store, companyMentionTag) => {
  return fetchCompanyData(store.session, companyMentionTag).then((company) => {
    if (!company.err) {
      let newCompanies = store.allMyCompanies.map((comp) => {
        if (comp.id === company.id) {
          return company;
        } else {
          return comp;
        }
      });
      store.dispatch({ type: "UPDATE_COMPANY", payload: company });
      store.dispatch({ type: "UPDATE_ALLMYCOMPANIES", payload: newCompanies });
    } else {
      notify("danger", company);
    }
    return company;
  });
};

export const getTeamMembers = (dispatch, session, companyId) => {
  return fetchTeamMembers(session, companyId).then((team) => {
    if (!team.err) {
      dispatch({ type: "UPDATE_TEAMMEMBERS", payload: team.sort(sortMembers) });
    } else {
      notify("warning", team);
    }
    return team;
  });
};

const sortMembers = (a, b) => a.name?.localeCompare(b.name);
export const getRole = (dispatch, session, companyId) => {
  return fetchRole(session, companyId).then((role) => {
    if (!role.err) {
      dispatch({ type: "UPDATE_ROLE", payload: formatRole(role) });
    } else {
      notify("danger", role);
    }
    return role;
  });
};

const formatRole = (role) => {
  return {
    ...role,
    permission: role.is_member,
    role_permissions: {
      is_member: role.is_member,
      master_owner: role.team_member.master_owner,
      owner:
        role.team_member.master_owner ||
        role.team_member.permission === "owner",
      admin: role.team_member.permission === "admin",
      manager: role.team_member.permission === "manager",
      marketer:
        role.team_member.permission === "owner" ||
        role.team_member.roles.includes("marketer"),
      recruiter:
        role.team_member.permission === "owner" ||
        role.team_member.roles.includes("recruiter"),
      hiring_manager: role.team_member.roles.includes("hiring_manager"),
      business:
        role.team_member.permission === "owner" ||
        role.team_member.roles.includes("business"),
    },
  };
};

export const getSession = async (dispatch, credentials) => {
  let response = await fetchSession(credentials).then((session) => {
    if (!session.err) {
      dispatch({ type: "UPDATE_SESSION", payload: session });
      //store session in localStorage
      localStorage.setItem(ENV_SESSION_NAME, JSON.stringify(session));
      //create session cookie
      document.cookie = `${ENV_SESSION_NAME}=${JSON.stringify(
        session
      )}; path=/; domain=hirewithleo.com; max-age=${session.expiry}; secure;`;
    } else {
      notify("danger", session);
    }
    return true;
  });
  return response;
};

export const logOut = async (dispatch, session) => {
  fetchSignOut(session).then(() => {
    //clear session in localStorage
    localStorage.clear();
    //clear session cookie
    document.cookie = `${ENV_SESSION_NAME}=; path=/; domain=hirewithleo.com; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=lax;`;
    dispatch({ type: "DELETE_ALL" });
  });
};

export const deleteStore = async (dispatch) => {
  dispatch({ type: "DELETE_ALL" });
  //clear session in localStorage
  localStorage.clear();
  //clear session cookie
  document.cookie = `${ENV_SESSION_NAME}=; path=/; domain=hirewithleo.com; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=lax;`;
};

export const getSkills = async (dispatch, session, company_id) => {
  fetchSkills(session, company_id).then((skills) => {
    if (!skills.err) {
      dispatch({ type: "UPDATE_SKILLS", payload: skills });
    } else {
      notify("danger", skills);
    }
  });
};
export const getIndustries = async (dispatch, session, company_id) => {
  fetchIndustries(session, company_id).then((industries) => {
    if (!industries.err) {
      dispatch({ type: "UPDATE_INDUSTRIES", payload: industries });
    } else {
      notify("danger", industries);
    }
  });
};
export const getDepartments = async (dispatch, session, company_id) => {
  fetchDepartments(session, company_id).then((departments) => {
    if (!departments.err) {
      dispatch({ type: "UPDATE_DEPARTMENTS", payload: departments });
    } else {
      notify("danger", departments);
    }
  });
};
export const getBusinessAreas = async (dispatch, session, company_id) => {
  fetchBusinessAreas(session, company_id).then((areas) => {
    if (!areas.err) {
      dispatch({ type: "UPDATE_BUSINESS_AREAS", payload: areas });
    } else {
      notify("danger", areas);
    }
  });
};
export const getLocations = async (dispatch) => {
  fetchLocations().then((locations) => {
    if (!locations.err) {
      let locObj = {};
      locations.map((loc) => {
        if (!locObj[loc.name.toLowerCase()]) {
          locObj[loc.name.toLowerCase()] = loc;
        }
        return null;
      });
      dispatch({ type: "UPDATE_LOCATIONS", payload: Object.values(locObj) });
    } else {
      notify("danger", locations);
    }
  });
};

export const getInterviewStages = async (dispatch, session, companyId) => {
  return fetchInterviewStages(session, companyId).then((stages) => {
    if (!stages.err) {
      dispatch({ type: "UPDATE_INTERVIEW_STAGES", payload: stages });
    } else {
      notify("danger", stages);
    }
    return stages;
  });
};

export const updateInterviewStages = (store, newStages) => {
  return fetchUpdateInterviewStages(
    store.session,
    store.company.id,
    newStages
  ).then((stages) => {
    if (!stages.err) {
      if (stages.body.interview_stages) {
        store.dispatch({
          type: "UPDATE_INTERVIEW_STAGES",
          payload: stages.body.interview_stages,
        });
      }

      if (!store.company.interview_stages_edited) {
        updateCompany(store, store.company.mention_tag);
      }
    } else {
      notify("danger", stages);
    }
    return stages;
  });
};

export const getCompanySources = (dispatch, session, companyId) => {
  return fetchCompanySources(session, companyId).then((res) => {
    if (!res.err) {
      dispatch({
        type: "UPDATE_SOURCES",
        payload: res,
      });
    } else {
      notify("danger", res);
      dispatch({
        type: "UPDATE_SOURCES",
        payload: undefined,
      });
    }
  });
};

export const getPricingPlan = async (companyId, session, dispatch) => {
  const planResponse = await getCurrentPlan(companyId, session);
  if (planResponse?.error) return notify("danger", planResponse?.message);
  return dispatch({ type: "UPDATE_PRICING_PLAN", payload: planResponse });
};

export const getTasksTotal = (dispatch, session) => {
  return fetchGetIncompleteTasks(session, session.id).then((res) => {
    if (!res.err && res.count !== undefined) {
      dispatch({
        type: "UPDATE_TOTALS",
        payload: { uncompleted_tasks: res.count },
      });
    }
  });
};

export const addNewSkill = (skills = [], newSkill) => {
  let skillsCopy = [...skills];
  skills.map((skill, index) => {
    let comparison = skill.name.localeCompare(newSkill.name);
    let comparisonNext = skillsCopy[index + 1]?.name.localeCompare(
      newSkill.name
    );
    if (index === skills.length - 1) {
      return skillsCopy.push(newSkill);
    }
    if ((comparison === 1 && comparisonNext === -1) || comparison === 0) {
      skillsCopy.splice(index + 1, 0, newSkill);
    }
    return null;
  });
  return skillsCopy;
};

export const addNewIndustry = (industries = [], newIndustry) => {
  let industriesCopy = [...industries];
  industries.map((industry, index) => {
    let comparison = industry.name.localeCompare(newIndustry.name);
    let comparisonNext = industriesCopy[index + 1]?.name.localeCompare(
      newIndustry.name
    );
    if (index === industries.length - 1) {
      return industriesCopy.push(newIndustry);
    }
    if ((comparison === 1 && comparisonNext === -1) || comparison === 0) {
      industriesCopy.splice(index + 1, 0, newIndustry);
    }
    return null;
  });
  return industriesCopy;
};

export const addNewDepartment = (departments = [], newDepartment) => {
  let departmentsCopy = [...departments];
  departments.map((department, index) => {
    let comparison = department.name.localeCompare(newDepartment.name);
    let comparisonNext = departmentsCopy[index + 1]?.name.localeCompare(
      newDepartment.name
    );
    if (index === departments.length - 1) {
      return departmentsCopy.push(newDepartment);
    }
    if ((comparison === 1 && comparisonNext === -1) || comparison === 0) {
      departmentsCopy.splice(index + 1, 0, newDepartment);
    }
    return null;
  });
  return departmentsCopy;
};

export const addNewBusinessArea = (areas = [], newArea) => {
  let areasCopy = [...areas];
  areas.map((area, index) => {
    let comparison = area.name.localeCompare(newArea.name);
    let comparisonNext = areasCopy[index + 1]?.name.localeCompare(newArea.name);
    if (index === areas.length - 1) {
      return areasCopy.push(newArea);
    }
    if ((comparison === 1 && comparisonNext === -1) || comparison === 0) {
      areasCopy.splice(index + 1, 0, newArea);
    }
    return null;
  });
  return areasCopy;
};

export const getApprovalProcess = (companyId, session, dispatch) => {
  return fetchCompanyApprovalProcess(session, companyId).then((res) => {
    if (!res.err) {
      dispatch({
        type: "UPDATE_APPROVAL_PROCESS",
        payload: res,
      });
    } else {
      notify("danger", res);
      dispatch({
        type: "UPDATE_APPROVAL_PROCESS",
        payload: undefined,
      });
    }
  });
};

export const getJobExtraFields = (companyId, session, dispatch) => {
  return fetchCompanyJobExtraFields(session, companyId).then((res) => {
    if (!res.err) {
      dispatch({
        type: "UPDATE_JOB_EXTRA_FIELDS",
        payload: res,
        // payload: {
        //   advertised_required: true,
        //   advertised_visible: true,
        //   budgeted_required: true,
        //   budgeted_visible: true,
        //   business_area_required: true,
        //   business_area_visible: true,
        //   department_required: true,
        //   department_visible: true,
        //   hire_type_required: true,
        //   hire_type_visible: true,
        //   po_reference_required: true,
        //   po_reference_visible: true,
        //   working_hours_required: true,
        //   working_hours_visible: true,
        // },
      });
    } else {
      notify("danger", res);
      dispatch({
        type: "UPDATE_JOB_EXTRA_FIELDS",
        payload: undefined,
      });
    }
  });
};
