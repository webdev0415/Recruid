import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import MyCompaniesMenu from "../MyCompaniesMenu/MyCompaniesMenu";
import AvatarIcon from "sharedComponents/AvatarIcon";
import generalStyles from "./style/general.module.scss";

const Container = styled.div`
  @media screen and (max-width: 768px) {
    padding: 0;
  }
`;

const CompanyRow = ({ company }) => {
  return (
    <Container className="col-md-12">
      <div className={generalStyles.row}>
        <div className={generalStyles.rowCompany}>
          <Link
            to={`${company.mention_tag}/dashboard`}
            style={{ marginRight: "20px", textDecoration: "none" }}
          >
            <AvatarIcon
              name={company.name}
              imgUrl={company.avatar_url}
              size={50}
            />
          </Link>
          <div>
            <Link to={`${company.mention_tag}/dashboard`}>
              <h3 className={generalStyles.companyName}>{company.name}</h3>
            </Link>
            <span className={generalStyles.companyType}>{company.type}</span>
          </div>
        </div>
        <div className={generalStyles.rowStats}>
          <div className={generalStyles.statDiv}>
            <h1 className={generalStyles.statCount}>
              {company.candidates ? company.candidates : 0}
            </h1>
            <span className={generalStyles.statMetric}>Candidates</span>
          </div>
          <div className={generalStyles.statDiv}>
            <h1 className={generalStyles.statCount}>{company.jobs_count}</h1>
            <span className={generalStyles.statMetric}>Jobs</span>
          </div>
          <div className={generalStyles.statDiv}>
            <h1 className={generalStyles.statCount}>{company.hire_rate}%</h1>
            <span className={generalStyles.statMetric}>Hire Rate</span>
          </div>
          <div className="mobile">
            <Link
              to={`${company.mention_tag}/dashboard`}
              className="button button--default button--blue-dark"
            >
              Open
            </Link>
          </div>
          <div className="desktop">
            <MyCompaniesMenu company={company} />
          </div>
        </div>
      </div>
    </Container>
  );
};
export default CompanyRow;
