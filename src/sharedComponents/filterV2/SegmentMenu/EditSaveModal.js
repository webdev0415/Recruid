import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import styled from "styled-components";
import notify from "notifications";
import UniversalModal, {
  ModalBody,
} from "modals/UniversalModal/UniversalModal";
import FolderSelect from "sharedComponents/filterV2/SegmentMenu/FolderSelect";

import { building, padlock } from "sharedComponents/filterV2/icons/index";
import { fetchUpdateSegment, fetchCreateSegment } from "helpersV2/segments";
import Dropdown from "react-bootstrap/Dropdown";
const sourceExchanger = {
  candidate: "ProfessionalTalentNetwork",
  deal: "Deal",
  client: "CompanyDetail",
  job: "JobPost",
  contact: "DealContact",
};

const EditSaveModal = ({
  type,
  segments,
  setActiveSegment,
  activeSegment,
  setShowSelect,
  store,
  triggerUpdateSegments,
  tags,
  source,
  setSelectedFolder,
  selectedFolder,
  ownerType,
  setOwnerType,
}) => {
  const [saveType, setSaveType] = useState(type);
  const [name, setName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(undefined);

  const saveSegment = () => {
    if (tags.length === 0) {
      return notify("danger", "No filters to save");
    }
    let newSegment = [];
    tags.map((tag) =>
      newSegment.push({
        [tag.filter_prop]: tag.prop_value,
        display_text: ReactDOMServer.renderToStaticMarkup(tag.display_text),
      })
    );
    if (saveType === "create") {
      createNewSegment(newSegment);
    } else {
      editSegment(newSegment);
    }
  };

  const createNewSegment = (newSegment) => {
    if (name === "") {
      return notify("danger", "You  must name the segment");
    }
    let body = {
      name: name,
      data: newSegment,
      segments_folders_id: selectedFolder?.id,
      source_type: sourceExchanger[source],
      owner_type: selectedGroup.prop,
      owner_id:
        selectedGroup.name === "company" ? store.company.id : store.user.id,
    };
    fetchCreateSegment(store.session, body).then((res) => {
      if (!res.err) {
        notify("info", "Segment succesfully created");
        setShowSelect(undefined);
        setActiveSegment(res);
        triggerUpdateSegments();
      } else {
        notify("danger", "Unable to  create segment");
      }
    });
  };

  const editSegment = (newSegment) => {
    let body = {
      data: newSegment,
      owner_type: selectedGroup.prop,
      owner_id:
        selectedGroup.name === "company" ? store.company.id : store.user.id,
    };
    fetchUpdateSegment(store.session, activeSegment.id, body).then((res) => {
      if (!res.err) {
        notify("info", "Segment succesfully updated");
        setShowSelect(undefined);
        setActiveSegment(res);
        triggerUpdateSegments();
      } else {
        notify("danger", "Unable to edit segment");
      }
    });
  };

  useEffect(() => {
    if (ownerType === "company") {
      setSelectedGroup(options.team);
    } else {
      setSelectedGroup(options.yourself);
    }
  }, [ownerType]);

  return (
    <UniversalModal
      show={true}
      hide={() => setShowSelect(undefined)}
      id={"create-edit-segment"}
      width={610}
    >
      <ModalBody className="no-footer no-header">
        <STSaveEditMenu>
          <div className="body">
            <p>{type === "save" ? "Create" : "Save"} Segment</p>
            {activeSegment && (
              <RadioContainer className="first leo-flex-center">
                <input
                  type="radio"
                  id="edit"
                  name="segment-option"
                  checked={saveType === "edit"}
                  onChange={() => setSaveType("edit")}
                />
                <span>Save changes to {activeSegment.name}</span>
              </RadioContainer>
            )}
            <div className="leo-flex">
              <RadioContainer className="leo-flex-center">
                <input
                  type="radio"
                  id="save"
                  name="segment-option"
                  checked={saveType === "create"}
                  onChange={() => setSaveType("create")}
                />
                <span>Create new segment</span>
              </RadioContainer>
              <CreateInputOptions className="leo-flex-center">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter new segment name"
                />
                <FolderSelect
                  selectedFolder={selectedFolder}
                  setSelectedFolder={setSelectedFolder}
                  segments={segments}
                  tab={selectedGroup?.name}
                  store={store}
                  source={source}
                  triggerUpdateSegments={triggerUpdateSegments}
                />
              </CreateInputOptions>
            </div>
          </div>
          <div className="leo-flex-center-between footer">
            <Dropdown className="leo-flex leo-justify-end leo-relative">
              <Dropdown.Toggle
                as={DropButton}
                className="leo-flex-center-between leo-pointer"
              >
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
                      setSelectedGroup(options.yourself);
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
                      setSelectedGroup(options.team);
                      setOwnerType(options.team.name);
                      setSelectedFolder(undefined);
                    }}
                  >
                    {options.team.label}
                  </DropdownLink>
                </DropdownItem>
              </Dropdown.Menu>
            </Dropdown>
            <div>
              <button
                onClick={() => setShowSelect(undefined)}
                className="button button--default button--white"
              >
                Cancel
              </button>
              <button
                onClick={() => saveSegment()}
                className="button button--default button--blue-dark"
                style={{ marginLeft: "10px" }}
              >
                Save segment
              </button>
            </div>
          </div>
        </STSaveEditMenu>
      </ModalBody>
    </UniversalModal>
  );
};

const options = {
  yourself: {
    name: "personal",
    prop: "Professional",
    label: "Private segment",
    icon: padlock,
  },
  team: {
    name: "company",
    prop: "Company",
    label: "Team segment",
    icon: building,
  },
};

export default EditSaveModal;

const STSaveEditMenu = styled.div`
  overflow: inherit;

  .body {
    padding: 30px;

    p {
      font-weight: 500;
      font-size: 16px;
    }
  }

  .footer {
    padding: 15px 30px;
    border-top: solid #eee 1px;
  }
`;

const RadioContainer = styled.div`
  font-size: 14px;
  margin-right: 15px;

  &.first {
    margin-bottom: 10px;
  }

  input {
    margin-right: 10px;
    margin-top: 0px;
  }

  span {
    width: max-content;
  }
`;

const CreateInputOptions = styled.div`
  border: solid #eee 1px;
  border-radius: 4px;
  height: 30px;
  padding: 0 10px;
  width: 100%;

  input {
    border: none;
    height: 100%;
    font-size: 14px;
    width: 100%;
  }
`;

const DropdownLink = styled.button`
  color: #1e1e1e !important;
  font-size: 14px;
  padding: 5px 14px 5px !important;

  &:hover {
    background: #f6f6f6 !important;
    color: #1e1e1e !important;
  }
`;

const DropButton = styled.div`
  padding: 10px;
  border: solid #eee 1px;
  border-radius: 4px;

  img {
    margin-right: 10px;
  }

  button {
    margin-left: 10px;
  }
`;

const DropdownItem = styled(Dropdown.Item)`
  padding: 0;
`;
