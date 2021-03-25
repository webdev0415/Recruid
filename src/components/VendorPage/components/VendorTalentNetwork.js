import React, { useContext, useState, useEffect } from "react";
import notify from "notifications";

import GlobalContext from "contexts/globalContext/GlobalContext";
import VendorTNBanner from "components/VendorPage/components/VendorTNBanner";
import VendorTNTable from "components/VendorPage/components/VendorTNTable";
import FilterV2 from "sharedComponents/filterV2";
import { fetchVendorCandidates } from "helpersV2/vendors";

import EmptyTab from "components/Profiles/components/EmptyTab";
import GuestEmployer from "sharedComponents/GuestEmployer";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import { EmptyContacts } from "assets/svg/EmptyImages";
const SLICE_LENGTH = 20;

const VendorTalentNetwork = ({
  vendor,
  vendorId,
  company,
  openParentModal,
}) => {
  const store = useContext(GlobalContext);
  const [network, setNetwork] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    if (store.company && vendorId && store.session) {
      setLoading(true);
      //fetch candidates from the vendor endpoint
      fetchVendorCandidates(
        store.session,
        store.company.id,
        vendorId,
        {
          ...filters,
          slice: [0, SLICE_LENGTH],
          operator: "and",
          search: search?.length > 0 ? [search] : undefined,
        },
        signal
      ).then((res) => {
        setLoading(false);
        if (res !== "err") {
          setNetwork(res);
        } else if (!signal.aborted) {
          notify("danger", "Unable to fetch candidates");
        }
      });
    }
    return () => controller.abort();
  }, [store.company, vendorId, store.session, filters]);

  const loadMoreProfessionals = () => {
    //fetch candidates from the vendor endpoint
    fetchVendorCandidates(store.session, store.company.id, vendorId, {
      ...filters,
      slice: [network.length, SLICE_LENGTH],
      operator: "and",
      search: search?.length > 0 ? [search] : undefined,
    }).then((res) => {
      if (res !== "err") {
        setNetwork([...network, ...res]);
      } else {
        notify("danger", "Unable to fetch candidates");
      }
    });
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

  return (
    <>
      <VendorTNBanner
        vendor={vendor}
        network={network}
        search={search}
        setSearch={setSearch}
      />
      <ATSContainer>
        {company &&
          (company.invited_by_agency ||
            company.invited_by_employer ||
            company.trial !== "upgraded") && (
            <GuestEmployer
              vendor={vendor}
              upgradeFunction={() => openParentModal("UpgradeModal")}
            />
          )}
        <div style={{ marginBottom: "20px" }}>
          <FilterV2
            source="candidate"
            returnFilters={(newFilters) => changeFilters(newFilters)}
          />
        </div>
        {loading ? (
          <Spinner />
        ) : network?.length > 0 ? (
          <VendorTNTable
            network={network}
            hasMorePages={network.length % SLICE_LENGTH === 0 ? true : false}
            loadMoreProfessionals={loadMoreProfessionals}
            companyMentionTag={company.mention_tag}
          />
        ) : (
          network?.length === 0 && (
            <EmptyTab
              data={network}
              title={"The candidates list is empty!"}
              copy={"There are no candidates to display."}
              image={<EmptyContacts />}
            />
          )
        )}
      </ATSContainer>
    </>
  );
};

export default VendorTalentNetwork;
