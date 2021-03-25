import React, { useState } from "react";
import {
  SectionTitleContainer,
  TabTitle,
  DetailContainer,
  Content,
  Subtitle,
  AllLink,
  CardContainer,
  SectionContainer,
} from "components/Profiles/components/ProfileComponents";
import InfoCard from "components/Profiles/components/InfoCard";
import EditButtons from "components/Profiles/components/EditButtons";
import { StyledButton } from "components/Profiles/components/EditButtons";
import EditableContent from "components/Profiles/components/EditableContent";
import DealInfoCard from "components/Profiles/components/deal/DealInfoCard";
import { ROUTES } from "routes";
import { PermissionChecker } from "constants/permissionHelpers";
import TagsComponent from "sharedComponents/TagsComponent";
import Collaborators from "components/Collaborators";
import { updateCompanyCollaborators } from "helpersV2/vendors/clients";
import notify from "notifications";
import { AWS_CDN_URL } from "constants/api";

const CompanyOverviewTab = ({
  deals,
  contacts,
  profileCompany,
  setProfileCompany,
  saveProfileCompany,
  editSection,
  triggerEditSection,
  cancelEdit,
  store,
  setInnerModal,
  setRedirect,

  selectedCompanyId,

  originalLocations,

  refreshProfile,
  originalSkills,
  originalIndustries,
}) => {
  const [newCollaborators, setNewCollaborators] = useState(undefined);
  const editCollaborators = () => {
    if (newCollaborators) {
      updateCompanyCollaborators(
        store.session,
        store.company.id,
        profileCompany.layer_id,
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
    triggerEditSection(undefined);
  };

  // const [selectedIndustryIndex, setSelectedIndustryIndex] = useState(undefined);

  // const changeIndustry = e => {
  //   let newCompany = { ...profileCompany };
  //   let industries = newCompany.industries.map(industry => {
  //     return { ...industry, delete: true };
  //   });
  //   industries.push(store.industries[e.target.value]);
  //   newCompany.industries = industries;
  //   setProfileCompany(newCompany);
  //   setSelectedIndustryIndex(e.target.value);
  // };

  const deleteDeal = (index) => {
    let newCompany = { ...profileCompany };
    let deals = [...profileCompany.deals];
    let deal = { ...profileCompany.deals[index] };
    deal.delete = true;
    deals[index] = deal;
    newCompany.deals = deals;
    setProfileCompany(newCompany);
  };

  const deleteContact = (index) => {
    let newCompany = { ...profileCompany };
    let contacts = [...profileCompany.contacts];
    let contact = { ...profileCompany.contacts[index] };
    contact.delete = true;
    contacts[index] = contact;
    newCompany.contacts = contacts;
    setProfileCompany(newCompany);
  };

  return (
    <>
      <SectionContainer>
        <SectionTitleContainer>
          <TabTitle>Company Details</TabTitle>
          <PermissionChecker type="edit" valid={{ business: true }}>
            <EditButtons
              style={{ right: "0px" }}
              editing={editSection === "details"}
              onClickEdit={() => triggerEditSection("details")}
              onClickCancel={cancelEdit}
              onClickSave={() => saveProfileCompany()}
            />
          </PermissionChecker>
        </SectionTitleContainer>
        <DetailContainer>
          <Subtitle>Name</Subtitle>
          <EditableContent
            value={profileCompany.name}
            type={"text"}
            editing={editSection === "details"}
            onChange={(e) =>
              setProfileCompany({
                ...profileCompany,
                name: e.target.value,
              })
            }
          >
            <Content>{profileCompany.name}</Content>
          </EditableContent>
          <Subtitle>Domain</Subtitle>
          <EditableContent
            value={profileCompany.domain}
            type={"text"}
            editing={editSection === "details"}
            onChange={(e) =>
              setProfileCompany({
                ...profileCompany,
                domain: e.target.value,
              })
            }
          >
            <Content>
              {profileCompany.domain ? profileCompany.domain : "-"}
            </Content>
          </EditableContent>
          <Subtitle>Description</Subtitle>
          <EditableContent
            value={profileCompany.description}
            type={"textarea"}
            editing={editSection === "details"}
            onChange={(e) =>
              setProfileCompany({
                ...profileCompany,
                description: e.target.value,
              })
            }
          >
            <Content>
              {profileCompany.description ? profileCompany.description : "-"}
            </Content>
          </EditableContent>
          <Subtitle>Industries</Subtitle>
          {editSection !== "details" ? (
            <Content>
              <ul>
                {profileCompany.categorizations &&
                  profileCompany.categorizations.length > 0 &&
                  profileCompany.categorizations.map((ind, i) => {
                    return <li key={i}>{ind.category.name}</li>;
                  })}
                {(!profileCompany ||
                  !profileCompany.categorizations ||
                  profileCompany.categorizations.length === 0) &&
                  " - "}
              </ul>
            </Content>
          ) : (
            <TagsComponent
              type="industries"
              originalTags={originalIndustries}
              returnTags={(categorizations_attributes) =>
                setProfileCompany({
                  ...profileCompany,
                  categorizations_attributes,
                })
              }
            />
          )}
          <Subtitle>Skills hiring for</Subtitle>
          {editSection !== "details" ? (
            <Content>
              <ul>
                {profileCompany.competencies &&
                  profileCompany.competencies.length > 0 &&
                  profileCompany.competencies.map((ind, i) => {
                    return <li key={i}>{ind.skill.name}</li>;
                  })}

                {(!profileCompany ||
                  !profileCompany.competencies ||
                  profileCompany.competencies.length === 0) &&
                  " - "}
              </ul>
            </Content>
          ) : (
            <TagsComponent
              type="skills"
              originalTags={originalSkills}
              returnTags={(competencies_attributes) =>
                setProfileCompany({
                  ...profileCompany,
                  competencies_attributes,
                })
              }
            />
          )}
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
                setProfileCompany({
                  ...profileCompany,
                  localizations_attributes,
                })
              }
            />
          )}
          <Subtitle>Annual Revenue</Subtitle>
          <EditableContent
            value={profileCompany.annual_revenue ?? ""}
            type={"number"}
            editing={editSection === "details"}
            onChange={(e) =>
              setProfileCompany({
                ...profileCompany,
                annual_revenue: e.target.value,
              })
            }
          >
            <Content>
              {profileCompany.annual_revenue
                ? profileCompany.annual_revenue
                : "-"}
            </Content>
          </EditableContent>
          <Subtitle>Company Size</Subtitle>
          <EditableContent
            value={profileCompany?.size}
            type={"number"}
            editing={editSection === "details"}
            onChange={(e) =>
              setProfileCompany({
                ...profileCompany,
                size: e.target.value,
              })
            }
          >
            <Content>{profileCompany?.size ?? "-"}</Content>
          </EditableContent>
        </DetailContainer>
      </SectionContainer>
      <SectionContainer>
        <SectionTitleContainer>
          <TabTitle>Client Collaborators</TabTitle>
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
            collaborators={profileCompany?.collaborators}
            edit={editSection === "collaborator"}
            store={store}
            setNewCollaborators={setNewCollaborators}
          />
        </DetailContainer>
      </SectionContainer>
      <SectionContainer>
        <CardContainer
          className="leo-relative"
          style={{ marginBottom: "30px" }}
        >
          <SectionTitleContainer>
            <TabTitle>
              Contacts {contacts && <>({contacts?.length})</>}
            </TabTitle>
            <PermissionChecker type="edit" valid={{ business: true }}>
              <StyledButton onClick={() => setInnerModal("create_contact")}>
                <img src={`${AWS_CDN_URL}/icons/AddIcon.svg`} alt="Add" />
              </StyledButton>
            </PermissionChecker>
          </SectionTitleContainer>
          {contacts?.length > 0 &&
            contacts.slice(0, 2).map((contact, index) => {
              if (!contact.delete) {
                return (
                  <InfoCard
                    light
                    key={`info-card-${index}`}
                    header={contact.name}
                    subText={contact.title}
                    email={contact.email}
                    phone={contact.phone}
                    avatar={contact.avatar}
                    editing={editSection === "contacts"}
                    deleteCard={() => deleteContact(index)}
                    type={"contact"}
                    company={contact.companies && contact.companies[0].name}
                    setRedirectToProfile={() => {
                      setRedirect(
                        ROUTES.ContactProfile.url(
                          store.company.mention_tag,
                          contact.id
                        )
                      );
                    }}
                  />
                );
              } else {
                return null;
              }
            })}
          {contacts?.length > 0 && (
            <AllLink
              to={ROUTES.ClientProfile.url(
                store.company.mention_tag,
                selectedCompanyId,
                "contacts"
              )}
            >
              View All
            </AllLink>
          )}
        </CardContainer>
        <CardContainer>
          <SectionTitleContainer>
            <TabTitle>Deals {deals && <>({deals?.length})</>}</TabTitle>
            <PermissionChecker type="edit" valid={{ business: true }}>
              <StyledButton onClick={() => setInnerModal("create_deal")}>
                <img src={`${AWS_CDN_URL}/icons/AddIcon.svg`} alt="Add" />
              </StyledButton>
            </PermissionChecker>
          </SectionTitleContainer>
          {deals?.length > 0 &&
            deals.slice(0, 2).map((deal, index) => {
              if (!deal.delete) {
                return (
                  <DealInfoCard
                    light
                    key={`info-card-${index}`}
                    deal={deal}
                    company={store.company}
                    editing={editSection === "deals"}
                    deleteCard={() => deleteDeal(index)}
                    setRedirectToProfile={() => {
                      setRedirect(
                        ROUTES.DealProfile.url(
                          store.company.mention_tag,
                          deal.id
                        )
                      );
                    }}
                  />
                );
              } else {
                return null;
              }
            })}
          {deals?.length > 0 && (
            <AllLink
              to={ROUTES.ClientProfile.url(
                store.company.mention_tag,
                selectedCompanyId,
                "deals"
              )}
            >
              View All
            </AllLink>
          )}
        </CardContainer>
      </SectionContainer>
    </>
  );
};

export default CompanyOverviewTab;
