import React from "react";

import AvatarComponent from "components/Profiles/components/AvatarComponent";
// import AvatarIcon from "sharedComponents/AvatarIcon";
import EditableContent from "components/Profiles/components/EditableContent";
import EditButtons from "components/Profiles/components/EditButtons";
import TimeAgo from "react-timeago";
import ActionsMenu from "sharedComponents/ActionCreator/ActionsMenu";
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

const CompanyHeader = ({
  profileCompany,
  setProfileCompany,
  editSection,
  triggerEditSection,
  cancelEdit,
  saveProfileCompany,
  greyBg,

  actionType,
  setActionType,
  actionTotals,
  sendToOverview,

  permission,
}) => {
  const updateAvatar = (newAvatar) => {
    saveProfileCompany({
      ...profileCompany,
      client_layer: {
        avatar: newAvatar?.avatar || null,
        avatar_name: newAvatar?.avatar_name || null,
        avatar_data: newAvatar?.avatar_data || null,
      },
    });
  };

  return (
    <HeaderWrapper className={greyBg && "grey"}>
      <ATSContainer>
        <HeaderContainer className={greyBg && "grey"}>
          <HeaderLeft>
            <AvatarComponent
              name={profileCompany.name}
              avatar={profileCompany.avatar}
              updateAvatar={updateAvatar}
            />
            <CandidateDetails>
              <EditableContent
                value={profileCompany.name}
                type={"text"}
                editing={editSection === "header"}
                headerName={true}
                onChange={(e) =>
                  setProfileCompany({
                    ...profileCompany,
                    name: e.target.value,
                  })
                }
              >
                <CandidateName>{profileCompany.name}</CandidateName>
              </EditableContent>

              <CandidateTitle>
                {profileCompany.created_by && (
                  <>Created by {profileCompany.created_by}</>
                )}
                {profileCompany.domain && <> · {profileCompany.domain}</>}
                {profileCompany.phone && <> · {profileCompany.phone}</>}
                {profileCompany.created_at && (
                  <>
                    {" "}
                    · <TimeAgo date={profileCompany.created_at} />
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
                onClickSave={() => saveProfileCompany()}
                className="leo-absolute"
              />
            </PermissionChecker>
          </HeaderLeft>
          <HeaderRight>
            <ActionsMenu
              actionType={actionType}
              setActionType={setActionType}
              actionTotals={actionTotals}
              sendToOverview={sendToOverview}
              showDropdown={permission.edit}
            />
          </HeaderRight>
        </HeaderContainer>
      </ATSContainer>
    </HeaderWrapper>
  );
};

export default CompanyHeader;
