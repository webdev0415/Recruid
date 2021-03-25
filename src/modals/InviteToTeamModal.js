import React, { useState, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import { getTeamMembers } from "contexts/globalContext/GlobalMethods";
import notify from "notifications";
import Modal from "react-bootstrap/Modal";
import { addTeamMember } from "helpersV2/teamMembers";
import styled from "styled-components";
import PermissionScreen from "modals/ChangePermissionModal/PermissionScreen";
import Spinner from "sharedComponents/Spinner";

const InviteToTeamModal = ({ show, onHide }) => {
  const store = useContext(GlobalContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestPending, setRequestPending] = useState(false);
  const [modalView, setModalView] = useState("initial");
  const [permission, setPermission] = useState("member");
  const [roles, setRoles] = useState({
    recruiter: true,
    hiring_manager: false,
    marketer: false,
    business: false,
  });

  const handleFormSubmit = async () => {
    const { session, company, dispatch } = store;
    //gather permissions here
    //if all roles false and not owner (or admin) return error
    let newRoles = Object.entries(roles)
      .filter((role) => role[1])
      .map((role) => role[0]);
    if (permission !== "owner" && newRoles.length === 0) {
      return notify("danger", "Member must have at least one role");
    }
    setRequestPending(true);

    const teamMember = await addTeamMember(company.id, session, {
      name,
      email,
      permission,
      roles: newRoles,
    });
    if (!teamMember.error) {
      notify("info", "Team member has been successfully added");
      await getTeamMembers(dispatch, session, company.id);
      setRequestPending(false);
      return onHide();
    }
    setRequestPending(false);
    return notify(
      "danger",
      teamMember?.message ?? "Error while adding a team member"
    );
  };

  const moveToPermission = () => {
    if (!name) {
      return notify("danger", "Member must have a name");
    }
    if (!email) {
      return notify("danger", "Member must have an email");
    }
    setModalView("permission");
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Dialog>
        <Header closeButton>
          <Title>Add Team Member</Title>
        </Header>
        <ModalBody>
          {modalView === "initial" && (
            <Form>
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Jane Doe"
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="janedoe@domain.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form>
          )}
          {modalView === "permission" && (
            <PermissionScreen
              roles={roles}
              setRoles={setRoles}
              permission={permission}
              setPermission={setPermission}
              store={store}
            />
          )}
        </ModalBody>
        <Modal.Footer>
          {requestPending ? (
            <Spinner />
          ) : (
            <>
              <button
                className="button button--default button--grey-light"
                onClick={onHide}
              >
                Cancel
              </button>
              {modalView === "initial" && (
                <button
                  className="button button--default button--blue-dark"
                  onClick={() => moveToPermission()}
                >
                  Next
                </button>
              )}
              {modalView === "permission" && (
                <button
                  className="button button--default button--blue-dark"
                  onClick={handleFormSubmit}
                >
                  Confirm
                </button>
              )}
            </>
          )}
        </Modal.Footer>
      </Modal.Dialog>
    </Modal>
  );
};

export default InviteToTeamModal;

const Header = styled(Modal.Header)`
  flex-direction: row;
`;

const Title = styled.h2`
  font-size: 22px;
  margin: 10px 0;
  text-align: right;
  flex-grow: 0.6;
`;

const ModalBody = styled(Modal.Body)`
  background: #fff;
  padding-bottom: 60px;
`;

const Form = styled.div`
  margin: 0 auto;
  max-width: 360px;
  padding-top: 30px;
  width: 100%;

  input,
  select {
    margin-bottom: 15px;

    &:last-child {
      margin: 0;
    }
  }
`;
