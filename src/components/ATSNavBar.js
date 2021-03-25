import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import HistoryContext from "contexts/historyContext/HistoryContext";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ROUTES } from "routes";
import { permissionChecker } from "constants/permissionHelpers";
import Nav from "react-bootstrap/Nav";

import AvatarIcon from "sharedComponents/AvatarIcon";
import { AWS_CDN_URL } from "constants/api";
// import { menuGenerator } from "constants/menuGenerator";
import menuGenerator from "constants/menus";
import { removeCurrentEntry } from "contexts/historyContext/HistoryMethods";
import { ATSContainer } from "styles/PageContainers";
import useDropdown from "hooks/useDropdown";

const ATSNavBar = () => {
  const store = useContext(GlobalContext);
  const historyStore = useContext(HistoryContext);
  const [breadcrumb, setBreadcrumb] = useState(undefined);
  const [tabs, setTabs] = useState(undefined);
  const [menus, setMenus] = useState({});
  //SUBNAVS BASED ON THE ROUTE PATH
  const [submenuPages, setSubmenuPages] = useState({});
  const [ATSPages] = useState({
    [ROUTES.CompanyDashboard?.path]: true,
    // [ROUTES.TalentNetwork?.path]: true,
    [ROUTES.ViewJobs?.path]: true,
    [ROUTES.Vendors?.path]: true,
    [ROUTES.Calendar?.path]: true,
    [ROUTES.Analytics?.path]: true,
    [ROUTES.TeamView?.path]: true,
    [ROUTES.ClientManager?.path]: true,
    [ROUTES.CompanyTasksManager?.path]: true,
    [ROUTES.CandidateProfile?.path]: true,
    [ROUTES.JobDashboard?.path]: true,
    [ROUTES.TempJobDashboard?.path]: true,
    [ROUTES.VendorPage?.path]: true,
    [ROUTES.DealProfile?.path]: true,
    [ROUTES.ClientProfile?.path]: true,
    [ROUTES.ContactProfile?.path]: true,
    [ROUTES.TasksManager?.path]: true,
    [ROUTES.ProfessionalProfileSettings?.path]: true,
    [ROUTES.Settings?.path]: true,
    [ROUTES.MarketingEmails?.path]: true,
    [ROUTES.EmailProfile?.path]: true,
    [ROUTES.TempManager?.path]: true,
    [ROUTES.TimesheetManager?.path]: true,
  });

  useEffect(() => {
    if (store.role) {
      let role_permissions = store.role.role_permissions;
      let ownerAdminPermission = permissionChecker(role_permissions);
      let recruiterPermission = permissionChecker(role_permissions, {
        recruiter: true,
        hiring_manager: true,
      });
      let hiringPermission = permissionChecker(role_permissions, {
        hiring_manager: true,
      });
      let onlyRecruiterPermission = permissionChecker(role_permissions, {
        recruiter: true,
      });

      let marketerPermission = permissionChecker(role_permissions, {
        marketer: true,
      });
      let businessPermission = permissionChecker(role_permissions, {
        business: true,
      });
      setSubmenuPages({
        [ROUTES.CandidateProfile.path]: recruiterPermission.view
          ? {
              name: "Candidates",
              url: (companyMentionTag) =>
                ROUTES.TalentNetwork.url(companyMentionTag),
            }
          : undefined,
        [ROUTES.ClientProfile.path]: businessPermission.view
          ? {
              name: "Client CRM",
              url: (companyMentionTag) =>
                ROUTES.ClientManager.url(companyMentionTag),
            }
          : undefined,
        [ROUTES.ContactProfile.path]: businessPermission.view
          ? {
              name: "Client CRM",
              url: (companyMentionTag) =>
                ROUTES.ClientManager.url(companyMentionTag),
            }
          : undefined,
        [ROUTES.DealProfile.path]: businessPermission.view
          ? {
              name: "Client CRM",
              url: (companyMentionTag) =>
                ROUTES.ClientManager.url(companyMentionTag),
            }
          : undefined,
        [ROUTES.JobDashboard.path]: recruiterPermission.view
          ? {
              name: "Jobs",
              url: (companyMentionTag) =>
                ROUTES.ViewJobs.url(companyMentionTag),
            }
          : undefined,
        [ROUTES.TempJobDashboard.path]: onlyRecruiterPermission.view
          ? {
              name: " Temp Jobs",
              url: (companyMentionTag) =>
                ROUTES.TempManager.url(companyMentionTag, "jobs"),
            }
          : hiringPermission
          ? {
              name: "Jobs",
              url: (companyMentionTag) =>
                ROUTES.ViewJobs.url(companyMentionTag),
            }
          : undefined,
        [ROUTES.VendorPage.path]: ownerAdminPermission.view
          ? {
              name: "Agencies",
              url: (companyMentionTag) => ROUTES.Vendors.url(companyMentionTag),
            }
          : undefined,
        [ROUTES.EmailProfile.path]: marketerPermission.view
          ? {
              name: "Marketing",
              url: (companyMentionTag) =>
                ROUTES.MarketingEmails.url(companyMentionTag),
            }
          : undefined,
        [ROUTES.TimesheetManager.path]: recruiterPermission.view
          ? {
              name: "Timesheet",
              url: (companyMentionTag) =>
                ROUTES.TimesheetManager.url(companyMentionTag),
            }
          : undefined,
      });
    }
  }, [store.role]);

  //SET THE CURRENT NAVBAR
  useEffect(() => {
    setTabs(menus[historyStore.current.match.path] || menus.main || []);
  }, [historyStore.current.match.path, menus]);

  useEffect(() => {
    if (store.company && store.role) {
      setMenus(menuGenerator(store));
    }
  }, [store.company, store.role]);

  //SET THE CURRENT BREADCRUMB IF PAGE IS A SUBNAV
  useEffect(() => {
    if (store.company) {
      if (submenuPages[historyStore.current.match.path]) {
        let lastValidPath = findLastPath();
        if (lastValidPath && ATSPages[lastValidPath.path]) {
          setBreadcrumb({
            name: lastValidPath.origin_name || "Back",
            url: () => `${lastValidPath.url}${lastValidPath.search || ""}`,
          });
        } else {
          setBreadcrumb(submenuPages[historyStore.current.match.path]);
        }
      } else if (breadcrumb) {
        setBreadcrumb(undefined);
      }
    }
  }, [
    historyStore.current.match.path,
    store.company,
    submenuPages,
    historyStore.state,
  ]);

  const findLastPath = () => {
    let lastValidPath;
    let index = 0;
    while (index < historyStore.state.length && !lastValidPath) {
      if (
        historyStore.state[index].url !== historyStore.current.match.url &&
        !(
          historyStore.state[index].path === ROUTES.JobDashboard?.path &&
          historyStore.current.match.path === ROUTES.TempJobDashboard?.path
        ) &&
        !(
          historyStore.state[index].path === ROUTES.TempJobDashboard?.path &&
          historyStore.current.match.path === ROUTES.JobDashboard?.path
        ) &&
        (historyStore.state.length <= 2 ||
          historyStore.state[index + 1]?.url !== historyStore.current.match.url)
      ) {
        lastValidPath = historyStore.state[index];
      }
      index++;
    }
    return lastValidPath;
  };

  return (
    <>
      {store.company && (
        <>
          <NavWrapper>
            <ATSContainer>
              <NavContainer className="leo-flex">
                <div>
                  <MobileMenu
                    breadcrumb={breadcrumb}
                    store={store}
                    tabs={tabs}
                    historyStore={historyStore}
                  />
                  <DesktopMenu
                    breadcrumb={breadcrumb}
                    store={store}
                    tabs={tabs}
                    historyStore={historyStore}
                  />
                </div>
                {store.allMyCompanies && store.allMyCompanies.length > 1 && (
                  <CompanySwitchMenu store={store} />
                )}
              </NavContainer>
            </ATSContainer>
          </NavWrapper>
          <NavPlaceholder />
        </>
      )}
    </>
  );
};

export default withRouter(ATSNavBar);

const MobileMenu = ({ breadcrumb, store, tabs, historyStore }) => {
  const [open, setOpen] = useState(false);
  return (
    <NavMobile className="leo-flex">
      {breadcrumb && (
        <BreadCrumbItem>
          <BreadCrumbLink
            onClick={() => {
              removeCurrentEntry(historyStore);
              scrollToTop();
            }}
            to={breadcrumb?.url(store.company.mention_tag)}
          >
            <img src={`${AWS_CDN_URL}/icons/BackArrow.svg`} alt="Back" />
          </BreadCrumbLink>
        </BreadCrumbItem>
      )}
      <NavButton onClick={() => setOpen(!open)} className="leo-flex">
        <img src={`${AWS_CDN_URL}/icons/icon-submenu-white.svg`} alt="Menu" />
        <span>
          {tabMap[historyStore.active_tab]
            ? tabMap[historyStore.active_tab](store.company)
            : ""}
        </span>
      </NavButton>
      {open && (
        <DropdownList>
          <ul>
            {tabs &&
              tabs.length > 0 &&
              tabs.map((tab, index) => (
                <NavItem key={`tab-${tab.param}-${index}`}>
                  <NavLink
                    onClick={() => {
                      scrollToTop();
                      setOpen(!open);
                    }}
                    className={`${
                      historyStore.active_tab === tab.param && "active"
                    }`}
                    to={tab.url(historyStore.current, store)}
                  >
                    {tab.name !== "Vendors"
                      ? tab.name === "Client CRM" && store.company?.id === 15538
                        ? "Productions"
                        : tab.name
                      : store.company.type === "Agency"
                      ? "Clients"
                      : "Agencies"}
                  </NavLink>
                  {tab.beta && (
                    <span className="badge-beta leo-relative">Beta</span>
                  )}
                  {tab.trial && (
                    <span className="badge-beta leo-relative">Trial</span>
                  )}
                </NavItem>
              ))}
          </ul>
        </DropdownList>
      )}
    </NavMobile>
  );
};

const DesktopMenu = ({ breadcrumb, tabs, store, historyStore }) => {
  console.log("tabs===>", tabs, "historyStore", historyStore)
  return (
    <NavList className="nav nav-pills nav-fill">
      {breadcrumb && (
        <BreadCrumbItem>
          <BreadCrumbLink
            onClick={() => {
              removeCurrentEntry(historyStore);
              scrollToTop();
            }}
            to={breadcrumb?.url(store.company.mention_tag)}
          >
            <img src={`${AWS_CDN_URL}/icons/BackArrow.svg`} alt="Back" />
            {breadcrumb.name}
          </BreadCrumbLink>
        </BreadCrumbItem>
      )}
      {tabs &&
        tabs.length > 0 &&
        tabs.map((tab, index) => (
          <NavItem key={`tab-${tab.param}-${index}`}>
            <NavLink
              className={`${historyStore.active_tab === tab.param && "active"}`}
              to={tab.url(historyStore.current, store)}
              onClick={scrollToTop}
            >
              {tab.name !== "Vendors"
                ? tab.name === "Client CRM" && store.company?.id === 15538
                  ? "Productions"
                  : tab.name
                : store.company.type === "Agency"
                ? "Clients"
                : "Agencies"}
              {tab.beta && (
                <span className="badge-beta leo-relative">Beta</span>
              )}
              {tab.trial && (
                <span className="badge-beta leo-relative">Trial</span>
              )}
            </NavLink>
          </NavItem>
        ))}
    </NavList>
  );
};

const CompanySwitchMenu = ({ store }) => {
  const {
    node,
    showSelect: openSwitch,
    setShowSelect: setOpenSwitch,
  } = useDropdown();
  const [val, setVal] = useState("");
  const [options, setOptions] = useState(store.allMyCompanies);

  useEffect(() => {
    if (store.allMyCompanies) {
      if (val === "") {
        setOptions(store.allMyCompanies);
      } else {
        setOptions(
          store.allMyCompanies.filter((comp) =>
            comp.name.toLowerCase().includes(val.toLowerCase())
          )
        );
      }
    } else {
      setOptions([]);
    }
  }, [store.allMyCompanies, val]);

  return (
    <div ref={node} className="leo-flex-center leo-relative">
      <CompanyButton
        onClick={() => setOpenSwitch(!openSwitch)}
        className="leo-flex"
      >
        <AvatarIcon
          name={store.company.name}
          imgUrl={store.company.avatar_url}
          size={20}
          className="avatar"
        />
        {store.company.name}
      </CompanyButton>
      {openSwitch && (
        <CompanyDropdownList>
          <ul>
            {store.allMyCompanies.length > 10 && (
              <CompanySearchInput
                value={val}
                onChange={(e) => setVal(e.target.value)}
                placeholder="Search company..."
              />
            )}
            {options.map((company, index) => (
              <Link
                onClick={() => setOpenSwitch(false)}
                to={ROUTES.CompanyDashboard.url(company.mention_tag)}
                key={`company-${index}`}
              >
                <li key={`company-${index}`} className="leo-flex">
                  <AvatarIcon
                    name={company.name}
                    imgUrl={company.avatar_url}
                    size={20}
                    className="avatar"
                  />
                  <span>{company.name}</span>
                </li>
              </Link>
            ))}
          </ul>
        </CompanyDropdownList>
      )}
    </div>
  );
};

const tabMap = {
  dashboard: () => "Dashboard",
  TalentNetwork: () => "Talent Network",
  jobs: () => "Jobs",
  vendors: (company) => (company.type === "Employer" ? "Agencies" : "Clients"),
  calendar: () => "Schedule",
  analytics: () => "Analytics",
  settings: () => "Settings",
  overview: () => "Overview",
  candidates: () => "Candidates",
  notes: () => "Notes",
  applicants: () => "Applicants",
};

const scrollToTop = () => {
  window.scrollTo(0, 0);
};

const NavWrapper = styled.div`
  background: #2a3744;
  border: 0;
  overflow: visible;
  top: 50px;
  box-shadow: none !important;
  margin: 0 !important;
  position: fixed !important;
  width: 100%;
  z-index: 2;
`;

const NavContainer = styled.div`
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  height: 50px;
  justify-content: space-between;
`;

const CompanyButton = styled.button`
  align-items: center;
  background: url(${AWS_CDN_URL}/icons/icon-chevron-small-white.svg) center
    right no-repeat transparent !important;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  min-width: 50px;
  padding-right: 18px;

  div {
    margin-right: 10px;
  }

  @media screen and (min-width: 768px) {
    margin-left: 10px;
  }
`;

const NavButton = styled.button`
  align-items: center;
  height: 30px;

  @media screen and (min-width: 768px) {
    display: none;
  }

  span {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    margin-left: 15px;
    text-transform: capitalize;
  }
`;

const NavMobile = styled.div`
  align-items: center;

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const DropdownList = styled.div`
  background: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  left: 0;
  padding: 5px 15px;
  position: absolute;
  right: 0;
  top: 50px;
  z-index: 12;

  li {
    margin: 10px 0 !important;

    a {
      color: #1e1e1e !important;
      font-size: 15px;
      opacity: 1;

      &:hover {
        color: #1e1e1e !important;
      }
    }
  }
`;

const CompanyDropdownList = styled(DropdownList)`
  border-radius: 4px;
  left: auto;
  max-height: 400px;
  overflow: hidden;
  overflow-y: auto;
  padding: 0;
  top: 30px;
  width: 200px;

  ul {
    width: 100%;
  }

  a {
    color: #1e1e1e;
    &:hover {
      text-decoration: none;
    }
  }

  li {
    margin: 0 !important;
    width: 100%;
    align-items: center;
    padding: 10px 15px;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 130px;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    div {
      margin-right: 10px;
      display: none;

      @media screen and (min-width: 768px) {
        display: flex;
      }
    }
  }
`;

const NavList = styled(Nav)`
  display: none !important;

  @media screen and (min-width: 768px) {
    display: flex !important;
  }
`;

const NavItem = styled.li`
  margin: 0 !important;

  &:not(:last-child) {
    margin-right: 25px !important;
  }
`;

const NavLink = styled(Link)`
  background-color: transparent !important;
  color: #fff !important;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.5;
  padding: 0 !important;
  margin: 0 !important;
  transition: opacity ease-in-out 0.25s;

  &:hover {
    background-color: transparent !important;
    color: #fff;
    opacity: 1;
    text-decoration: none;
  }

  &.active {
    opacity: 1;
  }

  .badge-beta {
    background: #35c3ae;
    border-radius: 12px;
    display: inline;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.7px;
    margin-left: 5px;
    padding: 3px 5px;
    text-transform: uppercase;
    top: -1px;
  }
`;

const BreadCrumbItem = styled(NavItem)`
  list-style: none;
`;

const BreadCrumbLink = styled(NavLink)`
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding-right: 25px !important;

  img {
    @media screen and (min-width: 768px) {
      margin-right: 15px;
    }
  }
`;

const NavPlaceholder = styled.div`
  height: 50px;
`;

const CompanySearchInput = styled.input`
  width: 100%;
  border: none;
  border-bottom: solid #eee 1px;
  height: 35px;
  padding: 10px;
`;
