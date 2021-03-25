import React, { useState, useEffect, Suspense } from "react";
import styled from "styled-components";
import notify from "notifications";
import { ATSContainer } from "styles/PageContainers";
import AvatarIcon from "sharedComponents/AvatarIcon";
import {
  ExtensionMenu,
  ExtensionMenuOption,
} from "sharedComponents/ExtensionMenu";
import Checkbox from "sharedComponents/Checkbox";
import SearchInput from "sharedComponents/SearchInput";
import SelectDropdown from "sharedComponents/SelectDropdown";
import EmptyTab from "components/Profiles/components/EmptyTab";
import {
  fetchGetTemplates,
  fetchDeleteTemplate,
} from "helpersV2/marketing/templates";
import { fetchDeleteFolder } from "helpersV2/marketing/folders";
import { COLORS } from "constants/style";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { folder as folderIcon } from "sharedComponents/filterV2/icons/index";
import { PermissionChecker } from "constants/permissionHelpers";
import { dateOptions } from "constants/filtersOptions";
import Spinner from "sharedComponents/Spinner";
import retryLazy from "hooks/retryLazy";
import MarketingTemplatesActionBar from "components/MarketingEmails/ActionBar/MarketingTemplatesActionBar";
import { EmptyContacts } from "assets/svg/EmptyImages";
const ConfirmModalV2 = React.lazy(() =>
  retryLazy(() => import("modals/ConfirmModalV2"))
);
const TemplateModal = React.lazy(() =>
  retryLazy(() => import("modals/TemplateModal"))
);

const templateOptions = [
  { prop: "all", name: "All" },
  { prop: "personal", name: "Personal Templates" },
  { prop: "company", name: "Company Templates" },
];

const sourceExchanger = {
  candidate: "Candidates",
  contact: "Contacts",
};

const TemplatesTab = ({ store, activeModal, setActiveModal, permission }) => {
  const [templates, setTemplates] = useState(undefined);
  const [search, setSearch] = useState("");
  const [dateBoundary, setDateBoundary] = useState(
    dateOptions[dateOptions.length - 1]
  );
  // const [member, setMember] = useState("All Users");
  const [loaded, setLoaded] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState(0);
  const [selectedTemplates, setSelectedTemplates] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const controller = new AbortController();
  const signal = controller.signal;
  const [refresh, setRefresh] = useState(Math.random());
  const [templatesOption, setTemplatesOption] = useState(templateOptions[0]);
  const [activeTemplate, setActiveTemplate] = useState(undefined);
  const [activeFolder, setActiveFolder] = useState(undefined);
  const [scope, setScope] = useState(undefined);
  const [members, setMembers] = useState({});

  useEffect(() => {
    //fetch emails
    if (store.company && permission.view) {
      fetchGetTemplates(
        store.session,
        store.company.id,
        templateOptions.prop !== "company" ? store.session.id : undefined,
        signal,
        {
          // member?.team_member_id,
          created_at: dateBoundary.prop,
          search: search?.length > 0 ? search : undefined,
        }
      ).then((res) => {
        if (!res.err) {
          setTemplates(res);
          setLoaded(true);
        } else if (!signal.aborted) {
          setTemplates(false);
          notify("danger", "Unable to fetch templates");
        }
      });
    }
    return () => controller.abort();
  }, [store.session, store.company, search, dateBoundary, refresh, permission]);

  useEffect(() => {
    if (templates) {
      let newTemplates = { ...templates };
      if (
        templatesOption.prop === "company" ||
        templatesOption.prop === "all"
      ) {
        newTemplates.company_folders = newTemplates.company_folders.map(
          (folder) => {
            return {
              ...folder,
              selected: selectAll,
              templates: folder.templates.map((template) => {
                return { ...template, selected: selectAll };
              }),
            };
          }
        );
        newTemplates.company_templates = newTemplates.company_templates.map(
          (template) => {
            return { ...template, selected: selectAll };
          }
        );
      }
      if (
        templatesOption.prop === "personal" ||
        templatesOption.prop === "all"
      ) {
        newTemplates.personal_folders = newTemplates.personal_folders.map(
          (folder) => {
            return {
              ...folder,
              selected: selectAll,
              templates: folder.templates.map((template) => {
                return { ...template, selected: selectAll };
              }),
            };
          }
        );

        newTemplates.personal_templates = newTemplates.personal_templates.map(
          (template) => {
            return { ...template, selected: selectAll };
          }
        );
      }
      setTemplates(newTemplates);
    }
  }, [selectAll, templatesOption]);

  useEffect(() => {
    if (templates) {
      let foldersTotal = 0;
      let templatesTotal = 0;
      templates.company_folders.map((folder) => {
        if (folder.selected) {
          foldersTotal += 1;
        }
        folder.templates.map((template) =>
          template.selected ? (templatesTotal += 1) : null
        );
        return null;
      });
      templates.personal_folders.map((folder) => {
        if (folder.selected) {
          foldersTotal += 1;
        }
        folder.templates.map((template) =>
          template.selected ? (templatesTotal += 1) : null
        );
        return null;
      });
      templates.company_templates.map((template) =>
        template.selected ? (templatesTotal += 1) : null
      );
      templates.personal_templates.map((template) =>
        template.selected ? (templatesTotal += 1) : null
      );
      setSelectedFolders(foldersTotal);
      setSelectedTemplates(templatesTotal);
      if (selectAll && foldersTotal === 0 && templatesTotal === 0) {
        setSelectAll(false);
      }
    } else {
      setSelectedFolders(0);
      setSelectedTemplates(0);
      if (selectAll) {
        setSelectAll(false);
      }
    }
  }, [templates]);

  useEffect(() => {
    if (store.teamMembers) {
      let obj = {};
      store.teamMembers.map((member) => (obj[member.professional_id] = member));
      setMembers(obj);
    }
  }, [store.teamMembers]);

  const selectTemplate = (templatesProp, templateIndex, folderIndex) => {
    let newTemplates = { ...templates };
    let propFolders = [...templates[templatesProp]];
    if (folderIndex !== undefined) {
      let selectedFolder = templates[templatesProp][folderIndex];
      let template =
        templates[templatesProp][folderIndex].templates[templateIndex];
      template.selected = template.selected ? false : true;
      selectedFolder.templates[templateIndex] = template;
      propFolders[folderIndex] = selectedFolder;
      newTemplates[templatesProp] = propFolders;
      setTemplates(newTemplates);
    } else {
      let template = { ...[...templates[templatesProp]][templateIndex] };
      template.selected = template.selected ? false : true;
      propFolders[templateIndex] = template;
      newTemplates[templatesProp] = propFolders;
      setTemplates(newTemplates);
    }
  };
  const selectFolder = (templatesProp, folderIndex) => {
    let newTemplates = { ...templates };
    let propFolders = [...templates[templatesProp]];
    let folder = { ...[...templates[templatesProp]][folderIndex] };
    folder.selected = folder.selected ? false : true;
    propFolders[folderIndex] = folder;
    newTemplates[templatesProp] = propFolders;
    setTemplates(newTemplates);
  };

  const removeTemplate = () => {
    setDeleting(true);
    fetchDeleteTemplate(store.session, store.company.id, [
      activeTemplate.id,
    ]).then((res) => {
      if (!res.err) {
        notify("info", "Template succesfully removed");
        setRefresh(Math.random());
        setDeleting(false);
        hideModal();
      } else {
        notify("danger", res);
      }
    });
  };
  const removeFolder = () => {
    setDeleting(true);
    fetchDeleteFolder(store.session, store.company.id, [
      activeFolder.folder_id,
    ]).then((res) => {
      if (!res.err) {
        notify("info", "Folder succesfully removed");
        setRefresh(Math.random());
        setDeleting(false);
        hideModal();
      } else {
        notify("danger", res);
      }
    });
  };

  const hideModal = () => {
    setActiveModal(undefined);
    setActiveFolder(undefined);
    setActiveTemplate(undefined);
    return;
  };

  const deleteMultiple = () => {
    const ids = collateIds();
    setDeleting(true);
    if (ids.template_ids) {
      fetchDeleteTemplate(
        store.session,
        store.company.id,
        ids.template_ids
      ).then((res) => {
        if (!res.err) {
          notify("info", "Templates succesfully removed");
          setRefresh(Math.random());
          setDeleting(false);
          hideModal();
        } else {
          notify("danger", res);
        }
      });
    }
    if (ids.folder_ids) {
      fetchDeleteFolder(store.session, store.company.id, ids.folder_ids).then(
        (res) => {
          if (!res.err) {
            notify("info", "Folder succesfully removed");
            setRefresh(Math.random());
            setDeleting(false);
            hideModal();
          } else {
            notify("danger", res);
          }
        }
      );
    }
  };

  const collateIds = () => {
    let res = { folder_ids: [], template_ids: [] };
    templates.company_folders.map((folder) => {
      if (folder.selected) {
        res.folder_ids.push(folder.folder_id);
      }
      folder.templates.map((template) =>
        template.selected ? res.template_ids.push(template.id) : null
      );
      return null;
    });
    templates.personal_folders.map((folder) => {
      if (folder.selected) {
        res.folder_ids.push(folder.folder_id);
      }
      folder.templates.map((template) =>
        template.selected ? res.template_ids.push(template.id) : null
      );
      return null;
    });
    templates.company_templates.map((template) =>
      template.selected ? res.template_ids.push(template.id) : null
    );
    templates.personal_templates.map((template) =>
      template.selected ? res.template_ids.push(template.id) : null
    );
    return res;
  };

  return (
    <>
      <MarketingTemplatesActionBar
        selectedFolders={selectedFolders}
        selectedTemplates={selectedTemplates}
        store={store}
        openModal={setActiveModal}
        activeModal={activeModal}
      />
      <ATSContainer>
        {!loaded && <Spinner />}
        {loaded && (
          <>
            {templates && (
              <>
                <FilterContainer className="leo-flex-center-between">
                  <div className="search-container">
                    <SearchInput
                      value={search}
                      onChange={(val) => setSearch(val)}
                      placeholder="Search Templates..."
                    />
                  </div>
                  <div className="filters-container leo-flex-center-between">
                    <SelectDropdown
                      name={templatesOption?.name || "All Templates"}
                      options={templateOptions}
                      onSelect={(option) => {
                        setSelectAll(false);
                        setTimeout(function () {
                          setTemplatesOption(option);
                        }, 10);
                      }}
                    />
                    {/* <div className="separate">
                      <SelectDropdown
                        name={member?.name || "All Members"}
                        options={store.teamMembers}
                        onSelect={(option) => setMember(option)}
                      />
                    </div> */}
                    <div className="separate">
                      <SelectDropdown
                        name={dateBoundary.name || "Select a filter"}
                        options={dateOptions}
                        onSelect={(option) => setDateBoundary(option)}
                      />
                    </div>
                  </div>
                </FilterContainer>
                {templates.personal_templates.length > 0 ||
                templates.personal_folders.length > 0 ||
                templates.company_templates.length > 0 ||
                templates.company_folders.length > 0 ? (
                  <>
                    <div className={styles.container}>
                      <div className="table-responsive">
                        <table className="table table-borderless">
                          <thead>
                            <tr>
                              {(templatesOption.prop === "personal" ||
                                store.role?.role_permissions.owner ||
                                (store.role?.role_permissions.admin &&
                                  store.role?.role_permissions.marketer)) && (
                                <th
                                  scope="col"
                                  className={sharedStyles.tableItemCheckBox}
                                >
                                  <Checkbox
                                    active={selectAll}
                                    onClick={() => setSelectAll(!selectAll)}
                                  />
                                </th>
                              )}
                              <th
                                scope="col"
                                className={sharedStyles.tableHeader}
                              >
                                Title
                              </th>
                              <th
                                scope="col"
                                className={sharedStyles.tableHeader}
                              >
                                Owner
                              </th>
                              <th
                                scope="col"
                                className={sharedStyles.tableHeader}
                              >
                                Template Receivers
                              </th>
                              <PermissionChecker
                                type="edit"
                                valid={{ marketer: true }}
                              >
                                <th
                                  scope="col"
                                  className={sharedStyles.tableHeader}
                                ></th>
                              </PermissionChecker>
                            </tr>
                          </thead>
                          <tbody>
                            {(templatesOption.prop === "personal" ||
                              templatesOption.prop === "all") &&
                              templates.personal_folders &&
                              templates.personal_folders.map(
                                (folder, index) => (
                                  <FolderRow
                                    key={`folder-row-personal-${index}`}
                                    folder={folder}
                                    index={index}
                                    selectFolder={selectFolder}
                                    selectTemplate={selectTemplate}
                                    templatesProp="personal_folders"
                                    setActiveFolder={setActiveFolder}
                                    setActiveTemplate={setActiveTemplate}
                                    setActiveModal={setActiveModal}
                                    setScope={setScope}
                                    selfScope="personal"
                                    members={members}
                                    store={store}
                                    templatesOption={templatesOption}
                                  />
                                )
                              )}
                            {(templatesOption.prop === "company" ||
                              templatesOption.prop === "all") &&
                              templates.company_folders &&
                              templates.company_folders.map((folder, index) => (
                                <FolderRow
                                  key={`folder-row-company-${index}`}
                                  folder={folder}
                                  index={index}
                                  selectFolder={selectFolder}
                                  selectTemplate={selectTemplate}
                                  templatesProp="company_folders"
                                  setActiveFolder={setActiveFolder}
                                  setActiveTemplate={setActiveTemplate}
                                  setActiveModal={setActiveModal}
                                  setScope={setScope}
                                  selfScope="company"
                                  members={members}
                                  store={store}
                                  templatesOption={templatesOption}
                                />
                              ))}
                            {(templatesOption.prop === "personal" ||
                              templatesOption.prop === "all") &&
                              templates.personal_templates &&
                              templates.personal_templates.map(
                                (template, index) => (
                                  <TemplateRow
                                    key={`template-row-personal-${index}`}
                                    template={template}
                                    index={index}
                                    selectTemplate={selectTemplate}
                                    setActiveModal={setActiveModal}
                                    templatesProp="personal_templates"
                                    setActiveTemplate={setActiveTemplate}
                                    setScope={setScope}
                                    selfScope="personal"
                                    members={members}
                                    store={store}
                                    templatesOption={templatesOption}
                                  />
                                )
                              )}
                            {(templatesOption.prop === "company" ||
                              templatesOption.prop === "all") &&
                              templates.company_templates &&
                              templates.company_templates.map(
                                (template, index) => (
                                  <TemplateRow
                                    key={`template-row-company-${index}`}
                                    template={template}
                                    index={index}
                                    selectTemplate={selectTemplate}
                                    setActiveModal={setActiveModal}
                                    templatesProp="company_templates"
                                    setActiveTemplate={setActiveTemplate}
                                    setScope={setScope}
                                    selfScope="company"
                                    members={members}
                                    store={store}
                                    templatesOption={templateOptions}
                                  />
                                )
                              )}
                            {templatesOption.prop === "company" &&
                              templates.company_templates.length === 0 &&
                              templates.company_folders.length === 0 && (
                                <tr className="table-row-hover">
                                  <td
                                    className={sharedStyles.tableItem}
                                    colSpan="4"
                                  >
                                    {`You don't have any company templates here`}
                                  </td>
                                </tr>
                              )}
                            {templatesOption.prop === "personal" &&
                              templates.personal_templates.length === 0 &&
                              templates.personal_folders.length === 0 && (
                                <tr className="table-row-hover">
                                  <td
                                    className={sharedStyles.tableItem}
                                    colSpan="4"
                                  >
                                    {`You don't have any personal templates here`}
                                  </td>
                                </tr>
                              )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ marginTop: 20 }}>
                    <EmptyTab
                      data={[]}
                      title={"You have no templates!"}
                      copy={"Why not create one?"}
                      image={<EmptyContacts />}
                      action={
                        permission.edit
                          ? () => setActiveModal("create-template")
                          : undefined
                      }
                      actionText={"Create Template"}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </ATSContainer>
      {activeModal === "remove-template" && activeTemplate !== undefined && (
        <Suspense fallback={<div />}>
          <ConfirmModalV2
            show={true}
            hide={hideModal}
            header={"Remove Template"}
            text={"Are you sure you want to remove this template"}
            actionText="Remove"
            actionFunction={removeTemplate}
            id="remove-template"
          />
        </Suspense>
      )}
      {activeModal === "remove-folder" && activeFolder !== undefined && (
        <Suspense fallback={<div />}>
          <ConfirmModalV2
            show={true}
            hide={hideModal}
            header={"Remove Folder"}
            text={"Are you sure you want to remove this folder"}
            actionText="Remove"
            actionFunction={removeFolder}
            id="remove-folder"
          />
        </Suspense>
      )}
      {activeModal === "delete-multiple" && (
        <Suspense fallback={<div />}>
          <ConfirmModalV2
            show={true}
            hide={() => {
              setActiveModal(undefined);
            }}
            loading={deleting}
            header={!deleting ? "Remove Selected" : "Removing selected"}
            text={"Are you sure you want to remove all selected"}
            actionText="Remove"
            actionFunction={deleteMultiple}
            id="remove-multiple"
          />
        </Suspense>
      )}
      {activeModal === "create-template" && (
        <Suspense fallback={<div />}>
          <TemplateModal
            hide={hideModal}
            triggerUpdateTemplates={() => setRefresh(Math.random())}
            templates={templates}
          />
        </Suspense>
      )}
      {activeModal === "edit-template" && (
        <Suspense fallback={<div />}>
          <TemplateModal
            hide={hideModal}
            template={activeTemplate}
            editFolder={activeFolder}
            editing={true}
            triggerUpdateTemplates={() => setRefresh(Math.random())}
            templates={templates}
            scope={scope}
          />
        </Suspense>
      )}
    </>
  );
};

const FolderRow = ({
  folder,
  index,
  selectFolder,
  selectTemplate,
  setActiveModal,
  templatesProp,
  setActiveFolder,
  setActiveTemplate,
  setScope,
  selfScope,
  members,
  store,
  templatesOption,
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <tr className="table-row-hover">
        {(templatesOption.prop === "personal" ||
          store.role?.role_permissions.owner ||
          (store.role?.role_permissions.admin &&
            store.role?.role_permissions.marketer)) && (
          <td className={sharedStyles.tableItem}>
            <Checkbox
              active={folder.selected}
              onClick={() => selectFolder(templatesProp, index)}
            />
          </td>
        )}

        <td className={sharedStyles.tableItemFirst}>
          <img src={folderIcon} alt="folder icon" />
          <FolderButton onClick={() => setExpanded(!expanded)}>
            {folder.folder_name} ({folder.templates.length})
          </FolderButton>
        </td>
        <td className={sharedStyles.tableItem}>
          {selfScope === "personal" && members && members[folder.owner_id] && (
            <div className="d-flex align-items-center">
              <AvatarIcon
                name={members[folder.owner_id].name}
                imgUrl={members[folder.owner_id].avatar}
                size={25}
                style={{
                  marginRight: "10px",
                }}
              />
              {members[folder.owner_id].name}
            </div>
          )}
          {selfScope === "company" && (
            <div className="d-flex align-items-center">
              <AvatarIcon
                name={store.company.name}
                imgUrl={store.company.avatar_url}
                size={25}
                style={{
                  marginRight: "10px",
                }}
              />
              {store.company.name}
            </div>
          )}
        </td>
        <td className={sharedStyles.tableItem} />
        {(templatesOption.prop === "personal" ||
          store.role?.role_permissions.owner ||
          (store.role?.role_permissions.admin &&
            store.role?.role_permissions.marketer)) && (
          <td className={sharedStyles.tableItem}>
            <ExtensionMenu>
              <ExtensionMenuOption
                onClick={() => {
                  setActiveModal("remove-folder");
                  setActiveFolder(folder);
                }}
              >
                Delete Folder
              </ExtensionMenuOption>
            </ExtensionMenu>
          </td>
        )}
      </tr>
      {expanded && (
        <>
          {folder.templates && folder.templates.length > 0 ? (
            folder.templates.map((template, ix) => (
              <TemplateRow
                key={`template-row-personal-${index}-${ix}`}
                template={template}
                index={ix}
                folderIndex={index}
                selectTemplate={selectTemplate}
                setActiveModal={setActiveModal}
                templatesProp={templatesProp}
                nested={true}
                setActiveTemplate={(temp) => {
                  setActiveFolder(folder);
                  setActiveTemplate(temp);
                }}
                setScope={setScope}
                selfScope={selfScope}
                members={members}
                store={store}
                templatesOption={templatesOption}
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

const TemplateRow = ({
  template,
  index,
  folderIndex,
  selectTemplate,
  setActiveModal,
  templatesProp,
  nested,
  setActiveTemplate,
  setScope,
  selfScope,
  members,
  store,
  templatesOption,
}) => (
  <tr className="table-row-hover">
    {(templatesOption.prop === "personal" ||
      store.role?.role_permissions.owner ||
      (store.role?.role_permissions.admin &&
        store.role?.role_permissions.marketer)) && (
      <td className={sharedStyles.tableItem}>
        {!nested && (
          <Checkbox
            active={template.selected}
            onClick={() => selectTemplate(templatesProp, index, folderIndex)}
          />
        )}
      </td>
    )}

    <td className={sharedStyles.tableItemFirst}>
      {nested ? (
        <div className="d-flex align-items-center">
          {(templatesOption.prop === "personal" ||
            store.role?.role_permissions.owner ||
            (store.role?.role_permissions.admin &&
              store.role?.role_permissions.marketer)) && (
            <Checkbox
              active={template.selected}
              onClick={() => selectTemplate(templatesProp, index, folderIndex)}
              style={{ marginRight: "15px" }}
            />
          )}
          <div>
            <button
              onClick={() => {
                setActiveModal("edit-template");
                setActiveTemplate(template);
                setScope(selfScope);
              }}
            >
              {template.name}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              setActiveModal("edit-template");
              setActiveTemplate(template);
              setScope(selfScope);
            }}
          >
            {template.name}
          </button>
        </div>
      )}
    </td>
    <td className={sharedStyles.tableItem}>
      {selfScope === "personal" && members && members[template.owner_id] && (
        <div className="d-flex align-items-center">
          <AvatarIcon
            name={members[template.owner_id].name}
            imgUrl={members[template.owner_id].avatar}
            size={25}
            style={{
              marginRight: "10px",
            }}
          />
          {members[template.owner_id].name}
        </div>
      )}
      {selfScope === "company" && (
        <div className="d-flex align-items-center">
          <AvatarIcon
            name={store.company.name}
            imgUrl={store.company.avatar_url}
            size={25}
            style={{
              marginRight: "10px",
            }}
          />
          {store.company.name}
        </div>
      )}
    </td>
    <td className={sharedStyles.tableItem}>
      {sourceExchanger[template.source_type]}
    </td>
    <PermissionChecker type="edit" valid={{ marketer: true }}>
      <td className={sharedStyles.tableItem}>
        <ExtensionMenu>
          <ExtensionMenuOption
            onClick={() => {
              setActiveModal("edit-template");
              setActiveTemplate(template);
              setScope(selfScope);
            }}
          >
            Edit Template
          </ExtensionMenuOption>
          {(templatesOption.prop === "personal" ||
            store.role?.role_permissions.owner ||
            (store.role?.role_permissions.admin &&
              store.role?.role_permissions.marketer)) && (
            <ExtensionMenuOption
              onClick={() => {
                setActiveModal("remove-template");
                setActiveTemplate(template);
              }}
            >
              Delete Template
            </ExtensionMenuOption>
          )}
        </ExtensionMenu>
      </td>
    </PermissionChecker>
  </tr>
);

const FilterContainer = styled.div`
  margin-bottom: 12px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  padding: 10px 15px;

  .search-container {
    width: 200px;
  }
  .filters-container {
    .separate {
      margin-left: 30px;
    }
  }
`;

const FolderButton = styled.button`
  text-transform: uppercase;
  color: ${COLORS.dark_4};
  font-weight: 600;
  font-size: 12px;
  display: inline !important;
  margin-left: 10px;
`;

export default TemplatesTab;
