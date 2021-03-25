import React, { useState, useContext, useEffect } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
import TemplateEditor from "sharedComponents/TemplateEditor";
import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
  ModalFooter,
} from "modals/UniversalModal/UniversalModal";
import {
  Menu,
  FoldersContainer,
  FolderButton,
  LiButton,
  IconButton,
} from "sharedComponents/filterV2/SegmentMenu/sharedComponents";
import EditButtons from "components/Profiles/components/EditButtons";
import { Base64 } from "js-base64";
import { folder } from "sharedComponents/filterV2/icons/index";
import {
  fetchCreateFolder,
  fetchEditFolder,
} from "helpersV2/marketing/folders";
import { building, padlock } from "sharedComponents/filterV2/icons/index";
import FilesDisplay from "sharedComponents/TemplateEditor/FilesDisplay";

import styled from "styled-components";
import {
  fetchCreateTemplate,
  fetchEditTemplate,
} from "helpersV2/marketing/templates";
import { getEmailDocuments } from "helpersV2/marketing/documents";
import Dropdown from "react-bootstrap/Dropdown";
import useDropdown from "hooks/useDropdown";
import Spinner from "sharedComponents/Spinner";

const MODELS = {
  Client: "contact",
  ProfessionalTalentNetwork: "candidate",
};

const TemplateModal = ({
  hide,
  template,
  editing,
  triggerUpdateTemplates,
  templates,
  editFolder,
  scope,
}) => {
  const store = useContext(GlobalContext);
  const [templateName, setTemplateName] = useState("");
  const [templateSubject, setTemplateSubject] = useState("");
  const [templateOwner, setTemplateOwner] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [templateVariables, setTemplateVariables] = useState(undefined);
  const [selectedFolder, setSelectedFolder] = useState(undefined);
  const [selectedGroup, setSelectedGroup] = useState(options.yourself);
  const [ownerType, setOwnerType] = useState(undefined);
  const [filesToAdd, setFilesToAdd] = useState([]);
  const [templateSource, setTemplateSource] = useState("");
  const [autoSaving, setAutoSaving] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState(undefined);

  useEffect(() => {
    if (template) {
      setTemplateName(template.name);
      setTemplateSubject(template.subject);
      setTemplateSource(template.source_type);
      store.teamMembers.map((member) =>
        member.professional_id === template.owner_id
          ? setTemplateOwner(member)
          : null
      );
      setSelectedFolder(editFolder);

      if (scope) {
        setOwnerType(scope);
      }
      if (template.documents?.length > 0) {
        getEmailDocuments(
          store.company.id,
          store.session,
          store.user.id,
          [0, template.documents.length],
          undefined,
          {
            id: template.documents.map((doc) => doc.id),
          }
        ).then((docs) => {
          if (docs !== "err" && !docs.message) {
            setFilesToAdd(docs?.requested_documents);
          } else {
            notify("danger", "Unable to fetch attachements");
          }
        });
      }
    } else if (store.teamMembers) {
      store.teamMembers.map((member) =>
        member.professional_id === store.session.id
          ? setTemplateOwner(member)
          : null
      );
    }
  }, [template, store.teamMembers, store.session, scope]);

  useEffect(() => {
    if (ownerType === "company") {
      setSelectedGroup(options.team);
    } else {
      setSelectedGroup(options.yourself);
    }
  }, [ownerType]);

  const createTemplate = (autoSave) => {
    if (!templateName) {
      return notify("danger", "Template must have a name");
    }
    if (!templateSubject) {
      return notify("danger", "Template must have a subject");
    }
    if (autoSave) {
      setAutoSaving(true);
    }
    let body = {
      name: templateName,
      subject: templateSubject,
      body: Base64.encode(templateBody),
      folder_id: selectedFolder?.folder_id,
      personalization: templateVariables,
      attachments: filesToAdd.map((file) => file.id),
      source_type: templateSource,
      company_id:
        selectedGroup.prop === "Company" ? store.company.id : undefined,
      owner_id:
        selectedGroup.prop === "Professional"
          ? templateOwner?.professional_id
          : undefined,
    };
    fetchCreateTemplate(store.session, store.company.id, body).then((res) => {
      if (!res.err) {
        triggerUpdateTemplates();
        if (!autoSave) {
          notify("info", "Template succesfully created");
          hide();
        } else {
          setEditedTemplate(res);
          setTimeout(function () {
            setAutoSaving(false);
          }, 1000);
        }
      } else {
        notify("danger", "Unable to create template");
      }
    });
  };

  const editTemplate = (autoSave) => {
    if (autoSave) {
      setAutoSaving(true);
    }
    if (!template && !editedTemplate) {
      return;
    }
    let templateUsed = template || editedTemplate;

    let body = {
      ...templateUsed,
      name: templateName,
      subject: templateSubject,
      body: Base64.encodeURI(templateBody),
      folder_id: selectedFolder?.folder_id,
      company_id: store.company.id,
      source_type: templateSource,
      owner_id:
        selectedGroup.prop === "Professional"
          ? templateOwner?.professional_id
          : undefined,
      personalization: templateVariables,
      attachments: filesToAdd.map((file) => {
        return { id: file.id };
      }),
    };
    delete body.documents;
    fetchEditTemplate(
      store.session,
      store.company.id,
      templateUsed.id,
      body
    ).then((res) => {
      if (!res.err) {
        if (!autoSave) {
          notify("info", "Template succesfully edited");
          hide();
        } else {
          setTimeout(function () {
            setAutoSaving(false);
          }, 1000);
        }
        triggerUpdateTemplates();
      } else {
        notify("danger", "Unable to edit template");
      }
    });
  };

  useEffect(() => {
    if (templateVariables?.length > 0) {
      let source;
      templateVariables.map((variable) => {
        if (MODELS[variable.model]) {
          source = MODELS[variable.model];
        }
        return null;
      });
      setTemplateSource(source);
    } else if (templateSource) {
      setTemplateSource("");
    }
  }, [templateVariables, templateSource]);

  return (
    <UniversalModal show={true} hide={hide} id="template-modal" width={960}>
      <ModalHeaderClassic
        title={editing ? "Edit Template" : "Create Template"}
        closeModal={hide}
      />
      {autoSaving && <SavingIndicator />}
      <STModalBody>
        <TemplateContainer>
          <FlexRowDiv>
            <ContentInput className="span-full">
              <label style={{ width: 125 }}>Template Title:</label>
              <input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Name the template"
              />
            </ContentInput>
            <ContentInput>
              <label>Owner:</label>
              <input
                value={templateOwner?.name || store.company.name || ""}
                placeholder="Template owner"
                readOnly
              />
            </ContentInput>
          </FlexRowDiv>
          <FlexRowDiv>
            <ContentInput>
              <label>Template Folder:</label>
              <FolderSelect
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
                store={store}
                triggerUpdateTemplates={triggerUpdateTemplates}
                templates={templates}
                tab={selectedGroup?.name}
              />
            </ContentInput>
            <ContentInput>
              <label>Template Scope:</label>
              <DropdownWrapper>
                <Dropdown.Toggle as={DropButton}>
                  <img src={selectedGroup?.icon} alt="button icon" />
                  {selectedGroup?.label}
                  <button>
                    <li className="fas fa-caret-down" />
                  </button>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  as="div"
                  className="dropdown-menu dropdown-menu-right"
                  style={{ top: "50px" }}
                >
                  <DropdownItem>
                    <DropdownLink
                      onClick={() => {
                        setOwnerType(options.yourself.name);
                        setSelectedFolder(undefined);
                      }}
                    >
                      {options.yourself.label}
                    </DropdownLink>
                  </DropdownItem>
                  <DropdownItem>
                    <DropdownLink
                      onClick={() => {
                        setOwnerType(options.team.name);
                        setSelectedFolder(undefined);
                      }}
                    >
                      {options.team.label}
                    </DropdownLink>
                  </DropdownItem>
                </Dropdown.Menu>
              </DropdownWrapper>
            </ContentInput>
          </FlexRowDiv>
          <FlexRowDiv>
            <ContentInput className="span-full">
              <label>Subject:</label>
              <input
                value={templateSubject || ""}
                onChange={(e) => setTemplateSubject(e.target.value)}
                placeholder="Email subject"
                maxLength={500}
              />
            </ContentInput>
          </FlexRowDiv>
          <div>
            <TemplateEditor
              returnState={(e) => setTemplateBody(e)}
              returnVariables={(varArray) => setTemplateVariables(varArray)}
              activeTemplate={template}
              type="template"
              addFilesToTemplate={(files) =>
                setFilesToAdd([...filesToAdd, ...files])
              }
              source={templateSource}
            />
          </div>
        </TemplateContainer>
        {filesToAdd && filesToAdd.length > 0 && (
          <FilesDisplay filesToAdd={filesToAdd} setFilesToAdd={setFilesToAdd} />
        )}
      </STModalBody>
      <ModalFooter hide={hide} cancelText="Cancel">
        {templateName && templateSubject && (
          <button
            id="progress"
            className="button button--default button--primary"
            onClick={() =>
              !template && !editedTemplate
                ? createTemplate(true)
                : editTemplate(true)
            }
            style={{ maxWidth: "max-content" }}
          >
            Save Progress
          </button>
        )}

        <button
          id="forward"
          className="button button--default button--blue-dark"
          onClick={() => (!editing ? createTemplate() : editTemplate())}
          style={{ maxWidth: "max-content" }}
        >
          Save Template
        </button>
      </ModalFooter>
    </UniversalModal>
  );
};

export default TemplateModal;

const FolderSelect = ({
  selectedFolder,
  setSelectedFolder,
  store,
  triggerUpdateTemplates,
  //
  tab,
  templates,
}) => {
  const [add, setAdd] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [editFolder, setEditFolder] = useState(undefined);
  const { node, showSelect, setShowSelect } = useDropdown(() => {
    setAdd(false);
    setEditFolder(undefined);
    setFolderName("");
  });

  const saveFolder = () => {
    if (folderName === "") {
      return notify("danger", "Folder must have a name");
    }
    let body = {
      name: folderName,
      owner_type: tabExchanger[tab],
      owner_id: tab === "company" ? store.company.id : store.user.id,
    };

    fetchCreateFolder(store.session, store.company.id, body).then((res) => {
      if (!res.err) {
        triggerUpdateTemplates();
        setAdd(false);
        setEditFolder(undefined);
        setFolderName("");
      } else {
        notify("danger", res);
      }
    });
  };

  const editFolderMethod = () => {
    if (editFolder.folder_name === "") {
      return notify("danger", "Folder must have a name");
    }
    let body = {
      name: editFolder.folder_name,
      owner_type: tabExchanger[tab],
      owner_id: tab === "company" ? store.company.id : store.user.id,
    };

    fetchEditFolder(
      store.session,
      store.company.id,
      editFolder.folder_id,
      body
    ).then((res) => {
      if (!res.err) {
        triggerUpdateTemplates();
        setEditFolder(undefined);
      } else {
        notify("danger", res);
      }
    });
  };

  return (
    <RelativeContainer ref={node}>
      <FolderButton
        className="folder-button"
        onClick={() => setShowSelect(true)}
      >
        <img src={folder} alt="folder icon" />
        <span>{selectedFolder?.folder_name || "Add to folder"}</span>
      </FolderButton>
      {showSelect && (
        <STFoldersMenu>
          <FoldersContainer>
            <AddWrapper>
              {!add ? (
                <button onClick={() => setAdd(true)}>
                  <span>+</span> Add Folder
                </button>
              ) : (
                <FolderInput
                  value={folderName}
                  autoFocus
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Type the folder name"
                />
              )}
            </AddWrapper>
            <ul>
              {templates[`${tab}_folders`] &&
                templates[`${tab}_folders`].length > 0 &&
                templates[`${tab}_folders`].map((fold, index) => (
                  <li key={`templates-folder-${index}`}>
                    <div className="d-flex justify-content-between align-items-center">
                      {editFolder === undefined ||
                      editFolder.folder_id !== fold.folder_id ? (
                        <>
                          <LiButton
                            className="fold-button"
                            onClick={() => {
                              setShowSelect(false);
                              setSelectedFolder(fold);
                            }}
                          >
                            {fold.folder_name}
                          </LiButton>
                        </>
                      ) : (
                        <FolderInput
                          value={editFolder?.folder_name}
                          style={{ maxWidth: "135px", padding: "5px" }}
                          autoFocus
                          onChange={(e) =>
                            setEditFolder({
                              ...editFolder,
                              folder_name: e.target.value,
                            })
                          }
                          placeholder="Type the folder name"
                        />
                      )}
                      <EditButtons
                        style={{ marginRight: "10px" }}
                        editing={editFolder?.folder_id === fold.folder_id}
                        onClickEdit={() => setEditFolder(fold)}
                        onClickCancel={() => setEditFolder(undefined)}
                        onClickSave={editFolderMethod}
                      />
                      {(editFolder === undefined ||
                        editFolder.folder_id !== fold.folder_id) && (
                        <IconButton>
                          <img src={folder} alt="folder icon" />
                        </IconButton>
                      )}
                    </div>
                  </li>
                ))}
              {templates && !templates[`${tab}_folders`].length && (
                <li className="empty">No folders yet.</li>
              )}
            </ul>
          </FoldersContainer>
          {add && (
            <ButtonsContainer>
              <button
                onClick={() => {
                  setAdd(false);
                  setFolderName("");
                }}
                className="button button--default button--white"
              >
                Cancel
              </button>
              <button
                onClick={() => saveFolder()}
                className="button button--default button--blue-dark"
              >
                Add
              </button>
            </ButtonsContainer>
          )}
        </STFoldersMenu>
      )}
    </RelativeContainer>
  );
};
const tabExchanger = {
  company: "Company",
  personal: "Professional",
};

const STModalBody = styled(ModalBody)`
  padding: 30px !important;
  text-align: center;
`;

const TemplateContainer = styled.div`
  border-radius: 4px;
  border: solid 1px #eee;
`;

const FlexRowDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: solid 1px #eee;
`;

const ContentInput = styled.div`
  display: flex;
  font-size: 14px;
  align-items: center;

  &.span-full {
    width: 100%;

    input {
      width: 100%;
    }
  }

  label {
    font-weight: 500;
    font-size: 14px;
  }

  input {
    font-size: 14px;
    margin-left: 10px;
    border: none;
    background: none;
  }
`;

const RelativeContainer = styled.div`
  position: relative;
  // width: 200px;
  margin-left: 10px;
`;

const STFoldersMenu = styled(Menu)`
  width: 200px;
`;

const AddWrapper = styled.div`
  width: 100%;
  border-bottom: solid #eee 1px;
  padding: 5px 10px;

  button {
    width: 100%;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    span {
      font-size: 20px;
      margin-right: 5px;
    }
  }
`;

const ButtonsContainer = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  button {
    font-size: 12px;
    padding: 5px 20px;
  }
`;

const DropdownWrapper = styled(Dropdown)`
  display: flex;
  justify-content: flex-end;
  position: relative;
  margin-left: 10px;
`;

const DropButton = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  border-radius: 4px;
  font-size: 10px;

  img {
    margin-right: 10px;
  }

  button {
    margin-left: 10px;
  }
`;

const DropdownLink = styled.button`
  color: #1e1e1e !important;
  font-size: 14px;
  padding: 5px 14px 5px !important;
  width: 100%;

  &:hover {
    background: #f6f6f6 !important;
    color: #1e1e1e !important;
  }
`;

const options = {
  yourself: {
    name: "personal",
    prop: "Professional",
    label: "For yourself",
    icon: padlock,
  },
  team: {
    name: "company",
    prop: "Company",
    label: "Company",
    icon: building,
  },
};

const FolderInput = styled.input`
  width: 100%;
`;

const DropdownItem = styled(Dropdown.Item)`
  padding: 0;
`;

const SavingIndicator = () => (
  <SaveInd>
    <Spinner size="sm" inline />
    <span>Saving template...</span>
  </SaveInd>
);

const SaveInd = styled.div`
  align-items: flex-end;
  color: #8d8d8d;
  display: flex;
  left: 10px;
  position: absolute;
  top: 10px;

  span {
    font-size: 10px;
    margin-left: 5px;
  }
`;
