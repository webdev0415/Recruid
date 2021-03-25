import React from "react";
import SelectionActionBar, {
  SelectedCounter,
} from "sharedComponents/SelectionActionBar";
import QuickActionsMenuV3, {
  QuickActionsOption,
} from "sharedComponents/QuickActionsMenuV3";
import { PermissionChecker } from "constants/permissionHelpers";

const MarketingEmailsActionBar = ({
  selectedTotal,
  store,
  openModal,
  activeModal,
  archiveState,
}) => {
  return (
    <SelectionActionBar selectedTotal={selectedTotal} activeModal={activeModal}>
      <div className="leo-flex-center-between">
        <SelectedCounter
          selectedTotal={selectedTotal}
          selectedText="Emails selected"
        />
        <div style={{ display: "flex" }}>
          <PermissionChecker valid={{ marketer: true }} type="view">
            <QuickActionsMenuV3 disabled={false} style={{ marginLeft: "20px" }}>
              <QuickActionsOption onClick={() => openModal("archive-multiple")}>
                {archiveState ? "Unarchive selected" : "Archive selected"}
              </QuickActionsOption>
              {(store.role?.role_permissions.owner ||
                (store.role?.role_permissions.admin &&
                  store.role?.role_permissions.marketer)) && (
                <QuickActionsOption
                  onClick={() => openModal("delete-multiple")}
                >
                  Delete Selected
                </QuickActionsOption>
              )}
            </QuickActionsMenuV3>
          </PermissionChecker>
        </div>
      </div>
    </SelectionActionBar>
  );
};

export default MarketingEmailsActionBar;
