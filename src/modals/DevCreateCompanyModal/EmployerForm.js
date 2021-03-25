import React, { Component } from "react";

// import { objIsValid } from "../../../helpers/helper";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

class EmployerForm extends Component {
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
  //     this.props.setState({ company, categoriesTags, locationsTags });
  //   }
  // }

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
      .then(() => {
        // log('Success', latLng)
      })
      .catch((error) => console.error("Error", error));
  };

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
    // let { company, chosenSkills } = { ...this.state }
    // let suggestions = this.props.skillSuggestions

    // ReactTagsHelper.addSkill(
    //   skillName,
    //   suggestions,
    //   chosenSkills,
    //   company.competenciesAttributes
    // )

    // this.setState({ company, chosenSkills })
    const { company, chosenSkills } = this.props.state;

    let newChosenSkills = [...chosenSkills].concat([
      { id: skillName.text, name: skillName.text },
    ]);

    // let skill = skills.filter(skill => {
    //   return skill.name === skillName
    // })
    // if (competency !== undefined) {
    //   competency['_destroy'] = false
    // }
    // else {
    //   let skill = chosenSkills.find((element) => {
    //     return skillName.text === element.name || (element.skillAttributes && skillName.text === element.skillAttributes.name)
    //   })
    //   // if (skill.skillAttributes) {
    //   //   profile['competencies'].push(skill.skillAttributes.name)
    //   // } else if (skill.id) {
    //   //   profile['competencies'].push({ skill: skill, skill_id: skill.id, rating: 5 })
    //   // }
    // }
    company["competenciesAttributes"].push({
      skill: { name: skillName.text },
      rating: 5,
      skill_id: skillName.number,
      // name: ncategory.categoryAttributes.name
    });
    this.props.setState({ chosenSkills: newChosenSkills, company });
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
          <label className="form-label form-heading">
            eg. Acme or Acme Design
          </label>
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
          <label className="form-label form-heading">acme or acmedesign</label>
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
        <br />
      </div>
    );
  }
}

export default EmployerForm;
