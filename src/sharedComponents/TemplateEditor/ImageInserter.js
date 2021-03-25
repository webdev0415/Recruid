import React from "react";
import styled from "styled-components";
import { COLORS } from "constants/style";
import { uploadFile } from "helpersV2/marketing/documents";
import notify from "notifications";

const ImageInserter = ({ store, createImageEntity }) => {
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
    let currentSession = { ...store.session };
    delete currentSession["Content-Type"];
    uploadFile(currentSession, formData)
      .then((res) => {
        if (res.status === "ok") {
          createImageEntity(res.document);
        } else {
          notify("danger", "Something went wrong uploading this file");
        }
      })
      .catch(() =>
        notify("danger", "Something went wrong uploading this file")
      );
  };

  return (
    <>
      <input
        type="file"
        id="images"
        name="images"
        accept="image/png, image/jpeg, image/jpg, image/gif"
        onChange={(e) => uploadImage(e)}
        style={{ display: "none" }}
      />
      <SelectionButton htmlFor="images" className="leo-flex-center-end">
        <i className="fas fa-image"></i>
      </SelectionButton>
    </>
  );
};

export default ImageInserter;

const SelectionButton = styled.label`
  color: ${COLORS.dark_4};
  font-weight: 500;
  font-size: 15px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  opacity: 0.5;
  min-width: 24px;
  padding: 1px 4px;
`;
