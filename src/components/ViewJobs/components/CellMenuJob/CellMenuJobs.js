import React, { useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { ROUTES } from "routes";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";
import generalStyles from "./style/general.module.scss";
import { CAREERS_PORTAL_URL } from "constants/api";

const CellMenuApplicant = (props) => {
  const store = useContext(GlobalContext);
  return (
    <Dropdown className={generalStyles.menu}>
      <Dropdown.Toggle as="button" type="button" id="job-cell-menu">
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
      <DropdownMenu
        className="dropdown-new dropdown-menu dropdown-menu-right"
        style={{ top: "30px" }}
      >
        {props.job &&
          props.job.job_status !== "awaiting for review" &&
          props.job.job_status !== "declined" && (
            <DropdownItem className="dropdown-new-option" as="div">
              <button
                className="dropdown-new-link"
                onClick={() => {
                  props.setActiveJob(props.job);
                  props.setActiveModal("duplicate-job");
                }}
              >
                Duplicate Job
              </button>
            </DropdownItem>
          )}
        <DropdownItem className="dropdown-new-option" as="div">
          <Link
            className="dropdown-new-link"
            to={ROUTES.JobEdit.url(props.mentionTag, props.job.title_slug)}
          >
            Edit Job
          </Link>
        </DropdownItem>
        <DropdownItem className="dropdown-new-option">
          <Link
            className="dropdown-new-link"
            to={ROUTES.JobDashboard.url(props.mentionTag, props.job.title_slug)}
          >
            Job Dashboard
          </Link>
        </DropdownItem>
        {props.job.job_post_type === "public" && !props.job.is_draft && (
          <>
            <DropdownItem className="dropdown-new-option" as="div">
              <a
                className="dropdown-new-link"
                href={`${CAREERS_PORTAL_URL}/${props.mentionTag}/${props.job.title_slug}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                View Job
              </a>
            </DropdownItem>
            <DropdownItem className="dropdown-new-option" as="div">
              <button
                className="dropdown-new-link"
                onClick={() => {
                  props.setActiveJob(props.job);
                  props.setActiveModal("share-job-social");
                }}
              >
                Share Job
              </button>
            </DropdownItem>
          </>
        )}
        {(store.role?.role_permissions.owner ||
          (store.role?.role_permissions.admin &&
            store.role?.role_permissions.recruiter) ||
          (props.job.is_draft &&
            (store.role?.role_permissions.recruiter ||
              store.role?.role_permissions.hiring_manager))) && (
          <DropdownItem className="dropdown-new-option">
            <button
              className="dropdown-new-link"
              onClick={() => props.deleteJob()}
            >
              Delete Job
            </button>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default CellMenuApplicant;

const DropdownItem = styled(Dropdown.Item)`
  padding: 0;
  font-weight: normal;
  font-size: 11px;
  line-height: 13px;
  padding: 10px 15px !important;
  border: none;
  &:hover {
    background: none !important;
  }

  .dropdown-new-link {
    padding: 0 !important;
    font-weight: normal;
    font-size: 11px;
    line-height: 13px;
    color: rgba(116, 118, 123, 0.66) !important;
    background: none;

    &:hover {
      color: #2a3744 !important;
      background: none !important;
    }
  }

  a:hover {
    text-decoration: none;
  }
`;

const DropdownMenu = styled(Dropdown.Menu)`
  background: #ffffff;
  border: 1px solid #d4dfea;
  border-radius: 4px;
`;
