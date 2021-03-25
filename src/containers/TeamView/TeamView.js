import React, {
  lazy,
  Suspense,
  useContext,
  useEffect,
  useState,
  Component,
} from "react";
import { API_ROOT_PATH } from "constants/api";
import { Redirect } from "react-router-dom";
import { fetchDeleteCompany, fetchFullCompanyData } from "helpersV2/company";
import notify from "notifications";

import GlobalContext from "contexts/globalContext/GlobalContext";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import { InnerPageContainer } from "styles/PageContainers";
import TeamViewBanner from "components/TeamView/TeamViewBanner/TeamViewBanner";
import { ROUTES } from "routes";
import { getBillingData } from "components/TeamView/helpers/teamViewHelpers";
import {
  PermissionChecker,
  permissionChecker,
} from "constants/permissionHelpers";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import retryLazy from "hooks/retryLazy";
const CompanyDetailsTab = lazy(() =>
  retryLazy(() =>
    import("components/TeamView/CompanyDetailsTab/CompanyDetailsTab")
  )
);
const BillingTable = lazy(() =>
  retryLazy(() => import("components/TeamView/BillingTable/BillingTable"))
);
const TeamMemberTable = lazy(() =>
  retryLazy(() => import("components/TeamView/TeamMemberTable/TeamMemberTable"))
);
const UserTab = lazy(() =>
  retryLazy(() => import("components/TeamView/User/UserTab"))
);
const Customisation = lazy(() =>
  retryLazy(() => import("components/TeamView/Customisation"))
);
const CheckoutModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/CheckoutModal/CheckoutModalV2"))
);
const InviteToTeamModal = React.lazy(() =>
  retryLazy(() => import("modals/InviteToTeamModal"))
);
const CheckoutModal = React.lazy(() =>
  retryLazy(() => import("modals/CheckoutModal"))
);
const HookTeamView = (props) => {
  const store = useContext(GlobalContext);
  const [billingData, setBillingData] = useState(undefined);
  const [companyData, setCompanyData] = useState();
  const [allVendors, setAllVendors] = useState(undefined);
  const controller = new AbortController();
  const signal = controller.signal;
  const [permission, setPermission] = useState({ view: false, edit: false });
  useEffect(() => {
    if (store.role) {
      setPermission(permissionChecker(store.role?.role_permissions));
    }
  }, [store.role]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (store.company && store.session) {
      fetchFullCompanyData(
        store.session,
        store.company.mention_tag,
        signal
      ).then((res) => {
        if (!res.err) {
          setCompanyData(res);
        } else if (!signal.aborted) {
          notify("danger", res);
        }
      });
    }
    return () => controller.abort();
     
  }, [store.company, store.session]);

  useEffect(() => {
    if (store.company && store.company.type === "Agency" && store.session) {
      const fetchVendors = async () => {
        const url = API_ROOT_PATH + `/v1/clients/${store.company.id}/index`;
        try {
          const getData = await fetch(url, {
            method: `GET`,
            headers: store.session,
          });
          const data = await getData.json();
          return data;
        } catch (err) {
          console.error(`Error getting the list of vendors: ${err}`);
        }
      };

      fetchVendors().then((vendors) => {
        if (vendors && vendors.list) {
          setAllVendors(vendors.list);
        }
      });
    }
  }, [store.company, store.session]);

  useEffect(() => {
    if (
      store.company &&
      store.role &&
      (store.role?.role_permissions?.owner ||
        store.role?.role_permissions?.admin)
    ) {
      getBillingData(store.company.id, store.session, signal).then((data) => {
        if (data !== "err" && data?.card_details && data?.billing_history) {
          setBillingData({
            billingDetails: data.card_details,
            billingHistory: data.billing_history,
          });
        }
      });
    }
    // return () => controller.abort();
     
  }, [store.company, store.role, store.session]);

  return (
    <InnerPage
      pageTitle={
        (store.company && store.company.name ? store.company.name : "") +
        " - Settings"
      }
      originName="Settings"
    >
      <ATSWrapper activeTab="settings" routeObject={ROUTES.TeamView}>
        <InnerPageContainer>
          <TeamView
            {...props}
            {...store}
            billingData={billingData}
            companyData={companyData}
            allVendors={allVendors}
            permission={permission}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </InnerPageContainer>
      </ATSWrapper>
    </InnerPage>
  );
};

class TeamView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: undefined,
      role: undefined,
      billingDetails: undefined,
      billingHistory: undefined,
      initialPageLoad: true,
      showInviteModal: false,
      showUpgradeCompany: false,
    };
    this.handleCompanyDelete = this.handleCompanyDelete.bind(this);
    this.updatePaymentInfo = this.updatePaymentInfo.bind(this);
  }

  handleCompanyDelete(event) {
    event.preventDefault();

    fetchDeleteCompany(this.props.sesssion, this.state.company.id).then(
      (res) => {
        if (!res.err) {
          this.setState({ redirect: ROUTES.MyCompanies.url() });
        } else {
          notify("danger", res);
        }
      }
    );
  }

  componentDidUpdate() {
    if (this.props.companyData && !this.state.company) {
      this.setState({
        company: this.props.companyData,
        initialPageLoad: false,
      });
    }
    if (
      this.props.company &&
      !this.state.showUpgrade &&
      (this.props.company.trial === "active" ||
        this.props.company.trial === "expired")
    ) {
      this.setState({ showUpgrade: true });
    }
    if (
      this.props.role &&
      !this.props.role?.role_permissions?.owner &&
      !this.props.role?.role_permissions?.admin &&
      this.state.initialPageLoad
    ) {
      this.setState({
        redirect: ROUTES.TeamView.url(
          this.props.match.params.companyMentionTag,
          "user"
        ),
        initialPageLoad: false,
      });
    }
    if (this.props.billingData && !this.state.billingDetails) {
      this.setState({
        billingDetails: this.props.billingData.billingDetails,
        billingHistory: this.props.billingData.billingHistory,
      });
    }
    if (this.props.match.params.tab && this.state.redirect) {
      this.setState({ redirect: undefined });
    }
  }

  componentDidMount() {
    let tabOptions = {
      company: true,
      billing: true,
      customisation: true,
      team: true,
      user: true,
    };
    if (!tabOptions[this.props.match.params.tab]) {
      this.setState({
        redirect: ROUTES.TeamView.url(
          this.props.match.params.companyMentionTag,
          "company"
        ),
      });
    }
  }

  setActiveMenuOption(option) {
    this.setState({
      redirect: ROUTES.TeamView.url(
        this.props.match.params.companyMentionTag,
        option
      ),
    });
  }

  updatePaymentInfo(ending, expiringDate) {
    let newPaymentInfo = { ...this.state.billingDetails };
    newPaymentInfo.card_end = ending;
    newPaymentInfo.card_exp = expiringDate;
    this.setState({ billingDetails: newPaymentInfo });
  }

  openUpgradeCompany = () => {
    this.setState({ showUpgradeCompany: true });
  };

  closeUpgradeCompany = () => {
    this.setState({ showUpgradeCompany: false });
  };

  handleInviteClick = () => {
    if (!this.props.pricingPlan) {
      return this.openUpgradeCompany();
    }
    if (this.props.teamMembers?.length >= this.props.pricingPlan.total_seats) {
      return this.openUpgradeCompany();
    }
    return this.setState({ showInviteModal: true });
  };

  renderDeleteModal() {
    if (this.props.session) {
      return (
        <div id="deleteModal" className="modal fade" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close">
                  &times;
                </button>
                <h4 className="modal-title">Close Company</h4>
              </div>
              <div className="modal-body">
                <p>
                  {`Oh no! We're sorry that you want to delete your company, we do
                  need to let you know all your activity, posts, content, job
                  applications and data will be deleted if you proceed. This
                  means you'll miss out on being found by the highly relevant
                  details. We hope that you'll stay but if you want to continue
                  please confirm below.`}
                </p>
              </div>
              <div className="modal-footer">
                <div className="row">
                  <div className="col-xs-6">
                    <button
                      type="button"
                      onClick={this.handleCompanyDelete}
                      className="button button--default button--primary button--full"
                    >
                      Confirm Close Company
                    </button>
                  </div>
                  <div className="col-xs-6">
                    <button
                      type="button"
                      className="button button--default button--grey-light button--full"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <>
        {this.state.redirect &&
          this.props.location.pathname !== this.state.redirect && (
            <Redirect to={this.state.redirect} />
          )}
        {this.props.company && (
          <>
            <>
              <TeamViewBanner
                activeMenuOption={this.props.match.params.tab}
                company={this.props.company}
                session={this.props.session}
                role={this.props.role}
                teamMembers={this.props.teamMembers}
                searchValue={this.props.searchValue}
                setSearchValue={this.props.setSearchValue}
                match={this.props.match}
              />
              {this.state.initialPageLoad ? (
                <>
                  <Spinner style={{ marginTop: "100px" }} />
                </>
              ) : (
                <React.Fragment>
                  {this.props.teamMembers && (
                    <React.Fragment>
                      {this.props.teamMembers &&
                        this.props.match.params.tab === "team" && (
                          <ATSContainer>
                            <Suspense fallback={<Spinner />}>
                              <>
                                <PermissionChecker type="view">
                                  <div style={{ textAlign: "right" }}>
                                    <button
                                      className="button button--default button--blue-dark"
                                      onClick={this.handleInviteClick}
                                    >
                                      Invite to Team
                                    </button>
                                  </div>
                                </PermissionChecker>
                                <TeamMemberTable
                                  session={this.props.session}
                                  company={this.props.company}
                                  teamMembers={this.props.teamMembers}
                                  allVendors={this.props.allVendors}
                                  searchValue={this.props.searchValue}
                                />
                              </>
                            </Suspense>
                          </ATSContainer>
                        )}
                      {this.props.permission.edit &&
                        this.props.match.params.tab === "billing" && (
                          <ATSContainer>
                            <Suspense fallback={<Spinner />}>
                              <BillingTable
                                paymentInfo={this.state.billingDetails}
                                billingHistory={this.state.billingHistory}
                                companyId={this.props.company.id}
                                company={this.state.company}
                                setParentState={this.setState.bind(this)}
                                state={this.state}
                                setActiveMenuOption={this.setActiveMenuOption.bind(
                                  this
                                )}
                                session={this.props.session}
                                updatePaymentInfo={this.updatePaymentInfo}
                              />
                            </Suspense>
                          </ATSContainer>
                        )}
                      {this.props.teamMembers &&
                        this.props.match.params.tab === "company" && (
                          <ATSContainer>
                            <Suspense fallback={<Spinner />}>
                              <CompanyDetailsTab
                                state={this.state}
                                session={this.props.session}
                                dispatch={this.props.dispatch}
                                store={this.props}
                                permission={this.props.permission}
                              />
                            </Suspense>
                          </ATSContainer>
                        )}
                      {this.props.match.params.tab === "user" && (
                        <Suspense fallback={<Spinner />}>
                          <UserTab
                            company={this.props.company}
                            session={this.props.session}
                          />
                        </Suspense>
                      )}
                      {this.props.match.params.tab === "customisation" && (
                        <ATSContainer>
                          <Suspense fallback={<Spinner />}>
                            <Customisation />
                          </Suspense>
                        </ATSContainer>
                      )}
                      {/*this.renderDeleteModal()*/}
                      {this.state.showInviteModal && (
                        <Suspense fallback={<div />}>
                          <InviteToTeamModal
                            show={this.state.showInviteModal}
                            onHide={() =>
                              this.setState({ showInviteModal: false })
                            }
                          />
                        </Suspense>
                      )}
                      {this.state.showPricingModal && (
                        <Suspense fallback={<div />}>
                          <CheckoutModal
                            show={this.state.showPricingModal}
                            onHide={() =>
                              this.setState({ showPricingModal: false })
                            }
                          />
                        </Suspense>
                      )}
                      {this.state.showUpgradeCompany && (
                        <Suspense fallback={<div />}>
                          <CheckoutModalV2
                            closeModal={this.closeUpgradeCompany}
                            useV2={!this.props.pricingPlan}
                          />
                        </Suspense>
                      )}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </>
          </>
        )}
        {this.state.redirectToCompanies && (
          <Redirect to={ROUTES.MyCompanies.url()} />
        )}
        {this.state.redirectToLogin && (
          <Redirect to={ROUTES.ProfessionalSignin.url()} />
        )}
      </>
    );
  }
}

export default HookTeamView;
