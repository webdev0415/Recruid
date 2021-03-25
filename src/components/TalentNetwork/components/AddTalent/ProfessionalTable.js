import React from "react";

import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import ScrollInfinite from "sharedComponents/ScrollInfinite";

export default class TalentNetworkTable extends React.Component {
  constructor() {
    super();
    this.state = {
      selectAll: false,
      statusColors: {
        invited: "#9A9CA1",
        passive: "#00cba7",
        "not active": "#A8ABB1",
        available: "#ff3159",
      },
      activeProfessionalId: null,
    };
  }

  formatCurrentJob(experiences) {
    let exp = experiences.filter(
      (experience) =>
        experience.end_month === null && experience.end_year === null
    );
    if (exp.length > 0) {
      return exp[0].title;
    } else {
      return null;
    }
  }

  formatCurrentCompany(experiences) {
    let exp = experiences.filter(
      (experience) =>
        experience.end_month === null && experience.end_year === null
    );
    if (exp.length > 0) {
      return exp[0].contractor.name;
    } else {
      return null;
    }
  }

  render() {
    return (
      // <div
      // 	className={styles.container}
      // 	style={{ height: '400px', overflowY: 'scroll', marginBottom: "10px", marginTop: "0", boxShadow: "none" }}
      // >

      // </div>
      <ScrollInfinite
        styles={{
          height: "500px",
          marginBottom: "10px",
          marginTop: "0",
          boxShadow: "none",
          borderBottom: "1px solid #eee",
        }}
        loadMore={this.props.loadMore.bind(this)}
        morePages={this.props.morePages}
        tag={"div"}
        pageStart={2}
      >
        <div className="table-responsive">
          <table className="table table-borderless">
            <thead>
              <tr>
                <th scope="col" className={sharedStyles.tableItemCheckBox} />
                <th scope="col" className={sharedStyles.tableHeader}>
                  Candidate Name
                </th>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Current Job Title
                </th>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Current Company
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.platformProfessionals.map((professional, index) => {
                return (
                  <tr key={`professional_${index}`}>
                    <td className={sharedStyles.tableItem}>
                      <button
                        className={styles.professionalCheckbox}
                        style={{
                          background: professional.selected
                            ? "#60CCA7"
                            : "none",
                        }}
                        onClick={() => {
                          this.props.updateProfessionalProperty(
                            index,
                            "selected",
                            professional.selected ? false : true
                          );
                        }}
                      >
                        {professional.selected && (
                          <span className={styles.professionalCheckboxActive} />
                        )}
                      </button>
                    </td>
                    <th scope="row" className={sharedStyles.tableItemFirst}>
                      <span className={styles.name}>{professional.name}</span>
                    </th>
                    <td
                      className={sharedStyles.tableItem}
                      style={{ overflow: "hidden" }}
                    >
                      {professional.experiences.length > 0 &&
                        this.formatCurrentJob(professional.experiences)}
                    </td>
                    <td className={sharedStyles.tableItem}>
                      <div>
                        {professional.experiences.length > 0 &&
                          this.formatCurrentCompany(professional.experiences)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ScrollInfinite>
    );
  }
}
