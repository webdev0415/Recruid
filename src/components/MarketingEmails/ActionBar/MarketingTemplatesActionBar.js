import React from "react";
import SelectionActionBar, {
  SelectedCounter,
} from "sharedComponents/SelectionActionBar";
import QuickActionsMenuV3, {
  QuickActionsOption,
} from "sharedComponents/QuickActionsMenuV3";
import { PermissionChecker } from "constants/permissionHelpers";

const MarketingTemplatesActionBar = ({
  selectedFolders,
  selectedTemplates,
  store,
  openModal,
  activeModal,
}) => {
  return (
    <SelectionActionBar
      selectedTotal={selectedFolders + selectedTemplates}
      activeModal={activeModal}
    >
      <div className="leo-flex-center-between">
        <div className="leo-flex-center-between">
          <SelectedCounter
            selectedTotal={selectedFolders}
            selectedText="Folders selected"
          />
          <SelectedCounter
            selectedTotal={selectedTemplates}
            selectedText="Templates selected"
          />
        </div>
        <div style={{ display: "flex" }}>
          <PermissionChecker valid={{ marketer: true }} type="view">
            <QuickActionsMenuV3 disabled={false} style={{ marginLeft: "20px" }}>
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

export default MarketingTemplatesActionBar;
