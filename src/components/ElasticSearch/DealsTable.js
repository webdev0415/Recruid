import React, { useContext, useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import styled from "styled-components";
import notify from "notifications";
import spacetime from "spacetime";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import { ROUTES } from "routes";
import GlobalContext from "contexts/globalContext/GlobalContext";
import {
  ExtensionMenu,
  ExtensionMenuOption,
} from "sharedComponents/ExtensionMenu";
import AvatarIcon from "sharedComponents/AvatarIcon";
import ConfirmModalV2 from "modals/ConfirmModalV2";
import EmptyTab from "components/Profiles/components/EmptyTab";
import FilterV2 from "sharedComponents/filterV2";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import { getDealsList } from "helpers/crm/deals";
import NumberFormat from "react-number-format";
import { ATSContainer } from "styles/PageContainers";
import { EmptyDeals } from "assets/svg/EmptyImages";
const SLICE_LENGHT = 20;
const DealsTable = ({ elastic_ids }) => {
  const store = useContext(GlobalContext);
  const [activeModal, setActiveModal] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [selectedDealIx, setSelectedDealIx] = useState(undefined);
  const [deals, setDeals] = useState(undefined);
  const [filters, setFilters] = useState({});
  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
    }
  }, [redirect]);

  useEffect(() => {
    if (store.company && store.session) {
      getDealsList(
        store.session,
        store.company.id,
        {
          ...filters,
          slice: [0, SLICE_LENGHT],
          operator: "and",
          id: elastic_ids,
        },
        signal
      ).then((resDeals) => {
        if (!resDeals.err) {
          setDeals(resDeals);
          if (resDeals.length === SLICE_LENGHT) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
        } else if (!signal.aborted) {
          notify("danger", resDeals);
        }
      });
    }
    return () => controller.abort();
  }, [store.company, store.session, elastic_ids, filters]);

  const fetchMore = () => {
    getDealsList(store.session, store.company.id, {
      ...filters,
      slice: [deals.length, SLICE_LENGHT],
      operator: "and",
      id: elastic_ids,
    }).then((resDeals) => {
      if (!resDeals.err) {
        setDeals([...deals, ...resDeals]);
        if (resDeals.length === SLICE_LENGHT) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else {
        notify("danger", resDeals);
      }
    });
  };

  const deleteDealMethod = () => {};

  const changeFilters = (newFilters) => {
    if (
      Object.values(filters).length === 0 &&
      Object.values(newFilters).length === 0
    ) {
      return;
    }
    setFilters(newFilters);
  };

  return (
    <ATSContainer>
      <FilterV2
        source="deal"
        returnFilters={(newFilters) => changeFilters(newFilters)}
      />
      <EmptyTab
        data={deals}
        title={"The company has no deals."}
        copy={"Visit the CRM to create one!"}
        image={<EmptyDeals />}
        action={() =>
          setRedirect(ROUTES.ClientManager.url(store.company.mention_tag))
        }
        actionText={"Go to CRM"}
      >
        <InfiniteScroller
          fetchMore={fetchMore}
          hasMore={hasMore}
          dataLength={deals?.length || 0}
        >
          <div className={styles.container}>
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Name
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Value
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Owner
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Company
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Created
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Closing Date
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader} />
                  </tr>
                </thead>
                <tbody>
                  {deals &&
                    deals.map((deal, index) => (
                      <tr className="table-row-hover" key={`deal-row-${index}`}>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          <SLink
                            to={ROUTES.DealProfile.url(
                              store.company.mention_tag,
                              deal.id
                            )}
                          >
                            {deal.name}
                          </SLink>
                        </td>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          <NumberFormat
                            value={Math.floor(deal.value)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={store.company.currency?.currency_name}
                            renderText={(value) => <>{value}</>}
                          />
                        </td>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {deal.owner}
                        </td>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {deal.company && (
                            <div className="d-flex align-items-center">
                              <AvatarIcon
                                name={deal.company.name}
                                imgUrl={deal.company.avatar}
                                size={25}
                                style={{
                                  marginRight: "10px",
                                }}
                              />
                              <OverflowCell style={{ color: "#1e1e1e" }}>
                                {deal.company.name}
                              </OverflowCell>
                            </div>
                          )}
                        </td>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {spacetime(new Date(deal.create_date)).format(
                            "{date} {month}, {year}"
                          )}
                        </td>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {spacetime(new Date(deal.close_date)).format(
                            "{date} {month}, {year}"
                          )}
                        </td>
                        <td className={sharedStyles.tableItemStatus}>
                          <ExtensionMenu>
                            <ExtensionMenuOption
                              onClick={() => {
                                setRedirect(
                                  ROUTES.DealProfile.url(
                                    store.company.mention_tag,
                                    deal.id
                                  )
                                );
                              }}
                            >
                              View Deal
                            </ExtensionMenuOption>
                            {/*}<ExtensionMenuOption
                      onClick={() => {
                        setSelectedDealIx(index);
                        setActiveModal("delete-deal");
                      }}
                    >
                      Delete Deal
                    </ExtensionMenuOption>*/}
                          </ExtensionMenu>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </InfiniteScroller>
      </EmptyTab>
      {redirect && <Redirect to={redirect} />}
      {activeModal === "delete-deal" && selectedDealIx !== undefined && (
        <>
          <ConfirmModalV2
            id="confirm-delete-deal"
            show={true}
            hide={() => {
              setActiveModal(undefined);
              setSelectedDealIx(undefined);
            }}
            header="Delete this deal"
            text="Are you sure you want to delete this deal?"
            actionText="Delete"
            actionFunction={deleteDealMethod}
          />
        </>
      )}
    </ATSContainer>
  );
};

export default DealsTable;

const SLink = styled(Link)`
  color: inherit;

  &:hover {
    text-decoration: none;
  }
`;

const OverflowCell = styled.span`
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
