import React from "react";
import ReactDOM from "react-dom";
import GlobalProvider from "contexts/globalContext/GlobalProvider";
import HistoryProvider from "contexts/historyContext/HistoryProvider";
import * as Sentry from "@sentry/browser";
import ReactNotification from "react-notifications-component";
import { createBrowserHistory } from "history";
import ReactGA from "react-ga";
import "abortcontroller-polyfill/dist/polyfill-patch-fetch";
import "notifications/notifications.css";
import "core-js";
import "element-scroll-polyfill";
import "assets/stylesheets/css/styles.css";
import "react-select/dist/react-select.css";
import "../node_modules/video-react/dist/video-react.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "overlayscrollbars/css/OverlayScrollbars.css";
import "assets/stylesheets/css/os-theme-thin-dark.css";
import "assets/stylesheets/css/modal.css";
import { CalendarContextProvider } from "contexts/calendarContext/calendarProvider";

import App from "App";
import { unregister } from "./registerServiceWorker";

if (process.env.NODE_ENV !== "development") {
  console.log = () => {};
}

if (
  process.env.NODE_ENV !== "development" &&
  process.env.NODE_ENV !== "staging"
) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_KEY,
    environment: process.env.REACT_APP_SENTRY_ENV,
  });
}

const history = createBrowserHistory();

const trackPageView = (location) => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
};

const initGa = (history) => {
  ReactGA.initialize(process.env.REACT_APP_ANALYTICS, {
    debug: false,
  });
  trackPageView(history.location);
  history.listen(trackPageView);
};

initGa(history);

ReactDOM.render(
  <GlobalProvider>
    <HistoryProvider>
      <CalendarContextProvider>
        <ReactNotification />
        <App />
      </CalendarContextProvider>
    </HistoryProvider>
  </GlobalProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister();
