import React, { useEffect } from "react";
import { getDealsList } from "helpers/crm/deals";
import notify from "notifications";
import {
  STContainer,
  STTable,
  SLink,
  OverflowCell,
} from "modals/ViewProfilesListsModal/components";
import InfiniteScroller from "sharedComponents/InfiniteScroller";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { ROUTES } from "routes";
import AvatarIcon from "sharedComponents/AvatarIcon";
import NumberFormat from "react-number-format";
import spacetime from "spacetime";
import Spinner from "sharedComponents/Spinner";

const SLICE_LENGTH = 20;

const DealsTable = ({
  store,
  elasticIds,
  deals,
  setDeals,
  hasMore,
  setHasMore,
  loaded,
  setLoaded,
}) => {
  useEffect(() => {
    if (store.company && store.session) {
      getDealsList(store.session, store.company.id, {
        slice: [0, SLICE_LENGTH],
        operator: "and",
        id: elasticIds,
      }).then((resDeals) => {
        if (!resDeals.err) {
          setDeals(resDeals);
          setLoaded(true);
          if (resDeals.length === SLICE_LENGTH) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
        } else {
          notify("danger", resDeals);
        }
      });
    }
  }, [store.company, store.session, elasticIds]);

  const fetchMore = () => {
    getDealsList(store.session, store.company.id, {
      slice: [deals.length, SLICE_LENGTH],
      operator: "and",
      id: elasticIds,
    }).then((resDeals) => {
      if (!resDeals.err) {
        setDeals([...deals, ...resDeals]);
        if (resDeals.length === SLICE_LENGTH) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else {
        notify("danger", resDeals);
      }
    });
  };

  return (
    <>
      {!loaded ? (
        <Spinner />
      ) : (
        <InfiniteScroller
          fetchMore={fetchMore}
          hasMore={hasMore}
          dataLength={deals?.length || 0}
          scrollableTarget={"modal-container-scroll"}
        >
          <STContainer id="modal-container-scroll">
            <div className="table-responsive">
              <STTable className="table  ">
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
                          {deal.owner_name}
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
                      </tr>
                    ))}
                </tbody>
              </STTable>
            </div>
          </STContainer>
        </InfiniteScroller>
      )}
    </>
  );
};

export default DealsTable;
