import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
import {
  Title,
  SubTitle,
  ButtonsWrapper,
  InfoText,
  ContentWrapper,
} from "components/TeamView/Customisation/sharedComponents";
import JobCheckbox from "components/JobCreation/components/JobCheckbox";
import {
  rolesExchanger,
  permissionExchanger,
} from "constants/permissionHelpers";
import UniversalModal, {
  ModalBody,
} from "modals/UniversalModal/UniversalModal";
import AvatarIcon from "sharedComponents/AvatarIcon";
import AppButton from "styles/AppButton";
import SearchInput from "sharedComponents/SearchInput";
import { fetchUpdateApprovalProcess } from "helpersV2/company";
import { ExpandButton } from "components/TeamView/Customisation/sharedComponents";
import { AWS_CDN_URL } from "constants/api";

const ApprovalProcess = () => {
  const store = useContext(GlobalContext);
  const [expand, setExpand] = useState(false);
  const [over, setOver] = useState(false);
  const [needApproval, setNeedApproval] = useState({
    hiring_manager: false,
    recruiter: false,
  });
  const [tiers, setTiers] = useState({
    tier_1: undefined,
    tier_2: undefined,
    tier_3: undefined,
  });
  const [customNames, setCustomNames] = useState({
    tier_1: "",
    tier_2: "",
    tier_3: "",
  });
  const [activeModal, setActiveModal] = useState(undefined);
  const [selectedTier, setSelectedTier] = useState(undefined);
  const [alreadySelectedIds, setAlreadySelectedIds] = useState([]);

  useEffect(() => {
    reuseExistingTiers();
  }, [store.approval_process]);

  useEffect(() => {
    if (selectedTier) {
      let ids = [];
      if (tiers.tier_1 && selectedTier !== "tier_1") {
        tiers.tier_1.map((member) => ids.push(member.id));
      }
      if (tiers.tier_2 && selectedTier !== "tier_2") {
        tiers.tier_2.map((member) => ids.push(member.id));
      }
      if (tiers.tier_3 && selectedTier !== "tier_3") {
        tiers.tier_3.map((member) => ids.push(member.id));
      }
      setAlreadySelectedIds(ids);
    }
  }, [tiers, selectedTier]);

  const reuseExistingTiers = () => {
    if (store.approval_process) {
      setNeedApproval({
        hiring_manager: store.approval_process.hiring_manager,
        recruiter: store.approval_process.recruiter,
      });
      setCustomNames({
        tier_1: store.approval_process.approval_tier_one.custom_name || "",
        tier_2: store.approval_process.approval_tier_two.custom_name || "",
        tier_3: store.approval_process.approval_tier_three.custom_name || "",
      });
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
    }
  };

  const saveNewTers = () => {
    let body = {
      approval_tier_one: {
        custom_name: customNames.tier_1 || "Tier 1",
        active: tiers.tier_1 ? true : false,
        members: tiers.tier_1
          ? tiers.tier_1.map((memb) => {
              return { id: memb.id };
            })
          : [],
      },
      approval_tier_two: {
        custom_name: customNames.tier_2 || "Tier 2",
        active: tiers.tier_2 ? true : false,
        members: tiers.tier_2
          ? tiers.tier_2.map((memb) => {
              return { id: memb.id };
            })
          : [],
      },
      approval_tier_three: {
        custom_name: customNames.tier_3 || "Tier 3",
        active: tiers.tier_3 ? true : false,
        members: tiers.tier_3
          ? tiers.tier_3.map((memb) => {
              return { id: memb.id };
            })
          : [],
      },
      hiring_manager: needApproval.hiring_manager,
      recruiter: needApproval.recruiter,
    };
    fetchUpdateApprovalProcess(
      store.session,
      store.company.id,
      store.approval_process.id,
      body
    ).then((res) => {
      if (!res.err) {
        notify("info", "Approval process succesfully updated");
        store.dispatch({
          type: "UPDATE_APPROVAL_PROCESS",
          payload: res,
        });
      } else {
        notify("danger", res);
      }
    });
  };

  return (
    <>
      <div
        className="row"
        onMouseEnter={() => setOver(true)}
        onMouseLeave={() => setOver(false)}
      >
        <div className="col-md-12">
          <ContentWrapper>
            <Header>
              <div>
                <Title>Approval Process</Title>
                <SubTitle>
                  You can customise your job approval process.
                </SubTitle>
              </div>
              <ExpandButton expand={expand} setExpand={setExpand} />
            </Header>
            {expand && (
              <Body>
                <InfoText>
                  Select the roles that will need an approval before posting a
                  job.
                </InfoText>
                <CheckBoxesGrid>
                  <JobCheckbox
                    checked={needApproval.hiring_manager}
                    labelText={
                      rolesExchanger[store.company.id]
                        ? rolesExchanger[store.company.id].hiring_manager
                        : rolesExchanger.default.hiring_manager
                    }
                    onClick={() =>
                      setNeedApproval({
                        ...needApproval,
                        hiring_manager: !needApproval.hiring_manager,
                      })
                    }
                  />
                  <JobCheckbox
                    checked={needApproval.recruiter}
                    labelText={
                      rolesExchanger[store.company.id]
                        ? rolesExchanger[store.company.id].recruiter
                        : rolesExchanger.default.recruiter
                    }
                    onClick={() =>
                      setNeedApproval({
                        ...needApproval,
                        recruiter: !needApproval.recruiter,
                      })
                    }
                  />
                </CheckBoxesGrid>
                <InfoText>
                  Select the tiers who would need to review the job before
                  publishing it.
                </InfoText>
                <SubTitle>{`*Max 3 tiers`}</SubTitle>
                <TiersContainer>
                  {Object.entries(tiers).map((tier, index) => {
                    if (tier[1]) {
                      return (
                        <TierRow className="tier-row" key={`tier-row-${index}`}>
                          <div className="tier-header">
                            <h4>{customNames[tier[0]]}</h4>
                            <ButtonsContainer className="button-options">
                              <button
                                onClick={() => {
                                  setActiveModal("tier-modal");
                                  setSelectedTier(tier[0]);
                                }}
                              >
                                <img
                                  src={`${AWS_CDN_URL}/icons/EditPen.svg`}
                                  alt="Edit"
                                />
                              </button>
                              {(tier[0] === "tier_3" ||
                                (tier[0] === "tier_2" && !tiers.tier_3) ||
                                (tier[0] === "tier_1" && !tiers.tier_2)) && (
                                <button
                                  onClick={() => {
                                    setTiers({
                                      ...tiers,
                                      [tier[0]]: undefined,
                                    });
                                  }}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              )}
                            </ButtonsContainer>
                          </div>
                          <div className="tier-list">
                            {tier &&
                              tier[1].map((member, index) => (
                                <MemberTierRow key={`member-item-${index}`}>
                                  <AvatarIcon
                                    name={member.name}
                                    imgUrl={member.avatar}
                                    size={30}
                                  />

                                  <span className="tier-reviewer">
                                    {member.name}
                                  </span>
                                  <span className="tier-reviewer-permission">
                                    {permissionExchanger[store.company.id]
                                      ? permissionExchanger[store.company.id][
                                          member.permission
                                        ]
                                      : permissionExchanger.default[
                                          member.permission
                                        ]}
                                  </span>
                                </MemberTierRow>
                              ))}
                          </div>
                        </TierRow>
                      );
                    }
                    return null;
                  })}
                  {!tiers.tier_3 && (
                    <TierRow className="tier-row">
                      <JobCheckbox
                        checked={true}
                        labelText="Add tier"
                        onClick={() => {
                          setSelectedTier(
                            !tiers.tier_1
                              ? "tier_1"
                              : !tiers.tier_2
                              ? "tier_2"
                              : "tier_3"
                          );
                          setActiveModal("tier-modal");
                        }}
                        mark="add"
                        noBorder={true}
                      />
                    </TierRow>
                  )}
                </TiersContainer>
                {over && (
                  <ButtonsWrapper>
                    <AppButton
                      theme="grey"
                      size="small"
                      onClick={() => reuseExistingTiers()}
                    >
                      Cancel
                    </AppButton>
                    <AppButton
                      size="small"
                      theme="primary"
                      onClick={() => saveNewTers()}
                    >
                      Save
                    </AppButton>
                  </ButtonsWrapper>
                )}
              </Body>
            )}
          </ContentWrapper>
        </div>
      </div>
      {activeModal === "tier-modal" && (
        <TierModal
          tier={tiers[selectedTier]}
          hide={() => setActiveModal(undefined)}
          updateTier={(newTier) =>
            setTiers({ ...tiers, [selectedTier]: newTier })
          }
          store={store}
          tierName={customNames[selectedTier]}
          updateTierName={(newName) =>
            setCustomNames({ ...customNames, [selectedTier]: newName })
          }
          alreadySelectedIds={alreadySelectedIds}
        />
      )}
    </>
  );
};

export default ApprovalProcess;

const TierModal = ({
  hide,
  tier,
  store,
  updateTier,
  tierName,
  updateTierName,
  alreadySelectedIds,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    if (tier) {
      setSelectedIds(tier.map((member) => member.id));
    }
  }, [tier]);

  const clickedMember = (team_member_id) => {
    let ix = selectedIds.indexOf(team_member_id);
    if (ix !== -1) {
      let idsCopy = [...selectedIds];
      idsCopy.splice(ix, 1);
      setSelectedIds(idsCopy);
    } else {
      setSelectedIds([...selectedIds, team_member_id]);
    }
  };

  const saveTier = () => {
    let selectedMembers = store.teamMembers.filter(
      (member) => selectedIds.indexOf(member.team_member_id) !== -1
    );
    if (selectedMembers.length === 0) {
      // delete or alert
      notify("danger", "You must select at least one reviewer");
    } else {
      updateTier(
        selectedMembers.map((member) => {
          return {
            name: member.name,
            permission: member.permission,
            avatar: member.avatar,
            id: member.team_member_id,
            prof_id: member.professional_id,
          };
        })
      );
      updateTierName(name);
      hide();
    }
  };

  useEffect(() => {
    if (store.teamMembers) {
      if (search !== "") {
        setMembers([
          ...store.teamMembers.filter(
            (member) =>
              member.name.toLowerCase().includes(search.toLowerCase()) &&
              alreadySelectedIds.indexOf(member.team_member_id) === -1
          ),
        ]);
      } else {
        setMembers([
          ...store.teamMembers.filter(
            (member) => alreadySelectedIds.indexOf(member.team_member_id) === -1
          ),
        ]);
      }
    }
  }, [search, store.teamMembers, alreadySelectedIds]);

  useEffect(() => {
    if (tierName) {
      setName(tierName);
    }
  }, [tierName]);

  return (
    <UniversalModal show={true} hide={hide} id="tier-modal" width={480}>
      <MinimalHeaderST>
        <div className="leo-flex leo-align-baseline">
          <h3>{tier ? "Edit tier" : "Add tier"}</h3>
        </div>
        <button onClick={() => hide()}>
          <i className="fas fa-times"></i>
        </button>
      </MinimalHeaderST>
      <STModalBody className="no-footer">
        <Input
          placeholder="Tier name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="search-container">
          <SearchInput
            value={search}
            onChange={(val) => setSearch(val)}
            placeholder="Search members..."
            style={{ maxWidth: "unset", width: "96%" }}
          />
        </div>
        <div className="members-container">
          <MemberUl>
            {members &&
              members.length > 0 &&
              members
                .filter(
                  (memb) => selectedIds.indexOf(memb.team_member_id) !== -1
                )
                .map((member, ix) => (
                  <li
                    key={`member-item-ds-${ix}`}
                    onClick={() => {
                      clickedMember(member.team_member_id);
                    }}
                  >
                    <AvatarIcon
                      name={member.name}
                      imgUrl={member.avatar}
                      size={30}
                    />
                    <div className="name-container">
                      <div className="name-container-sub">
                        <span className="candidate-name">{member.name}</span>
                      </div>
                      <div className="roles-list">
                        {member.roles &&
                          member.roles.length > 0 &&
                          member.roles.map(
                            (role, index) =>
                              `${
                                rolesExchanger[store.company.id]
                                  ? rolesExchanger[store.company.id][role]
                                  : rolesExchanger.default[role]
                              }${index !== member.roles.length - 1 ? ", " : ""}`
                          )}
                      </div>
                    </div>
                    <span className="tier-reviewer-permission">
                      {permissionExchanger[store.company.id]
                        ? permissionExchanger[store.company.id][
                            member.permission
                          ]
                        : permissionExchanger.default[member.permission]}
                    </span>
                    {selectedIds.indexOf(member.team_member_id) !== -1 && (
                      <CheckMark>
                        <img
                          src={`${AWS_CDN_URL}/icons/CheckIcon.svg`}
                          alt=""
                        />
                      </CheckMark>
                    )}
                  </li>
                ))}
            {members &&
              members.length > 0 &&
              members
                .filter(
                  (memb) => selectedIds.indexOf(memb.team_member_id) === -1
                )
                .map((member, ix) => (
                  <li
                    key={`member-item-ps-${ix}`}
                    onClick={() => {
                      clickedMember(member.team_member_id);
                    }}
                  >
                    <AvatarIcon
                      name={member.name}
                      imgUrl={member.avatar}
                      size={30}
                    />
                    <div className="name-container">
                      <div className="name-container-sub">
                        <span className="candidate-name">{member.name}</span>
                      </div>
                      <div className="roles-list">
                        {member.roles &&
                          member.roles.length > 0 &&
                          member.roles.map(
                            (role, index) =>
                              `${
                                rolesExchanger[store.company.id]
                                  ? rolesExchanger[store.company.id][role]
                                  : rolesExchanger.default[role]
                              }${index !== member.roles.length - 1 ? ", " : ""}`
                          )}
                      </div>
                    </div>
                    <span className="tier-reviewer-permission">
                      {permissionExchanger[store.company.id]
                        ? permissionExchanger[store.company.id][
                            member.permission
                          ]
                        : permissionExchanger.default[member.permission]}
                    </span>
                    {selectedIds.indexOf(member.team_member_id) !== -1 && (
                      <CheckMark>
                        <img
                          src={`${AWS_CDN_URL}/icons/CheckIcon.svg`}
                          alt=""
                        />
                      </CheckMark>
                    )}
                  </li>
                ))}
          </MemberUl>
        </div>
        <Footer>
          <AppButton size="small" onClick={() => saveTier()}>
            {tier ? "Save" : "Add"}
          </AppButton>
        </Footer>
      </STModalBody>
    </UniversalModal>
  );
};

const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  position: relative;
  width: 100%;
`;

const Body = styled.div`
  min-height: 450px;
  position: relative;
`;

const CheckBoxesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  width: min-content;
  margin-top: 30px;
  margin-bottom: 45px;
`;

const TiersContainer = styled.div`
  border-radius: 4px;
  border: solid #eeeeee 1px;
  position: relative;
  width: 100%;
  max-height: 600px;
  overflow-y: auto;
  margin-bottom: 20px;
  max-width: 400px;

  // .tier-row:not(:last-child) {
  //   border-bottom: solid #eeeeee 1px;
  // }
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

const STModalBody = styled(ModalBody)`
  padding-top: 10px !important;
  padding-bottom: 20px !important;
  .members-container {
    max-height: 300px;
    overflow: scroll;
  }

  .search-container {
    margin: auto;
    margin-bottom: 30px;
    margin-left: 20px;
  }
`;

const MemberUl = styled.ul`
  li {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    padding: 12px 20px;

    :hover {
      background: rgba(196, 196, 196, 0.25);
    }

    .roles-list {
      font-size: 10px;
      color: #c4c4c4;
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

    .name-container {
      margin-left: 10px;

      .candidate-title {
        font-size: 12px;
        line-height: 14px;
        color: #74767b;
        display: flex;
        align-items: center;
        margin-top: 3px;

        svg,
        img {
          margin-right: 5px;
        }
      }
      .candidate-name {
        font-size: 14px;
        line-height: 16px;
      }

      .name-container-sub {
        display: flex;
        align-items: center;
      }
    }
  }
`;

const CheckMark = styled.div`
  position: absolute;
  right: 30px;
  background: #35c3ae;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 20px;
  margin: 0px 20px;
  border-top: solid #eee 1px;

  div button {
    margin-left: 10px;
  }
`;

const MemberTierRow = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 15px;

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

const ButtonsContainer = styled.div`
  display: none;

  button {
    color: #9a9ca1;
    margin-left: 10px;
  }
`;

const Input = styled.input`
  border: none;
  border-bottom: solid 1px #eee;
  width: 200px;
  margin-left: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 25px;
`;

const MinimalHeaderST = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #2a3744;
  padding: 15px;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 8px 8px 0px 0px;

  h3 {
    font-weight: 500;
    font-size: 16px;
    // line-height: 19px;
    color: #2a3744;
    // max-width: 280px;
    // text-overflow: ellipsis;
    // overflow: hidden;
    // white-space: nowrap;
  }

  button {
    color: grey;
  }
`;
