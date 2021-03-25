import React, { useReducer } from "react";
// Styles
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
// Constants
import { API_ROOT_PATH } from "constants/api";
import notify from "notifications";
import {
  ModalBody,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";

const STModalBody = styled(ModalBody)`
  .invite-agency-container {
    margin: 0 auto;
    max-width: 360px;
    padding: 30px 0 50px;
    width: 100%;
  }
`;

const SubTitle = styled.div`
  color: #74767b;
  font-size: 14px;
  letter-spacing: -0.3px;
  line-height: 20px;
  margin-bottom: 20px;
  text-align: center;
`;

const InviteAgency = ({ closeModal, session, company, forceUpdate }) => {
  const initialState = {
    name: ``,
    contact_name: ``,
    contact_title: ``,
    contact_email: ``,
    contact_number: ``,
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case `name`:
        return { ...state, name: action.payload };
      case `contact_name`:
        return { ...state, contact_name: action.payload };
      case `contact_title`:
        return { ...state, contact_title: action.payload };
      case `contact_email`:
        return { ...state, contact_email: action.payload };
      case `contact_number`:
        return { ...state, contact_number: action.payload };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const validation = () => {
    // eslint-disable-next-line
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (state.name === `` || state.contact_name === ``) {
      notify("danger", "Name can't be blank");
      return false;
    }
    if (!state.contact_email.match(emailPattern)) {
      notify("danger", "Email doesn't match the pattern");
      return false;
    }
    return true;
  };

  const addAgencyAndLogIn = async () => {
    const body = {
      ...state,
      employer_name: company.name,
      employer_avatar_url: company.avatar_url,
      employer_description: company.description,
      // employer_location: company.localizations[0].location.name
    };

    const url = `${API_ROOT_PATH}/v1/clients/${company.id}/add_agency_to_vendors`;
    const params = {
      method: "POST",
      headers: session,
      body: JSON.stringify(body),
    };
    try {
      const sendData = await fetch(url, params);
      const response = await sendData.json();
      if (
        response.hasOwnProperty(`message`) &&
        response.message === "This person already exists on platform"
      ) {
        notify("danger", "Email has already been taken!");
      } else {
        notify("info", "Invitation has been sent successfully!");
        forceUpdate(true);
        closeModal();
      }
    } catch (e) {
      console.error(`Failed to send invitation to the contact: ${e}`);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (validation()) {
      addAgencyAndLogIn();
    } else return false;
  };

  return (
    <>
      <ModalHeaderClassic title="Add Agency" closeModal={closeModal} />
      <STModalBody className="no-footer">
        <div className="invite-agency-container">
          <SubTitle>
            Invite an external agency to Leo and keep track of your candidates
            in one place.
          </SubTitle>
          <Row>
            <Col sm={12}>
              <label className="form-label form-heading form-heading-small">
                Agency Name
              </label>
              <input
                className="form-control"
                type="text"
                name="name"
                value={state.name}
                onChange={(e) =>
                  dispatch({ type: e.target.name, payload: e.target.value })
                }
              />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <label className="form-label form-heading form-heading-small">
                Contact Name
              </label>
              <input
                className="form-control"
                type="text"
                name="contact_name"
                value={state.contact_name}
                onChange={(e) =>
                  dispatch({ type: e.target.name, payload: e.target.value })
                }
              />
            </Col>
            <Col sm={6}>
              <label className="form-label form-heading form-heading-small">
                Contact Title
              </label>
              <input
                className="form-control"
                type="text"
                name="contact_title"
                value={state.contact_title}
                onChange={(e) =>
                  dispatch({ type: e.target.name, payload: e.target.value })
                }
              />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <label className="form-label form-heading form-heading-small">
                Contact Email
              </label>
              <input
                className="form-control"
                type="email"
                name="contact_email"
                value={state.contact_email}
                onChange={(e) =>
                  dispatch({ type: e.target.name, payload: e.target.value })
                }
              />
            </Col>
            <Col sm={6}>
              <label className="form-label form-heading form-heading-small">
                Contact Number
              </label>
              <input
                className="form-control"
                type="tel"
                name="contact_number"
                value={state.contact_number}
                onChange={(e) =>
                  dispatch({ type: e.target.name, payload: e.target.value })
                }
              />
            </Col>
          </Row>
          <Row>
            <button
              className={`button button--default button--blue-dark`}
              style={{ margin: `0 auto` }}
              onClick={onSubmit}
            >
              Send Invite
            </button>
          </Row>
        </div>
      </STModalBody>
    </>
  );
};

export default InviteAgency;
