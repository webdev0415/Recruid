import React, { Fragment } from "react";
import Row from "react-bootstrap/Row";
import { StyledInput, StyledSelect, StyledCol } from "./CreateDealModal";

export default ({ setNewDeal, newDeal, allPipelines }) => {
  return (
    <Fragment>
      <Row>
        <StyledCol className="left-padding">
          <label className="form-label form-heading form-heading-small">
            Is this deal a job requisition
          </label>
          <StyledSelect
            name="currency_id"
            className="form-control form-control-select"
            onChange={(e) =>
              setNewDeal({
                ...newDeal,
                create_job: e.target.value === "true" ? true : false,
              })
            }
            value={newDeal.create_job || ""}
          >
            <option value="" disabled hidden>
              Please select an option
            </option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </StyledSelect>
        </StyledCol>
        <StyledCol className="right-padding">
          {newDeal.create_job === true && (
            <>
              <label className="form-label form-heading form-heading-small">
                How many vacancies?
              </label>
              <StyledInput
                className="form-control"
                type={`text`}
                value={newDeal.vacancies}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, vacancies: e.target.value })
                }
                placeholder={`How many vacancies will the job have`}
              />
            </>
          )}
        </StyledCol>
      </Row>
      <Row>
        {newDeal.create_job === true && (
          <StyledCol className="left-padding">
            <label className="form-label form-heading form-heading-small">
              Select a pipeline
            </label>
            <StyledSelect
              name="pipeline"
              className="form-control form-control-select"
              value={newDeal.pipelineIndex}
              defaultValue=""
              onChange={(e) =>
                setNewDeal({
                  ...newDeal,
                  pipelineIndex: e.target.value,
                })
              }
              required
            >
              <option value="" disabled hidden>
                Please select a pipeline
              </option>
              {allPipelines &&
                allPipelines.length > 0 &&
                allPipelines.map((pipeline, index) => (
                  <React.Fragment key={`pipeline-${index}`}>
                    {!pipeline.archived && (
                      <option value={index}>{pipeline.name}</option>
                    )}
                  </React.Fragment>
                ))}
            </StyledSelect>
          </StyledCol>
        )}

        {newDeal.create_job === true && (
          <StyledCol className="right-padding">
            <label className="form-label form-heading form-heading-small">
              Select a deal stage
            </label>
            <StyledSelect
              name="deal"
              className="form-control form-control-select"
              value={newDeal.deal_status ? newDeal.deal_status.id : ""}
              onChange={(e) =>
                setNewDeal({
                  ...newDeal,
                  deal_status: allPipelines[
                    newDeal.pipelineIndex
                  ].stages.filter(
                    (stage) => stage.id === Number(e.target.value)
                  )[0],
                })
              }
            >
              <option value="" disabled hidden>
                Please select a status
              </option>
              {allPipelines &&
                allPipelines[newDeal.pipelineIndex] &&
                allPipelines[newDeal.pipelineIndex].stages &&
                allPipelines[newDeal.pipelineIndex].stages.length > 0 &&
                allPipelines[newDeal.pipelineIndex].stages.map(
                  (stage, index) => (
                    <option key={`stage-${index}`} value={stage.id}>
                      {stage.name}
                    </option>
                  )
                )}
            </StyledSelect>
          </StyledCol>
        )}
      </Row>
      {/*
        <Row>
          <StyledCol className="left-padding">
            <label className="form-label form-heading form-heading-small">
              At what stage willthe deal convert to a job?
            </label>
            <StyledSelect
              name="deal"
              className="form-control form-control-select"
              value={
                newDeal.conversion_stage ? newDeal.conversion_stage.index : ""
              }
              onChange={e =>
                setNewDeal({
                  ...newDeal,
                  conversion_stage:
                    allPipelines[newDeal.pipelineIndex].stages[e.target.value]
                })
              }
            >
              <option value="" disabled hidden>
                Please select a status
              </option>
              {allPipelines &&
                allPipelines[newDeal.pipelineIndex] &&
                allPipelines[newDeal.pipelineIndex].stages &&
                allPipelines[newDeal.pipelineIndex].stages.length > 0 &&
                allPipelines[newDeal.pipelineIndex].stages.map((stage, index) => (
                  <option key={`stage-${index}`} value={index}>
                    {stage.name}
                  </option>
                ))}
            </StyledSelect>
          </StyledCol>
          <StyledCol className="right-padding"></StyledCol>
        </Row>
        */}
    </Fragment>
  );
};
