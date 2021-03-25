import React, { useEffect } from "react";

import * as Sentry from "@sentry/browser";

const SentryComponent = ({ store }) => {
  useEffect(() => {
    if (store.session) {
      Sentry.configureScope((scope) => {
        scope.setUser({
          username: store.session.username,
          email: store.session.uid,
        });
      });
    }
  }, [store.session]);
  return <></>;
};

export default SentryComponent;
