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
const ContactsActionBar = ({
  selectedTotal,
  store,
  openModal,
  activeModal,
}) => {
  return (
    <SelectionActionBar selectedTotal={selectedTotal} activeModal={activeModal}>
      <div className="leo-flex-center-between">
        <SelectedCounter
          selectedTotal={selectedTotal}
          selectedText="Contacts selected"
        />
        <div className="leo-flex">
          <PermissionChecker type="edit" valid={{ marketer: true }}>
            <STAppButton
              className="leo-flex-center"
              theme="light-blue"
              onClick={() => openModal("create-email")}
            >
              <img src={`${AWS_CDN_URL}/icons/WhiteEmail.svg`} alt="" />
              Send Email
            </STAppButton>
          </PermissionChecker>
          {(store.role?.role_permissions.owner ||
            (store.role?.role_permissions.admin &&
              store.role?.role_permissions.business) ||
            store.role?.role_permissions.marketer) && (
            <QuickActionsMenuV3 disabled={false} style={{ marginLeft: "20px" }}>
              <PermissionChecker type="edit" valid={{ marketer: true }}>
                <QuickActionsOption
                  onClick={() => openModal("create_list_from_contacts")}
                >
                  Add to a new list
                </QuickActionsOption>
                <QuickActionsOption
                  onClick={() => openModal("add_contacts_to_list")}
                >
                  Add to existing list
                </QuickActionsOption>
              </PermissionChecker>
              {(store.role?.role_permissions.owner ||
                (store.role?.role_permissions.admin &&
                  store.role?.role_permissions.business)) && (
                <QuickActionsOption
                  onClick={() => openModal("delete_contacts_arr")}
                >
                  Delete Selected
                </QuickActionsOption>
              )}
            </QuickActionsMenuV3>
          )}
        </div>
      </div>
    </SelectionActionBar>
  );
};

export default ContactsActionBar;

const STAppButton = styled(AppButton)`
  margin-left: 20px;
  img {
    margin-right: 5px;
  }
`;
