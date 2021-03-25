import React from "react";
import styled from "styled-components";
import EmptyTab from "components/Profiles/components/EmptyTab";
import DealInfoCard from "components/Profiles/components/deal/DealInfoCard";
import { ROUTES } from "routes";
import TabsMenu from "sharedComponents/TabsMenu/TabsMenu";
import { PermissionChecker } from "constants/permissionHelpers";
import { EmptyDeals } from "assets/svg/EmptyImages";
const DealsTab = ({
  deals,
  archivedDeals,
  setInnerModal,
  store,
  setRedirect,
  dealsTab,
  setDealsTab,
  removeDeal,
  permission,
}) => {
  return (
    <EmptyTab
      data={
        Array.isArray(deals) && Array.isArray(archivedDeals)
          ? [...deals, ...archivedDeals]
          : []
      }
      title={"This profile has no deals."}
      copy={"Time to create one!"}
      image={<EmptyDeals />}
      action={permission.edit ? () => setInnerModal("create_deal") : undefined}
      actionText={"Create Deal"}
    >
      <PermissionChecker type="edit" valid={{ business: true }}>
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <button
            className="button button--default button--blue-dark"
            onClick={() => setInnerModal("create_deal")}
          >
            Create Deal
          </button>
        </div>
      </PermissionChecker>
      {archivedDeals && archivedDeals.length > 0 && (
        <TabsWrapper>
          <TabsMenu
            tabsArr={[
              { name: "active", title: "Active" },
              { name: "archived", title: "Archived" },
            ]}
            activeTab={dealsTab}
            type="button"
            setActiveTab={setDealsTab}
          />
        </TabsWrapper>
      )}
      {dealsTab === "active" &&
        deals &&
        deals.length > 0 &&
        deals.map((deal, index) => {
          return (
            <DealInfoCard
              light
              key={`info-card-${index}`}
              deal={deal}
              company={store.company}
              remove={permission.edit ? removeDeal : undefined}
              removeId={deal.id}
              // editing={editSection === "deals"}
              // deleteCard={() => deleteDeal(index)}
              setRedirectToProfile={() => {
                setRedirect(
                  ROUTES.DealProfile.url(store.company.mention_tag, deal.id)
                );
              }}
            />
          );
        })}
      {dealsTab === "archived" &&
        archivedDeals &&
        archivedDeals.length > 0 &&
        archivedDeals.map((deal, index) => {
          return (
            <DealInfoCard
              key={`info-card-${index}`}
              deal={deal}
              company={store.company}
              remove={permission.edit ? removeDeal : undefined}
              removeId={deal.id}
              // editing={editSection === "deals"}
              // deleteCard={() => deleteDeal(index)}
              setRedirectToProfile={() => {
                setRedirect(
                  ROUTES.DealProfile.url(store.company.mention_tag, deal.id)
                );
              }}
            />
          );
        })}
    </EmptyTab>
  );
};

export default DealsTab;

const TabsWrapper = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid #e1e1e1;
  max-width: 300px;
`;
