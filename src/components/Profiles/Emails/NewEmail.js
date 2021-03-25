import React, { useState, useEffect } from "react";
import { Base64 } from "js-base64";
import styled from "styled-components";
import { sendEmail } from "./emailMethods";
import notify from "notifications";
import SelectContactModal from "modals/SelectContactModal";
import Spinner from "sharedComponents/Spinner";
import TextEditor from "sharedComponents/TextEditor";
import { AWS_CDN_URL } from "constants/api";

const Modal = {
  Wrapper: styled.div`
    bottom: 0;
    background: #fff;
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.1);
    border-radius: 4px 4px 0 0;
    display: flex;
    flex-direction: column;
    // height: 400px;
    position: fixed;
    right: 120px;
    width: 600px;
    z-index: 10;
  `,

  Header: styled.div`
    align-items: center;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    padding: 11px 20px;

    h3 {
      color: #74767b;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 1.67px;
      text-transform: uppercase;
    }
  `,

  HeaderField: styled.div`
    &.row-border {
      border-bottom: 1px solid #eee;
    }

    font-size: 15px;
    margin: 10px 0px 0;
    padding: 0px 20px;

    label {
      color: #74767b;
      margin-right: 3px;
    }

    input {
      border: none;
      margin-bottom: 10px;
      min-width: 70%;
    }
  `,

  Signature: styled.div`
    max-height: 200px;
    overflow: scroll;
    /* * {
      all: unset;
    } */
    /* height: auto;
    display: inline-block;
    span {
      display: inline-block;
    } */
  `,

  Footer: styled.div`
    align-items: center;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;

    div label {
      margin-left: 10px;
    }
  `,
};

const { Wrapper, Header, HeaderField, Signature, Footer } = Modal;

export default function NewEmail({
  tnProfile,
  gmailUser,
  companyId,
  closeModal,
  session,
  modalData,
  sendEmailCallback,
  receiverId,
  receiverType,
  otherReceiver,
  handleIncludeSignatureUpdate,
}) {
  const emailReceiver = useState(tnProfile?.tn_email || otherReceiver || "");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [replyData, setReplyData] = useState({});
  const [emailLoader, setEmailLoader] = useState(false);
  const [selectedContact, setSelectedContact] = useState(undefined);
  const [activeModal, setActiveModal] = useState(undefined);

  useEffect(() => {
    return () => setReplyData({});
  }, []);

  useEffect(() => {
    if (modalData) {
      let { subject, ...restData } = modalData;
      setReplyData({ ...restData });
      if (subject.slice(0, 7) === "Re: Re:") {
        setEmailSubject(subject.slice(4));
      } else setEmailSubject(subject);
    }
  }, [modalData]);

  const validateAndPost = () => {
    if (emailLoader) return false;
    if (!!emailMessage.length && !!emailSubject.length) {
      return submitEmailSend(emailSubject, emailMessage);
    }
    return notify("danger", "Email and subject fields are required.");
  };

  const submitEmailSend = (emailSubject, emailMessage) => {
    let message = emailMessage;
    if (gmailUser?.include_signature && gmailUser?.signature) {
      message = message.concat(`<br/>${gmailUser?.signature}`);
    }
    const preview = emailMessage.split(" ").splice(0, 16).join(" ");
    const encodedEmail = Base64.encodeURI(message);
    if (
      receiverType === "Company" &&
      (!selectedContact || !selectedContact.email)
    ) {
      return notify("danger", "You must select a contact to email them");
    }
    const emailBody = {
      google_message: {
        from: gmailUser.email,
        // to: emailReceiver[0],
        subject: emailSubject,
        email_body: encodedEmail,
        active_company: companyId,
        preview,
        ...replyData,
      },
      gmail_user_id: gmailUser.id,
      receiver_id: selectedContact?.id || receiverId,
      receiver_type: receiverType === "Company" ? "DealContact" : receiverType,
    };

    sendEmail(emailBody, session, setEmailLoader).then((data) => {
      if (data === "Success") {
        setTimeout(() => {
          sendEmailCallback();
          notify("info", "Email has been successfully sent.");
          setEmailLoader(false);
        }, 1750);
      }
    });
  };

  const handleSubjectChange = (e) => setEmailSubject(e.target.value);
  return (
    <>
      <Wrapper>
        <Header>
          <h3>Email</h3>
          <button onClick={closeModal}>
            <img src={`${AWS_CDN_URL}/icons/CloseModal.svg`} alt="Close" />
          </button>
        </Header>
        <HeaderField className="row-border">
          <label>To: </label>
          <input
            type="text"
            value={emailReceiver[0] || selectedContact?.email}
            readOnly={true}
          />
          {receiverType === "Company" && (
            <ContactButton onClick={() => setActiveModal("contact-select")}>
              Select Contact
            </ContactButton>
          )}
        </HeaderField>
        <HeaderField>
          <label>Subject: </label>
          <input
            type="text"
            value={emailSubject}
            onChange={(e) => handleSubjectChange(e)}
          />
        </HeaderField>
        <TextContainer>
          <TextEditor
            returnState={(body) => setEmailMessage(body)}
            placeholder="Enter text..."
            // initialBody={gmailUser?.include_signature ? gmailUser?.signature : ""}
            maxHeight="profile-email"
          />
          {gmailUser?.include_signature && (
            <Signature
              dangerouslySetInnerHTML={{
                __html: gmailUser?.include_signature
                  ? gmailUser?.signature
                  : "",
              }}
            />
          )}
        </TextContainer>
        <Footer>
          <div>
            <input
              id="gmail-include-signature"
              type="checkbox"
              // value={gmailUser?.include_signature}
              checked={gmailUser?.include_signature}
              onChange={handleIncludeSignatureUpdate(session, gmailUser.id)}
            />
            <label htmlFor="gmail-include-signature">
              Include your signature in emails
            </label>
          </div>
          {emailLoader && (
            <Spinner style={{ marginRight: "20px", padding: "20px" }} />
          )}
          <button
            className="button button--default button--blue-dark"
            onClick={() => validateAndPost()}
          >
            Send
          </button>
        </Footer>
      </Wrapper>
      {activeModal === "contact-select" &&
        receiverId &&
        receiverType === "Company" && (
          <SelectContactModal
            show={true}
            hide={() => setActiveModal(undefined)}
            clientCompanyId={receiverId}
            setEmailContact={setSelectedContact}
          />
        )}
    </>
  );
}

const ContactButton = styled.button`
  padding: 5px 10px;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.04),
    inset 0 0 0 1px rgba(0, 0, 0, 0.05);
`;

const TextContainer = styled.div`
  // max-height: calc(100vh - 200px);
  // overflow: auto;
  position: relative;
`;
