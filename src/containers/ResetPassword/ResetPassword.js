import React, { useContext, Component } from "react";
import { Link, Redirect } from "react-router-dom";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { handleResetUpdate } from "helpersV2/user";
import OuterPage from "PageWrappers/OuterPage";
import { ROUTES } from "routes";
import {
  PageContainer,
  FormContainer,
  FormWrapper,
  Header,
  HeaderLink,
  ImageContainer,
} from "sharedComponents/OuterComponents";

import Form from "components/ResetPassword/Form";
import { AWS_CDN_URL } from "constants/api";

import sharedStyles from "assets/stylesheets/scss/collated/outer.module.scss";
import notify from "notifications";

const HookResetPassword = (props) => {
  const store = useContext(GlobalContext);
  return (
    <OuterPage>
      <ResetPassword {...props} {...store} />
    </OuterPage>
  );
};

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      setpasswordData: {
        password: "",
        password_confirmation: "",
        reset_password_token: "",
      },
      redirectToSignIn: false,
    };
    this.queryParams = new URLSearchParams(window.location.search);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleResetPasswordRequest = this.handleResetPasswordRequest.bind(
      this
    );
  }
  componentDidMount() {
    this.setState({
      setpasswordData: {
        reset_password_token: this.queryParams.get("reset_password_token"),
      },
    });
  }

  handleResetPasswordRequest() {
    const email = this.queryParams.get("email");
    if (!email.length) {
      return notify(
        "danger",
        "Could not update the password. Email is not provided"
      );
    }
    const setpasswordData = { ...this.state.setpasswordData };
    if (setpasswordData.password === setpasswordData.password_confirmation) {
      handleResetUpdate(setpasswordData).then((res) => {
        if (res.success) {
          return setTimeout(() => {
            this.setState({ redirectToSignIn: true });
          }, 2000);
        }
        return notify(
          "danger",
          "Failed to update your password. Please, try again later"
        );
      });
    } else {
      notify("danger", "Password and Confirm Password must be same");
    }
  }

  handleInputChange(prop, updatedValue) {
    const setpasswordData = { ...this.state.setpasswordData };
    setpasswordData[prop] = updatedValue;
    this.setState({ setpasswordData });
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
            <h2>Reset Password</h2>
            <div className={sharedStyles.link}>
              Enter your new password and confirm it below so we can reset your
              password.
            </div>
            <Form
              handleResetPasswordRequest={this.handleResetPasswordRequest}
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

export default HookResetPassword;
