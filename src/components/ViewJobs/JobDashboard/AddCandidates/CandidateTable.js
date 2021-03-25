import React from "react";

import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";

import ScrollInfinite from "sharedComponents/ScrollInfinite";
import Marquee from "sharedComponents/Marquee";
import AvatarIcon from "sharedComponents/AvatarIcon";
import Checkbox from "sharedComponents/Checkbox";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";

export default class TalentNetworkTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectAll: props.parentSelectedAll || false,
      statusColors: {
        invited: "#9A9CA1",
        passive: "#00cba7",
        "not active": "#A8ABB1",
        available: "#ff3159",
      },
      activeProfessionalId: null,
    };
  }

  render() {
    return (
      <ScrollInfinite
        styles={{
          height: "100%",
          minHeight: "400px",
          maxHeight: "400px",
          overflowY: "auto",
          borderBottom: "1px solid #eee",
        }}
        loadMore={this.props.loadMore}
        morePages={this.props.morePages}
        tag={"div"}
        pageStart={2}
      >
        <div className="table-responsive">
          <table className="table table-borderless">
            <thead>
              <tr>
                <th scope="col" className={sharedStyles.tableItemCheckBox}>
                  <button
                    className={styles.professionalCheckbox}
                    style={{
                      background: this.state.selectAll ? "#60CCA7" : "none",
                      marginLeft: "8px",
                    }}
                    onClick={() => {
                      this.setState({
                        selectAll: this.state.selectAll ? false : true,
                      });
                      this.props.selectAll(
                        this.state.selectAll ? "remove" : "add"
                      );
                    }}
                  >
                    {this.state.selectAll && (
                      <span className={styles.professionalCheckboxActive} />
                    )}
                  </button>
                </th>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Candidate Name
                </th>
                <th scope="col" className={sharedStyles.tableHeader}></th>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Current Job Title
                </th>
                <th scope="col" className={sharedStyles.tableHeader}>
                  Current Company
                </th>
                <th scope="col" className={sharedStyles.tableDate}>
                  Date Added
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.talentNetwork &&
                this.props.talentNetwork.map((professional, index) => {
                  return (
                    <tr key={`professional_${index}`}>
                      <td className={sharedStyles.tableItem}>
                        <CandidateAvatarOptions>
                          {!professional.selected && (
                            <AvatarIcon
                              name={
                                professional.talent_name ||
                                professional.name ||
                                professional.email
                              }
                              imgUrl={professional.avatar_url}
                              size={30}
                            />
                          )}
                          <div
                            className={`${"checkBoxContainer"} ${
                              professional.selected ? "active" : ""
                            }`}
                          >
                            <Checkbox
                              active={professional.selected}
                              onClick={() =>
                                this.props.addRemoveSelectedProfessional(
                                  professional.selected ? false : true,
                                  index
                                )
                              }
                              size="large"
                            />
                          </div>
                        </CandidateAvatarOptions>
                      </td>
                      <th scope="row" className={sharedStyles.tableItemFirst}>
                        <span
                          className={styles.name + " leo-flex"}
                          style={{ alignItems: "center" }}
                        >
                          <Marquee
                            height="25"
                            width={{
                              s: 50,
                              m: 100,
                              l: 150,
                              xl: 200,
                            }}
                          >
                            {professional.name || professional.email}
                          </Marquee>
                        </span>
                      </th>
                      <th className={sharedStyles.tableItem}>
                        {professional.blacklisted && (
                          <span style={{ marginLeft: "5px" }}>
                            <img
                              src={`${AWS_CDN_URL}/icons/CancelSvg.svg`}
                              alt=""
                            />
                          </span>
                        )}
                      </th>
                      <td
                        className={sharedStyles.tableItem}
                        style={{ overflow: "hidden" }}
                      >
                        {professional.current_job === "null" ? (
                          ""
                        ) : (
                          <>
                            <Marquee
                              height="25"
                              width={{
                                s: 50,
                                m: 100,
                                l: 150,
                                xl: 200,
                              }}
                            >
                              {professional.current_job}
                            </Marquee>
                          </>
                        )}
                      </td>
                      <td className={sharedStyles.tableItem}>
                        <div>
                          <Marquee
                            height="25"
                            width={{
                              s: 50,
                              m: 100,
                              l: 150,
                              xl: 200,
                            }}
                          >
                            {professional.current_company}
                          </Marquee>
                        </div>
                      </td>
                      <td className={sharedStyles.tableItem}>
                        {professional.created_at}
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

const CandidateAvatarOptions = styled.div`
  margin-right: 5px;
  position: relative;
  width: 30px;
  height: 30px;

  &:hover {
    .checkBoxContainer {
      display: flex;
    }
  }

  .checkBoxContainer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    border-radius: 50%;
    background: #d4dfea;
    display: none;

    align-items: center;
    justify-content: center;

    &.active {
      display: flex;
    }
  }
`;
