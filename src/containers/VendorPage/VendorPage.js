import React, {
  lazy,
  Suspense,
  Component,
  useState,
  useEffect,
  useContext,
} from "react";
import { ROUTES } from "routes";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import GlobalContext from "contexts/globalContext/GlobalContext";
// Components
import Header from "components/VendorPage/components/Header";
// Helpers
import vendorHelpers from "helpers/vendorPage/vendorPage.helpers";
import { fetchInterviewStages } from "helpersV2/interviews";
import notify from "notifications";
// import companyHelpers from "helpers/company/company.helpers";
// import sharedHelpers from "helpers/sharedHelpers";
//  Styles
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { AWS_CDN_URL } from "constants/api";
// import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
// Constants
import { API_ROOT_PATH } from "constants/api";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import { InnerPageContainer } from "styles/PageContainers";

import { searchJobs } from "helpersV2/jobs";
import Spinner from "sharedComponents/Spinner";
import retryLazy from "hooks/retryLazy";

const AsyncOverview = lazy(() =>
  retryLazy(() => import(`components/VendorPage/components/VendorOverview`))
);
const AsyncJobs = lazy(() =>
  retryLazy(() => import(`components/VendorPage/components/JobsTable`))
);
// const AsyncCandidates = lazy(() => retryLazy(()=> ) import("./components/CandidatesTable"));
const AsyncAnalitics = lazy(() =>
  retryLazy(() => import(`components/VendorPage/components/VendorAnalytics`))
);
const AsyncNotes = lazy(() =>
  retryLazy(() => import(`components/VendorPage/components/VendorNotes`))
);
const VendorTalentNetwork = lazy(() =>
  retryLazy(() =>
    import(`components/VendorPage/components/VendorTalentNetwork`)
  )
);
// Modals
const EditVendorProfile = lazy(() =>
  retryLazy(() => import("components/VendorPage/components/EditVendorProfile"))
);
const ConfirmModalV2 = lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);
const CheckoutModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/CheckoutModal/CheckoutModalV2"))
);

const VendorContainer = styled.div`
  width: 100%;
`;

const HookVendorPage = (props) => {
  const store = useContext(GlobalContext);
  const [vendor, setVendor] = useState(undefined);
  const [vendorNotes, setVendorNotes] = useState(undefined);
  const [vendorAnalytics, setVendorAnalytics] = useState(undefined);
  const [initialPageLoad, setInitialPageLoad] = useState(true);
  const [clientStages, setClientStages] = useState(undefined);
  const [errorVendor, setErrorVendor] = useState(false);
  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    if (store.company && props.match.params.vendorId && store.session) {
      let subject = store.company.type === `Employer` ? `vendors` : `clients`;
      vendorHelpers
        .fetchVendorProfile(
          subject,
          store.company.id,
          props.match.params.vendorId,
          store.session,
          signal
        )
        .then((res) => {
          if (res && !res.errors) {
            setVendor(res);
            setInitialPageLoad(false);
          } else {
            setErrorVendor(true);
          }
        });
      vendorHelpers
        .fetchVendorAnalytics(
          store.company.id,
          props.match.params.vendorId,
          store.session,
          "this year",
          signal
        )
        .then((response) => {
          if (response !== "err") {
            setVendorAnalytics(response);
            setInitialPageLoad(false);
          }
        });
      vendorHelpers
        .fetchVendorNotes(
          store.session,
          store.company.id,
          props.match.params.vendorId,
          signal
        )
        .then((res) => {
          if (res && !res.message) {
            setVendorNotes(res);
          }
        });
      if (store.company.type === "Agency") {
        fetchInterviewStages(store.session, props.match.params.vendorId).then(
          (res) => {
            if (!res.err) {
              setClientStages(res);
            } else {
              notify("danger", "Unable to fetch client stages");
            }
          }
        );
      }
    }
    return () => controller.abort();
  }, [store.company, props.match.params.vendorId, store.session]);

  return (
    <InnerPage
      pageTitle={`${
        store.company && store.company.name ? store.company.name : ""
      } - ${
        store.company && store.company.type === "Employer"
          ? "Agencies"
          : "Clients"
      }`}
      originName={vendor?.name}
    >
      <ATSWrapper
        activeTab={props.match.params.tab || "overview"}
        routeObject={ROUTES.VendorPage}
      >
        <InnerPageContainer>
          {!errorVendor ? (
            <VendorPage
              {...props}
              {...store}
              vendor={vendor}
              vendorNotes={vendorNotes}
              vendorAnalytics={vendorAnalytics}
              initialPageLoad={initialPageLoad}
              clientStages={clientStages}
            />
          ) : (
            <div style={{ marginTop: "50px" }}>
              <div className={sharedStyles.emptyContainer}>
                <div className={sharedStyles.empty}>
                  <img src={`${AWS_CDN_URL}/icons/empty-icons/empty-team.svg`} alt="not found illustration" />
                  <h2>404 Not Found</h2>
                  <p>
                    Were sorry the page your looking for cannot be found, click
                    below to head back to the dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}
        </InnerPageContainer>
      </ATSWrapper>
    </InnerPage>
  );
};

class VendorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: {},
      vendor: {},
      vendorAnalytics: {},
      activities: [],
      notes: undefined,
      hasMoreActivities: true,
      pageCount: 1,
      tnProfileId: null,
      activeModal: null,
      vendorId: props.match.params.vendorId,
      jobsSearchPending: false,
      searchedJobs: null,
      showSearchedResults: false,
      pipelineViewEnabled: false,
    };

    this.jobsSearchTimeout = null;
  }

  componentDidUpdate() {
    if (this.props.vendor && Object.entries(this.state.vendor).length === 0) {
      this.setState({ vendor: this.props.vendor });
    }
    if (
      this.props.vendorAnalytics &&
      Object.entries(this.state.vendorAnalytics).length === 0
    ) {
      this.setState({ vendorAnalytics: this.props.vendorAnalytics });
    }
    if (this.props.vendorNotes && !this.state.notes) {
      this.setState({ notes: this.props.vendorNotes });
    }
  }

  fetchVendorData = (subject, company, vendorId, session) => {
    vendorHelpers
      .fetchVendorProfile(subject, company.id, vendorId, session)
      .then((vendor) => this.setState({ vendor }));
  };

  // fetchVendorAnalytics = (company, vendorId, session) => {
  //   vendorHelpers
  //     .fetchVendorAnalytics(company.id, vendorId, session)
  //     .then(response => {
  //       if (response !== "err") {
  //         this.setState({ vendorAnalytics: response });
  //       }
  //     });
  // };

  fetchVendorActivities = async (pageCount, session, vendorId) => {
    if (this.state.activities.length === 0) {
      await vendorHelpers
        .fetchVendorActivities(pageCount, session, vendorId)
        .then((data) => {
          if (data) {
            this.setState({
              activities: data.interactions,
              total: data.total,
              pageCount: this.state.pageCount + 1,
            });
          }
        });
    }
  };

  fetchAllData = async () => {
    const { pageCount } = this.state;
    await this.fetchVendorActivities(
      pageCount,
      this.props.session,
      this.props.match.params.vendorId
    );
  };

  componentDidMount = () => {
    this.fetchAllData();
  };

  loadMoreActivities = () => {
    const { activities, pageCount } = this.state;
    vendorHelpers
      .fetchVendorActivities(
        pageCount,
        this.props.session,
        this.props.match.params.vendorId
      )
      .then((newActivities) => {
        this.setState({
          activities: [...activities, ...newActivities.interactions],
          pageCount: pageCount + 1,
        });
        if (newActivities.interactions.length === newActivities.total)
          this.setState({ hasMoreActivities: false });
      });
  };

  openModal = (id) => this.setState({ activeModal: id });

  closeModal = () => this.setState({ activeModal: null });

  archiveCompany = async () => {
    const url = `${API_ROOT_PATH}/v1/companies/soft_delete`;
    const params = {
      method: `POST`,
      headers: this.props.session,
      body: JSON.stringify({ ids: [this.state.vendorId] }),
    };
    try {
      const getData = await fetch(url, params);
      return await getData.json();
    } catch (err) {
      console.error(`Error getting archived vendors: ${err}`);
    } finally {
      this.fetchAllData();
      this.closeModal();
    }
  };

  restoreCompany = async () => {
    const url = `${API_ROOT_PATH}/v1/companies/${this.state.vendorId}/restore_archived`;
    const params = { method: `GET`, headers: this.props.session };
    try {
      const getData = await fetch(url, params);
      return await getData.json();
    } catch (err) {
      console.error(
        `An error occured while trying to un-archive the client: ${err}`
      );
    } finally {
      this.fetchAllData();
      this.closeModal();
    }
  };

  handleHardDelete = async (callback) => {
    const url = `${API_ROOT_PATH}/v1/companies/${this.state.vendorId}/hard_delete`;
    const params = { method: `GET`, headers: this.props.session };
    try {
      const getData = await fetch(url, params);
      return await getData.json();
    } catch (err) {
      console.error(`Error deleting a company: ${err}`);
    } finally {
      callback();
    }
  };

  handleDelayedJobSearchReq = async (jobTitle) => {
    this.setState({ jobsSearchPending: true });
    const searchResult = await searchJobs(
      this.props.company.id,
      jobTitle,
      this.props.session,
      this.props.match.params.vendorId
    );
    if (!searchResult.error) {
      return this.setState({
        searchedJobs: searchResult,
        showSearchedResults: true,
        jobsSearchPending: false,
      });
    }
    return this.setState({ jobsSearchPending: false });
  };

  handleSearchKeyUp = (jobTitle) => {
    clearTimeout(this.jobsSearchTimeout);
    if (jobTitle.length <= 2)
      return this.setState({ searchedJobs: null, showSearchedResults: false });
    this.jobsSearchTimeout = setTimeout(
      () => this.handleDelayedJobSearchReq(jobTitle),
      750
    );
  };

  togglePipelineView = (bool) => () =>
    this.setState({ pipelineViewEnabled: !bool });

  render() {
    const {
      openModal,
      closeModal,
      archiveCompany,
      handleSearchKeyUp,
      loadMoreActivities,
      togglePipelineView,
    } = this;
    const {
      vendor,
      activeModal,
      activities,
      hasMoreActivities,
      vendorAnalytics,
      notes,
      pipelineViewEnabled,
    } = this.state;

    return (
      <>
        {vendor && vendor.name && vendor.name.length > 0 && (
          <>
            {this.props.match.params.tab !== "candidates" && (
              <Header
                company={this.props.company}
                vendor={vendor}
                viewMode={this.props.match.params.tab || "overview"}
                openModal={openModal}
                handleSearchKeyUp={handleSearchKeyUp}
                togglePipelineView={togglePipelineView}
                pipelineViewEnabled={pipelineViewEnabled}
              />
            )}
            {this.props.initialPageLoad ? (
              <Spinner />
            ) : (
              <VendorContainer>
                {(!this.props.match.params.tab ||
                  this.props.match.params.tab === "overview") && (
                  <Suspense fallback={<Spinner />}>
                    <AsyncOverview
                      activities={activities}
                      company={this.props.company}
                      hasMoreActivities={hasMoreActivities}
                      loadMoreActivities={loadMoreActivities}
                      vendor={this.state.vendor}
                      vendorAnalytics={vendorAnalytics}
                      vendorId={this.props.match.params.vendorId}
                      session={this.props.ession}
                    />
                  </Suspense>
                )}
                {this.props.match.params.tab === "jobs" && (
                  <Suspense fallback={<Spinner />}>
                    <AsyncJobs
                      company={this.props.company}
                      searchedJobs={this.state.searchedJobs}
                      session={this.props.session}
                      vendor={this.state.vendor}
                      vendorId={this.props.match.params.vendorId}
                      jobsSearchPending={this.state.jobsSearchPending}
                      pipelineViewEnabled={pipelineViewEnabled}
                    />
                  </Suspense>
                )}
                {this.props.match.params.tab === "candidates" && (
                  <Suspense fallback={<Spinner />}>
                    <VendorTalentNetwork
                      company={this.props.company}
                      state={this.state}
                      vendor={vendor}
                      vendorId={this.props.match.params.vendorId}
                      tnProfileId={this.props.match.params.tnProfileId}
                      openParentModal={openModal}
                    />
                  </Suspense>
                )}
                {this.props.match.params.tab === "analytics" && (
                  <Suspense fallback={<Spinner />}>
                    <AsyncAnalitics
                      company={this.props.company}
                      vendorAnalytics={vendorAnalytics}
                    />
                  </Suspense>
                )}
              </VendorContainer>
            )}
            {this.props.match.params.tab === "notes" && (
              <Suspense fallback={<Spinner />}>
                <AsyncNotes
                  company={this.props.company}
                  session={this.props.session}
                  user={this.props.user}
                  vendor={vendor}
                  vendorId={this.props.match.params.vendorId}
                  teamMembers={this.props.teamMembers}
                  notes={notes}
                  setNotes={(notesArr) => {
                    this.setState({ ...this.state, notes: notesArr });
                  }}
                  professional={this.props.role && this.props.role.team_member}
                />
              </Suspense>
            )}
            {activeModal === `EditVendorProfile` && (
              <Suspense fallback={<div />}>
                <EditVendorProfile
                  vendor={vendor}
                  session={this.props.session}
                  closeModal={closeModal}
                  vendorId={this.props.match.params.vendorId}
                  company={this.props.company}
                  handleHardDelete={this.handleHardDelete}
                  companyTag={this.props.match.params.companyMentionTag}
                  archiveCompany={this.archiveCompany}
                  fetchVendorData={this.fetchVendorData}
                />
              </Suspense>
            )}
            {activeModal === `confirmation` && !vendor.archived && (
              <Suspense fallback={<div />}>
                <ConfirmModalV2
                  show={true}
                  hide={closeModal}
                  header={`Archive ${
                    this.props.company.type === "Employer" ? "Agency" : "Client"
                  }`}
                  text={`Are you sure you wanna archive this ${
                    this.props.company.type === "Employer" ? "Agency" : "Client"
                  }? You will still have access to the ${
                    this.props.company.type === "Employer" ? "Agency" : "Client"
                  }'s data.`}
                  actionText="Archive"
                  actionFunction={archiveCompany}
                />
              </Suspense>
            )}
            {activeModal === `confirmation` && vendor.archived && (
              <Suspense fallback={<div />}>
                <ConfirmModalV2
                  show={true}
                  hide={this.closeModal}
                  header={`Restore ${
                    this.props.company.type === "Employer" ? "Agency" : "Client"
                  }`}
                  text={`Are you sure you wanna restore this ${
                    this.props.company.type === "Employer" ? "Agency" : "Client"
                  }?`}
                  actionText="Restore"
                  actionFunction={this.restoreCompany}
                />
              </Suspense>
            )}
            {activeModal === "UpgradeModal" && (
              <Suspense fallback={<div />}>
                <CheckoutModalV2 closeModal={this.closeModal} />
              </Suspense>
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
}

export default HookVendorPage;
