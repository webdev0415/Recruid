import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Tooltip from "react-simple-tooltip";
import styled from "styled-components";
import { ROUTES } from "routes";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";

const VendorInviteLabel = styled.span`
  background: rgba(255, 49, 89, 0.2);
  border-radius: 4px;
  color: #ff3159;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-left: 10px;
  padding: 4px 8px;
  text-transform: uppercase;
`;

const VendorName = styled.div`
  align-items: center;
  display: flex;
`;

const VendorsTable = (props) => {
  const [sortedVendors, setSortedVendors] = useState([]);
  const sortByName = (arr) => {
    let sortedArr;
    sortedArr =
      !!arr &&
      arr.sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        } else return 0;
      });
    return sortedArr;
  };
  useEffect(() => setSortedVendors(sortByName(props.vendors)), [props.vendors]);

  return (
    <Container>
      <div className="table-responsive">
        <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col" className={sharedStyles.tableHeader}>
                {props.companyType === "Agency" ? "Client Name" : "Agency Name"}
              </th>
              <th scope="col" className={sharedStyles.tableStatus}>
                Industry
              </th>
              <th scope="col" className={sharedStyles.tableStatus}>
                Jobs
              </th>
              <th scope="col" className={sharedStyles.tableStatus}>
                <Tooltip
                  content={
                    props.companyType === "Employer"
                      ? "Candidates"
                      : "Submitted Candidates"
                  }
                  placement="bottom"
                  fontSize="10px"
                  padding={10}
                  style={{
                    lineHeight: "16px",
                  }}
                >
                  <>
                    {props.companyType === "Employer"
                      ? "Candidates"
                      : "Cand (Subm)"}
                  </>
                </Tooltip>
              </th>
              {/*<th scope="col" className={sharedStyles.tableDate}>
              Hire Rate
            </th>*/}
              {/* <th scope="col" className={sharedStyles.tableHeader} /> */}
            </tr>
          </thead>
          <tbody>
            {!!sortedVendors &&
              sortedVendors.map((vendor, index) => {
                return (
                  <tr key={`vendor_${index}`} className="table-row-hover">
                    <th scope="row" className={sharedStyles.tableItemFirst}>
                      {!vendor.invited_by_client ? (
                        <Link
                          to={ROUTES.VendorPage.url(
                            props.company.mention_tag,
                            vendor.id
                          )}
                        >
                          {vendor.name}
                        </Link>
                      ) : (
                        <VendorName>
                          {vendor.name}
                          <VendorInviteLabel>Invite Pending</VendorInviteLabel>
                        </VendorName>
                      )}
                    </th>
                    <td className={sharedStyles.tableItem}>
                      {vendor.categorizations.length > 0
                        ? vendor.categorizations[0].name
                        : ""}
                    </td>
                    <td className={sharedStyles.tableItem}>{vendor.jobs}</td>
                    <td className={sharedStyles.tableItem}>
                      {vendor.candidates}
                    </td>
                    {/*<td className={sharedStyles.tableItem}>
                  {vendor.hire_rate + "%"}
                </td>*/}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {props.hasMorePages && (
        <div className={sharedStyles.loadMoreContainer}>
          <button
            className={sharedStyles.loadMore}
            onClick={() => props.loadMoreData()}
          >
            Load More
          </button>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  background: #fff;
  border-radius: 0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  margin-left: -15px;
  margin-right: -15px;
  overflow: hidden;

  @media screen and (min-width: 768px) {
    border-radius: 4px;
    margin: 0;
  }
`;

export default VendorsTable;
