import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { permissionChecker } from "constants/permissionHelpers";

// const agencyTabsMap = [
//   "Candidates",
//   "Jobs",
//   "Interviews",
//   "Contacts",
//   "Clients",
//   "Deals",
//   "Meetings",
//   "Emails",
//   "Documents",
// ];
//
// const employerTabsMap = [
//   "Candidates",
//   "Jobs",
//   "Interviews",
//   "Emails",
//   "Documents",
// ];

export const ElasticTabs = ({
  activeTab,
  resultCounts,
  handleTabChange,
  company,
  role,
}) => {
  // const tabsMap = company.type === "Agency" ? agencyTabsMap : employerTabsMap;
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    if (role && company) {
      setTabs([
        ...(permissionChecker(role.role_permissions, {
          recruiter: true,
          hiring_manager: true,
        }).view
          ? ["Candidates", "Jobs", "Interviews"]
          : []),
        ...(permissionChecker(role.role_permissions, { business: true }).view &&
        company.type === "Agency"
          ? ["Contacts", "Clients", "Deals", "Meetings"]
          : []),
        "Emails",
        "Documents",
      ]);
    }
  }, [role, company]);

  return (
    <Tabs className="leo-flex">
      <TabButton
        className={(activeTab === "_all" ? "active" : "") + " leo-flex-center"}
        key={`all-tab`}
        onClick={handleTabChange("_all")}
      >
        All
      </TabButton>
      {tabs.map((tab) => (
        <Tab
          to={`/${company?.mention_tag}/search/${tab?.toLowerCase()}`}
          key={`${tab}-tab`}
          className={
            (tab.toLowerCase() === activeTab ? "active" : "") +
            " leo-flex-center"
          }
        >
          {tab}
          <span className="count">
            {resultCounts?.[tab?.toLowerCase()] ?? 0}
          </span>
        </Tab>
      ))}
    </Tabs>
  );
};

const Tabs = styled.ul`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  height: 50px;
  width: 100%;
`;

const TabButton = styled.button`
  background-color: transparent;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5) !important;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  margin-right: 25px;
  padding: 0;
  padding-right: 25px;
  transition: opacity ease-in-out 0.25s;

  &:hover {
    background-color: transparent !important;
    color: rgba(255, 255, 255, 1) !important;
    text-decoration: none;
  }

  &.active {
    opacity: 1;
  }
`;

const Tab = styled(Link)`
  background-color: transparent;
  color: rgba(255, 255, 255, 0.5) !important;
  font-size: 14px;
  font-weight: 500;
  padding: 0;
  margin: 0;
  transition: opacity ease-in-out 0.25s;

  &:hover {
    background-color: transparent !important;
    color: rgba(255, 255, 255, 1) !important;
    text-decoration: none;
  }

  &.active {
    opacity: 1;
  }

  :not(:last-child) {
    margin-right: 25px;
  }

  .count {
    background: rgba(176, 189, 202, 0.25);
    border-radius: 2px;
    font-size: 10px;
    font-weight: 700;
    margin-left: 3px;
    min-width: 17px;
    padding: 2px;
    text-align: center;
  }

  &.active {
    color: rgba(255, 255, 255, 1) !important;

    .count {
      // background: #24313e;
    }
  }
`;
