import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CompletedCheckmark from "components/JobCreation/components/CompletedCheckmark";
import { fetchVendors } from "helpersV2/jobs";
import notify from "notifications";
import useDropdown from "hooks/useDropdown";
import SearchDropbox from "sharedComponents/SearchDropbox";

const ClientSelect = ({ value, setValue, validation, store }) => {
  const [clients, setClients] = useState([]);
  const { node, showSelect, setShowSelect } = useDropdown();
  const [selectedClient, setSelectedClient] = useState(undefined);

  useEffect(() => {
    if (store.session && store.company) {
      fetchVendors(store.session, store.company.id).then((res) => {
        if (!res.err) {
          setClients([
            // { name: store.company.name, id: undefined },
            ...res.list,
          ]);
        } else {
          notify("danger", "Unable to fetch Clients list");
        }
      });
    }
  }, [store.session, store.company]);

  useEffect(() => {
    if (value && !selectedClient && clients && clients.length > 0) {
      clients.map((client) => {
        if (client.company_id === value) {
          setSelectedClient(client);
        }
        return null;
      });
    }
  }, [value, selectedClient, clients]);

  return (
    <Wrapper ref={node} className="leo-relative leo-flex-center-between">
      <Input
        placeholder="Select who the job is for"
        readOnly
        value={selectedClient?.name || ""}
        onClick={() => setShowSelect(true)}
      />
      {validation && <CompletedCheckmark />}
      {showSelect && (
        <DropBoxContainer>
          <SearchDropbox
            list={clients}
            onSelect={(client) => {
              setSelectedClient(client);
              setValue(client.company_id);
              setShowSelect(undefined);
            }}
            placeholder="Select a client"
          />
        </DropBoxContainer>
      )}
    </Wrapper>
  );
};

export default ClientSelect;

const Wrapper = styled.div`
  padding-bottom: 5px;
  border-bottom: solid #c4c4c4 1px;
  max-width: 530px;
`;

const Input = styled.input`
  border: none;
  background: none;
  font-size: 14px;
`;

const DropBoxContainer = styled.div`
  position: absolute;
  top: 35px;
  z-index: 1;
`;
