import React, { useContext, useState, useEffect, Suspense } from "react";
import { Redirect } from "react-router-dom";
import GlobalContext from "contexts/globalContext/GlobalContext";
import TalentNetworkBanner from "components/TalentNetwork/components/TalentNetworkBanner/TalentNetworkBanner";
import { ROUTES } from "routes";
// import TalentNetworkFilter from "./components/TalentNetworkFilter/TalentNetworkFilter";
import TalentNetworkTable from "components/TalentNetwork/components/TalentNetworkTable/TalentNetworkTable";
import FilterV2 from "sharedComponents/filterV2";

import sharedHelpers from "helpers/sharedHelpers";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { permissionChecker } from "constants/permissionHelpers";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import { InnerPageContainer } from "styles/PageContainers";
import { fetchNetwork } from "helpersV2/candidates";
import notify from "notifications";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import retryLazy from "hooks/retryLazy";
import TalentNetworkActionBar from "components/TalentNetwork/components/TalentNetworkActionBar";
import { EmptyContacts } from "assets/svg/EmptyImages";
const EmptyTab = React.lazy(() =>
  retryLazy(() => import("components/Profiles/components/EmptyTab"))
);
const AddTalentModal = React.lazy(() =>
  retryLazy(() =>
    import("components/TalentNetwork/components/AddTalent/AddTalentModal")
  )
);

const SLICE_LENGTH = 20;

const ATSDifferentiator = (props) => {
  return (
    <>
      {!props.as_component ? (
        <InnerPage
          pageTitle={
            (props.store.company && props.store.company.name
              ? props.store.company.name
              : "") + " - Talent Network"
          }
          originName="Candidates"
        >
          <ATSWrapper
            activeTab="TalentNetwork"
            routeObject={ROUTES.TalentNetwork}
          >
            <InnerPageContainer
              onDrop={props.onDrop}
              onDragOver={props.onDragOver}
            >
              {props.children}
            </InnerPageContainer>
          </ATSWrapper>
        </InnerPage>
      ) : (
        <>{props.children}</>
      )}
    </>
  );
};

const TalentNetwork = (props) => {
  const store = useContext(GlobalContext);
  //NETWORK
  const [network, setNetwork] = useState(undefined);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  //UI
  const [activeModal, setActiveModal] = useState(undefined);
  //JOBS
  const [companyJobs, setCompanyJobs] = useState(undefined);
  //FUNCTIONALITY
  const [redirect, setRedirect] = useState(undefined);
  const [initialPageLoad, setInitialPageLoad] = useState(true);
  const controller = new AbortController();
  const signal = controller.signal;
  const [update, triggerUpdate] = useState(undefined);
  const [networkLoading, setNetworkLoading] = useState(true);
  const [permission, setPermission] = useState({ view: false, edit: false });
  const [parentFiles, setParentFiles] = useState(undefined);
  const [totalResults, setTotalResults] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const [selectedJob, setSelectedJob] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  useEffect(() => {
    if (store.role) {
      setPermission(
        permissionChecker(store.role?.role_permissions, {
          recruiter: true,
          hiring_manager: true,
        })
      );
    }
  }, [store.role]);
  //FETCH COMPANY CANDIDATES
  useEffect(() => {
    if (store.company && store.role && permission.view) {
      setNetworkLoading(true);
      fetchNetwork(
        store.session,
        store.company.id,
        {
          ...filters,
          slice: [0, SLICE_LENGTH],
          operator: "and",
          id: props.elastic_ids,
          search: search?.length > 0 ? [search] : undefined,
          team_member_id: store.role.team_member.team_member_id,
        },
        signal
      ).then((talentNetwork) => {
        if (!talentNetwork.err) {
          setNetwork(talentNetwork.results);
          setTotalResults(talentNetwork.total);
          setInitialPageLoad(false);
          setNetworkLoading(false);
        } else if (!signal.aborted) {
          notify("danger", talentNetwork);
        }
      });
    }
    return () => controller.abort();
  }, [
    store.company,
    store.role,
    store.session,
    filters,
    update,
    props.elastic_ids,
    search,
    permission,
  ]);

  //LOAD MORE CANDIDATES
  const fetchMore = () => {
    setLoadingMore(true);
    fetchNetwork(
      store.session,
      store.company.id,
      {
        ...filters,
        slice: [network.length, SLICE_LENGTH],
        operator: "and",
        id: props.elastic_ids,
        search: search?.length > 0 ? [search] : undefined,
        team_member_id: store.role.team_member.team_member_id,
      },
      signal
    ).then((talentNetwork) => {
      setLoadingMore(false);
      if (!talentNetwork.err) {
        setNetwork([...network, ...talentNetwork.results]);
        setTotalResults(talentNetwork.total);
        setInitialPageLoad(false);
      } else if (!signal.aborted) {
        notify("danger", talentNetwork);
      }
    });
  };

  //FETCH COMPANY JOBS
  useEffect(() => {
    if (store.company && store.role && permission.view) {
      sharedHelpers
        .jobData(
          store.company.id,
          store.session,
          1,
          store.role.team_member.team_member_id,
          signal
        )
        .then((jobs) => {
          setCompanyJobs(jobs);
        });
    }
    return () => controller.abort();
  }, [store.company, store.role, store.session, permission]);

  const concatInvitedProfessionals = (newPros) =>
    setNetwork([...newPros, ...network]);

  const openModal = (modalId) => setActiveModal(modalId);

  const closeModal = () => {
    setActiveModal(undefined);
  };

  const changeFilters = (newFilters) => {
    if (
      Object.values(filters).length === 0 &&
      Object.values(newFilters).length === 0
    ) {
      return;
    }
    setFilters(newFilters);
  };

  const addCandidatesDrop = (ev) => {
    if (
      !store.role.role_permissions.owner &&
      !store.role.role_permissions.recruiter
    ) {
      return notify(
        "danger",
        "You do not have permission to add files, ask your manager to update your roles in order to do so."
      );
    }
    let files = [];
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === "file") {
          let file = ev.dataTransfer.items[i].getAsFile();
          files.push(file);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        files.push(ev.dataTransfer.files[i]);
      }
    }
    setParentFiles(files);
    setActiveModal("dropTalent");
  };

  const clearSelected = () => {
    let newNetwork = [...network];
    newNetwork = newNetwork.map((candidate) => {
      return { ...candidate, selected: false };
    });
    setSelectedTotal(0);
    setSelectAll(false);
    setNetwork(newNetwork);
  };

  return (
    <ATSDifferentiator
      {...props}
      store={store}
      onDrop={(e) => {
        e.preventDefault();
        addCandidatesDrop(e);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <>
        {!props.as_component && (
          <>
            <TalentNetworkBanner
              company={store.company}
              search={search}
              setSearch={setSearch}
              network={network}
              setNetwork={setNetwork}
              openModal={openModal}
              totalResults={totalResults}
              companyJobs={companyJobs}
              selectedJob={selectedJob}
              setSelectedJob={setSelectedJob}
              activeModal={activeModal}
              clearSelected={clearSelected}
            />
            <TalentNetworkActionBar
              selectedTotal={selectedTotal}
              store={store}
              openModal={openModal}
              activeModal={activeModal}
            />
          </>
        )}
        <ATSContainer>
          <FilterV2
            source="candidate"
            returnFilters={(newFilters) => changeFilters(newFilters)}
          />
          {initialPageLoad ? (
            <Spinner />
          ) : (
            <>
              {network?.length > 0 && !networkLoading ? (
                <TalentNetworkTable
                  store={store}
                  network={network}
                  setNetwork={setNetwork}
                  fetchMore={fetchMore}
                  companyJobs={companyJobs}
                  setRedirect={setRedirect}
                  totalResults={totalResults}
                  loadingMore={loadingMore}
                  selectedTotal={selectedTotal}
                  setSelectedTotal={setSelectedTotal}
                  clearSelected={clearSelected}
                  selectAll={selectAll}
                  setSelectAll={setSelectAll}
                  selectedJob={selectedJob}
                  setSelectedJob={setSelectedJob}
                  activeModal={activeModal}
                  setActiveModal={setActiveModal}
                />
              ) : network?.length === 0 && !networkLoading ? (
                <div
                  className={sharedStyles.emptyContainer}
                  style={{
                    minHeight: "calc(100vh - 260px)",
                  }}
                >
                  <Suspense fallback={<div />}>
                    <EmptyTab
                      data={network}
                      title={"Add talent to your network."}
                      copy={
                        "Fill the gaps in your ATS by uploading your candidate resumes – Leo will do the rest."
                      }
                      image={<EmptyContacts />}
                      action={
                        store.role.role_permissions.owner ||
                        store.role.role_permissions.admin ||
                        store.role.role_permissions.recruiter
                          ? () => {
                              openModal("addTalent");
                            }
                          : undefined
                      }
                      actionText={"Add New Candidates"}
                    />
                  </Suspense>
                </div>
              ) : networkLoading && !initialPageLoad ? (
                <Spinner />
              ) : null}
            </>
          )}
        </ATSContainer>
      </>
      {activeModal === "addTalent" && (
        <Suspense fallback={<div />}>
          <AddTalentModal
            closeModal={closeModal}
            session={store.session}
            companyId={store.company.id}
            company={store.company}
            concatInvitedProfessionals={concatInvitedProfessionals}
            teamMember={store.role?.team_member}
            setShouldUpdate={triggerUpdate}
          />
        </Suspense>
      )}
      {activeModal === "dropTalent" && parentFiles && parentFiles?.length > 0 && (
        <Suspense fallback={<div />}>
          <AddTalentModal
            closeModal={closeModal}
            session={store.session}
            companyId={store.company.id}
            company={store.company}
            concatInvitedProfessionals={concatInvitedProfessionals}
            teamMember={store.role?.team_member}
            setShouldUpdate={triggerUpdate}
            parentFiles={parentFiles}
          />
        </Suspense>
      )}
      {redirect && redirect !== props.location.pathname && (
        <Redirect to={redirect} />
      )}
    </ATSDifferentiator>
  );
};

export default TalentNetwork;
