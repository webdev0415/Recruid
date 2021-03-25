import React, { useState } from "react";
import styled from "styled-components";
import spacetime from "spacetime";
import { PermissionChecker } from "constants/permissionHelpers";
import EditableContent from "components/Profiles/components/EditableContent";
import EditButtons from "components/Profiles/components/EditButtons";
import CandidateAbout from "components/Profiles/components/candidate/CandidateAbout";
import FileReader from "sharedComponents/FileReader";
import TagsComponent from "sharedComponents/TagsComponent";
import WorkInterestv2 from "components/Profiles/components/candidate/WorkInteresv2";
import Collaborators from "components/Collaborators";
import { updateCandidateCollaborators } from "helpersV2/CandidateProfile";
import notify from "notifications";
// import CandidateCollaborators from "components/Profiles/components/candidate/CandidateCollaborators";
import { AWS_CDN_URL } from "constants/api";

import {
  TabTitle,
  DetailContainer,
  Content,
  Subtitle,
  SectionTitleContainer,
  SectionContainer,
} from "components/Profiles/components/ProfileComponents";

const CandidateOverviewTab = ({
  tnProfile,
  editSection,
  triggerEditSection,
  cancelEdit,
  setProfile,
  editTalentNetworkProfile,
  store,
  setEditSection,
  resumes,
  originalLocations,
  refreshProfile,
}) => {
  const [newCollaborators, setNewCollaborators] = useState(undefined);

  const editCollaborators = () => {
    if (newCollaborators) {
      updateCandidateCollaborators(
        store.session,
        store.company.id,
        tnProfile.ptn_id,
        newCollaborators
      ).then((res) => {
        if (!res.err) {
          refreshProfile();
          // let newArr = [...tnProfile.collaborators];
          // if (res.created && res.created.length > 0) {
          //   newArr = [...newArr, ...res.created];
          // }
          // if (res.deleted && res.deleted.length > 0) {
          //   let ids = res.deleted.map((coll) => coll.id);
          //   newArr = newArr.filter((coll) => ids.indexOf[coll.id] === -1);
          // }
          // setProfile({ ...tnProfile, collaborators: newArr });
        } else {
          notify("danger", res);
        }
      });
    }
    setEditSection(undefined);
  };

  return (
    <>
      <SectionContainer>
        <SectionTitleContainer>
          <TabTitle>Contact</TabTitle>
          <PermissionChecker type="edit" valid={{ recruiter: true }}>
            <EditButtons
              style={{ right: "0px" }}
              editing={editSection === "details"}
              onClickEdit={() => triggerEditSection("details")}
              onClickCancel={() => {
                setNewCollaborators(undefined);
                cancelEdit();
              }}
              onClickSave={editTalentNetworkProfile}
            />
          </PermissionChecker>
        </SectionTitleContainer>
        {(store.company.invited_by_agency ||
          store.company.invited_by_employer) &&
        store.company?.trial !== "upgraded" ? null : (
          <>
            <DetailContainer>
              <Subtitle>Email</Subtitle>
              <EditableContent
                value={tnProfile.tn_email}
                type={"text"}
                editing={editSection === "details"}
                onChange={(e) =>
                  setProfile({ ...tnProfile, tn_email: e.target.value })
                }
              >
                <Content>{tnProfile.tn_email}</Content>
              </EditableContent>
            </DetailContainer>
            <DetailContainer>
              <Subtitle>Telephone</Subtitle>
              <EditableContent
                value={tnProfile.telephone}
                type={"text"}
                editing={editSection === "details"}
                onChange={(e) =>
                  setProfile({ ...tnProfile, telephone: e.target.value })
                }
              >
                <Content>
                  {(
                    <a href={`tel:${tnProfile.telephone}`}>
                      {tnProfile.telephone}
                    </a>
                  ) || "-"}
                </Content>
              </EditableContent>
            </DetailContainer>
          </>
        )}
        <DetailContainer>
          <Subtitle>Source</Subtitle>
          {editSection !== "details" ? (
            <Content>{tnProfile.custom_source?.source || "-"}</Content>
          ) : (
            <select
              name="source"
              className="form-control form-control-select"
              value={
                tnProfile.custom_source_id || tnProfile.custom_source?.id || ""
              }
              // defaultValue=""
              onChange={(e) =>
                setProfile({
                  ...tnProfile,
                  custom_source_id: Number(e.target.value),
                })
              }
            >
              <option value="" disabled hidden>
                Please select an option
              </option>
              {store.sources &&
                store.sources.map((source, index) => (
                  <option key={`source-${index}`} value={source.id}>
                    {source.source}
                  </option>
                ))}
            </select>
          )}
        </DetailContainer>
        {/*<DetailContainer>
          <Subtitle>Candidate Associated Members</Subtitle>
          <Subtitle>Candidate Collaborators</Subtitle>
          <CandidateCollaborators
            tnProfile={tnProfile}
            setProfile={setProfile}
            edit={editSection === "details"}
            store={store}
          />
        </DetailContainer>*/}
        <DetailContainer>
          <Subtitle>Locations</Subtitle>
          {editSection !== "details" ? (
            <Content>
              {originalLocations?.length > 0
                ? originalLocations.map(
                    (loc, index) =>
                      `${loc.name}${
                        index !== originalLocations.length - 1 ? ", " : ""
                      }`
                  )
                : "-"}
            </Content>
          ) : (
            <TagsComponent
              type="locations"
              originalTags={originalLocations}
              returnTags={(localizations_attributes) =>
                setProfile({
                  ...tnProfile,
                  localizations_attributes,
                })
              }
            />
          )}
        </DetailContainer>
        <DetailContainer>
          {tnProfile.profiles && tnProfile.profiles.length > 0 && (
            <>
              <Subtitle>Social Profiles</Subtitle>
              <Content>
                <ul>
                  {tnProfile.profiles.map((profile, index) => (
                    <SocialIcon key={index}>
                      <a
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {profile.network === "facebook" ? (
                          <img
                            src={`${AWS_CDN_URL}/icons/Facebook.svg`}
                            alt="Facebook"
                          />
                        ) : profile.network === "github" ? (
                          <img
                            src={`${AWS_CDN_URL}/icons/Github.svg`}
                            alt="Github"
                          />
                        ) : profile.network === "instagram" ? (
                          <img
                            src={`${AWS_CDN_URL}/icons/Instagram.svg`}
                            alt="Instagram"
                          />
                        ) : profile.network === "linkedin" ? (
                          <img
                            src={`${AWS_CDN_URL}/icons/LinkedIn.svg`}
                            alt="LinkedIn"
                          />
                        ) : profile.network === "stackoverflow" ? (
                          <img
                            src={`${AWS_CDN_URL}/icons/StackOverflow.svg`}
                            alt="StackOverflow"
                          />
                        ) : profile.network === "twitter" ? (
                          <img
                            src={`${AWS_CDN_URL}/icons/Twitter.svg`}
                            alt="Twitter"
                          />
                        ) : (
                          "Other"
                        )}
                      </a>
                    </SocialIcon>
                  ))}
                </ul>
              </Content>
            </>
          )}
        </DetailContainer>
      </SectionContainer>
      <SectionContainer>
        <DetailContainer>
          <WorkInterestv2
            tnProfile={tnProfile}
            setProfile={setProfile}
            editing={editSection === "details"}
            company={store.company}
          />
        </DetailContainer>
      </SectionContainer>
      <SectionContainer>
        <SectionTitleContainer>
          <TabTitle>Candidate Collaborators</TabTitle>
          <PermissionChecker type="edit" valid={{ recruiter: true }}>
            <EditButtons
              style={{ right: "0px" }}
              editing={editSection === "collaborator"}
              onClickEdit={() => triggerEditSection("collaborator")}
              onClickCancel={cancelEdit}
              onClickSave={editCollaborators}
            />
          </PermissionChecker>
        </SectionTitleContainer>
        <DetailContainer>
          <Collaborators
            collaborators={tnProfile?.collaborators}
            edit={editSection === "collaborator"}
            store={store}
            setNewCollaborators={setNewCollaborators}
          />
        </DetailContainer>
      </SectionContainer>

      <SectionContainer>
        <SectionTitleContainer>
          <TabTitle>About</TabTitle>
          <PermissionChecker type="edit" valid={{ recruiter: true }}>
            <EditButtons
              editing={editSection === "about"}
              onClickEdit={() => setEditSection("about")}
              onClickCancel={() => setEditSection(undefined)}
              onClickSave={editTalentNetworkProfile}
              style={{ right: "0", top: "0" }}
            />
          </PermissionChecker>
        </SectionTitleContainer>
        <CandidateAbout
          tnProfile={tnProfile}
          editSection={editSection}
          setProfile={setProfile}
        />
        <DetailContainer>
          <Subtitle>Years of experience</Subtitle>
          <EditableContent
            value={tnProfile.years_experience}
            type={"number"}
            editing={editSection === "about"}
            onChange={(e) =>
              setProfile({ ...tnProfile, years_experience: e.target.value })
            }
          >
            <Content>{tnProfile.years_experience || "-"}</Content>
          </EditableContent>
        </DetailContainer>
        <DetailContainer>
          <Subtitle>Age</Subtitle>
          <EditableContent
            value={tnProfile.age}
            type={"number"}
            editing={editSection === "about"}
            onChange={(e) => setProfile({ ...tnProfile, age: e.target.value })}
          >
            <Content>{tnProfile.age || "-"}</Content>
          </EditableContent>
        </DetailContainer>
        <DetailContainer>
          <Subtitle>Gender</Subtitle>
          <EditableContent
            value={tnProfile.sex}
            type={"select"}
            placeholder="Select a gender..."
            options={genderOptions}
            editing={editSection === "about"}
            onChange={(option) =>
              setProfile({ ...tnProfile, sex: option.value })
            }
          >
            <Content>{tnProfile.sex || "-"}</Content>
          </EditableContent>
        </DetailContainer>
        <DetailContainer>
          <Subtitle>Travel Willingness</Subtitle>
          <EditableContent
            value={
              tnProfile.travel_willingness === true
                ? "Yes"
                : tnProfile.travel_willingness === false
                ? "No"
                : undefined
            }
            type={"select"}
            placeholder="Select an option..."
            options={boolOptions}
            editing={editSection === "about"}
            onChange={(option) =>
              setProfile({ ...tnProfile, travel_willingness: option.value })
            }
          >
            <Content>
              {tnProfile.travel_willingness === true
                ? "Yes"
                : tnProfile.travel_willingness === false
                ? "No"
                : "-"}
            </Content>
          </EditableContent>
        </DetailContainer>
        <DetailContainer>
          <Subtitle>Immediate Start</Subtitle>
          <EditableContent
            value={
              tnProfile.immediate_start === true
                ? "Yes"
                : tnProfile.immediate_start === false
                ? "No"
                : undefined
            }
            type={"select"}
            placeholder="Select an option..."
            options={boolOptions}
            editing={editSection === "about"}
            onChange={(option) =>
              setProfile({ ...tnProfile, immediate_start: option.value })
            }
          >
            <Content>
              {tnProfile.immediate_start === true
                ? "Yes"
                : tnProfile.immediate_start === false
                ? "No"
                : "-"}
            </Content>
          </EditableContent>
          <DetailContainer></DetailContainer>
          <Subtitle>Contracted Until</Subtitle>
          <EditableContent
            value={
              new Date(
                tnProfile.contracted_until
                  ? tnProfile.contracted_until
                  : Date.now()
              )
            }
            type={"date"}
            editing={editSection === "about"}
            onChange={(option) =>
              setProfile({ ...tnProfile, contracted_until: option })
            }
          >
            <Content>
              {tnProfile.contracted_until
                ? spacetime(new Date(tnProfile.contracted_until)).format(
                    "{date} {month}, {year}"
                  )
                : "-"}
            </Content>
          </EditableContent>
        </DetailContainer>
      </SectionContainer>
      {resumes && resumes.length > 0 && resumes[0].content_type && (
        <>
          <SectionContainer>
            <SectionTitleContainer>
              {validViewTypes[resumes[0].content_type?.split("/")[1]] && (
                <TabTitle>Resume</TabTitle>
              )}
            </SectionTitleContainer>
            <FileReader
              rawType={resumes[0].content_type}
              fileUrl={resumes[0].candidate_cv_url}
              small
            />
          </SectionContainer>
        </>
      )}
    </>
  );
};

const SocialIcon = styled.li`
  margin: 0;

  &:not(:last-child) {
    margin-right: 10px !important;
  }

  &:after {
    content: none !important;
  }
`;

const genderOptions = [
  { name: "Female", value: "female" },
  { name: "Male", value: "male" },
  { name: "Other", value: "other" },
  { name: "Prefer not say", value: "prefer not say" },
  { name: "Not defined", value: "not defined" },
];

const boolOptions = [
  { name: "Yes", value: true },
  { name: "No", value: false },
];

const validViewTypes = {
  png: true,
  jpeg: true,
  gif: true,
  bmp: true,
  pdf: true,
  csv: true,
  xslx: true,
  docx: true,
  mp4: true,
  webm: true,
  mp3: true,
};

export default CandidateOverviewTab;
