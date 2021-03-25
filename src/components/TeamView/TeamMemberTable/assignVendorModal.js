import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { API_ROOT_PATH } from "constants/api";
import GlobalContext from "contexts/globalContext/GlobalContext";
import UniversalModal, {
  ModalHeaderClassic,
  ModalBody,
  ModalFooter,
} from "modals/UniversalModal/UniversalModal";
import Spinner from "sharedComponents/Spinner";
import notify from "notifications";
import { AWS_CDN_URL } from "constants/api";

const VendorsContainer = styled.div`
  border-bottom: 1px solid #eee;
  max-height: 400px;
  overflow-y: auto;
`;

const AssignVendorModal = ({
  hiringManager,
  closeModal,
  updateTeamMember,
  clients,
}) => {
  const store = useContext(GlobalContext);
  const [clientId, setClientId] = useState(undefined);

  useEffect(() => {
    if (hiringManager.client_layer_id) {
      setClientId(hiringManager.client_layer_id);
    }
  }, [hiringManager]);

  const assignVendorList = () => {
    postVendorList({ vendor: clientId || "remove" }).then((res) => {
      if (res && res !== "err") {
        updateTeamMember(res[0]);
        closeModal("noModal");
      } else {
        notify("danger", "UNable to assign client");
      }
    });
  };

  const postVendorList = (postBody) => {
    const url =
      API_ROOT_PATH +
      `/v1/companies/${store.company.id}/team_members/${hiringManager.team_member_id}/add_to_client`;
    const data = fetch(url, {
      method: "POST",
      headers: store.session,
      body: JSON.stringify(postBody),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    });
    return data;
  };

  return (
    <UniversalModal
      show={true}
      hide={() => closeModal("noModal")}
      id={"addAgency"}
      width={480}
    >
      <ModalHeaderClassic
        title={`Assign Client to ${hiringManager.name}`}
        closeModal={() => closeModal("noModal")}
      />
      <ModalBody>
        <VendorsContainer>
          <ul>
            {clients &&
              clients.length > 0 &&
              clients
                .filter((vendor) => vendor.client_layer_id)
                .map((vendor) => (
                  <li key={vendor.id} className="job-post-cell-item">
                    <div className="job-post-cell-details">
                      <span className="cell-title">{vendor.name}</span>
                    </div>
                    <div>
                      {vendor.client_layer_id === clientId && (
                        <div
                          onClick={() => setClientId(null)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={`${AWS_CDN_URL}/icons/SelectedMark.svg`}
                            alt=""
                          />
                        </div>
                      )}
                      {vendor.client_layer_id !== clientId && (
                        <div
                          onClick={() => setClientId(vendor.client_layer_id)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={`${AWS_CDN_URL}/icons/AddMark.svg`}
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
            {clients?.length === 0 && (
              <li className="job-post-cell-item">
                You do not have any clients yet
              </li>
            )}
            {!clients && <Spinner />}
          </ul>
        </VendorsContainer>
      </ModalBody>
      <ModalFooter hide={() => closeModal("noModal")}>
        <button
          className="button button--default button--blue-dark"
          onClick={assignVendorList}
        >
          Save
        </button>
      </ModalFooter>
    </UniversalModal>
  );
};

export default AssignVendorModal;
