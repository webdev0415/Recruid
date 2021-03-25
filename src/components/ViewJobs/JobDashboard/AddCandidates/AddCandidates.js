import React, { useContext, useState, useEffect } from "react";

import CandidateTable from "./CandidateTable";
import GlobalContext from "contexts/globalContext/GlobalContext";
import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";
import FilterV2 from "sharedComponents/filterV2";

import sharedStyles from "assets/stylesheets/scss/collated/filter.module.scss";
import styles from "./style/addCandidates.module.scss";
import "assets/stylesheets/scss/collated/filter.scss";
import { fetchNetwork } from "helpersV2/candidates";
import notify from "notifications";
import ConfirmInviteBlacklistedModal from "modals/ConfirmInviteBlacklistedModal";
import SimpleDelayedInput from "sharedComponents/SimpleDelayedInput";
const SLICE_LENGTH = 20;

const AddCandidates = (props) => {
  const store = useContext(GlobalContext);
  const [filters, setFilters] = useState({});
  const [selectedProfessionals, setSelectedProfessionals] = useState([]);
  const [search, setSearch] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [hasMore, setHasMore] = useState(false);
  const controller = new AbortController();
  const signal = controller.signal;
  const [innerModal, setInnerModal] = useState(undefined);

  const changeFilters = (newFilters) => {
    if (
      Object.values(filters).length === 0 &&
      Object.values(newFilters).length === 0
    ) {
      return;
    }
    setFilters(newFilters);
  };

  //FETCH COMPANY CANDIDATES
  useEffect(() => {
    if (store.company && store.role) {
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
          if (talentNetwork.results.length !== talentNetwork.total) {
            setHasMore(true);
          } else if (hasMore === true) {
            setHasMore(false);
          }
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
    props.elastic_ids,
    search,
  ]);

  //LOAD MORE CANDIDATES
  const fetchMore = () => {
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
      if (!talentNetwork.err) {
        let arr = [...network, ...talentNetwork.results];
        setNetwork(arr);
        if (arr.length !== talentNetwork.total) {
          setHasMore(true);
        } else if (hasMore === true) {
          setHasMore(false);
        }
      } else if (!signal.aborted) {
        notify("danger", talentNetwork);
      }
    });
  };

  const addRemoveSelectedProfessional = (bool, index) => {
    let professionals = [...network];
    professionals[index] = {
      ...professionals[index],
      selected: bool,
    };
    setNetwork(professionals);
    setSelectedProfessionals(professionals.filter((cand) => cand.selected));
  };

  const selectAll = (action) => {
    if (!network) {
      return;
    }
    let professionals = [...network];
    professionals = professionals.map((pro) => {
      return { ...pro, selected: action === "add" ? true : false };
    });
    setNetwork(professionals);
    if (action === "add") {
      setSelectedProfessionals(professionals);
    } else {
      setSelectedProfessionals([]);
    }
  };

  const checkBlacklisted = () => {
    let blacklisted = network.filter(
      (cand) => cand.selected && cand.blacklisted
    );
    if (blacklisted.length > 0) {
      setInnerModal("confirm-invite-blacklisted");
    } else {
      props.addSelectedProfessionalsToJob(
        selectedProfessionals.map((cand) => cand.professional_id)
      );
    }
  };

  const deselectBlackListed = (cand) => {
    let index;
    network.map((candidate, ix) =>
      candidate.ptn_id === cand.ptn_id ||
      candidate.professional_id === cand.professional_id
        ? (index = ix)
        : null
    );
    addRemoveSelectedProfessional(!network[index].selected, index);
  };

  return (
    <>
      {innerModal === undefined && (
        <UniversalModal
          show={true}
          hide={props.closeModal}
          id={"addCandidates"}
          width={960}
        >
          <ModalHeaderClassic
            title="Add Candidates"
            closeModal={props.closeModal}
          />
          <ModalBody className="no-footer">
            <div
              className={sharedStyles.container}
              style={{
                borderBottom: "1px solid #eee",
                borderRadius: "0",
                boxShadow: "none",
                background: "#eee",
              }}
            >
              <div
                className="leo-flex"
                style={{
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <FilterV2
                  source="candidate"
                  returnFilters={(newFilters) => changeFilters(newFilters)}
                  cleanSlate={true}
                />
                <div className={styles.inputContainer}>
                  <div>
                    <SimpleDelayedInput
                      className={styles.searchNetwork}
                      placeholder="Search..."
                      value={search}
                      onChange={(val) => setSearch(val)}
                      style={{
                        boxShadow: "0 1px 2px 0 rgba(0,0,0,0.1)",
                        background: "white",
                        marginLeft: "10px",
                      }}
                    />

                    <li className="fas fa-search search" />
                  </div>
                </div>
              </div>
            </div>
            <CandidateTable
              talentNetwork={network}
              selectAll={selectAll}
              style={{ height: "300px", minHeight: "0px" }}
              loadMore={fetchMore}
              morePages={hasMore}
              addRemoveSelectedProfessional={addRemoveSelectedProfessional}
            />
            <div className={styles.modalFooter}>
              <button
                type="button"
                className="button button--default button--grey-light"
                onClick={() => {
                  setTimeout(() => {
                    props.closeModal();
                  }, 300);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button button--default button--blue-dark"
                onClick={() => {
                  if (selectedProfessionals.length < 1) {
                    alert(
                      "Please select at least one professional to add to job"
                    );
                  } else {
                    checkBlacklisted();
                  }
                }}
              >
                Add{" "}
                {selectedProfessionals.length > 0
                  ? `(${selectedProfessionals.length})`
                  : null}
              </button>
            </div>
          </ModalBody>
        </UniversalModal>
      )}
      {innerModal === "confirm-invite-blacklisted" && network && (
        <ConfirmInviteBlacklistedModal
          hide={() => setInnerModal(undefined)}
          actionFunction={() =>
            props.addSelectedProfessionalsToJob(
              selectedProfessionals.map((cand) => cand.professional_id)
            )
          }
          blacklistedCandidates={network.filter(
            (cand) => cand.selected && cand.blacklisted
          )}
          deselectBlackListed={deselectBlackListed}
          localDeselect={true}
        />
      )}
    </>
  );
};

export default AddCandidates;
