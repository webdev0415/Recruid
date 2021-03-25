import React, { useState, useEffect } from "react";
import notify from "notifications";
import UniversalModal, {
  ModalBody,
  MinimalHeader,
} from "modals/UniversalModal/UniversalModal";
import styled from "styled-components";
import { CAREERS_PORTAL_URL } from "constants/api";
import { AWS_CDN_URL } from "constants/api";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookMessengerShareButton,
  EmailShareButton,
  WhatsappShareButton,
} from "react-share";
// import { vendorIndex } from "components/Vendors/helpers/vendorsHelpers";
import { FACEBOOK_APP_ID } from "constants/api";

const ShareJobSocialModal = ({ hide, job, company }) => {
  const [jobUrl, setJobUrl] = useState("");

  useEffect(() => {
    if (company && job) {
      setJobUrl(
        `${CAREERS_PORTAL_URL}/${company.mention_tag}/${job.title_slug}`
      );
    }
  }, [company, job]);
  const fallbackCopyTextToClipboard = (text) => {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      if (successful) {
        notify("info", "URL successfully copied");
      } else {
        notify("danger", "Unable to copy URL");
      }
    } catch (err) {
      notify("danger", "Unable to copy URL");
    }

    document.body.removeChild(textArea);
  };
  const copyTextToClipboard = (text) => {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        notify("info", "URL successfully copied");
      },
      function () {
        notify("danger", "Unable to copy URL");
      }
    );
  };

  return (
    <UniversalModal show={true} hide={hide} id="share-job-social" width={480}>
      <MinimalHeader title="Share this Job" hide={hide} />
      <STModalBody className="no-footer">
        <IconsContainer>
          <IconWrapper>
            <LinkedinShareButton
              url={jobUrl}
              title={job.title}
              source="Careers Portal"
            >
              <img
                src={`${AWS_CDN_URL}/icons/LinkedinShareIcon.svg`}
                alt="LinkedinShareIcon"
              />
            </LinkedinShareButton>
          </IconWrapper>
          <IconWrapper>
            <TwitterShareButton url={jobUrl} title={job.title}>
              <img
                src={`${AWS_CDN_URL}/icons/TwitterShareIcon.svg`}
                alt="TwitterShareIcon"
              />
            </TwitterShareButton>
          </IconWrapper>
          <IconWrapper>
            <FacebookShareButton url={jobUrl} quote="">
              <img
                src={`${AWS_CDN_URL}/icons/FacebookShareIcon.svg`}
                alt="FacebookShareIcon"
              />
            </FacebookShareButton>
          </IconWrapper>
          <IconWrapper>
            <WhatsappShareButton
              url={jobUrl}
              title={job.title}
              separator=""
              windowWidth={830}
              windowHeight={600}
            >
              <img
                src={`${AWS_CDN_URL}/icons/WhatsappShareIcon.svg`}
                alt="WhatsappShareIcon"
              />
            </WhatsappShareButton>
          </IconWrapper>
          <IconWrapper>
            <FacebookMessengerShareButton
              url={jobUrl}
              title={job.title}
              separator=""
              appId={FACEBOOK_APP_ID}
            >
              <img
                src={`${AWS_CDN_URL}/icons/MessengerShareIcon.svg`}
                alt="MessengerShareIcon"
              />
            </FacebookMessengerShareButton>
          </IconWrapper>
          <IconWrapper>
            <EmailShareButton url={jobUrl} subject="" body="" separator="">
              <img
                src={`${AWS_CDN_URL}/icons/EmailShareIcon.svg`}
                alt="EmailShareIcon"
              />
            </EmailShareButton>
          </IconWrapper>
        </IconsContainer>
        <Text>Or copy Link</Text>
        <FalseInput>
          <span>{jobUrl}</span>
          <button onClick={() => copyTextToClipboard(jobUrl)}>Copy</button>
        </FalseInput>
      </STModalBody>
    </UniversalModal>
  );
};

export default ShareJobSocialModal;

const STModalBody = styled(ModalBody)`
  padding: 30px 20px 30px 30px !important;
`;

const IconsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  width: max-content;
  margin-bottom: 20px;
`;

const IconWrapper = styled.div`
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eeeeee;
  border-radius: 50%;
`;

const Text = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #2a3744;
  margin-bottom: 10px;
`;

const FalseInput = styled.div`
  background: #ffffff;
  border: 1px solid #dfdfdf;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-weight: 600;
    font-size: 10px;
    line-height: 12px;
    color: #2a3744;
    max-width: 350px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    white-space: nowrap;
  }
  button {
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;

    color: #35c3ae;
  }
`;
