import React, { useEffect, useState, useContext } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
// Components
import UniversalModal, {
  ModalBody,
  MinimalHeader,
} from "./UniversalModal/UniversalModal";
// Functions
import {
  listDocumentsFolders,
  createDocumentFolder,
  batchUpdateDocuments,
} from "helpersV2/marketing/documents";
// Styles
import styled from "styled-components";
// import { building, padlock } from "sharedComponents/filterV2/icons/index";
import useDropdown from "hooks/useDropdown";
import RadioButton from "sharedComponents/RadioButton";
import AppButton from "styles/AppButton";
import { AWS_CDN_URL } from "constants/api";

const UploadMarketingDocumentModal = ({
  show,
  hide,
  uploadProgress,
  documentsToUpload,
  uploadedDocuments,
  refreshParent,
}) => {
  const { session, company, user } = useContext(GlobalContext);
  const [folders, setFolders] = useState(undefined);
  const [updatedDocuments, setUpdatedDocuements] = useState([]);
  const [refresh, setRefresh] = useState(Math.random());

  useEffect(() => {
    if (session && company) {
      listDocumentsFolders(session, company.id, user.id)
        .then((folders) => setFolders(folders))
        .catch((err) => notify("danger", err.data));
    }
  }, [session, company, user, refresh]);

  const handleFolderSelect = (folder, targetDocument) => {
    const docIndex = updatedDocuments.findIndex(
      (doc) => doc.id === targetDocument.id
    );
    setUpdatedDocuements((updatedDocs) => {
      let newUpdateDocs = [...updatedDocs];
      if (docIndex >= 0)
        newUpdateDocs[docIndex].marketing_documents_folder_id = folder.id;
      else
        newUpdateDocs.push({
          id: targetDocument.id,
          marketing_documents_folder_id: folder.id,
        });
      return newUpdateDocs;
    });
  };

  const handleScopeSelect = (targetDocument, scope) => {
    const docIndex = updatedDocuments.findIndex(
      (doc) => doc.id === targetDocument.id
    );
    let scopeProps = {};
    if (scope === "professional")
      scopeProps = {
        marketing_source: "professional",
        marketing_source_id: user.id,
      };
    else
      scopeProps = {
        marketing_source: "company",
        marketing_source_id: company.id,
      };
    setUpdatedDocuements((updatedDocs) => {
      let newUpdateDocs = [...updatedDocs];
      if (docIndex >= 0) {
        newUpdateDocs[docIndex].marketing_documents_folder_id = null;
        newUpdateDocs[docIndex] = { ...newUpdateDocs[docIndex], ...scopeProps };
      } else
        newUpdateDocs.push({
          id: targetDocument.id,
          ...scopeProps,
        });
      return newUpdateDocs;
    });
  };

  const handleCreateDocumentFolders = async (newFolderProps) => {
    const response = await createDocumentFolder(
      session,
      company.id,
      newFolderProps
    );
    if (response.error) return notify("danger", response.data);
    return setRefresh(Math.random());
  };

  const submitDocs = () => {
    if (updatedDocuments?.length !== uploadedDocuments?.length) {
      return notify(
        "danger",
        "Select either folder or scope for each document before proceeding."
      );
    }
    batchUpdateDocuments(session, updatedDocuments).then((response) => {
      if (response && !response.error) {
        refreshParent();
        hide();
      }
      notify("danger", response.data);
      return hide();
    });
  };

  return (
    <UniversalModal
      show={show}
      hide={hide}
      id="upload-marketing-documents"
      width={480}
    >
      <MinimalHeader title="Upload Documents" hide={hide} />
      <STModalBody>
        <PercentageBar percentage={uploadProgress} />
        {documentsToUpload?.map((doc, index) => {
          const uploadedDocument = uploadedDocuments?.find(
            (upDoc) => upDoc.title === doc.name
          );
          return (
            <DocumentRow
              key={`document-row-${index}`}
              index={index}
              documentsToUpload={documentsToUpload}
              doc={doc}
              folders={folders}
              company={company}
              user={user}
              handleCreateDocumentFolders={handleCreateDocumentFolders}
              handleFolderSelect={handleFolderSelect}
              uploadedDocument={uploadedDocument}
              handleScopeSelect={handleScopeSelect}
            />
          );
        })}
      </STModalBody>
      <STFooter>
        <AppButton theme="light-grey" onClick={hide}>
          Back
        </AppButton>
        <AppButton onClick={submitDocs}>Submit</AppButton>
      </STFooter>
    </UniversalModal>
  );
};

export default UploadMarketingDocumentModal;

const DocumentRow = ({
  index,
  documentsToUpload,
  doc,
  folders,
  company,
  user,
  handleCreateDocumentFolders,
  handleFolderSelect,
  uploadedDocument,
  handleScopeSelect,
}) => {
  const [activeTab, setActiveTab] = useState("company");
  const [createFolder, setCreateFolder] = useState(false);
  const [newFolderProps, setNewFolderProps] = useState({
    name: "",
  });
  const [selectedFolder, setSelectedFolder] = useState(undefined);
  const [addedFolder, setAddedFolder] = useState(undefined);
  const [selectedScope, setSelectedScope] = useState(""); // Just for UI View, scope change is handled by parent
  const {
    node,
    showSelect: showFoldersList,
    setShowSelect: setShowFoldersList,
  } = useDropdown(() => {
    setCreateFolder(false);
    setNewFolderProps({ name: "" });
  });

  const resetCreateFolderState = () => {
    setCreateFolder(false);
    return setNewFolderProps({ name: "" });
  };

  const onCreateDocumentFolders = () => {
    let folderProps = { ...newFolderProps };
    if (activeTab === "company") {
      folderProps.source = "company";
      folderProps.source_id = company.id;
    } else {
      folderProps.source = "professional";
      folderProps.source_id = user.id;
    }
    handleCreateDocumentFolders(folderProps);
    return resetCreateFolderState();
  };

  const handleNameInputChange = (e) => {
    e.persist();
    return setNewFolderProps((folderProps) => ({
      ...folderProps,
      name: e.target.value,
    }));
  };

  useEffect(() => {
    if (
      selectedFolder?.source === "company" &&
      selectedScope !== "For Company"
    ) {
      setSelectedScope("For Company");
    } else if (
      selectedFolder?.source === "professional" &&
      selectedScope !== "For Professional"
    ) {
      setSelectedScope("For Professional");
    }
  }, [selectedFolder]);

  return (
    <STDocumentRow
      className={documentsToUpload.length - 1 === index ? "last" : ""}
      key={`uploaded-document-${index}`}
    >
      <Label>Document Name:</Label>
      <STDocumentName
        className={
          doc.uploaded === undefined
            ? "loading"
            : doc.uploaded
            ? "success"
            : "error"
        }
      >
        {doc.name}
      </STDocumentName>
      <Label>Select Folder:</Label>
      <div className="dropdown-button leo-relative" ref={node}>
        <button
          onClick={() => setShowFoldersList((bool) => !bool)}
          disabled={uploadedDocument ? false : true}
        >
          <img
            src={`${AWS_CDN_URL}/icons/filter-icons/LargeFolderIcon.svg`}
            alt="Folder Icon"
          />{" "}
          {addedFolder ? addedFolder.name : "Add To Folder"}
        </button>
        {showFoldersList && (
          <STFoldersList>
            <div className="tabs">
              <button
                className={(activeTab === "company" && "active") || ""}
                onClick={() => setActiveTab("company")}
              >
                Company
              </button>
              <button
                className={(activeTab === "personal" && "active") || ""}
                onClick={() => setActiveTab("personal")}
              >
                Personal
              </button>
            </div>
            {activeTab === "company" && (
              <div className="folders">
                <div onClick={() => setCreateFolder(true)}>
                  {createFolder ? (
                    <NameInput
                      value={newFolderProps.name}
                      onChange={handleNameInputChange}
                    />
                  ) : (
                    <span>
                      <b>+</b> Create Folder
                    </span>
                  )}
                </div>
                {folders?.company_folders?.map((folder) => (
                  <div
                    className={selectedFolder?.id === folder.id ? "active" : ""}
                    onClick={() => setSelectedFolder(folder)}
                    key={`doc-folder-${folder.id}`}
                  >
                    <span>{folder.name}</span>
                    <img
                      src={`${AWS_CDN_URL}/icons/filter-icons/LargeFolderIcon.svg`}
                      alt="folder icon"
                    />
                  </div>
                ))}
              </div>
            )}
            {activeTab === "personal" && (
              <div className="folders">
                <div onClick={() => setCreateFolder(true)}>
                  {createFolder ? (
                    <NameInput
                      value={newFolderProps.name}
                      onChange={handleNameInputChange}
                    />
                  ) : (
                    <span>
                      <b>+</b> Create Folder
                    </span>
                  )}
                </div>
                {folders?.personal_folders?.map((folder) => (
                  <div
                    className={selectedFolder?.id === folder.id ? "active" : ""}
                    onClick={() => setSelectedFolder(folder)}
                    key={`doc-folder-${folder.id}`}
                  >
                    <span>{folder.name}</span>
                    <img
                      src={`${AWS_CDN_URL}/icons/filter-icons/LargeFolderIcon.svg`}
                      alt="folder icon"
                    />
                  </div>
                ))}
              </div>
            )}
            {createFolder ? (
              <div className="list-footer">
                <button className="cancel" onClick={resetCreateFolderState}>
                  Cancel
                </button>
                <button
                  className="add"
                  onClick={onCreateDocumentFolders}
                  disabled={!newFolderProps.name.length}
                >
                  Create
                </button>
              </div>
            ) : (
              <div className="list-footer">
                <button
                  className="cancel"
                  onClick={() => {
                    setSelectedFolder(undefined);
                    setShowFoldersList(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="add"
                  onClick={() => {
                    handleFolderSelect(selectedFolder, uploadedDocument);
                    setAddedFolder(selectedFolder);
                    setShowFoldersList(false);
                  }}
                  disabled={!selectedFolder}
                >
                  Add
                </button>
              </div>
            )}
          </STFoldersList>
        )}
      </div>
      <Label>Scope:</Label>
      <FlexContainer>
        <RadioContainer>
          <RadioButton
            onClick={() => {
              handleScopeSelect(uploadedDocument, "company");
              setSelectedScope("For Company");
            }}
            name="scope"
            value="For Company"
            disabled={doc.uploaded !== true ? true : false}
            active={selectedScope === "For Company"}
            id={`company_scope-${index}`}
          />
          <label htmlFor={`company_scope-${index}`} className="radio-label">
            Company
          </label>
        </RadioContainer>
        <RadioContainer>
          <RadioButton
            onClick={() => {
              handleScopeSelect(uploadedDocument, "professional");
              setSelectedScope("For Professional");
            }}
            name="scope"
            value="For Professional"
            disabled={doc.uploaded !== true ? true : false}
            active={selectedScope === "For Professional"}
            id={`professional_scope-${index}`}
          />
          <label
            htmlFor={`professional_scope-${index}`}
            className="radio-label"
          >
            Yourself
          </label>
        </RadioContainer>
      </FlexContainer>
    </STDocumentRow>
  );
};

const PercentageBar = ({ percentage }) => {
  return (
    <BaseBar>
      <Borderbar />
      <CompletedBar percentage={percentage}>
        <div className="relative-container">
          <PercentageNumber className={percentage < 92 ? "out-bar" : "in-bar"}>
            {percentage}%
          </PercentageNumber>
        </div>
      </CompletedBar>
    </BaseBar>
  );
};

const STModalBody = styled(ModalBody)`
  padding: 30px !important;
  padding-bottom: 20px !important;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const STDocumentRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: none;
  padding: 15px 10px;
  border: 1px solid #d4dfea;
  border-radius: 4px;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  margin-bottom: 10px;

  .dropdown-button {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:first-of-type {
      position: relative;
    }

    span {
      font-weight: 500;
      font-size: 14px;
      color: #1e1e1e;
      margin-right: 10px;
    }

    button {
      line-height: 17px;
      color: #b0bdca;
      font-size: 14px;
      display: flex;
      align-items: center;

      img {
        margin-right: 5px;
      }
    }
  }
`;

const STDocumentName = styled.span`
  flex-grow: 1;
  font-weight: 500;
  font-size: 14px;
  margin: 5px 0;
  text-align: left;
  line-height: 17px;
  color: #b0bdca;
  max-width: 270px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.loading {
    color: #53585f;
  }

  &.success {
    color: #28a745;
  }

  &.error {
    color: #dc3545;
  }
`;

const STFooter = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  background: #fff;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  justify-content: space-between;
  padding-top: 20px;
`;

const STFoldersList = styled.div`
  background: #fff;
  position: absolute;
  top: 30px;
  left: 0;
  width: 220px;
  height: 250px;
  overflow-y: auto;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1;

  .tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      padding: 5px 10px;
      width: 50%;
      font-size: 12px;
      font-weight: 500;
      color: #e1e1e1;
      border-bottom: 1px solid #e1e1e1;

      &.active {
        color: #1e1e1e;
        border-bottom: 1px solid #1e1e1e;
      }
    }
  }

  .folders {
    width: 100%;
    flex-grow: 1;
    div {
      width: 100%;
      padding: 10px 15px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:hover {
        background: rgba(223, 233, 244, 0.3);
      }

      &.active {
        background: rgba(223, 233, 244, 0.6);
      }

      span {
        font-weight: 600;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        text-align: left;
      }

      img {
        max-width: 11px;
      }
    }
  }

  .list-footer {
    padding: 10px;
    border-top: 1px solid #e1e1e1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      font-weight: 500;
      font-size: 12px;
      padding: 5px 0;
      width: 80px;
      border-radius: 4px;
      margin: 0 5px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.cancel {
        color: #74767b;
        border: 1px solid #eeeeee;
      }

      &.add {
        color: #fff;
        background: #2a3744;
      }
    }
  }
`;

const NameInput = styled.input`
  width: 100%;
  border-radius: 4px;
  border: solid #eee 1px;
  padding: 5px;
`;

const BaseBar = styled.div`
  width: 418px;
  position: relative;
  height: 15px;
  background: #ffffff;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Borderbar = styled.div`
  width: 418px;
  position: absolute;
  border-radius: 10px;
  border: 1px solid #2a3744;
  height: 100%;
`;

const CompletedBar = styled.div`
  border-radius: 10px;

  width: ${(props) => props.percentage}%;
  position: absolute;
  height: 100%;
  background: #2a3744;

  .relative-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
`;

const Label = styled.div`
  font-size: 14px;
  line-height: 17px;
  color: #1e1e1e;
  text-align: left;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;
const RadioContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 30px;
  .radio-label {
    flex-grow: 1;
    font-weight: 500;
    font-size: 14px;
    margin: 5px 0;
    text-align: left;
    line-height: 17px;
    color: #b0bdca;
    margin-left: 5px;
  }
`;

const PercentageNumber = styled.span`
  position: absolute;
  font-size: 10px;
  line-height: 15px;

  &.in-bar {
    color: white;
    right: 5px;
  }
  &.out-bar {
    color: #2a3744;
    right: -30px;
  }
`;
