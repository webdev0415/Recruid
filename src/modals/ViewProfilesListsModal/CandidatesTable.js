import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchNetwork } from "helpersV2/candidates";
import notify from "notifications";
import { STContainer, STTable } from "modals/ViewProfilesListsModal/components";

import InfiniteScroller from "sharedComponents/InfiniteScroller";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { ROUTES } from "routes";
import Spinner from "sharedComponents/Spinner";

const SLICE_LENGTH = 20;

const CandidatesTable = ({
  store,
  elasticIds,
  network,
  setNetwork,
  hasMore,
  setHasMore,
  loaded,
  setLoaded,
}) => {
  //FETCH COMPANY CANDIDATES
  useEffect(() => {
    if (store.company && store.role) {
      fetchNetwork(store.session, store.company.id, {
        slice: [0, SLICE_LENGTH],
        operator: "and",
        id: elasticIds,
        team_member_id: store.role.team_member.team_member_id,
      }).then((talentNetwork) => {
        if (!talentNetwork.err) {
          setNetwork(talentNetwork.results);
          if (talentNetwork.results.length !== talentNetwork.total) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
          setLoaded(true);
        } else {
          notify("danger", talentNetwork);
        }
      });
    }
     
  }, [store.company, store.role, store.session, elasticIds]);

  //LOAD MORE CANDIDATES
  const fetchMore = () => {
    fetchNetwork(store.session, store.company.id, {
      slice: [network.length, SLICE_LENGTH],
      operator: "and",
      id: elasticIds,
      team_member_id: store.role.team_member.team_member_id,
    }).then((talentNetwork) => {
      if (!talentNetwork.err) {
        let arr = [...network, ...talentNetwork.results];
        setNetwork(arr);
        if (arr.length !== talentNetwork.total) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else {
        notify("danger", talentNetwork);
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
          dataLength={network?.length || 0}
          scrollableTarget={"modal-container-scroll"}
        >
          <STContainer id="modal-container-scroll">
            <div className="table-responsive">
              <STTable className="table  ">
                <thead>
                  <tr>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Applicant Name
                    </th>
                    <th scope="col" className={sharedStyles.tableHeader}>
                      Location
                    </th>
                    <th scope="col" className={sharedStyles.tableDate}>
                      Last action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {network &&
                    network.map((candidate, index) => {
                      return (
                        <tr
                          key={`candidate_${index}`}
                          className="table-row-hover"
                        >
                          <th
                            scope="row"
                            className={sharedStyles.tableItemFirst}
                          >
                            <Link
                              className={styles.name}
                              to={ROUTES.CandidateProfile.url(
                                store.company.mention_tag,
                                candidate.professional_id
                              )}
                            >
                              {candidate.name || candidate.email}
                            </Link>
                          </th>
                          <td
                            className={sharedStyles.tableItem}
                            style={{ overflow: "hidden" }}
                          >
                            {candidate.localizations &&
                            candidate.localizations.length > 0 ? (
                              candidate.localizations.length !== 1 ? (
                                <span>
                                  {candidate.localizations[0].location.name} + 1
                                </span>
                              ) : (
                                <span>
                                  {candidate.localizations[0].location.name}
                                </span>
                              )
                            ) : (
                              ""
                            )}
                          </td>
                          <td className={sharedStyles.tableItem}>
                            {candidate.last_action &&
                              (function toDate() {
                                let date = new Date(candidate.last_action);
                                return date
                                  .toLocaleString("en-GB")
                                  .split(",")[0];
                              })()}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </STTable>
            </div>
          </STContainer>
        </InfiniteScroller>
      )}
    </>
  );
};

export default CandidatesTable;
