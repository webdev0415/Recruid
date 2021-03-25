import React from "react";
import TimeAgo from "react-timeago";
import {
  CandidateDetails,
  CandidateName,
  CandidateTitle,
  HeaderLeft,
  HeaderRight,
  HeaderWrapper,
  HeaderContainer,
} from "components/Profiles/components/ProfileComponents";
import ActionsMenu from "sharedComponents/ActionCreator/ActionsMenu";
import { PermissionChecker } from "constants/permissionHelpers";

import AvatarIcon from "sharedComponents/AvatarIcon";
import EditButtons from "components/Profiles/components/EditButtons";
import EditableContent from "components/Profiles/components/EditableContent";
import { ATSContainer } from "styles/PageContainers";

const DealHeader = ({
  company,
  deal,
  setDeal,
  editSection,
  triggerEditSection,
  cancelEdit,
  saveDeal,

  actionType,
  setActionType,
  actionTotals,

  permission,
}) => {
  return (
    <HeaderWrapper>
      <ATSContainer>
        <HeaderContainer>
          <HeaderLeft>
            {company?.company && (
              <div style={{ marginRight: 15 }}>
                <AvatarIcon
                  name={company && company.company.name}
                  imgUrl={company && company.company.avatar}
                  size="50"
                />
              </div>
            )}
            <CandidateDetails style={{ margin: 0 }}>
              <EditableContent
                value={deal.name}
                headerName={true}
                type={"text"}
                editing={editSection === "header"}
                onChange={(e) => setDeal({ ...deal, name: e.target.value })}
              >
                <CandidateName>{deal.name}</CandidateName>
              </EditableContent>
              <CandidateTitle>
                {deal.created_by && <>Created by {deal.created_by}</>}
                {company?.company && <> · {company.company.name}</>}
                {deal.created_at && (
                  <>
                    {" "}
                    · <TimeAgo date={deal.created_at} />
                  </>
                )}
              </CandidateTitle>
            </CandidateDetails>
            <PermissionChecker type="edit" valid={{ business: true }}>
              <EditButtons
                style={{ right: "-50px" }}
                editing={editSection === "header"}
                onClickEdit={() => triggerEditSection("header")}
                onClickCancel={cancelEdit}
                onClickSave={() => saveDeal()}
                className="leo-absolute"
              />
            </PermissionChecker>
          </HeaderLeft>
          <HeaderRight>
            <ActionsMenu
              actionType={actionType}
              setActionType={setActionType}
              actionTotals={actionTotals}
              showDropdown={permission.edit}
            />
          </HeaderRight>
        </HeaderContainer>
      </ATSContainer>
    </HeaderWrapper>
  );
};

export default DealHeader;
