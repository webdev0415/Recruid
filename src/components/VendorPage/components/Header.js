import React, { useState } from "react";
import styled from "styled-components";
// import EditVendorProfile from "./EditVendorProfile";

// for job search
import styles from "components/Vendors/components/VendorsBanner/style/viewJobBanner.module.scss";
import GuestEmployer from "sharedComponents/GuestEmployer";
import ATSBanner from "sharedComponents/ATSBanner";
import { PermissionChecker } from "constants/permissionHelpers";
import { ATSContainer } from "styles/PageContainers";

const Header = ({
  vendor,
  company,
  viewMode,
  openModal,
  handleSearchKeyUp,
  togglePipelineView,
  pipelineViewEnabled,
}) => {
  const [jobTitle, setJobtitle] = useState("");
  const handleJobSearch = (event) => setJobtitle(event.target.value);
  return (
    <>
      <ATSBanner
        name={vendor?.name}
        avatar={vendor?.avatar_url}
        page={`${viewMode[0].toUpperCase()}${viewMode.substring(1)}`}
      >
        <>
          {vendor && (
            <>
              {viewMode === `overview` && (
                <>
                  {vendor.offline === true &&
                    vendor.mention_tag &&
                    vendor.mention_tag.length > 0 && (
                      <>
                        <button
                          style={{ marginRight: `15px` }}
                          className={`button button--default button--blue-dark`}
                          onClick={() => openModal("EditVendorProfile")}
                        >
                          Edit{" "}
                          {company.type === "Employer" ? "Agency" : "Client"}{" "}
                          Profile
                        </button>
                      </>
                    )}
                  <PermissionChecker type="edit">
                    <button
                      onClick={() => openModal(`confirmation`)}
                      className={`button button--default button--grey-light`}
                    >
                      {vendor.archived ? `Restore` : `Archive`}
                    </button>
                  </PermissionChecker>
                </>
              )}
              {company.type === "Agency" && viewMode === "jobs" && (
                <>
                  <label
                    className="leo-flex"
                    style={{
                      alignItems: "center",
                      fontSize: 12,
                      padding: "9px 0",
                    }}
                  >
                    Pipeline View
                    <StyledInput
                      id={`consent-checkbox`}
                      type={`checkbox`}
                      name={`consent`}
                      onChange={togglePipelineView(pipelineViewEnabled)}
                    />
                    <label htmlFor={`consent-checkbox`} />
                  </label>
                </>
              )}
              {viewMode === "jobs" && (
                <div
                  className={styles.inputContainer}
                  style={{ marginLeft: 30 }}
                >
                  <div>
                    <input
                      className={styles.form}
                      placeholder="Search..."
                      onChange={handleJobSearch}
                      onKeyUp={() => handleSearchKeyUp(jobTitle)}
                      onPaste={(e) => {
                        let target = e.target;
                        setTimeout(function () {
                          handleSearchKeyUp(target.value);
                        }, 0);
                      }}
                    />
                    <li className="fas fa-search search" />
                  </div>
                  <div />
                </div>
              )}
            </>
          )}
        </>
      </ATSBanner>
      {company &&
        (company.invited_by_agency ||
          company.invited_by_employer ||
          company.trial !== "upgraded") && (
          <ATSContainer>
            <GuestEmployer
              vendor={vendor}
              upgradeFunction={() => openModal("UpgradeModal")}
            />
          </ATSContainer>
        )}
    </>
  );
};
export default Header;

const StyledInput = styled.input`
  opacity: 0;
  position: absolute;

  & + label {
    cursor: pointer;
    position: relative;
    padding: 0;

    background: #eeeeee;
    border-radius: 10px;
    height: 20px;
    margin-left: 10px;
    width: 40px;
  }

  & + label:before {
    content: "";
    background: #74767b;
    border-radius: 8px;
    display: block;
    height: 16px;
    left: 2px;
    position: absolute;
    top: 2px;
    width: 16px;
  }

  &:focus + label:before {
    box-shadow: none;
  }

  &:checked + label {
    background: #00cba7;
  }

  // Box checked
  &:checked + label:before {
    background: #fff;
    left: auto;
    right: 2px;
  }
`;
