import React from "react";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { ROUTES } from "routes";
import { Link } from "react-router-dom";

const VendorTNTable = ({
  network,
  hasMorePages,
  loadMoreProfessionals,
  companyMentionTag,
}) => {
  return (
    <div className={styles.container} style={{ margin: 0 }}>
      <div className="table-responsive">
        <table className="table table-borderless">
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
              <th scope="col" className={sharedStyles.tableHeader} />
            </tr>
          </thead>
          <tbody>
            {network &&
              network.map((professional, index) => {
                return (
                  <tr key={`professional_${index}`} className="table-row-hover">
                    <th scope="row" className={sharedStyles.tableItemFirst}>
                      <Link
                        className={styles.name}
                        to={ROUTES.CandidateProfile.url(
                          companyMentionTag,
                          professional.professional_id
                        )}
                      >
                        {professional.tn_name ||
                          professional.professional_name ||
                          professional.email}
                      </Link>
                    </th>
                    <td
                      className={sharedStyles.tableItem}
                      style={{ overflow: "hidden" }}
                    >
                      {professional.localizations &&
                      professional.localizations.length > 0 ? (
                        professional.localizations.length !== 1 ? (
                          <span>
                            {professional.localizations[0].location.name} + 1
                          </span>
                        ) : (
                          <span>
                            {professional.localizations[0].location.name}
                          </span>
                        )
                      ) : (
                        ""
                      )}
                    </td>
                    <td className={sharedStyles.tableItem}>
                      {professional.last_action &&
                        (function toDate() {
                          let date = new Date(professional.last_action);
                          return date.toLocaleString("en-GB").split(",")[0];
                        })()}
                    </td>
                    <td className={sharedStyles.tableItemStatus} />
                  </tr>
                );
              })}
          </tbody>
        </table>
        {hasMorePages && (
          <div className={sharedStyles.loadMoreContainer}>
            <button
              className={sharedStyles.loadMore}
              onClick={() => loadMoreProfessionals()}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorTNTable;
