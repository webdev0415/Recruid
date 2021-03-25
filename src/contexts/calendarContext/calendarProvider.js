import React, { createContext, useReducer } from "react";
import { reducer, initialState } from "./calendarReducer";

export const CalendarContext = createContext(null);

export const CalendarContextProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <CalendarContext.Provider value={{state, dispatch}}>
            {props.children}
        </CalendarContext.Provider>
    )
};