import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { API_ROOT_PATH } from "constants/api";
import { ROUTES } from "routes";
import styled from "styled-components";
const ArchivedVendors = (props) => {
  const [archivedVendors, setArchivedVendors] = useState([]);

  useEffect(() => {
    (async function fetchArchivedVendors() {
      const target = props.company.type === `Agency` ? `clients` : `vendors`;
      const url = `${API_ROOT_PATH}/v1/${target}/${props.company.id}/all_archived`;
      const params = { method: `GET`, headers: props.session };
      try {
        const getData = await fetch(url, params);
        return await getData.json();
      } catch (err) {
        console.error(`Error getting archived vendors: ${err}`);
      }
    })().then((response) => setArchivedVendors(response));
  }, [props.company.id, props.company.type, props.session]);
  return (
    <Container>
      <div className="table-responsive">
        <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col" className={sharedStyles.tableHeader}>
                {props.companyType === "Agency" ? "Client Name" : "Agency Name"}
              </th>
              <th scope="col" className={sharedStyles.tableHeader}>
                Industry
              </th>
              <th scope="col" className={sharedStyles.tableHeader}>
                Jobs
              </th>
              <th scope="col" className={sharedStyles.tableStatus}>
                Candidates
              </th>
              {/*<th scope="col" className={sharedStyles.tableDate}>
              Hire Rate
            </th>*/}
            </tr>
          </thead>
          <tbody>
            {archivedVendors &&
              archivedVendors.map((vendor, index) => {
                return (
                  <tr key={`vendor_${index}`} className="table-row-hover">
                    <th scope="row" className={sharedStyles.tableItemFirst}>
                      <Link
                        to={ROUTES.VendorPage.url(
                          props.company.mention_tag,
                          vendor.id
                        )}
                      >
                        {vendor.name}
                      </Link>
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

export default ArchivedVendors;
