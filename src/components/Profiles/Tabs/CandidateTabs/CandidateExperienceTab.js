import React, { useState, useEffect } from "react";
import AvatarIcon from "sharedComponents/AvatarIcon";
import EmptyTab from "components/Profiles/components/EmptyTab";
import { AWS_CDN_URL } from "constants/api";
import styled from "styled-components";
import {
  TabTitle,
  SectionTitleContainer,
  SectionContainer,
} from "components/Profiles/components/ProfileComponents";
import AppButton from "styles/AppButton";
import ExperienceModal from "modals/ExperienceModal";
import { EmptyCompanies } from "assets/svg/EmptyImages";
const CandidateExperienceTab = ({
  experiences,
  store,
  tnProfileId,
  refreshProfile,
}) => {
  const [activeModal, setActiveModal] = useState(undefined);
  const [activeExp, setActiveExp] = useState(undefined);

  // const updateExperiencesArr = (type, newExp) => {
  //   let newArr = [...(experiences ? experiences : [])];
  //   if (type === "delete") {
  //     newArr.splice(activeExp, 1);
  //     setExperiences(newArr);
  //   } else if (type === "edit") {
  //     newArr[activeExp] = newExp;
  //     setExperiences(newArr);
  //   } else if (type === "new") {
  //     newArr.unshift(newExp);
  //   }
  // };

  return (
    <>
      <SectionContainer>
        <SectionTitleContainer>
          <TabTitle>Experience</TabTitle>
        </SectionTitleContainer>
        <ButtonContainer>
          <AppButton onClick={() => setActiveModal("new-experience")}>
            Add Experience
          </AppButton>
        </ButtonContainer>
        <EmptyTab
          data={experiences}
          title={"This candidate has no experience."}
          copy={"Why don't you add some?"}
          image={<EmptyCompanies />}
        >
          {experiences &&
            experiences.map((exp, index) => {
              return (
                <NewExperienceItem
                  key={`exp_${index}`}
                  experience={exp}
                  ix={index}
                  setActiveModal={setActiveModal}
                  setActiveExp={setActiveExp}
                />
              );
            })}
        </EmptyTab>
      </SectionContainer>
      {(activeModal === "new-experience" ||
        (activeModal === "edit-experience" && experiences[activeExp])) && (
        <ExperienceModal
          editingExperience={experiences[activeExp]}
          refreshProfile={refreshProfile}
          store={store}
          hide={() => {
            setActiveModal(undefined);
            setActiveExp(undefined);
          }}
          tnProfileId={tnProfileId}
        />
      )}
    </>
  );
};

const NewExperienceItem = ({
  experience,
  ix,
  setActiveModal,
  setActiveExp,
}) => {
  const [description, setDescription] = useState("");
  const [needsExpand, setNeedsExpand] = useState(false);

  useEffect(() => {
    if (experience.description && experience.description.length > 140) {
      setNeedsExpand(true);
      setDescription(experience.description.substring(0, 141) + "... ");
    } else if (experience.description) {
      setDescription(experience.description);
    }
  }, [experience.description]);

  return (
    <ExpContainer>
      <AvatarIcon
        name={experience.client?.name || experience.company_name}
        imgUrl={experience.client?.avatar_url}
        size={30}
      />
      <ExpBodyContainer>
        <div className="candidate-role">{experience.title}</div>
        <div className="company-name">
          {experience.client?.name || experience.company_name}
        </div>
        <div className="info-external">
          {months[experience.start_month]} {experience.start_year} -{" "}
          {experience.end_month && !experience.current_job
            ? `${months[experience.end_month]} ${experience.end_year}`
            : "Present"}
          {experience.location ? " - " + experience.location : ""}
        </div>
        <p className="text-content">
          {description || ""}
          {needsExpand && (
            <button
              className="more-span"
              onClick={() => {
                setDescription(experience.description);
                setNeedsExpand(false);
              }}
            >
              see more
            </button>
          )}
        </p>
      </ExpBodyContainer>
      <div style={{ width: "20px" }}>
        <button
          onClick={() => {
            setActiveModal("edit-experience");
            setActiveExp(ix);
          }}
          className="edit-button"
        >
          <img src={`${AWS_CDN_URL}/icons/EditPen.svg`} alt="Edit" />
        </button>
      </div>
    </ExpContainer>
  );
};

const months = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 17px;
`;

const ExpContainer = styled.div`
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 15px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-gap: 15px;
  margin-bottom: 20px;

  &:hover {
    .edit-button {
      display: initial;
    }
  }

  .edit-button {
    height: max-content;
    display: none;
  }
`;

const ExpBodyContainer = styled.div`
  .candidate-role {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0.01em;
    color: #1e1e1e;
    margin-bottom: 5px;
  }
  .company-name {
    font-weight: 300;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0.01em;
    color: #1e1e1e;
    margin-bottom: 5px;
  }
  .info-external {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0.01em;
    color: #9a9ca1;
    margin-bottom: 20px;
  }
  .text-content {
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0.01em;
    color: #1e1e1e;
    white-space: pre-wrap;
  }
  .more-span {
    color: #00cba7;
    font-weight: bolder;
  }
`;

export default CandidateExperienceTab;
