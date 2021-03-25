import React from "react";
// import Select from "react-select";

// import TalentNetworkTable from "components/TalentNetwork/components/TalentNetworkTable/TalentNetworkTable";
import ProfessionalTable from "./ProfessionalTable";

// import filterHelpers from "helpers/sharedHelpers";
// import sharedStyles from "assets/stylesheets/scss/collated/filter.module.scss";
import modalStyles from "assets/stylesheets/scss/collated/modals.module.scss";
// import styles from "oldContainers/ATS/ManageApplicants/components/JobManager/components/modals/AddCandidates/style/addCandidates.module.scss";
import "assets/stylesheets/scss/collated/filter.scss";

import { API_ROOT_PATH } from "constants/api";
import Spinner from "sharedComponents/Spinner";

export default class AddCandidates extends React.Component {
  constructor() {
    super();
    this.state = {
      skills: [],
      selectedSkills: [],
      locations: [],
      selectedLocations: [],
      industries: [],
      selectedIndustries: [],
      addSelected: false,
      storage: {
        skills: [],
        industries: [],
        locations: [],
      },
      totalTags: [],
      platformProfessionals: undefined,
      selectedProfessionals: [],
      page: 2,
      morePages: true,
      requested: false,
    };
  }

  componentDidMount() {
    this.proList("1").then((professionals) => {
      if (professionals !== "err") {
        this.setState({ platformProfessionals: professionals.search_results });
      }
    });
  }

  async proList(page) {
    const url =
      API_ROOT_PATH + `/v1/search?page=${page}&req_type=professional&q=`;

    const data = fetch(url, {
      method: "GET",
    }).then((response) => {
      if (response.ok) return response.json();
      else return "err";
    });

    return data;
  }

  loadMore(page) {
    if (!this.state.requested) {
      this.proList(page).then((json) => {
        this.setState({ requested: true });
        if (json.search_results.length > 0) {
          let page = this.state.page;
          let professionals = this.state.platformProfessionals;
          professionals = professionals.concat(json.search_results);
          this.setState({
            platformProfessionals: professionals,
            page: (page += 1),
            requested: false,
          });
          if (json.search_results.length < 20) {
            this.setState({ morePages: false });
          }
        }
      });
    }
  }

  updateProfessionalProperty(index, prop, value) {
    let professionals = this.state.platformProfessionals;
    let professional = { ...professionals[index], [prop]: value };
    professional[prop] = value;
    professionals[index] = professional;
    Promise.resolve(professionals).then((altered) => {
      this.setState({ platformProfessionals: [...altered] });
    });
    if (prop === "selected") {
      this.addRemoveSelectedProfessional(value ? "add" : "remove", index);
    }
  }

  addRemoveSelectedProfessional(action, index) {
    let selected = this.state.selectedProfessionals;
    if (action === "add") {
      selected.push(this.state.platformProfessionals[index].id);
    } else {
      const selectedIx = selected.findIndex(
        (selected) => selected === this.state.platformProfessionals[index].id
      );
      selected.splice(selectedIx, 1);
    }
    this.setState({
      selectedProfessionals: selected,
    });
  }

  inviteProfessionals() {
    if (this.state.selectedProfessionals.length > 0) {
      const url =
        API_ROOT_PATH +
        `/v1/talent_network/${this.props.companyId}/add_platform_professionals`;
      fetch(url, {
        method: "POST",
        headers: this.props.session,
        body: JSON.stringify({
          platform_professionals: this.state.selectedProfessionals,
        }),
      }).then((response) => {
        if (response.ok) {
          return response.json().then((json) => {
            if (json.added_professionals.length > 0) {
              json.added_professionals.forEach((pro) => {
                this.props.concatInvitedProfessionals([pro]);
              });
              this.props.closeModal();
            }
          });
        } else {
          alert("Something went wrong! Please contact us on Intercom");
        }
      });
    } else {
      alert("Please select a professional");
    }
  }

  render() {
    return (
      <>
        {/* <div
          className={sharedStyles.container}
          style={{ borderBottom: "1px solid #eee", borderRadius: "0" }}
        >
          <div
                style={{
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                BLABLABLA
              </div>
          {this.state.totalTags.length > 0 && (
            <div className={sharedStyles.filterContainer}>
              {this.state.totalTags.map((tag, ix) => {
                return (
                  <div key={`tag_${ix}`} className={sharedStyles.filterTag}>
                    {tag.label}
                    <span onClick={() => { }}>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.876 6.847a.73.73 0 0 1 0 1.028.73.73 0 0 1-1.029 0L5.82 6.847l-1.03 1.028a.73.73 0 0 1-1.028 0 .73.73 0 0 1 0-1.028L4.79 5.818 3.76 4.79a.73.73 0 0 1 0-1.03.73.73 0 0 1 1.029 0l1.029 1.03 1.028-1.03a.73.73 0 0 1 1.029 0 .73.73 0 0 1 0 1.03L6.847 5.818l1.029 1.029zM5.819 0A5.82 5.82 0 0 0 0 5.818a5.82 5.82 0 0 0 11.637 0A5.818 5.818 0 0 0 5.82 0z"
                          fill="#FFF"
                          fill-role="nonzero"
                        />
                      </svg>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div> */}
        {this.state.platformProfessionals ? (
          <>
            <ProfessionalTable
              platformProfessionals={this.state.platformProfessionals}
              updateProfessionalProperty={this.updateProfessionalProperty.bind(
                this
              )}
              selectAll={this.props.selectAll}
              style={{
                height: "300px",
                minHeight: "0px",
              }}
              morePages={this.state.morePages}
              loadMore={this.loadMore.bind(this)}
            />
            <div className={modalStyles.modalFooter}>
              <button
                className="button button--default button--grey-light"
                onClick={() =>
                  setTimeout(() => {
                    this.props.closeModal();
                  }, 300)
                }
              >
                Cancel
              </button>
              <button
                className="button button--default button--blue-dark"
                onClick={() => this.inviteProfessionals()}
              >
                {this.state.selectedProfessionals.length > 0
                  ? `Invite (${this.state.selectedProfessionals.length})`
                  : "Invite"}
              </button>
            </div>
          </>
        ) : (
          <Spinner />
        )}
      </>
    );
  }
}
