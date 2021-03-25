import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { Player } from "video-react";
import { MentionsInput, Mention } from "react-mentions";
import { extractMentions } from "helpers/helper";
import { getSignedUrl } from "helpersV2/aws";
import { COLORS } from "constants/style";

import AvatarIcon from "sharedComponents/AvatarIcon";

import { API_ROOT_PATH } from "constants/api";
import { objectToUrlParams } from "helpers/helper";
import { AWS_CDN_URL } from "constants/api";

import UniversalModal, {
  ModalBody,
} from "modals/UniversalModal/UniversalModal";
import styled from "styled-components";
import notify from "notifications";
import Spinner from "sharedComponents/Spinner";

class ActivityPostBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: { body: "" },
      medias: [],
      awsMedias: [],
      documents: [],
      awsDocuments: [],
      previews: [],
      disableImages: true,
      disableVideos: true,
      disableFiles: true,
      currentAuthorIndex: 0,
      awsUploadInProcess: false,
      typing: false,
      typingTimeOut: 0,
    };

    this.renderPreviews = this.renderPreviews.bind(this);
    this.renderPreviewImage = this.renderPreviewImage.bind(this);
    this.handleFilesDrop = this.handleFilesDrop.bind(this);
    this.handlePostChange = this.handlePostChange.bind(this);
    this.handleChangeEvent = this.handleChangeEvent.bind(this);
    this.handleRemovePreview = this.handleRemovePreview.bind(this);
    this.handleImageDropZoneShow = this.handleImageDropZoneShow.bind(this);
    this.handleVideoDropZoneShow = this.handleVideoDropZoneShow.bind(this);
    this.handleFileDropZoneShow = this.handleFileDropZoneShow.bind(this);
    this.handlePostCreate = this.handlePostCreate.bind(this);
    this.handleAuthorClick = this.handleAuthorClick.bind(this);
    this.handleDocumentsDrop = this.handleDocumentsDrop.bind(this);
    this.handleRemoveDocument = this.handleRemoveDocument.bind(this);
    this.urlify = this.urlify.bind(this);
    this.getLinkPreviewData = this.getLinkPreviewData.bind(this);
    this.clearLinkPreviewData = this.clearLinkPreviewData.bind(this);
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  handlePostChange(prop, data) {
    let post = { ...this.state.post };
    post[prop] = data;
    this.setState({ post });
  }

  handleFilesDrop(files) {
    let medias = [...this.state.medias];
    let previews = [...this.state.previews];

    this.setState({ previews: previews.concat(files) });

    for (let file of files) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        let fileBase64 = fileReader.result;
        medias.push({ mediaFileName: file.name, media: fileBase64 });
        this.setState({ medias });
      };
      this.setState({ awsUploadInProcess: true });
      getSignedUrl(
        file.name,
        file.type,
        file,
        function (success, filename) {
          let medias = [...this.state.medias];
          let awsMedias = [...this.state.awsMedias];
          awsMedias.push({ media_url: `temp/${filename}` });
          this.setState({ awsMedias });
          if (awsMedias.length === medias.length) {
            this.setState({ awsUploadInProcess: false });
            return awsMedias;
          }
        }.bind(this)
      );
    }
  }

  handleDocumentsDrop(files) {
    let documents = [...this.state.documents];

    for (let file of files) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        let fileBase64 = fileReader.result;
        documents.push({ mediaFileName: file.name, media: fileBase64 });
        this.setState({ documents });
      };
      this.setState({ awsUploadInProcess: true });
      getSignedUrl(
        file.name,
        file.type,
        file,
        function (success, filename) {
          let documents = [...this.state.documents];
          let awsDocuments = [...this.state.awsDocuments];
          awsDocuments.push({ media_url: `temp/${filename}`, name: file.name });
          this.setState({ awsDocuments });
          if (awsDocuments.length === documents.length) {
            this.setState({ awsUploadInProcess: false });
            return awsDocuments;
          }
        }.bind(this)
      );
    }
  }

  handleChangeEvent(e, newValue) {
    const self = this;
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      typing: false,
      typingTimeout: setTimeout(function () {
        self.getLinkPreviewData(self.state.post.body);
      }, 1000),
    });
    this.handlePostChange("body", newValue);
  }

  onKeyPressed(e) {
    if (e.keyCode === 32 || e.keyCode === 9) {
      this.getLinkPreviewData(this.state.post.body);
    }
  }

  urlify(text) {
    var url = text.match(/\bhttps?:\/\/\S+/gi);
    var urlWWW = text.match(/\www.\S+/gi);
    if (typeof url !== "undefined" && url !== "" && url !== null) {
      return url[0];
    } else if (
      typeof urlWWW !== "undefined" &&
      urlWWW !== "" &&
      urlWWW !== null
    ) {
      return "http://" + urlWWW[0];
    } else {
      return "";
    }
  }

  getLinkPreviewData(newValue) {
    //Fetch data
    var link = this.urlify(newValue);
    if (link !== "") {
      //call api
      var data = { url: link };
      var url =
        API_ROOT_PATH + "/v1/posts/link_preview" + objectToUrlParams(data);
      fetch(url, {
        method: "GET",
        headers: this.props.session,
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((json) => {
              this.setState({ linkData: json });
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  handlePostCreate(event) {
    event.preventDefault();

    if (this.state.awsUploadInProcess) {
      return notify("danger", "Please wait while we upload your files.");
    }

    let post = { ...this.state.post };
    // let mediasTotal = [...this.state.medias]
    let medias = [...this.state.awsMedias];
    let documents = [...this.state.awsDocuments];
    var meta_data = this.state.linkData;
    if (meta_data !== "undefined") {
      post.meta_data = meta_data;
      if (post.body === "" && meta_data) {
        post.body = meta_data.link_url;
      }
    }

    // const authors = [this.props.session].concat(this.props.ownedCompanies);
    // const author = authors[this.state.currentAuthorIndex];

    if (
      post.body.replace(/\n/g, "") !== "" ||
      medias.length ||
      documents.length
    ) {
      post.post_images_attributes = medias;
      post.post_documents_attributes = documents;
      // this.setState( {blockActivityBox : true })
      this.props.handlePostCreate(post);
    }
  }

  handleImageDropZoneShow(e) {
    e.preventDefault();
    this.setState({
      disableImages: false,
      disableVideos: true,
      disableFiles: true,
    });
  }

  handleVideoDropZoneShow(e) {
    e.preventDefault();
    this.setState({
      disableVideos: false,
      disableImages: true,
      disableFiles: true,
    });
  }

  handleFileDropZoneShow(e) {
    e.preventDefault();
    this.setState({
      disableFiles: false,
      disableVideos: true,
      disableImages: true,
    });
  }

  handleRemovePreview(e) {
    let medias = [...this.state.medias];
    let previews = [...this.state.previews];

    medias.splice(e.target.name, 1);
    previews.splice(e.target.name, 1);

    this.setState({ medias, previews });
  }

  handleRemoveDocument(index) {
    let documentsCopy = [...this.state.documents];
    let awsDocumentsCopy = [...this.state.awsDocuments];
    documentsCopy.splice(index, 1);
    awsDocumentsCopy.splice(index, 1);
    this.setState({ documents: documentsCopy, awsDocuments: awsDocumentsCopy });
  }

  handleAuthorClick(index) {
    this.setState({ currentAuthorIndex: index });
  }

  renderPreviews() {
    let previews = [...this.state.previews];
    let renderedPreviews = [];

    if (previews.length === 1) {
      let file = previews[0];

      return file.type === "video/mp4" ? (
        <div className="feed-postbox__preview">
          <Player src={file.preview} defaultMuted={true}></Player>
        </div>
      ) : (
        this.renderPreviewImage(file.preview)
      );
    }

    previews.map((file, index) =>
      renderedPreviews.push(this.renderPreviewImage(file.preview, index))
    );

    return renderedPreviews;
  }

  renderPreviewImage(src, index = 0) {
    return (
      <div
        key={index}
        onClick={this.handleRemovePreview}
        className="feed-postbox__uploaded"
      >
        <img className="feed-postbox__image" name={index} src={src} alt="" />
      </div>
    );
  }

  clearLinkPreviewData() {
    this.setState({ linkData: undefined });
  }

  renderLinkPreview() {
    var html = "";
    var imageUrl;
    if (typeof this.state.linkData !== "undefined") {
      if (
        this.state.linkData.description !== null &&
        this.state.linkData.title !== null &&
        this.state.linkData.link_url !== null
      ) {
        if (
          typeof this.state.linkData.image_url !== "undefined" &&
          this.state.linkData.image_url !== "" &&
          this.state.linkData.image_url !== null
        ) {
          if (
            this.state.linkData.image_url &&
            this.state.linkData.image_url.indexOf("http") >= 0
          ) {
            imageUrl = this.state.linkData.image_url;
          } else {
            imageUrl =
              this.state.linkData.link_url + this.state.linkData.image_url;
          }

          html = (
            <div className="activity-feed__post link-preview-data-div">
              <div className="post-body__preview">
                <button
                  className="post-body__preview--remove"
                  onClick={this.clearLinkPreviewData}
                ></button>
                <a
                  target="_blank"
                  href={this.state.linkData.link_url}
                  rel="noopener noreferrer"
                >
                  <img height="200" src={imageUrl} alt="Preview" />
                  <div className="desc">
                    {this.state.linkData.description}
                    <span className="link">{this.state.linkData.link_url}</span>
                  </div>
                </a>
              </div>
            </div>
          );
        } else {
          html = (
            <div className="activity-feed__post">
              <div className="post-body__preview">
                <button
                  className="post-body__preview--remove"
                  onClick={this.clearLinkPreviewData}
                ></button>
                <a
                  target="_blank"
                  href={this.state.linkData.link_url}
                  rel="noopener noreferrer"
                >
                  <div className="desc">
                    {this.state.linkData.description}
                    <span className="link">{this.state.linkData.link_url}</span>
                  </div>
                </a>
              </div>
            </div>
          );
        }
      }
    }
    return html;
  }

  render() {
    // const authors = [this.props.session].concat(this.props.ownedCompanies);

    var buttonHtml = (
      <div className="feed-postbox__actions">
        <FileTypeButton
          className={!this.state.disableImages ? "activeType" : ""}
          onClick={(event) => this.handleImageDropZoneShow(event)}
          type="file"
        >
          <i className="fas fa-images"></i>
          Add Photo
        </FileTypeButton>
        <FileTypeButton
          className={!this.state.disableVideos ? "activeType" : ""}
          onClick={(event) => this.handleVideoDropZoneShow(event)}
        >
          <i className="fas fa-video"></i>
          Add Video
        </FileTypeButton>
        <FileTypeButton
          className={!this.state.disableFiles ? "activeType" : ""}
          onClick={(event) => this.handleFileDropZoneShow(event)}
        >
          <i className="fas fa-file-pdf"></i>
          Add PDF
        </FileTypeButton>
      </div>
    );

    if (typeof this.state.linkData !== "undefined") {
      buttonHtml = (
        <div className="feed-postbox__actions">
          <FileTypeButton
            id="add-img-btn"
            className={!this.state.disableImages ? "activeType" : ""}
          >
            <i className="fas fa-images"></i>
            Add Photo
          </FileTypeButton>
          <FileTypeButton
            id="add-vid-btn"
            className={!this.state.disableVideos ? "activeType" : ""}
          >
            <i className="fas fa-video"></i>
            Add Video
          </FileTypeButton>
          <FileTypeButton
            id="add-file-btn"
            className={!this.state.disableFiles ? "activeType" : ""}
          >
            <i className="fas fa-file-pdf"></i>
            Add File
          </FileTypeButton>
        </div>
      );
    }

    return (
      <UniversalModal
        show={true}
        hide={this.props.hide}
        id="activity-modal"
        width={620}
      >
        <ModalBody className="no-footer no-header">
          <BodyContainer className="activity-feed__postbox-container">
            <div className="activity-feed__postbox">
              {!!this.props.company && (
                <div className="activity-feed__avatar">
                  <AvatarIcon
                    name={this.props.company.name}
                    className="activity-feed__avatar--image post-avatar"
                    size={40}
                    imgUrl={this.props.company.avatar_url}
                  />
                </div>
              )}
              <MentionsInput
                className="feed-postbox"
                id="post_text_body"
                value={this.state.post.body}
                placeholder="What are you and your team working on?"
                onKeyDown={(e) => this.onKeyPressed(e)}
                onChange={this.handleChangeEvent}
              >
                <Mention
                  trigger="@"
                  className="feed-postbox__highlight"
                  data={extractMentions([])}
                />
              </MentionsInput>
            </div>
            <div className="feed-postbox__footer">
              <div className="row">
                <div className="col-md-12">{buttonHtml}</div>
              </div>
              {this.renderLinkPreview()}
            </div>
            <div className="row">
              <div className="feed-postbox__uploads col-md-12">
                {!this.state.disableImages && (
                  <Dropzone
                    accept="image/*"
                    onDrop={this.handleFilesDrop}
                    className="feed-postbox__uploader"
                    disabled={this.state.disableImages}
                    disabledClassName="hidden"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g fill="#A8ABB1" fill-role="evenodd">
                        <path d="M8 0h4v20H8z" />
                        <path d="M0 8h20v4H0z" />
                      </g>
                    </svg>
                  </Dropzone>
                )}
                {!this.state.disableVideos && (
                  <Dropzone
                    accept="video/*, video/x-m4v, video/webm, video/x-ms-wmv, video/x-msvideo, video/3gpp, video/flv, video/x-flv, video/mp4, video/quicktime, video/mpeg, video/ogv, .ts, .mkv"
                    multiple={false}
                    onDrop={this.handleFilesDrop}
                    className="feed-postbox__uploader"
                    disabled={this.state.disableVideos}
                    disabledClassName="hidden"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g fill="#A8ABB1" fill-role="evenodd">
                        <path d="M8 0h4v20H8z" />
                        <path d="M0 8h20v4H0z" />
                      </g>
                    </svg>
                  </Dropzone>
                )}
                {!this.state.disableFiles && (
                  <Dropzone
                    accept=".pdf"
                    // ".doc, .pdf, .docx, application/octet-stream’,  ‘application/msword’,  ‘application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    multiple={false}
                    onDrop={this.handleDocumentsDrop}
                    className="feed-postbox__uploader"
                    disabled={this.state.disableFiles}
                    disabledClassName="hidden"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g fill="#A8ABB1" fill-role="evenodd">
                        <path d="M8 0h4v20H8z" />
                        <path d="M0 8h20v4H0z" />
                      </g>
                    </svg>
                  </Dropzone>
                )}
                {this.renderPreviews()}
                {this.state.awsDocuments.map((doc, index) => (
                  <DocHolder
                    key={`doc-holder-${index}`}
                    onClick={() => this.handleRemoveDocument(index)}
                    className="feed-postbox__uploaded"
                  >
                    <img src={`${AWS_CDN_URL}/icons/DocumentIcon.svg`} alt="" />
                    <span>{doc.name}</span>
                  </DocHolder>
                ))}
              </div>
            </div>
          </BodyContainer>
          <div className="modal-footer">
            <div className="modal-buttons row">
              <div
                className={"col-md-6" + " leo-flex"}
                style={{ alignItems: "center" }}
              >
                {this.state.awsUploadInProcess ? (
                  <>
                    <Spinner inline size="sm" style={{ marginRight: "10px" }} />
                    <div>Please wait, We are uploading files...</div>
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className="text-right col-md-6">
                <button
                  className="button button--post"
                  onClick={this.handlePostCreate}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </ModalBody>
      </UniversalModal>
    );
  }
}

const BodyContainer = styled.div`
  padding: 15px;
`;

const DocHolder = styled.div.attrs((props) => ({
  className: (props.className || "") + " leo-flex-center-center",
}))`
  width: 100px;
  border: 2px solid #a8abb1;
  border-radius: 4px;
  flex-direction: column;

  span {
    overflow: hidden;
    width: 100%;
    text-align: left;
    padding-left: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const FileTypeButton = styled.button`
  margin-right: 10px;
  background: ${COLORS.dark_3};
  border-radius: 4px;
  padding: 5px 10px;
  color: ${COLORS.white};
  i {
    margin-right: 5px;
  }
  &.activeType {
    background-color: ${COLORS.dark_2};
  }
`;

export default ActivityPostBox;
