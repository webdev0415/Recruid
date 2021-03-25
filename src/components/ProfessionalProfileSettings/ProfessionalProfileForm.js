import React, { Component } from "react";
import PropTypes from "prop-types";
import TagsComponent from "sharedComponents/TagsComponent";
import FileUpload from "sharedComponents/FileUpload";
import ProfessionalExperienceForm from "./ProfessionalExperienceForm";
import { Media, Player, controls } from "react-media-player";
import Spinner from "sharedComponents/Spinner";
import { AWS_CDN_URL } from "constants/api";
import "./index.scss";

class ProfessionalProfileForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      experiences: [],
      previews: {},
      removedAvatar: false,
      showLoader: false,
      competencies: [],
      professionalTitle: this.props.professional.title
        ? this.props.professional.title
        : "",
      professionalDescription: this.props.professional.description
        ? this.props.professional.description
        : "",
      // resumeList: this.props.resumeList,
      editMode: false,
      editableResumeIx: null,
      selectedResumeTitle: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.triggerFileInputClick = this.triggerFileInputClick.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.appendExperience = this.appendExperience.bind(this);
    this.handleExperienceInputChange = this.handleExperienceInputChange.bind(
      this
    );

    this.handleSkillRemoveClick = this.handleSkillRemoveClick.bind(this);
    this.defaultExperienceCallback = this.defaultExperienceCallback.bind(this);
    this.handleTooLarge = this.handleTooLarge.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.checkBoxChange = this.checkBoxChange.bind(this);
    // this.renderConfirmModal = this.renderConfirmModal.bind(this);
  }

  static getDerivedStateFromProps = (props) => {
    let competencies = props.competencies;
    let experiences = props.experiences || [];

    if (experiences.length === 0) {
      experiences.push({});
    } else {
      experiences.forEach((e) => {
        if ((e.endMonth === null) & (e.endYear === null)) {
          e.currentJob = true;
        } else {
          e.currentJob = false;
        }
      });
    }

    return {
      experiences,
      competencies,
    };
  };

  handleSubmit(e) {
    e.preventDefault();
    const experiences = this.state.experiences;
    if (this.props.viewMode === "experience") {
      for (let i = 0; i < this.state.experiences.length; i++) {
        if (experiences[i].currentJob === false) {
          if (
            experiences[i].endYear === null &&
            experiences[i].endMonth === null
          ) {
            alert(`Please enter correct date range values`);
            return;
          } else if (
            experiences[i].endYear !== null &&
            experiences[i].startYear > experiences[i].endYear
          ) {
            alert(`Please enter correct date range values`);
            return;
          } else if (
            experiences[i].endYear === experiences[i].startYear &&
            experiences[i].startMonth > experiences[i].endMonth
          ) {
            alert(`Please enter correct date range values`);
            return;
          }
        } else {
          if (!experiences[i].startYear || !experiences[i].startMonth) {
            alert(`Please enter correct date range values`);
            return;
          }
        }
      }
    }
    this.setState({ showLoader: true });
    this.props.handleProfileUpdate(
      this.state.removedAvatar,
      function () {
        setTimeout(() => {
          this.setState((state) => ({
            removedAvatar: false,
            previews: { ...state.previews, avatar: null },
            showLoader: false,
          }));
        }, 500);
      }.bind(this)
    );
  }

  handleRemove(e) {
    e.preventDefault();
    this.setState({ removedAvatar: true });
  }

  handleInputChange(e) {
    const target = e.target;
    const prop = target.name;
    if (prop === "title") {
      this.setState({ professionalTitle: e.target.value });
    } else if (prop === "description") {
      this.setState({ professionalDescription: e.target.value });
    }
    const updatedValue =
      target.type === "checkbox" ? target.checked : target.value;
    this.props.handleInputChange(prop, updatedValue);
  }

  triggerFileInputClick() {
    document.getElementById("fileUploadCoverImage").click();
  }

  handleFileInputChange(e) {
    let previews = { ...this.state.previews };
    let prop = e.target.name;
    let image = e.target.files[0];
    let imageBase64 = "";
    let imageName = "";
    let fileReader = new FileReader();

    fileReader.addEventListener("load", (fileReaderEvent) => {
      imageName = image.name;
      imageBase64 = fileReaderEvent.target.result;

      // this.props.handleInputChange(prop + "_name", imageName);
      // this.props.handleInputChange(prop + "_data", imageBase64);
      if (prop === "avatar") {
        this.setState({
          previews: { ...previews, avatar: imageBase64 },
          removedAvatar: false,
        });
        this.props.setParentState({
          avatar: { avatar_name: imageName, avatar_data: imageBase64 },
        });
      } else if (prop === "cover_image") {
        this.setState({
          previews: { ...previews, cover: imageBase64 },
        });
        this.props.setParentState({
          cover: { cover_name: imageName, cover_data: imageBase64 },
        });
      }
    });

    fileReader.readAsDataURL(image);
  }

  handleExperienceInputChange(
    updatedExperience,
    callback = this.defaultExperienceCallback
  ) {
    let experiences = this.state.experiences;
    this.setState({ experiences }, () => callback());
  }

  checkBoxChange(experience, index) {
    let experiences = this.state.experiences;
    experiences[index] = experience;
    this.setState({ experiences });
  }

  handleSkillRating(e, competency, index) {
    let rating = e.target.value;
    let competencies = this.state.competencies;
    competencies[index].rating = e.target.value;
    this.setState({ competencies });
    this.props.handleSkillRating(competency, rating);
  }

  handleSkillDecrementClick(competency, index) {
    let competencies = this.state.competencies;
    competency.rating -= 1;
    competencies[index].rating = competency.rating;
    if (competency.rating < 1) {
      competencies[index].rating = 1;
    }
    this.setState({ competencies });
  }

  handleSkillIncrementClick(competency, index) {
    let competencies = this.state.competencies;
    competency.rating = Number(competency.rating) + 1;
    competencies[index].rating = competency.rating;
    if (competency.rating > 10) {
      competencies[index].rating = 10;
    }
    this.setState({ competencies });
  }

  handleSkillRemoveClick(e) {
    e.preventDefault();
    this.props.handleSkillDelete(e.target.id);
  }

  handleTooLarge(file, maxSize) {
    const maxSizeInMBs = maxSize / (1024 * 1024);
    this.props.handleValidationErrors([
      `${file.name} is larger than the maximum of ${maxSizeInMBs} MB`,
    ]);
  }

  appendExperience(e) {
    e.preventDefault();

    let experiences = this.state.experiences;
    Promise.resolve(this.setState({ experiences: [] })).then(() => {
      experiences.unshift({
        contractor: {},
        description: "",
        endMonth: null,
        endYear: null,
        id: "",
        startMonth: null,
        startYear: null,
        title: "",
      });
      this.setState({ experiences: experiences });
    });
  }

  defaultExperienceCallback() {
    this.props.handleArrayChange("experiences", this.state.experiences);
  }

  renderCoverVideo() {
    const professional = { ...this.props.professional };
    if (professional.elevatorPitch.originalUrl) {
      return this.renderVideoPlayer(professional.elevatorPitch.originalUrl, 1);
    }
  }

  renderVideoPlayer(url, id, modal = false) {
    const { PlayPause } = controls;
    return (
      <div className="profile-settings__video">
        <Media>
          <div className="media">
            {modal ? (
              <div className="media-player">
                <Player
                  defaultMuted={true}
                  vendor="video"
                  ref={"modal" + id}
                  src={url}
                />
              </div>
            ) : (
              <div className="media-player" data-target={"#modal" + id}>
                <Player
                  defaultMuted={true}
                  vendor="video"
                  ref={id}
                  src={url}
                  onClick={this.handleVideoClick}
                  data-activity-id={id}
                />
              </div>
            )}
            <div className="media-controls">
              <div className="media-control-group">
                <PlayPause className="active" />
              </div>
            </div>
          </div>
        </Media>
      </div>
    );
  }

  // cvUpload(filelist) {
  //   //parse file
  //   let files = filelist[0];
  //   let shortenedFileName =
  //     files.name.split(".")[0].slice(0, 10) + "..." + files.name.split(".")[1];
  //   const filename = files.name.split(".");
  //   //validate file size
  //   if (files.size > 5000000) {
  //     alert("File size too large, please upload file less than 5MB");
  //     document.querySelector("#cvForm").value = "";
  //     return;
  //   }
  //   // //validate file type
  //
  //   if (validTypes.indexOf(filename[filename.length - 1]) === -1) {
  //     alert("Please upload a PDF/DOC/DOCX file");
  //     return;
  //   } else {
  //     this.setState({ cv: files });
  //   }
  //
  //   let url = API_ROOT_PATH + "/v1/candidate_cvs";
  //
  //   let formData = new FormData();
  //   formData.append("candidate_cv", files);
  //   formData.append("title", files.name);
  //
  //   let session = { ...this.props.session };
  //   delete session["Content-Type"];
  //
  //   fetch(url, {
  //     method: "POST",
  //     headers: session,
  //     body: formData
  //   }).then(response => {
  //     if (response.ok) {
  //       // setTimeout(()=>{
  //       //   this.setState({uploading: 'done'})
  //       // }, 1000)
  //       response.json().then(data => {
  //         let currentResumes = this.state.resumeList;
  //         currentResumes.push({
  //           title: files.name,
  //           added_by_name: this.props.session.name,
  //           cv_url: data.cv_url
  //         });
  //         this.setState({ resumeList: currentResumes });
  //       });
  //     } else {
  //       // setTimeout(()=>{
  //       //   this.setState({uploading: false})
  //       //   document.querySelector('#cvForm').value = '';
  //       //   alert('Upload failed please try again')
  //       // }, 1000)
  //     }
  //   });
  // }

  // renderDropDownList(ix) {
  //   let list = [];
  //
  //   list.push(
  //     <li key="editPost">
  //       <a
  //         onClick={e => {
  //           this.setState({ editMode: true, editableResumeIx: ix });
  //         }}
  //       >
  //         Edit Resume Title
  //       </a>
  //     </li>
  //   );
  //   list.push(
  //     <li key="deletePost">
  //       <a
  //         onClick={e => {
  //           // let resumes = this.props.resumeList;
  //           // resumes.splice(ix, 1);
  //           // this.props.setParentState({resumeList: resumes});
  //           this.setState({
  //             selectedResumeTitle: this.props.resumeList[ix].title,
  //             selectedResumeIx: ix
  //           });
  //           window.$(`#confirmDelete`).modal("show");
  //         }}
  //       >
  //         Delete Resume
  //       </a>
  //     </li>
  //   );
  //
  //   return (
  //     <ul
  //       className="dropdown-menu dropdown-menu-right"
  //       aria-labelledby="dropdownMenu1"
  //     >
  //       {list}
  //     </ul>
  //   );
  // }

  // editCV(details) {
  //   let url;
  //   let method;
  //   if (details.mode === "edit") {
  //     url =
  //       API_ROOT_PATH +
  //       `/v1/candidate_cvs/${details.id}` +
  //       objectToUrlParams({ title: details.title });
  //     method = "PUT";
  //   } else {
  //     url = API_ROOT_PATH + `/v1/candidate_cvs/${details.id}`;
  //     method = "DELETE";
  //   }
  //   fetch(url, {
  //     method: method,
  //     headers: this.props.session
  //   }).then(response => {
  //     if (response.ok) {
  //       response.json().then(resp => {
  //         if (resp.message === "Successfully Deleted") {
  //           notify("info",[resp.message]);
  //         }
  //       });
  //     }
  //   });
  // }

  // renderConfirmModal() {
  //   return (
  //     <div id={"confirmDelete"} className="modal fade" role="dialog">
  //       <div className="modal-dialog">
  //         <div className="modal-content">
  //           <div className="modal-header">
  //             <button type="button" className="close" >
  //               &times;
  //             </button>
  //             <h4 className="modal-title">Delete Resume</h4>
  //           </div>
  //           <div className="modal-body">
  //             <p>
  //               Are you sure you want to delete {this.state.selectedResumeTitle}
  //               ?
  //             </p>
  //           </div>
  //           <div className="modal-footer">
  //             <div className="row">
  //               <div className="col-xs-6">
  //                 <button
  //                   type="button"
  //                   className="button button--default button--primary button--full"
  //                   onClick={() => {
  //                     Promise.resolve(
  //                       this.editCV({
  //                         mode: "delete",
  //                         id: this.props.resumeList[this.state.selectedResumeIx]
  //                           .id
  //                       })
  //                     ).then(() => {
  //                       setTimeout(() => {
  //                         let resumes = this.props.resumeList;
  //                         resumes.splice(this.state.selectedResumeIx, 1);
  //                         this.props.setParentState({ resumeList: resumes });
  //                         this.setState({
  //                           selectedResumeIx: null,
  //                           selectedResumeTitle: ""
  //                         });
  //                       }, 200);
  //                     });
  //                   }}
  //                 >
  //                   Delete
  //                 </button>
  //               </div>
  //               <div className="col-xs-6">
  //                 <button
  //                   type="button"
  //                   className="button button--default button--grey-light button--full"
  //                 >
  //                   Cancel
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  render() {
    let professionalAvatar = this.state.removedAvatar
      ? `${AWS_CDN_URL}/illustrations/MissingAvatar.png`
      : this.state.previews.avatar ||
        this.props.professional.avatarUrl ||
        `${AWS_CDN_URL}/illustrations/MissingAvatar.png`;
    // let professionalName = this.props.professional.name ? this.props.professional.name : ''
    // let professionalTitle = this.props.professional.title
    //   ? this.props.professional.title
    //   : "";
    // let professionalEmail = this.props.professional.email ? this.props.professional.email : ''
    // let professionalDescription = this.props.professional.description
    //   ? this.props.professional.description
    //   : "";
    // let professionalLocation = this.props.professional.location ? this.props.professional.location : ''
    let professionalCoverImage = this.state.previews.cover
      ? this.state.previews.cover
      : this.props.professional.coverImage
      ? this.props.professional.coverImage.media.thumbUrl
      : `${AWS_CDN_URL}/illustrations/MissingCoverImage.png`;
    let changeCoverImageStyle = {
      cursor: "pointer",
    };
    let professionalCoverImageStyle = {
      backgroundImage: "url(" + professionalCoverImage + ")",
    };
    return (
      <div className="">
        <div className="profile-settings__container container block-box-wrapper">
          {this.state.showLoader ? <Spinner /> : ""}
          <div className="tab-content col-md-12">
            {this.props.viewMode === "details" && (
              <div className="tab-pane in active" id="details">
                <div className="row">
                  <div className="settings__header col-md-12">
                    <h2
                      className="settings__heading"
                      onClick={() => this.setState({ viewMode: "details" })}
                    >
                      Personal Details
                    </h2>
                    <div className="right">
                      <button
                        onClick={this.handleSubmit}
                        className="button button--default button--primary"
                      >
                        {this.state.showLoader ? "Saving.." : "Save"}
                      </button>
                    </div>
                    <hr />
                  </div>
                </div>
                <div className="row">
                  <div className="settings-cover col-sm-12">
                    <div
                      className="settings-cover__button"
                      onClick={this.triggerFileInputClick}
                      style={changeCoverImageStyle}
                    >
                      <span className="cover-button">Change Cover Image</span>
                    </div>
                    <FileUpload
                      id="fileUploadCoverImage"
                      className="settings-cover__image"
                      onChange={this.handleFileInputChange}
                      onTooLarge={this.handleTooLarge}
                      name="cover_image"
                      style={professionalCoverImageStyle}
                    />
                  </div>
                  <div className="col-sm-12">
                    <img
                      className="settings-avatar"
                      src={professionalAvatar}
                      alt=""
                    />
                  </div>
                  <div className="settings-buttons col-sm-12">
                    <label
                      htmlFor="settings-avatar__button"
                      className="button settings-avatar__button button button--default button--dark"
                    >
                      Change Avatar
                    </label>
                    <FileUpload
                      id="settings-avatar__button"
                      className="settings-avatar__input"
                      onChange={this.handleFileInputChange}
                      onTooLarge={this.handleTooLarge}
                      name="avatar"
                    />
                    <button
                      className="button button--default button--white"
                      onClick={this.handleRemove}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-12">
                    <label className="form-label form-heading">
                      What do you do?
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      placeholder="Title"
                      onChange={this.handleInputChange}
                      value={this.state.professionalTitle}
                    />
                  </div>
                  <div className="col-sm-12">
                    <label className="form-label form-heading">Locations</label>
                    <TagsComponent
                      type="locations"
                      originalTags={this.props.originalLocations}
                      returnTags={(localizations_attributes) =>
                        this.props.setParentState({
                          localizations_attributes,
                        })
                      }
                    />
                  </div>
                  <div className="col-sm-12">
                    <label className="form-label form-heading">About</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="description"
                      placeholder="Description"
                      onChange={this.handleInputChange}
                      value={this.state.professionalDescription}
                    />
                  </div>
                  {/* <div className="col-md-12">
                  <label className="form-label form-heading">
                    Availability
                  </label>
                  <label className="form-input experience__item--checkbox">
                    <input
                      name="availableToHire"
                      type="checkbox"
                      className="form-checkbox"
                      onChange={this.handleInputChange}
                      checked={availableToHire}
                    />
                    Available to hire
                  </label>
                </div> */}
                  {/* <div className="col-sm-12">
                  <label className="form-label form-heading">
                    Elevator Pitch
                  </label>
                  <p>
                    Introduce yourself to recruitment agencies and employers
                    with a 60-second video pitch.
                  </p>
                  {this.renderCoverVideo()}
                  <input
                    type="file"
                    className=""
                    onChange={this.handleFileInputChange}
                    name="elevator_pitch"
                  />
                </div> */}
                  {/* <div className='col-sm-12'>
                  <label className='form-label form-heading'>Upload Resume</label>
                  <p>Improve your profile by attaching a Resume for employers to see</p>
                  <input type='file' className='' onChange={this.cvUpload} name='elevator_pitch' />
                </div> */}
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-12">
                    <div className="right">
                      <button
                        onClick={this.handleSubmit}
                        className="button button--default button--primary"
                      >
                        {this.state.showLoader ? "Saving.." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {this.props.viewMode === "industries" && (
              <div className="tab-pane in active" id="industries">
                <div className="row">
                  <div className="settings__header col-md-12">
                    <h2
                      className="settings__heading"
                      onClick={() => this.setState({ viewMode: "industries" })}
                    >
                      Industries and Skills
                    </h2>
                    <div className="right">
                      <button
                        onClick={this.handleSubmit}
                        className="button button--default button--primary"
                      >
                        {this.state.showLoader ? "Saving.." : "Save"}
                      </button>
                    </div>
                    <hr />
                  </div>
                </div>
                <div className="row">
                  <div className="settings__industries col-md-12">
                    <label className="form-label form-heading">
                      Industries
                    </label>
                    <TagsComponent
                      type="industries"
                      originalTags={this.props.originalIndustries}
                      returnTags={(categorizations_attributes) =>
                        this.props.setParentState({
                          categorizations_attributes: categorizations_attributes,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="settings__skills col-md-12">
                    <label className="form-label form-heading">Skills</label>
                    <TagsComponent
                      type="skills"
                      originalTags={this.props.originalSkills}
                      returnTags={(competencies_attributes) =>
                        this.props.setParentState({
                          competencies_attributes: competencies_attributes,
                        })
                      }
                    />
                    {this.props.professional?.competencies_attributes?.map(
                      (competency, index) => {
                        let skillName = competency.skill
                          ? competency.skill.name
                          : competency.skillAttributes.name;
                        return (
                          <div
                            key={index}
                            className="row onboarding__skill-row"
                          >
                            <div className="onboarding__skill-name col-md-8">
                              <h3>{skillName}</h3>
                              <button
                                className="button--delete"
                                id={index}
                                onClick={this.handleSkillRemoveClick}
                              >
                                Remove
                              </button>
                            </div>
                            <div className="onboarding__skill-input col-md-3 col-md-offset-1">
                              <button
                                onClick={this.handleSkillDecrementClick.bind(
                                  this,
                                  competency,
                                  index
                                )}
                                id="button-dec"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M7 14A7 7 0 1 1 7 0a7 7 0 0 1 0 14zM3 8h8a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2z"
                                    fill="#C1C3C8"
                                    fill-role="evenodd"
                                  />
                                </svg>
                              </button>
                              <input
                                onChange={(event) => {
                                  this.handleSkillRating(
                                    event,
                                    competency,
                                    index
                                  );
                                }}
                                className="form-number form-control"
                                name={skillName}
                                value={competency.rating}
                                type="number"
                                min="0"
                                max="10"
                                required
                                placeholder="0"
                              />
                              <button
                                onClick={this.handleSkillIncrementClick.bind(
                                  this,
                                  competency,
                                  index
                                )}
                                id="button-inc"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M6 6H3a1 1 0 0 0 0 2h3v3a1 1 0 0 0 2 0V8h3a1 1 0 0 0 0-2H8V3a1 1 0 0 0-2 0v3zm1 8A7 7 0 1 1 7 0a7 7 0 0 1 0 14z"
                                    fill="#C1C3C8"
                                    fill-role="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}
            {this.props.viewMode === "experience" && (
              <div className="tab-pane in active" id="experience">
                <div className="row">
                  <div className="settings__header col-md-12">
                    <h2 className="settings__heading">Experience</h2>
                    <div className="right">
                      <button
                        onClick={this.appendExperience}
                        className="button button--default button--primary settings-add__button"
                      >
                        + Add
                      </button>
                      <button
                        onClick={this.handleSubmit}
                        className="button button--default button--primary"
                      >
                        {this.state.showLoader ? "Saving.." : "Save"}
                      </button>
                    </div>
                    <hr />
                  </div>
                </div>
                {this.state.experiences.map((experience, index) => {
                  let key = index;
                  return (
                    <ProfessionalExperienceForm
                      key={key}
                      index={key}
                      experience={experience}
                      experiences={this.state.experiences}
                      companies={this.props.companies}
                      extractNames={this.extractNames}
                      handleExperienceInputChange={
                        this.handleExperienceInputChange
                      }
                      handleCompanyAddition={this.handleCompanyAddition}
                      handleCompanyDelete={this.handleCompanyDelete}
                      handleProfileUpdate={this.props.handleProfileUpdate}
                      appendExperience={this.appendExperience}
                      session={this.props.session}
                      checkBoxChange={this.checkBoxChange}
                      setParentState={this.setState.bind(this)}
                    />
                  );
                })}
              </div>
            )}
            {/*<div className="tab-pane" id="resumes">
              <div className="row">
                <div className="settings__header col-md-12">
                  <h2
                    className="settings__heading"
                    onClick={e => this.setState({ viewMode: "resumes" })}
                  >
                    Resumes
                  </h2>
                  <div className="right">
                    { <a href='' onClick={this.handleSubmit} className='button button--default button--primary'>{this.state.showLoader ? 'Saving..' : 'Save'}</a> }
                  </div>
                  <hr />
                </div>
              </div>
              <div className="row">
                {this.props.resumeList.length > 0 &&
                  this.props.resumeList.map((resume, ix) => (
                    <div
                      className="col-md-12 settings-resume-item"
                      key={`resume_${ix}`}
                    >
                      <div className="settings-resume-details">
                        <div
                          className="settings-resume-icon"
                          onClick={e => {
                            window.open(resume.cv_url);
                          }}
                        >
                        <ResumeIcon />
                        </div>
                        <div>
                          {this.state.editableResumeIx !== ix && (
                            <h4 className="settings-resume-title">
                              {resume.title}
                            </h4>
                          )}
                          {this.state.editableResumeIx === ix &&
                            this.state.editMode && (
                              <input
                                placeholder={resume.title}
                                style={{ borderRadius: "5px" }}
                                onKeyDown={e => {
                                  //If enter button is pressed
                                  if (e.keyCode === 13) {
                                    let resumes = this.props.resumeList;
                                    resumes[ix].title = e.target.value;
                                    this.props.setParentState({
                                      resumeList: resumes
                                    });
                                    this.setState({
                                      editMode: false,
                                      editableResumeIx: null
                                    });
                                    this.editCV({
                                      mode: "edit",
                                      id: resumes[ix].id,
                                      title: e.target.value
                                    });
                                  } else if (e.keyCode === 27) {
                                    //If escape button is pressed
                                    this.setState({
                                      editMode: false,
                                      editableResumeIx: null
                                    });
                                  }
                                }}
                                autoFocus
                              />
                            )}
                          <span className="settings-resume-info">
                            Added by {resume.added_by_name}
                          </span>
                        </div>
                      </div>
                      {/*}<div className="dropdown right">
                        <a
                          href=""
                          id="dropdownMenu1"
                          aria-haspopup="true"
                          aria-expanded="true"
                        >
                          <svg
                            width="16"
                            height="4"
                            viewBox="0 0 16 4"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g fill-role="nonzero" fill="#D1D2D5">
                              <circle cx="2" cy="2" r="2" />
                              <circle cx="8" cy="2" r="2" />
                              <circle cx="14" cy="2" r="2" />
                            </g>
                          </svg>
                        </a>
                        {this.renderDropDownList(ix)}
                      </div>
                      {this.renderConfirmModal()}
                    </div>*/}
            {/*<div className="col-md-12">
                  <div onDragStart={e => {}}>
                    <Dropzone
                      className="settings-resume-upload"
                      onDrop={this.cvUpload.bind(this)}
                    >
                      <p className="settings-resume-text">
                        Drag and drop a file here to add a resume to your
                        profile. <br />
                        PDF, doc, docx files allowed.
                      </p>
                    </Dropzone>
                  </div>
                </div>}
              </div>
            </div>*/}
          </div>
        </div>
      </div>
    );
  }
}

ProfessionalProfileForm.propTypes = {
  professional: PropTypes.object.isRequired,
  handleSkillRating: PropTypes.func.isRequired,
  experiences: PropTypes.array.isRequired,
};

export default ProfessionalProfileForm;
