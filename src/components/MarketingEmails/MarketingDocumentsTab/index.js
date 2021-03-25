import React, { useState, useEffect } from "react";
import styled from "styled-components";
import notify from "notifications";
import { ATSContainer } from "styles/PageContainers";
import { DocumentRow } from "./DocumentRow";
import { DocumentFolder } from "./DocumentsFolder";
import Checkbox from "sharedComponents/Checkbox";
import EmptyTab from "components/Profiles/components/EmptyTab";
import ConfirmModalV2 from "modals/ConfirmModalV2";
import UploadMarketingDocumentModal from "modals/UploadMarketingDocumentModal";
import SearchInput from "sharedComponents/SearchInput";
import SelectDropdown from "sharedComponents/SelectDropdown";
import {
  getEmailDocuments,
  deleteEmailDocuments,
  uploadDocumentXML,
} from "helpersV2/marketing/documents";
import styles from "components/TalentNetwork/components/TalentNetworkTable/style/talentNetworkTable.module.scss";
import sharedStyles from "assets/stylesheets/scss/collated/shared.module.scss";
import { dateOptions } from "constants/filtersOptions";
import Spinner from "sharedComponents/Spinner";
import MarketingDocumentsActionBar from "components/MarketingEmails/ActionBar/MarketingDocumentsActionBar";
import { EmptyContacts } from "assets/svg/EmptyImages";
const FETCH_ARRAY_LENGTH = 20;

const MarketingDocumentsTab = ({ store }) => {
  const [documents, setDocuments] = useState(undefined);
  const [loaded, setLoaded] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [activeModal, setActiveModal] = useState(undefined);
  const [deleteTarget, setDeleteTarget] = useState(undefined);
  const [documentsIds, setDocumentsIds] = useState([]);
  const [foldersIds, setFoldersIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const controller = new AbortController();
  const signal = controller.signal;
  const [refresh, setRefresh] = useState(Math.random());
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState(undefined);
  const [dateBoundary, setDateBoundary] = useState(
    dateOptions[dateOptions.length - 1]
  );
  // const [folderToEdit, setFolderToEdit] = useState(undefined);
  // Files upload
  const [uploadProgress, setUploadProgress] = useState(40);
  const [documentsToUpload, setDocumentsToUpload] = useState(undefined);
  const [uploadedDocuments, setUploadedDocuments] = useState(undefined);
  const [selectedFolders, setSelectedFolders] = useState(0);
  const [selectedDocuments, setSelectedDocuments] = useState(0);

  useEffect(() => {
    //fetch documents
    if (store.company) {
      getEmailDocuments(
        store.company.id,
        store.session,
        store.user.id,
        [0, FETCH_ARRAY_LENGTH],
        signal,
        {
          created_at: dateBoundary.prop,
          search: search?.length > 0 ? search : undefined,
        }
      ).then((res) => {
        if (!res.err) {
          setDocuments(res);
          // setHasMore(res.length === FETCH_ARRAY_LENGTH);
          setLoaded(true);
        } else if (!signal.aborted) {
          setDocuments(false);
          notify("danger", "Unable to fetch documents");
        }
      });
    }
    return () => controller.abort();
  }, [store.session, store.company, refresh, dateBoundary, search]);

  // useEffect(() => {
  //   if (documents) {
  //     let newDocuments = { ...documents };
  //     newDocuments = newDocuments.map((doc) => {
  //       return { ...doc, selected: selectAll };
  //     });
  //     Object.entries(newDocuments).forEach((docArr) => {
  //       docArr.map((doc) => ({ ...doc, selected: selectAll }));
  //     });
  //     setSelectedTotal(selectAll ? documents.length : 0);
  //     setDocuments(newDocuments);
  //   }
  //
  // }, [selectAll]);

  useEffect(() => {
    if (documents) {
      let newDocuments = { ...documents };
      newDocuments.company_folders = newDocuments.company_folders.map(
        (folder) => {
          return {
            ...folder,
            selected:
              !scope || !scope.value || scope.value === "company"
                ? selectAll
                : false,
            documents: folder.documents.map((doc) => {
              return {
                ...doc,
                selected:
                  !scope || !scope.value || scope.value === "company"
                    ? selectAll
                    : false,
              };
            }),
          };
        }
      );
      newDocuments.company_documents = newDocuments.company_documents.map(
        (doc) => {
          return {
            ...doc,
            selected:
              !scope || !scope.value || scope.value === "company"
                ? selectAll
                : false,
          };
        }
      );
      newDocuments.personal_folders = newDocuments.personal_folders.map(
        (folder) => {
          return {
            ...folder,
            selected:
              !scope || !scope.value || scope.value === "professional"
                ? selectAll
                : false,
            documents: folder.documents.map((doc) => {
              return {
                ...doc,
                selected:
                  !scope || !scope.value || scope.value === "professional"
                    ? selectAll
                    : false,
              };
            }),
          };
        }
      );

      newDocuments.personal_documents = newDocuments.personal_documents.map(
        (doc) => {
          return {
            ...doc,
            selected:
              !scope || !scope.value || scope.value === "professional"
                ? selectAll
                : false,
          };
        }
      );
      setDocuments(newDocuments);
    }
  }, [selectAll, scope]);

  useEffect(() => {
    if (documents) {
      let foldersTotal = 0;
      let documentsTotal = 0;
      documents.company_folders.map((folder) => {
        if (folder.selected) {
          foldersTotal += 1;
        }
        folder.documents.map((doc) =>
          doc.selected ? (documentsTotal += 1) : null
        );
        return null;
      });
      documents.personal_folders.map((folder) => {
        if (folder.selected) {
          foldersTotal += 1;
        }
        folder.documents.map((doc) =>
          doc.selected ? (documentsTotal += 1) : null
        );
        return null;
      });
      documents.company_documents.map((doc) =>
        doc.selected ? (documentsTotal += 1) : null
      );
      documents.personal_documents.map((doc) =>
        doc.selected ? (documentsTotal += 1) : null
      );
      setSelectedFolders(foldersTotal);
      setSelectedDocuments(documentsTotal);
      if (selectAll && foldersTotal === 0 && documentsTotal === 0) {
        setSelectAll(false);
      }
    } else {
      setSelectedFolders(0);
      setSelectedDocuments(0);
      if (selectAll) {
        setSelectAll(false);
      }
    }
  }, [documents]);

  const callRefresh = () => setRefresh(Math.random());

  const selectDoc = (index, folder, folderIndex) => {
    if (folder === "personal_documents" || folder === "company_documents") {
      let newDocuments = { ...documents };
      //eslint-disable-next-line
      const selectedBool = !Boolean(newDocuments[folder][index].selected);
      newDocuments[folder][index].selected = selectedBool;
      setDocumentsIds((ids) => {
        let newIds = [...ids];
        if (selectedBool) {
          newIds.push(newDocuments[folder][index].id);
          return newIds;
        }
        const deleteIndex = newIds.findIndex(
          (el) => el === newDocuments[folder][index].id
        );
        newIds.splice(deleteIndex, 1);
        return newIds;
      });
      return setDocuments(newDocuments);
    }

    let newDocuments = { ...documents };
    //eslint-disable-next-line
    const selectedBool = !Boolean(
      newDocuments[folder][folderIndex].documents[index].selected
    );
    newDocuments[folder][folderIndex].documents[index].selected = selectedBool;
    setDocumentsIds((ids) => {
      let newIds = [...ids];
      if (selectedBool) {
        newIds.push(newDocuments[folder][folderIndex].documents[index].id);
        return newIds;
      }
      const deleteIndex = newIds.findIndex(
        (el) => el === newDocuments[folder][folderIndex].documents[index].id
      );
      newIds.splice(deleteIndex, 1);
      return newIds;
    });
    return setDocuments(newDocuments);
  };

  const selectFolder = (folderName, index) => {
    let newDocuments = { ...documents };
    //eslint-disable-next-line
    const selectedBool = !Boolean(newDocuments[folderName][index].selected);
    newDocuments[folderName][index].selected = selectedBool;
    setFoldersIds((ids) => {
      let newIds = [...ids];
      if (selectedBool) {
        newIds.push(newDocuments[folderName][index].id);
        return newIds;
      }
      const deleteIndex = newIds.findIndex(
        (el) => el === newDocuments[folderName][index].id
      );
      newIds.splice(deleteIndex, 1);
      return newIds;
    });
  };

  const removeDoc = () => {
    setDeleting(true);
    deleteEmailDocuments(store.session, store.company.id, deleteTarget).then(
      (res) => {
        if (!res.err) {
          notify("info", "Document succesfully removed");
          // let newDocuments = [...documents];
          // setDocuments(newDocuments);
          callRefresh();
          setDeleting(false);
          setActiveModal(undefined);
        } else {
          notify("danger", res.data);
        }
      }
    );
  };

  const deleteMultiple = () => {
    setDeleting(true);
    deleteEmailDocuments(store.session, store.company.id, {
      documents_ids: documentsIds,
      folders_ids: foldersIds,
    }).then((res) => {
      if (!res.err) {
        notify("info", "Documents succesfully removed");
        callRefresh();
        setSelectAll(false);
        setDeleting(false);
        setActiveModal(undefined);
      } else {
        notify("danger", res);
      }
    });
  };

  const uploadMarketingFiles = (e, type) => {
    setActiveModal("upload-marketing-documents");
    let files = e.target.files;
    let filesArr = [];

    let rawArr = Object.values(files);
    rawArr.map((file) =>
      file.size > 5000000
        ? alert(
            "Could not add " +
              file.name +
              ", File size too large, please upload file less than 5MB"
          )
        : filesArr.push(file)
    );

    setDocumentsToUpload(filesArr);
    uploadFiles(filesArr, type);
  };

  const uploadFiles = (filesArr) => {
    setUploadProgress(0);
    if (filesArr.length > 0) {
      let uploadedFiles = 0;
      let returnedObjects = [];

      const recursiveFileUpload = (index, filesLeft) => {
        if (filesLeft === 0 || index === filesArr.length) {
          return;
        }
        filesLeft--;
        index++;
        let file = filesArr[index];

        let formData = new FormData();
        formData.append("document", file);
        formData.append("title", file?.name);
        formData.append("marketing", true);
        formData.append("company_id", store.company.id);
        // formData.append("ptn_id", tnProfile.ptn_id);
        let currentSession = { ...store.session };
        delete currentSession["Content-Type"];

        const handleSuccess = (res) => {
          if (res.status === "ok") {
            returnedObjects.push(res.document);
            setDocumentsToUpload((docsToUpload) => {
              let newDocsToUpload = [...docsToUpload];
              newDocsToUpload[index].uploaded = true;
              return newDocsToUpload;
            });
            setUploadedDocuments(returnedObjects);
          } else {
            setDocumentsToUpload((docsToUpload) => {
              let newDocsToUpload = [...docsToUpload];
              newDocsToUpload[index].uploaded = false;
              return newDocsToUpload;
            });
            alert("Something went wrong uploading this file");
          }

          uploadedFiles += 1;
          if (
            uploadedFiles === filesArr.length ||
            uploadedFiles > filesArr.length
          ) {
            callRefresh();
            return;
          } else {
            recursiveFileUpload(index, filesLeft);
          }
        };

        const handleError = () => recursiveFileUpload(index, filesLeft);

        uploadDocumentXML(
          currentSession,
          formData,
          setUploadProgress,
          handleSuccess,
          handleError
        );
        // uploadFile(currentSession, formData)
        //   .then((res) => {
        //     if (res.status === "ok") {
        //       returnedObjects.push(res.document);
        //     } else {
        //       alert("Something went wrong uploading this file");
        //     }

        //     uploadedFiles += 1;
        //     if (
        //       uploadedFiles === filesArr.length ||
        //       uploadedFiles > filesArr.length
        //     ) {
        //       callRefresh();
        //       return;
        //     } else {
        //       recursiveFileUpload(index, filesLeft);
        //     }
        //   })
        //   .catch((error) => recursiveFileUpload(index, filesLeft));
      };
      recursiveFileUpload(-1, filesArr.length);
    } else {
      console.error("Oops, no files.");
    }
  };

  const handleDocumentDelete = (doc) => () => {
    setActiveModal("remove-document");
    setDeleteTarget({ documents_ids: doc.id });
  };

  const handleFolderDelete = (folder) => () => {
    setActiveModal("remove-folder");
    setDeleteTarget({ folders_ids: folder.id });
  };

  // const handleFolderRename = (folder) => {
  //   setFolderToEdit(folder);
  //   setActiveModal("rename-folder");
  // };

  return (
    <>
      <MarketingDocumentsActionBar
        selectedFolders={selectedFolders}
        selectedDocuments={selectedDocuments}
        store={store}
        openModal={setActiveModal}
        activeModal={activeModal}
      />
      <ATSContainer>
        {!loaded && <Spinner />}
        {loaded && (
          <>
            <FilterContainer className="leo-flex-center-between">
              <div className="search-container">
                <SearchInput
                  value={search}
                  onChange={(val) => setSearch(val)}
                  placeholder="Search Documents..."
                />
              </div>
              <div className="filters-container leo-flex-center-between">
                <div className="separate">
                  <SelectDropdown
                    name={scope?.name || "All"}
                    options={[
                      { name: "All", value: undefined },
                      { name: "Personal", value: "professional" },
                      { name: "Company", value: "company" },
                    ]}
                    onSelect={(option) => setScope(option)}
                  />
                </div>
                <div className="separate">
                  <SelectDropdown
                    name={dateBoundary.name || "Select a filter"}
                    options={dateOptions}
                    onSelect={(option) => setDateBoundary(option)}
                  />
                </div>
              </div>
            </FilterContainer>
            {documents.personal_documents?.length ||
            documents.company_documents?.length ||
            documents.company_folders?.length ||
            documents.personal_folders?.length ? (
              <>
                <div className={styles.container}>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          {(scope?.value === "professional" ||
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
                          <th scope="col" className={sharedStyles.tableHeader}>
                            Title
                          </th>
                          <th scope="col" className={sharedStyles.tableHeader}>
                            Owned By
                          </th>
                          <th scope="col" className={sharedStyles.tableHeader}>
                            Uploaded
                          </th>
                          <th
                            scope="col"
                            className={sharedStyles.tableHeader}
                          ></th>
                        </tr>
                      </thead>
                      <tbody>
                        {scope?.value !== "professional" &&
                          documents?.company_folders?.map((folder, index) => (
                            <DocumentFolder
                              folder={folder}
                              selfScope="company_folders"
                              selectDoc={selectDoc}
                              folderIndex={index}
                              handleDocumentDelete={handleDocumentDelete}
                              handleFolderDelete={handleFolderDelete}
                              selectFolder={selectFolder}
                              callRefresh={callRefresh}
                              key={`marketing-document-folder-${folder.id}`}
                              scope={scope}
                              store={store}
                            />
                          ))}
                        {scope?.value !== "company" &&
                          documents?.personal_folders?.map((folder, index) => (
                            <DocumentFolder
                              folder={folder}
                              selfScope="personal_folders"
                              selectDoc={selectDoc}
                              folderIndex={index}
                              handleDocumentDelete={handleDocumentDelete}
                              handleFolderDelete={handleFolderDelete}
                              selectFolder={selectFolder}
                              callRefresh={callRefresh}
                              key={`marketing-document-folder-${folder.id}`}
                              scope={scope}
                              store={store}
                            />
                          ))}
                        {scope?.value !== "company" &&
                          documents?.personal_documents?.map((doc, index) => (
                            <DocumentRow
                              document={doc}
                              index={index}
                              selectDoc={selectDoc}
                              selfScope="personal_documents"
                              handleDocumentDelete={handleDocumentDelete}
                              callRefresh={callRefresh}
                              key={`marketing-document-${doc.id}`}
                              scope={scope}
                              store={store}
                            />
                          ))}
                        {scope?.value !== "professional" &&
                          documents?.company_documents?.map((doc, index) => (
                            <DocumentRow
                              document={doc}
                              index={index}
                              selectDoc={selectDoc}
                              selfScope="company_documents"
                              handleDocumentDelete={handleDocumentDelete}
                              callRefresh={callRefresh}
                              key={`marketing-document-${doc.id}`}
                              scope={scope}
                              store={store}
                            />
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ marginTop: 20 }}>
                <EmptyTab
                  data={documents}
                  title={"You have no documents!"}
                  copy={"Why not add one?"}
                  image={<EmptyContacts />}
                />
              </div>
            )}
          </>
        )}
        <input
          type="file"
          id="documents"
          name="documents"
          accept="image/png, image/jpeg, image/jpg, image/gif, .doc, .pdf, .docx, application/octet-stream’,  ‘application/msword’,  ‘application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
          onChange={uploadMarketingFiles}
          style={{ display: "none" }}
        />
      </ATSContainer>
      {activeModal === "remove-document" && (
        <ConfirmModalV2
          show={true}
          hide={() => {
            setActiveModal(undefined);
          }}
          header={"Remove Document"}
          text={"Are you sure you want to remove this document?"}
          actionText="Remove"
          actionFunction={removeDoc}
          id="remove-document"
        />
      )}
      {activeModal === "remove-folder" && (
        <ConfirmModalV2
          show={true}
          hide={() => {
            setActiveModal(undefined);
            setDeleteTarget(undefined);
          }}
          header={"Remove Folder"}
          text={
            "Are you sure you want to remove this folder? All of the documents inside this folder will be deleted."
          }
          actionText="Remove"
          actionFunction={removeDoc}
          id="remove-folder"
        />
      )}
      {activeModal === "delete-multiple" && (
        <ConfirmModalV2
          show={true}
          hide={() => {
            setActiveModal(undefined);
          }}
          loading={deleting}
          header={!deleting ? "Remove Documents" : "Removing Documents"}
          text={"Are you sure you want to remove these documents"}
          actionText="Remove"
          actionFunction={deleteMultiple}
          id="remove-multiple"
        />
      )}
      {activeModal === "upload-marketing-documents" && (
        <UploadMarketingDocumentModal
          show={true}
          hide={() => setActiveModal(undefined)}
          uploadProgress={uploadProgress}
          documentsToUpload={documentsToUpload}
          uploadedDocuments={uploadedDocuments}
          refreshParent={callRefresh}
        />
      )}
    </>
  );
};

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
export default MarketingDocumentsTab;
