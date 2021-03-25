import React, { Fragment, useEffect, useState } from "react";
import helpers from "helpers/sharedHelpers";
import modalStyles from "assets/stylesheets/scss/collated/modals.module.scss";
import {
  ModalBody,
  ModalHeaderClassic,
} from "modals/UniversalModal/UniversalModal";
import styled from "styled-components";
export default function AddAgencyModal({
  state,
  setState,
  closeModal,
  inviteAgency,
  createClient,
  companyType,
  setViewMode,
  session,
}) {
  const [agencies, setAgencies] = useState([]);
  const [filteredAgencies, setFilteredAgencies] = useState([]);
  const [displayDropDown, setDisplayDropDown] = useState(false);
  //
  useEffect(() => {
    if (session) {
      helpers.fetchAgencies(session).then((response) => {
        setAgencies(response);
        setFilteredAgencies(response);
      });
    }
  }, [session]);

  const filterByName = () => {
    return agencies.filter((agency) => {
      return agency.name.toLowerCase().includes(state.name.toLowerCase());
    });
  };

  useEffect(() => {
    setFilteredAgencies(filterByName());
  }, [state.name.length]);

  const designation = companyType === "Employer" ? "Agency" : "Client";

  return (
    <>
      <ModalHeaderClassic
        title={`Add ${designation}`}
        closeModal={closeModal}
      />
      <ModalBody className="no-footer">
        <Form>
          <div className="leo-relative" style={{ marginBottom: "20px" }}>
            {companyType === "Agency" ? (
              <input
                type="text"
                className="form-control"
                name="title"
                autoComplete="off"
                style={{ marginBottom: "0px" }}
                placeholder={`Enter the ${designation}'s Name`}
                onChange={(e) => {
                  setState({ ...state, name: e.target.value });
                }}
                value={state.name}
                required
              />
            ) : (
              <Fragment>
                <div className="row">
                  <div className="col-sm-12">
                    <label className="form-label form-heading form-heading-small">
                      Select an agency from our platform
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      autoComplete="off"
                      style={{ marginBottom: "0px" }}
                      placeholder={`Enter the ${designation}'s Name`}
                      onChange={(e) => {
                        setState({ ...state, name: e.target.value });
                      }}
                      value={state.name}
                      onFocus={() => setDisplayDropDown(true)}
                      onBlur={() =>
                        setTimeout(() => setDisplayDropDown(false), 150)
                      }
                      required
                    />
                  </div>
                </div>
              </Fragment>
            )}
            {displayDropDown && (
              <div
                className="leo-absolute leo-width-full"
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: "3px",
                }}
              >
                <div style={{ maxHeight: "250px", overflowY: "scroll" }}>
                  {companyType !== "Agency" &&
                    filteredAgencies.length > 0 &&
                    filteredAgencies.map((agency, index) => {
                      return (
                        <span
                          key={`agency_${index}`}
                          style={{
                            padding: "10px",
                            background: "white",
                            fontWeight: "515",
                            borderBottom:
                              index !== filteredAgencies.length - 1 &&
                              "1px solid #e5e5e5",
                          }}
                          onClick={() =>
                            setState({
                              ...state,
                              client: agency,
                              name: agency.name,
                              clientType: "platform",
                            })
                          }
                        >
                          {agency.name}
                        </span>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
          {state.clientType === "offline" && (
            <>
              <label className="form-label form-heading form-heading-small">
                {designation} Industry
              </label>
              <input
                type="email"
                className="form-control"
                name="title"
                placeholder="Technology..."
                onChange={(e) =>
                  setState({ ...state, industry: e.target.value })
                }
                required
              />
            </>
          )}
        </Form>
        <div className={modalStyles.modalFooter}>
          <button
            className="button button--default button--grey-light"
            onClick={() => setViewMode(`initial`)}
          >
            Back
          </button>
          <button
            className="button button--default button--blue-dark"
            onClick={() => {
              if (companyType === "Employer") {
                inviteAgency(state.client);
              } else {
                if (state.clientType === "platform") {
                  createClient({
                    employer_id: state.client.id,
                    offline: false,
                  });
                } else {
                  if (state.name === "" || state.industry === "") {
                    alert("Please fill in a name & industry");
                  } else {
                    let payload = {
                      offline: true,
                      name: state.name,
                      industry: state.industry,
                    };
                    if (state.logo) payload.logo = state.logo;
                    createClient(payload);
                  }
                }
              }
            }}
          >
            Add
          </button>
        </div>
      </ModalBody>
    </>
  );
}

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
