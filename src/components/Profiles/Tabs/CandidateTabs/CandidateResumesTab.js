import React from "react";
import generalStyles from "assets/stylesheets/scss/collated/profileTabs.module.scss";
import FileReader from "sharedComponents/FileReader";
import EmptyTab from "components/Profiles/components/EmptyTab";
import { AWS_CDN_URL } from "constants/api";
const CandidateResumesTab = ({ resumes }) => {
  return (
    <EmptyTab
      data={resumes}
      title={"This candidate has no resume."}
      // copy={"Why don't you add one?"}
      // image={<img src={<EmptyActivity />}
    >
      {resumes &&
        resumes.map((cv, index) => (
          <ResumeItem key={`cv_${index}`} resume={cv} />
        ))}
    </EmptyTab>
  );
};

const ResumeItem = ({ resume }) => {
  return (
    <>
      <div className={generalStyles.resumeContainer}>
        <div className={generalStyles.resumeDetails}>
          <img src={`${AWS_CDN_URL}/icons/DocumentIcon.svg`} alt="" />
          <div className={generalStyles.noteHeader} style={{ margin: "0" }}>
            <span>{resume.title}</span>
          </div>
        </div>
        <div className={generalStyles.activityDate}>
          <a
            href={resume.candidate_cv_url}
            target="_blank"
            rel="noopener noreferrer"
            className="button button--default button--primary"
            style={{ color: "white" }}
          >
            Download
          </a>
        </div>
      </div>
      <FileReader
        rawType={resume.content_type}
        fileUrl={resume.candidate_cv_url}
      />
    </>
  );
};

export default CandidateResumesTab;
