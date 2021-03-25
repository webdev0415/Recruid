import React, { useState } from "react";
import styled from "styled-components";
import notify from "notifications";
import {
  Menu,
  FoldersContainer,
  FolderButton,
  LiButton,
  IconButton,
} from "sharedComponents/filterV2/SegmentMenu/sharedComponents";
import { folder } from "sharedComponents/filterV2/icons/index";
import { fetchCreateFolder } from "helpersV2/segments";
import useDropdown from "hooks/useDropdown";

const sourceExchanger = {
  candidate: "ProfessionalTalentNetwork",
  deal: "Deal",
  client: "CompanyDetail",
  job: "JobPost",
  contact: "DealContact",
};
const tabExchanger = {
  company: "Company",
  personal: "Professional",
};
const FolderSelect = ({
  selectedFolder,
  setSelectedFolder,
  tab,
  segments,
  store,
  triggerUpdateSegments,
  source,
}) => {
  const [add, setAdd] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { node, showSelect, setShowSelect } = useDropdown(() => {
    setAdd(false);
    setFolderName("");
  });

  const saveFolder = () => {
    if (folderName === "") {
      return notify("danger", "Folder must have a name");
    }
    let body = {
      name: folderName,
      source_type: sourceExchanger[source],
      owner_type: tabExchanger[tab],
      owner_id: tab === "company" ? store.company.id : store.user.id,
    };

    fetchCreateFolder(store.session, body).then((res) => {
      if (!res.err) {
        triggerUpdateSegments();
        setAdd(false);
        setFolderName("");
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
        <span>{selectedFolder?.name || "Add to folder"}</span>
      </FolderButton>
      {showSelect && (
        <STFoldersMenu>
          <FoldersContainer>
            <AddWrapper>
              {!add ? (
                <button
                  onClick={() => setAdd(true)}
                  className="leo-flex-center"
                >
                  <span>+</span> Add Folder
                </button>
              ) : (
                <input
                  value={folderName}
                  autoFocus
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Type the folder name"
                />
              )}
            </AddWrapper>
            <ul>
              {segments[tab] &&
                segments[tab].folders.length > 0 &&
                segments[tab].folders.map((fold, index) => (
                  <li key={`segment-folder-${index}`}>
                    <div className="d-flex justify-content-between align-items-center">
                      <LiButton
                        className="fold-button"
                        onClick={() => {
                          setShowSelect(false);
                          setSelectedFolder(fold);
                        }}
                      >
                        {fold.name}
                      </LiButton>
                      <IconButton>
                        <img src={folder} alt="folder icon" />
                      </IconButton>
                    </div>
                  </li>
                ))}
              {segments && !segments[tab].folders.length && (
                <li className="empty">No folders yet.</li>
              )}
            </ul>
          </FoldersContainer>
          {add && (
            <ButtonsContainer className="leo-flex-center-around">
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

export default FolderSelect;

const RelativeContainer = styled.div`
  position: relative;
  // width: 200px;
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
    span {
      font-size: 20px;
      margin-right: 5px;
    }
  }
`;

const ButtonsContainer = styled.div`
  padding: 10px;

  button {
    font-size: 12px;
    padding: 5px 20px;
  }
`;
