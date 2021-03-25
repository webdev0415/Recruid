import React, { useState, useEffect, Suspense } from "react";
import { ATSContainer } from "styles/PageContainers";
import TempCandidatesTable from "components/TempManager/TempCandidates/TempCandidatesTable";
import FilterV2 from "sharedComponents/filterV2";
// import { fetchNetwork } from "helpersV2/candidates";
import { fetchTempNetwork } from "helpersV2/tempPlus";
import notify from "notifications";
import Spinner from "sharedComponents/Spinner";
// import { ROUTES } from "routes";
// import { Link } from "react-router-dom";
// import Marquee from "sharedComponents/Marquee";
// import styled from "styled-components";
// import AvatarIcon from "sharedComponents/AvatarIcon";
// import { COLORS } from "constants/style";
import ATSBanner from "sharedComponents/ATSBanner";
import SearchInput from "sharedComponents/SearchInput";
// import AppButton from "styles/AppButton";
import retryLazy from "hooks/retryLazy";
import { PermissionChecker } from "constants/permissionHelpers";
import QuickActionsMenuV2, {
  QuickActionsOption,
} from "sharedComponents/QuickActionsMenuV2";
import TalentNetworkActionBar from "components/TalentNetwork/components/TalentNetworkActionBar";
import { EmptyContacts } from "assets/svg/EmptyImages";
const AddTalentModal = React.lazy(() =>
  retryLazy(() =>
    import("components/TalentNetwork/components/AddTalent/AddTalentModal")
  )
);

const EmptyTab = React.lazy(() =>
  import("components/Profiles/components/EmptyTab")
);

const SLICE_LENGTH = 20;

const TempCandidates = ({
  store,
  permission,
  setRedirect,
  activeTab,
  tabsArr,
}) => {
  const [network, setNetwork] = useState(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [activeModal, setActiveModal] = useState(undefined);
  const [update, triggerUpdate] = useState(undefined);
  const [selectedTotal, setSelectedTotal] = useState(0);
  // const [networkLoading, setNetworkLoading] = useState(true);
  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    if (store.company && store.role && permission.view) {
      // setNetworkLoading(true);
      fetchTempNetwork(
        store.session,
        store.company.id,
        {
          ...filters,
          slice: [0, SLICE_LENGTH],
          operator: "and",
          search: search?.length > 0 ? [search] : undefined,
          // team_member_id: store.role.team_member.team_member_id,
        },
        signal
      ).then((talentNetwork) => {
        if (!talentNetwork.err) {
          setNetwork(talentNetwork);
          if (talentNetwork.length === SLICE_LENGTH) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
          // setNetworkLoading(false);
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
    permission,
    search,
    update,
  ]);

  //LOAD MORE CANDIDATES
  const fetchMore = () => {
    fetchTempNetwork(
      store.session,
      store.company.id,
      {
        ...filters,
        slice: [network.length, SLICE_LENGTH],
        operator: "and",
        search: search?.length > 0 ? [search] : undefined,
        // team_member_id: store.role.team_member.team_member_id,
      },
      signal
    ).then((talentNetwork) => {
      if (!talentNetwork.err) {
        setNetwork([...network, ...talentNetwork]);
        if (talentNetwork.length === SLICE_LENGTH) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else if (!signal.aborted) {
        notify("danger", talentNetwork);
      }
    });
  };

  const concatInvitedProfessionals = (newPros) =>
    setNetwork([...newPros, ...network]);

  return (
    <>
      <ATSBanner
        name={store.company?.name}
        avatar={store.company?.avatar_url}
        page="Temp +"
        tabs={tabsArr}
        activeTab={activeTab}
        tabType="link"
        v2theme={true}
      >
        {network?.length >= 0 && (
          <div style={{ marginRight: "10px" }}>
            <SearchInput
              placeholder="Search Candidates..."
              value={search}
              onChange={(val) => setSearch(val)}
            />
          </div>
        )}
        {selectedTotal > 0 && (
          <>
            {(store.role?.role_permissions.owner ||
              (store.role?.role_permissions.admin &&
                store.role?.role_permissions.recruiter) ||
              store.role?.role_permissions.marketer) && (
              <QuickActionsMenuV2 disabled={false}>
                <PermissionChecker type="edit" valid={{ recruiter: true }}>
                  <QuickActionsOption
                    onClick={() => setActiveModal("add-to-job")}
                  >
                    Add to job
                  </QuickActionsOption>
                </PermissionChecker>
                <PermissionChecker type="edit" valid={{ marketer: true }}>
                  <QuickActionsOption
                    onClick={() => setActiveModal("create-email")}
                  >
                    Send Email
                  </QuickActionsOption>
                  <QuickActionsOption
                    onClick={() =>
                      setActiveModal("create_list_from_candidates")
                    }
                  >
                    Add to a new list
                  </QuickActionsOption>
                  <QuickActionsOption
                    onClick={() => setActiveModal("add_candidates_to_list")}
                  >
                    Add to existing list
                  </QuickActionsOption>
                </PermissionChecker>
                {(store.role?.role_permissions.owner ||
                  (store.role?.role_permissions.admin &&
                    store.role?.role_permissions.recruiter)) && (
                  <QuickActionsOption
                    onClick={() => setActiveModal("delete-multiple")}
                  >
                    Delete Selected
                  </QuickActionsOption>
                )}
              </QuickActionsMenuV2>
            )}
          </>
        )}
      </ATSBanner>
      <TalentNetworkActionBar
        selectedTotal={selectedTotal}
        store={store}
        openModal={setActiveModal}
        activeModal={activeModal}
      />
      <ATSContainer>
        {!network && <Spinner />}
        {network && (
          <FilterV2
            source="candidate"
            returnFilters={(newFilters) => setFilters(newFilters)}
            v2theme={true}
            hideSegments={true}
          />
        )}
        {network && network.length > 0 && (
          <TempCandidatesTable
            store={store}
            network={network}
            setNetwork={setNetwork}
            hasMore={hasMore}
            fetchMore={fetchMore}
            setRedirect={setRedirect}
            activeModal={activeModal}
            setActiveModal={setActiveModal}
            selectedTotal={selectedTotal}
            setSelectedTotal={setSelectedTotal}
          />
        )}
        {network && network.length === 0 && (
          <Suspense fallback={<div />}>
            <EmptyTab
              data={network}
              title={"Add talent to your network."}
              copy={
                "Fill the gaps in your ATS by uploading your candidate resumes – Leo will do the rest."
              }
              image={<EmptyContacts />}
            />
          </Suspense>
        )}
        {/*create as tem plus candidates ??*/}
        {activeModal === "addTalent" && (
          <Suspense fallback={<div />}>
            <AddTalentModal
              closeModal={() => setActiveModal(undefined)}
              session={store.session}
              companyId={store.company.id}
              company={store.company}
              concatInvitedProfessionals={concatInvitedProfessionals}
              teamMember={store.role?.team_member}
              setShouldUpdate={triggerUpdate}
            />
          </Suspense>
        )}
      </ATSContainer>
    </>
  );
};

export default TempCandidates;
