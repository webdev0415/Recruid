import React from "react";

import ATSBanner from "sharedComponents/ATSBanner";
import styles from "components/TalentNetwork/components/TalentNetworkBanner/style/talentNetworkBanner.module.scss";
import SimpleDelayedInput from "sharedComponents/SimpleDelayedInput";
const VendorTNBanner = ({ vendor, search, setSearch }) => {
  return (
    <>
      <ATSBanner
        name={vendor?.name}
        avatar={vendor?.avatar_url}
        page="Candidates"
      >
        <div className={styles.inputContainer}>
          <div>
            <SimpleDelayedInput
              className={styles.form}
              placeholder="Search..."
              value={search}
              onChange={(val) => setSearch(val)}
            />
            <li className="fas fa-search search" />
          </div>
        </div>
      </ATSBanner>
    </>
  );
};

export default VendorTNBanner;
