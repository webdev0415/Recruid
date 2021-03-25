import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ROUTES } from "routes";
import AvatarIcon from "sharedComponents/AvatarIcon";
import Dropdown from "react-bootstrap/Dropdown";
import { AWS_CDN_URL } from "constants/api";
const UserDropMenu = ({ name, username, avatarUrl, store }) => {
  return (
    <>
      <HeaderButtons className="leo-flex">
        {store.session && (
          <>
            <Link
              to={ROUTES.TasksManager.url(username)}
              className="leo-relative"
              style={{ marginRight: 20 }}
            >
              <img src={`${AWS_CDN_URL}/icons/TaskIndicator.svg`} alt="Tasks" />
              {store.totals?.uncompleted_tasks > 0 && (
                <NotificationBubble className="leo-flex">
                  {store.totals.uncompleted_tasks}
                </NotificationBubble>
              )}
            </Link>
          </>
        )}

        <Link to={ROUTES.Settings.url(username)}>
          <img src={`${AWS_CDN_URL}/icons/SettingsWheel.svg`} alt="Settings" />
        </Link>
        <HeaderDropdown className="dropdown leo-relative">
          <Dropdown.Toggle as="button" className="dropdown-toggle leo-flex">
            <AvatarIcon name={name} imgUrl={avatarUrl} size={"extraSmall"} />
            {/* <i className="fas fa-caret-down" /> */}
          </Dropdown.Toggle>
          <Dropdown.Menu
            as="div"
            className="dropdown-new dropdown-menu dropdown-menu-right"
            style={{ top: "35px" }}
          >
            <MenuTab
              url={ROUTES.ProfessionalProfileSettings.url(username)}
              title={"Edit Profile"}
            />
            <MenuTab url={ROUTES.Settings.url(username)} title={"Settings"} />
            <li className="dropdown-new-option" style={{ border: "0" }}>
              <button
                className="dropdown-new-link"
                onClick={() => {
                  window.Intercom("show");
                }}
              >
                Report a Bug
              </button>
            </li>
            {/*}<MenuTab
              url={"https://blog.recruitd.com"}
              title={"Resources"}
              external={true}
            />*/}
            <MenuTab url={ROUTES.ProfessionalLogoff.url()} title={"Logoff"} />
          </Dropdown.Menu>
        </HeaderDropdown>
      </HeaderButtons>
    </>
  );
};

const MenuTab = ({ url, title, external }) => {
  return (
    <DropdownItem className="dropdown-new-option">
      {!external ? (
        <InternalLink className="dropdown-new-link" to={url}>
          {title}
        </InternalLink>
      ) : (
        <ExternalLink
          className="dropdown-new-link"
          href={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {title}
        </ExternalLink>
      )}
    </DropdownItem>
  );
};

export default UserDropMenu;

const HeaderButtons = styled.div`
  align-items: center;

  a {
    display: block;
  }
`;

const HeaderDropdown = styled(Dropdown)`
  height: 30px;
  margin-left: 20px;

  @media screen and (min-width: 1024px) {
    height: auto;
  }

  .dropdown-toggle {
    align-items: center;
    height: 30px;
    justify-content: space-between;
    padding: 0;
    width: 30px;
  }

  i {
    color: #ffffff;
    font-size: 12px;
    position: absolute;
    right: 0;
  }
`;

const NotificationBubble = styled.div`
  align-items: center;
  background: #f27881;
  border-radius: 50%;
  color: #ffffff;
  font-size: 8px;
  font-weight: 600;
  height: 15px;
  justify-content: center;
  line-height: 1;
  position: absolute;
  right: -7px;
  top: -5px;
  width: 15px;
`;

const DropdownItem = styled(Dropdown.Item)`
  padding: 0;
  border: 0;
`;

const InternalLink = styled(Link)`
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`;

const ExternalLink = styled(Link)`
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`;
