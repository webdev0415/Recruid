import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "sharedComponents/Spinner";
import { ROUTES } from "routes";
import { API_ROOT_PATH } from "constants/api";

import formStyles from "assets/stylesheets/scss/collated/form.module.scss";

import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";

class ProfessionalLoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revealPassword: false,
    };
    this.password = React.createRef();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }

  handleInputChange(e) {
    e.preventDefault();
    const prop = e.target.name;
    const updatedValue = e.target.value;
    this.props.handleInputChange(prop, updatedValue);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleLoginRequest();
  }

  responseFacebook(response) {
    const url = API_ROOT_PATH + "/v1/professionals/facebook_and_google_login";
    const params = {
      fbid: response.id,
      provider: "facebook",
      email: response.email,
    };
    fetch(url, {
      method: "POST",
      headers: this.props.session,
      body: JSON.stringify(params),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((resp) => {
            if (!resp.is_exists) {
              alert("No account found, please login via email");
            }
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  togglePasswordReveal = (e) => {
    e.preventDefault();
    this.setState({ revealPassword: !this.state.revealPassword });
  };

  render() {
    return (
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
          <div className="leo-relative">
            <label className={formStyles.label}>Password</label>
            <input
              onChange={this.handleInputChange}
              className={formStyles.input}
              type={this.state.revealPassword ? "text" : "password"}
              name="password"
              required
              placeholder="•••••••••••••••••"
              ref={this.password}
            />
            <RevealPassword onClick={this.togglePasswordReveal} type="button">
              <img
                src={`${AWS_CDN_URL}/icons/pass-reveal.svg`}
                alt="Password reveal icon"
              />
            </RevealPassword>
          </div>
          <div style={{ textAlign: "right" }}>
            <Link className={formStyles.link} to={ROUTES.ForgotPassword.url()}>
              Forgot Your Password?
            </Link>
          </div>
          <div className={formStyles.buttonContainer}>
            <button
              className={formStyles.button}
              type="submit"
              style={{ color: "white" }}
            >
              {!this.props.signingIn ? "Sign in" : "Signing in..."}
            </button>
            {this.props.signingIn && <Spinner />}
          </div>
        </form>
      </div>
    );
  }
}

ProfessionalLoginForm.propTypes = {
  handleLoginRequest: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default ProfessionalLoginForm;

const RevealPassword = styled.button`
  position: absolute;
  top: 40px;
  right: 10px;
`;
