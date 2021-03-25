import React, { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import spacetime from "spacetime";
import { ROUTES } from "routes";
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
import { PermissionChecker } from "constants/permissionHelpers";
import Select from "react-select";
import notify from "notifications";
import sharedHelpers from "helpers/sharedHelpers";
import { fetchAllCompanies } from "helpers/crm/clientCompanies";
import TeamSelector from "sharedComponents/TeamSelector";
import { AWS_CDN_URL } from "constants/api";

const DealOverviewTab = ({
  contacts,
  company,
  deal,
  setDeal,
  editSection,
  triggerEditSection,
  cancelEdit,
  saveDeal,
  store,
  deleteContact,
  setInnerModal,
  setRedirect,
  allCompanies,
  setAllCompanies,
  saveNewDealCompany,
  selectedDealId,
  dealStage,
}) => {
  const [allCompaniesOptions, setAllCompaniesOptions] = useState(undefined);
  const [selectedCompany, setSelectedCompany] = useState(undefined);
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

  const findOwnerIndex = () => {
    let index;
    if (
      store.teamMembers &&
      store.teamMembers.length > 0 &&
      deal &&
      deal.owner
    ) {
      filteredMembers.map((member, i) => {
        if (member.team_member_id === deal.owner?.id) {
          index = i;
        }
        return null;
      });
    }
    return index;
  };

  const addMember = (newId) => {
    saveDeal({ team_member_ids: [...(deal.team_member_ids || []), newId] });
  };

  const removeMember = (newId) => {
    let newMembers = [...deal.team_member_ids];
    newMembers.splice(deal.team_member_ids.indexOf(newId), 1);
    saveDeal({ team_member_ids: newMembers });
  };

  return (
    <>
      <SectionContainer>
        <SectionTitleContainer>
          <TabTitle>Deal Details</TabTitle>
          <PermissionChecker type="edit" valid={{ business: true }}>
            <EditButtons
              style={{ right: "0px" }}
              editing={editSection === "details"}
              onClickEdit={() => triggerEditSection("details")}
              onClickCancel={cancelEdit}
              onClickSave={() => saveDeal()}
            />
          </PermissionChecker>
        </SectionTitleContainer>
        <DetailContainer>
          <Subtitle>Deal Value</Subtitle>
          <EditableContent
            value={Math.floor(deal.value)}
            type={"number"}
            editing={editSection === "details"}
            onChange={(e) => setDeal({ ...deal, value: e.target.value })}
          >
            <Content>
              <NumberFormat
                value={Math.floor(deal.value)}
                displayType={"text"}
                prefix={store.company?.currency?.currency_name}
                thousandSeparator={true}
                renderText={(value) => <>{value}</>}
              />
            </Content>
          </EditableContent>
          {deal.create_job && (
            <>
              <Subtitle>Vacancies</Subtitle>
              <EditableContent
                value={deal.vacancies}
                type={"number"}
                editing={editSection === "details"}
                onChange={(e) =>
                  setDeal({ ...deal, vacancies: e.target.value })
                }
              >
                <Content>{deal.vacancies || " - "}</Content>
              </EditableContent>
            </>
          )}
          <Subtitle>Deal Owner</Subtitle>
          <EditableContent
            value={findOwnerIndex()}
            type={"members"}
            editing={editSection === "details"}
            onChange={(e) =>
              setDeal({
                ...deal,
                owner: filteredMembers[e.target.value].team_member_id,
                owner_id: filteredMembers[e.target.value].team_member_id,
              })
            }
            teamMembers={filteredMembers}
          >
            <Content>
              {(() => {
                let index = findOwnerIndex();
                if (index !== undefined) {
                  return filteredMembers[index]?.name;
                } else {
                  return "-";
                }
              })()}
            </Content>
          </EditableContent>
          <Subtitle>Close Date</Subtitle>
          <EditableContent
            value={new Date(deal.close_date)}
            type={"date"}
            editing={editSection === "details"}
            onChange={(value) =>
              setDeal({
                ...deal,
                close_date: value,
              })
            }
          >
            <Content>
              {spacetime(new Date(deal.close_date)).format(
                "{date} {month}, {year}"
              )}
            </Content>
          </EditableContent>
          <Subtitle>Created Date</Subtitle>
          <EditableContent
            value={deal.create_date}
            type={"date"}
            editing={editSection === "details"}
            onChange={(value) =>
              setDeal({
                ...deal,
                create_date: value,
              })
            }
          >
            <Content>
              {spacetime(new Date(deal.create_date)).format(
                "{date} {month}, {year}"
              )}
            </Content>
          </EditableContent>
        </DetailContainer>
      </SectionContainer>
      <SectionContainer>
        <SectionTitleContainer>
          <TabTitle>Pipeline Details</TabTitle>
        </SectionTitleContainer>
        <Subtitle>Pipeline</Subtitle>
        <Content>{deal.pipeline?.name || "-"}</Content>
        <Subtitle>Stage</Subtitle>
        <Content>{dealStage?.name || "-"}</Content>
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
                onClickSave={() => saveNewDealCompany(selectedCompany?.value)}
              />
            </PermissionChecker>
          </SectionTitleContainer>
          {company?.company && editSection !== "company" && (
            <InfoCard
              light
              header={company.company.name}
              subText={company.company.industry}
              phone={company.company.main_phone}
              avatar={company.company.avatar}
              setRedirectToProfile={() =>
                setRedirect(
                  ROUTES.ClientProfile.url(
                    store.company.mention_tag,
                    company.company.client_id
                  )
                )
              }
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
                    setRedirectToProfile={() =>
                      setRedirect(
                        ROUTES.ContactProfile.url(
                          store.company.mention_tag,
                          contact.id
                        )
                      )
                    }
                  />
                );
              } else {
                return null;
              }
            })}
          {contacts?.length > 0 && (
            <AllLink
              to={ROUTES.DealProfile.url(
                store.company.mention_tag,
                selectedDealId,
                "contacts"
              )}
            >
              View All
            </AllLink>
          )}
        </CardContainer>
        {store.teamMembers &&
          (store.role?.role_permissions.owner ||
            (store.role?.role_permissions.admin &&
              store.role?.role_permissions.business) ||
            store.role?.role_permissions.manager) && (
            <>
              <SectionTitleContainer>
                <TabTitle>Team</TabTitle>
              </SectionTitleContainer>
              <TeamSelectWrapper>
                <TeamSelector
                  addedMemberIds={deal.team_member_ids || []}
                  availableMembers={store.teamMembers.filter(
                    (member) =>
                      member.roles.includes("business") &&
                      member.permission !== "owner" &&
                      deal.owner.id !== member.team_member_id &&
                      (!store.role.role_permissions.manager ||
                        store.role.team_member.assigned_members.indexOf(
                          member.team_member_id
                        ) !== -1 ||
                        store.role.team_member.team_member_id ===
                          member.team_member_id)
                  )}
                  addMember={addMember}
                  removeMember={removeMember}
                />
              </TeamSelectWrapper>
            </>
          )}
      </SectionContainer>
    </>
  );
};

const TeamSelectWrapper = styled.div`
  max-height: 400px;
  overflow: auto;
  border: 1px solid #eee;
  border-radius: 4px;
`;

export default DealOverviewTab;
