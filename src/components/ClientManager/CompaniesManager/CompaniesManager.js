import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  Suspense,
} from "react";
import notify from "notifications";
import retryLazy from "hooks/retryLazy";
// import styled from "styled-components";
import { permissionChecker } from "constants/permissionHelpers";
import GlobalContext from "contexts/globalContext/GlobalContext";

import {
  fetchCompaniesList,
  fetchDeleteCompanies,
  fetchChangeCompaniesOwner,
} from "helpers/crm/clientCompanies";
// import CompaniesFilter from "components/ClientManager/CompaniesManager/CompaniesFilter.js";
import CompaniesTable from "components/ClientManager/CompaniesManager/CompaniesTable.js";
import EmptyTab from "components/Profiles/components/EmptyTab";
import FilterV2 from "sharedComponents/filterV2";
import { InnerPageContainer } from "styles/PageContainers";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import CompaniesActionBar from "components/ClientManager/CompaniesManager/CompaniesActionBar";
import { EmptyCompanies } from "assets/svg/EmptyImages";
const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);
const CreateClientCompanyModal = React.lazy(() =>
  retryLazy(() => import("modals/CreateClientCompanyModal"))
);

const FETCH_ARRAY_LENGTH = 20;

const CompaniesManager = ({ parentModal, elastic_ids, search }) => {
  const store = useContext(GlobalContext);
  const [activeModal, setActiveModal] = useState(undefined);
  const [triggerUpdate, setTriggerUpdate] = useState(undefined);
  const [companies, setCompanies] = useState(undefined);
  const [selectedCompanies, setSelectedCompanies] = useState(undefined);
  const [filters, setFilters] = useState({});
  const [hasMore, setHasMore] = useState(false);
  const [companyIndex, setCompanyIndex] = useState(undefined);
  const [selectedOwner, setSelectedOwner] = useState(undefined);
  const controller = new AbortController();
  const signal = controller.signal;
  const [loaded, setLoaded] = useState(false);
  const companiesSlice = useRef(20);
  const [permission, setPermission] = useState({ view: false, edit: false });
  useEffect(() => {
    if (store.role) {
      setPermission(
        permissionChecker(store.role?.role_permissions, {
          business: true,
        })
      );
    }
  }, [store.role]);

  useEffect(() => {
    if (store.session && store.company && permission?.view) {
      //fetch companies
      fetchCompaniesList(
        store.session,
        {
          ...filters,
          slice: [0, FETCH_ARRAY_LENGTH],
          company_id: store.company.id,
          operator: "and",
          id: elastic_ids,
          search: search?.length > 0 ? [search] : undefined,
        },
        signal
      ).then((res) => {
        if (!res.err) {
          setCompanies(res);
          setHasMore(res.length === FETCH_ARRAY_LENGTH);
          setLoaded(true);
        } else if (!signal.aborted) {
          // setCompanies(false);
          notify("danger", "Unable to fetch companies");
        }
      });
    }
    return () => controller.abort();
  }, [filters, triggerUpdate, elastic_ids, search, permission]);

  const loadMore = () => {
    fetchCompaniesList(store.session, {
      ...filters,
      slice: [companiesSlice.current, FETCH_ARRAY_LENGTH],
      company_id: store.company.id,
      operator: "and",
      id: elastic_ids,
      search: search?.length > 0 ? [search] : undefined,
    }).then((res) => {
      if (!res.err) {
        setCompanies([...companies, ...res]);
        setHasMore(res.length === FETCH_ARRAY_LENGTH);
        companiesSlice.current += 20;
      } else {
        notify("danger", "Unable to fetch companies");
      }
    });
  };

  useEffect(() => {
    if (companies) {
      let newCompanies = companies.filter((company) => company.selected);
      setSelectedCompanies(newCompanies);
    } else {
      setSelectedCompanies(undefined);
    }
  }, [companies]);

  useEffect(() => {
    if (parentModal) {
      openModal(parentModal);
    }
  }, [parentModal]);

  const deleteCompany = () => {
    //fetch call to delete company
    fetchDeleteCompanies(
      store.session,
      [companies[companyIndex].layer_id],
      store.company.id
    ).then((res) => {
      if (!res.err) {
        let newCompanies = [...companies];
        newCompanies.splice(companyIndex, 1);
        setCompanies(newCompanies);
        closeModal();
        notify("info", "Company successfully deleted");
      } else {
        notify("danger", "Unable to delete contact");
      }
    });
  };

  const deleteCompaniesArr = () => {
    const idsArr = [];
    selectedCompanies.map((company) => idsArr.push(company.layer_id));
    fetchDeleteCompanies(store.session, idsArr, store.company.id).then(
      (res) => {
        if (!res.err) {
          setTriggerUpdate(Math.random());
          closeModal();
          notify("info", "Companies successfully deleted");
        } else {
          notify("danger", "Unable to delete companies");
        }
      }
    );
  };

  //-----------------------------------

  const changeCompaniesOwner = () => {
    const idsArr = [];
    selectedCompanies.map((company) => idsArr.push(company.id));
    fetchChangeCompaniesOwner(
      store.session,
      store.company.id,
      selectedOwner.id,
      idsArr
    ).then((res) => {
      if (!res.err) {
        setTriggerUpdate(Math.random());
        closeModal();
        setSelectedCompanies(undefined);
        notify("info", "Successfully changed owner");
      } else {
        notify("danger", "Unable to change contacts owner");
      }
    });
  };
  //---------------

  const changeFilters = (newFilters) => {
    if (
      Object.values(filters).length === 0 &&
      Object.values(newFilters).length === 0
    ) {
      return;
    }
    setFilters(newFilters);
  };

  const openModal = (option) => setActiveModal(option);
  const closeModal = () => setActiveModal(undefined);

  return (
    <InnerPageContainer>
      <ATSContainer>
        <FilterV2
          source="client"
          returnFilters={(newFilters) => changeFilters(newFilters)}
        />
        {!loaded && <Spinner />}
        {loaded && (
          <>
            {companies && companies.length > 0 && (
              <>
                <CompaniesTable
                  companies={companies}
                  setCompanies={setCompanies}
                  hasMore={hasMore}
                  loadMore={loadMore}
                  openModal={openModal}
                  setCompanyIndex={setCompanyIndex}
                  store={store}
                  selectedCompanies={selectedCompanies}
                  closeModal={closeModal}
                  activeModal={activeModal}
                />
              </>
            )}
            {companies && companies.length === 0 && (
              <div style={{ marginTop: 20 }}>
                {store.company?.invited_by_employer?.length ? (
                  <EmptyTab
                    data={companies}
                    title={"Add clients"}
                    copy={
                      "Add the client you’re recruiting for here, then connect them to deals and contacts."
                    }
                    image={<EmptyCompanies />}
                  />
                ) : (
                  <EmptyTab
                    data={companies}
                    title={"Add clients"}
                    copy={
                      "Add the client you’re recruiting for here, then connect them to deals and contacts."
                    }
                    image={<EmptyCompanies />}
                    action={
                      permission.edit
                        ? () => openModal("create_company")
                        : undefined
                    }
                    actionText={"Add Your First Client"}
                  />
                )}
              </div>
            )}
          </>
        )}
        {activeModal === "delete_company" &&
          companyIndex !== undefined &&
          companies[companyIndex] && (
            <Suspense fallback={<div />}>
              <ConfirmModalV2
                show={true}
                hide={() => {
                  closeModal();
                  setCompanyIndex(undefined);
                }}
                header="Delete Company"
                text={`Are you sure you want to delete ${
                  companies[companyIndex]?.company_name || "this company"
                } from your companies`}
                actionText="Delete"
                actionFunction={deleteCompany}
              />
            </Suspense>
          )}
        {activeModal === "delete_companies_arr" && (
          <Suspense fallback={<div />}>
            <ConfirmModalV2
              show={true}
              hide={() => {
                closeModal();
              }}
              header="Delete Companies"
              text={`Are you sure you want to delete these companies`}
              actionText="Delete"
              actionFunction={deleteCompaniesArr}
            />
          </Suspense>
        )}
        {activeModal === "change_owner_confirm" && selectedOwner && (
          <Suspense fallback={<div />}>
            <ConfirmModalV2
              show={true}
              hide={() => {
                closeModal();
                setSelectedOwner(undefined);
              }}
              header="Change Owner"
              text={`Are you sure you want to change these companies owner to ${selectedOwner.name}`}
              actionText="Change"
              actionFunction={changeCompaniesOwner}
            />
          </Suspense>
        )}
        {activeModal === "create_company" && (
          <CreateClientCompanyModal
            show={true}
            hide={closeModal}
            setTriggerUpdate={setTriggerUpdate}
          />
        )}
      </ATSContainer>
      <CompaniesActionBar
        selectedTotal={selectedCompanies?.length}
        store={store}
        openModal={openModal}
        activeModal={activeModal}
      />
    </InnerPageContainer>
  );
};
export default CompaniesManager;
