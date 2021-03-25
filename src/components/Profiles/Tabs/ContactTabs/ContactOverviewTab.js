import React, { useEffect, useState } from "react";
import notify from "notifications";
import Select from "react-select";
import { ROUTES } from "routes";
import { PermissionChecker } from "constants/permissionHelpers";
import styled from "styled-components";
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
import TagsComponent from "sharedComponents/TagsComponent";
import sharedHelpers from "helpers/sharedHelpers";
import { fetchAllCompanies } from "helpers/crm/clientCompanies";
import { AWS_CDN_URL } from "constants/api";

const ContactOverviewTab = ({
  deals,
  contact,
  setContact,
  saveContact,
  editSection,
  triggerEditSection,
  cancelEdit,
  store,
  setInnerModal,
  setRedirect,
  allCompanies,
  setAllCompanies,
  saveNewContactCompany,
  selectedContactId,
}) => {
  const [allCompaniesOptions, setAllCompaniesOptions] = useState(undefined);
  const [selectedCompany, setSelectedCompany] = useState(undefined);
  const [industriesLimit, setIndustriesLimit] = useState(10);
  const [skillsLimit, setSkillsLimit] = useState(10);
  const [tnSummary, setTnSummary] = useState("");
  const [expandSummary, setExpandSummary] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    if (store.teamMembers) {
      setFilteredMembers(
        store.teamMembers.filter(
          (member) =>
            member.permission === "owner" || member.roles.includes("business")
        )
      );
    }
  }, [store.teamMembers]);

  useEffect(() => {
    if (!allCompanies && editSection === "company") {
      fetchAllCompanies(store.session, {
        company_id: store.company.id,
        get_all: true,
      }).then((res) => {
        if (!res.err) {
          setAllCompanies(res);
        } else {
          notify("danger", "Unable to fetch companies");
        }
      });
    }
  }, [
    allCompanies,
    setAllCompanies,
    editSection,
    store.company,
    store.session,
  ]);

  useEffect(() => {
    if (allCompanies && !allCompaniesOptions) {
      setAllCompaniesOptions(
        allCompanies.map((company) => ({
          name: company.company_name,
          id: company.client_id,
        }))
      );
    }
  }, [allCompanies, allCompaniesOptions]);

  useEffect(() => {
    if (contact.description) {
      if (!expandSummary) {
        let str = contact.description.split(" ").splice(0, 20).join(" ");
        setTnSummary(str);
      } else setTnSummary(contact.description);
    }
  }, [contact.description, expandSummary]);

  const findOwnerIndex = () => {
    let index;
    if (
      store.teamMembers &&
      store.teamMembers.length > 0 &&
      contact &&
      contact.contact_owner
    ) {
      filteredMembers.map((member, i) => {
        if (member.name === contact.contact_owner) {
          index = i;
        }
        return null;
      });
    }

    return index;
  };

  const deleteDeal = (index) => {
    let newContact = { ...contact };
    let deals = [...contact.deals];
    let deal = { ...contact.deals[index] };
    deal.delete = true;
    deals[index] = deal;
    newContact.deals = deals;
    setContact(newContact);
  };

  const toggleIndustries = () =>
    setIndustriesLimit((state) =>
      state === contact.industries.length ? 10 : contact.industries.length
    );
  const toggleSkills = () =>
    setSkillsLimit((state) =>
      state === contact.skills.length ? 10 : contact.skills.length
    );

  const toggleSummary = () => setExpandSummary((state) => !state);

  return (
    <>
      <SectionContainer>
        <SectionTitleContainer>
          <TabTitle>Contact Details</TabTitle>
          <PermissionChecker type="edit" valid={{ business: true }}>
            <EditButtons
              style={{ right: "0px" }}
              editing={editSection === "details"}
              onClickEdit={() => triggerEditSection("details")}
              onClickCancel={cancelEdit}
              onClickSave={() => saveContact()}
            />
          </PermissionChecker>
        </SectionTitleContainer>
        <DetailContainer>
          <Subtitle>Name</Subtitle>
          <EditableContent
            value={contact.name}
            type={"text"}
            editing={editSection === "details"}
            onChange={(e) =>
              setContact({
                ...contact,
                name: e.target.value,
              })
            }
          >
            <Content>{contact.name ? contact.name : "-"}</Content>
          </EditableContent>
          <Subtitle>Title</Subtitle>
          <EditableContent
            value={contact.title}
            type={"text"}
            editing={editSection === "details"}
            onChange={(e) =>
              setContact({
                ...contact,
                title: e.target.value,
              })
            }
          >
            <Content>{contact.title ? contact.title : "-"}</Content>
          </EditableContent>
          <Subtitle>Email</Subtitle>
          <EditableContent
            value={contact.email}
            type={"text"}
            editing={editSection === "details"}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
          >
            <Content>{contact.email ? contact.email : "-"}</Content>
          </EditableContent>
          <Subtitle>Phone Number</Subtitle>
          <EditableContent
            value={contact.number}
            type={"text"}
            editing={editSection === "details"}
            onChange={(e) => setContact({ ...contact, number: e.target.value })}
          >
            <Content>
              {contact.number ? (
                <a href={`tel:${contact.number}`}>{contact.number}</a>
              ) : (
                "-"
              )}
            </Content>
          </EditableContent>
          <Subtitle>Summary</Subtitle>
          <EditableContent
            value={contact.description}
            type="textarea"
            editing={editSection === "details"}
            onChange={(e) =>
              setContact({ ...contact, description: e.target.value })
            }
            style={{ marginBottom: "10px" }}
          >
            <Content>
              {tnSummary || "-"}{" "}
              {contact.description &&
                contact.description.split(" ").length > 20 && (
                  <ToggleExpand onClick={toggleSummary}>
                    {expandSummary ? "Show less" : "Show more"}
                  </ToggleExpand>
                )}
            </Content>
          </EditableContent>
          <Subtitle>Contact Owner</Subtitle>
          <EditableContent
            value={findOwnerIndex()}
            type={"members"}
            editing={editSection === "details"}
            onChange={(e) =>
              setContact({
                ...contact,
                contact_owner: filteredMembers[e.target.value].name,
                owner_id: filteredMembers[e.target.value].team_member_id,
              })
            }
            teamMembers={filteredMembers}
          >
            <Content>{contact.contact_owner}</Content>
          </EditableContent>
          {contact.last_contact && (
            <>
              <Subtitle>Last contacted</Subtitle>
              <EditableContent
                value={contact.last_contact || Date.now()}
                type={"date"}
                editing={editSection === "details"}
                onChange={(value) =>
                  setContact({
                    ...contact,
                    last_contact: value,
                  })
                }
              >
                <Content>{contact.last_contact?.toString()}</Content>
              </EditableContent>
            </>
          )}
          <Subtitle>Industries</Subtitle>
          {editSection !== "details" ? (
            <Content>
              <ul>
                {contact.industries &&
                  contact.industries.length > 0 &&
                  contact.industries.map((ind, i) => {
                    if (i < industriesLimit) {
                      return <li key={i}>{ind.name}</li>;
                    } else return null;
                  })}

                {(!contact ||
                  !contact.industries ||
                  contact.industries.length === 0) &&
                  " - "}
              </ul>
              {contact.industries?.length > 10 && (
                <ToggleExpand onClick={toggleIndustries}>
                  {industriesLimit === contact.industries.length
                    ? "Show less"
                    : "Show more"}
                </ToggleExpand>
              )}
            </Content>
          ) : (
            <TagsComponent
              type="industries"
              originalTags={contact.industries || undefined}
              returnTags={(categorizations_attributes) =>
                setContact({ ...contact, categorizations_attributes })
              }
            />
          )}
          <Subtitle>Skills</Subtitle>
          {editSection !== "details" ? (
            <Content>
              <ul>
                {contact &&
                  contact.skills &&
                  contact.skills.length > 0 &&
                  contact.skills.map((skill, i) => {
                    if (i < skillsLimit) {
                      return <li key={i}>{skill.name}</li>;
                    } else return null;
                  })}
                {(!contact || !contact.skills || contact.skills.length === 0) &&
                  " - "}
              </ul>
              {contact.skills?.length > 10 && (
                <ToggleExpand onClick={toggleSkills}>
                  {skillsLimit === contact.skills.length
                    ? "Show less"
                    : "Show more"}
                </ToggleExpand>
              )}
            </Content>
          ) : (
            <TagsComponent
              type="skills"
              originalTags={contact.skills || undefined}
              returnTags={(competencies_attributes) =>
                setContact({ ...contact, competencies_attributes })
              }
            />
          )}
          <Subtitle>Locations</Subtitle>
          {editSection !== "details" ? (
            <Content>
              <ul>
                {contact &&
                  contact.locations &&
                  contact.locations.length > 0 &&
                  contact.locations.map((loc, i) => {
                    if (i < skillsLimit) {
                      return <li key={i}>{loc.name}</li>;
                    } else return null;
                  })}
                {(!contact ||
                  !contact.locations ||
                  contact.locations.length === 0) &&
                  " - "}
              </ul>
            </Content>
          ) : (
            <TagsComponent
              type="locations"
              originalTags={contact.locations}
              returnTags={(localizations_attributes) =>
                setContact({
                  ...contact,
                  localizations_attributes,
                })
              }
            />
          )}
        </DetailContainer>
      </SectionContainer>
      <SectionContainer>
        <CardContainer>
          <SectionTitleContainer>
            <TabTitle>Company</TabTitle>
            <PermissionChecker type="edit" valid={{ business: true }}>
              <EditButtons
                style={{ right: "0px" }}
                editing={editSection === "company"}
                onClickEdit={() => triggerEditSection("company")}
                onClickCancel={cancelEdit}
                onClickSave={() =>
                  saveNewContactCompany(selectedCompany?.value)
                }
              />
            </PermissionChecker>
          </SectionTitleContainer>
          {editSection !== "company" && contact.company && (
            <InfoCard
              light
              header={contact.company.name}
              subText={contact.company.industry}
              phone={contact.company.phone}
              avatar={contact.company.avatar}
              setRedirectToProfile={() => {
                setRedirect(
                  ROUTES.ClientProfile.url(
                    store.company.mention_tag,
                    contact.company.client_id
                  )
                );
              }}
            />
          )}
          {editSection === "company" && (
            <>
              {allCompaniesOptions && (
                <Select
                  name="pipeline_selector"
                  options={sharedHelpers.extractOptions(allCompaniesOptions)}
                  onChange={(company) => setSelectedCompany(company)}
                  placeholder="Client"
                  value={selectedCompany}
                />
              )}
            </>
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
                    company={store.company}
                  />
                );
              } else {
                return null;
              }
            })}
          {deals?.length > 0 && (
            <AllLink
              to={ROUTES.ContactProfile.url(
                store.company.mention_tag,
                selectedContactId,
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

const ToggleExpand = styled.button`
  color: #74767b;
  display: block;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
`;

export default ContactOverviewTab;
