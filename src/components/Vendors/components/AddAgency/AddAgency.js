import React, { useState, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import UniversalModal from "modals/UniversalModal/UniversalModal";
// Components
import AddAgencyModal from "./AddAgencyModal";
import InitialModal from "./InitialModal";
import InviteAgency from "./InviteAgency";

export default function AddAgency({
  closeModal,
  inviteAgency,
  companyType,
  createClient,
  session,
  company,
  forceUpdate
}) {
  const store = useContext(GlobalContext);
  const [state, setState] = React.useState({
    name: "",
    industry: "",
    logo: null,
    client: null,
    clientType: "platform",
    industries: store?.industries || []
  });
  const [viewMode, setViewMode] = useState(`initial`);

  const conditionalRender = () => {
    let component;
    switch (viewMode) {
      case `initial`:
        component = (
          <InitialModal
            setViewMode={setViewMode}
            closeModal={closeModal}
            viewMode={viewMode}
          />
        );
        break;
      case `search`:
        component = (
          <AddAgencyModal
            state={state}
            setState={setState}
            closeModal={closeModal}
            inviteAgency={inviteAgency}
            createClient={createClient}
            companyType={companyType}
            setViewMode={setViewMode}
            session={session}
          />
        );
        break;
      case "invite":
        component = (
          <InviteAgency
            closeModal={closeModal}
            session={session}
            company={company}
            forceUpdate={forceUpdate}
          />
        );
        break;
      default:
        component = (
          <InitialModal
            setViewMode={setViewMode}
            closeModal={closeModal}
            viewMode={viewMode}
          />
        );
        break;
    }
    return component;
  };
  return (
    <UniversalModal
      show={true}
      hide={closeModal}
      id={"addAgency"}
      width={480}
    >
      {conditionalRender()}
      </UniversalModal>
  );
}
