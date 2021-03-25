import React, { useState, useEffect } from "react";
import { fetchMarketingAnalytics } from "helpersV2/marketing";
import notify from "notifications";
import AnalyticsContainer from "components/MarketingEmails/components/AnalyticsContainer";

const MarketerAnalytics = ({ store, match }) => {
  const [analytics, setAnalytics] = useState(undefined);

  useEffect(() => {
    if (
      store.role &&
      (store.role.role_permissions.admin ||
        store.role.role_permissions.owner ||
        store.role.role_permissions.marketer) &&
      store.company &&
      store.session &&
      store.company.mention_tag === match.params.companyMentionTag
    ) {
      fetchMarketingAnalytics(store.session, store.company.id).then((res) => {
        if (!res.err) {
          setAnalytics(res);
        } else {
          notify("danger", res);
        }
      });
    }
     
  }, [store.company, store.session, store.role]);

  return <>{analytics && <AnalyticsContainer analytics={analytics} />}</>;
};

export default MarketerAnalytics;
