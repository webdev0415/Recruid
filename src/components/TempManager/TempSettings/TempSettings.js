import React from "react";
import { ATSContainer } from "styles/PageContainers";
import ATSBanner from "sharedComponents/ATSBanner";
const TempSettings = ({ store, activeTab, tabsArr }) => {
  return (
    <>
      <ATSBanner
        name={store.company?.name}
        avatar={store.company?.avatar_url}
        page="Temp +"
        tabs={tabsArr}
        activeTab={activeTab}
        tabType="link"
        v2theme={true}
      ></ATSBanner>
      <ATSContainer></ATSContainer>
    </>
  );
};

export default TempSettings;
