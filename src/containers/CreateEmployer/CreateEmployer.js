import React, { Component, useContext } from "react";
import { Link } from "react-router-dom";
import GlobalContext from "contexts/globalContext/GlobalContext";

import {
  PageContainer,
  FormContainer,
  FormWrapper,
  Header,
  HeaderLink,
  ImageContainer,
} from "sharedComponents/OuterComponents";

import OuterPage from "PageWrappers/OuterPage";
// import { CompanyCard } from "oldContainers/OuterPages/CreateAgency/CompanyCard.jsx";
// import { PageContainer } from "components/OuterComponents";
import CreateEmployerForm from "components/CreateEmployer/CreateEmployerForm";
import { AWS_CDN_URL } from "constants/api";

const HookCreateAgency = (props) => {
  const store = useContext(GlobalContext);
  return (
    <OuterPage>
      <CreateAgency {...props} store={store} />
    </OuterPage>
  );
};

export default HookCreateAgency;

class CreateAgency extends Component {
  constructor() {
    super();
    this.urlParams = new URLSearchParams(window.location.search);
    this.state = {
      name: this.urlParams.get("name"),
      email: this.urlParams.get("email"),
      // title: this.urlParams.get("title"),
      phoneNumber: this.urlParams.get("phone"),
      agencyName: this.urlParams.get("agency_name"),
      employerName: this.urlParams.get("employer_name"),
      // companyAvatarUrl: this.urlParams.get("employer_avatar_url"),
      // companyDescription: this.urlParams.get("employer_description"),
      // companyLocation: this.urlParams.get("employer_location"),
      companyId: this.urlParams.get("employer_id"),
      agencyId: this.urlParams.get("agency_id"),
      professionalId: this.urlParams.get("professional_id"),
    };
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
          {/* <div className="desktop">
            Already have an account? <Link to={ROUTES.ProfessionalSignin.url()}>Sign in here.</Link>
          </div> */}
        </Header>
        <ImageContainer>
          <img
            src={`${AWS_CDN_URL}/illustrations/illustration.png`}
            alt="Leo"
          />
        </ImageContainer>
        <FormContainer>
          <FormWrapper>
            <CreateEmployerForm data={this.state} store={this.props.store} />
          </FormWrapper>
        </FormContainer>
      </PageContainer>
    );
  }
  shouldRender = () => true;
}
