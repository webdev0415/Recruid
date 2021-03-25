import React from "react";
import styled from "styled-components";
import spacetime from "spacetime";
import Dropdown from "react-bootstrap/Dropdown";

import {
  CandidateDetails,
  CandidateName,
  CandidateTitle,
  HeaderLeft,
  HeaderRight,
  HeaderWrapper,
  HeaderContainer,
} from "components/Profiles/components/ProfileComponents";
import { PermissionChecker } from "constants/permissionHelpers";
import { ATSContainer } from "styles/PageContainers";
const EmailHeader = ({
  stats,
  email,
  removeEmail,
  setActiveModal,
  archiveEmail,
  store,
}) => {
  return (
    <HeaderWrapper>
      <ATSContainer>
        <HeaderContainer style={{ height: 102 }}>
          <HeaderLeft style={{ alignItems: "center" }}>
            <CandidateDetails style={{ margin: 0 }}>
              <CandidateName>{email?.subject || ""} </CandidateName>
              {!email.is_draft ? (
                <CandidateTitle>
                  {spacetime(email?.updated_at).format(
                    "{date} {month-short}, {year} {hour-24-pad}:{minute-pad}"
                  )}{" "}
                </CandidateTitle>
              ) : (
                <CandidateTitle>
                  {spacetime(email?.created_at).format(
                    "{date} {month-short}, {year} {hour-24-pad}:{minute-pad}"
                  )}{" "}
                </CandidateTitle>
              )}
            </CandidateDetails>
            {email.is_draft ? (
              <DraftButton>Draft</DraftButton>
            ) : (
              <DraftButton>Sent</DraftButton>
            )}
            {email.archived && <ArchiveButton>Archived</ArchiveButton>}
          </HeaderLeft>
          <HeaderRight>
            <div className="leo-flex-center">
              {!email.is_draft && (
                <>
                  <AnalyticsBox>
                    <h3>Sent</h3>
                    <h2>{email?.receivers.length}</h2>
                  </AnalyticsBox>
                  <AnalyticsBox>
                    <h3>Open Rate</h3>
                    <h2>
                      {stats?.unique_opens
                        ? Math.round(
                            (stats?.unique_opens * 100) /
                              email?.receivers.length
                          )
                        : "0"}
                      %
                    </h2>
                  </AnalyticsBox>
                  <AnalyticsBox>
                    <h3>Click Rate</h3>
                    <h2>
                      {stats?.unique_clicks
                        ? Math.round(
                            (stats?.unique_clicks * 100) /
                              email?.receivers.length
                          )
                        : "0"}
                      %
                    </h2>
                  </AnalyticsBox>
                </>
              )}
              <PermissionChecker type="edit" valid={{ marketer: true }}>
                <Dropdown>
                  <Dropdown.Toggle
                    as="button"
                    className="button button--default button--blue-dark"
                    type="button"
                  >
                    Actions <li className="fas fa-caret-down" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    className="dropdown-new dropdown-menu dropdown-menu-right"
                    style={{ top: "40px" }}
                  >
                    {email.is_draft && (
                      <DropdownItem className="dropdown-new-option">
                        <button
                          className="dropdown-new-link"
                          onClick={() => setActiveModal("edit-email")}
                        >
                          Edit Email
                          <span className="dropdown-new-subtext">
                            Change email draft
                          </span>
                        </button>
                      </DropdownItem>
                    )}
                    {email.is_draft && (
                      <DropdownItem className="dropdown-new-option">
                        <button
                          className="dropdown-new-link"
                          onClick={() => setActiveModal("confirm-send")}
                        >
                          Send Email
                          <span className="dropdown-new-subtext">
                            Send the email directly
                          </span>
                        </button>
                      </DropdownItem>
                    )}
                    <DropdownItem className="dropdown-new-option">
                      <button
                        className="dropdown-new-link"
                        onClick={() => archiveEmail()}
                      >
                        {email.archived ? "Unarchive email" : "Archive Email"}
                      </button>
                    </DropdownItem>
                    {(store.role?.role_permissions.owner ||
                      (store.role?.role_permissions.admin &&
                        store.role?.role_permissions.marketer)) && (
                      <DropdownItem className="dropdown-new-option">
                        <button
                          className="dropdown-new-link"
                          onClick={() => removeEmail()}
                        >
                          Delete email
                        </button>
                      </DropdownItem>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </PermissionChecker>
            </div>
          </HeaderRight>
        </HeaderContainer>
      </ATSContainer>
    </HeaderWrapper>
  );
};

export default EmailHeader;

const AnalyticsBox = styled.div`
  margin-right: 40px;
  text-align: end;

  h2 {
    font-weight: 500;
    font-size: 16px;
  }

  h3 {
    font-size: 12px;
    color: #74767b;
  }
`;

const DraftButton = styled.div`
  background: #35c3ae;
  border-radius: 15px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  margin-left: 20px;
  padding: 7px 10px;
`;
const ArchiveButton = styled.div`
  background: #bab1ab;
  border-radius: 15px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  margin-left: 20px;
  padding: 7px 10px;
`;

const DropdownItem = styled(Dropdown.Item)`
  padding: 0;
`;
