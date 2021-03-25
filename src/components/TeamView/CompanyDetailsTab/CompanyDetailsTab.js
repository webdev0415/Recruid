import React, { useState, useEffect } from "react";
import styled from "styled-components";
import notify from "notifications";

import AvatarIcon from "sharedComponents/AvatarIcon";
import FileUpload from "sharedComponents/FileUpload";
import { updateCompanyData } from "helpersV2/company";
import { updateCompany } from "contexts/globalContext/GlobalMethods";
import { PermissionChecker } from "constants/permissionHelpers";
import Spinner from "sharedComponents/Spinner";
const DetailsTabContainer = styled.div`
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  padding: 40px 25px;
`;

const DetailsTabAvatar = styled.div`
  display: flex;
`;

const Avatar = styled.div`
  border-radius: 50%;
  height: 100px;
  margin-right: 30px;
  object-fit: cover;
  width: 100px;
`;

const AvatarButtons = styled.div`
  align-items: center;
  display: flex;

  input[type="file"] {
    display: none;
  }

  label {
    margin-right: 15px;
  }
`;

const CompanyDetailsTab = (props) => {
  const hasProperty = (prop) => {
    if (props.state.company?.hasOwnProperty(prop)) {
      return props.state.company[prop];
    } else return ``;
  };

  let initialState = {
    avatar: hasProperty`avatar_url`,
    email: hasProperty`email`,
    id: hasProperty`id`,
    name: hasProperty`name`,
    type: hasProperty`type`,
    username: hasProperty`mention_tag`,
    website: hasProperty`website`,
  };

  const [company, setCompany] = useState(initialState);

  const [mountState, setMountState] = useState(false);

  const [showLoader, setLoader] = useState(true);

  //========================CREATE TAGS WITH EFFECTS=============================

  useEffect(() => {
    if (company !== undefined) {
      setLoader(false);
      setMountState(true);
    }
  }, [mountState, company]);

  //========================FORM SUBMISSION=============================

  const handleCompanySave = (e) => {
    e.preventDefault();
    setLoader(true);
    const nextCompany = { ...company };
    nextCompany.avatar_url = company.avatar;
    nextCompany.address_attributes = company.address ? company.address : {};
    nextCompany.mentionTag = company.username;
    updateCompanyData(props.session, company.id, nextCompany).then((res) => {
      if (!res.err) {
        notify("info", "Company successfully updated");
        updateCompany(props.store, company.username);
        if (props.onBoardingPhase) props.redirectToDashboard();
      } else {
        notify("danger", res);
      }
      setLoader(false);
    });
  };

  //========================HANDLE CHANGE TEXT INPUTS=============================

  const handleInputChange = (e) => {
    e.preventDefault();
    const property = e.target.name;
    const newValue = e.target.value;
    const changedCompany = { ...company };
    changedCompany[property] = newValue;
    setCompany(changedCompany);
  };

  //========================HANDLE FILE INPUTS=============================

  const handleFileInputChange = (e) => {
    const nextCompany = { ...company };

    let image = e.target.files[0];
    let imageBase64 = "";
    let imageName = "";
    let fileReader = new FileReader();

    fileReader.addEventListener("load", (fileReaderEvent) => {
      imageName = image.name;
      imageBase64 = fileReaderEvent.target.result;

      nextCompany.avatar = imageBase64;
      nextCompany.avatar_name = imageName;
      nextCompany.avatar_data = imageBase64;
      setCompany(nextCompany);
    });
    fileReader.readAsDataURL(image);
  };

  const removeAvatar = (e) => {
    e.preventDefault();
    const nextCompany = { ...company };
    nextCompany.avatar = null;
    nextCompany.avatar_name = null;
    nextCompany.avatar_data = null;
    setCompany(nextCompany);
  };

  const handleTooLarge = (file, maxSize) => {
    const maxSizeInMBs = maxSize / (1024 * 1024);
    notify(
      "danger",
      `${file.name} is larger than the maximum of ${maxSizeInMBs} MB`
    );
  };

  return (
    <>
      <div>
        <form onSubmit={handleCompanySave}>
          <DetailsTabContainer>
            {showLoader ? <Spinner /> : ""}
            <div className="col-md-12">
              <DetailsTabAvatar>
                <Avatar>
                  <AvatarIcon
                    imgUrl={company.avatar}
                    name={company.name}
                    size="large"
                  />
                </Avatar>
                <PermissionChecker type="edit">
                  <AvatarButtons>
                    <label
                      htmlFor="settings-avatar__button"
                      className="button button button--default button--dark"
                    >
                      Change Avatar
                    </label>
                    <FileUpload
                      id="settings-avatar__button"
                      className="settings-avatar__input"
                      onChange={handleFileInputChange}
                      onTooLarge={handleTooLarge}
                      name="avatar"
                    />
                    <button
                      className="button button--default button--white"
                      onClick={removeAvatar}
                    >
                      Remove
                    </button>
                  </AvatarButtons>
                </PermissionChecker>
              </DetailsTabAvatar>
              <hr />
              <div className="row">
                <div className="col-sm-6">
                  <label className="form-label form-heading">
                    Company Name
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    placeholder="eg. Acme or Acme Design"
                    onChange={handleInputChange}
                    value={company.name ? company.name : ""}
                    required
                    readOnly={!props.permission.edit}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label form-heading">
                    Company Type
                  </label>
                  <select
                    className="form-control"
                    type="text"
                    name="type"
                    placeholder="Company Type"
                    onChange={handleInputChange}
                    value={company.type}
                    required
                    disabled
                  >
                    <option value="" disabled hidden>
                      Select a type
                    </option>
                    <option value="Agency">Recruitment Agency</option>
                    <option value="Employer">Employer</option>
                  </select>
                </div>
                <div className="col-sm-6">
                  <label className="form-label form-heading">
                    Company Email
                  </label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    placeholder="hello@acme or acmedesign.com"
                    onChange={handleInputChange}
                    value={company.email ? company.email : ""}
                    readOnly={!props.permission.edit}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label form-heading">
                    Company Username
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="mentionTag"
                    placeholder="acme or acmedesign"
                    onChange={handleInputChange}
                    value={company.username}
                    disabled
                  />
                </div>
                {/*companyPercentage*/}
                <div className="col-sm-6">
                  <label className="form-label form-heading">
                    Company Website
                  </label>
                  <div className="input-group input-group-pre">
                    <div className="input-group-prepend">
                      <span className="input-group-text">https://</span>
                    </div>
                    <input
                      className="form-control"
                      type="text"
                      value={company.website ? company.website : ""}
                      name="website"
                      placeholder="www.acme or acmedesign.com"
                      onChange={handleInputChange}
                      style={{ height: "44px" }}
                      readOnly={!props.permission.edit}
                    />
                  </div>
                </div>
                <PermissionChecker type="edit">
                  {!props.onBoardingPhase && (
                    <div className="col-sm-12 leo-flex-center-between">
                      <button
                        className="button button--default button--primary"
                        type="submit"
                      >
                        {showLoader ? "Saving.." : "Save"}
                      </button>
                    </div>
                  )}
                </PermissionChecker>
              </div>
            </div>
          </DetailsTabContainer>
        </form>
      </div>
      {props.onBoardingPhase && (
        <div style={{ zIndex: 0 }}>
          <div />
          <button
            className="button button--default button--grey"
            onClick={handleCompanySave}
          >
            Finish
          </button>
        </div>
      )}
    </>
  );
};

export default CompanyDetailsTab;
