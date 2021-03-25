import React, { Component } from "react";
import PropTypes from "prop-types";

import formStyles from "assets/stylesheets/scss/collated/form.module.scss";

class ResetPasswordForm extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e) {
    e.preventDefault();
    const prop = e.target.name;
    const updatedValue = e.target.value;
    this.props.handleInputChange(prop, updatedValue);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleChangePasswordSubmit();
  }

  render() {
    return (
      <div>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <div>
            <label className={formStyles.label}>New Password</label>
            <input
              onChange={this.handleInputChange}
              className={formStyles.input}
              type="password"
              name="password"
              required
              placeholder="•••••••••••••••••"
            />
          </div>
          <div>
            <label className={formStyles.label}>Confirm Password</label>
            <input
              onChange={this.handleInputChange}
              className={formStyles.input}
              type="password"
              name="password_confirmation"
              required
              placeholder="•••••••••••••••••"
            />
          </div>
          <div>
            <button className={formStyles.button} type="submit">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    );
  }
}

ResetPasswordForm.propTypes = {
  handleChangePasswordSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default ResetPasswordForm;
