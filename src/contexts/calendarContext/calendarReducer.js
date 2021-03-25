let storageFilter = sessionStorage.getItem("calendarTMFilter");
let initialFilter = storageFilter ? JSON.parse(storageFilter) : [];

export const initialState = {
  globalView: "table",
  calendarId: initialFilter,
  forceUpdate: false,
  gToken: ``
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case `SET_GLOBAL_VIEW`:
      return { ...state, globalView: action.payload };
    case `SET_CALENDAR_ID`:
      sessionStorage.setItem(
        "calendarTMFilter",
        JSON.stringify(action.payload)
      );
      return { ...state, calendarId: action.payload, allEventsId: null };
    case `GET_COMPANY_EVENTS`:
      return { ...state, allEventsId: action.payload, calendarId: null };
    case `SET_FORCE_UPDATE`:
      return { ...state, forceUpdate: action.payload };
    case `SET_G_TOKEN`:
      return { ...state, gToken: action.payload };
    default:
      return state;
  }
};
