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
import { AWS_CDN_URL } from "constants/api";

const CandidateCollaborators = ({ edit, store }) => {
  const [tags, setTags] = useState(undefined);
  const [showModal, setShowModal] = useState(undefined);

  useEffect(() => {
    if (store.teamMembers) {
      setTags([...store.teamMembers]);
    }
  }, [store.teamMembers]);

  return (
    <>
      {edit ? (
        <InputContainer>
          <TagsContainer className="leo-flex-center">
            {tags &&
              tags.length > 0 &&
              tags.map((member, index) => (
                <React.Fragment key={`tag-${index}`}>
                  <TagStyledContainer className="leo-flex-center">
                    <AvatarIcon
                      name={member.name}
                      imgUrl={member.avatar}
                      size={30}
                      style={{ marginRight: "5px" }}
                    />
                    <TagSpan>{member.name}</TagSpan>
                    <LabelCard style={{ borderRadius: "5px" }}>
                      Recruiter
                    </LabelCard>
                    <button className="cancelFilter" onClick={() => {}}>
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
                Candidate Collaborator
              </AddButton>
            </AddTagContainer>
          </TagsContainer>
          {showModal && <CollaboratorModal store={store} />}
        </InputContainer>
      ) : (
        <>
          {store.teamMembers &&
            store.teamMembers.map((member, index) => (
              <TeamMemberRow
                key={`member-collaborator-${index}`}
                className="leo-flex-center"
              >
                <AvatarIcon
                  name={member.name}
                  imgUrl={member.avatar}
                  size={30}
                />
                <span className="title-name">{member.name}</span>
                <LabelCard>Recruiter</LabelCard>
              </TeamMemberRow>
            ))}
        </>
      )}
    </>
  );
};

export default CandidateCollaborators;

const CollaboratorModal = ({ hide, store }) => {
  const [selectedMember, setSelectedMember] = useState(undefined);

  return (
    <UniversalModal show={true} hide={hide} id="add-collaborator" width={330}>
      <STModalBody className="no-footer no-header">
        <Header className="leo-flex-center-between">
          Add Candidate Collaborator
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
                  key={`member-item-${ix}`}
                  onClick={() => {
                    if (
                      member.professional_id === selectedMember?.professional_id
                    ) {
                      setSelectedMember(undefined);
                    } else {
                      setSelectedMember(member);
                    }
                  }}
                  className="leo-flex-center leo-relative leo-pointer"
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
                    <CheckMark className="leo-flex-center-center leo-absolute">
                      <img src={`${AWS_CDN_URL}/icons/CheckIcon.svg`} alt="" />
                    </CheckMark>
                  )}
                </li>
              ))}
          </CandidateUL>
        </MembersList>
        <Footer className="leo-flex-center-end">
          <div>
            <AppButton
              theme="dark-blue"
              size="small"
              onClick={() => console.log("")}
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
  margin-bottom: 10px;

  .title-name {
    margin-left: 5px;
    font-size: 14px;
    line-height: 17px;
    color: #1e1e1e;
  }
`;

const TagsContainer = styled.div`
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

  button {
    color: grey;
  }
`;

const STModalBody = styled(ModalBody)``;

const MembersList = styled.div`
  max-height: 180px;
  overflow: scroll;
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
  right: 30px;
  background: #35c3ae;
  width: 18px;
  height: 18px;
  border-radius: 50%;
`;
