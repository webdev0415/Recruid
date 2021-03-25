import React from "react";
import SelectionActionBar, {
  SelectedCounter,
} from "sharedComponents/SelectionActionBar";
import styled from "styled-components";
import QuickActionsMenuV3, {
  QuickActionsOption,
} from "sharedComponents/QuickActionsMenuV3";

const TasksActionBar = ({
  selectedTotal,
  store,
  openModal,
  activeModal,
  setMultipleStatus,
}) => {
  return (
    <SelectionActionBar selectedTotal={selectedTotal} activeModal={activeModal}>
      <ActionFlexer>
        <SelectedCounter
          selectedTotal={selectedTotal}
          selectedText="Tasks selected"
        />
        <div style={{ display: "flex" }}>
          <QuickActionsMenuV3 disabled={false} style={{ marginLeft: "20px" }}>
            <QuickActionsOption onClick={() => setMultipleStatus(true)}>
              Mark Completed
            </QuickActionsOption>
            <QuickActionsOption onClick={() => setMultipleStatus(false)}>
              Mark Incompleted
            </QuickActionsOption>
            {(store.role?.role_permissions.owner ||
              store.role?.role_permissions.admin) && (
              <QuickActionsOption
                onClick={() => openModal("delete-multiple-tasks")}
              >
                Delete Selected
              </QuickActionsOption>
            )}
          </QuickActionsMenuV3>
        </div>
      </ActionFlexer>
    </SelectionActionBar>
  );
};

export default TasksActionBar;

const ActionFlexer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
