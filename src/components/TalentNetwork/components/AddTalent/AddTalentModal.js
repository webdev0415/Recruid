import React from "react";
import UniversalModal, {
  ModalBody,
  ModalHeaderClassic,
  ModalFooter,
} from "modals/UniversalModal/UniversalModal";
import Dropzone from "react-dropzone";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import styled from "styled-components";

import helpers from "./helpers/addTalentHelpers";

import { AddTalentTable } from "./AddTalentTable";
import PlatformInvites from "./PlatformInvites";
import ManualAddition from "./ManualAddition/ManualAddition";
import styles from "./style/addTalentModal.module.scss";
import "react-circular-progressbar/dist/styles.css";
import { AWS_CDN_URL } from "constants/api";

const ResumeText = styled.div`
  margin: auto;

  & p {
    justify-self: center;
    margin-left: 25px !important;
  }
`;

const ErrorList = styled.ul`
  margin: auto;
  margin-top: 20px;

  & span {
    color: #f27881;
    font-size: 10px;
  }

  & li {
    margin-bottom: 15px;
  }
`;

const LoaderContainer = styled.div`
  max-width: 150px;
  margin: 50px auto;
`;

const ParsedError = styled.p`
  font-size: 12px;
  margin: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
`;

export default class AddTalentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMode: "initial",
      cv: [],
      error: null,
      loading: false,
      requestCount: 0,
      addedProfessionals: [],
      triggerBatchUpdate: false,
    };
    this.validateFile = this.validateFile.bind(this);
    this.validateAndUpload = this.validateAndUpload.bind(this);
  }

  componentDidMount() {
    if (this.props.parentFiles) {
      this.setState({ viewMode: "upload", loading: true });
      this.validateAndUpload(this.props.parentFiles);
    }
  }

  validateFile(fileList) {
    //parse file
    const validTypes = ["pdf", "docx", "doc"];
    let cvs = [];
    for (let i in fileList) {
      let file = fileList[i];
      if (!file) return;
      const filename = file.name.split(".");
      //validate file size
      if (file.size > 5000000) {
        return alert(
          "Could not add " +
            file.name +
            ", File size too large, please upload file less than 5MB"
        );
        // document.querySelector('#cvForm').value = '';
      }
      //validate file type
      if (validTypes.indexOf(filename[filename.length - 1]) === -1) {
        alert(
          "Could not add " + file.name + ", Please upload a PDF/DOC/DOCX file"
        );
        // document.querySelector('#cvForm').value = '';
      } else {
        cvs.push(file);
      }
    }
    this.setState({ cv: cvs }, () => this.cvUpload());
  }

  cvUpload() {
    if (this.state.cv.length === 0) {
      return;
      // alert("Please attach a resume to proceed");
    } else {
      // let parsedCorrectly = 0;
      // let parsedIncorrectly = 0;
      const recursiveCvUpload = (index, cvsLeft) => {
        if (cvsLeft === 0 || index === this.state.cv.length) return;
        cvsLeft--;
        index++;
        let cv = this.state.cv[index];
        if (!cv) return;
        let formData = new FormData();
        formData.append("candidate_cv", cv);
        formData.append("title", cv.name);
        formData.append("company_id", this.props.companyId);
        formData.append(
          "team_member_id",
          this.props.teamMember && this.props.teamMember.team_member_id
            ? this.props.teamMember.team_member_id
            : this.props.session.id
        );
        let session = { ...this.props.session };
        delete session["Content-Type"];
        //Initiate loader
        this.setState({ loading: true });

        //Request CV's for parsing
        helpers
          .uploadCV(formData, session)
          .then((response) => {
            if (response && response.professional) {
              //Concatenate professional into TN Table
              let newPro = response.professional;
              newPro.selected = false;
              this.setState({
                addedProfessionals: [...this.state.addedProfessionals, newPro],
              });
              // parsedCorrectly++;
            } else {
              //Set error to CV that failed
              let cvs = this.state.cv;
              cvs[index].error = response.message;
              this.setState({ cv: cvs, error: true });
              // parsedIncorrectly++;
            }
            //Increment count relative to how many requests have gone through for percentage completed
            let count = this.state.requestCount;
            count++;
            this.setState({ requestCount: count });
            //Close modal if all CV's were successful. if not, remain in the view with the failed CV's displaying errors
            if (count === this.state.cv.length) {
              if (!this.state.error) {
                setTimeout(() => {
                  this.setState({ loading: false });
                  this.setState({ viewMode: "table" });
                }, 750);
              } else {
                //Set error to CV that failed
                // let cvs = [];
                // this.state.cv.forEach(cv => {
                //   if (cv.error) cvs.push(cv);
                // });
                // this.setState({
                //   cv: cvs,
                //   error: true,
                //   requestCount: this.state.cv.length
                // });
                if (this.state.cv.every((cv) => cv.error)) {
                  setTimeout(() => {
                    this.setState({ loading: false });
                  }, 750);
                } else {
                  setTimeout(() => {
                    this.setState({ viewMode: "table" });
                  }, 750);
                }
              }
            }
            recursiveCvUpload(index, cvsLeft);
          })
          .catch(() => recursiveCvUpload(index, cvsLeft));
      };

      recursiveCvUpload(-1, this.state.cv.length);
    }
  }

  uploadPercentage() {
    return Math.floor((this.state.requestCount / this.state.cv.length) * 100);
  }

  validateAndUpload(fileList) {
    this.validateFile(fileList);
  }

  setParentsViewMode = (payload) => this.setState({ viewMode: payload });

  render() {
    return (
      <UniversalModal
        show={true}
        hide={this.props.closeModal}
        id={"confirmStatus"}
        width={
          this.state.viewMode === `professionals` ||
          this.state.viewMode === `table` ||
          this.state.viewMode === `manual`
            ? 960
            : 460
        }
      >
        <ModalHeaderClassic
          title="Add Talent"
          closeModal={this.props.closeModal}
        />
        <STModalBody
          className={this.state.viewMode !== "table" ? "no-footer" : ""}
        >
          {this.state.error && this.state.viewMode === "table" && (
            <ParsedError>
              Not all resumes were parsed, please check the list below to see
              the successful parses.
            </ParsedError>
          )}
          {this.state.viewMode === "initial" && (
            <React.Fragment>
              <div className={styles.modalImport}>
                <img
                  src={`${AWS_CDN_URL}/illustrations/add-talent-illustration.svg`}
                  alt="Import Professionals"
                />
                <button
                  className="button button--default button--primary"
                  onClick={() => this.setState({ viewMode: "upload" })}
                  style={{ marginBottom: "10px" }}
                >
                  Upload Candidate Resumes
                </button>
                <button
                  className="button button--default button--blue-dark"
                  onClick={() => this.setState({ viewMode: "manual" })}
                >
                  Create Candidates Manually
                </button>
                {/*}<div style={{ textAlign: "center" }}>
                      or{" "}
                      <button
                        className={styles.viewProfessionals}
                        onClick={() => {
                          this.setState({ viewMode: "professionals" });
                        }}
                        style={{ margin: 0, padding: 0 }}
                      >
                        view Professionals on Leo
                      </button>
                    </div>*/}
              </div>
            </React.Fragment>
          )}
          {this.state.viewMode === "professionals" && (
            <PlatformInvites
              closeModal={this.props.closeModal}
              companyId={this.props.companyId}
              session={this.props.session}
              concatInvitedProfessionals={this.props.concatInvitedProfessionals}
            />
          )}
          {this.state.viewMode === "upload" && (
            <React.Fragment>
              <div className={styles.modalUpload}>
                {this.state.cv.length === 0 ? (
                  <Dropzone
                    className={styles.resumeUpload}
                    // onDrop={this.validateFile}
                    onDrop={this.validateAndUpload}
                  >
                    <p className="settings-resume-text">
                      Drag and drop a file here to add a resume to your Talent
                      Network. <br />
                      PDF, doc, docx files allowed.
                    </p>
                  </Dropzone>
                ) : !this.state.loading ? (
                  !this.state.error ? (
                    <ResumeText className="leo-flex-center">
                      <span>
                        <img src={`${AWS_CDN_URL}/icons/ResumeErrorIcon.svg`} alt="" />
                      </span>
                      <p className="text-center">
                        {this.state.cv.length === 1
                          ? "1 Resume Added"
                          : `${this.state.cv.length} Resumes Added`}
                      </p>
                    </ResumeText>
                  ) : (
                    <>
                      <ResumeText className="leo-flex-center">
                        <p className="text-center">
                          {this.state.cv.length === 1
                            ? "1 resume was not added"
                            : `${this.state.cv.length} resumes were not added`}
                        </p>
                      </ResumeText>
                      <ErrorList>
                        {this.state.cv.map((cv, index) => (
                          <li key={`${cv.name}-${index}`}>
                            {cv.name}
                            <span>{cv.error}</span>
                          </li>
                        ))}
                      </ErrorList>
                    </>
                  )
                ) : (
                  <LoaderContainer>
                    <CircularProgressbar
                      value={this.uploadPercentage()}
                      maxValue={100}
                      minValue={0}
                      text={`${this.uploadPercentage()}%`}
                      styles={buildStyles({
                        textSize: "16px",
                        pathColor: "#00cba7",
                        textColor: "#1e1e11",
                        trailColor: "#eee",
                      })}
                    />
                  </LoaderContainer>
                )}
              </div>
            </React.Fragment>
          )}
          {this.state.viewMode === "manual" && (
            <ManualAddition
              closeModal={this.props.closeModal}
              session={this.props.session}
              company={this.props.company}
              setParentsViewMode={this.setParentsViewMode}
              setShouldUpdate={this.props.setShouldUpdate}
            />
          )}
          {this.state.viewMode === "table" && (
            <AddTalentTable
              closeModal={this.props.closeModal}
              addedProfessionals={this.state.addedProfessionals}
              setAddedProfessionals={(addedProfessionals) =>
                this.setState({ addedProfessionals })
              }
              session={this.props.session}
              concatInvitedProfessionals={this.props.concatInvitedProfessionals}
              triggerBatchUpdate={this.state.triggerBatchUpdate}
            />
          )}
        </STModalBody>
        {this.state.viewMode === "table" && (
          <ModalFooter hide={this.props.closeModal} cancelText="Cancel">
            <button
              className="button button--default button--blue-dark"
              onClick={() => this.setState({ triggerBatchUpdate: true })}
            >
              Finish
            </button>
          </ModalFooter>
        )}
      </UniversalModal>
    );
  }
}

const STModalBody = styled(ModalBody)`
  max-height: 700px;
  overflow: auto;
`;
