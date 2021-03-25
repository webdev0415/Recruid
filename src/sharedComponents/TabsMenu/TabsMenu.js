import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { withRouter } from "react-router";
import { COLORS } from "constants/style";

const TabsMenu = ({
  tabsArr,
  activeTab,
  setActiveTab,
  type,
  v2theme,
  ...routerProps
}) => {
  return (
    <Tabs>
      <TabsContainer className={`${v2theme ? "v2theme" : ""} leo-flex`}>
        {type === "button" &&
          tabsArr.map((tab) => (
            <TabsItem key={`tab-choice-${tab.name}`}>
              <TabsButton
                className={
                  (activeTab === tab.name ? "active" : "") + " leo-flex-center"
                }
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.title}
                {tab.total >= 0 && (
                  <Number
                    className={
                      (activeTab === tab.name ? "active" : "") +
                      " leo-flex-center-center"
                    }
                  >
                    {tab.total}
                  </Number>
                )}
              </TabsButton>
            </TabsItem>
          ))}
        {type === "link" &&
          tabsArr.map((tab) => (
            <TabsItem key={`tab-choice-${tab.title}`}>
              <TabsLink
                to={tab.url(routerProps)}
                className={
                  (activeTab === tab.name ? "active" : "") + " leo-flex-center"
                }
              >
                {tab.title}
              </TabsLink>
            </TabsItem>
          ))}
      </TabsContainer>
    </Tabs>
  );
};

export default withRouter(TabsMenu);

const Tabs = styled.div`
  overflow-x: auto;
  width: 100%;

  @media screen and (min-width: 768px) {
    overflow: hidden;
  }
`;

const TabsContainer = styled.ul`
  overflow-x: auto;
  width: 100%;
  width: calc(100% + 30px);
  margin-bottom: 0;

  &.v2theme {
    border-bottom: solid ${COLORS.grey} 1px;
  }
`;

const TabsItem = styled.li`
  position: relative;

  &:not(:last-child) {
    margin-right: 20px;

    @media screen and (min-width: 768px) {
      margin-right: 30px;
    }
  }
`;

const TabsLink = styled(Link)`
  color: #74767b;
  font-size: 15px;
  font-weight: 500;
  padding: 1px 0 12px;
  width: max-content;

  &:hover {
    text-decoration: none;
  }

  &.active {
    border-bottom: 3px solid #1e1e1e;
    color: #1e1e1e;
  }
`;

const TabsButton = styled.button`
  color: #74767b;
  font-size: 15px;
  font-weight: 500;
  padding: 1px 0 12px;
  width: max-content;

  &.active {
    border-bottom: 3px solid #1e1e1e;
    color: #1e1e1e;
  }
`;

const Number = styled.span`
  background-color: #74767b;
  border-radius: 2px;
  color: #fff;
  font-size: 10px;
  font-weight: 500;
  height: 18px;
  margin-left: 8px;
  padding: 0 6px;

  &.active {
    background-color: #1e1e1e;
  }
`;
