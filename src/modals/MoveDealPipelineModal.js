import React from "react";
import notify from "notifications";

import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
  ModalFooter,
} from "modals/UniversalModal/UniversalModal";

import styled from "styled-components";

const MoveDealPipelineModal = ({
  hide,
  deal,
  moveDealToPipeline,
  selectedPipeline,
  selectedStage,
  setSelectedStage,
}) => {
  return (
    <UniversalModal show={true} hide={hide} id="move-deal-modal" width={480}>
      <ModalHeaderClassic title="Move Deal" closeModal={hide} />
      <STModalBody>
        <p>
          You are moving the deal <strong>{deal.name}</strong> to the pipeline{" "}
          <strong>{selectedPipeline.name}</strong>.
          <br />
          Please select a stage to finalise moving the deal.
        </p>
        <select
          name="pipeline"
          className="form-control form-control-select"
          value={selectedStage === undefined ? "" : selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
        >
          <option value="" disabled hidden>
            Please select a stage
          </option>
          {selectedPipeline.stages &&
            selectedPipeline.stages.map((stage, index) => (
              <option key={`stage-${index}`} value={index}>
                {stage.name}
              </option>
            ))}
        </select>
      </STModalBody>
      <ModalFooter hide={hide}>
        <button
          id="forward"
          className="button button--default button--blue-dark"
          onClick={() => {
            if (selectedStage === undefined) {
              return notify("danger", "You must select a stage first");
            }
            moveDealToPipeline();
          }}
          style={{ maxWidth: "max-content" }}
        >
          Move
        </button>
      </ModalFooter>
    </UniversalModal>
  );
};

export default MoveDealPipelineModal;

const STModalBody = styled(ModalBody)`
  padding: 30px !important;
  text-align: left;

  p {
    font-size: 13px;
  }
`;
