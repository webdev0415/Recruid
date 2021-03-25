import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import GlobalContext from "contexts/globalContext/GlobalContext";

import generalStyles from "assets/stylesheets/scss/collated/profileTabs.module.scss";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import EmptyTab from "components/Profiles/components/EmptyTab";
import FileReader from "sharedComponents/FileReader";
import TimeAgo from "react-timeago";
import useDropdown from "hooks/useDropdown";

import {
  TabTitle,
  SectionTitleContainer,
  SectionContainer,
} from "components/Profiles/components/ProfileComponents";
import { Star } from "sharedComponents/CandidateRating";
import ToggleV3 from "sharedComponents/ToggleV3";
import { fetchToggleHiringManagerDocuments } from "helpersV2/documents";
import notify from "notifications";
import { AWS_CDN_URL } from "constants/api";
import { EmptyActivity } from "assets/svg/EmptyImages";
const DocumentsTab = ({
  documents,
  setDocuments,
  deleteDocument,
  uploadFilesToProfile,
  canEdit,
  origin,
  togglePrimaryCv,
  toggleMakePublic,
  isPublished,
}) => {
  const store = useContext(GlobalContext);
  const [viewFile, setViewFile] = useState(undefined);
  const [fileType, setFileType] = useState(undefined);

  const toggleSHowHiringManagers = (index) => {
    fetchToggleHiringManagerDocuments(store.session, [
      documents[index].id,
    ]).then((res) => {
      if (!res.err) {
        notify("info", "Document permission updated");
        let copyDocs = [...documents];
        copyDocs[index] = {
          ...copyDocs[index],
          show_for_hm: copyDocs[index].show_for_hm ? false : true,
        };
        setDocuments(copyDocs);
      } else {
        notify("danger", "Unable to update document hiring manager permission");
      }
    });
  };

  return (
    <>
      <SectionContainer>
        {origin !== "jobs" && (
          <SectionTitleContainer>
            <TabTitle>Documents</TabTitle>
          </SectionTitleContainer>
        )}

        {!viewFile && (
          <>
            <FlexContainer>
              {canEdit && documents && (
                <InfoLabel>
                  You can also drag and drop your files anywhere in the profile.
                  Files we accept are png, jpeg, jpg, gif, .doc, .pdf and .docx
                </InfoLabel>
              )}
              <input
                type="file"
                id="documents"
                name="documents"
                accept="image/png, image/jpeg, image/jpg, image/gif, .doc, .pdf, .docx, application/octet-stream’,  ‘application/msword’,  ‘application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                multiple
                onChange={uploadFilesToProfile}
                style={{ display: "none" }}
              />
              {canEdit && documents && documents?.length > 0 && (
                <label
                  htmlFor="documents"
                  className="button button--default button--blue-dark"
                >
                  Add Document
                </label>
              )}
            </FlexContainer>
            {documents &&
              documents.map((doc, index) => {
                return (
                  <DocumentItem
                    key={`cv_${index}`}
                    doc={doc}
                    index={index}
                    deleteDocument={deleteDocument}
                    setViewFile={setViewFile}
                    setViewType={setFileType}
                    canEdit={canEdit}
                    store={store}
                    origin={origin}
                    togglePrimaryCv={togglePrimaryCv}
                    toggleMakePublic={toggleMakePublic}
                    isPublished={isPublished}
                    toggleSHowHiringManagers={toggleSHowHiringManagers}
                  />
                );
              })}
          </>
        )}
        {viewFile && fileType && (
          <>
            <button
              className="button button--default button--blue-dark"
              onClick={() => {
                setViewFile(undefined);
                setFileType(undefined);
              }}
              style={{
                marginBottom: "10px",
              }}
            >
              Close
            </button>
            {console.log(
              viewFile.document_content_type,
              fileType,
              viewFile.url
            )}
            <FileReader
              rawType={viewFile.document_content_type}
              fileType={fileType}
              fileUrl={viewFile.url}
            />
          </>
        )}
        {canEdit && documents?.length === 0 && origin !== "jobs" && (
          <label
            htmlFor="documents"
            className="button button--default button--blue-dark"
            style={{ float: "right" }}
          >
            Add Document
          </label>
        )}
        <EmptyTab
          data={documents}
          title={"This profile has no documents."}
          copy={"Why don't you add one?"}
          image={origin === "jobs" ? <EmptyActivity /> : undefined}
        />
      </SectionContainer>
    </>
  );
};

function DocumentItem({
  doc,
  deleteDocument,
  index,
  setViewFile,
  setViewType,
  canEdit,
  store,
  origin,
  togglePrimaryCv,
  toggleSHowHiringManagers,
  isPublished,
}) {
  const [fileType, setFileType] = useState(undefined);
  const { node, showSelect, setShowSelect } = useDropdown();

  useEffect(() => {
    if (doc && doc.document_content_type) {
      if (validViewTypes[doc.document_content_type.split("/")[1]]) {
        setFileType(doc.document_content_type.split("/")[1]);
      } else {
        Object.keys(validViewTypes).map((type) => {
          if (doc.url.includes(`.${type}`)) {
            setFileType(type);
          }
          return null;
        });
      }
    }
  }, [doc, setFileType]);

  return (
    <DocWrapper ref={node}>
      <DocumentContainer>
        <div className={generalStyles.documentDetails}>
          <img src={`${AWS_CDN_URL}/icons/DocumentIcon.svg`} alt="" />
          <div
            className={generalStyles.noteHeader}
            style={{ margin: "0", flexDirection: "column" }}
          >
            <TitleSpan>
              {doc.title}
              {origin === "candidate" && (
                <StarButton onClick={() => togglePrimaryCv(index)}>
                  <Star active={doc.is_latest_cv} />
                  <Tootltip className="hover-tooltip">
                    {doc.is_latest_cv
                      ? "Highlighed resume"
                      : "Highligh this resume"}
                  </Tootltip>
                </StarButton>
              )}
            </TitleSpan>
            {doc.created_at && (
              <TimeAgoSpan>
                Uploaded <TimeAgo date={doc.created_at} />
              </TimeAgoSpan>
            )}
          </div>
        </div>

        <div className={generalStyles.activityDate}>
          {fileType && (
            <OptionButton
              className="button-option"
              onClick={() => {
                setViewFile(doc);
                setViewType(fileType);
              }}
            >
              <img src={`${AWS_CDN_URL}/icons/ViewSvg.svg`} alt="" />
            </OptionButton>
          )}
          <OptionLink
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="button-option"
          >
            <img src={`${AWS_CDN_URL}/icons/DownloadSvg.svg`} alt="" />
          </OptionLink>
          {((canEdit && store.role.role_permissions.admin) ||
            store.role.role_permissions.owner) && (
            <OptionButton
              onClick={() => deleteDocument(doc.id, index)}
              className="button-option"
            >
              <img src={`${AWS_CDN_URL}/icons/DeleteSvg.svg`} alt="" />
            </OptionButton>
          )}
          {canEdit &&
            (origin === "candidate" || (origin === "jobs" && isPublished)) && (
              <OptionButton
                onClick={() => setShowSelect(!showSelect)}
                className="button-option"
              >
                <img src={`${AWS_CDN_URL}/icons/EditPen.svg`} alt="EditPen" />
              </OptionButton>
            )}
        </div>
      </DocumentContainer>
      {showSelect && (origin === "candidate" || origin === "jobs") && (
        <TogglesContainer>
          {/*origin === "jobs" && isPublished && (
            <ToggleContainer>
              <ToggleV3
                name={`toggle-val-${index}`}
                toggle={() => toggleMakePublic(index)}
                checked={doc.public_doc}
              />
              <ToggleLabel>Candidates</ToggleLabel>
              <OverlayTrigger
                key={`top-${index + 1}`}
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-top ${index}`}>
                    <strong>
                      Toggling this will allow candidates to view this document
                      in the careers portal page for this job.
                    </strong>
                  </Tooltip>
                }
              >
                <span className="info-icon">
                  <i className="fas fa-exclamation-circle"></i>
                </span>
              </OverlayTrigger>
            </ToggleContainer>
          )*/}
          <ToggleContainer>
            <ToggleV3
              name={`toggle-val-${index}`}
              toggle={() => toggleSHowHiringManagers(index)}
              checked={doc.show_for_hm}
            />
            <ToggleLabel>Hiring Managers</ToggleLabel>
            <OverlayTrigger
              key={`top-${index + 1}`}
              placement={"top"}
              overlay={
                <Tooltip id={`tooltip-top ${index}`}>
                  <strong>
                    Toggling this will allow hiring managers to view this
                    document when accessing this profile.
                  </strong>
                </Tooltip>
              }
            >
              <span className="info-icon">
                <i className="fas fa-exclamation-circle"></i>
              </span>
            </OverlayTrigger>
          </ToggleContainer>
        </TogglesContainer>
      )}
    </DocWrapper>
  );
}

export default DocumentsTab;

const validViewTypes = {
  png: true,
  jpeg: true,
  gif: true,
  bmp: true,
  pdf: true,
  csv: true,
  xslx: true,
  docx: true,
  mp4: true,
  webm: true,
  mp3: true,
};

const DocumentContainer = styled.div`
  align-items: center;
  background: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 15px;
  position: relative;
  width: 100%;
  z-index: 1;
  max-width: 600px;

  svg,
  img {
    margin-right: 20px;
    min-width: 23px;
  }

  &:hover {
    .button-option {
      display: initial;
    }
  }
`;

const TitleSpan = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
  display: flex;
`;

const TimeAgoSpan = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #74767b;
  margn-top: 5px;
`;

const OptionButton = styled.button`
  margin-left: 15px;
  display: none;
  svg,
  img {
    margin-right: 0px !important;
  }
`;

const OptionLink = styled.a`
  margin-left: 15px;
  display: none;
  svg,
  img {
    margin-right: 0px !important;
  }
`;

const StarButton = styled.button`
  position: relative;
  margin-left: 10px;

  .hover-div {
    display: none;
  }

  &:hover {
    .hover-div,
    .hover-tooltip {
      display: initial;
    }
  }

  svg,
  img {
    margin-right: 0;
    min-width: initial;
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const Tootltip = styled.div`
  display: none;
  position: absolute;
  background: #dfe9f4;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: #53585f;
  padding: 10px 5px;
  width: max-content;
  top: 20px;
  left: 5px;
`;

const InfoLabel = styled.p`
  margin-bottom: 12px;
  font-size: 12px;
  color: #1e1e1e;
  font-weight: bold;
  max-width: 350px;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 800px;
  margin: auto;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: flex-start;

  .info-icon {
    margin-left: 5px;
    font-size: 10px;
    color: #c4c4c4;
    &:hover {
      color: #606060;
    }
  }
`;

const TogglesContainer = styled.div`
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.05);
  background: white;
  padding: 5px 10px;
  margin-bottom: 10px;
  width: max-content;
`;

const ToggleLabel = styled.label`
  color: #1e1e1e;
  font-size: 12px;
  margin-left: 10px;
`;

const DocWrapper = styled.div`
  position: relative;
`;
