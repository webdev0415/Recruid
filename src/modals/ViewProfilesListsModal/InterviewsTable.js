import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchNetwork } from "helpersV2/candidates";
import notify from "notifications";
import { STContainer, STTable } from "modals/ViewProfilesListsModal/components";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { ROUTES } from "routes";
import Spinner from "sharedComponents/Spinner";
import spacetime from "spacetime";

const InterviewsTable = ({ store, interviews, loaded, setLoaded }) => {
  const [idsExchanger, setIdsExchanger] = useState({});

  //FETCH COMPANY CANDIDATES
  useEffect(() => {
    if (store.company && store.role && interviews) {
      fetchNetwork(store.session, store.company.id, {
        slice: [0, interviews.length],
        operator: "and",
        id: interviews.map((inter) => inter.tn_profile_id),
        team_member_id: store.role.team_member.team_member_id,
      }).then((talentNetwork) => {
        if (!talentNetwork.err) {
          let idsObj = {};
          talentNetwork.results.map((candidate) => {
            idsObj[candidate.ptn_id] = { ...candidate };
            return null;
          });
          setLoaded(true);
          setIdsExchanger(idsObj);
        } else {
          notify("danger", talentNetwork);
        }
      });
    }
  }, [store.company, store.role, store.session, interviews]);

  return (
    <>
      {!loaded ? (
        <Spinner />
      ) : (
        <STContainer id="modal-container-scroll">
          <div className="table-responsive">
            <STTable className="table  ">
              <thead>
                <tr>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Applicant Name
                  </th>
                  <th scope="col" className={sharedStyles.tableHeader}>
                    Interview Title
                  </th>
                  <th scope="col" className={sharedStyles.tableDate}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {interviews &&
                  interviews.map((inter, index) => {
                    return (
                      <tr
                        key={`candidate_${index}`}
                        className="table-row-hover"
                      >
                        <th scope="row" className={sharedStyles.tableItemFirst}>
                          {idsExchanger[inter.tn_profile_id] ? (
                            <Link
                              className={styles.name}
                              to={ROUTES.CandidateProfile.url(
                                store.company.mention_tag,
                                idsExchanger[inter.tn_profile_id]
                                  ?.professional_id,
                                "interviews"
                              )}
                            >
                              {idsExchanger[inter.tn_profile_id]?.name ||
                                idsExchanger[inter.tn_profile_id]?.email}
                            </Link>
                          ) : (
                            <></>
                          )}
                        </th>
                        <td
                          className={sharedStyles.tableItem}
                          style={{ overflow: "hidden" }}
                        >
                          {inter.name}
                        </td>
                        <td className={sharedStyles.tableItem}>
                          {`${spacetime(inter.start).format(
                            "{hour-24-pad}:{minute-pad}"
                          )}-${spacetime(inter.end).format(
                            "{hour-24-pad}:{minute-pad}"
                          )}, ${spacetime(inter.start).format(
                            "{date} {month}, {year}"
                          )}`}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </STTable>
          </div>
        </STContainer>
      )}
    </>
  );
};

export default InterviewsTable;
