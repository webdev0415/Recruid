import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "routes";
import { AWS_CDN_URL } from "constants/api";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";

export default function Unauthorized() {
  return (
    <div>
      <div
        className={sharedStyles.emptyContainer}
        style={{ minHeight: "calc(100vh - 50px)" }}
      >
        <div className={sharedStyles.empty}>
          <img src={`${AWS_CDN_URL}/icons/empty-icons/empty-team.svg`} alt="" />
          <h2>No Authorization</h2>
          <p>You do not have access to this page, please go back.</p>
          <Link
            className="button button--default button--blue-dark"
            to={ROUTES.MyCompanies.url()}
          >
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
