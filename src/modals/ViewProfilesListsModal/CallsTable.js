import React, { useState, useEffect } from "react";
import notify from "notifications";
import {
  STContainer,
  STTable,
  OverflowCell,
} from "modals/ViewProfilesListsModal/components";

import InfiniteScroller from "sharedComponents/InfiniteScroller";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { ROUTES } from "routes";
import AvatarIcon from "sharedComponents/AvatarIcon";
import spacetime from "spacetime";
import { fetchListCalls } from "helpersV2/calls";
import Spinner from "sharedComponents/Spinner";

const SLICE_LENGTH = 20;

const CallsTable = ({
  store,
  elasticIds,
  calls,
  setCalls,
  hasMore,
  setHasMore,
  loaded,
  setLoaded,
}) => {
  const [showBodyIndex, setShowBodyIndex] = useState(undefined);
  useEffect(() => {
    if (store.session) {
      fetchListCalls(store.session, {
        slice: [0, SLICE_LENGTH],
        ids: elasticIds,
      }).then((resCalls) => {
        if (!resCalls.err) {
          setCalls(resCalls);
          setLoaded(true);
          if (resCalls.length === SLICE_LENGTH) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
        } else {
          notify("danger", resCalls);
        }
      });
    }
     
  }, [store.session, elasticIds]);

  const fetchMore = () => {
    fetchListCalls(store.session, {
      slice: [calls.length, SLICE_LENGTH],
      ids: elasticIds,
    }).then((resCalls) => {
      if (!resCalls.err) {
        setCalls([...calls, ...resCalls]);
        if (resCalls.length === SLICE_LENGTH) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else {
        notify("danger", resCalls);
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
          dataLength={calls?.length || 0}
          scrollableTarget={"modal-container-scroll"}
        >
          <STContainer id="modal-container-scroll">
            <div className="table-responsive">
              <STTable className="table  ">
                <thead>
                  <tr>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Created by
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Contacted
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Outcome
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Date
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Associated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {calls &&
                    calls.map((call, index) => (
                      <React.Fragment key={`call-row-${index}`}>
                        <tr className="table-row-hover">
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="d-flex align-items-center">
                              <AvatarIcon
                                name={call.created_by_name}
                                imgUrl={call.created_by_avatar}
                                size={25}
                                style={{
                                  marginRight: "10px",
                                }}
                              />
                              <button
                                onClick={() => {
                                  if (call.description?.length > 0) {
                                    setShowBodyIndex(
                                      showBodyIndex === index
                                        ? undefined
                                        : index
                                    );
                                  }
                                }}
                              >
                                {call.created_by_name}
                              </button>
                            </div>
                          </td>
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            {call.contacted.name}
                          </td>
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            {call.outcome}
                          </td>
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            {spacetime(new Date(call.date_actioned)).format(
                              "{date} {month}, {year}"
                            )}
                          </td>
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            {call.source && (
                              <div className="d-flex align-items-center">
                                <AvatarIcon
                                  name={call.source.name}
                                  imgUrl={call.source.avatar}
                                  size={25}
                                  style={{
                                    marginRight: "10px",
                                  }}
                                />
                                <OverflowCell
                                  to={
                                    call.source.type === "candidate"
                                      ? ROUTES.CandidateProfile.url(
                                          store.company.mention_tag,
                                          call.source.professional_id
                                        )
                                      : call.source.type === "client"
                                      ? ROUTES.ClientProfile.url(
                                          store.company.mention_tag,
                                          call.source.id
                                        )
                                      : call.source.type === "contact"
                                      ? ROUTES.ContactProfile.url(
                                          store.company.mention_tag,
                                          call.source.id
                                        )
                                      : call.source.type === "deal"
                                      ? ROUTES.DealProfile.url(
                                          store.company.mention_tag,
                                          call.source.id
                                        )
                                      : ROUTES.ClientManager.url(
                                          store.company.mention_tag
                                        )
                                  }
                                  style={{ color: "#1e1e1e" }}
                                >
                                  {call.source.name}
                                </OverflowCell>
                              </div>
                            )}
                          </td>
                        </tr>
                        {showBodyIndex === index && (
                          <tr>
                            <td
                              colSpan="12"
                              className={sharedStyles.tableItem}
                              style={{ overflow: "hidden" }}
                            >
                              {call.description}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
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

export default CallsTable;
