import React, { useEffect, useState } from "react";
import FileViewer from "react-file-viewer";
import notify from "notifications";
import styled from "styled-components";
const FileReader = ({ rawType, fileUrl, fileType, small }) => {
  const [formattedType, setFormattedType] = useState(undefined);

  useEffect(() => {
    if (fileType && !formattedType) {
      setFormattedType(fileType);
    } else if (rawType && !formattedType) {
      if (validViewTypes[rawType.split("/")[1]]) {
        setFormattedType(rawType.split("/")[1]);
      } else {
        Object.keys(validViewTypes).map((type) => {
          if (fileUrl.includes(`.${type}`)) {
            setFormattedType(type);
          }
          return null;
        });
      }
    }
  }, [rawType, fileType, setFormattedType, fileUrl, formattedType]);
  return (
    <>
      {formattedType && (
        <FileWrapper style={small && { maxWidth: 475 }}>
          <FileViewer
            fileType={formattedType}
            filePath={fileUrl}
            errorComponent={() => <div />}
            onError={() => {
              notify("danger", "Unable to display file");
            }}
          />
        </FileWrapper>
      )}
    </>
  );
};

export default FileReader;

const FileWrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  max-width: 700px;
  width: 100%;
  z-index: 1;

  .document-container {
    background: transparent !important;
    width: auto !important;
  }

  .pg-viewer-wrapper {
    max-height: 600px !important;
  }
`;
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
