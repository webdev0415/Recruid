import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { COLORS } from "constants/style";
import notify from "notifications";
import { uploadFile } from "helpersV2/marketing/documents";
import { getEmailDocuments } from "helpersV2/marketing/documents";
import useDropdown from "hooks/useDropdown";

const FETCH_ARRAY_LENGTH = 50;

const FileSelector = ({ addFilesToTemplate, store, createImageEntity }) => {
  const [filesToAdd, setFilesToAdd] = useState([]);
  const [documents, setDocuments] = useState(undefined);
  const [image, setImage] = useState(undefined);
  const { node, showSelect, setShowSelect } = useDropdown();

  useEffect(() => {
    if (
      store.company &&
      store.session &&
      documents === undefined &&
      showSelect
    ) {
      getEmailDocuments(
        store.company.id,
        store.session,
        store.user.id,
        [0, FETCH_ARRAY_LENGTH],
        undefined,
        {}
      ).then((res) => {
        if (!res.err) {
          setDocuments(() => {
            let documents = [
              ...res?.company_folders.flatMap((folder) => folder.documents),
              ...res?.personal_folders.flatMap((folder) => folder.documents),
              ...res.company_documents,
              ...res.personal_documents,
              ...res.requested_documents,
            ];
            return documents;
          });
        } else {
          setDocuments(false);
          notify("danger", "Unable to fetch documents");
        }
      });
    }
  }, [store.company, store.session, store.user, showSelect]);

  const uploadImage = (e) => {
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
    let file = filesArr[0];
    let formData = new FormData();
    formData.append("document", file);
    formData.append("title", file?.name);
    formData.append("marketing_source", "company");
    formData.append("marketing_source_id", store.company.id);
    let currentSession = { ...store.session };
    delete currentSession["Content-Type"];
    uploadFile(currentSession, formData)
      .then((res) => {
        if (res.status === "ok") {
          setImage(res.document);
        } else {
          notify("danger", "Something went wrong uploading this file");
        }
      })
      .catch(() =>
        notify("danger", "Something went wrong uploading this file")
      );
  };

  const uploadMarketingFiles = (e) => {
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
    uploadFiles(filesArr);
  };

  const uploadFiles = (filesArr) => {
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
        formData.append("marketing_source", "company");
        formData.append("marketing_source_id", store.company.id);
        let currentSession = { ...store.session };
        delete currentSession["Content-Type"];

        uploadFile(currentSession, formData)
          .then((res) => {
            if (res.status === "ok") {
              returnedObjects.push(res.document);
            } else {
              alert("Something went wrong uploading this file");
            }

            uploadedFiles += 1;
            if (
              uploadedFiles === filesArr.length ||
              uploadedFiles > filesArr.length
            ) {
              setFilesToAdd([...filesToAdd, ...returnedObjects]);
              return;
            } else {
              recursiveFileUpload(index, filesLeft);
            }
          })
          .catch(() => recursiveFileUpload(index, filesLeft));
      };
      recursiveFileUpload(-1, filesArr.length);
    } else {
      console.error("Oops, no files.");
    }
  };

  return (
    <Wrapper ref={node}>
      <SelectionButton
        onClick={() => setShowSelect(!showSelect)}
        className="leo-flex-center-end"
      >
        <div className="leo-flex-center-between leo-pointer">
          Add Files
          <span>
            <i className="fas fa-caret-down"></i>
          </span>
        </div>
      </SelectionButton>
      {showSelect && (
        <DocumentsMenu
          setShowSelect={setShowSelect}
          addFilesToTemplate={addFilesToTemplate}
          uploadMarketingFiles={uploadMarketingFiles}
          documents={documents}
          image={image}
          setImage={setImage}
          filesToAdd={filesToAdd}
          setFilesToAdd={setFilesToAdd}
          uploadImage={uploadImage}
          createImageEntity={createImageEntity}
        />
      )}
    </Wrapper>
  );
};

export default FileSelector;

const DocumentsMenu = ({
  setShowSelect,
  addFilesToTemplate,
  documents,
  filesToAdd,
  setFilesToAdd,
  uploadMarketingFiles,
}) => {
  const removeFile = (index) => {
    let filesCopy = [...filesToAdd];
    filesCopy.splice(index, 1);
    setFilesToAdd(filesCopy);
  };
  return (
    <Menu>
      <h3>Add Files</h3>
      <div>
        <input
          type="file"
          id="documents"
          name="documents"
          accept="image/png, image/jpeg, image/jpg, image/gif, .doc, .pdf, .docx, application/octet-stream’,  ‘application/msword’,  ‘application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
          onChange={uploadMarketingFiles}
          style={{ display: "none" }}
        />
        {/*}<input
          type="file"
          id="images"
          name="images"
          accept="image/png, image/jpeg, image/jpg, image/gif"
          onChange={(e) => uploadImage(e)}
          style={{ display: "none" }}
        />*/}
        <label
          htmlFor="documents"
          className="button button--default button--blue-dark"
        >
          Add attachment
        </label>
        {/*}<label
          htmlFor="images"
          className="button button button--default button--pink"
          style={{ marginLeft: "10px" }}
        >
          Add inline image
        </label>*/}
      </div>
      {documents && (
        <>
          <p>Add an existing file</p>
          <SelectDropdown
            documents={documents}
            onSelect={(option) =>
              setFilesToAdd((filesToAdd) => [...filesToAdd, option])
            }
          />
        </>
      )}
      {filesToAdd && filesToAdd.length > 0 && (
        <FilesList>
          <label className="form-label form-heading form-heading-small">
            Attachments
          </label>
          {filesToAdd.map((file, index) => (
            <li key={`file-list-${index}`} className="leo-flex-center-between">
              <span>{file.document_file_name}</span>{" "}
              <button
                onClick={() => removeFile(index)}
                className="leo-flex-center-center"
              >
                X
              </button>
            </li>
          ))}
        </FilesList>
      )}
      <div className="buttons-container">
        <button
          type="button"
          className="button button--default button--primary"
          onClick={() => {
            if (filesToAdd) {
              addFilesToTemplate(filesToAdd);
              setFilesToAdd([]);
            }
            setShowSelect(false);
          }}
        >
          Add
        </button>
        <button
          type="button"
          className="button button--default button--grey"
          onClick={() => setShowSelect(false)}
        >
          Cancel
        </button>
      </div>
    </Menu>
  );
};

// IN CASE WE WANT TO DISPALY DOCS IN DROPDOWN BY FOLDERS

// const DocFolderItem = ({ folder, setFilesToAdd }) => {
//   const [showDocuments, setShowDocuments] = useState(false);

//   return (
//     <div>
//       <button>{folder.name}</button>
//       {showDocuments && (
//         <SelectDropdown
//             documents={folder.documents}
//             onSelect={(option) =>
//               setFilesToAdd((filesToAdd) => [...filesToAdd, option])
//             }
//           />
//       )}
//     </div>
//   )
// }

const SelectDropdown = ({ onSelect, documents }) => {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState(undefined);
  const { node, showSelect, setShowSelect } = useDropdown();

  useEffect(() => {
    if (search === "" && documents) {
      setOptions([...documents]);
    } else if (documents) {
      setOptions(
        documents.filter((doc) => {
          return doc.document_file_name
            ?.toLowerCase()
            .includes(search.toLowerCase());
        })
      );
    }
  }, [search, documents]);

  return (
    <Wrapper ref={node}>
      <SelectButton
        onClick={() => setShowSelect(!showSelect)}
        className="leo-flex-center-between"
      >
        <>
          <span className="placehoder">Select an existing file to add...</span>
          <span>
            <i className="fas fa-angle-down"></i>
          </span>
        </>
      </SelectButton>
      {showSelect && (
        <SelectMenu>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
          {options &&
            options.map((option, index) => (
              <React.Fragment key={`filter-${option.source_title}-${index}`}>
                {option.separator ? (
                  <>
                    <Separator>{option.source_title}</Separator>
                  </>
                ) : (
                  <SelectOption
                    name={option.title}
                    onClick={() => {
                      onSelect(option);
                      setShowSelect(false);
                    }}
                  />
                )}
              </React.Fragment>
            ))}
        </SelectMenu>
      )}
    </Wrapper>
  );
};

const SelectOption = ({ name, onClick }) => (
  <MenuOption onClick={onClick}>{name}</MenuOption>
);

const SelectMenu = styled.div`
  background-color: ${COLORS.white};
  border: 0;
  border-radius: 0.25rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 5px rgba(0, 0, 0, 0.2);
  left: auto;
  margin: 0;
  max-height: 250px;
  min-width: 10rem;
  overflow: hidden;
  overflow-y: hidden;
  overflow-y: auto;
  padding: 8px 0;
  position: absolute;
  right: 0;
  z-index: 1;
  width: 100%;
  top: 120%;
`;

const MenuOption = styled.button`
  color: #2a3744;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 14px 5px;
  text-align: left;
  width: 100%;

  &:hover {
    background-color: #f6f6f6;
  }

  &.active {
    background: #f6f6f6;
    color: #fff;

    &:hover {
      background-color: #f6f6f6;
    }
  }

  span {
    color: #74767b;
    font-size: 10px;
  }
`;

const SelectButton = styled.button`
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  // font-weight: 500;
  font-size: 14px;
  height: 40px;
  padding: 0 15px;
  width: 100%;

  .placeholder {
    color: #74767b;
  }
`;

const Separator = styled.div`
  color: ${COLORS.dark_4};
  text-transform: uppercase;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.5px;
  padding: 5px 14px 5px;
  text-transform: uppercase;
`;

const SearchInput = styled.input`
  border: none;
  border-bottom: solid #eee 1px;
  font-size: 14px;
  margin-bottom: 10px;
  padding: 0 15px;
  padding-bottom: 15px;
  padding-top: 7px;
  // margin: 10px 0px 10px 0px;
  // padding: 0px 10px 0px 10px;
  width: 100%;
`;

const Menu = styled.div`
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  bottom: 30px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  left: -10px;
  min-width: 350px;
  position: absolute;
  padding: 20px;
  z-index: 1;

  h3 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 15px;
  }

  p {
    color: ${COLORS.dark_4};
    font-weight: normal;
    font-size: 14px;
    margin-bottom: 15px;
    margin-top: 15px;
  }

  .buttons-container {
    border-top: 1px solid #e1e1e1;
    margin-top: 15px;
    padding: 0;
    padding-top: 15px;

    button:first-of-type {
      margin-right: 10px;
    }
  }
`;

const Wrapper = styled.div`
  position: relative;
`;

const SelectionButton = styled.button`
  color: ${COLORS.dark_4};
  font-weight: 500;
  font-size: 12px;

  div {
    padding: 0;
    width: 100%;

    span {
      margin-left: 15px;
    }
  }
`;

const FilesList = styled.ul`
  margin: 10px 0px;
  li {
    margin-bottom: 3px;
  }

  button {
    background: #ff0000bf;
    color: #fff;
    font-size: 11px;
    width: 15px;
    height: 15px;
    font-weight: 600;
    border-radius: 50%;
    line-height: 1;
  }
`;
