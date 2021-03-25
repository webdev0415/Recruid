import React, { useContext, useEffect, Component, useState } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import InnerPage from "PageWrappers/InnerPage";
import { InnerPageContainer } from "styles/PageContainers";
import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";
import FalseATSWrapper from "PageWrappers/FalseATSWrapper";
import ATSBanner from "sharedComponents/ATSBanner";
import camelcasify from "camelcasify";
import {
  fetchUpdateUser,
  handleResetUpdate,
  fetchDeleteAccount,
} from "helpersV2/user";
import { getUser, deleteStore } from "contexts/globalContext/GlobalMethods";
import { fetchFullUser, fetchActivateAccount } from "helpersV2/user";
import notify from "notifications";
import Spinner from "sharedComponents/Spinner";

import ApiCalendar from "react-google-calendar-api";

const HookSettings = (props) => {
  const store = useContext(GlobalContext);
  const [professional, setProfessional] = useState(undefined);
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    if (store.session && store.user) {
      fetchFullUser(store.session, store.session.username).then((res) => {
        if (!res.err) {
          setProfessional(camelcasify(res));
        } else {
          notify("danger", "Unable to fetch user profile");
        }
      });
    }
  }, [store.session, store.user]);

  return (
    <InnerPage pageTitle="Settings">
      <FalseATSWrapper activeTab="user-settings">
        <InnerPageContainer>
          <Settings
            {...props}
            {...store}
            professional={professional}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </InnerPageContainer>
      </FalseATSWrapper>
    </InnerPage>
  );
};

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      professional: undefined,
      password: {
        password: "",
        passwordConfirmation: "",
      },
      showLoader: false,
      gcalConnected: null,
      showEmailWarning: false,
      gCalendarUser: null,
      gMailUser: null,
      showModal: undefined,
    };

    this.handleSaveButton = this.handleSaveButton.bind(this);
    this.handleChangePasswordSubmit = this.handleChangePasswordSubmit.bind(
      this
    );
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleGlobalCheckUncheck = this.handleGlobalCheckUncheck.bind(this);
    this.handleGlobalPushCheckUncheck = this.handleGlobalPushCheckUncheck.bind(
      this
    );
    this.isAllChecked = this.isAllChecked.bind(this);
    this.isAllCheckedPush = this.isAllCheckedPush.bind(this);
    this.renderCloseAccountModal = this.renderCloseAccountModal.bind(this);
    this.handleAccountStatus = this.handleAccountStatus.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
  }

  handleSaveButton() {
    let professional = { ...this.state.professional };
    this.setState({ showLoader: true });
    fetchUpdateUser(this.props.session, this.props.user.id, professional).then(
      (res) => {
        if (!res.err) {
          notify("Candidate profile successfully updated");
          getUser(this.props.dispatch, this.props.session);
        } else {
          notify("danger", res);
        }
        this.setState(() => ({ showLoader: false }));
        if (professional.email !== this.props.session.uid) {
          this.setState({ showEmailWarning: true });
        }
      }
    );
  }

  handleChangePasswordSubmit() {
    handleResetUpdate(
      {
        password: this.state.password.password,
        password_confirmation: this.state.password.passwordConfirmation,
        email: this.props.session.uid,
      },
      this.props.session
    ).then(() => {
      this.setState({
        password: {
          password: "",
          passwordConfirmation: "",
        },
      });
    });
  }

  handleInputChange(event) {
    let professional = { ...this.state.professional };
    let fieldValue = event.target.value;
    let fieldName = event.target.name;

    professional[fieldName] = fieldValue;
    this.setState({ professional });
  }

  handleCheckBoxChange(event) {
    let professional = { ...this.state.professional };
    let checkValue = event.target.checked;
    let fieldName = event.target.name;

    professional[fieldName] = checkValue;
    this.setState({ professional });
  }

  handleGlobalCheckUncheck(event) {
    let professional = { ...this.state.professional };
    let checkValue = event.target.checked;

    professional.notifyFollows = checkValue;
    professional.notifyLikes = checkValue;
    professional.notifyComments = checkValue;
    professional.notifyReviews = checkValue;

    this.setState({ professional });
  }
  handleGlobalPushCheckUncheck(event) {
    let professional = { ...this.state.professional };
    let checkValue = event.target.checked;
    professional.pushNotifyFollows = checkValue;
    professional.pushNotifyLikes = checkValue;
    professional.pushNotifyComments = checkValue;
    professional.pushNotifyReviews = checkValue;

    this.setState({ professional });
  }

  isAllChecked() {
    let professional = { ...this.state.professional };

    return (
      professional.notifyFollows &&
      professional.notifyLikes &&
      professional.notifyComments &&
      professional.notifyReviews
    );
  }
  isAllCheckedPush() {
    let professional = { ...this.state.professional };

    return (
      professional.pushNotifyFollows &&
      professional.pushNotifyLikes &&
      professional.pushNotifyComments &&
      professional.pushNotifyReviews
    );
  }

  componentDidMount() {
    /*** GOOGLE-CALENDAR API ***/
    ApiCalendar.onLoadCallback = () => {
      ApiCalendar.listenSign(() => {
        if (ApiCalendar.sign) {
          this.setState({ gcalConnected: true });
        } else {
          this.setState({ gcalConnected: false });
        }
      });
      if (ApiCalendar.sign) {
        this.setState({ gcalConnected: true });
      } else {
        this.setState({ gcalConnected: false });
      }
    };
    /*** GOOGLE-CALENDAR API ***/
  }

  static getDerivedStateFromProps = (props, state) => {
    const { professional } = props;
    if (!state.professional && !!professional) {
      return {
        professional,
      };
    }
    return {};
  };

  handleShowModal() {
    this.setState({ showModal: "confirmStatus" });
  }

  handleAccountClose() {
    fetchDeleteAccount(this.props.session).then((res) => {
      if (!res.err) {
        deleteStore(this.props.dispatch);
      } else {
        notify("danger", "Unable to delete account");
      }
    });
  }

  handleAccountStatus() {
    fetchActivateAccount(this.props.session, this.props.user.id).then((res) => {
      if (!res.err) {
        getUser(this.props.dispatch, this.props.session);
      } else {
        notify("danger", res);
      }
    });
  }

  renderCloseAccountModal() {
    if (this.props.session) {
      return (
        <UniversalModal
          show={true}
          hide={() => this.setState({ showModal: undefined })}
          id={"confirmStatus"}
          width={480}
        >
          <ModalHeaderClassic
            title="Close Account"
            closeModal={() => this.setState({ showModal: undefined })}
          />
          <ModalBody className="no-footer">
            <div className="modal-body">
              <p>
                {`Oh no! We're sorry that you want to delete your account, we do
                need to let you know that all activity, posts, content, job
                applications and data will be deleted if you proceed. This means
                you'll miss out on being found by highly relevant employers and
                highly relevant recruitment agencies.`}{" "}
                <br />
                <br />
                {`We hope that you'll stay but if you want to continue please
                select Yes below.`}
              </p>
            </div>
            <div className="modal-footer">
              <div className="row">
                <div className="col-xs-6">
                  <button
                    type="button"
                    className="button button--default button--primary button--full"
                    onClick={() => this.handleAccountClose()}
                  >
                    Confirm Close Account
                  </button>
                </div>
                <div className="col-xs-6">
                  <button
                    type="button"
                    className="button button--default button--grey-light button--full"
                    onClick={() => this.setState({ showModal: undefined })}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </ModalBody>
        </UniversalModal>
      );
    }
  }
  render() {
    return (
      <>
        <UserSettingsBanner
          title="Settings"
          activeTab={this.props.activeTab}
          setActiveTab={this.props.setActiveTab}
          tabsArr={
            [
              // { name: "account", title: "Account" },
              // { name: "notifications", title: "Notifications" },
            ]
          }
        />
        <div className="container page-wrapper">
          {this.state.showModal === "confirmStatus" &&
            this.renderCloseAccountModal()}

          <div className="onboarding-container">
            <div className="row">
              <div className="col-md-12">
                <div className="profile-settings">
                  <div className="profile-settings__container container block-box-wrapper">
                    {this.state.showLoader ? <Spinner /> : ""}
                    <div className="tab-content col-md-12">
                      {this.props.activeTab === "account" && (
                        <div className="tab-pane in active" id="account">
                          <div className="row">
                            <div className="settings__header col-md-12">
                              <h2 className="settings__heading">Basics</h2>
                              <div className="right">
                                <button
                                  className="button button--default button--primary"
                                  type="submit"
                                  onClick={this.handleSaveButton}
                                >
                                  {this.state.showLoader ? "Saving.." : "Save"}
                                </button>
                              </div>
                              <hr />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-6">
                              <label className="form-label form-heading">
                                Full Name
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                name="name"
                                value={
                                  (this.state.professional &&
                                    this.state.professional.name) ||
                                  ""
                                }
                                onChange={this.handleInputChange}
                              />
                            </div>
                            <div className="col-sm-6">
                              <label className="form-label form-heading">
                                Email Address
                              </label>
                              <input
                                className="form-control"
                                type="email"
                                name="email"
                                value={
                                  (this.state.professional &&
                                    this.state.professional.email) ||
                                  ""
                                }
                                onChange={this.handleInputChange}
                              />
                            </div>
                            {this.state.showEmailWarning && (
                              <span style={{ color: "red", fontSize: "12px" }}>
                                {
                                  "Your email will not be changed until you confirm your new address"
                                }
                              </span>
                            )}
                          </div>
                          <hr />
                          <div>
                            <label className="form-label form-heading">
                              New Password
                            </label>
                            <input
                              className="form-control"
                              type="password"
                              name="password"
                              value={this.state.password.password}
                              onChange={(e) =>
                                this.setState({
                                  password: {
                                    ...this.state.password,
                                    password: e.target.value,
                                  },
                                })
                              }
                              required
                            />
                            <label className="form-label form-heading">
                              New Password Confirmation
                            </label>
                            <input
                              className="form-control"
                              type="password"
                              name="passwordConfirmation"
                              value={this.state.password.passwordConfirmation}
                              onChange={(e) =>
                                this.setState({
                                  password: {
                                    ...this.state.password,
                                    passwordConfirmation: e.target.value,
                                  },
                                })
                              }
                              required
                            />
                            <button
                              className="button button--default button--primary"
                              type="button"
                              onClick={this.handleChangePasswordSubmit}
                            >
                              Change Password
                            </button>
                          </div>
                          <hr />
                          <div>
                            {/* <label className="form-label form-heading">
                              Social Accounts
                            </label>

                            {this.state.gcalConnected === false && (
                              <button
                                onClick={(e) => {
                                  ApiCalendar.handleAuthClick();
                                }}
                                className="button button--default button--orange"
                              >
                                Connect Google
                              </button>
                            )} */}
                            {this.state.gcalConnected === true && (
                              <button
                                onClick={() => {
                                  ApiCalendar.handleSignoutClick();
                                  this.setState({ gcalConnected: false });
                                }}
                                className="button button--default button--orange"
                              >
                                Disconnect Google
                              </button>
                            )}
                          </div>
                          <hr />
                          <div>
                            <label className="form-label form-heading">
                              Close Leo Account
                            </label>
                            <button
                              className="button button--default button--grey"
                              onClick={() => {
                                this.handleShowModal();
                              }}
                            >
                              Close Account
                            </button>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-md-12">
                              <div className="right">
                                <button
                                  type="submit"
                                  className="button button--default button--primary"
                                  onClick={this.handleSaveButton}
                                >
                                  {this.state.showLoader ? "Saving.." : "Save"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {this.props.activeTab === "notifications" && (
                        <div className="tab-pane in active" id="notifications">
                          <div className="row">
                            <div className="settings__header col-md-12">
                              <h2 className="settings__heading">
                                Notifications
                              </h2>
                              <div className="right">
                                <button
                                  className="button button--default button--primary"
                                  type="submit"
                                  onClick={this.handleSaveButton}
                                >
                                  {this.state.showLoader ? "Saving.." : "Save"}
                                </button>
                              </div>
                              <hr />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                                <div className="col-xs-8">
                                  <label className="form-label" />
                                </div>
                                <div className="col-xs-2 settings__col">
                                  <svg
                                    width="12"
                                    height="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M10.28 0H1.723C.772 0 0 .773 0 1.723V22.277C0 23.227.772 24 1.722 24h8.559c.95 0 1.723-.773 1.723-1.723V1.723C12.004.773 11.23 0 10.28 0zM5.253 22.007a.751.751 0 0 1 1.5 0 .751.751 0 0 1-1.5 0zM1 20.02V3.98h10.003V20.02H1z"
                                      fill="#000"
                                      fill-role="nonzero"
                                    />
                                  </svg>
                                </div>
                                <div className="col-xs-2 settings__col">
                                  <svg
                                    width="26"
                                    height="19"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M.146 0h25.707c.395 1.408 0 2.309-1.261 3.079-3.64 2.226-7.207 4.56-10.775 6.896-.613.4-1.04.395-1.638 0C8.61 7.637 5.042 5.3 1.405 3.065.144 2.305-.246 1.4.146 0zM0 4c.7.384 1.43.899 2.005 1.249 3.39 2.116 6.783 4.225 10.145 6.384.656.423 1.1.425 1.761 0 3.912-2.486 7.983-5.08 12.09-7.633v15H0V4z"
                                      fill="#000"
                                      fill-role="nonzero"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <hr />
                            </div>
                            <div className="col-md-12">
                              <div className="settings__row row">
                                <div className="col-xs-8">
                                  <label className="form-label form-heading">
                                    All Notifications
                                  </label>
                                </div>
                                <div className="col-xs-2  settings__col">
                                  <input
                                    type="checkbox"
                                    checked={this.isAllCheckedPush() || false}
                                    onChange={this.handleGlobalPushCheckUncheck}
                                  />
                                </div>
                                <div className="col-xs-2  settings__col">
                                  <input
                                    type="checkbox"
                                    checked={this.isAllChecked() || false}
                                    onChange={this.handleGlobalCheckUncheck}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="settings__row row">
                                <div className="col-xs-8">
                                  <label className="form-label form-heading">
                                    When someone follows me
                                  </label>
                                </div>
                                <div className="col-xs-2 settings__col">
                                  <input
                                    type="checkbox"
                                    checked={
                                      (this.state.professional &&
                                        this.state.professional
                                          .pushNotifyFollows) ||
                                      false
                                    }
                                    name="pushNotifyFollows"
                                    onChange={this.handleCheckBoxChange}
                                  />
                                </div>
                                <div className="col-xs-2 settings__col">
                                  <input
                                    type="checkbox"
                                    checked={
                                      (this.state.professional &&
                                        this.state.professional
                                          .notifyFollows) ||
                                      false
                                    }
                                    name="notifyFollows"
                                    onChange={this.handleCheckBoxChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="settings__row row">
                                <div className="col-xs-8">
                                  <label className="form-label form-heading">
                                    When someone likes my post
                                  </label>
                                </div>
                                <div className="col-xs-2 settings__col">
                                  <input
                                    type="checkbox"
                                    checked={
                                      (this.state.professional &&
                                        this.state.professional
                                          .pushNotifyLikes) ||
                                      false
                                    }
                                    name="pushNotifyLikes"
                                    onChange={this.handleCheckBoxChange}
                                  />
                                </div>
                                <div className="col-xs-2 settings__col">
                                  <input
                                    type="checkbox"
                                    checked={
                                      (this.state.professional &&
                                        this.state.professional.notifyLikes) ||
                                      false
                                    }
                                    name="notifyLikes"
                                    onChange={this.handleCheckBoxChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="settings__row row">
                                <div className="col-xs-8">
                                  <label className="form-label form-heading">
                                    When someone comments on my post
                                  </label>
                                </div>
                                <div className="col-xs-2 settings__col">
                                  <input
                                    type="checkbox"
                                    checked={
                                      (this.state.professional &&
                                        this.state.professional
                                          .pushNotifyComments) ||
                                      false
                                    }
                                    name="pushNotifyComments"
                                    onChange={this.handleCheckBoxChange}
                                  />
                                </div>
                                <div className="col-xs-2 settings__col">
                                  <input
                                    type="checkbox"
                                    checked={
                                      (this.state.professional &&
                                        this.state.professional
                                          .notifyComments) ||
                                      false
                                    }
                                    name="notifyComments"
                                    onChange={this.handleCheckBoxChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="settings__row row">
                                <div className="col-xs-8">
                                  <label className="form-label form-heading">
                                    When someone reviews me
                                  </label>
                                </div>
                                <div className="col-xs-2 settings__col">
                                  <input
                                    type="checkbox"
                                    checked={
                                      (this.state.professional &&
                                        this.state.professional
                                          .pushNotifyReviews) ||
                                      false
                                    }
                                    name="pushNotifyReviews"
                                    onChange={this.handleCheckBoxChange}
                                  />
                                </div>
                                <div className="col-xs-2 settings__col">
                                  <input
                                    type="checkbox"
                                    checked={
                                      (this.state.professional &&
                                        this.state.professional
                                          .notifyReviews) ||
                                      false
                                    }
                                    name="notifyReviews"
                                    onChange={this.handleCheckBoxChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-md-12">
                              <div className="right">
                                <button
                                  type="submit"
                                  className="button button--default button--primary"
                                  onClick={this.handleSaveButton}
                                >
                                  {this.state.showLoader ? "Saving.." : "Save"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
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

export default HookSettings;
