import React from "react";
import styled from "styled-components";

import AvatarIcon from "sharedComponents/AvatarIcon";

import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { AWS_CDN_URL } from "constants/api";

const ManageAgencies = ({
  vendors,
  inviteVendorToJob,
  removeVendorFromJob,
}) => {
  return (
    <ManageAgencyContainer className={sharedStyles.tableContainer}>
      <ManageAgencyHeader>
        <h5>Manage Agencies for this job</h5>
      </ManageAgencyHeader>
      <ManageAgencyBody>
        {vendors && vendors.length > 0 ? (
          vendors.map((vendor, index) => {
            return (
              <AgencyCell
                agency={vendor}
                index={index}
                key={`teammember_${index}`}
                inviteVendorToJob={() => inviteVendorToJob(index)}
                removeVendorFromJob={() => removeVendorFromJob(index)}
              />
            );
          })
        ) : (
          <div
            className="leo-flex"
            style={{
              alignItems: "center",
              height: "100%",
            }}
          >
            <div
              className={sharedStyles.empty}
              style={{ margin: "-20px auto 0" }}
            >
              <img
                src={`${AWS_CDN_URL}/icons/empty-icons/empty-calendar.svg`}
                alt="You haven't added any agencies"
                style={{ height: "150px", marginBottom: "10px" }}
              />
              <h3>{`You haven't added any agencies`}</h3>
            </div>
          </div>
        )}
      </ManageAgencyBody>
    </ManageAgencyContainer>
  );
};

export default ManageAgencies;

const ManageAgencyContainer = styled.div`
  grid-column: span 2;
  margin: 0 !important;
`;

const ManageAgencyHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding: 10px 20px;
  position: relative;

  h5 {
    color: #9a9ca1;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.67px;
    text-transform: uppercase;
  }
`;

const ManageAgencyBody = styled.div`
  height: 100%;
  max-height: 253px;
  overflow-y: auto;
`;

function AgencyCell({ agency, index, inviteVendorToJob, removeVendorFromJob }) {
  return (
    <div
      className="job-post-cell-item"
      key={`member_${index}`}
      style={{ padding: "15px 20px" }}
    >
      <div className="job-post-cell-details">
        <div
          style={{
            marginRight: "15px",
          }}
        >
          <AvatarIcon name={agency.name} imgUrl={agency.avatar} size={50} />
        </div>
        <div>
          <span className="cell-title">{agency.name}</span>
        </div>
      </div>
      <div className="job-post-cell-options" style={{ cursor: "pointer" }}>
        {agency.status === "Remove" && (
          <div onClick={() => removeVendorFromJob()}>
            <img src={`${AWS_CDN_URL}/icons/SelectedMark.svg`} alt="" />
          </div>
        )}
        {agency.status === "Add" && (
          <div onClick={() => inviteVendorToJob()}>
            <img src={`${AWS_CDN_URL}/icons/AddMark.svg`} alt="" />
          </div>
        )}
      </div>
    </div>
  );
}
