import React from "react";
import styled from "styled-components";
import { AWS_CDN_URL } from "constants/api";

const FilesDisplay = ({ filesToAdd, setFilesToAdd }) => {
  const removeFile = (index) => {
    let filesCopy = [...filesToAdd];
    filesCopy.splice(index, 1);
    setFilesToAdd(filesCopy);
  };
  return (
    <Wrapper>
      {filesToAdd &&
        filesToAdd.map((doc, index) => (
          <DocumentContainer
            key={`document-${index}`}
            className="leo-flex-center-between"
          >
            <TitleContainer className="leo-flex-center">
              <img src={`${AWS_CDN_URL}/icons/DocumentIcon.svg`} alt="" />
              <div>
                <span>{doc.document_file_name}</span>
              </div>
            </TitleContainer>
            <div>
              <button
                className="button button--default button--grey"
                style={{
                  color: "white",
                  marginLeft: "10px",
                  textDecoration: "none",
                }}
                onClick={() => removeFile(index)}
              >
                Remove
              </button>
            </div>
          </DocumentContainer>
        ))}
    </Wrapper>
  );
};

export default FilesDisplay;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  grid-gap: 10px;
  margin-top: 10px;
  width: 900px;
`;

const DocumentContainer = styled.div`
  background: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.05);
  flex-direction: row;
  padding: 10px;
  position: relative;
  width: 100%;
  // z-index: 1;

  svg,
  img {
    margin-right: 20px;
    min-width: 23px;
  }
`;

const TitleContainer = styled.div`
  max-width: 320px;
  word-wrap: break-word;
`;
