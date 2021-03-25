import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AvatarIcon from "sharedComponents/AvatarIcon";
import { InputContainer } from "sharedComponents/TagsComponent/StyledInputs";
import { AddButton } from "sharedComponents/TagsComponent/AddTag";
import { CancelFilterIcon } from "sharedComponents/TagsComponent/Tags";
import UniversalModal, {
  ModalBody,
} from "modals/UniversalModal/UniversalModal";
import AppButton from "styles/AppButton";
import notify from "notifications";
import { AWS_CDN_URL } from "constants/api";

const Collaborators = ({ collaborators, edit, store, setNewCollaborators }) => {
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(undefined);
  const [changed, setChanged] = useState(false);
  const [deletedCollabs, setDeletedCollabs] = useState([]);

  useEffect(() => {
    if (collaborators) {
      setTags([...collaborators]);
    }
  }, [collaborators]);

  useEffect(() => {
    if (changed) {
      setNewCollaborators(formatTags());
    }
  }, [changed, tags]);

  const formatTags = () => {
    let retObj = {
      create: [],
      delete: deletedCollabs.length > 0 ? deletedCollabs : undefined,
    };
    let originalIds = {};
    collaborators.map(
      (member) =>
        (originalIds[member.team_member_id] = member.collaborator_type)
    );
    tags.map((tag) => {
      if (originalIds[tag.team_member_id] !== tag.collaborator_type) {
        retObj.create.push({
          team_member_id: tag.team_member_id,
          collaborator_type: tag.collaborator_type,
        });
      }
      return null;
    });
    return retObj;
  };

  const deleteTag = (index) => {
    let tagsCopy = [...tags];
    let deletedTag = tagsCopy.splice(index, 1)[0];
    setTags(tagsCopy);
    if (deletedTag.id) {
      setDeletedCollabs([...deletedCollabs, deletedTag.id]);
    }

    if (!changed && deletedTag.id) {
      setChanged(true);
    }
  };

  return (
    <>
      {edit ? (
        <InputContainer>
          <TagsContainer className="leo-flex">
            {tags &&
              tags.length > 0 &&
              tags.map((member, index) => (
                <React.Fragment key={`tag-${index}`}>
                  <TagStyledContainer className="leo-flex">
                    <AvatarIcon
                      name={member.name}
                      imgUrl={member.avatar}
                      size={30}
                      style={{ marginRight: "5px" }}
                    />
                    <TagSpan>{member.name}</TagSpan>
                    <LabelCard style={{ borderRadius: "5px" }}>
                      {typeNames[member.type] || member.type}
                    </LabelCard>
                    <button
                      className="cancelFilter"
                      onClick={() => deleteTag(index)}
                    >
                      <CancelFilterIcon />
                    </button>
                  </TagStyledContainer>
                </React.Fragment>
              ))}
            <AddTagContainer className="leo-relative">
              <AddButton
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              >
                Collaborator
              </AddButton>
            </AddTagContainer>
          </TagsContainer>
          {showModal && (
            <CollaboratorModal
              store={store}
              hide={() => setShowModal(false)}
              setTags={setTags}
              changed={changed}
              setChanged={setChanged}
            />
          )}
        </InputContainer>
      ) : (
        <>
          {collaborators &&
            collaborators.map((member, index) => (
              <TeamMemberRow
                key={`member-collaborator-${index}`}
                className="leo-flex"
              >
                <AvatarIcon
                  name={member.name}
                  imgUrl={member.avatar}
                  size={30}
                />
                <span className="title-name">{member.name}</span>
                <LabelCard>{typeNames[member.type] || member.type}</LabelCard>
              </TeamMemberRow>
            ))}
        </>
      )}
    </>
  );
};

export default Collaborators;

const CollaboratorModal = ({ hide, store, setTags, changed, setChanged }) => {
  const [selectedMember, setSelectedMember] = useState(undefined);
  const [selectedType, setSelectedType] = useState("recruiter");

  const createNewTag = () => {
    if (!selectedMember) {
      notify("danger", "You must select a team member first");
    }
    setTags((tags) => [
      ...tags,
      {
        ...selectedMember,
        collaborator_type: selectedType,
        type: selectedType,
      },
    ]);
    if (!changed) {
      setChanged(true);
    }
    hide();
  };
  return (
    <UniversalModal show={true} hide={hide} id="add-collaborator" width={330}>
      <STModalBody className="no-footer no-header">
        <Header className="leo-flex">
          Add Collaborator
          <button onClick={() => hide()}>
            <i className="fas fa-times"></i>
          </button>
        </Header>
        <MembersList>
          <CandidateUL>
            {store.teamMembers &&
              store.teamMembers.length > 0 &&
              store.teamMembers.map((member, ix) => (
                <li
                  className="leo-flex-center leo-pointer leo-relative"
                  key={`team-member-collaborator-${ix}`}
                  onClick={() => {
                    if (
                      member.professional_id === selectedMember?.professional_id
                    ) {
                      setSelectedMember(undefined);
                    } else {
                      setSelectedMember(member);
                    }
                  }}
                >
                  <AvatarIcon
                    name={member.name}
                    imgUrl={member.avatar}
                    size={30}
                  />
                  <div className="name-container">
                    <span className="candidate-name">{member.name}</span>
                  </div>
                  {member.professional_id ===
                    selectedMember?.professional_id && (
                    <CheckMark className="leo-flex">
                      <img src={`${AWS_CDN_URL}/icons/CheckIcon.svg`} alt="" />
                    </CheckMark>
                  )}
                </li>
              ))}
          </CandidateUL>
        </MembersList>
        <TypeSelectContainer>
          <label>Type</label>
          <select
            className="form-control form-control-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ maxWidth: "130px", marginBottom: "0" }}
          >
            {typeOptions.map((tp, index) => (
              <option value={tp.val} key={`type-option-${index}`}>
                {tp.title}
              </option>
            ))}
          </select>
        </TypeSelectContainer>
        <Footer className="leo-flex">
          <div>
            <AppButton
              theme="dark-blue"
              size="small"
              onClick={() => createNewTag()}
            >
              Add
            </AppButton>
          </div>
        </Footer>
      </STModalBody>
    </UniversalModal>
  );
};

const TeamMemberRow = styled.div`
  align-items: center;
  margin-bottom: 10px;

  .title-name {
    margin-left: 5px;
    font-size: 14px;
    line-height: 17px;
    color: #1e1e1e;
  }
`;

const TagsContainer = styled.div`
  align-items: center;
  flex-wrap: wrap;
`;

const AddTagContainer = styled.div`
  margin-right: 10px;
  margin-bottom: 10px;
`;

const TagStyledContainer = styled.div`
  background: #ffffff;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 4px 10px;
  transition: 0.25s ease-in-out background-color;
  align-items: center;

  .cancelFilter {
    margin-left: 10px;
  }
`;

const TagSpan = styled.span`
  font-size: 14px;
  line-height: 17px;
  color: #1e1e1e;
`;

const LabelCard = styled.label`
  background: #f9f9f9;
  border-radius: 10px;
  font-size: 12px;
  line-height: 15px;
  color: #2a3744;
  padding: 5px 10px;
  margin-left: 5px;
`;

const Footer = styled.div`
  align-items: center;
  justify-content: flex-end;
  padding: 20px 0px;
  margin: 0px 20px;
  border-top: solid #eee 1px;

  div button {
    margin-left: 10px;
  }
`;

const Header = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #2a3744;
  padding: 15px;
  border-bottom: 1px solid #eeeeee;
  align-items: center;
  justify-content: space-between;

  button {
    color: grey;
  }
`;

const STModalBody = styled(ModalBody)``;

const MembersList = styled.div`
  max-height: 180px;
  overflow: scroll;
  padding: 10px 0px;
`;

const CandidateUL = styled.ul`
  li {
    padding: 12px 30px;

    :hover {
      background: rgba(196, 196, 196, 0.25);
    }

    .name-container {
      margin-left: 10px;

      .candidate-name {
        font-size: 14px;
        line-height: 16px;
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
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

const TypeSelectContainer = styled.div`
  padding: 20px 0px;
  margin: 0px 20px;
  border-top: solid #eee 1px;

  label {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #74767b;
    margin-bottom: 10px;
  }
`;

const typeOptions = [
  { val: "recruiter", title: "Recruiter" },
  { val: "sourcer", title: "Source" },
  { val: "owner", title: "Owner" },
  { val: "other", title: "Other" },
];

const typeNames = {
  recruiter: "Recruiter",
  sourcer: "Source",
  owner: "Owner",
  other: "Other",
};
