import React from "react";
import SelectionActionBar, {
  SelectedCounter,
} from "sharedComponents/SelectionActionBar";
import QuickActionsMenuV3, {
  QuickActionsOption,
} from "sharedComponents/QuickActionsMenuV3";

const CompaniesActionBar = ({
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
          selectedText="Clients selected"
        />
        <div style={{ display: "flex" }}>
          {(store.role?.role_permissions.owner ||
            (store.role?.role_permissions.admin &&
              store.role?.role_permissions.business)) && (
            <QuickActionsMenuV3 disabled={false} style={{ marginLeft: "20px" }}>
              {(store.role?.role_permissions.owner ||
                (store.role?.role_permissions.admin &&
                  store.role?.role_permissions.business)) && (
                <QuickActionsOption
                  onClick={() => openModal("delete_companies_arr")}
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

export default CompaniesActionBar;
