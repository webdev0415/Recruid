import React from "react";
import { Link } from "react-router-dom";
import { AWS_CDN_URL } from "constants/api";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import InnerPage from "PageWrappers/InnerPage";
import { ROUTES } from "routes";
const NotFound = () => {
  return (
    <InnerPage pageTitle="Page Not Found">
      <div>
        <div className={sharedStyles.emptyContainer}>
          <div className={sharedStyles.empty}>
            <img src={`${AWS_CDN_URL}/icons/empty-icons/empty-team.svg`} alt="not found illustration" />
            <h2>404 Not Found</h2>
            <p>
              Were sorry the page your looking for cannot be found, click below
              to head back to the dashboard.
            </p>
            <Link
              className="button button--default button--blue-dark"
              to={ROUTES.MyCompanies.url()}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </InnerPage>
  );
};

export default NotFound;
