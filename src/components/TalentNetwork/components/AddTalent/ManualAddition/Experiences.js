import React from "react";

import { API_ROOT_PATH } from "constants/api";

import AddExperience from "./AddExperienceForm";
import notify from "notifications";
import styled from "styled-components";
const Experiences = ({
  experienceAttributes,
  setExperienceAttributes,
  initialExperience,
  companyId,
  session,
  formControl,
  closeModal,
  setViewMode,
  setShouldUpdate = null,
  talentRdsData,
}) => {
  const addNewExperience = () =>
    setExperienceAttributes([...experienceAttributes, initialExperience]);

  const handleTalentAddition = async () => {
    const rds_skills = talentRdsData?.skills
      ? talentRdsData?.skills.map((obj) => ({ name: obj.skill.name }))
      : [];

    let socialProfiles = [];
    if (talentRdsData?.profiles) {
      socialProfiles = talentRdsData.profiles.map((profile) => ({
        network: profile.network,
        url: profile.url,
      }));
    }

    const fileterExpirience = experienceAttributes.filter((exp) => {
      if (!exp?.contractor_attributes?.name?.length || !exp?.title?.length) {
        return false;
      }
      return true;
    });

    const formatedExpirience = fileterExpirience.map((exp) => {
      let nextExp = { ...exp };
      if (!nextExp.end_month) delete nextExp.end_month;
      if (!nextExp.end_year) delete nextExp.end_year;
      return nextExp;
    });

    let formattedSkills;
    let formattedFormSkills;
    let formmattedIndustries;

    if (rds_skills && rds_skills.length > 0) {
      formattedSkills = rds_skills.map((skill) => {
        let formattedName = skill.name.split(" ");
        formattedName = formattedName.map((word) => {
          return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;
        });
        formattedName = formattedName.join(" ");
        return { ...skill, name: formattedName };
      });
    }
    if (formControl.rds_skills && formControl.rds_skills.length > 0) {
      formattedFormSkills = formControl.rds_skills.map((skill) => {
        let formattedName = skill.name.split(" ");
        formattedName = formattedName.map((word) => {
          return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;
        });
        formattedName = formattedName.join(" ");
        return { ...skill, name: formattedName };
      });
    }
    if (talentRdsData?.industries && talentRdsData?.industries) {
      formmattedIndustries = talentRdsData?.industries.map((industry) => {
        let formattedName = industry.name.split(" ");
        formattedName = formattedName.map((word) => {
          return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;
        });
        formattedName = formattedName.join(" ");
        return { ...industry, name: formattedName };
      });
    }
    const requestBody = {
      ...formControl,
      experiences_attributes: [...formatedExpirience],
      profiles: [...socialProfiles],
      rds_skills:
        formattedFormSkills && formattedSkills
          ? [...formattedFormSkills, ...formattedSkills]
          : formattedFormSkills || rds_skills || [],
      rds_industries: formmattedIndustries || [],
      company_id: companyId,
    };
    const url = `${API_ROOT_PATH}/v1/talent_network/${companyId}/manual_add`;
    const params = {
      method: `POST`,
      headers: session,
      body: JSON.stringify(requestBody),
    };

    try {
      const postData = await fetch(url, params);
      const res = await postData.json();
      if (res) {
        if (res.message === "Already in the Talent Network.") {
          notify("danger", "Candidate already in the talent network");
        } else {
          if (setShouldUpdate !== null) setShouldUpdate(Math.random());
          notify("info", "Candidate added to the talent network");
        }
      }

      // return await postData.json();
    } catch (err) {
      console.error(`Error adding a new Talent: ${err}`);
    } finally {
      closeModal();
    }
  };

  const handleBackClick = () => setViewMode(`talent-info`);

  return (
    <div>
      {experienceAttributes &&
        experienceAttributes.map((attr, index) => (
          <AddExperience
            experienceAttributes={experienceAttributes}
            setExperienceAttributes={setExperienceAttributes}
            index={index}
            key={index + 1}
          />
        ))}
      <div>
        <button
          className="button button--primary button--default"
          onClick={addNewExperience}
        >
          Add new experience
        </button>
      </div>
      <Footer className="leo-flex-center-center leo-width-full">
        <button
          className="button button--default button--grey-light"
          onClick={handleBackClick}
        >
          Back
        </button>
        <button
          className="button button--default button--blue-dark"
          onClick={handleTalentAddition}
        >
          Finish
        </button>
      </Footer>
    </div>
  );
};

const Footer = styled.div`
  padding: 30px 0;
  padding-bottom: 0;
  button {
    margin-left: 5px;
    margin-right: 5px;
    max-width: 130px;
    min-width: 130px;
    width: 100%;
  }
`;
export default Experiences;
