import { CableApp } from "websocket";
export function connectSkills(store) {
  CableApp.skills = CableApp.cable.subscriptions.create(
    {
      channel: "SkillChannel",
      room: `${store.company.mention_tag}`,
    },
    {
      received: (newSkill) =>
        store.dispatch({ type: "ADD_NEW_SKILL", payload: newSkill }),
      disconnected: () => {},
      connected: () => {},
    }
  );
}
export function connectIndustries(store) {
  CableApp.industries = CableApp.cable.subscriptions.create(
    {
      channel: "CategoriesChannel",
      room: `${store.company.mention_tag}`,
    },
    {
      received: (newIndustry) =>
        store.dispatch({ type: "ADD_NEW_INDUSTRY", payload: newIndustry }),

      disconnected: () => {},
      connected: () => {},
    }
  );
}

export function connectDepartments(store) {
  CableApp.departments = CableApp.cable.subscriptions.create(
    {
      channel: "DepartmentChannel",
      room: `${store.company.mention_tag}`,
    },
    {
      received: (newDepartment) =>
        store.dispatch({
          type: "ADD_NEW_DEPARTMENT",
          payload: newDepartment,
        }),

      disconnected: () => {},
      connected: () => {},
    }
  );
}
export function connectBusinessAreas(store) {
  CableApp.businessAreas = CableApp.cable.subscriptions.create(
    {
      channel: "BusinessAreaChannel",
      room: `${store.company.mention_tag}`,
    },
    {
      received: (newAreas) =>
        store.dispatch({ type: "ADD_NEW_INDUSTRY", payload: newAreas }),

      disconnected: () => {},
      connected: () => {},
    }
  );
}
