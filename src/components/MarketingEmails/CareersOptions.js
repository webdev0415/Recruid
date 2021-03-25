import React, { useState } from "react";
import styled from "styled-components";
import { TwitterPicker } from "react-color";
import notify from "notifications";
import TextEditor from "sharedComponents/TextEditor";
import { PermissionChecker } from "constants/permissionHelpers";
import { CAREERS_PORTAL_URL } from "constants/api";
const StyledContainer = styled.div`
  border-top: 1px solid #eeeeee;
  margin-top: 20px;
  padding-top: 30px;
`;

const StyledImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;

const ColorBox = styled.div`
  border-radius: 4px;
  height: 40px;
  margin-bottom: 10px;
  width: 25%;
`;

const DescriptionContainer = styled.div``;

const CareersOptions = ({
  company,
  setCompany,
  companyData,
  setDescription,
  setHeader,
  setColor,
  setLogo,
  permission,
}) => {
  return (
    <StyledContainer>
      <div className="row">
        <div className="col-sm-6">
          <CareersLink
            linkUrl={`${CAREERS_PORTAL_URL}/${company.mention_tag}`}
          />
        </div>
        <div className="col-sm-6">
          <CareersLogo
            setLogo={setLogo}
            logoImg={company.careers_portal.logo}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <CareersDescription
            description={company.careers_portal.description}
            setDescription={setDescription}
            permission={permission}
          />
        </div>
        <div className="col-sm-6">
          <CareersHeader
            setHeader={setHeader}
            headerImg={company.careers_portal.header}
          />
        </div>
      </div>
      <div className="row" style={{ marginBottom: "30px" }}>
        <div className="col-sm-6">
          <CareersColorPicker
            color={
              company.careers_portal.color_theme.length > 0
                ? company.careers_portal.color_theme
                : "black"
            }
            setColor={setColor}
          />
        </div>
      </div>
      <div className="row" style={{ marginBottom: "30px" }}>
        <div className="col-sm-12">
          <label className="form-label form-heading form-heading-small form-heading-small">
            Terms
          </label>
          <DescriptionContainer>
            <TextEditor
              returnState={(body) => setCompany({ ...company, terms: body })}
              placeholder="Enter your terms..."
              initialBody={companyData?.terms}
            />
          </DescriptionContainer>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <label className="form-label form-heading form-heading-small form-heading-small">
            Privacy
          </label>
          <DescriptionContainer>
            <TextEditor
              returnState={(body) => setCompany({ ...company, privacy: body })}
              placeholder="Enter your privacy policy..."
              initialBody={companyData?.privacy}
            />
          </DescriptionContainer>
        </div>
      </div>
    </StyledContainer>
  );
};

export default CareersOptions;

const CareersLink = ({ linkUrl }) => {
  return (
    <>
      <label className="form-label form-heading form-heading-small">
        Careers Link
      </label>
      <input className="form-control" type="text" value={linkUrl} disabled />
    </>
  );
};
const CareersDescription = ({ description, setDescription, permission }) => {
  return (
    <>
      <label className="form-label form-heading form-heading-small">
        Careers Description
      </label>
      <textarea
        className="form-control"
        rows="10"
        cols="33"
        placeholder="Enter a decription for you careers portal"
        value={description}
        onChange={setDescription}
        disabled={!permission.edit}
      />
    </>
  );
};
const CareersLogo = ({ logoImg, setLogo }) => {
  const [image, setImage] = useState(logoImg);
  const addLogo = () => {
    document.getElementById("logoUpload").click();
  };
  const addLogoImage = (e) => {
    let file = e.target.files[0];
    if (file.size < 5000000) {
      setLogo(e.target.files[0]);
      let reader = new FileReader();
      // let result;
      reader.addEventListener(
        "load",
        function () {
          setImage(reader.result);
        },
        false
      );
      reader.readAsDataURL(file);
    } else {
      alert("File is too big");
    }
  };

  const removeLogoImage = () => {
    setLogo(null);
    setImage(null);
  };

  const StyledLogo = styled.img`
    margin-right: 30px;
    max-height: 40px;
    max-width: 120px;
    object-fit: contain;
  `;
  return (
    <div className="leo-flex">
      <div>
        {image && (
          <StyledLogo
            src={image}
            alt="Careers Logos"
            style={{ height: "100%", width: "100%" }}
          />
        )}
      </div>
      <div>
        <label className="form-label form-heading form-heading-small form-heading-small">
          Careers Logo (Recommended 120x40px)
        </label>
        <PermissionChecker type="edit" valid={{ marketer: true }}>
          <div>
            <input
              type="file"
              id="logoUpload"
              accept="image/png, image/jpeg, image/jpg"
              style={{ display: "none" }}
              onChange={(e) => addLogoImage(e)}
            />
            <div
              className="button button--default button--primary"
              onClick={addLogo}
              style={{ marginRight: "10px" }}
            >
              Upload File
            </div>
            {image && (
              <div
                className="button button--default button--white"
                onClick={removeLogoImage}
              >
                Remove
              </div>
            )}
          </div>
        </PermissionChecker>
      </div>
    </div>
  );
};
const CareersHeader = ({ headerImg, setHeader }) => {
  const [image, setImage] = useState(headerImg);
  const addHeader = () => {
    document.getElementById("headerUpload").click();
  };

  const removeHeader = () => {
    setHeader(null);
    setImage(null);
  };

  const addHeaderImage = (e) => {
    let file = e.target.files[0];
    if (!file) {
      return notify("danger", "Please upload a file");
    }
    if (file.size < 5000000) {
      setHeader(e.target.files[0]);
      let headerReader = new FileReader();
      // let result;
      headerReader.addEventListener(
        "load",
        function () {
          setImage(headerReader.result);
        },
        false
      );
      headerReader.readAsDataURL(file);
    } else {
      return notify("danger", "File is too big");
    }
  };
  return (
    <div>
      <label className="form-label form-heading form-heading-small">
        Careers Header (Recommended 760x400px)
      </label>
      <div>
        {image && (
          <StyledImg
            src={image}
            alt="Careers Header"
            style={{ height: "100%", marginBottom: "15px", width: "100%" }}
          />
        )}
        <div>
          <input
            type="file"
            id="headerUpload"
            accept="image/png, image/jpeg, image/jpg"
            style={{ display: "none" }}
            onChange={(e) => addHeaderImage(e)}
          />
          <PermissionChecker type="edit" valid={{ marketer: true }}>
            <div
              className="button button--default button--primary"
              onClick={addHeader}
              style={{ marginRight: "10px" }}
            >
              Upload File
            </div>
            {image && (
              <div
                className="button button--default button--white"
                onClick={removeHeader}
              >
                Remove
              </div>
            )}
          </PermissionChecker>
        </div>
      </div>
    </div>
  );
};
const CareersColorPicker = ({ color, setColor }) => {
  const [hex, setHex] = useState(color);
  const [colorPicker, setColorPicker] = useState(false);

  const changeColor = (newColor) => {
    setHex(newColor.hex);
    setColor(newColor.hex);
  };
  return (
    <div>
      <label className="form-label form-heading form-heading-small">
        Careers Theme Color
      </label>
      <div>
        <ColorBox style={{ background: `${hex}` }}></ColorBox>
        <div>
          <PermissionChecker type="edit" valid={{ marketer: true }}>
            <div
              className="button button--default button--primary"
              style={{ marginBottom: "15px" }}
              onClick={() => setColorPicker(!colorPicker)}
            >
              Change Color
            </div>
          </PermissionChecker>
        </div>
        {colorPicker && (
          <TwitterPicker color={hex} onChangeComplete={changeColor} />
        )}
      </div>
    </div>
  );
};
