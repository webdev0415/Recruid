import React, { Component } from "react";
// import { WithContext as ReactTags } from "react-tag-input";
import PropTypes from "prop-types";

import { capitalize } from "../../helpers/helper";

class TagsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
  }

  render() {
    return (
      <div
        onClick={this.handleClick}
        onBlur={this.handleBlur}
        key={this.props.tagFormKey}
      >
        {/*}<ReactTags
          minQueryLength={this.state.active ? -1 : 1}
          classNames={{
            tags: "skill-tags",
            tagInput: "skill-tags__input",
            tagInputField: "form-control",
            selected: "skill-tags__selected",
            tag: "skill-tags__selected skill-tags__tag",
            remove:
              "skill-tags__selected skill-tags__remove skill-tags__remove-custom",
            suggestions: "skill-tags__suggestions",
            activeSuggestion: "skill-tags__suggestions--active"
          }}
          removecomponent={RemoveComponent}
          shouldRenderSuggestions={this.state.shouldRenderSuggestions}
          autofocus={false}
          tags={this.props.tags}
          placeholder={this.props.placeholder}
          suggestions={this.props.suggestions}
          handleDelete={this.props.handleDelete}
          handleAddition={this.handleAddition}
          allowDeleteFromEmptyInput={false}
        />*/}
      </div>
    );
  }

  handleClick() {
    // forceUpdate is required to show the component on first click. If we
    // remove it the component will require two clicks to show.
    this.setState(
      {
        active: true,
      },
      () => this.forceUpdate()
    );
  }

  handleBlur() {
    this.setState({
      active: false,
    });
  }

  handleAddition(name) {
    if (this.props.capitalize) {
      name = capitalize(name);
    }
    if (
      this.props.suggestions.findIndex(
        (suggestion) => suggestion.name === name.name
      ) === -1
    ) {
      return this.props.handleAddition(name);
    }
    return this.props.handleAddition(name);
  }
}

TagsForm.propTypes = {
  placeholder: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  suggestions: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleAddition: PropTypes.func.isRequired,
  capitalize: PropTypes.bool,
};

export default TagsForm;
