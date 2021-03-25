import React, { useContext, useState, useRef } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";
import notify from "notifications";
import spacetime from "spacetime";
// Components
import AvatarIcon from "sharedComponents/AvatarIcon";
import Checkbox from "sharedComponents/Checkbox";
import {
  ExtensionMenu,
  ExtensionMenuOption,
} from "sharedComponents/ExtensionMenu";
// Styles
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
// Helpers
import { updateDocument } from "helpersV2/marketing/documents";
import styled from "styled-components";

export const DocumentRow = ({
  document,
  index,
  selectDoc,
  nested = false,
  selfScope = null,
  folderIndex = null,
  handleDocumentDelete,
  callRefresh,
  scope,
  store,
}) => {
  const { session } = useContext(GlobalContext);
  const [editMode, setSeditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(document.title);
  let titleInput = useRef();

  const handleEditClick = () => {
    setSeditMode(true);
    if (titleInput.current) titleInput.current.focus();
  };

  const handleTitleChange = (e) => setEditedTitle(e.target.value);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      return handleDocumentUpdate(session, editedTitle);
    }
    if (e.keyCode === 27) {
      setSeditMode(false);
      return setEditedTitle(document.title);
    }
  };

  const handleDocumentUpdate = async (session, title) => {
    const updateResponse = await updateDocument(session, document.id, {
      title,
    });
    if (updateResponse) {
      notify("info", "Document has been successfully updated.");
      callRefresh();
      return setSeditMode(false);
    }
  };

  return (
    <tr className="table-row-hover" key={`document-${document.id}`}>
      {(scope?.value === "professional" ||
        store.role?.role_permissions.owner ||
        (store.role?.role_permissions.admin &&
          store.role?.role_permissions.marketer)) && (
        <td className={sharedStyles.tableItem}>
          {!nested && (
            <Checkbox
              active={document.selected}
              onClick={() => selectDoc(index, selfScope)}
            />
          )}
        </td>
      )}
      <td className={sharedStyles.tableItemFirst}>
        {nested ? (
          <div className="d-flex align-items-center">
            {(scope?.value === "professional" ||
              store.role?.role_permissions.owner ||
              (store.role?.role_permissions.admin &&
                store.role?.role_permissions.marketer)) && (
              <Checkbox
                active={document.selected}
                onClick={() => selectDoc(index, selfScope, folderIndex)}
                style={{ marginRight: "15px" }}
              />
            )}
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
              <div>
                <button onClick={() => window.open(document.url)}>
                  {document.title}
                </button>
              </div>
            )}
          </div>
        ) : editMode ? (
          <div>
            <EditInput
              value={editedTitle}
              onChange={handleTitleChange}
              onKeyDown={handleKeyDown}
              ref={titleInput}
            />
          </div>
        ) : (
          <div>
            <button onClick={() => window.open(document.url)}>
              {document.title}
            </button>
          </div>
        )}
      </td>
      <td className={sharedStyles.tableItem}>
        {selfScope === "personal_documents" && (
          <div className="d-flex align-items-center">
            <AvatarIcon
              name={document.source.name}
              imgUrl={document.source.avatar}
              size={25}
              style={{
                marginRight: "10px",
              }}
            />
            {document.source.name}
          </div>
        )}
        {selfScope === "company_documents" && (
          <div className="d-flex align-items-center">
            <AvatarIcon
              name={document.source.name}
              imgUrl={document.source.avatar}
              size={25}
              style={{
                marginRight: "10px",
              }}
            />
            {document.source.name}
          </div>
        )}
      </td>
      <td className={sharedStyles.tableItem}>
        {spacetime(document.created_at).format("{date} {month-short}, {year}")}
      </td>
      <td className={sharedStyles.tableItem}>
        <ExtensionMenu>
          <ExtensionMenuOption onClick={() => window.open(document.url)}>
            View Document
          </ExtensionMenuOption>
          <ExtensionMenuOption onClick={handleEditClick}>
            Rename Document
          </ExtensionMenuOption>
          {(scope?.value === "professional" ||
            store.role?.role_permissions.owner ||
            (store.role?.role_permissions.admin &&
              store.role?.role_permissions.marketer)) && (
            <ExtensionMenuOption
              onClick={handleDocumentDelete(document, index)}
            >
              Delete Document
            </ExtensionMenuOption>
          )}
        </ExtensionMenu>
      </td>
    </tr>
  );
};

const EditInput = styled.input`
  width: 100%;
  border-radius: 4px;
  border: solid #eee 1px;
  padding: 5px;
  font-size: 13px;
`;
