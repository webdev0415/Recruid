import React, { Component } from "react";
import PropTypes from "prop-types";

import formStyles from "assets/stylesheets/scss/collated/form.module.scss";

class ForgotPasswordForm extends Component {
  handleInputChange = (e) => {
    e.preventDefault();
    const prop = e.target.name;
    const updatedValue = e.target.value;
    this.props.handleInputChange(prop, updatedValue);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.handleForgotPasswordRequest();
  };

  render() {
    return (
      <div>
        <div>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <div>
              <label className={formStyles.label}>Email Address</label>
              <input
                onChange={this.handleInputChange}
                className={formStyles.input}
                type="email"
                name="email"
                required
                placeholder="janedoe@domain.com"
              />
            </div>
            <div>
              <button className={formStyles.button} type="submit">
                Send Reset Email
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

ForgotPasswordForm.propTypes = {
  handleForgotPasswordRequest: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default ForgotPasswordForm;
