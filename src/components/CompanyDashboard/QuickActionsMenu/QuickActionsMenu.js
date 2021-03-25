import React, { Component, useContext } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "routes";
import GlobalContext from "contexts/globalContext/GlobalContext";
import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";
import { PermissionChecker } from "constants/permissionHelpers";

const Hook = (props) => {
  const store = useContext(GlobalContext);
  return <CellMenuApplicant {...props} {...store} />;
};

class CellMenuApplicant extends Component {
  render() {
    return (
      <Dropdown>
        <Dropdown.Toggle
          as="button"
          className="button button--default button--blue-dark"
          type="button"
        >
          Quick Actions <li className="fas fa-caret-down" />
        </Dropdown.Toggle>

        <Dropdown.Menu
          className="dropdown-new dropdown-menu dropdown-menu-right"
          as="div"
        >
          <PermissionChecker type="edit" valid={{ recruiter: true }}>
            <DropdownItem className="dropdown-new-option">
              <button
                className="dropdown-new-link"
                onClick={() => this.props.openModal("addTalent")}
              >
                Add Talent
                <span className="dropdown-new-subtext">
                  Add talent to your network
                </span>
              </button>
            </DropdownItem>
          </PermissionChecker>
          <PermissionChecker
            type="edit"
            valid={{ recruiter: true, hiring_manager: true }}
          >
            {this.props.company &&
              this.props.company.id !== 15265 &&
              this.props.company.id !== 15266 &&
              this.props.company.id !== 15275 && (
                <>
                  <DropdownItem className="dropdown-new-option">
                    <Link
                      className="dropdown-new-link"
                      to={ROUTES.JobCreation.url(
                        this.props.company.mention_tag
                      )}
                    >
                      Create Job
                      <span className="dropdown-new-subtext">
                        Create a job on Leo
                      </span>
                    </Link>
                  </DropdownItem>
                </>
              )}
          </PermissionChecker>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
const DropdownItem = styled(Dropdown.Item)`
  padding: 0;
  a {
    text-decoration: none;
  }
`;

export default Hook;
