import React, { useContext, Component } from "react";
import { Link, Redirect } from "react-router-dom";
import notify from "notifications";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { updateDefaultPassword } from "helpersV2/user";
import { getUser } from "contexts/globalContext/GlobalMethods";
import InnerPage from "PageWrappers/InnerPage";
import { ROUTES } from "routes";
import {
  PageContainer,
  FormContainer,
  FormWrapper,
  Header,
  HeaderLink,
  ImageContainer,
} from "sharedComponents/OuterComponents";

import Form from "components/NewPassword/Form";
import { AWS_CDN_URL } from "constants/api";

const HookNewPassword = (props) => {
  const store = useContext(GlobalContext);

  return (
    <InnerPage pageTitle="New Password">
      <ResetPassword {...props} {...store} />
    </InnerPage>
  );
};

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      password_confirmation: "",
      redirectToSignIn: false,
      redirectToDashboard: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount() {
    document.body.classList.add("outer");
  }

  componentWillUnmount() {
    document.body.classList.remove("outer");
  }

  handleChangePasswordSubmit = async () => {
    const updateResponse = await updateDefaultPassword(
      this.state.password,
      this.state.password_confirmation,
      this.props.session
    );
    if (updateResponse.success) {
      getUser(this.props.dispatch, this.props.session);
      notify("info", "Password has been successfully updated");
      return this.setState({ password: "", passwordConfirmation: "" });
    }
    if (updateResponse.errors && updateResponse.errors.full_messages.length) {
      return notify("danger", updateResponse.errors.full_messages);
    }
    return false;
  };

  handleInputChange(prop, updatedValue) {
    let newState = { ...this.state };
    newState[prop] = updatedValue;
    this.setState(newState);
  }

  static getDerivedStateFromProps = (props) => {
    const { session, user } = props;
    let nextState = { session };
    if (!!user && !user.temp_password) {
      nextState = { ...nextState, redirectToDashboard: true };
    }
    return nextState;
  };

  render() {
    return (
      <PageContainer>
        <Header>
          <HeaderLink>
            <Link to="/" title="Leo">
              <img src={`${AWS_CDN_URL}/icons/OuterLogo.svg`} alt="OuterLogo" />
            </Link>
          </HeaderLink>
        </Header>
        <ImageContainer>
          <img
            src={`${AWS_CDN_URL}/illustrations/illustration.png`}
            alt="Leo"
          />
        </ImageContainer>
        <FormContainer>
          <FormWrapper>
            <h2>Create new Password</h2>
            <Form
              handleChangePasswordSubmit={this.handleChangePasswordSubmit}
              handleInputChange={this.handleInputChange}
            />
          </FormWrapper>
        </FormContainer>
        {this.state.redirectToSignIn && (
          <Redirect to={ROUTES.ProfessionalSignin.url()} />
        )}
        {this.state.redirectToDashboard && (
          <Redirect to={ROUTES.MyCompanies.url()} />
        )}
      </PageContainer>
    );
  }
}

export default HookNewPassword;
