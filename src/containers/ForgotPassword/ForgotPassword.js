import React, { useContext, Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { ROUTES } from "routes";
import {
  PageContainer,
  FormContainer,
  FormWrapper,
  Header,
  HeaderLink,
  ImageContainer,
} from "sharedComponents/OuterComponents";

import { API_ROOT_PATH } from "constants/api";
import GlobalContext from "contexts/globalContext/GlobalContext";
import OuterPage from "PageWrappers/OuterPage";

import Form from "components/ForgotPassword/Form";
import { AWS_CDN_URL } from "constants/api";

import sharedStyles from "assets/stylesheets/scss/collated/outer.module.scss";
import notify from "notifications";

const HookForgotPassword = (props) => {
  const store = useContext(GlobalContext);
  return (
    <OuterPage>
      <ForgotPassword {...props} {...store} />
    </OuterPage>
  );
};

class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forgotPasswordData: {
        email: "",
      },
      redirectToSignIn: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleForgotPasswordRequest = this.handleForgotPasswordRequest.bind(
      this
    );
  }

  handleForgotPasswordRequest() {
    const forgotPasswordData = this.state.forgotPasswordData;
    var url =
      API_ROOT_PATH +
      "/professional_auth/password?email=" +
      forgotPasswordData.email;
    fetch(url, {
      method: "POST",
      body: JSON.stringify(forgotPasswordData),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((json) => {
            notify(
              "info",
              "" + json.message.replace("''", forgotPasswordData.email)
            );
          });
        } else if (response !== undefined) {
          response.json().then(() => {
            notify(
              "danger",
              `Unable to find user with email ${forgotPasswordData.email}`
            );
          });
        } else {
          notify(
            "danger",
            `Unable to find user with email ${forgotPasswordData.email}`
          );
        }
      })
      .then(() =>
        setTimeout(() => {
          this.setState({ redirectToSignIn: true });
        }, 2000)
      )
      .catch((error) => {
        notify(
          "Danger",
          error.message || "There was an error with your request"
        );
      });
  }

  handleInputChange(prop, updatedValue) {
    const forgotPasswordData = { ...this.state.forgotPasswordData };
    forgotPasswordData[prop] = updatedValue;
    this.setState({ forgotPasswordData });
  }

  render() {
    return (
      <PageContainer>
        <Header>
          <HeaderLink>
            <Link to="/" title="Leo">
              <img src={`${AWS_CDN_URL}/icons/OuterLogo.svg`} alt="OuterLogo" />
            </Link>
          </HeaderLink>
          <div className="desktop">
            Already have an account?{" "}
            <Link to={ROUTES.ProfessionalSignin.url()}>Sign in here.</Link>
          </div>
        </Header>
        <ImageContainer>
          <img
            src={`${AWS_CDN_URL}/illustrations/illustration.png`}
            alt="Leo"
          />
        </ImageContainer>
        <FormContainer>
          <FormWrapper>
            <h2>Forgot Password</h2>
            <div className={sharedStyles.link}>
              {`Fill in your email address and we'll email you a link allowing you
              to reset your password.`}
            </div>
            <Form
              handleForgotPasswordRequest={this.handleForgotPasswordRequest}
              handleInputChange={this.handleInputChange}
            />
            {this.state.redirectToSignIn && (
              <Redirect to={ROUTES.ProfessionalSignin.url()} />
            )}
          </FormWrapper>
        </FormContainer>
      </PageContainer>
    );
  }
}
export default HookForgotPassword;
