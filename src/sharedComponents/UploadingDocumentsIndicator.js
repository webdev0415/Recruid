import React from "react";
import styled from "styled-components";
import Spinner from "sharedComponents/Spinner";

const UploadingDocumentsIndicator = ({ text }) => {
  return (
    <UploadingContainer className="leo-flex-center">
      <Spinner color="white" size="sm" inline={true} />
      <span className="text">{text}</span>
    </UploadingContainer>
  );
};

export default UploadingDocumentsIndicator;

const UploadingContainer = styled.div`
  position: fixed;
  bottom: 10px;
  left: 10px;
  max-width: 400px;
  font-size: 12px;
  background: #2a3744;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  z-index: 10;
  span.text {
    margin-left: 10px;
  }
`;
