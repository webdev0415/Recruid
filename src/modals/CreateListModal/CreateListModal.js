import React, { useState, useEffect, useContext } from "react";
import notify from "notifications";
import GlobalContext from "contexts/globalContext/GlobalContext";

import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
  ModalFooter,
} from "modals/UniversalModal/UniversalModal";

import ListDetails from "modals/CreateListModal/ListDetails";
import ProfilesList from "modals/CreateListModal/ProfilesList";
import SelectExistingList from "modals/CreateListModal/SelectExistingList";

import styled from "styled-components";
import {
  createReceiversList,
  udpateReceiver,
} from "helpersV2/marketing/receivers";

const CreateListModal = ({
  hide,
  modalType,
  refreshList,
  editingList,
  parentReceivers,
}) => {
  const store = useContext(GlobalContext);

  const [stageView, setStageView] = useState(undefined);
  const [list, setList] = useState({
    name: "",
    receiver_type: "",
  });
  const [originalReceivers, setOriginalReceivers] = useState(undefined);

  useEffect(() => {
    if (!modalType || modalType === "create" || modalType === "edit_list") {
      setStageView("initial");
    }
    if (modalType === "add_users" || modalType === "view_list") {
      setStageView("select-profiles");
    }
    if (modalType === "create_with_candidates") {
      setList({ ...list, receiver_type: "ProfessionalTalentNetwork" });
      setStageView("initial");
    }
    if (modalType === "create_with_contacts") {
      setList({ ...list, receiver_type: "Contact" });
      setStageView("initial");
    }
    if (
      modalType === "add_contacts_to_list" ||
      modalType === "add_candidates_to_list"
    ) {
      setStageView("add_with_receivers");
    }
     
  }, [modalType]);

  useEffect(() => {
    if (editingList) {
      setList(editingList);
      setOriginalReceivers([...editingList.list]);
    }
  }, [editingList]);

  const continueToList = () => {
    if (!list.name) {
      return notify("danger", "List must have a name");
    }
    if (!list.receiver_type) {
      return notify("danger", "You must select a type of list");
    }
    setStageView("select-profiles");
  };

  const createList = () => {
    if (modalType.includes("create")) {
      createReceiversList(store.company.id, store.session, {
        ...list,
        company_id: store.company.id,
      }).then((res) => {
        if (!res.err) {
          refreshList();
          notify("info", "List succesfully created");
          hide();
        } else {
          notify("danger", "Unable to create list");
        }
      });
    } else {
      udpateReceiver(store.company.id, store.session, undefined, {
        ...list,
        list:
          originalReceivers &&
          originalReceivers.length > 0 &&
          modalType.includes("add")
            ? [...originalReceivers, ...list.list]
            : list.list,
      }).then((res) => {
        if (!res.err) {
          refreshList();
          notify("info", "List succesfully updated");
          hide();
        } else {
          notify("danger", "Unable to update list");
        }
      });
    }
  };

  const selectList = () => {
    setOriginalReceivers([...(list?.list || [])]);
    setStageView("select-profiles");
  };

  return (
    <UniversalModal
      show={true}
      hide={hide}
      id="create-list-modal"
      width={stageView === "initial" ? 480 : 960}
    >
      <ModalHeaderClassic
        title={
          !modalType || modalType === "create"
            ? "Create List"
            : modalType.includes("add")
            ? "Select a List"
            : modalType === "view_list"
            ? list.name
            : "Edit List"
        }
        closeModal={hide}
      />
      <STModalBody style={{ padding: 0, textAlign: "left" }}>
        {stageView === "initial" && (
          <ListDetails
            list={list}
            setList={setList}
            store={store}
            modalType={modalType}
            originalReceivers={originalReceivers}
          />
        )}
        {stageView === "add_with_receivers" && (
          <SelectExistingList
            store={store}
            modalType={modalType}
            setList={setList}
            activeList={list}
          />
        )}
        {stageView === "select-profiles" && (
          <ProfilesList
            list={list}
            setList={setList}
            store={store}
            originalReceivers={originalReceivers}
            parentReceivers={parentReceivers}
            modalType={modalType}
          />
        )}
      </STModalBody>
      <ModalFooter hide={hide}>
        {stageView === "initial" && (
          <button
            id="forward"
            className="button button--default button--blue-dark"
            onClick={() =>
              modalType === "edit_list" && originalReceivers.length === 0
                ? createList()
                : continueToList()
            }
            style={{ maxWidth: "max-content" }}
          >
            {modalType === "edit_list" && originalReceivers.length === 0
              ? "Save"
              : "Next"}
          </button>
        )}
        {stageView === "select-profiles" && modalType !== "view_list" && (
          <button
            id="forward"
            className="button button--default button--blue-dark"
            onClick={() => createList()}
            style={{ maxWidth: "max-content" }}
          >
            {modalType.includes("create") && "Create"}
            {modalType.includes("add") && "Add"}
            {modalType === "edit_list" && "Edit"}
          </button>
        )}
        {stageView === "add_with_receivers" && (
          <button
            id="forward"
            className="button button--default button--blue-dark"
            onClick={() => selectList()}
            style={{ maxWidth: "max-content" }}
          >
            Select
          </button>
        )}
      </ModalFooter>
    </UniversalModal>
  );
};

export default CreateListModal;

const STModalBody = styled(ModalBody)`
  padding: 30px !important;
  text-align: center;
`;
