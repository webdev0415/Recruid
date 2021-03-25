import React from "react";

import AvatarComponent from "components/Profiles/components/AvatarComponent";
// import AvatarIcon from "sharedComponents/AvatarIcon";
import EditableContent from "components/Profiles/components/EditableContent";
import EditButtons from "components/Profiles/components/EditButtons";
import TimeAgo from "react-timeago";
import ActionsMenu from "sharedComponents/ActionCreator/ActionsMenu";
// import notify from "notifications";
import { PermissionChecker } from "constants/permissionHelpers";
import {
  CandidateDetails,
  CandidateName,
  CandidateTitle,
  HeaderLeft,
  HeaderRight,
  HeaderWrapper,
  HeaderContainer,
} from "components/Profiles/components/ProfileComponents";
import { ATSContainer } from "styles/PageContainers";

const CompanyHeader = ({
  contact,
  setContact,
  editSection,
  triggerEditSection,
  cancelEdit,
  saveContact,
  actionType,
  setActionType,
  actionTotals,

  permission,
}) => {
  const updateAvatar = (newAvatar) => {
    saveContact({
      ...contact,
      avatar: newAvatar?.avatar || null,
      avatar_name: newAvatar?.avatar_name || null,
      avatar_data: newAvatar?.avatar_data || null,
    });
  };

  return (
    <HeaderWrapper>
      <ATSContainer>
        <HeaderContainer>
          <HeaderLeft>
            <AvatarComponent
              name={contact.name}
              avatar={contact.avatar}
              updateAvatar={updateAvatar}
            />
            <CandidateDetails>
              <EditableContent
                value={contact.name}
                type={"text"}
                editing={editSection === "header"}
                headerName={true}
                onChange={(e) =>
                  setContact({ ...contact, name: e.target.value })
                }
              >
                <CandidateName>{contact.name}</CandidateName>
              </EditableContent>
              <CandidateTitle>
                {/* Talent Acquisition Leader. IBM GBS Europe at IBM · Created by Daniel Vernon · 16d ago */}
                {contact.created_by && <>Created by {contact.created_by}</>}
                {/* {contact.title && <> · {contact.title}</>}
              {contact.companies && contact.companies[0] && (
                <> at {contact.companies[0].name}</>
              )} */}
                {contact.created_at && (
                  <>
                    {" "}
                    · <TimeAgo date={contact.created_at} />
                  </>
                )}
              </CandidateTitle>
            </CandidateDetails>
            <PermissionChecker type="edit" valid={{ business: true }}>
              <EditButtons
                editing={editSection === "header"}
                onClickEdit={() => triggerEditSection("header")}
                onClickCancel={cancelEdit}
                onClickSave={() => saveContact()}
                style={{ right: "-100px" }}
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

export default CompanyHeader;
