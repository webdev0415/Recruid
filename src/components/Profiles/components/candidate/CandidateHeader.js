import React from "react";

import AvatarIcon from "sharedComponents/AvatarIcon";
import EditableContent from "components/Profiles/components/EditableContent";
import EditButtons from "components/Profiles/components/EditButtons";
import TimeAgo from "react-timeago";
import ActionsMenu from "sharedComponents/ActionCreator/ActionsMenu";
import { PermissionChecker } from "constants/permissionHelpers";
import CandidateRating from "sharedComponents/CandidateRating";
import styled from "styled-components";

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
import CandidateBlacklist from "sharedComponents/CandidateBlacklist";

const CandidateHeader = ({
  tnProfile,
  editSection,
  setProfile,
  triggerEditSection,
  cancelEdit,
  editTalentNetworkProfile,

  experiences,
  currentExperienceIx,

  actionType,
  setActionType,
  actionTotals,
  store,
  permission,
  tnProfileId,
}) => {
  const editCandidateRating = (rating) => {
    setProfile({ ...tnProfile, rating });
  };

  return (
    <HeaderWrapper>
      <ATSContainer>
        <HeaderContainer>
          <HeaderLeft>
            <AvatarIcon
              name={tnProfile.name}
              imgUrl={tnProfile.avatar}
              size="medium"
            />
            <CandidateDetails>
              <EditableContent
                value={tnProfile.name}
                type={"text"}
                editing={editSection === "header"}
                headerName={true}
                onChange={(e) =>
                  setProfile({ ...tnProfile, name: e.target.value })
                }
              >
                <div className="leo-flex-center-between">
                  <CandidateName>{tnProfile.name}</CandidateName>
                  <CandidateBlacklist
                    blacklisted={tnProfile.blacklisted}
                    store={store}
                    changeBlacklistedState={(blackListState) =>
                      setProfile({ ...tnProfile, blacklisted: blackListState })
                    }
                    candidate_id={tnProfile.ptn_id}
                    show={true}
                    style={{ margin: "0px 12px" }}
                  />
                  <CandidateRating
                    rating={tnProfile.rating}
                    store={store}
                    changeNewRating={(newRating) =>
                      editCandidateRating(newRating)
                    }
                    candidate_id={tnProfileId}
                  />
                </div>
              </EditableContent>
              <CandidateTitle>
                {tnProfile.job_title ? (
                  <>{tnProfile.job_title} · </>
                ) : (
                  experiences &&
                  experiences[currentExperienceIx] && (
                    <>{experiences[currentExperienceIx]?.title} · </>
                  )
                )}
                {tnProfile.added_by && <>Added by {tnProfile.added_by} · </>}
                {tnProfile.custom_source && (
                  <>{tnProfile.custom_source?.source} · </>
                )}
                {tnProfile.created_at && (
                  <TimeAgo date={tnProfile.created_at} />
                )}
              </CandidateTitle>
            </CandidateDetails>
            <PermissionChecker type="edit" valid={{ recruiter: true }}>
              <EditButtons
                editing={editSection === "header"}
                onClickEdit={() => triggerEditSection("header")}
                onClickCancel={cancelEdit}
                onClickSave={editTalentNetworkProfile}
                style={{ right: "-50px" }}
                className="leo-absolute"
              />
            </PermissionChecker>
          </HeaderLeft>
          {tnProfile.require_reasonable_adjustments && (
            <ReasonableAdjustmentsReminder>
              Remember this candidate requires reasonable adjustments
            </ReasonableAdjustmentsReminder>
          )}
          <HeaderRight>
            <ActionsMenu
              actionType={actionType}
              setActionType={setActionType}
              actionTotals={actionTotals}
              source="candidate"
              showDropdown={permission.edit}
              onlyNotes={
                !(
                  store.role.role_permissions.owner ||
                  store.role.role_permissions.admin ||
                  store.role.role_permissions.recruiter
                ) && store.role.role_permissions.hiring_manager
              }
            />
          </HeaderRight>
        </HeaderContainer>
      </ATSContainer>
    </HeaderWrapper>
  );
};

const ReasonableAdjustmentsReminder = styled.div`
  width: 260px;
  border-radius: 4px;
  background: #77ebbe;
  border-left: 8px solid #35c3ae;
  padding: 8px;
  font-size: 13px;
`;

export default CandidateHeader;
