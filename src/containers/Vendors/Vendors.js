import React, {
  useEffect,
  useState,
  useContext,
  Component,
  Suspense,
} from "react";
import { Redirect } from "react-router-dom";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { ROUTES } from "routes";

import {
  vendorIndex,
  clientIndex,
  addVendor,
  addClient,
  searchVendors,
  searchClients,
} from "components/Vendors/helpers/vendorsHelpers";

import { AWS_CDN_URL } from "constants/api";

import EmptyContainer from "sharedComponents/EmptyContainer";
import Banner from "components/Vendors/components/VendorsBanner";
import Table from "components/Vendors/components/VendorsTable";
import ArchivedVendors from "components/Vendors/components/VendorsTable/ArchivedVendors";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import { InnerPageContainer } from "styles/PageContainers";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import retryLazy from "hooks/retryLazy";
const AddAgency = React.lazy(() =>
  retryLazy(() => import("components/Vendors/components/AddAgency"))
);
let timeOut = null;

const HookVendors = (props) => {
  const store = useContext(GlobalContext);
  const [vendors, setVendors] = useState(undefined);
  const [redirect, setRedirect] = useState(undefined);
  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    if (
      store.company &&
      store.company.type === "Agency" &&
      !store.company.invited_by_employer
    ) {
      setRedirect(ROUTES.ClientManager.url(store.company.mention_tag, "deals"));
    }
  }, [store.company]);

  useEffect(() => {
    if (store.company) {
      if (store.company.type !== "Agency") {
        vendorIndex(store.company.id, 1, store.session, signal).then(
          (vendors) => {
            if (vendors !== "err" && vendors) {
              let moreVendors = vendors.total > vendors.list.length;
              setVendors({
                vendorsList: vendors.list,
                vendorsTotal: vendors.total,
                hasMoreData: moreVendors,
              });
            }
          }
        );
      } else {
        clientIndex(store.company.id, 1, store.session, false, signal).then(
          (clients) => {
            if (clients !== "err") {
              let moreVendors =
                clients.total > clients.list.length ? true : false;
              setVendors({
                vendorsList: clients.list,
                vendorsTotal: clients.total,
                hasMoreData: moreVendors,
              });
            }
          }
        );
      }
    }
    return () => controller.abort();
  }, [store.company, store.session]);

  return (
    <InnerPage
      pageTitle={`${
        store.company && store.company.name ? store.company.name : "Loading..."
      } - ${
        store.company && store.company.type === "Employer"
          ? "Agencies"
          : "Clients"
      }`}
      originName={
        store.company
          ? store.company.type === "Employer"
            ? "Agencies"
            : "Clients"
          : undefined
      }
    >
      <ATSWrapper activeTab="vendors" routeObject={ROUTES.Vendors}>
        <InnerPageContainer>
          {redirect && redirect !== props.location.pathname && (
            <Redirect to={redirect} />
          )}
          <Vendors {...props} {...store} vendors={vendors} />
        </InnerPageContainer>
      </ATSWrapper>
    </InnerPage>
  );
};

class Vendors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenuOption: "active",
      vendorsList: undefined,
      vendorTotal: 0,
      activeModal: null,
      searched: false,
      vendorProfileId: undefined,
      editProfile: false,
      vendorIndex: undefined,
      shouldUpdate: false,
      page: 1,
      hasMoreData: false,
      expiredTrial: undefined,
      modalView: undefined,
      vendorTypePlural: undefined,
      vendorType: undefined,
      modalId: null,
      initialPageLoad: true,
      filteringVendors: false,
      redirect: undefined,
    };
    this.vendorIndex = vendorIndex.bind(this);
    this.clientIndex = clientIndex.bind(this);
    this.addVendor = addVendor.bind(this);
    this.addClient = addClient.bind(this);
    this.searchVendors = searchVendors.bind(this);
    this.searchClients = searchClients.bind(this);
    this.openUpgradeModal = this.openUpgradeModal.bind(this);
  }

  setVendorProps = (company) => {
    this.setState({
      vendorTypePlural: company.type === "Employer" ? "Agencies" : "Clients",
      vendorType: company.type === "Employer" ? "Agency" : "Client",
      modalId: company.type === "Employer" ? "addAgency" : "addClient",
    });
  };

  componentDidMount() {
    if (!this.props.match.params.tab) {
      this.setState({
        redirect: ROUTES.Vendors.url(
          this.props.match.params.companyMentionTag,
          "active"
        ),
      });
    }
  }

  componentDidUpdate() {
    if (this.props.company && !this.state.vendorTypePlural) {
      this.setVendorProps(this.props.company);
    }
    if (
      this.props.company &&
      !this.state.expiredTrial &&
      (this.props.company.trial === "active" ||
        this.props.company.trial === "expired")
    ) {
      this.setState({ expiredTrial: true });
    }
    if (this.props.vendors && !this.state.vendorsList) {
      this.setState({
        vendorsList: this.props.vendors.vendorsList,
        vendorsTotal: this.props.vendors.vendorsTotal,
        hasMoreData: this.props.vendors.hasMoreData,
        initialPageLoad: false,
      });
    }
    if (this.props.match.params.tab && this.state.redirect) {
      this.setState({ redirect: undefined });
    }
  }

  shouldComponentUpdate = () => {
    if (this.state.shouldUpdate) {
      return true;
    }
    return true;
  };

  setShouldUpdate = (value) => {
    this.setState({ shouldUpdate: value });
    this.collectData(
      this.props.company.id,
      this.props.company.type,
      this.state.page
    );
  };

  collectData = async (id, type, page) => {
    if (type !== "Agency") {
      await this.vendorIndex(id, page).then((vendors) => {
        if (vendors !== "err" && vendors) {
          let moreVendors = vendors.total > vendors.list.length;
          this.setState({
            vendorsList: vendors.list,
            vendorsTotal: vendors.total,
            hasMoreData: moreVendors,
            filteringVendors: false,
          });
        }
      });
    } else {
      await this.clientIndex(id, page).then((clients) => {
        if (clients !== "err") {
          let moreVendors = clients.total > clients.list.length ? true : false;
          this.setState({
            vendorsList: clients.list,
            vendorsTotal: clients.total,
            hasMoreData: moreVendors,
            filteringVendors: false,
          });
        }
      });
    }
  };

  collectMoreData = (id, type, page) => {
    if (type !== "Agency") {
      this.vendorIndex(id, page).then((newVendors) => {
        if (newVendors !== "err") {
          this.setState({
            vendorsList: [...this.state.vendorsList, ...newVendors.list],
          });
          if (
            newVendors.total === newVendors.list.length ||
            (this.state.vendorsList &&
              this.state.vendorsList.length === newVendors.total)
          )
            this.setState({ hasMoreData: false });
        }
      });
    } else {
      this.clientIndex(id, page).then((newClients) => {
        if (newClients !== "err") {
          this.setState({
            vendorsList: [...this.state.vendorsList, ...newClients.list],
          });
          if (
            newClients.total === newClients.list.length ||
            (this.state.vendorsList &&
              this.state.vendorsList.length === newClients.total)
          )
            this.setState({ hasMoreData: false });
        }
      });
    }
  };

  loadMoreData = () => {
    let nextPage = this.state.page + 1;
    this.collectMoreData(
      this.props.company.id,
      this.props.company.type,
      nextPage
    );
    this.setState({ page: this.state.page + 1 });
  };

  inviteAgency(client) {
    if (client === null || client === undefined || typeof client === "string") {
      return;
    }
    const companyId = this.props.company.id;
    const clientId = client.id;
    if (client) {
      this.addVendor(companyId, clientId).then((response) => {
        if (response !== "err" && !response.message) {
          let vendors = this.state.vendorsList;
          if (!vendors) {
            vendors = response;
          } else {
            vendors = response.concat(vendors);
          }
          this.setState({ vendorsList: vendors });
          this.closeModal();
        }
      });
    } else console.error(`Unable to get the client data from the server.`);
  }

  createClient(payload) {
    const companyId = this.props.company.id;
    this.addClient(companyId, payload).then((response) => {
      if (response !== "err" && !response.message) {
        let vendors = this.state.vendorsList;
        if (!vendors) {
          vendors = response;
        } else {
          vendors = response.concat(vendors);
        }
        this.setState({ vendorsList: vendors });
        this.closeModal();
      }
    });
  }

  openModal(modalId) {
    this.setState({ activeModal: modalId });
  }

  openUpgradeModal() {
    this.setState({ modalView: "upgradeModal" });
  }

  closeModal() {
    this.setState({
      activeModal: null,
      viewModal: undefined,
      modalView: undefined,
    });
  }

  search(search) {
    this.setState({ filteringVendors: true });
    if (this.state.vendorsList.length > 0 || this.state.searched) {
      const func =
        this.props.company.type === "Agency"
          ? this.searchClients
          : this.searchVendors;
      const comp = this.props.company;
      const setState = this.setState.bind(this);
      clearTimeout(timeOut);
      // Make a new timeout set to go off in 500ms
      if (search.length > 2) {
        timeOut = setTimeout(function () {
          func(comp.id, search).then((response) => {
            setState({
              vendorsList: response,
              searched: true,
              filteringVendors: false,
            });
          });
        }, 500);
      } else if (search.length === 0) {
        this.collectData(comp.id, comp.type);
        this.setState({ searched: false });
      }
    }
  }

  setActiveMenuOption(option) {
    window.history.pushState(
      option,
      "option",
      ROUTES.Vendors.url(this.props.match.params.companyMentionTag, option)
    );
    this.setState({ activeMenuOption: option });
  }

  render() {
    return (
      <>
        {this.state.redirect &&
          this.state.redirect !== this.props.location.pathname && (
            <Redirect to={this.state.redirect} />
          )}
        {this.props.company && (
          <>
            <>
              <>
                <Banner
                  activeMenuOption={this.props.match.params.tab}
                  company={this.props.company}
                  session={this.props.session}
                  addVendor={this.addVendor}
                  openModal={this.openModal.bind(this)}
                  search={this.search.bind(this)}
                />
                <ATSContainer>
                  {this.state.initialPageLoad ? (
                    <Spinner style={{ marginTop: "100px" }} />
                  ) : (
                    <>
                      {this.state.filteringVendors ? (
                        <Spinner />
                      ) : (
                        <>
                          {this.state.vendorsList &&
                          this.state.vendorsList.length > 0 &&
                          this.props.match.params.tab === `active` ? (
                            <>
                              <Table
                                vendors={this.state.vendorsList}
                                hasMorePages={this.state.hasMoreData}
                                loadMoreData={this.loadMoreData}
                                companyType={this.props.company.type}
                                company={this.props.company}
                              />
                            </>
                          ) : this.state.searched ? (
                            <>
                              <Table
                                vendors={this.state.vendorsList}
                                hasMorePages={this.state.hasMoreData}
                                loadMoreData={this.loadMoreData}
                                companyType={this.props.company.type}
                                company={this.props.company}
                              />
                            </>
                          ) : this.props.match.params.tab === `archived` ? (
                            <>
                              <ArchivedVendors
                                companyType={this.props.company.type}
                                company={this.props.company}
                                session={this.props.session}
                              />
                            </>
                          ) : (
                            this.state.vendorsList &&
                            !this.state.vendorsList.length && (
                              <EmptyContainer
                                image={`${AWS_CDN_URL}/icons/empty-icons/empty-team.svg`}
                                title={`You currently have no ${this.state.vendorTypePlural}`}
                                text={`Click below to add your first ${this.state.vendorType}.`}
                                buttonText={`Add ${this.state.vendorType}`}
                                buttonAction={() =>
                                  this.openModal(this.state.modalId)
                                }
                              />
                            )
                          )}
                        </>
                      )}
                    </>
                  )}
                </ATSContainer>
              </>
            </>
            {this.state.activeModal && this.state.activeModal === "addAgency" && (
              <>
                <Suspense fallback={<div />}>
                  <AddAgency
                    closeModal={this.closeModal.bind(this)}
                    inviteAgency={this.inviteAgency.bind(this)}
                    createClient={this.createClient.bind(this)}
                    companyType={this.props.company.type}
                    session={this.props.session}
                    company={this.props.company}
                    forceUpdate={this.setShouldUpdate}
                  />
                </Suspense>
              </>
            )}
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

  shouldRender() {
    return true;
  }
}

export default HookVendors;
