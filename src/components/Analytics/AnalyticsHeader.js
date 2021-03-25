import React, { useContext } from "react";
import ATSBanner from "sharedComponents/ATSBanner";
import { ROUTES } from "routes";
import GlobalContext from "contexts/globalContext/GlobalContext";

const AnalyticsHeader = (props) => {
  const store = useContext(GlobalContext);
  return (
    <>
      <ATSBanner
        name={props.name}
        avatar={props.avatarUrl}
        page={props.job?.title || "Analytics"}
        clientButton={
          props.job && props.job.company?.id !== props.company?.id
            ? props.job.company.name
            : undefined
        }
        tabs={
          !props.jobDashboard
            ? store.role?.role_permissions?.admin ||
              store.role?.role_permissions?.owner
              ? ownerAdminMenu
              : store.role?.role_permissions?.manager
              ? managerMenu
              : store.role?.role_permissions?.recruiter
              ? recruiterMenu
              : userMenu
            : undefined
        }
        activeTab={props.activeOption}
        tabType="link"
        job={props.job}
        setJob={props.setJob}
      ></ATSBanner>
    </>
  );
};

export default AnalyticsHeader;

const ownerAdminMenu = [
  {
    name: "company",
    title: "Company",
    url: (routerProps) =>
      ROUTES.Analytics.url(
        routerProps.match.params.companyMentionTag,
        "company"
      ),
  },
  {
    name: "jobs",
    title: "Jobs",
    url: (routerProps) =>
      ROUTES.Analytics.url(routerProps.match.params.companyMentionTag, "jobs"),
  },
  {
    name: "roles",
    title: "Team",
    url: (routerProps) =>
      ROUTES.Analytics.url(routerProps.match.params.companyMentionTag, "roles"),
  },
];
const recruiterMenu = [
  {
    name: "recruiter",
    title: "Recruiter",
    url: (routerProps) =>
      ROUTES.Analytics.url(
        routerProps.match.params.companyMentionTag,
        "recruiter"
      ),
  },
  {
    name: "jobs",
    title: "Jobs",
    url: (routerProps) =>
      ROUTES.Analytics.url(routerProps.match.params.companyMentionTag, "jobs"),
  },
];
const userMenu = [
  {
    name: "jobs",
    title: "Jobs",
    url: (routerProps) =>
      ROUTES.Analytics.url(routerProps.match.params.companyMentionTag, "jobs"),
  },
];

const managerMenu = [
  {
    name: "roles",
    title: "Team",
    url: (routerProps) =>
      ROUTES.Analytics.url(routerProps.match.params.companyMentionTag, "roles"),
  },
  {
    name: "jobs",
    title: "Jobs",
    url: (routerProps) =>
      ROUTES.Analytics.url(routerProps.match.params.companyMentionTag, "jobs"),
  },
];
