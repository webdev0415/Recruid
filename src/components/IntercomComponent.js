import React from "react";
import Intercom from "react-intercom";

const IntercomComponent = ({ store }) =>
  store.session && store.user ? (
    <Intercom
      appID={process.env.REACT_APP_INTERCOM}
      user_id={store.session.id}
      email={store.session.uid}
      name={store.user.name}
      is_confirmed={store.user.is_confirmed}
      onboarding_completed={store.user.onboarding_completed}
      temp_password={store.user.temp_password}
      user_status={store.user.user_status}
    />
  ) : (
    <></>
  );

export default IntercomComponent;
