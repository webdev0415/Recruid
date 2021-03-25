import React, { Component } from "react";
// import { objIsValid } from "../../../helpers/helper";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

class AgencyForm extends Component {
  constructor(props) {
    super(props);

    this.categoriesSuggestions = this.categoriesSuggestions.bind(this);
    this.locationsSuggestions = this.locationsSuggestions.bind(this);
    this.handleCompanyUpdate = this.handleCompanyUpdate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCategoryRemove = this.handleCategoryRemove.bind(this);
    this.handleCategoryAddition = this.handleCategoryAddition.bind(this);
    this.handleLocationRemove = this.handleLocationRemove.bind(this);
    this.handleLocationAddition = this.handleLocationAddition.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleLocationSelect = this.handleLocationSelect.bind(this);

    this.extractSkillsFromCompetencies = this.extractSkillsFromCompetencies.bind(
      this
    );
    this.handleSkillAddition = this.handleSkillAddition.bind(this);
    this.handleSkillDelete = this.handleSkillDelete.bind(this);
    this.handlechangefeespercentage = this.handlechangefeespercentage.bind(
      this
    );
  }

  categoriesSuggestions() {}

  skillsSuggestions() {}

  locationsSuggestions() {}

  // componentWillMount() {
  //   let company = this.props.company;
  //   if (objIsValid(company)) {
  //     company.categorizationsAttributes = company.categorizations;
  //     company.localizationsAttributes = company.localizations;
  //     delete company.categorizations;
  //     delete company.localizations;
  //     let categoriesTags = ReactTagsHelper.toTags(
  //       company.categorizationsAttributes,
  //       "category"
  //     );
  //     let locationsTags = ReactTagsHelper.toTags(
  //       company.localizationsAttributes,
  //       "location"
  //     );
  //
  //     this.setState({ company, categoriesTags, locationsTags });
  //   }
  // }

  extractSkillsFromCompetencies(competencies) {
    let skills = [];

    if (competencies === undefined || competencies.length === 0) {
      return skills;
    }

    for (let index in competencies) {
      let skill = competencies[index].skill;
      skills.push(skill);
    }

    return skills;
  }

  handleSkillDelete() {
    // let { company, chosenSkills } = { ...this.props.state };
    // let competencies = company.competenciesAttributes;
    //
    // ReactTagsHelper.removeSkill(index, chosenSkills, competencies);
    // this.props.setState({ company, chosenSkills });
  }

  handleSkillAddition(skillName) {
    const { company, chosenSkills } = this.props.state;

    let newChosenSkills = [...chosenSkills].concat([
      { id: skillName.text, name: skillName.text },
    ]);
    company["competenciesAttributes"].push({
      skill: { name: skillName.text },
      rating: 5,
      skill_id: skillName.number,
      // name: ncategory.categoryAttributes.name
    });
    this.props.setState({ chosenSkills: newChosenSkills, company });
  }

  handleLocationChange = (currentSelectedLocation) => {
    this.props.setState({ currentSelectedLocation });
  };

  handleLocationSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => {
        this.handleLocationAddition(results[0].formatted_address);
        this.props.setState({ currentSelectedLocation: "" });
        getLatLng(results[0]);
      })
      .catch((error) => console.error("Error", error));
  };

  handleCategoryAddition(categoryName) {
    const { company, categoriesTags } = this.props.state;
    let newChosenCategories = [...categoriesTags].concat([
      { id: categoryName.text, name: categoryName.text },
    ]);

    company["categorizationsAttributes"].push({
      categoryAttributes: { name: categoryName.text },
      // name: ncategory.categoryAttributes.name
    });
    this.props.setState({ categoriesTags: newChosenCategories, company });
  }

  handleCategoryRemove() {
    // let { company, categoriesTags } = { ...this.props.state };
    // let categorizations = company.categorizationsAttributes;
    //
    // ReactTagsHelper.removeCategory(indexTag, categoriesTags, categorizations);
    // this.props.setState({ company, categoriesTags });
  }

  handleLocationAddition(locationName) {
    let { locationsTags } = { ...this.props.state };

    let findElement = function (element) {
      return locationName === element.text;
    };
    let alreadyHad = locationsTags.find(findElement);

    if (!alreadyHad) {
      // ReactTagsHelper.addLocation(
      //   locationName,
      //   suggestions,
      //   locationsTags,
      //   company.localizationsAttributes
      // );
      // this.props.setState({ company, locationsTags });
    }
  }

  handleLocationRemove() {
    // let { company, locationsTags } = { ...this.props.state };
    // let localizations = company.localizationsAttributes;
    //
    // ReactTagsHelper.removeLocation(indexTag, locationsTags, localizations);
    // this.props.setState({ company, locationsTags });
  }

  handleCompanyUpdate(prop, data) {
    const company = { ...this.props.state.company };

    company[prop] = data;
    this.props.setState({ company });
  }

  handleInputChange(e) {
    e.preventDefault();
    const prop = e.target.name;
    const updatedValue = e.target.value;

    if (prop === "name") {
      const company = { ...this.props.state.company };

      company["name"] = updatedValue;
      company["mentionTag"] = updatedValue.replace(/[^\w]/gi, "").toLowerCase();

      this.props.setState({ company });
    } else if (prop === "mentionTag") {
      this.handleCompanyUpdate(
        prop,
        updatedValue.replace(/[^\w]/gi, "").toLowerCase()
      );
    } else {
      this.handleCompanyUpdate(prop, updatedValue);
    }
  }

  handlechangefeespercentage(e, fees, other) {
    let company = this.props.state.company;
    let otherPercentage;
    if (other) {
      otherPercentage = e.target.value;
      fees = otherPercentage;
    } else {
      otherPercentage = "";
    }
    company.percentage = fees;
    this.props.setState({
      other_percentage: otherPercentage,
      company,
    });
  }

  extractOptions(list, type) {
    let values = [];
    for (var listItem in list) {
      let newElementName = undefined;
      if (list[listItem].name === undefined && type === "Skill") {
        newElementName = list[listItem].skillAttributes.name;
      } else if (list[listItem].name === undefined && type === "Location") {
        newElementName = list[listItem].locationAttributes.name;
      } else if (list[listItem].name === undefined && type === "Category") {
        newElementName = list[listItem].CategoryAttributes.name;
      }
      values.push({
        id: list[listItem].name || newElementName,
        text: list[listItem].name || newElementName,
        number: list[listItem].id,
      });
    }
    return values;
  }

  extractTags(list, type) {
    let tags = [];
    for (var listItem in list) {
      let newElementName = undefined;
      if (list[listItem].name === undefined && type === "Skill") {
        newElementName = list[listItem].skillAttributes.name;
      } else if (list[listItem].name === undefined && type === "Location") {
        newElementName = list[listItem].locationAttributes.name;
      } else if (list[listItem].name === undefined && type === "Industry") {
        newElementName = list[listItem].categoryAttributes.name;
      }
      if (type === "Skill" || type === "Industry") {
        tags.push({
          id: list[listItem].name || newElementName,
          text: list[listItem].name || newElementName,
        });
      } else tags.push(list[listItem].name || newElementName);
    }
    return tags;
  }

  render() {
    // const searchOptions = {
    //   types: ["(cities)"],
    // };

    return (
      <div className="onboarding-container__form row">
        <div className="signup__form-row col-md-12">
          <label className="form-label form-heading">Agency Name</label>
          <input
            className="form-control"
            type="text"
            name="name"
            placeholder="eg. Acme or Acme Design"
            onChange={this.handleInputChange}
            value={this.props.state.company.name}
            required
          />
        </div>
        <div className="signup__form-row col-md-12">
          <label className="form-label form-heading">Agency Username</label>
          <input
            className="form-control"
            type="text"
            name="mentionTag"
            placeholder="acme or acmedesign"
            onChange={this.handleInputChange}
            value={this.props.state.company.mentionTag}
            required
          />
        </div>
        <div className="signup__form-row col-md-12">
          <label className="form-label form-heading">
            What minimum percentage fee will you work at?
          </label>
          <div className="input-group">
            <div className="input-group-btn">
              <button
                type="button"
                className={
                  this.props.state.company.percentage === "15"
                    ? "btn button button-white active"
                    : "btn button button-white"
                }
                onClick={(event) =>
                  this.handlechangefeespercentage(event, "15", false)
                }
                aria-label="15"
              >
                15%
              </button>
              <button
                type="button"
                className={
                  this.props.state.company.percentage === "20"
                    ? "btn button button-white active"
                    : "btn button button-white"
                }
                onClick={(event) =>
                  this.handlechangefeespercentage(event, "20", false)
                }
                aria-label="20"
              >
                20%
              </button>
              <button
                type="button"
                className={
                  this.props.state.company.percentage === "25"
                    ? "btn button button-white active"
                    : "btn button button-white"
                }
                onClick={(event) =>
                  this.handlechangefeespercentage(event, "25", false)
                }
                aria-label="25"
              >
                25%
              </button>
            </div>
            <input
              className="form-control"
              type="number"
              name="percentage"
              placeholder="Other"
              onChange={(event) =>
                this.handlechangefeespercentage(event, "", true)
              }
              value={this.props.state.other_percentage}
              step="0.1"
              min="0"
            />
          </div>
        </div>
        <br />
      </div>
    );
  }
}

export default AgencyForm;
