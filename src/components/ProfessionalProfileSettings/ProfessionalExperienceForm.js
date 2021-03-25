import React, { Component } from "react";
import PropTypes from "prop-types";

import { API_ROOT_PATH } from "constants/api";
import { objectToUrlParams } from "helpers/helper";
import Spinner from "sharedComponents/Spinner";

// import Select from "react-select";

let timeOut = null;

class ProfessionalExperienceForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      isCurrentJob: false,
      company: this.props.experience.contractor
        ? this.props.experience.contractor.name
        : "",
      hasMoreCompanies: true,
      searchMode: false,
      displayDropDown: false,
      companies: [],
      searchCompanies: [],
      searchComplete: false,
      title: this.props.experience.title ? this.props.experience.title : "",
      description: this.props.experience.description
        ? this.props.experience.description
        : "",
      startYear: this.props.experience.startYear
        ? this.props.experience.startYear
        : "",
      startMonth: this.props.experience.startMonth
        ? this.props.experience.startMonth
        : 0,
      endYear: this.props.experience.endYear
        ? this.props.experience.endYear
        : "",
      endMonth: this.props.experience.endMonth
        ? this.props.experience.endMonth
        : 0,
      currentExperience: {},
    };

    this.handleExperienceInputChange = this.handleExperienceInputChange.bind(
      this
    );
    this.handleContractorInputChange = this.handleContractorInputChange.bind(
      this
    );
    this.handleCompanyChange = this.handleCompanyChange.bind(this);
    this.handleExperienceDestruction = this.handleExperienceDestruction.bind(
      this
    );
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleCompanyInput = this.handleCompanyInput.bind(this);
    this.companySearch = this.companySearch.bind(this);
    this.renderCompanies = this.renderCompanies.bind(this);
    this.loadMoreCompanies = this.loadMoreCompanies.bind(this);
    this.companySelection = this.companySelection.bind(this);
    this.companyScroll = this.companyScroll.bind(this);
    this.paginatedSearch = this.paginatedSearch.bind(this);
    this.searchTimer = this.searchTimer.bind(this);
  }

  componentDidMount() {
    this.paginatedSearch(this.state.page);
    this.setState({ page: this.state.page + 1 });
    let experience = this.props.experience;
    if (
      this.props.experience.endMonth === null &&
      this.props.experience.endYear === null
    ) {
      experience.currentJob = true;
      this.setState({ isCurrentJob: true, currentExperience: experience });
    } else {
      this.setState({ currentExperience: experience });
    }
    if (
      experience &&
      (Object.keys(experience).length === 0 ||
        (experience.contractor &&
          Object.keys(experience.contractor).length === 0))
    ) {
      this.setState({ isCurrentJob: false });
    }
  }

  paginatedSearch(page) {
    if (!this.state.searchMode) {
      const queryStrings = {
        page: page,
      };
      const url =
        API_ROOT_PATH + "/v1/companies" + objectToUrlParams(queryStrings);
      fetch(url, {
        method: "GET",
        headers: this.props.session,
      }).then((response) => {
        if (response.ok) {
          response.json().then((resp) => {
            if (resp.length === 0) {
              this.setState({ hasMoreCompanies: false });
            } else {
              if (page === 1) {
                this.setState({
                  companies: resp,
                  searchCompanies:
                    this.state.searchCompanies.length > 0
                      ? this.state.searchCompanies.concat(resp)
                      : resp,
                });
              } else {
                this.setState({
                  searchCompanies:
                    this.state.searchCompanies.length > 0
                      ? this.state.searchCompanies.concat(resp)
                      : resp,
                });
              }
            }
          });
        }
      });
    }
  }

  companySearch(search) {
    const queryStrings = {
      search: search,
    };
    const url =
      API_ROOT_PATH + "/v1/companies" + objectToUrlParams(queryStrings);
    fetch(url, {
      method: "GET",
      headers: this.props.session,
    }).then((response) => {
      if (response.ok) {
        response.json().then((resp) => {
          if (this.state.company !== "") {
            if (resp.length === 0) {
              this.setState({ searchCompanies: [{ name: search }] });
              this.handleContractorInputChange({ name: search });
            } else {
              this.setState({
                searchCompanies: resp,
                searchComplete: true,
                displayDropDown: true,
              });
            }
          }
        });
      }
    });
  }

  loadMoreCompanies(page) {
    this.paginatedSearch(page);
  }

  renderCompanies() {
    let elements = [];
    // if(this.state.searchCompanies.length === 1){
    // }
    this.state.searchCompanies.length > 0 &&
      this.state.searchCompanies.map((company, ix) => {
        let key = "company_" + ix + company.id;
        elements.push(
          <span
            key={key}
            onClick={() => {
              this.companySelection(company);
            }}
          >
            {company.mention_tag ? company.name : `${company.name}`}
          </span>
        );
        return elements;
      });
    return elements;
  }

  handleExperienceInputChange(e) {
    e.preventDefault();
    let experience = this.state.currentExperience;
    const prop = e.target.name;
    const updatedValue = e.target.value;
    if (prop === "startYear" || prop === "endYear") {
      experience[prop] = Number(updatedValue);
      if (prop === "startYear") {
        this.setState({ startYear: updatedValue });
      } else {
        this.setState({ endYear: updatedValue });
      }
    } else {
      if (prop === "title") {
        this.setState({ title: updatedValue });
      } else if (prop === "description") {
        this.setState({ description: updatedValue });
      }
      experience[prop] = updatedValue;
    }
    this.props.handleExperienceInputChange(experience);
  }

  handleCheckboxChange(e) {
    let isCurrentJob = e.target.checked;
    let experience = this.state.currentExperience;
    this.setState({ isCurrentJob });
    if (isCurrentJob) {
      document.getElementById("endYearInput" + this.props.index).style.display =
        "none";
      document.getElementById(
        "endMonthInput" + this.props.index
      ).style.display = "none";
      this.setState({ endMonth: 0, endYear: "" });
      experience.endMonth = null;
      experience.endYear = null;
      experience.currentJob = true;
      this.props.checkBoxChange(experience, this.props.index);
      // this.props.handleExperienceInputChange(experience);
    } else {
      experience.currentJob = false;
      this.props.checkBoxChange(experience, this.props.index);
      // this.props.handleExperienceInputChange(experience);
      document.getElementById("endYearInput" + this.props.index).style.display =
        "block";
      document.getElementById(
        "endMonthInput" + this.props.index
      ).style.display = "block";
    }
  }

  handleSelectChange(e) {
    let experience = this.props.experience;
    const prop = e.target.name;
    const updatedValue = Number(e.target.value);
    if (prop === "startMonth") this.setState({ startMonth: e.target.value });
    else if (prop === "endMonth") this.setState({ endMonth: e.target.value });
    experience[prop] = updatedValue;
    this.props.handleExperienceInputChange(experience);
  }

  companySelection(company) {
    this.setState({ company: company.name, displayDropDown: false });
    this.handleContractorInputChange(company);
  }

  handleContractorInputChange(contractor) {
    let experience = this.state.currentExperience;
    if (typeof contractor === "object") {
      if (!contractor.mention_tag) {
        experience.contractorType = "OuterEmployer";
        experience.contractor_attributes = contractor;
      } else {
        experience.contractorId = contractor.id;
        experience.contractor = contractor;
        experience.contractorType = "Company";
      }
    } else if (typeof contractor === "string") {
      experience.contractorType = "OuterEmployer";
      experience.contractorAttributes = { name: contractor };
    }
    this.props.handleExperienceInputChange(experience);
  }

  handleCompanyChange(selectedOption) {
    if (selectedOption === null) {
      return;
    }
    let companies = this.props.companies;
    let company = undefined;
    for (let index in companies) {
      if (companies[index].name === selectedOption.value) {
        company = companies[index];
      }
    }
    this.handleContractorInputChange(company || selectedOption.value);
  }

  handleExperienceDestruction(e) {
    e.preventDefault();
    let experience = this.props.experience;
    experience["_destroy"] = true;
    // let experiences = this.props.experiences;
    // experiences.splice(this.props.index, 1);
    if (this.props.experiences.length > 0) {
      Promise.resolve(
        this.props.handleExperienceInputChange(
          experience,
          this.props.handleProfileUpdate.bind(this),
          "remove",
          this.props.index
        )
      ).then(() => {
        let experiences = this.props.experiences;
        experiences.splice(this.props.index, 1);
        Promise.resolve(this.props.setParentState({ experiences: [] })).then(
          () => {
            this.props.setParentState({ experiences: experiences });
          }
        );
      });
    }
  }

  extractOptions(list) {
    let values = [];
    for (let index in list) {
      values.push({
        label: list[index].name,
        value: list[index].name,
        className: "",
      });
    }
    return values;
  }

  handleCompanyInput(e) {
    if (e.target.value.length > 0) {
      this.setState({
        displayDropDown: this.state.searchComplete ? true : false,
        hasMoreCompanies: true,
        searchMode: true,
        page: 2,
      });
    } else {
      this.setState({
        searchCompanies: this.state.companies,
        searchMode: false,
        searchComplete: false,
        displayDropDown: false,
      });
    }
    this.setState({ company: e.target.value });
  }

  companyScroll(e) {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight;
    if (bottom && this.state.hasMoreCompanies) {
      this.paginatedSearch(this.state.page);
      this.setState({ page: this.state.page + 1 });
    }
  }

  searchTimer() {
    let searchTerm = this.state.company;
    const compSearch = this.companySearch;
    clearTimeout(timeOut);
    // Make a new timeout set to go off in 500ms
    if (!!searchTerm && searchTerm.length > 2) {
      timeOut = setTimeout(function () {
        compSearch(searchTerm);
      }, 500);
    }
  }

  render() {
    // let experience = this.props.experience;
    // let companyName;
    let endDatesStyle = {
      display: this.state.isCurrentJob ? "none" : "block",
    };

    // if (experience.contractor) {
    //   companyName = {
    //     label: experience.contractor.name,
    //     value: experience.contractor.name,
    //     className: ""
    //   };
    // } else if (experience.contractorAttributes) {
    //   companyName = {
    //     label: experience.contractorAttributes.name,
    //     value: experience.contractorAttributes.name,
    //     className: ""
    //   };
    // }

    return (
      <div className="">
        <div className="experience__item">
          <div className="row">
            <div className="col-md-6">
              <label className="form-label form-heading">Company</label>
              <input
                className="form-control"
                type="text"
                name="company"
                placeholder="Search Company"
                // onFocus={e => {if(this.state.searchComplete) this.setState({ displayDropDown: true })}}
                onBlur={() =>
                  setTimeout(() => {
                    this.setState({ displayDropDown: false });
                  }, 100)
                }
                onChange={this.handleCompanyInput}
                onKeyUp={this.searchTimer}
                value={this.state.company || ""}
                autoComplete="off"
                required
              />
              {this.state.displayDropDown && (
                <div
                  onScroll={this.companyScroll}
                  id="infinite"
                  className="form-control experience__item-search"
                >
                  {this.renderCompanies()}
                  {this.state.hasMoreCompanies && !this.state.searchMode && (
                    <Spinner />
                  )}
                </div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label form-heading">Title</label>
              <input
                className="form-control"
                type="text"
                name="title"
                placeholder="Title"
                onChange={this.handleExperienceInputChange}
                value={this.state.title}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <label className="form-input experience__item--checkbox">
                <input
                  className="form-checkbox"
                  id="endYearCheckbox"
                  name="endYear"
                  type="checkbox"
                  checked={this.state.isCurrentJob}
                  onChange={this.handleCheckboxChange}
                />
                I currently work here
              </label>
            </div>
          </div>
          <div className="row">
            <label className="form-label col-md-12 form-heading">
              When did you start/finish this role?
            </label>
            <div className="col-md-3">
              <select
                name="startMonth"
                className="form-control"
                value={this.state.startMonth}
                onChange={this.handleSelectChange}
                required
              >
                <option value="0" disabled>
                  Start month
                </option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                type="number"
                name="startYear"
                placeholder="Start year"
                onChange={this.handleExperienceInputChange}
                value={this.state.startYear}
                required
              />
            </div>
            <div className="col-md-3">
              <select
                id={"endMonthInput" + this.props.index}
                className="form-control"
                name="endMonth"
                value={this.props.experience.endMonth || ""}
                style={endDatesStyle}
                onChange={this.handleSelectChange}
              >
                <option value="0" disabled>
                  End month
                </option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                id={"endYearInput" + this.props.index}
                className="form-control"
                style={endDatesStyle}
                type="number"
                name="endYear"
                placeholder="End year"
                onChange={this.handleExperienceInputChange}
                value={this.state.endYear}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <label className="form-label form-heading">Description</label>
              <textarea
                className="form-control"
                rows="3"
                name="description"
                placeholder="Description"
                onChange={this.handleExperienceInputChange}
                value={this.state.description}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <button
                className="experience__delete"
                onClick={this.handleExperienceDestruction}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

ProfessionalExperienceForm.propTypes = {
  experience: PropTypes.object.isRequired,
  handleExperienceInputChange: PropTypes.func.isRequired,
  appendExperience: PropTypes.func.isRequired,
};

export default ProfessionalExperienceForm;
