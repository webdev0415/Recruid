import React, { useContext, useState, useEffect } from "react";

import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";
import styled from "styled-components";
import AvatarIcon from "sharedComponents/AvatarIcon";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { permissionExchanger } from "constants/permissionHelpers";
import SearchInput from "sharedComponents/SearchInput";
import AppButton from "styles/AppButton";
import notify from "notifications";
import { ROUTES } from "routes";
import { fetchRequestReview } from "helpersV2/jobs/approval";
import NoteInput from "components/Profiles/components/notes/NoteInput";
import noteInputStyle from "sharedComponents/ActionCreator/NoteInputStyle";
import { prepareMentions } from "constants/noteMentions";
import { fetchCreateNote } from "helpersV2/notes/candidate";
import { AWS_CDN_URL } from "constants/api";

const SelectReviewersModal = ({
  hide,
  setRedirect,
  jobId,
  saveJobDraftCaller,
  jobSlugSt,
  rerequest,
  job,
}) => {
  const store = useContext(GlobalContext);
  const [tiers, setTiers] = useState({
    tier_1: undefined,
    tier_2: undefined,
    tier_3: undefined,
  });
  const [selectedIds, setSelectedIds] = useState({
    tier_1: [],
    tier_2: [],
    tier_3: [],
    extra: [],
  });
  const [searchVal, setSearchVal] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [customNames, setCustomNames] = useState({
    tier_1: "Tier 1",
    tier_2: "Tier 2",
    tier_3: "Tier 3",
  });
  const [waitingSave, setWaitingSave] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [relevantMembers, setRelevantMembers] = useState([]);

  const clickedMember = (team_member_id, tier) => {
    let ix = selectedIds[tier].indexOf(team_member_id);
    if (ix !== -1) {
      let idsCopy = [...selectedIds[tier]];
      idsCopy.splice(ix, 1);
      setSelectedIds({ ...selectedIds, [tier]: idsCopy });
    } else {
      setSelectedIds({
        ...selectedIds,
        [tier]: [...selectedIds[tier], team_member_id],
      });
    }
  };

  useEffect(() => {
    if (store.approval_process) {
      setTiers({
        tier_1: store.approval_process.approval_tier_one.active
          ? store.approval_process.approval_tier_one.members
          : undefined,
        tier_2: store.approval_process.approval_tier_two.active
          ? store.approval_process.approval_tier_two.members
          : undefined,
        tier_3: store.approval_process.approval_tier_three.active
          ? store.approval_process.approval_tier_three.members
          : undefined,
      });
      setCustomNames({
        tier_1: store.approval_process.approval_tier_one.custom_name || "",
        tier_2: store.approval_process.approval_tier_two.custom_name || "",
        tier_3: store.approval_process.approval_tier_three.custom_name || "",
      });
    }
  }, [store.approval_process]);

  useEffect(() => {
    if (searchVal === "") {
      setFilteredMembers([]);
    } else {
      let allIds = [];
      Object.values(selectedIds).map((tier) =>
        tier.map((memberId) => allIds.push(memberId))
      );
      setFilteredMembers(
        store.teamMembers.filter((member) => {
          if (
            allIds.indexOf(member.team_member_id) === -1 &&
            member.name.toLowerCase().includes(searchVal.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        })
      );
    }
  }, [searchVal, selectedIds, store.teamMembers]);

  const triggerRequestReview = () => {
    if (
      (store.approval_process.approval_tier_one.active &&
        selectedIds.tier_1.length === 0) ||
      (store.approval_process.approval_tier_two.active &&
        selectedIds.tier_2.length === 0) ||
      (store.approval_process.approval_tier_three.active &&
        selectedIds.tier_3.length === 0)
    ) {
      return notify(
        "danger",
        "You must select at least one member of each tier"
      );
    }
    if (jobId) {
      createNoteAndApproval();
    } else {
      saveJobDraftCaller();
      setWaitingSave(true);
    }
  };

  const fetchCaller = (noteId) => {
    let body = {
      job_post_id: Number(jobId),
      created_by: store.role.team_member.team_member_id,

      tier_one:
        selectedIds.tier_1?.length > 0
          ? {
              members: selectedIds.tier_1.map((id) => {
                return { id };
              }),
            }
          : undefined,
      tier_two:
        selectedIds.tier_2?.length > 0
          ? {
              members: selectedIds.tier_2.map((id) => {
                return { id };
              }),
            }
          : undefined,
      tier_three:
        selectedIds.tier_3?.length > 0
          ? {
              members: selectedIds.tier_3.map((id) => {
                return { id };
              }),
            }
          : undefined,
      extra_tier:
        selectedIds.extra?.length > 0
          ? {
              members: selectedIds.extra.map((id) => {
                return { id };
              }),
            }
          : undefined,
    };
    if (rerequest) {
      body.re_requested = true;
    }
    if (noteId) {
      body.submit_note = noteId;
    }

    fetchRequestReview(store.session, store.company.id, body).then((res) => {
      if (!res.err) {
        notify("info", "Review succesfully requested");
        setRedirect(
          ROUTES.JobDashboard.url(store.company.mention_tag, jobSlugSt)
        );
        hide();
      } else {
        notify("danger", "Unable to request approval");
      }
    });
  };

  const createNoteAndApproval = () => {
    let trimmedNote = currentNote.trim();
    if (trimmedNote === "") {
      return fetchCaller();
    }
    let { notifyAll, mentionTags } = prepareMentions(currentNote);
    const payload = {
      author_id: store.session.id,
      author_name: store.user.name,
      body: trimmedNote,
      title: `${job.title} notes`,
      mention_tags: mentionTags?.length > 0 ? mentionTags : undefined,
      team_assigned_notification: notifyAll || undefined,
      company_id: store.company.id,
      //job props
      job_id: jobId,
      // client_id: noteType === "client" ? jobData?.company?.id : undefined,
      client_note: false,
      // noteType === "client" && jobData?.company?.id ? true : false,
    };

    fetchCreateNote(store.session, payload, jobId, "JobPost")
      .then((res) => {
        if (!res.err) {
          fetchCaller(res.id);
        } else {
          notify("danger", res);
        }
      })
      .catch(() => {
        notify("danger", "Unable to add note to job");
        fetchCaller();
      });
  };

  useEffect(() => {
    if (waitingSave && jobId) {
      createNoteAndApproval();
    }
  }, [waitingSave, jobId]);

  useEffect(() => {
    if (store.teamMembers) {
      setRelevantMembers(
        store.teamMembers.filter(
          (member) =>
            member.permission === "owner" ||
            member.permission === "admin" ||
            member.roles.includes("recruiter") ||
            member.roles.includes("hiring_manager")
        )
      );
    }
  }, [store.teamMembers]);

  return (
    <UniversalModal
      show={true}
      hide={hide}
      id="select-reviewers-modal"
      width={960}
    >
      <ModalHeaderClassic
        title="Request Approval"
        closeModal={hide}
        theme="v2theme"
      />
      <STModalBody className="no-footer">
        <TextInfo>
          At least one person from each tier must be selected in order to review
          the job and approve it. You can also add extra reviewers by searching
          among your team members.
        </TextInfo>
        <FlexContainer>
          <TiersContainer>
            {Object.entries(tiers).map((tier, index) => {
              if (tier[1]) {
                return (
                  <TierRow className="tier-row" key={`tier-review-${index}`}>
                    <div className="tier-header">
                      <h4>{customNames[tier[0]]}</h4>
                    </div>
                    <div className="tier-list">
                      {tier &&
                        tier[1].map((member, ix) => (
                          <MemberTierRow
                            key={`member-tier-${ix}`}
                            onClick={() => {
                              clickedMember(member.id, tier[0]);
                            }}
                          >
                            <AvatarIcon
                              name={member.name}
                              imgUrl={member.avatar}
                              size={30}
                            />

                            <span className="tier-reviewer">{member.name}</span>
                            <span className="tier-reviewer-permission">
                              {permissionExchanger[store.company.id]
                                ? permissionExchanger[store.company.id][
                                    member.permission
                                  ]
                                : permissionExchanger.default[
                                    member.permission
                                  ]}
                            </span>
                            {selectedIds[tier[0]].indexOf(member.id) !== -1 && (
                              <CheckMark>
                                <img
                                  src={`${AWS_CDN_URL}/icons/CheckIcon.svg`}
                                  alt=""
                                />
                              </CheckMark>
                            )}
                          </MemberTierRow>
                        ))}
                    </div>
                  </TierRow>
                );
              }
              return null;
            })}
          </TiersContainer>
          <SearchContainer>
            <SearchInput
              value={searchVal}
              onChange={(val) => setSearchVal(val)}
              placeholder="Search team members..."
            />
            <RowsContainer>
              {store.teamMembers.map((member) => {
                if (selectedIds.extra.indexOf(member.team_member_id) !== -1) {
                  return (
                    <MemberTierRow
                      onClick={() => {
                        clickedMember(member.team_member_id, "extra");
                      }}
                    >
                      <AvatarIcon
                        name={member.name}
                        imgUrl={member.avatar}
                        size={30}
                      />

                      <span className="tier-reviewer">{member.name}</span>
                      <span className="tier-reviewer-permission">
                        {permissionExchanger[store.company.id]
                          ? permissionExchanger[store.company.id][
                              member.permission
                            ]
                          : permissionExchanger.default[member.permission]}
                      </span>
                      <CheckMark>
                        <img
                          src={`${AWS_CDN_URL}/icons/CheckIcon.svg`}
                          alt=""
                        />
                      </CheckMark>
                    </MemberTierRow>
                  );
                } else {
                  return null;
                }
              })}
              {filteredMembers.map((member, ix) => (
                <MemberTierRow
                  key={`member-tier-filtered-${ix}`}
                  onClick={() => {
                    clickedMember(member.team_member_id, "extra");
                  }}
                >
                  <AvatarIcon
                    name={member.name}
                    imgUrl={member.avatar}
                    size={30}
                  />
                  <span className="tier-reviewer">{member.name}</span>
                  <span className="tier-reviewer-permission">
                    {permissionExchanger[store.company.id]
                      ? permissionExchanger[store.company.id][member.permission]
                      : permissionExchanger.default[member.permission]}
                  </span>
                </MemberTierRow>
              ))}
            </RowsContainer>
          </SearchContainer>
        </FlexContainer>
        <NoteWrapper>
          <TextInfo>
            You can add a note to the job regarding the reason for the approval
            request.
          </TextInfo>
          <NoteContainer>
            <NoteInput
              members={relevantMembers}
              currentNote={currentNote}
              setCurrentNote={setCurrentNote}
              store={store}
              customStyle={noteInputStyle}
            />
          </NoteContainer>
        </NoteWrapper>
        <Footer>
          <AppButton size="small" onClick={() => triggerRequestReview()}>
            Request Approval
          </AppButton>
        </Footer>
      </STModalBody>
    </UniversalModal>
  );
};

export default SelectReviewersModal;

const STModalBody = styled(ModalBody)`
  padding: 30px !important;
  // text-align: center;
`;

const TextInfo = styled.div`
  font-size: 14px;
  line-height: 17px;
  color: #74767b;
  text-align: center;
`;

const TiersContainer = styled.div`
  border-radius: 4px;
  border: solid #eeeeee 1px;
  position: relative;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
  margin-top: 20px;
  max-width: 500px;
`;

const TierRow = styled.div`
  padding: 15px;
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  // background: white;

  &:hover {
    .button-options {
      display: flex;
    }
  }

  .tier-header {
    padding-bottom: 5px;
    border-bottom: solid 1px #eee;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h4 {
    font-size: 10px;
    color: #9f9f9f;
  }
`;

const MemberTierRow = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 15px;
  cursor: pointer;
  position: relative;

  .tier-reviewer {
    font-size: 14px;
    line-height: 17px;
    color: #1e1e1e;
    margin-left: 5px;
  }

  .tier-reviewer-permission {
    background: #dfe9f4;
    border-radius: 5px;
    padding: 5px 15px;
    margin-left: 10px;
    font-size: 12px;
    line-height: 15px;
    color: #2a3744;
  }
`;
const CheckMark = styled.div`
  position: absolute;
  right: 45px;
  background: #35c3ae;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

const FlexContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
`;

const SearchContainer = styled.div`
  margin-top: 20px;
`;

const RowsContainer = styled.div`
  max-height: 225px;
  overflow-y: scroll;
  margin-top: 10px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
`;

const NoteContainer = styled.div`
  margin: auto;
  margin-top: 20px;
  margin-bottom: 40px;
  max-width: 700px;
  position: relative;
`;

const NoteWrapper = styled.div`
  padding-top: 20px;
  border-top: solid #eee 1px;
`;
