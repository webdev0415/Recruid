import React, { useState, Fragment, useRef, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
// import styled from "styled-components";
import Toggle from "sharedComponents/Toggle";
// import { API_ROOT_PATH } from "constants/api";
import TagsComponent from "sharedComponents/TagsComponent";

import ImportCard from "sharedComponents/rds/ImportCard";
import styled from "styled-components";
import {
  getPersonsPreviewData,
  getPersonsImportData,
} from "helpers/rds/rds.helpers";

import notify from "notifications";

const Form = ({
  formControl,
  setFormControl,
  setViewMode,
  setParentsViewMode,
  setTalentRdsData,
  setRdsImportPreview,
  importRdsData,
  setImportRdsData,
  defaultLocations,
  rdsImportPreview,
}) => {
  const store = useContext(GlobalContext);
  const [error, setError] = useState({
    name: false,
    email: false,
  });
  const reqTimeout = useRef(null);
  // eslint-disable-next-line
  const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleTextChange = (event) => {
    const propName = event.target.name;
    const value = event.target.value;
    setFormControl({
      ...formControl,
      [propName]: value,
    });
    if (
      (propName === "email" || propName === "name") &&
      (error.name || error.email)
    ) {
      setError({ ...error, [propName]: false });
    }
  };

  const handleDelayedRequest = async (emailInput) => {
    const rdsData = await getPersonsPreviewData(emailInput);
    if (!rdsData.error) {
      return setRdsImportPreview(rdsData);
    }
    return setImportRdsData(false);
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setFormControl((state) => ({
      ...state,
      email: value,
    }));
  };

  const handleEmailKeyUp = (emailInput) => {
    if (!emailPattern.test(emailInput)) return false;
    clearTimeout(reqTimeout.current);
    reqTimeout.current = setTimeout(
      () => handleDelayedRequest(emailInput),
      750
    );
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setFormControl({
      ...formControl,
      custom_source_id: Number(value),
    });
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.checked;
    setFormControl({
      ...formControl,
      consent: value,
    });
  };

  const validation = () => {
    if (!formControl.name && !formControl.email) {
      setError({ ...error, name: true, email: true });
      return false;
    }
    if (!formControl.name) {
      setError({ ...error, name: true });
      return false;
    }
    if (!formControl.email) {
      setError({ ...error, email: true });
      return false;
    }
    if (!emailPattern.test(formControl.email)) {
      setError({
        ...error,
        email: true,
        additionalInfo: "Invalid email format",
      });
      return false;
    }
    return true;
  };

  const handleNextClick = () => {
    if (validation()) setViewMode(`talent-experience`);
  };

  const handleDataImport = (id) => async () => {
    const importData = await getPersonsImportData(id);
    if (!importData.error) {
      setTalentRdsData(importData);
      return setImportRdsData(true);
    }
    return notify("danger", "Couldn't import the data from the server");
  };

  const handleImportCancel = () => setImportRdsData(false);

  return (
    <>
      <div className="row">
        <div className="col-sm-6">
          {error.email && (
            <p className="form-label form-heading" style={{ color: "red" }}>
              Please add an email for the candidate.
              {error.additionalInfo && error.additionalInfo}
            </p>
          )}
          <label className="form-label form-heading">Email</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={formControl.email}
            onChange={handleEmailChange}
            onKeyUp={() => handleEmailKeyUp(formControl.email)}
            onPaste={(e) => {
              let target = e.target;
              setTimeout(function () {
                handleEmailKeyUp(target.value);
              }, 0);
            }}
            placeholder="Email"
            required
          />
        </div>
        <div className="col-sm-6">
          {error.name && (
            <p className="form-label form-heading" style={{ color: "red" }}>
              Please add a name for the candidate.
            </p>
          )}
          <label className="form-label form-heading">Name</label>
          <input
            className="form-control"
            type="text"
            name="name"
            value={formControl.name}
            onChange={handleTextChange}
            placeholder="Name"
            required
          />
        </div>
      </div>
      {importRdsData !== undefined ? (
        <Fragment>
          <div className="row">
            <div className="col-sm-6">
              <label className="form-label form-heading">Source</label>
              <select
                defaultValue=""
                onChange={handleSelectChange}
                className="form-control form-control-select"
              >
                <option value="" disabled hidden>
                  Please select a source
                </option>
                {store.sources &&
                  store.sources.map((source, index) => (
                    <option key={`source-${index}`} value={source.id}>
                      {source.source}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-sm-6">
              <label className="form-label form-heading">Locations</label>
              <TagsComponent
                type="locations"
                originalTags={defaultLocations}
                returnTags={(localizations_attributes) =>
                  setFormControl({ ...formControl, localizations_attributes })
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <label className="form-label form-heading">Industries</label>
              <TagsComponent
                type="industries"
                returnTags={(categorizations_attributes) =>
                  setFormControl({ ...formControl, categorizations_attributes })
                }
              />
            </div>
            <div className="col-sm-6">
              <label className="form-label form-heading">Skills</label>
              <TagsComponent
                type="skills"
                returnTags={(competencies_attributes) =>
                  setFormControl({
                    ...formControl,
                    competencies_attributes,
                  })
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <label className="form-label form-heading">Summary</label>
              <textarea
                className="form-control"
                type="text"
                name="description"
                value={formControl.description}
                placeholder="Enter Summary"
                onChange={handleTextChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="row leo-flex leo-relative">
                <div className="col-sm-1">
                  <div className="leo-relative" style={{ top: "3px" }}>
                    <Toggle
                      name="consent"
                      toggle={handleCheckboxChange}
                      checked={formControl.consent}
                    />
                  </div>
                </div>
                <div className="col-sm-11">
                  <label className="form-label form-heading">
                    Do you have the users permission to hold their data? If you
                    do not have consent the user will be emailed a request to be
                    a part of your talent network.
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      ) : null}
      {!!rdsImportPreview && importRdsData === undefined && (
        <ImportCard
          rdsPreviewData={rdsImportPreview}
          handleDataImport={handleDataImport}
          handleImportCancel={handleImportCancel}
        />
      )}
      {importRdsData !== undefined ? (
        <Footer className="leo-flex-center-center leo-width-full">
          <button
            className="button button--default button--grey-light"
            onClick={() => setParentsViewMode(`initial`)}
          >
            Back
          </button>
          <button
            className="button button--default button--blue-dark"
            onClick={handleNextClick}
          >
            Next
          </button>
        </Footer>
      ) : (
        ""
      )}
    </>
  );
};

export default Form;

const Footer = styled.div`
  padding: 30px 0;
  padding-bottom: 0;
  button {
    margin-left: 5px;
    margin-right: 5px;
    max-width: 130px;
    min-width: 130px;
    width: 100%;
  }
`;

// const RdsDataMatchBox = styled.div`
//   border: 1px solid #eee;
//   border-radius: 4px;
//   margin-bottom: 20px;
//   max-width: 460px;
//   min-width: 300px;
//   padding: 15px 20px;
//
//   .rds-name {
//     color: #1e1e1e;
//     font-size: 14px;
//     font-weight: 500;
//     margin-bottom: 5px;
//   }
//
//   .rds-current,
//   .rds-previous {
//     color: #74767b;
//     font-size: 12px;
//     line-height: 20px;
//   }
//
//   .rds-email {
//     font-size: 12px;
//     color: #2a3744;
//     text-decoration: underline;
//   }
// `;
