import React, { useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { ROUTES } from "routes";
import { Link } from "react-router-dom";
import { PermissionChecker } from "constants/permissionHelpers";
import styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";

const CellMenuApplicant = (props) => {
  const store = useContext(GlobalContext);
  return (
    <Menu>
      <Dropdown.Toggle as={DropdownToggle} type="button">
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
      <Dropdown.Menu
        as="div"
        className="dropdown-new dropdown-menu dropdown-menu-right"
        style={{ top: "30px" }}
      >
        <PermissionChecker type="edit" valid={{ recruiter: true }}>
          <>
            {props.applicant && !props.applicant.submitted_to_client && (
              <DropdownItem className="dropdown-new-option">
                <button
                  className="dropdown-new-link"
                  onClick={() => {
                    if (props.submitCandidates) {
                      props.submitCandidates(props.applicant.applicant_id);
                    }
                  }}
                >
                  Submit Candidate
                  <span className="dropdown-new-subtext">
                    Submit this candidate to the client
                  </span>
                </button>
              </DropdownItem>
            )}
          </>
        </PermissionChecker>
        <PermissionChecker
          type="edit"
          valid={{ recruiter: true, hiring_manager: true }}
        >
          <DropdownItem className="dropdown-new-option">
            <Link
              className="dropdown-new-link"
              to={ROUTES.CandidateProfile.url(
                props.company.mention_tag,
                props.professional.professional_id
              )}
            >
              View Profile
              <span className="dropdown-new-subtext">
                {`View the Candidate's Profile`}
              </span>
            </Link>
          </DropdownItem>
        </PermissionChecker>
        {(store.role?.role_permissions.owner ||
          (store.role?.role_permissions.admin &&
            store.role?.role_permissions.recruiter)) && (
          <>
            {props.source !== "id" ? (
              <DropdownItem className="dropdown-new-option">
                <button
                  className="dropdown-new-link"
                  onClick={() => {
                    props.removeCandidate();
                  }}
                >
                  Remove Candidate
                  <span className="dropdown-new-subtext">
                    Remove from your network
                  </span>
                </button>
              </DropdownItem>
            ) : (
              ""
            )}
            {props.applicant && props.applicant.recruiter_id && (
              <DropdownItem className="dropdown-new-option">
                <button
                  className="dropdown-new-link"
                  onClick={() =>
                    props.setActiveApplicant(
                      props.index,
                      "confirmStatus",
                      "remove"
                    )
                  }
                >
                  Remove Candidate
                  <span className="dropdown-new-subtext">
                    Remove Candidate from this job
                  </span>
                </button>
              </DropdownItem>
            )}
          </>
        )}
      </Dropdown.Menu>
    </Menu>
  );
};

const Menu = styled(Dropdown)`
  margin: 0 auto;
  position: relative;
  width: 26px;
`;

const DropdownToggle = styled.button`
  align-items: center;
  height: 26px;
  width: 16px;
`;

const DropdownItem = styled(Dropdown.Item)`
  padding: 0;

  a:hover {
    text-decoration: none;
  }
`;

export default CellMenuApplicant;
