import React, { useState, useContext } from "react";
import { ReactTitle } from "react-meta-tags";
import { Link } from "react-router-dom";
import OuterPage from "PageWrappers/OuterPage";

import {
  PageContainer,
  FormContainer,
  FormWrapper,
  Header,
  HeaderLink,
  ImageContainer,
} from "sharedComponents/OuterComponents";

import Form from "components/ProfessionalSignin/Form";
// import LoginContainer from "../shared/LoginContainer";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { AWS_CDN_URL } from "constants/api";

import { getSession } from "contexts/globalContext/GlobalMethods";

const ProfessionalSignin = () => {
  const store = useContext(GlobalContext);
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [signingIn, setSigningIn] = useState(false);

  const handleLoginRequest = () => {
    setSigningIn(true);
    getSession(store.dispatch, state).then(() => setSigningIn(false));
  };

  const handleInputChange = (property, newValue) => {
    const loginData = { ...state };
    loginData[property] = newValue;
    setState(loginData);
  };

  return (
    <OuterPage>
      <ReactTitle title="Leo - Love your ATS" />
      <PageContainer>
        <Header>
          <HeaderLink>
            <Link to="/" title="Leo">
              <img src={`${AWS_CDN_URL}/icons/OuterLogo.svg`} alt="OuterLogo" />
            </Link>
          </HeaderLink>
          <div className="desktop">
            Don’t have an account?{" "}
            <a href="https://www.hirewithleo.com">
              Book a demo to get started.
            </a>
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
            <h2>Sign in</h2>
            <Form
              handleLoginRequest={handleLoginRequest}
              handleInputChange={handleInputChange}
              signingIn={signingIn}
            />
            <div className="mobile" style={{ textAlign: "center" }}>
              Don’t have an account?{" "}
              <a href="https://www.hirewithleo.com">
                Book a demo to get started.
              </a>
            </div>
          </FormWrapper>
        </FormContainer>
      </PageContainer>
    </OuterPage>
  );
};

export default ProfessionalSignin;
