import {
  addNewSkill,
  addNewIndustry,
  addNewBusinessArea,
  addNewDepartment,
} from "contexts/globalContext/GlobalMethods";

const GlobalHandlers = {
  UPDATE_SESSION: (state, action) => {
    return { ...state, session: action.payload };
  },
  UPDATE_USER: (state, action) => {
    return { ...state, user: action.payload };
  },
  UPDATE_ALLMYCOMPANIES: (state, action) => {
    return { ...state, allMyCompanies: action.payload };
  },
  UPDATE_COMPANY: (state, action) => {
    localStorage.setItem("lastCompanyId", JSON.stringify(action.payload.id));
    return { ...state, company: action.payload };
  },
  DELETE_COMPANY: (state) => {
    return { ...state, company: undefined };
  },
  UPDATE_ROLE: (state, action) => {
    return { ...state, role: action.payload };
  },
  UPDATE_TEAMMEMBERS: (state, action) => {
    return { ...state, teamMembers: action.payload };
  },
  UPDATE_SKILLS: (state, action) => {
    return { ...state, skills: action.payload };
  },
  UPDATE_INDUSTRIES: (state, action) => {
    return { ...state, industries: action.payload };
  },
  UPDATE_DEPARTMENTS: (state, action) => {
    return { ...state, departments: action.payload };
  },
  UPDATE_BUSINESS_AREAS: (state, action) => {
    return { ...state, business_areas: action.payload };
  },
  ADD_NEW_SKILL: (state, action) => {
    return { ...state, skills: addNewSkill(state.skills, action.payload) };
  },
  ADD_NEW_INDUSTRY: (state, action) => {
    return {
      ...state,
      industries: addNewIndustry(state.industries, action.payload),
    };
  },
  ADD_NEW_DEPARTMENT: (state, action) => {
    return {
      ...state,
      departments: addNewDepartment(state.departments, action.payload),
    };
  },
  ADD_NEW_BUSINESS_AREA: (state, action) => {
    return {
      ...state,
      business_areas: addNewBusinessArea(state.business_areas, action.payload),
    };
  },
  UPDATE_INTERVIEW_STAGES: (state, action) => {
    return { ...state, interviewStages: action.payload };
  },
  UPDATE_PRICING_PLAN: (state, action) => {
    return { ...state, pricingPlan: action.payload };
  },
  UPDATE_SOURCES: (state, action) => {
    return { ...state, sources: action.payload };
  },
  UPDATE_TOTALS: (state, action) => {
    return { ...state, totals: { ...state.totals, ...action.payload } };
  },
  UPDATE_EMAILS_SCAN: (state, action) => {
    return { ...state, emailsScanPending: action.payload };
  },
  UPDATE_APPROVAL_PROCESS: (state, action) => {
    return { ...state, approval_process: action.payload };
  },
  UPDATE_EMAIL_PROVIDER: (state, action) => {
    return { ...state, emailProvider: action.payload };
  },
  UPDATE_JOB_EXTRA_FIELDS: (state, action) => {
    return { ...state, job_extra_fields: action.payload };
  },
  DELETE_ALL: () => {
    return {
      session: undefined,
      user: undefined,
      allMyCompanies: undefined,
      company: undefined,
      role: undefined,
      teamMembers: undefined,
      interviewStages: undefined,
      sources: undefined,
      totals: {},
      industries: undefined,
      skills: undefined,
      approval_process: undefined,
      emailProvider: undefined,
      job_extra_fields: undefined,
      departments: undefined,
      business_areas: undefined,
      // locations: undefined
    };
  },
};
export default GlobalHandlers;
