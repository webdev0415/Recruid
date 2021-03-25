import React from "react";
import SelectionActionBar, {
  SelectedCounter,
} from "sharedComponents/SelectionActionBar";
import styled from "styled-components";
import QuickActionsMenuV3, {
  QuickActionsOption,
} from "sharedComponents/QuickActionsMenuV3";
import { PermissionChecker } from "constants/permissionHelpers";
import AppButton from "styles/AppButton";
import { AWS_CDN_URL } from "constants/api";
const ApplicantsActionBar = ({
  selectedTotal,
  store,
  openModal,
  activeModal,
}) => {
  return (
    <SelectionActionBar selectedTotal={selectedTotal} activeModal={activeModal}>
      <ActionFlexer>
        <SelectedCounter
          selectedTotal={selectedTotal}
          selectedText="Candidates selected"
        />
        <div style={{ display: "flex" }}>
          <PermissionChecker type="edit" valid={{ marketer: true }}>
            <STAppButton
              theme="light-blue"
              onClick={() => openModal("create-email")}
            >
              <img src={`${AWS_CDN_URL}/icons/WhiteEmail.svg`} alt="" />
              Send Email
            </STAppButton>
          </PermissionChecker>
          {(store.role?.role_permissions.owner ||
            (store.role?.role_permissions.admin &&
              store.role?.role_permissions.recruiter) ||
            store.role?.role_permissions.marketer) && (
            <QuickActionsMenuV3 disabled={false} style={{ marginLeft: "20px" }}>
              <PermissionChecker type="edit" valid={{ marketer: true }}>
                <QuickActionsOption
                  onClick={() => openModal("create_list_from_candidates")}
                >
                  Add to a new list
                </QuickActionsOption>
                <QuickActionsOption
                  onClick={() => openModal("add_candidates_to_list")}
                >
                  Add to existing list
                </QuickActionsOption>
              </PermissionChecker>
              {(store.role?.role_permissions.owner ||
                (store.role?.role_permissions.admin &&
                  store.role?.role_permissions.recruiter)) && (
                <QuickActionsOption
                  onClick={() => openModal("delete-multiple")}
                >
                  Delete Selected
                </QuickActionsOption>
              )}
            </QuickActionsMenuV3>
          )}
        </div>
      </ActionFlexer>
    </SelectionActionBar>
  );
};

export default ApplicantsActionBar;

const ActionFlexer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STAppButton = styled(AppButton)`
  display: flex;
  align-items: center;
  margin-left: 20px;
  svg,
  img {
    margin-right: 5px;
  }
`;
