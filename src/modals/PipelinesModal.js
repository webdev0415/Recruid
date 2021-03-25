import React, { useState, useEffect, useContext, Suspense } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import Modal from "react-bootstrap/Modal";
import { COLORS } from "constants/style";

import modalStyles from "assets/stylesheets/scss/collated/modals.module.scss";
import styled from "styled-components";
import notify from "notifications";
import {
  fetchToggleArchivePipeline,
  fetchDeletePipeline,
} from "helpers/crm/pipelines";
import TeamSelector from "sharedComponents/TeamSelector";
import retryLazy from "hooks/retryLazy";
import { AWS_CDN_URL } from "constants/api";

const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);

const PipelinesModal = (props) => {
  const store = useContext(GlobalContext);
  const [stage, setStage] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [newPipeline, setNewPipeline] = useState({
    name: "",
    pipeline_stages_attributes: [],
  });
  const [hiddenStages, setHiddenStages] = useState([]);
  const [innerModal, setInnerModal] = useState(undefined);
  const [pipelineArchiving, setPipelineArchiving] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("stages");
  const [memberIds, setMemberIds] = useState([]);
  const [editName, setEditName] = useState(false);

  useEffect(() => {
    if (!props.allPipelines) {
      setStage(2);
    }
  }, [props.allPipelines]);

  const deleteStage = (index) => {
    let pipelineCopy = { ...newPipeline };
    if (!editMode) {
      pipelineCopy.pipeline_stages_attributes.splice(index, 1);
    } else {
      pipelineCopy.pipeline_stages_attributes[index].stealth_mode = true;
    }
    setNewPipeline(pipelineCopy);
  };
  const movePosition = (index, move) => {
    if (move === "up" && index === 0) return;
    if (move === "down" && index === newPipeline.length - 1) return;
    let pipelineCopy = { ...newPipeline };
    let stage = { ...newPipeline.pipeline_stages_attributes[index] };
    let otherStage = {
      ...newPipeline.pipeline_stages_attributes[
        move === "up" ? index - 1 : index + 1
      ],
    };
    stage.index = move === "up" ? index - 1 : index + 1;
    otherStage.index = index;
    pipelineCopy.pipeline_stages_attributes[index] = otherStage;
    pipelineCopy.pipeline_stages_attributes[
      move === "up" ? index - 1 : index + 1
    ] = stage;
    setNewPipeline(pipelineCopy);
  };

  const savePipeline = () => {
    if (!newPipeline.name) {
      notify("danger", "Pipeline must have a name");
      return;
    } else {
      let missingName;
      newPipeline.pipeline_stages_attributes.map((stage) =>
        stage.name === "" && stage.id ? (missingName = true) : null
      );
      if (missingName) {
        notify("danger", "Stages must have names");
        return;
      }
    }
    let filteredPipeline = {
      ...newPipeline,
      pipeline_stages_attributes: [
        ...newPipeline.pipeline_stages_attributes,
        ...hiddenStages,
      ]
        .filter((stage) => stage.name !== "")
        .map((stage, index) => {
          return { ...stage, index };
        }),
      team_member_ids: memberIds,
    };
    if (!filteredPipeline.pipeline_stages_attributes.length) {
      notify("danger", "Pipeline must have at least one stage");
      return;
    }
    if (editMode) {
      props.editPipeline(filteredPipeline);
    } else {
      props.savePipeline(filteredPipeline);
    }
  };

  const addStage = () => {
    let pipelineCopy = { ...newPipeline };
    pipelineCopy.pipeline_stages_attributes.push({
      name: "",
      index: newPipeline.pipeline_stages_attributes.length,
    });
    setNewPipeline(pipelineCopy);
  };

  //ADD A NEW STAGE WHEN  A NAME IS TYPED
  useEffect(() => {
    if (newPipeline?.pipeline_stages_attributes?.length) {
      let lastStage =
        newPipeline.pipeline_stages_attributes[
          newPipeline.pipeline_stages_attributes.length - 1
        ];
      if (lastStage.name !== "") {
        addStage();
      }
    } else if (!newPipeline?.pipeline_stages_attributes?.length) {
      addStage();
    }
  }, [newPipeline]);

  const setPipelineForEditing = (editablePipeline) => {
    let pipelineCopy = { ...editablePipeline };
    pipelineCopy.pipeline_stages_attributes = [
      ...editablePipeline.stages.filter((stage) => !stage.readonly),
    ];
    setHiddenStages(editablePipeline.stages.filter((stage) => stage.readonly));
    setMemberIds(editablePipeline.team_member_ids || []);
    delete pipelineCopy.team_member_ids;
    delete pipelineCopy.stages;
    setNewPipeline(pipelineCopy);
  };

  const toggleArchivePipeline = () => {
    setLoading(true);
    fetchToggleArchivePipeline(
      store.session,
      store.company.id,
      pipelineArchiving.id
    ).then((res) => {
      if (!res.err) {
        notify("info", "Pipeline succesfully archived");
        props.getAllPipelines().then((res) => {
          if (!res.err) {
            setInnerModal(undefined);
            setLoading(false);
          }
        });
      } else {
        notify("danger", "Unable to archive pipeline");
      }
    });
  };

  const deletePipeline = () => {
    setLoading(true);
    fetchDeletePipeline(
      store.session,
      store.company.id,
      pipelineArchiving.id
    ).then((res) => {
      if (!res.err) {
        notify("info", "Pipeline succesfully deleted");
        props.getAllPipelines().then((res) => {
          if (!res.err) {
            setInnerModal(undefined);
            setLoading(false);
          }
        });
      } else {
        notify("danger", "Unable to delete pipeline");
      }
    });
  };

  const addMember = (newId) => {
    setMemberIds([...memberIds, newId]);
  };

  const removeMember = (newId) => {
    let newMembers = [...memberIds];
    newMembers.splice(memberIds.indexOf(newId), 1);
    setMemberIds(newMembers);
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.hide}
        dialogClassName={"modal-480w"}
      >
        <Modal.Dialog>
          <div className={modalStyles.modalHeader}>
            <h3>Deal Pipeline Settings</h3>
            <button type="button" className="close" onClick={props.hide}>
              <img src={`${AWS_CDN_URL}/icons/CloseModal2.svg`} alt="Close" />
            </button>
          </div>
          <ModalBody>
            {stage === 1 && (
              <>
                <div className="pipelines-container">
                  {props.allPipelines &&
                    props.allPipelines.length > 0 &&
                    props.allPipelines.map((pipeline, index) => (
                      <PipelineRow key={`pipeline-${index}`}>
                        <span>{pipeline.name}</span>
                        <div className="buttons-container">
                          {pipeline.archived && (
                            <button
                              onClick={() => {
                                setPipelineArchiving(pipeline);
                                setInnerModal("delete-modal");
                              }}
                            >
                              Delete
                            </button>
                          )}
                          {!pipeline.archived && (
                            <button
                              onClick={() => {
                                setEditMode(true);
                                setPipelineForEditing(pipeline);
                                setStage(2);
                              }}
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setPipelineArchiving(pipeline);
                              setInnerModal("archive-modal");
                            }}
                            className={pipeline.archived ? "disabled" : ""}
                          >
                            {!pipeline.archived ? "Archive" : "Archived"}
                          </button>
                        </div>
                      </PipelineRow>
                    ))}
                </div>
                <button
                  id="forward"
                  className="button button--default button--blue-dark"
                  onClick={() => {
                    setEditMode(false);
                    setStage(2);
                  }}
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  Create New Pipeline
                </button>
              </>
            )}
            {stage === 2 && (
              <>
                {!editMode || editName ? (
                  <input
                    className="form-control"
                    value={newPipeline.name}
                    onChange={(e) =>
                      setNewPipeline({
                        ...newPipeline,
                        name: e.target.value,
                      })
                    }
                    placeholder="Name your pipeline"
                    style={{ marginBottom: 10 }}
                  />
                ) : (
                  <FlexContainer>
                    <PipeineTitle className="title-span">
                      {newPipeline.name}
                    </PipeineTitle>
                    <button onClick={() => setEditName(true)}>
                      <img
                        src={`${AWS_CDN_URL}/icons/EditPen.svg`}
                        alt="Edit"
                      />
                    </button>
                  </FlexContainer>
                )}
                {(store.role?.role_permissions.owner ||
                  (store.role?.role_permissions.admin &&
                    store.role?.role_permissions.business)) && (
                  <Menu>
                    <ul>
                      <li>
                        <button
                          className={`option ${
                            tab === "stages" ? "active" : ""
                          }`}
                          onClick={() => setTab("stages")}
                        >
                          Pipeline Stages
                        </button>
                      </li>
                      <li>
                        <button
                          className={`option ${
                            tab === "members" ? "active" : ""
                          }`}
                          onClick={() => setTab("members")}
                        >
                          Members
                        </button>
                      </li>
                    </ul>
                  </Menu>
                )}

                {tab === "stages" && (
                  <>
                    <StagesWrapper>
                      <div>
                        {newPipeline.pipeline_stages_attributes.length > 0 &&
                          newPipeline.pipeline_stages_attributes.map(
                            (stage, index) => (
                              <React.Fragment key={`stage-${index}`}>
                                {!stage.stealth_mode && (
                                  <div className="stageRow">
                                    <PipelineStageInput
                                      value={stage.name}
                                      placeholder={"Type the stage name..."}
                                      onChange={(e) => {
                                        let pipelineStages = [
                                          ...newPipeline.pipeline_stages_attributes,
                                        ];
                                        pipelineStages[index].name =
                                          e.target.value;
                                        setNewPipeline({
                                          ...newPipeline,
                                          pipeline_stages_attributes: pipelineStages,
                                        });
                                      }}
                                    />
                                    <ButtonsContainer>
                                      <div>
                                        <PipelineStageButton
                                          onClick={() =>
                                            movePosition(index, "up")
                                          }
                                          className="arrow"
                                        >
                                          ↑
                                        </PipelineStageButton>
                                        <PipelineStageButton
                                          onClick={() =>
                                            movePosition(index, "down")
                                          }
                                          className="arrow"
                                        >
                                          ↓
                                        </PipelineStageButton>
                                      </div>
                                      <div
                                        onClick={() => deleteStage(index)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <svg
                                          width="15"
                                          height="18"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <g fill="#74767B" fill-role="nonzero">
                                            <path d="M5.25 2.25h-1.5C3.75.975 4.725 0 6 0v1.5c-.45 0-.75.3-.75.75zM11.25 2.25h-1.5c0-.45-.3-.75-.75-.75V0c1.275 0 2.25.975 2.25 2.25zM11.25 4.5h-7.5V2.25h1.5V3h4.5v-.75h1.5zM6 0h3v1.5H6z" />
                                            <path d="M14.25 4.5H.75C.3 4.5 0 4.2 0 3.75S.3 3 .75 3h13.5c.45 0 .75.3.75.75s-.3.75-.75.75zM12.75 18H2.25c-.45 0-.75-.3-.75-.75V6.75c0-.45.3-.75.75-.75h10.5c.45 0 .75.3.75.75v10.5c0 .45-.3.75-.75.75zM3 16.5h9v-9H3v9z" />
                                            <path d="M6 15c-.45 0-.75-.3-.75-.75v-4.5c0-.45.3-.75.75-.75s.75.3.75.75v4.5c0 .45-.3.75-.75.75zM9 15c-.45 0-.75-.3-.75-.75v-4.5c0-.45.3-.75.75-.75s.75.3.75.75v4.5c0 .45-.3.75-.75.75z" />
                                          </g>
                                        </svg>
                                      </div>
                                    </ButtonsContainer>
                                  </div>
                                )}
                              </React.Fragment>
                            )
                          )}
                      </div>
                    </StagesWrapper>
                  </>
                )}
                {tab === "members" && (
                  <TeamContainer>
                    <TeamSelector
                      addedMemberIds={memberIds}
                      availableMembers={store.teamMembers.filter(
                        (member) =>
                          member.roles.includes("business") &&
                          member.permission !== "owner"
                      )}
                      addMember={addMember}
                      removeMember={removeMember}
                    />
                  </TeamContainer>
                )}
              </>
            )}
          </ModalBody>
          <div className={modalStyles.modalFooter}>
            {stage === 1 && (
              <button
                id="back"
                className="button button--default button--grey-light"
                onClick={props.hide}
              >
                Close
              </button>
            )}

            {stage === 2 && (
              <>
                <button
                  id="back"
                  className="button button--default button--grey-light"
                  onClick={() => {
                    setStage(1);
                    setEditMode(false);
                    setNewPipeline({
                      name: "",
                      pipeline_stages_attributes: [],
                    });
                  }}
                >
                  Back
                </button>
                <button
                  id="forward"
                  className="button button--default button--blue-dark"
                  onClick={savePipeline}
                >
                  Save
                </button>
              </>
            )}
          </div>
        </Modal.Dialog>
      </Modal>
      {innerModal === "archive-modal" && pipelineArchiving && (
        <Suspense fallback={<div />}>
          <ConfirmModalV2
            show={true}
            hide={() => {
              setInnerModal(undefined);
              setPipelineArchiving(undefined);
            }}
            size={520}
            header={
              !pipelineArchiving.archived ? "Archive Pipeline" : "Undo Archive"
            }
            text={
              <>
                Are you sure you want to{" "}
                {!pipelineArchiving.archived ? "archive" : "undo archive for"}{" "}
                pipeline <strong>{pipelineArchiving.name}</strong>?
              </>
            }
            actionText={
              !pipelineArchiving.archived ? "Archive Pipeline" : "Undo Archive"
            }
            actionFunction={toggleArchivePipeline}
            loading={loading}
          />
        </Suspense>
      )}
      {innerModal === "delete-modal" && pipelineArchiving && (
        <Suspense fallback={<div />}>
          <ConfirmModalV2
            show={true}
            hide={() => {
              setInnerModal(undefined);
              setPipelineArchiving(undefined);
            }}
            size={520}
            header="Delete Pipeline"
            text={
              <>
                Are you sure you want to delete pipeline{" "}
                <strong>{pipelineArchiving.name}</strong>?
              </>
            }
            actionText="Delete Pipeline"
            actionFunction={deletePipeline}
            loading={loading}
          />
        </Suspense>
      )}
    </>
  );
};

export default PipelinesModal;

const ModalBody = styled.div`
  padding: 40px 40px 20px 40px;

  h1 {
    text-align: center;
    margin-top: 41px;
  }

  .pipelines-container {
    border: 1px solid rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    height: 100%;
    max-height: 420px;
    overflow-y: auto;
    padding: 10px;
    text-align: left;
  }
`;

const PipelineRow = styled.div`
  align-items: center;
  border: solid #eeeeee 1px;
  border-radius: 4px;
  display: flex;
  padding: 12px 10px 12px 20px;
  justify-content: space-between;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  .buttons-container {
    display: flex;
    align-items: center;
  }

  button {
    background: #eeeeee;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    padding: 6px 14px;
    margin-left: 10px;

    &:hover {
      background: #e0e0e0;
    }

    &.disabled {
      color: ${COLORS.dark_4};
    }
  }
`;

const StagesWrapper = styled.div`
  border-radius: 4px;
  border: solid #eeeeee 1px;
  height: 317px;
  max-height: 417px;
  overflow: auto;
  position: relative;
  margin-top: 10px;

  .stageRow {
    border-bottom: solid #eeeeee 1px;
    padding: 15px;
    display: flex;
    align-items: center;
    background: white;
  }
`;

const PipelineStageInput = styled.input`
  background: #eeeeee;
  border: none;
  border-radius: 2px;
  font-size: 14px;
  padding: 10px 15px;
  width: 100%;
`;

const PipelineStageButton = styled.button`
  background: none;
  height: 20px;
  width: 20px;

  &.arrow {
    background: #eeeeee;
    border-radius: 2px;
    margin: 1px 0px;
  }
`;

// const AddStageButton = styled.div`
//   margin: 15px;
//   background: #eeeeee;
//   border-radius: 2px;
//   padding: 10px 15px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//
//   button {
//     font-size: 30px;
//     line-height: 1;
//   }
// `;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 90px;

  div {
    display: flex;
    flex-direction: column;
  }
`;

const Menu = styled.div`
  margin-bottom: 20px;
  margin-top: 20px;

  ul {
    border-bottom: 1px solid #d8d8d8;
    display: flex;
  }

  li {
    margin-right: 30px;

    &:last-child {
      margin-right: 0;
    }

    button {
      border-bottom: 2px solid transparent;
      color: #74767b !important;
      font-size: 15px;
      font-weight: 500;
      margin-bottom: -1px;

      &.active {
        border-bottom: 2px solid #1e1e1e;
        color: #1e1e1e !important;
        padding-bottom: 10px;
      }

      &:hover {
        color: #1e1e1e !important;
      }

      &.post {
        margin-left: 10px;
      }
    }
  }
`;

const TeamContainer = styled.div`
  max-height: 300px;
  overflow: auto;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PipeineTitle = styled.h4`
  color: #1e1e1e;
  font-size: 20px;
  letter-spacing: -0.3px;
  text-align: center;
`;
