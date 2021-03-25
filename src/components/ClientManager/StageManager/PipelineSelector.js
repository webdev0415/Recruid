import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import { ROUTES } from "routes";
import sharedHelpers from "helpers/sharedHelpers";

import sharedStyles from "assets/stylesheets/scss/collated/filter.module.scss";

// const dateOptions = [
//   { name: "Today", id: "Today" },
//   { name: "This week", id: "This week" },
//   { name: "This month", id: "This Month" },
//   { name: "This quarter", id: "This quarter" },
//   { name: "This year", id: "This year" }
// ];

const PipelineSelector = ({
  pipeline,
  openModal,
  allPipelines,
  store,
  location,
}) => {
  const [redirect, setRedirect] = useState(undefined);

  const addPipeline = (option) => {
    if (!option) return;
    let newPipeline;
    allPipelines.map((pipe) => {
      if (pipe.id === option.value) newPipeline = pipe;
      return null;
    });
    setRedirect(
      ROUTES.ClientManager.url(
        store.company.mention_tag,
        "deals",
        `?pipeline=${newPipeline.id}`
      )
    );
  };

  useEffect(() => {
    if (redirect) setRedirect(undefined);
  }, [redirect]);

  return (
    <>
      {allPipelines?.length > 1 && (
        <Select
          name="pipeline_selector"
          className={sharedStyles.banner_filter}
          options={sharedHelpers.extractOptions(allPipelines)}
          onChange={addPipeline}
          placeholder="Pipeline"
          value={
            pipeline ? { value: pipeline.id, label: pipeline.name } : undefined
          }
        />
      )}
      {(store.role?.role_permissions.owner ||
        (store.role?.role_permissions.admin &&
          store.role?.role_permissions.business)) && (
        <button
          className="button button--default button--blue-dark"
          onClick={() => openModal("pipeline_settings")}
          style={{ marginLeft: 5 }}
        >
          Deal Pipeline Settings
        </button>
      )}
      {redirect && redirect !== `${location.pathname}${location.search}` && (
        <Redirect to={redirect} />
      )}
    </>
  );
};

export default PipelineSelector;
