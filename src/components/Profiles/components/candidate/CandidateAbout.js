import React, { useState, useEffect } from "react";
import styled from "styled-components";
import EditableContent from "components/Profiles/components/EditableContent";
import TagsComponent from "sharedComponents/TagsComponent";

import {
  Content,
  Subtitle,
  DetailContainer,
} from "components/Profiles/components/ProfileComponents";

const CandidateAbout = ({ tnProfile, editSection, setProfile }) => {
  const [tnSummary, setTnSummary] = useState("");
  const [expandSummary, setExpandSummary] = useState(false);
  const [industriesLimit, setIndustriesLimit] = useState(10);
  const [skillsLimit, setSkillsLimit] = useState(10);

  const experiences = tnProfile.experiences.sort((a, b) => {
    if (b.end_year === a.end_year) {
      return a.end_month - b.end_month;
    } else return b.end_year - a.end_year;
  });
  const currentExperienceIx = experiences.findIndex((exp) => {
    if (exp.start_year === exp.end_year && exp.start_month === exp.end_month) {
      return true;
    } else if (!exp.end_year) {
      return true;
    } else return false;
  });

  const experienceJobTitle = currentExperience(
    currentExperienceIx,
    experiences
  );

  useEffect(() => {
    if (tnProfile.tn_description) {
      if (!expandSummary) {
        let str = tnProfile.tn_description.split(" ").splice(0, 20).join(" ");
        setTnSummary(str);
      } else setTnSummary(tnProfile.tn_description);
    }
  }, [tnProfile.tn_description, expandSummary]);

  const toggleSummary = () => setExpandSummary((state) => !state);
  const toggleIndustries = () =>
    setIndustriesLimit((state) =>
      state === tnProfile.industries.length ? 10 : tnProfile.industries.length
    );
  const toggleSkills = () =>
    setSkillsLimit((state) =>
      state === tnProfile.skills.length ? 10 : tnProfile.skills.length
    );

  return (
    <>
      <DetailContainer>
        <>
          <Subtitle>Job Title</Subtitle>
          <EditableContent
            value={
              tnProfile.job_title
                ? tnProfile.job_title
                : experienceJobTitle !== "-"
                ? experienceJobTitle
                : ""
            }
            type={"text"}
            editing={editSection === "about"}
            onChange={(e) =>
              setProfile({ ...tnProfile, job_title: e.target.value })
            }
          >
            <Content>
              {tnProfile?.job_title ? tnProfile.job_title : experienceJobTitle}
            </Content>
          </EditableContent>
        </>
      </DetailContainer>
      <DetailContainer>
        <Subtitle>Summary</Subtitle>
        <EditableContent
          value={tnProfile.tn_description}
          type="textarea"
          editing={editSection === "about"}
          onChange={(e) =>
            setProfile({ ...tnProfile, tn_description: e.target.value })
          }
          style={{ marginBottom: "10px" }}
        >
          <Content>
            {tnSummary || "-"}{" "}
            {tnProfile.tn_description &&
              tnProfile.tn_description.split(" ").length > 20 && (
                <ToggleExpand onClick={toggleSummary}>
                  {expandSummary ? "Show less" : "Show more"}
                </ToggleExpand>
              )}
          </Content>
        </EditableContent>
      </DetailContainer>
      <DetailContainer>
        <Subtitle>Industries</Subtitle>
        {editSection !== "about" ? (
          <Content>
            <ul>
              {tnProfile.industries &&
                tnProfile.industries.length > 0 &&
                tnProfile.industries.map((ind, i) => {
                  if (i < industriesLimit) {
                    return <li key={i}>{ind.name}</li>;
                  } else return null;
                })}

              {(!tnProfile ||
                !tnProfile.industries ||
                tnProfile.industries.length === 0) &&
                " - "}
            </ul>
            {tnProfile.industries?.length > 10 && (
              <ToggleExpand onClick={toggleIndustries}>
                {industriesLimit === tnProfile.industries.length
                  ? "Show less"
                  : "Show more"}
              </ToggleExpand>
            )}
          </Content>
        ) : (
          <TagsComponent
            type="industries"
            originalTags={tnProfile.industries || undefined}
            returnTags={(categorizations_attributes) =>
              setProfile({ ...tnProfile, categorizations_attributes })
            }
          />
        )}
      </DetailContainer>
      <DetailContainer>
        <Subtitle>Skills</Subtitle>
        {editSection !== "about" ? (
          <Content>
            <ul>
              {tnProfile &&
                tnProfile.skills &&
                tnProfile.skills.length > 0 &&
                tnProfile.skills.map((skill, i) => {
                  if (i < skillsLimit) {
                    return <li key={i}>{skill.name}</li>;
                  } else return null;
                })}
              {(!tnProfile ||
                !tnProfile.skills ||
                tnProfile.skills.length === 0) &&
                " - "}
            </ul>
            {tnProfile.skills?.length > 10 && (
              <ToggleExpand onClick={toggleSkills}>
                {skillsLimit === tnProfile.skills.length
                  ? "Show less"
                  : "Show more"}
              </ToggleExpand>
            )}
          </Content>
        ) : (
          <TagsComponent
            type="skills"
            originalTags={tnProfile.skills || undefined}
            returnTags={(competencies_attributes) =>
              setProfile({ ...tnProfile, competencies_attributes })
            }
          />
        )}
      </DetailContainer>
    </>
  );
};

function currentExperience(currentExperience, experiences) {
  if (currentExperience === -1) {
    return "-";
  } else {
    return experiences[currentExperience].title;
  }
}

const ToggleExpand = styled.button`
  color: #74767b;
  display: block;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
`;

export default CandidateAbout;
