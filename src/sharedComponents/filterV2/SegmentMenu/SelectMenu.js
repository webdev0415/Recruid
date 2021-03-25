import React, { useState } from "react";
import styled from "styled-components";
import notify from "notifications";
import {
  Menu,
  FoldersContainer,
  LiButton,
  IconButton,
} from "sharedComponents/filterV2/SegmentMenu/sharedComponents";

import {
  folder,
  edit,
  subtractRed,
  subtractGrey,
} from "sharedComponents/filterV2/icons/index";
import { fetchDeleteSegments } from "helpersV2/segments";

const SelectMenu = ({
  segments,
  setSegments,
  setActiveSegment,
  setShowSelect,
  triggerUpdateSegments,
  store,
  setSelectedFolder,
  setOwnerType,
}) => {
  const [tab, setTab] = useState("personal");
  const [foldIndex, setFoldIndex] = useState(undefined);
  const [editMode, setEditMode] = useState(false);

  const prepareSegmentForDeletion = (tab, segmentIx, folderIx) => {
    let segmentTab = { ...segments[tab] };
    if (folderIx !== undefined) {
      let tabFolders = [...segmentTab.folders];
      let segmentRef = tabFolders[folderIx].segments[segmentIx];
      tabFolders[folderIx].segments[segmentIx] = {
        ...segmentRef,
        _delete: segmentRef._delete ? false : true,
      };
      segmentTab.folders = tabFolders;
    } else {
      let tabSegments = [...segmentTab.segments];
      tabSegments[segmentIx] = {
        ...tabSegments[segmentIx],
        _delete: tabSegments[segmentIx]._delete ? false : true,
      };
      segmentTab.segments = tabSegments;
    }

    setSegments({ ...segments, [tab]: segmentTab });
  };
  const prepareFolderForDeletion = (tab, folderIx) => {
    let segmentTab = { ...segments[tab] };
    let tabFolders = [...segmentTab.folders];
    let bool = tabFolders[folderIx]._delete ? false : true;
    tabFolders[folderIx] = {
      ...tabFolders[folderIx],
      _delete: bool,
      segments: tabFolders[folderIx].segments.map((seg) => {
        return { ...seg, _delete: bool };
      }),
    };
    segmentTab.folders = tabFolders;
    setSegments({ ...segments, [tab]: segmentTab });
  };

  const deleteSegments = async () => {
    let folder_ids = [];
    let segment_ids = [];

    Object.values(segments).map((tabs) => {
      tabs.folders.map((folder) => {
        if (folder._delete) folder_ids.push(folder.id);
        folder.segments.map((segment) => {
          if (segment._delete) segment_ids.push(segment.id);
          return null;
        });
        return null;
      });
      tabs.segments.map((segment) => {
        if (segment._delete) segment_ids.push(segment.id);
        return null;
      });
      return null;
    });
    if (folder_ids.length === 0 && segment_ids.length === 0) {
      setEditMode(false);
      return;
    }
    fetchDeleteSegments(store.session, {
      segment_ids,
      folder_ids,
    }).then((res) => {
      if (!res.err) {
        notify("info", "Segments succesfully deleted");
        triggerUpdateSegments();
      } else {
        notify("danger", "Unable to make deletions");
      }
    });
    setShowSelect(false);
  };

  return (
    <STSelectMenu>
      <STSelectMenuHeader>
        <div className="tabs-container">
          <button
            onClick={() => {
              setTab("personal");
              setFoldIndex(undefined);
            }}
            className={tab === "personal" ? "active" : ""}
          >
            Personal
          </button>
          <button
            onClick={() => {
              setTab("company");
              setFoldIndex(undefined);
            }}
            className={tab === "company" ? "active" : ""}
          >
            Company
          </button>
        </div>
        {!editMode && (
          <button className="edit-button" onClick={() => setEditMode(true)}>
            <img src={edit} alt="edit pencil" />
          </button>
        )}
        {editMode && (
          <button
            className="save-button button button--default button--blue-dark"
            onClick={() => deleteSegments()}
          >
            Done
          </button>
        )}
      </STSelectMenuHeader>
      <FoldersContainer>
        <ul>
          {segments &&
            segments[tab] &&
            segments[tab].folders.length > 0 &&
            segments[tab].folders.map((fold, index) => (
              <li key={`segment-folder-${index}`} className="active">
                <div className="d-flex justify-content-between align-items-center">
                  <LiButton
                    className="fold-button"
                    onClick={() =>
                      setFoldIndex(foldIndex === index ? undefined : index)
                    }
                  >
                    {fold.name}
                  </LiButton>
                  {!editMode && (
                    <IconButton>
                      <img src={folder} alt="folder icon" />
                    </IconButton>
                  )}
                  {editMode &&
                    fold._delete &&
                    (tab === "personal" ||
                      store.role?.role_permissions.owner ||
                      store.role?.role_permissions.admin) && (
                      <IconButton
                        onClick={() => prepareFolderForDeletion(tab, index)}
                      >
                        <img src={subtractRed} alt="delete icon" />
                      </IconButton>
                    )}
                  {editMode &&
                    !fold._delete &&
                    (tab === "personal" ||
                      store.role?.role_permissions.owner ||
                      store.role?.role_permissions.admin) && (
                      <IconButton
                        onClick={() => prepareFolderForDeletion(tab, index)}
                      >
                        <img src={subtractGrey} alt="delete icon" />
                      </IconButton>
                    )}
                </div>
                {foldIndex === index && (
                  <ul>
                    {fold.segments.map((segment, ix) => (
                      <li key={`segments-list-${ix}`}>
                        <div className="d-flex justify-content-between align-items-center">
                          <LiButton
                            onClick={() => {
                              setActiveSegment({
                                ...segment,
                              });
                              setSelectedFolder(fold);
                              setOwnerType(tab);
                              setShowSelect(false);
                            }}
                          >
                            {segment.name}
                          </LiButton>
                          {!editMode && (
                            <IconButton>
                              <span>{segment.data?.length}</span>
                            </IconButton>
                          )}
                          {editMode &&
                            (segment._delete || fold._delete) &&
                            (tab === "personal" ||
                              store.role?.role_permissions.owner ||
                              store.role?.role_permissions.admin) && (
                              <IconButton
                                onClick={() =>
                                  prepareSegmentForDeletion(tab, ix, index)
                                }
                              >
                                <img src={subtractRed} alt="delete icon" />
                              </IconButton>
                            )}
                          {editMode &&
                            !segment._delete &&
                            !fold._delete &&
                            (tab === "personal" ||
                              store.role?.role_permissions.owner ||
                              store.role?.role_permissions.admin) && (
                              <IconButton
                                onClick={() =>
                                  prepareSegmentForDeletion(tab, ix, index)
                                }
                              >
                                <img src={subtractGrey} alt="delete icon" />
                              </IconButton>
                            )}
                        </div>
                      </li>
                    ))}
                    {!fold.segments.length && (
                      <li className="empty">Add Filters to create Segments.</li>
                    )}
                  </ul>
                )}
              </li>
            ))}
          {segments &&
            segments[tab] &&
            segments[tab].segments.length > 0 &&
            segments[tab].segments.map((segment, ix) => (
              <li key={`segments-list-${ix}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <LiButton
                    onClick={() => {
                      setActiveSegment({
                        ...segment,
                      });
                      setOwnerType(tab);
                      setShowSelect(false);
                    }}
                  >
                    {segment.name}
                  </LiButton>
                  {!editMode && (
                    <IconButton>
                      <span>{segment.data?.length}</span>
                    </IconButton>
                  )}
                  {editMode &&
                    segment._delete &&
                    (tab === "personal" ||
                      store.role?.role_permissions.owner ||
                      store.role?.role_permissions.admin) && (
                      <IconButton
                        onClick={() => prepareSegmentForDeletion(tab, ix)}
                      >
                        <img src={subtractRed} alt="delete icon" />
                      </IconButton>
                    )}
                  {editMode &&
                    !segment._delete &&
                    (tab === "personal" ||
                      store.role?.role_permissions.owner ||
                      store.role?.role_permissions.admin) && (
                      <IconButton
                        onClick={() => prepareSegmentForDeletion(tab, ix)}
                      >
                        <img src={subtractGrey} alt="delete icon" />
                      </IconButton>
                    )}
                </div>
              </li>
            ))}
          {(!segments ||
            (!segments[tab].segments.length &&
              !segments[tab].folders.length)) && (
            <li className="empty">Add Filters to create Segments.</li>
          )}
        </ul>
      </FoldersContainer>
    </STSelectMenu>
  );
};

export default SelectMenu;

const STSelectMenu = styled(Menu)`
  background: #ffffff;
  border: 1px solid #d4dfea;
  border-radius: 4px;
  box-shadow: 0px 1px 6px rgba(116, 118, 123, 0.17);
  right: 0px;
  top: 50px;

  .tabs-container {
    padding-top: 15px;
    margin: 0px 15px;
    position: relative;
    width: 100%;

    button {
      height: 100%;
      padding-bottom: 10px;
      margin-right: 20px;
      font-size: 14px;
      color: #74767b;
      font-weight: 500;
      &.active {
        border-bottom: solid #2a3744 2px;
        color: #2a3744;
      }
    }
  }

  .edit-button {
    margin-right: 15px;
  }

  .save-button {
    margin-right: 15px;
    font-size: 10px;
    padding: 5px 10px;
  }
`;

const STSelectMenuHeader = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center",
}))`
  border-bottom: solid #eee 1px;
`;
