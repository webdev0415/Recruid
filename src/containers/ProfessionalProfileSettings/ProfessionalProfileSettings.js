import React, { useContext, useEffect, Component, useState } from "react";
import { ReactTitle } from "react-meta-tags";
import GlobalContext from "contexts/globalContext/GlobalContext";
import InnerPage from "PageWrappers/InnerPage";
import FalseATSWrapper from "PageWrappers/FalseATSWrapper";
import { InnerPageContainer } from "styles/PageContainers";
import ATSBanner from "sharedComponents/ATSBanner";
import { fetchUpdateUser } from "helpersV2/user";
import { getUser } from "contexts/globalContext/GlobalMethods";
import { fetchFullUser } from "helpersV2/user";
import camelcasify from "camelcasify";

import { toArray } from "helpers/helper";
import snake from "snakecase-keys";
import notify from "notifications";

import {
  flattenSkills,
  flattenIndustries,
  flattenLocations,
} from "sharedComponents/TagsComponent/methods/tags";

// import { objectToUrlParams } from "../helpers/helper";
// import { API_ROOT_PATH } from "../constants/api";
import ProfessionalProfileForm from "components/ProfessionalProfileSettings/ProfessionalProfileForm";

const HookProfessionalProfileSettings = (props) => {
  const store = useContext(GlobalContext);
  const [profile, setProfile] = useState(undefined);
  const [originalSkills, setOriginalSkills] = useState(undefined);
  const [originalIndustries, setOriginalIndustries] = useState(undefined);
  const [originalLocations, setOriginalLocations] = useState(undefined);

  useEffect(() => {
    if (store.session && store.user) {
      fetchFullUser(store.session, store.session.username).then((res) => {
        if (!res.err) {
          setProfile(camelcasify(res));
        } else {
          notify("danger", "Unable to fetch user profile");
        }
      });
    }
  }, [store.session, store.user]);

  useEffect(() => {
    if (profile) {
      setOriginalSkills(flattenSkills(profile.competencies));
      setOriginalIndustries(flattenIndustries(profile.categorizations));
      setOriginalLocations(flattenLocations(profile.localizations));
    }
  }, [profile]);

  return (
    <InnerPage>
      <FalseATSWrapper activeTab="edit">
        <InnerPageContainer>
          <ProfessionalProfileSettings
            {...props}
            {...store}
            profile={profile}
            originalSkills={originalSkills}
            originalIndustries={originalIndustries}
            originalLocations={originalLocations}
          />
        </InnerPageContainer>
      </FalseATSWrapper>
    </InnerPage>
  );
};

class ProfessionalProfileSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      experiences: [],
      profile: {},
      viewMode: "details",
    };

    this.handleProfileUpdate = this.handleProfileUpdate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleArrayChange = this.handleArrayChange.bind(this);
    this.handleSkillRating = this.handleSkillRating.bind(this);
    this.handleValidationErrors = this.handleValidationErrors.bind(this);
    // this.fetchCV = this.fetchCV.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.profile !== prevProps.profile) {
      this.setState({ profile: this.props.profile });
    }
  }

  handleProfileUpdate(removedAvatar, callback) {
    let profile = { ...this.state.profile };
    profile.experiences_attributes = profile.experiences;
    profile.categorizations_attributes = this.state.categorizations_attributes;
    profile.competencies_attributes = this.state.competencies_attributes;
    profile.localizations_attributes = this.state.localizations_attributes;

    delete profile.experiences;
    delete profile.categorizations;
    delete profile.competencies;
    delete profile.localizations;
    if (removedAvatar) {
      profile.avatarName = null;
      profile.avatarData = null;
    } else {
      if (this.state.avatar) {
        profile = { ...profile, ...this.state.avatar };
      }
      if (this.state.cover) {
        profile = { ...profile, ...this.state.cover };
      }
    }
    if (callback) {
      callback();
    }
    fetchUpdateUser(
      this.props.session,
      this.props.user.id,
      snake(profile)
    ).then((res) => {
      if (!res.err) {
        notify("Candidate profile successfully updated");
        getUser(this.props.dispatch, this.props.session);
      } else {
        notify("danger", res);
      }
    });
    return;
  }

  handleInputChange(prop, updatedValue) {
    this.setState({
      profile: { ...this.state.profile, [prop]: updatedValue },
    });
  }

  handleArrayChange(prop, array) {
    const { profile } = this.state;
    profile[prop] = array;

    this.setState({ profile });
  }

  handleDelete(index, list) {
    list.splice(index, 1);
  }

  handleSkillRating(updatedCompetency, rating) {
    const { profile } = this.state;
    let competency = profile["competencies"].find((competency) => {
      return competency.id === updatedCompetency.id;
    });

    competency["rating"] = rating;

    this.setState({ profile });
  }

  handleValidationErrors(errors) {
    notify("danger", errors);
  }

  // fetchCV() {
  //   let params = {
  //     applicant_id: this.props.session.id
  //   };
  //   let url =
  //     API_ROOT_PATH + "/v1/candidate_cvs/cv_list" + objectToUrlParams(params);
  //
  //   fetch(url, {
  //     method: "GET",
  //     headers: this.props.session
  //   }).then(response => {
  //     if (response.ok) {
  //       response
  //         .json()
  //         .then(list => {
  //           let listReversed = [];
  //           if (Array.isArray(list)) {
  //             listReversed = list.reverse();
  //           } else {
  //             console.error("Invalid data type.");
  //           }
  //           this.setState({ resumeList: listReversed });
  //         })
  //         .catch(err => console.error("Error: ", err));
  //     }
  //   });
  // }

  render() {
    return (
      <>
        <ReactTitle title={`Edit Profile | Leo`} />
        <UserSettingsBanner
          title="Profile"
          activeTab={this.state.viewMode}
          setActiveTab={(viewMode) => this.setState({ viewMode })}
          tabsArr={[
            { name: "details", title: "Personal Details" },
            { name: "industries", title: "Industries & Skills" },
            { name: "experience", title: "Experience" },
          ]}
        />
        <div className="page-wrapper profile-settings container">
          <div className="row">
            <div className="col-md-12">
              {this.state.profile && (
                <ProfessionalProfileForm
                  professional={this.state.profile}
                  session={this.props.session}
                  experiences={
                    this.state.experiences
                      ? toArray(this.state.experiences)
                      : []
                  }
                  companies={[]}
                  handleProfileUpdate={this.handleProfileUpdate}
                  handleInputChange={this.handleInputChange}
                  handleArrayChange={this.handleArrayChange}
                  handleSkillRating={this.handleSkillRating}
                  handleValidationErrors={this.handleValidationErrors}
                  // resumeList={this.state.resumeList}
                  setParentState={this.setState.bind(this)}
                  viewMode={this.state.viewMode}
                  originalSkills={this.props.originalSkills}
                  originalIndustries={this.props.originalIndustries}
                  originalLocations={this.props.originalLocations}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  static getDerivedStateFromProps = (props) => {
    const { profile } = props;
    let experiences = profile ? profile.experiences : [];

    return {
      profile,
      experiences,
    };
  };
}

const UserSettingsBanner = ({ activeTab, setActiveTab, tabsArr, title }) => {
  const store = useContext(GlobalContext);

  return (
    <ATSBanner
      name={store.user?.name}
      avatar={store.user?.avatar_url}
      page={title}
      tabs={tabsArr}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabType="button"
    />
  );
};

export default HookProfessionalProfileSettings;
