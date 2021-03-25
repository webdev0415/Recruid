import React from "react";
import SelectionActionBar, {
  SelectedCounter,
} from "sharedComponents/SelectionActionBar";
import styled from "styled-components";
import QuickActionsMenuV3, {
  QuickActionsOption,
} from "sharedComponents/QuickActionsMenuV3";
import AppButton from "styles/AppButton";
import { AWS_CDN_URL } from "constants/api";
const MarketingReceiversTab = ({
  selectedTotal,
  store,
  openModal,
  activeModal,
  prepareEmailReceivers,
}) => {
  return (
    <SelectionActionBar selectedTotal={selectedTotal} activeModal={activeModal}>
      <div className="leo-flex-center-between">
        <SelectedCounter
          selectedTotal={selectedTotal}
          selectedText="Lists selected"
        />
        <div style={{ display: "flex" }}>
          <STAppButton
            className="leo-flex-center"
            theme="light-blue"
            onClick={() => prepareEmailReceivers()}
          >
            <img src={`${AWS_CDN_URL}/icons/WhiteEmail.svg`} alt="" />
            Send Email
          </STAppButton>
          {(store.role?.role_permissions.owner ||
            (store.role?.role_permissions.admin &&
              store.role?.role_permissions.marketer)) && (
            <QuickActionsMenuV3 disabled={false} style={{ marginLeft: "20px" }}>
              <QuickActionsOption onClick={() => openModal("delete-multiple")}>
                Delete Selected
              </QuickActionsOption>
            </QuickActionsMenuV3>
          )}
        </div>
      </div>
    </SelectionActionBar>
  );
};

export default MarketingReceiversTab;

const STAppButton = styled(AppButton)`
  margin-left: 20px;
  svg,
  img {
    margin-right: 5px;
  }
`;
