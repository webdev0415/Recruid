import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "routes";
import Dropdown from "react-bootstrap/Dropdown";
import generalStyles from "./style/general.module.scss";
import styled from "styled-components";

const MyCompaniesMenu = ({ company }) => {
  return (
    <Dropdown className={generalStyles.menu}>
      <Dropdown.Toggle
        as="button"
        className={generalStyles.menuButton}
        type="button"
      >
        <svg
          width="16"
          height="4"
          viewBox="0 0 16 4"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 4a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM2 4a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm12 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
            fill="#9A9CA1"
            fill-role="nonzero"
          />
        </svg>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-new dropdown-menu dropdown-menu-right">
        <DropdownItem className="dropdown-new-option">
          <Link
            className="dropdown-new-link"
            to={ROUTES.TalentNetwork.url(company.mention_tag)}
            title="Talent Network"
          >
            Talent Network
            <span className="dropdown-new-subtext">
              View your Candidate Database
            </span>
          </Link>
        </DropdownItem>
        <DropdownItem className="dropdown-new-option">
          <span className="dropdown-new-link">
            Analytics
            <span className="dropdown-new-subtext">
              View and Export your Analytics
            </span>
          </span>
        </DropdownItem>
        <DropdownItem className="dropdown-new-option">
          <Link
            className="dropdown-new-link"
            to={ROUTES.ViewJobs.url(company.mention_tag)}
          >
            Jobs
            <span className="dropdown-new-subtext">Manage and Create Jobs</span>
          </Link>
        </DropdownItem>
        {/*<li className="dropdown-new-option">
          <a className="dropdown-new-link">
            Agency Centre
              <span className="dropdown-new-subtext">Manage your Agencies</span>
          </a>
        </li>*/}
        {/*<li className="dropdown-new-option">
          <a className="dropdown-new-link">
            Payment Centre
              <span className="dropdown-new-subtext">Manage your Payments</span>
          </a>
        </li>*/}
        <DropdownItem className="dropdown-new-option">
          <Link
            className="dropdown-new-link"
            to={ROUTES.TeamView.url(company.mention_tag, "team")}
          >
            Team Centre
            <span className="dropdown-new-subtext">Manage your Team</span>
          </Link>
        </DropdownItem>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const DropdownItem = styled(Dropdown.Item)`
  padding: 0;

  a:hover {
    text-decoration: none;
  }
`;

export default MyCompaniesMenu;
