import React, { useState, useEffect } from "react";
import styled from "styled-components";

import {
  permissionExchanger,
  rolesExchanger,
} from "constants/permissionHelpers";

const PermissionScreen = ({
  permission,
  setPermission,
  roles,
  setRoles,
  store,
}) => {
  const [permissionOptions, setPermissionOptions] = useState([]);

  useEffect(() => {
    if (store.role) {
      if (store.role?.role_permissions?.master_owner) {
        setPermissionOptions(["owner", "admin", "manager", "member"]);
      } else if (store.role?.role_permissions?.owner) {
        setPermissionOptions(["admin", "manager", "member"]);
      } else if (store.role?.role_permissions?.admin) {
        setPermissionOptions(["manager", "member"]);
      } else if (store.role?.role_permissions?.manager) {
        setPermissionOptions(["member"]);
      }
    }
  }, [store.role]);

  // useEffect(() => {
  //   if (permission !== "member" && roles.hiring_manager) {
  //     setRoles({ ...roles, hiring_manager: false });
  //   }
  //    
  // }, [permission, roles]);

  return (
    <>
      <PermissionTitle>Permission Level</PermissionTitle>
      <PermissionFlex>
        {permissionOptions.length > 1 ? (
          <STSelect
            name="permission"
            className="form-control form-control-select"
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
          >
            <option value="" disabled hidden>
              Please select permission level
            </option>
            {permissionOptions.map((option, index) => (
              <option value={option} key={`permission-level-option-${index}`}>
                {permissionExchanger[store.company.id]
                  ? permissionExchanger[store.company.id][option]
                  : permissionExchanger.default[option]}
              </option>
            ))}
          </STSelect>
        ) : (
          <p>{permissionOptions.length === 1 && permissionOptions[0].name}</p>
        )}
        <ExplanationBox>
          <p>
            {permissionExchanger[store.company.id]
              ? permissionExchanger[store.company.id].owner
              : permissionExchanger.default.owner}
            s can do anything in the application except for assigning other
            owners, only the master owner can.
          </p>
          <p>
            {permissionExchanger[store.company.id]
              ? permissionExchanger[store.company.id].admin
              : permissionExchanger.default.admin}
            s can view all the data on the platform but can only
            Create/Edit/Delete the area they are assigned to below.
          </p>
          <p>
            {permissionExchanger[store.company.id]
              ? permissionExchanger[store.company.id].manager
              : permissionExchanger.default.manager}
            s can associate team members with themselves, manage and view all
            associated team members performance and activity
          </p>
          <p>
            {permissionExchanger[store.company.id]
              ? permissionExchanger[store.company.id].member
              : permissionExchanger.default.member}
            s can View/Create/Edit the area they are assigned to, but are unable
            to delete data from the platform.
          </p>
        </ExplanationBox>
      </PermissionFlex>
      <PermissionTitle>Roles</PermissionTitle>
      <PermissionFlex>
        <div>
          <STSelect
            name="role"
            className="form-control form-control-select"
            value=""
            onChange={(e) => setRoles({ ...roles, [e.target.value]: true })}
          >
            <option value="" disabled hidden>
              Select a role to Add...
            </option>
            <option value="recruiter">
              {rolesExchanger[store.company.id]
                ? rolesExchanger[store.company.id].recruiter
                : rolesExchanger.default.recruiter}
            </option>
            <option value="hiring_manager">
              {rolesExchanger[store.company.id]
                ? rolesExchanger[store.company.id].hiring_manager
                : rolesExchanger.default.hiring_manager}
            </option>
            {store.company.type !== "Employer" && (
              <option value="business">
                {rolesExchanger[store.company.id]
                  ? rolesExchanger[store.company.id].business
                  : rolesExchanger.default.business}
              </option>
            )}
            <option value="marketer">
              {rolesExchanger[store.company.id]
                ? rolesExchanger[store.company.id].marketer
                : rolesExchanger.default.marketer}
            </option>
          </STSelect>
          <TagsContainer>
            {roles.recruiter && (
              <Tag onClick={() => setRoles({ ...roles, recruiter: false })}>
                {rolesExchanger[store.company.id]
                  ? rolesExchanger[store.company.id].recruiter
                  : rolesExchanger.default.recruiter}
                <CloseSpan>
                  <i className="fas fa-times"></i>
                </CloseSpan>
              </Tag>
            )}
            {roles.hiring_manager && (
              <Tag
                onClick={() => setRoles({ ...roles, hiring_manager: false })}
              >
                {rolesExchanger[store.company.id]
                  ? rolesExchanger[store.company.id].hiring_manager
                  : rolesExchanger.default.hiring_manager}
                <CloseSpan>
                  <i className="fas fa-times"></i>
                </CloseSpan>
              </Tag>
            )}
            {roles.business && (
              <Tag onClick={() => setRoles({ ...roles, business: false })}>
                {rolesExchanger[store.company.id]
                  ? rolesExchanger[store.company.id].business
                  : rolesExchanger.default.business}
                <CloseSpan>
                  <i className="fas fa-times"></i>
                </CloseSpan>
              </Tag>
            )}
            {roles.marketer && (
              <Tag onClick={() => setRoles({ ...roles, marketer: false })}>
                {rolesExchanger[store.company.id]
                  ? rolesExchanger[store.company.id].marketer
                  : rolesExchanger.default.marketer}
                <CloseSpan>
                  <i className="fas fa-times"></i>
                </CloseSpan>
              </Tag>
            )}
          </TagsContainer>
        </div>
        <ExplanationBox>
          <p>
            {rolesExchanger[store.company.id]
              ? rolesExchanger[store.company.id].recruiter
              : rolesExchanger.default.recruiter}
            s have access to Candidates, Jobs, Analytics and the Schedule.
          </p>
          {store.company?.type === "Agency" && (
            <p>
              {rolesExchanger[store.company.id]
                ? rolesExchanger[store.company.id].business
                : rolesExchanger.default.business + "s"}{" "}
              have access to the Client CRM and the Schedule.
            </p>
          )}
          <p>
            {rolesExchanger[store.company.id]
              ? rolesExchanger[store.company.id].hiring_manager
              : rolesExchanger.default.hiring_manager}
            s can be added to a job, view candidates and move through job
            pipelines
          </p>
          <p>
            {rolesExchanger[store.company.id]
              ? rolesExchanger[store.company.id].marketer
              : rolesExchanger.default.marketer}
            s have access to the Marketing section.
          </p>
        </ExplanationBox>
      </PermissionFlex>
    </>
  );
};

export default PermissionScreen;

const PermissionTitle = styled.h4`
  color: #74767b;
  font-size: 14px;
  margin-bottom: 10px;
`;

const PermissionFlex = styled.div`
  align-items: start;
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: repeat(2, 1fr);

  &:not(:last-child) {
    margin-bottom: 30px;
  }
`;

const ExplanationBox = styled.div`
  p {
    color: #74767b;
    font-size: 12px;
    line-height: 15px;

    &:not(:last-child) {
      margin-bottom: 15px;
    }
  }
`;

const STSelect = styled.select`
  min-width: 250px !important;
  max-width: 250px !important;
  width: 250px !important;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const Tag = styled.span`
  background: gray;
  padding: 5px 30px 5px 10px;
  color: white;
  border-radius: 4px;
  position: relative;
  word-break: break-all;
  margin-bottom: 5px;
  width: max-content;
  margin-right: 5px;
`;
const CloseSpan = styled.button`
  position: absolute;
  background: none;
  top: 0;
  right: 0;
  height: 100%;
  margin-right: 5px;
  color: white;

  i {
    background: none !important;
  }
`;
