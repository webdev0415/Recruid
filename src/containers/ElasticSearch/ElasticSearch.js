import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { ROUTES } from "routes";
import InnerPage from "PageWrappers/InnerPage";
import ATSWrapper from "PageWrappers/ATSWrapper";
import { Redirect } from "react-router-dom";
import FadeWrapper from "sharedComponents/FadeWrapper";
import GlobalContext from "contexts/globalContext/GlobalContext";
import HistoryContext from "contexts/historyContext/HistoryContext";
import { CloseBtn } from "components/ElasticSearch/CloseBtn";
import { SearchBar } from "components/ElasticSearch/SearchBar";
import { ElasticTabs } from "components/ElasticSearch/ElasticTabs";
import { SearchResults } from "components/ElasticSearch/SearchResults";
import { elasticSearch } from "helpersV2/aws";
import notify from "notifications";
import styled from "styled-components";
import { PermissionChecker } from "constants/permissionHelpers";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import retryLazy from "hooks/retryLazy";

const TalentNetwork = lazy(() =>
  retryLazy(() => import("containers/TalentNetwork"))
);
const DealsTable = lazy(() =>
  retryLazy(() => import("components/ElasticSearch/DealsTable"))
);
const MeetingsTable = lazy(() =>
  retryLazy(() => import("components/ElasticSearch/MeetingsTable"))
);
const DocumentsTable = lazy(() =>
  retryLazy(() => import("components/ElasticSearch/DocumentsTable"))
);
const ViewJobs = lazy(() => retryLazy(() => import("containers/ViewJobs")));
const ContactsManager = lazy(() =>
  retryLazy(() => import("components/ClientManager/ContactsManager"))
);
const CompaniesManager = lazy(() =>
  retryLazy(() => import("components/ClientManager/CompaniesManager"))
);
const InterviewsTable = lazy(() =>
  retryLazy(() => import("components/ElasticSearch/InterviewsTable"))
);
const EmailsTable = lazy(() =>
  retryLazy(() => import("components/ElasticSearch/EmailsTable"))
);

const ElasticSearch = ({ match }) => {
  const { company, allMyCompanies, role } = useContext(GlobalContext);
  const historyStore = useContext(HistoryContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [resultsMap, setResultsMap] = useState(null);
  const [searchPending, setSearchPending] = useState(false);
  const [activeTab, setActiveTab] = useState("_all");
  const [resultCounts, setResultCounts] = useState(null);
  const [resultsIds, setResultsIds] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);
  const [closing, setClosing] = useState(false);
  const [redirect, setRedirect] = useState(undefined);

  const handleTabChange = (tab) => () => setActiveTab(tab);

  useEffect(() => {
    if (historyStore.current) {
      let lastValidPath = findLastPath();
      setPrevLocation(lastValidPath || `/${company?.mention_tag}/dashboard`);
    } else {
      setPrevLocation(`/${company?.mention_tag}/dashboard`);
    }
     
  }, [company, historyStore.current]);

  const findLastPath = () => {
    let lastValidPath;
    let index = 0;

    while (index < historyStore.state.length && !lastValidPath) {
      if (
        historyStore.state[index].url !== historyStore.current.match.url &&
        (historyStore.state.length <= 2 ||
          historyStore.state[index + 1]?.url !== historyStore.current.match.url)
      ) {
        lastValidPath = historyStore.state[index];
      }
      index++;
    }
    return lastValidPath;
  };

  useEffect(() => {
    if (match.params?.tab?.length) setActiveTab(match.params.tab);
  }, [match.params]);

  useEffect(() => {
    const requestController = new AbortController();
    const { signal } = requestController;
    setSearchPending(true);

    if (searchTerm.length >= 2 && company) {
      elasticSearch(searchTerm, company.id, activeTab, signal).then((res) => {
        if (res.error) {
          setSearchPending(false);
          if (signal.aborted) return;
          return notify("danger", res.message);
        }
        // GROUP SEARCH RESULTS BY INDEX
        const results = Array.isArray(res)
          ? res.reduce((acc, currentVal) => {
              let result = { ...acc };
              let source = { id: currentVal._id, ...currentVal._source };
              if (!(currentVal._index in result)) {
                result[currentVal._index] = [];
              }

              result[currentVal._index] = [
                ...result[currentVal._index],
                source,
              ];
              return result;
            }, {})
          : [];
        // SORT BY AMOUNT OF MATCHES
        const resultsEntries = Object.entries(results);
        const sortedMap = resultsEntries.sort(
          (a, b) => b[1].length - a[1].length
        );

        setResultsMap(sortedMap);
        setResultCounts(() => {
          let counts = { all: 0 };
          for (let [key, value] of resultsEntries) {
            counts.all += value.length;
            counts[key] = value.length;
          }
          return counts;
        });
        setResultsIds(() => {
          let result = {};
          for (let [key, value] of resultsEntries) {
            result[key] = value.map((val) => val.id);
          }
          return result;
        });
        setSearchPending(false);
      });
    } else {
      setResultsMap(null);
      setSearchPending(false);
    }

    return () => requestController.abort();
    // eslint-disable-next-line
  }, [searchTerm, company]);

  const searchBodyComponent = useMemo(() => {
    switch (activeTab) {
      case "candidates":
        return (
          <PermissionChecker
            type="view"
            valid={{ recruiter: true, hiring_manager: true }}
          >
            <Suspense fallback={<div />}>
              <TalentNetwork
                as_component={true}
                elastic_ids={resultsIds?.candidates}
              />
            </Suspense>
          </PermissionChecker>
        );
      case "deals":
        return (
          <PermissionChecker type="view" valid={{ business: true }}>
            <Suspense fallback={<div />}>
              <DealsTable elastic_ids={resultsIds?.deals} />
            </Suspense>{" "}
          </PermissionChecker>
        );
      case "meetings":
        return (
          <PermissionChecker type="view" valid={{ business: true }}>
            <Suspense fallback={<div />}>
              <MeetingsTable elastic_ids={resultsIds?.meetings} />
            </Suspense>{" "}
          </PermissionChecker>
        );
      case "documents":
        return (
          <Suspense fallback={<div />}>
            <DocumentsTable elastic_ids={resultsIds?.documents} />
          </Suspense>
        );
      case "jobs":
        return (
          <PermissionChecker
            type="view"
            valid={{ recruiter: true, hiring_manager: true }}
          >
            <Suspense fallback={<div />}>
              <ViewJobs as_component={true} elastic_ids={resultsIds?.jobs} />
            </Suspense>{" "}
          </PermissionChecker>
        );
      case "contacts":
        return (
          <PermissionChecker type="view" valid={{ business: true }}>
            <Suspense fallback={<div />}>
              <ContactsManager elastic_ids={resultsIds?.contacts} />
            </Suspense>{" "}
          </PermissionChecker>
        );
      case "clients":
        return (
          <PermissionChecker type="view" valid={{ business: true }}>
            <Suspense fallback={<div />}>
              <CompaniesManager elastic_ids={resultsIds?.clients} />
            </Suspense>{" "}
          </PermissionChecker>
        );
      case "interviews":
        return (
          <PermissionChecker
            type="view"
            valid={{ recruiter: true, hiring_manager: true }}
          >
            <Suspense fallback={<div />}>
              <InterviewsTable elastic_ids={resultsIds?.interviews} />
            </Suspense>{" "}
          </PermissionChecker>
        );
      case "emails":
        return (
          <Suspense fallback={<div />}>
            <EmailsTable elastic_ids={resultsIds?.emails} />
          </Suspense>
        );
      default:
        return null;
    }
  }, [activeTab, resultsIds]);

  return (
    <InnerPage
      pageTitle={(company?.name || "") + " - Search"}
      originName="Search"
    >
      <ATSWrapper activeTab="search" routeObject={ROUTES.ElasticSearch}>
        <FadeWrapper className={closing ? "out" : "in"}>
          <SearchHeader>
            <ATSContainer>
              <SearchBarContainer>
                <SearchBar
                  company={company}
                  allMyCompanies={allMyCompanies}
                  search={searchTerm}
                  setSearch={setSearchTerm}
                />
                <button
                  onClick={() => {
                    setClosing(true);
                    setTimeout(function () {
                      setRedirect(prevLocation);
                    }, 500);
                  }}
                >
                  <CloseBtn />
                </button>
              </SearchBarContainer>
              <ElasticTabs
                activeTab={activeTab}
                resultCounts={resultCounts}
                handleTabChange={handleTabChange}
                company={company}
                role={role}
              />
            </ATSContainer>
          </SearchHeader>
          <SearchContentWrapper>
            {!searchPending ? (
              activeTab === "_all" ? (
                <SearchResults results={resultsMap} role={role} />
              ) : null
            ) : (
              activeTab === "_all" && (
                <SearchingContainer>
                  <Spinner />
                </SearchingContainer>
              )
            )}
            <TableWrapper>{searchBodyComponent}</TableWrapper>
          </SearchContentWrapper>
          {redirect && <Redirect to={redirect} />}
        </FadeWrapper>
      </ATSWrapper>
    </InnerPage>
  );
};

export default ElasticSearch;

// const SearchContainer = styled.div`
//   background: #eee;
//   // background: #fff;
//   // background: #2a3744;
//   bottom: 0;
//   height: 100vh;
//   left: 0;
//   position: absolute;
//   overflow: auto;
//   right: 0;
//   top: 0;
//   z-index: 10;
// `;

const SearchHeader = styled.div`
  background: #2a3744;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10;
`;

const SearchBarContainer = styled.div`
  align-items: center;
  display: flex;
  height: 50px;
  justify-content: space-between;
`;

const SearchContentWrapper = styled.div`
  margin-top: 50px;
`;

const TableWrapper = styled.div`
  margin-top: 70px;
`;

const SearchingContainer = styled.div`
  div {
    min-height: calc(100vh - 100px);
    background: #2a3744;
  }
`;
