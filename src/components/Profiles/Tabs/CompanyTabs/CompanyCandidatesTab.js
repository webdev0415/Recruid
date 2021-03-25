import React, { useContext, useState, useEffect } from "react";
import notify from "notifications";

import GlobalContext from "contexts/globalContext/GlobalContext";
import CompanyClientCandidatesTable from "components/Profiles/Tabs/CompanyTabs/CompanyClientCandidatesTable";
import FilterV2 from "sharedComponents/filterV2";
import { fetchVendorCandidates } from "helpersV2/vendors";

import EmptyTab from "components/Profiles/components/EmptyTab";

import styles from "components/TalentNetwork/components/TalentNetworkBanner/style/talentNetworkBanner.module.scss";
import styled from "styled-components";
import { ATSContainer } from "styles/PageContainers";
import Spinner from "sharedComponents/Spinner";
import { EmptyContacts } from "assets/svg/EmptyImages";
const SLICE_LENGTH = 20;

const VendorTalentNetwork = ({
  vendorId,
  activeModal,
  setActiveModal,
  selectedTotal,
  setSelectedTotal,
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
          search,
        },
        signal
      ).then((res) => {
        setLoading(false);
        if (res !== "err") {
          console.log(res);
          setNetwork(res);
        } else if (!signal.aborted) {
          notify("danger", "Unable to fetch candidates");
        }
      });
    }
    return () => controller.abort();
  }, [store.company, vendorId, store.session, filters, search]);

  const loadMoreProfessionals = () => {
    //fetch candidates from the vendor endpoint
    fetchVendorCandidates(store.session, store.company.id, vendorId, {
      ...filters,
      slice: [network.length, SLICE_LENGTH],
      operator: "and",
    }).then((res) => {
      if (res !== "err") {
        setNetwork([...network, ...res]);
      } else {
        notify("danger", "Unable to fetch candidates");
      }
    });
  };

  // const updateProfessionalProperty = (index, prop, value) => {
  //   let professionals = [...network];
  //   let professional = { ...professionals[index], [prop]: value };
  //   professional[prop] = value;
  //   professionals[index] = professional;
  //   setNetwork(professionals);
  // };

  const changeFilters = (newFilters) => {
    if (
      Object.values(filters).length === 0 &&
      Object.values(newFilters).length === 0
    ) {
      return;
    }
    setFilters(newFilters);
  };

  useEffect(() => {
    document.body.style.background = "white";
    return () => (document.body.style.background = "#eee");
  }, []);

  return (
    <>
      <ATSContainer>
        <SearchContainer>
          <InputContainer>
            <div>
              <input
                className={styles.form}
                placeholder="Search Candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <li className="fas fa-search search" />
            </div>
          </InputContainer>
        </SearchContainer>
        <div style={{ marginBottom: "10px" }}>
          <FilterV2
            source="candidate"
            returnFilters={(newFilters) => changeFilters(newFilters)}
            v2theme={true}
          />
        </div>
        {loading ? (
          <Spinner />
        ) : network?.length > 0 ? (
          <TableContainer>
            <CompanyClientCandidatesTable
              network={network}
              setNetwork={setNetwork}
              hasMorePages={network.length % SLICE_LENGTH === 0 ? true : false}
              loadMoreProfessionals={loadMoreProfessionals}
              companyMentionTag={store.company?.mention_tag}
              store={store}
              activeModal={activeModal}
              setActiveModal={setActiveModal}
              selectedTotal={selectedTotal}
              setSelectedTotal={setSelectedTotal}
            />
          </TableContainer>
        ) : (
          network?.length === 0 && (
            <EmptyTab
              data={network}
              title={"This client has no candidates!"}
              copy={`You should submit some?`}
              image={<EmptyContacts />}
            />
          )
        )}
      </ATSContainer>
    </>
  );
};

export default VendorTalentNetwork;

const InputContainer = styled.div`
  align-items: center;
  display: flex;
  margin-left: 10px;

  div {
    position: relative;
  }

  li {
    align-items: center;
    color: #9a9ca1;
    display: flex;
    font-size: 14px;
    padding: 0;
    position: absolute;
    bottom: 0;
    left: 15px;
    top: 0;
  }
`;

const SearchContainer = styled.div`
  background: #fff;
  margin-bottom: 10px;
  padding: 10px 15px;
  // box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const TableContainer = styled.div`
  margin-bottom: 50px;
`;
