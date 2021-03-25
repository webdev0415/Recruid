import React, { useState, useContext, useRef } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
import spacetime from "spacetime";
// Components
import Checkbox from "sharedComponents/Checkbox";
import AvatarIcon from "sharedComponents/AvatarIcon";
import { DocumentRow } from "./DocumentRow";
import {
  ExtensionMenu,
  ExtensionMenuOption,
} from "sharedComponents/ExtensionMenu";
// Styles
import styled from "styled-components";
import { folder as folderIcon } from "sharedComponents/filterV2/icons/index";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { COLORS } from "constants/style";
// Helpers
import { updateFolder } from "helpersV2/marketing/documents";

export const DocumentFolder = ({
  folder,
  selfScope,
  selectDoc,
  folderIndex,
  handleDocumentDelete,
  handleFolderDelete,
  selectFolder,
  callRefresh,
  scope,
  store,
}) => {
  const { company, session } = useContext(GlobalContext);
  const [expanded, setExpanded] = useState(false);
  const [editMode, setSeditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(folder.name);
  let titleInput = useRef();

  const handleEditClick = () => {
    setSeditMode(true);
    if (titleInput.current) titleInput.current.focus();
  };

  const handleTitleChange = (e) => setEditedTitle(e.target.value);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      return handleFolderUpdate(session, editedTitle);
    }
    if (e.keyCode === 27) {
      setSeditMode(false);
      return setEditedTitle(folder.name);
    }
  };

  const handleFolderUpdate = async (session, title) => {
    const updateResponse = await updateFolder(session, company.id, folder.id, {
      name: title,
    });
    if (updateResponse) {
      notify("info", "Document has been successfully updated.");
      callRefresh();
      return setSeditMode(false);
    }
  };

  return (
    <>
      <tr className="table-row-hover">
        {(scope?.value === "professional" ||
          store.role?.role_permissions.owner ||
          (store.role?.role_permissions.admin &&
            store.role?.role_permissions.marketer)) && (
          <td className={sharedStyles.tableItem}>
            <Checkbox
              active={folder.selected}
              onClick={() => selectFolder(selfScope, folderIndex)}
            />
          </td>
        )}
        <td className={sharedStyles.tableItemFirst}>
          {editMode ? (
            <div>
              <EditInput
                value={editedTitle}
                onChange={handleTitleChange}
                onKeyDown={handleKeyDown}
                ref={titleInput}
                autoFocus
              />
            </div>
          ) : (
            <>
              <img src={folderIcon} alt="folder icon" />
              <FolderButton onClick={() => setExpanded(!expanded)}>
                {folder.name} ({folder.documents.length})
              </FolderButton>
            </>
          )}
        </td>
        <td className={sharedStyles.tableItem}>
          {selfScope === "personal_folders" && (
            <div className="d-flex align-items-center">
              <AvatarIcon
                name={folder?.source.name}
                imgUrl={folder?.source.avatar}
                size={25}
                style={{
                  marginRight: "10px",
                }}
              />
              {folder?.source.name}
            </div>
          )}
          {selfScope === "company_folders" && (
            <div className="d-flex align-items-center">
              <AvatarIcon
                name={company.name}
                imgUrl={company.avatar_url}
                size={25}
                style={{
                  marginRight: "10px",
                }}
              />
              {company.name}
            </div>
          )}
        </td>
        <td className={sharedStyles.tableItem}>
          {spacetime(folder.created_at).format("{date} {month-short}, {year}")}
        </td>
        <td className={sharedStyles.tableItem}>
          {(scope?.value === "professional" ||
            store.role?.role_permissions.owner ||
            (store.role?.role_permissions.admin &&
              store.role?.role_permissions.marketer)) && (
            <ExtensionMenu>
              <ExtensionMenuOption onClick={handleEditClick}>
                Rename Folder
              </ExtensionMenuOption>
              <ExtensionMenuOption onClick={handleFolderDelete(folder, null)}>
                Delete Folder
              </ExtensionMenuOption>
            </ExtensionMenu>
          )}
        </td>
      </tr>
      {expanded && (
        <>
          {folder.documents?.length ? (
            folder.documents.map((document, idx) => (
              <DocumentRow
                nested
                document={document}
                index={idx}
                selectDoc={selectDoc}
                selfScope={selfScope}
                folderIndex={folderIndex}
                handleDocumentDelete={handleDocumentDelete}
                callRefresh={callRefresh}
                scope={scope}
                store={store}
                key={`document-row-${idx}`}
              />
            ))
          ) : (
            <tr className="table-row-hover">
              <td className={sharedStyles.tableItem} colSpan="4">
                This Folder does not have templates yet
              </td>
            </tr>
          )}
        </>
      )}
    </>
  );
};

const FolderButton = styled.button`
  text-transform: uppercase;
  color: ${COLORS.dark_4};
  font-weight: 600;
  font-size: 12px;
  display: inline !important;
  margin-left: 10px;
`;

const EditInput = styled.input`
  width: 100%;
  border-radius: 4px;
  border: solid #eee 1px;
  padding: 5px;
  font-size: 13px;
`;
