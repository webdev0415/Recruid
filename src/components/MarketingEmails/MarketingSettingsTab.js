import React, { useState, useEffect } from "react";
import notify from "notifications";
import styled from "styled-components";
import TextEditor from "sharedComponents/TextEditor";
import { ATSContainer } from "styles/PageContainers";
import { PermissionChecker } from "constants/permissionHelpers";
import {
  DetailsTabContainer,
  Title,
  SubTitle,
  HeaderWrapper,
} from "components/TeamView/Customisation/sharedComponents";
import {
  fetchMarketingSettings,
  updateMarketingSettings,
  fetchCreateMarketingSettings,
} from "helpersV2/marketing/settings";
import { uploadFile } from "helpersV2/marketing/documents";

const MarketingCareersPortalTab = ({ store, permission }) => {
  const [image, setImage] = useState(undefined);
  const [imagePreview, setImagePreview] = useState(undefined);
  const [imageFile, setImageFile] = useState(undefined);
  const [footerBody, setFooterBody] = useState(undefined);
  const [settings, setSettings] = useState(undefined);
  const [initialFooter, setInitialFooter] = useState(undefined);
  const [updateFooter, setUpdateFooter] = useState(false);
  useEffect(() => {
    if (store.session && store.company && permission.view) {
      fetchMarketingSettings(store.session, store.company.id).then((res) => {
        if (!res.err && Object.keys(res).length > 0) {
          setSettings(res);
          setImage(res.marketing_logo);
          setInitialFooter({ text: res.email_footer });
        } else {
          setSettings(false);
          // notify("danger", "Unable to fetch marketing settings");
        }
      });
    }
  }, [store.session, store.company, permission]);

  const updateFunction = (...props) => {
    if (settings) {
      return updateMarketingSettings(...props);
    } else {
      return fetchCreateMarketingSettings(...props);
    }
  };

  useEffect(() => {
    if (initialFooter !== undefined) {
      setUpdateFooter(Math.random());
    }
  }, [initialFooter]);

  const removeHeader = () => {
    if (imageFile) {
      setImageFile(undefined);
      setImagePreview(undefined);
    } else {
      updateFunction(store.session, store.company.id, {
        marketing_logo: null,
        company_id: store.company.id,
      }).then((res) => {
        if (!res.err) {
          notify("info", "Logo updated succesfully");
          setImagePreview(undefined);
          setImageFile(undefined);
          setImage(res.marketing_logo);
        } else {
          notify("danger", "Unable to update logo");
        }
      });
    }
  };

  const removeFooter = () => {
    setInitialFooter({ text: "" });
  };

  const addHeaderImage = (e) => {
    let file = e.target.files[0];
    if (!file) {
      return notify("danger", "Please upload a file");
    }
    if (file.size < 5000000) {
      // setHeader(e.target.files[0]);
      setImageFile(e.target.files[0]);
      let headerReader = new FileReader();
      // let result;
      headerReader.addEventListener(
        "load",
        function () {
          setImagePreview(headerReader.result);
        },
        false
      );
      headerReader.readAsDataURL(file);
    } else {
      return notify("danger", "File is too big");
    }
  };

  const triggerImageSave = () => {
    if (imageFile) {
      uploadImageFile().then((res) => {
        if (res && res.status === "ok") {
          updateFunction(store.session, store.company.id, {
            marketing_logo: res.document.url,
            company_id: store.company.id,
          }).then((res) => {
            if (!res.err) {
              notify("info", "Logo updated succesfully");
              setImagePreview(undefined);
              setImageFile(undefined);
              setImage(res.marketing_logo);
            } else {
              notify("danger", "Unable to update logo");
            }
          });
        } else {
          notify("danger", "Something went wrong uploading this file");
        }
      });
    } else {
      notify("danger", "No image to upload");
    }
  };

  const triggerSaveFooter = () => {
    updateFunction(store.session, store.company.id, {
      email_footer: footerBody,
      company_id: store.company.id,
    }).then((res) => {
      if (!res.err) {
        notify("info", "Footer updated succesfully");
      } else {
        notify("danger", "Unable to update footer");
      }
    });
  };
  const uploadImageFile = () => {
    if (!imageFile) return notify("danger", "No new image to save");
    let formData = new FormData();
    formData.append("document", imageFile);
    formData.append("title", imageFile.name);
    let currentSession = { ...store.session };
    delete currentSession["Content-Type"];

    return uploadFile(currentSession, formData);
  };

  return (
    <ATSContainer>
      <DetailsTabContainer>
        <HeaderWrapper>
          <Title>Marketing Settings</Title>
          <SubTitle>Set a logo and signature for outgoing emails</SubTitle>
        </HeaderWrapper>
        <SubTitle>Email Header Logo</SubTitle>
        <HeaderImageWrapper className="d-flex">
          <div>
            <ImageLabel
              htmlFor="headerUpload"
              className="leo-flex-center-center"
            >
              {imagePreview || image ? (
                <StyledImg src={imagePreview || image} alt="Careers Header" />
              ) : (
                <PermissionChecker type="edit" valid={{ marketer: true }}>
                  <UploadBox>
                    <div className="button button--default button--white">
                      Upload
                    </div>
                  </UploadBox>
                </PermissionChecker>
              )}
            </ImageLabel>
            <span style={{ color: "grey", fontSize: 12, marginBottom: 15 }}>
              Recommended 100px x 30px
            </span>
            <div className="d-flex">
              <UploadBox>
                <input
                  type="file"
                  id="headerUpload"
                  name="headerUpload"
                  accept="image/png, image/jpeg, image/jpg"
                  style={{ display: "none" }}
                  onChange={(e) => addHeaderImage(e)}
                />
              </UploadBox>
              <PermissionChecker type="edit" valid={{ marketer: true }}>
                <button
                  className="button button--default button--primary"
                  style={{ marginRight: "10px" }}
                  onClick={triggerImageSave}
                >
                  Save
                </button>
                {(imagePreview || image) && (
                  <button
                    className="button button--default button--grey-light"
                    onClick={removeHeader}
                  >
                    Remove
                  </button>
                )}
              </PermissionChecker>
            </div>
          </div>
          {/* <EmailPreviewWrapper>
            <div className="email-body">
              <div className="email-header">
                <div className="company-logo">
                  {imagePreview || image || store.company?.avatar_url ? (
                    <StyledImg
                      src={imagePreview || image || store.company?.avatar_url}
                      alt="Careers Header"
                    />
                  ) : (
                    <div className="image-placeholder">Your Logo Here</div>
                  )}
                </div>
              </div>
            </div>
          </EmailPreviewWrapper> */}
        </HeaderImageWrapper>
        <SubTitle>Email Footer</SubTitle>

        <TextEditor
          returnState={(body) => setFooterBody(body)}
          placeholder="Start typing..."
          initialBody={initialFooter?.text}
          updateFromParent={updateFooter}
          addImageOption={true}
        />
        <span
          style={{
            color: "grey",
            fontSize: 12,
            marginBottom: 5,
            marginTop: 10,
          }}
        >
          This is an example footer, you can use this area to upload anything
          from your address to inspirational quotes.{" "}
        </span>
        <span style={{ color: "grey", fontSize: 12, marginBottom: 15 }}>
          <em>
            “The People Crazy Enough to Think They Can Change the World Are the
            Ones Who Do” - Steve Jobs
          </em>
        </span>
        <PermissionChecker type="edit" valid={{ marketer: true }}>
          <div className="d-flex" style={{ marginTop: "15px" }}>
            <button
              className="button button--default button--primary"
              style={{ marginRight: "10px" }}
              onClick={() => triggerSaveFooter(footerBody)}
            >
              Save
            </button>
            <button
              className="button button--default button--grey-light"
              onClick={removeFooter}
            >
              Clear
            </button>
          </div>
        </PermissionChecker>
      </DetailsTabContainer>
    </ATSContainer>
  );
};

export default MarketingCareersPortalTab;

const StyledImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
  max-width: 100px;
  max-height: 30px;
`;

const UploadBox = styled.div`
  // height: 100%;
`;

const ImageLabel = styled.label`
  border: solid #eee 1px;
  border-radius: 4px;
  cursor: pointer;
  height: 70px;
  margin-bottom: 15px;
  width: 200px;
`;

const HeaderImageWrapper = styled.div`
  border-bottom: solid #eee 1px;
  margin-bottom: 30px;
  padding-bottom: 30px;
`;
