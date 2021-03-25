import React, {
  useContext,
  useEffect,
  Component,
  useState,
  Suspense,
} from "react";
import { Redirect } from "react-router-dom";

import { API_ROOT_PATH } from "constants/api";
import { ROUTES } from "routes";
import GlobalContext from "contexts/globalContext/GlobalContext";
// import JobDashboardSubNav from "components/ViewJobs/JobDashboard/JobDashboardSubNav";
import { singleJobData } from "components/ViewJobs/JobDashboard/helpers";
import notify from "notifications";

import {
  companyAnalytics,
  professionalsAtStage,
  averageApplicants,
  // jobAnalytics,
  // professionalsAtStagePerJob
} from "components/Analytics/helpers";

import Header from "components/Analytics/AnalyticsHeader";
// import FilterSelector from "./FilterSelector";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import { InnerPageContainer } from "styles/PageContainers";

import download from "downloadjs";
import Spinner from "sharedComponents/Spinner";
import retryLazy from "hooks/retryLazy";

const CompanyStats = React.lazy(() =>
  retryLazy(() => import("components/Analytics/CompanyStats"))
);
const JobStats = React.lazy(() =>
  retryLazy(() => import("components/Analytics/JobStats"))
);
const RoleStats = React.lazy(() =>
  retryLazy(() => import("components/Analytics/RoleStats"))
);
// import VendorStats from "./VendorStats";
const RecruiterStats = React.lazy(() =>
  retryLazy(() => import("components/Analytics/RecruiterStats/RecruiterStats"))
);

const HookAnalytics = (props) => {
  const store = useContext(GlobalContext);
  const [singleJob, setSingleJob] = useState(undefined);
  const [companyAnalyticsData, setCompanyAnalytics] = useState(undefined);
  const [professionalsAtStageData, setProfessionalsAtStage] = useState(
    undefined
  );
  const [averageCount, setAverageCount] = useState(undefined);
  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    if (store.company && store.role) {
      if (props.match.params.jobId) {
        singleJobData(
          this.props.match.params.jobId,
          store.session,
          undefined,
          store.role.team_member.team_member_id,
          signal
        ).then((job) => {
          if (!signal.aborted) {
            setSingleJob(job);
          }
        });
      } else {
        companyAnalytics(
          store.company.id,
          "this month",
          store.session,
          signal
        ).then((data) => {
          if (data !== "err") {
            setCompanyAnalytics(data);
          } else if (!signal.aborted) {
            notify("danger", "Unable to fetch company analytics");
          }
        });
        professionalsAtStage(
          store.company.id,
          "this month",
          "applied",
          store.session,
          signal
        ).then((count) => {
          if (!signal.aborted) {
            setProfessionalsAtStage(count);
          }
        });
        averageApplicants(
          store.company.id,
          "this month",
          store.session,
          signal
        ).then((count) => {
          if (!signal.aborted) {
            setAverageCount(count);
          }
        });
      }
    }
    return () => controller.abort();
     
  }, [store.company, store.session, store.role]);

  return (
    <InnerPage
      pageTitle={`${
        store.company && store.company.name ? store.company.name : ""
      } - Analytics`}
      originName="Analytics"
    >
      <ATSWrapper activeTab="analytics" routeObject={ROUTES.Analytics}>
        <InnerPageContainer>
          <Analytics
            {...props}
            {...store}
            singleJob={singleJob}
            companyAnalytics={companyAnalyticsData}
            professionalsAtStage={professionalsAtStageData}
            averageApplicants={averageCount}
            store={store}
          />
        </InnerPageContainer>
      </ATSWrapper>
    </InnerPage>
  );
};

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: undefined,
      // jobAnalytics: undefined,
      selectedJob: undefined,
      companyAnalytics: undefined,
      professionalsAtStage: undefined,
      averageApplicants: undefined,
      dateBoundary: "today",
      selectedStage: "Applied",
      avgApplicantOption: "Per Job",
      singleJob: undefined,
      expiredTrial: undefined,
      modalView: undefined,
      initialPageLoad: true,
      redirect: undefined,
    };
    this.companyAnalytics = companyAnalytics.bind(this);
    this.professionalsAtStage = professionalsAtStage.bind(this);
    this.averageApplicants = averageApplicants.bind(this);
    // this.jobAnalytics = jobAnalytics.bind(this);
    this.singleJobData = singleJobData.bind(this);
    this.openUpgradeModal = this.openUpgradeModal.bind(this);
  }

  fetchCompantAnalytics = async (company) => {
    await this.companyAnalytics(company.id, "this month").then((data) => {
      if (data !== "err") {
        this.setState({ companyAnalytics: data });
        this.professionalsAtStage(company.id, "this month", "applied").then(
          (count) => {
            this.setState({ professionalsAtStage: count });
          }
        );
        this.averageApplicants(company.id, "this month")
          .then((count) => {
            this.setState({ averageApplicants: count });
          })
          .then(() => this.setState({ initialPageLoad: false }));
      }
    });
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.company &&
      !this.state.expiredTrial &&
      (this.props.company.trial === "active" ||
        this.props.company.trial === "expired")
    ) {
      this.setState({ expiredTrial: true });
    }
    if (
      this.props.role &&
      this.props.role?.role_permissions?.is_member === true &&
      this.props.role?.role_permissions?.recruiter &&
      !this.props.role?.role_permissions?.owner &&
      !this.props.role?.role_permissions?.admin &&
      this.props.match.params.tab !== "recruiter" &&
      this.props.match.params.tab !== "jobs" &&
      this.props.match.params.tab !== "roles"
    ) {
      if (this.props.role?.role_permissions?.manager) {
        this.setState({
          redirect: ROUTES.Analytics.url(
            this.props.match.params.companyMentionTag,
            "roles"
          ),
        });
      } else {
        this.setState({
          redirect: ROUTES.Analytics.url(
            this.props.match.params.companyMentionTag,
            "recruiter"
          ),
        });
      }
    }
    if (
      this.props.companyAnalytics &&
      this.props.averageApplicants &&
      this.props.professionalsAtStage &&
      !this.state.companyAnalytics &&
      !this.state.professionalsAtStage &&
      !this.state.averageApplicants
    ) {
      this.setState({
        companyAnalytics: this.props.companyAnalytics,
        professionalsAtStage: this.props.professionalsAtStage,
        averageApplicants: this.props.averageApplicants,
        initialPageLoad: false,
      });
    }
    if (this.props.singleJob && !this.state.singleJob) {
      this.setState({
        singleJob: this.props.singleJob,
        initialPageLoad: false,
      });
    }

    if (
      this.props.match.params.tab !== prevProps.match.params.tab &&
      this.state.dateBoundary !== "this month"
    ) {
      this.setState({ dateBoundary: "this month" });
    }
    if (this.props.match.params.tab && this.state.redirect) {
      this.setState({ redirect: undefined });
    }
  }

  componentDidMount() {
    if (!this.props.match.params.tab) {
      this.setState({
        redirect: ROUTES.Analytics.url(
          this.props.match.params.companyMentionTag,
          "company"
        ),
      });
    }
    if (
      this.props.match.params.jobId &&
      this.props.match.params.tab !== "jobs"
    ) {
      this.setState({
        redirect: ROUTES.Analytics.url(
          this.props.match.params.companyMentionTag,
          "jobs"
        ),
      });
    } else {
      this.setState({ singleJob: false });
    }
  }

  selectStage(stage) {
    this.setState({ selectedStage: stage });
    this.professionalsAtStage(
      this.props.company.id,
      this.state.dateBoundary,
      stage.toLowerCase()
    ).then((count) => {
      this.setState({ professionalsAtStage: count.professionals_at_stage });
    });
  }

  changeAverageOption(option) {
    this.setState({ avgApplicantOption: option });
    this.averageApplicants(this.props.company.id, this.state.dateBoundary).then(
      (count) => {
        this.setState({ averageApplicants: count.average_applicants });
      }
    );
  }

  async downloadReport() {
    // const res = await fetch(
    //   `${API_ROOT_PATH}/v1/analytics/${this.state.company.id}/candidate_report`,
    //   {
    //     method: "GET",
    //     headers: this.props.session
    //   }
    // );
    // if (res.ok) {
    //   const text = res.text();
    //   text.then(csv => {
    //     download(
    //       csv,
    //       `${this.state.company.name}-${
    //         new Date().toLocaleString().split(",")[0]
    //       }.csv`,
    //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    //     );
    //   });
    // }
    const url =
      API_ROOT_PATH + `/v1/analytics/${this.props.company.id}/candidate_report`;
    fetch(url, {
      method: "GET",
      headers: this.props.session,
    }).then((response) => {
      if (response.ok) {
        response.text().then((csv) => {
          download(
            csv,
            `${this.props.company.name}-${
              new Date().toLocaleString().split(",")[0]
            }.csv`,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
        });
      }
    });
  }

  openUpgradeModal() {
    this.setState({ modalView: "upgradeModal" });
  }

  closeModal() {
    this.setState({ viewModal: undefined, modalView: undefined });
  }

  render() {
    const pathname = window.location.pathname.split("/");

    return (
      <>
        <>
          <>
            <Header
              activeOption={this.props.match.params.tab}
              user={this.props.role.team_member}
              name={this.props.company.name}
              mentionTag={this.props.company.mention_tag}
              avatarUrl={this.props.company.avatar_url}
              type={this.props.company.type}
              jobDashboard={pathname.length !== 5 ? false : true}
              downloadReport={this.downloadReport.bind(this)}
            />
            {this.state.initialPageLoad ? (
              <Spinner style={{ marginTop: "100px" }} />
            ) : (
              <>
                {this.props.match.params.tab === "company" && (
                  <Suspense fallback={<div />}>
                    <CompanyStats
                      company={this.props.company}
                      companyAnalytics={this.state.companyAnalytics}
                      averageApplicants={this.state.averageApplicants}
                      professionalsAtStage={this.state.professionalsAtStage}
                    />
                  </Suspense>
                )}
                {this.props.match.params.tab === "jobs" &&
                  this.state.singleJob !== undefined && (
                    <Suspense fallback={<div />}>
                      <JobStats
                        user={this.props.role.team_member}
                        company={this.props.company}
                        dateBoundary={this.state.dateBoundary}
                        data={this.state.jobAnalytics}
                        jobId={
                          this.state.singleJob ? this.state.singleJob : false
                        }
                      />
                    </Suspense>
                  )}
                {this.props.match.params.tab === "roles" && this.props.role && (
                  <Suspense fallback={<div />}>
                    <RoleStats
                      company={this.props.company}
                      dateBoundary={this.state.dateBoundary}
                      session={this.props.session}
                      teamMembers={this.props.teamMembers}
                      role={this.props.role}
                      store={this.props.store}
                    />
                  </Suspense>
                )}
                {this.props.match.params.tab === "recruiter" && (
                  <Suspense fallback={<div />}>
                    <RecruiterStats
                      company={this.props.company}
                      dateBoundary={this.state.dateBoundary}
                      session={this.props.session}
                      teamMembers={this.props.teamMembers}
                      role={this.props.role}
                    />
                  </Suspense>
                )}
                {/*{this.props.match.params.tab === "vendors" &&
                      this.state.company.type === "Employer" && (
                        <VendorStats
                          company={this.state.company}
                          dateBoundary={this.state.dateBoundary}
                          session={this.props.session}
                          jobId={this.state.singleJob}
                        />
                      )}*/}
              </>
            )}
          </>
        </>
        {this.state.redirect &&
          this.state.redirect !== this.props.location.pathname && (
            <Redirect to={this.state.redirect} />
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

export default HookAnalytics;
